"""Durable SMTP outbox. No email is sent without explicit server configuration."""
import json
import os
import smtplib
import ssl
import time
from email.message import EmailMessage


def initialize(connection):
    connection.execute('''CREATE TABLE IF NOT EXISTS mail_jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT, complaint INTEGER NOT NULL UNIQUE,
      recipient TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pendiente', attempts INTEGER NOT NULL DEFAULT 0,
      next_attempt REAL NOT NULL DEFAULT 0, sent_at TEXT NOT NULL DEFAULT '',
      FOREIGN KEY(complaint) REFERENCES complaints(sequence))''')


def configured():
    return bool(os.environ.get('NARANTHA_SMTP_HOST') and os.environ.get('NARANTHA_SMTP_USER') and os.environ.get('NARANTHA_SMTP_PASSWORD') and os.environ.get('NARANTHA_MAIL_FROM'))


def queue_copy(connection, record):
    consumer = record['consumer']
    if not consumer['email']:
        return
    provider, purchase = record['provider'], record['purchase']
    amount = 'No precisado' if purchase['amount'] is None else f"S/ {purchase['amount'] / 100:.2f}"
    lines = ['LIBRO DE RECLAMACIONES — HOJA DE RECLAMACIÓN', record['code'], 'Fecha: ' + record['created'], 'Establecimiento web: NAR-WEB',
             f"Proveedor: {provider['tradeName']} · RUC {provider['ruc']}", provider['address'], provider['email'],
             '1. IDENTIFICACIÓN DEL CONSUMIDOR', consumer['name'], f"{consumer['documentType']} {consumer['document']}", 'Domicilio: ' + consumer['address'],
             'Teléfono: ' + (consumer['phone'] or 'No precisado'), 'Correo: ' + consumer['email'], 'Respuesta solicitada: ' + consumer['replyVia']]
    if consumer['minor']:
        representative = consumer['representative']
        lines += ['Representante del menor:', representative['name'], representative['document'], representative['address'], representative['phone'], representative['email']]
    lines += ['2. BIEN CONTRATADO', purchase['type'], purchase['description'], 'Monto reclamado: ' + amount, 'Pedido o comprobante: ' + (purchase['order'] or 'No precisado'),
              '3. RECLAMACIÓN Y PEDIDO', record['kind'], record['detail'], 'Pedido del consumidor:', record['request'],
              '4. OBSERVACIONES Y ACCIONES ADOPTADAS POR EL PROVEEDOR', 'Registro recibido. Pendiente de atención y respuesta del proveedor.',
              'Plazo máximo de respuesta: 15 días hábiles, improrrogables. Esta copia no reemplaza la respuesta del proveedor.',
              'Reclamo: disconformidad relacionada con productos o servicios. Queja: malestar relacionado con la atención al público.',
              'La presentación de esta hoja no limita otras vías de solución ni inicia por sí sola un procedimiento sancionador ante Indecopi.', 'CONSUMIDOR — Copia de hoja virtual.']
    connection.execute('INSERT INTO mail_jobs (complaint,recipient,subject,body) VALUES (?,?,?,?)', (record['sequence'], consumer['email'], f"Narantha — Hoja de reclamación {record['code']}", '\n'.join(lines)))


def deliver_one(connect, sender=None):
    if sender is None and not configured():
        return False
    with connect() as connection:
        connection.execute('BEGIN IMMEDIATE')
        job = connection.execute("SELECT * FROM mail_jobs WHERE status IN ('pendiente','reintentar') AND next_attempt<=? AND attempts<5 ORDER BY id LIMIT 1", (time.time(),)).fetchone()
        if not job:
            return False
        connection.execute("UPDATE mail_jobs SET status='enviando',attempts=attempts+1 WHERE id=?", (job['id'],))
    try:
        if sender:
            sender(dict(job))
        else:
            message = EmailMessage()
            message['From'] = os.environ['NARANTHA_MAIL_FROM']
            message['To'] = job['recipient']
            message['Subject'] = job['subject']
            message['Message-ID'] = f"<narantha-claim-{job['complaint']}@narantha.com>"
            message['Reply-To'] = 'contacto@narantha.com'
            message.set_content(job['body'])
            mode = os.environ.get('NARANTHA_SMTP_MODE', 'starttls')
            if mode not in ['starttls', 'ssl']:
                raise ValueError('SMTP seguro requerido')
            port = int(os.environ.get('NARANTHA_SMTP_PORT', '465' if mode == 'ssl' else '587'))
            cls = smtplib.SMTP_SSL if mode == 'ssl' else smtplib.SMTP
            kwargs = {'context': ssl.create_default_context()} if mode == 'ssl' else {}
            with cls(os.environ['NARANTHA_SMTP_HOST'], port, timeout=20, **kwargs) as client:
                if mode == 'starttls':
                    client.starttls(context=ssl.create_default_context())
                client.login(os.environ['NARANTHA_SMTP_USER'], os.environ['NARANTHA_SMTP_PASSWORD'])
                client.send_message(message)
        with connect() as connection:
            connection.execute("UPDATE mail_jobs SET status='enviado',sent_at=datetime('now') WHERE id=?", (job['id'],))
    except Exception:
        # Do not persist SMTP error text: it may include credentials or personal data.
        with connect() as connection:
            connection.execute("UPDATE mail_jobs SET status=?,next_attempt=? WHERE id=?", ('fallido' if job['attempts'] >= 4 else 'reintentar', time.time() + min(3600, 60 * 2 ** job['attempts']), job['id']))
    return True


def worker(connect, stop):
    while not stop.is_set():
        try:
            delivered = deliver_one(connect)
        except Exception:
            delivered = False
        stop.wait(1 if delivered else 20)
