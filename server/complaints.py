"""Integrated consumer complaints: durable records and printable copies."""
import mail_jobs
import hashlib
import json
import re
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

BUSINESS_FILE = Path(__file__).resolve().parent.parent / 'assets' / 'business.json'
STATUSES = ['recibido', 'en_atencion', 'respondido']


def business():
    data = json.loads(BUSINESS_FILE.read_text())
    data['claimsAvailable'] = bool(data.get('legalName') and re.fullmatch(r'\d{11}', data.get('ruc', '')) and data.get('address') and data.get('addressConfirmed'))
    return data


def initialize(connection):
    connection.executescript('''
    CREATE TABLE IF NOT EXISTS complaints (
      sequence INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE, created TEXT NOT NULL, provider TEXT NOT NULL,
      consumer TEXT NOT NULL, purchase TEXT NOT NULL, kind TEXT NOT NULL,
      detail TEXT NOT NULL, request TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'recibido', response TEXT NOT NULL DEFAULT '',
      response_date TEXT NOT NULL DEFAULT '', delivery_evidence TEXT NOT NULL DEFAULT '',
      request_key TEXT NOT NULL UNIQUE, fingerprint TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS complaint_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT, complaint INTEGER NOT NULL,
      created TEXT NOT NULL, status TEXT NOT NULL, response TEXT NOT NULL,
      response_date TEXT NOT NULL, evidence TEXT NOT NULL,
      FOREIGN KEY(complaint) REFERENCES complaints(sequence));
    ''')


def field(data, key, limit, required=False):
    value = data.get(key, '')
    if not isinstance(value, str) or len(value) > limit or (required and not value.strip()):
        raise ValueError('Revisa ' + key)
    return value.strip()


def public_record(row):
    record = dict(row)
    for key in ['provider', 'consumer', 'purchase']:
        record[key] = json.loads(record[key])
    for key in ['request_key', 'fingerprint']:
        record.pop(key, None)
    record['responsePeriod'] = '15 días hábiles, improrrogables'
    return record


def create(data, connect, lock):
    provider = business()
    if not provider['claimsAvailable']:
        return 503, {'error': 'El registro no está habilitado: falta completar la identificación del proveedor.'}
    key = field(data, 'requestKey', 80, True)
    if not re.fullmatch(r'[a-zA-Z0-9-]{16,80}', key):
        raise ValueError('Identificador inválido')
    fingerprint = hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()
    source = data.get('consumer')
    purchase = data.get('purchase')
    if not isinstance(source, dict) or not isinstance(purchase, dict):
        raise ValueError('Datos inválidos')
    consumer = {name: field(source, name, limit, required) for name, limit, required in [
        ('name', 150, True), ('documentType', 30, True), ('document', 30, True),
        ('address', 300, True), ('phone', 30, False), ('email', 150, False), ('replyVia', 20, True)]}
    if consumer['documentType'] not in ['DNI', 'CE', 'Pasaporte', 'Otro']:
        raise ValueError('Tipo de documento inválido')
    if consumer['documentType'] == 'DNI' and not re.fullmatch(r'\d{8}', consumer['document']):
        raise ValueError('El DNI debe tener 8 dígitos')
    if consumer['email'] and not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', consumer['email']):
        raise ValueError('Correo inválido')
    if consumer['phone'] and not re.fullmatch(r'[+0-9 ()-]{7,30}', consumer['phone']):
        raise ValueError('Teléfono inválido')
    if consumer['replyVia'] != 'email' or not consumer['email']:
        raise ValueError('Indica dónde recibirás la respuesta')
    if type(source.get('minor', False)) is not bool:
        raise ValueError('Dato de menor inválido')
    consumer['minor'] = source.get('minor', False)
    if consumer['minor']:
        if not isinstance(source.get('representative'), dict):
            raise ValueError('Faltan datos del representante')
        consumer['representative'] = {name: field(source.get('representative', {}), name, limit, required) for name, limit, required in [
            ('name', 150, True), ('document', 30, True), ('address', 300, True), ('phone', 30, False), ('email', 150, False)]}
    purchase_clean = {'type': field(purchase, 'type', 20, True), 'description': field(purchase, 'description', 1500, True), 'order': field(purchase, 'order', 100)}
    if purchase_clean['type'] not in ['producto', 'servicio']:
        raise ValueError('Identifica el bien o servicio')
    amount = purchase.get('amount')
    if amount is not None and (type(amount) is not int or not 0 <= amount <= 100000000):
        raise ValueError('Monto inválido')
    purchase_clean['amount'] = amount
    kind = field(data, 'kind', 20, True)
    if kind not in ['reclamo', 'queja']:
        raise ValueError('Selecciona reclamo o queja')
    detail, request = field(data, 'detail', 4000, True), field(data, 'request', 4000, True)
    created = datetime.now(ZoneInfo('America/Lima')).isoformat()
    provider.pop('claimsAvailable')
    with lock, connect() as connection:
        existing = connection.execute('SELECT * FROM complaints WHERE request_key=?', (key,)).fetchone()
        if existing:
            if existing['fingerprint'] != fingerprint:
                return 409, {'error': 'El contenido cambió. Revisa los datos antes de registrar otra hoja.'}
            record = public_record(existing)
            mail = connection.execute('SELECT status FROM mail_jobs WHERE complaint=?', (record['sequence'],)).fetchone()
            record['emailCopy'] = mail['status'] if mail else 'no_solicitada'
            return 200, {'complaint': record}
        cursor = connection.execute('INSERT INTO complaints (created,provider,consumer,purchase,kind,detail,request,request_key,fingerprint) VALUES (?,?,?,?,?,?,?,?,?)', (created, json.dumps(provider), json.dumps(consumer), json.dumps(purchase_clean), kind, detail, request, key, fingerprint))
        sequence = cursor.lastrowid
        code = f'NAR-WEB-{sequence:08d}'
        connection.execute('UPDATE complaints SET code=? WHERE sequence=?', (code, sequence))
        record = public_record(connection.execute('SELECT * FROM complaints WHERE sequence=?', (sequence,)).fetchone())
        mail_jobs.queue_copy(connection, record)
        record['emailCopy'] = 'pendiente' if consumer['email'] else 'no_solicitada'
    return 201, {'complaint': record}


def list_records(connect):
    with connect() as connection:
        rows = connection.execute('SELECT * FROM complaints ORDER BY sequence DESC').fetchall()
        records = []
        for row in rows:
            record = public_record(row)
            mail = connection.execute('SELECT status,attempts,sent_at FROM mail_jobs WHERE complaint=?', (record['sequence'],)).fetchone()
            record['emailCopy'] = dict(mail) if mail else {'status': 'no_solicitada'}
            records.append(record)
    return {'complaints': records, 'statuses': STATUSES, 'emailConfigured': mail_jobs.configured()}


def update(data, connect, lock):
    code = field(data, 'code', 40, True)
    status = field(data, 'status', 20, True)
    response = field(data, 'response', 6000)
    response_date = field(data, 'responseDate', 10)
    evidence = field(data, 'deliveryEvidence', 1000)
    if status not in STATUSES:
        raise ValueError('Estado inválido')
    if response_date:
        parsed = datetime.strptime(response_date, '%Y-%m-%d').date()
        if parsed > datetime.now(ZoneInfo('America/Lima')).date():
            raise ValueError('Fecha futura inválida')
    if status == 'respondido' and not all([response, response_date, evidence]):
        return 400, {'error': 'Para marcar respondido, registra la respuesta, la fecha y la referencia de la constancia de envío.'}
    with lock, connect() as connection:
        row = connection.execute('SELECT sequence,created FROM complaints WHERE code=?', (code,)).fetchone()
        if not row:
            return 404, {'error': 'Hoja no encontrada'}
        if response_date and response_date < row['created'][:10]:
            return 400, {'error': 'La respuesta no puede ser anterior al registro.'}
        connection.execute('INSERT INTO complaint_history (complaint,created,status,response,response_date,evidence) VALUES (?,?,?,?,?,?)', (row['sequence'], datetime.now(ZoneInfo('America/Lima')).isoformat(), status, response, response_date, evidence))
        connection.execute('UPDATE complaints SET status=?,response=?,response_date=?,delivery_evidence=? WHERE code=?', (status, response, response_date, evidence, code))
    return 200, {'ok': True}
