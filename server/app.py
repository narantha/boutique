"""Narantha store server. Python 3.9+, standard library only."""
import complaints
import mail_jobs
import hmac
import json
import os
import secrets
import sqlite3
import threading
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parent.parent
DB = Path(os.environ.get('NARANTHA_DB', str(ROOT / 'server' / 'data' / 'store.sqlite3')))
TOKEN = os.environ.get('NARANTHA_ADMIN_TOKEN', '')
LOCK = threading.Lock()
CATALOG = {
    'dulce': {'name': 'Dulce', 'price': 12000, 'colors': ['Rojo', 'Negro', 'Verde petróleo', 'Celeste', 'Vino', 'Beis', 'Blanco'], 'sizes': ['Estándar (referencial M/L)']},
    'josy': {'name': 'Josy', 'price': 9000, 'colors': ['Beis', 'Verde petróleo', 'Verde oliva'], 'sizes': ['Estándar (S–M)']},
    'yismi': {'name': 'Yismi', 'price': 12000, 'colors': ['Nude', 'Terracota', 'Cacao'], 'sizes': ['M', 'L']},
    'lorena': {'name': 'Lorena', 'price': 12000, 'colors': [''], 'sizes': ['']},
    'priscila': {'name': 'Priscila', 'price': 12000, 'colors': ['Guinda', 'Verde lima', 'Azul noche', 'Beige', 'Celeste', 'Vino', 'Amarillo bajito', 'Verde petróleo', 'Palo rosa', 'Rojo', 'Blanco', 'Negro', 'Fucsia'], 'sizes': ['Estándar (referencial M/L)']},
}
STATUSES = ['solicitado', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado']


def connect():
    connection = sqlite3.connect(DB)
    connection.row_factory = sqlite3.Row
    connection.execute('PRAGMA foreign_keys=ON')
    return connection


def initialize():
    DB.parent.mkdir(parents=True, exist_ok=True)
    with connect() as connection:
        connection.executescript('''
        CREATE TABLE IF NOT EXISTS variants (
          product TEXT NOT NULL, color TEXT NOT NULL, size TEXT NOT NULL,
          stock INTEGER CHECK(stock IS NULL OR stock >= 0),
          PRIMARY KEY(product,color,size));
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY, created TEXT NOT NULL, status TEXT NOT NULL,
          customer TEXT NOT NULL, items TEXT NOT NULL, subtotal INTEGER NOT NULL,
          delivery TEXT NOT NULL, shipping INTEGER, notes TEXT NOT NULL DEFAULT '',
          payment TEXT NOT NULL DEFAULT 'pendiente', request_key TEXT UNIQUE NOT NULL,
          request_hash TEXT NOT NULL);
        ''')
        complaints.initialize(connection)
        mail_jobs.initialize(connection)
        for product, details in CATALOG.items():
            for color in details['colors']:
                for size in details['sizes']:
                    connection.execute('INSERT OR IGNORE INTO variants VALUES (?,?,?,NULL)', (product, color, size))
    os.chmod(DB, 0o600)


def text_field(data, name, limit, required=False):
    value = data.get(name, '')
    if not isinstance(value, str) or len(value) > limit or (required and not value.strip()):
        raise ValueError('Revisa el campo ' + name)
    return value.strip()


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *args):
        pass  # Avoid recording customer data, URLs or authorization values.

    def end_headers(self):
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'same-origin')
        self.send_header('X-Frame-Options', 'DENY')
        super().end_headers()

    def reply(self, status, payload):
        encoded = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def authorized(self):
        return len(TOKEN) >= 32 and hmac.compare_digest(self.headers.get('Authorization', ''), 'Bearer ' + TOKEN)

    def do_GET(self):
        path = unquote(urlsplit(self.path).path)
        if path == '/api/business':
            self.reply(200, complaints.business())
        elif path == '/api/admin/complaints':
            if not self.authorized():
                return self.reply(401, {'error': 'Acceso no autorizado'})
            self.reply(200, complaints.list_records(connect))
        elif path == '/api/catalog':
            with connect() as connection:
                variants = [dict(row) for row in connection.execute('SELECT * FROM variants')]
            self.reply(200, {'products': CATALOG, 'variants': variants})
        elif path == '/api/admin/orders':
            if not self.authorized():
                return self.reply(401, {'error': 'Acceso no autorizado. Configura una clave administrativa de al menos 32 caracteres.'})
            with connect() as connection:
                rows = connection.execute('SELECT * FROM orders ORDER BY created DESC LIMIT 500').fetchall()
            orders = []
            for row in rows:
                order = dict(row)
                for key in ['customer', 'items']:
                    order[key] = json.loads(order[key])
                order.pop('request_key')
                order.pop('request_hash')
                orders.append(order)
            self.reply(200, {'orders': orders, 'statuses': STATUSES})
        elif path.startswith('/api/'):
            self.reply(404, {'error': 'Ruta no encontrada'})
        elif any(part.startswith('.') or part == 'server' for part in Path(path).parts):
            self.send_error(404)
        else:
            target = Path(self.translate_path(path)).resolve()
            if target != ROOT and ROOT not in target.parents or any(part.startswith('.') or part == 'server' for part in target.relative_to(ROOT).parts) or target.is_dir() and not (target / 'index.html').is_file():
                return self.send_error(404)
            super().do_GET()

    def do_HEAD(self):
        path = unquote(urlsplit(self.path).path)
        target = Path(self.translate_path(path)).resolve()
        if ROOT not in target.parents or any(part.startswith('.') or part == 'server' for part in target.relative_to(ROOT).parts):
            return self.send_error(404)
        super().do_HEAD()

    def do_POST(self):
        origin = self.headers.get('Origin')
        if origin and urlsplit(origin).netloc != self.headers.get('Host'):
            return self.reply(403, {'error': 'Origen no permitido'})
        if self.headers.get('Content-Type', '').split(';')[0] != 'application/json':
            return self.reply(415, {'error': 'Se requiere JSON'})
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= 65536:
                return self.reply(413, {'error': 'Solicitud demasiado grande'})
            data = json.loads(self.rfile.read(length))
            if not isinstance(data, dict):
                raise ValueError('Solicitud inválida')
            path = unquote(urlsplit(self.path).path)
            if path == '/api/complaints':
                status, result = complaints.create(data, connect, LOCK)
                self.reply(status, result)
            elif path == '/api/checkout':
                data['checkout'] = 'cod'
                self.create_order(data)
            elif path == '/api/orders':
                self.create_order(data)
            elif path.startswith('/api/admin/'):
                if not self.authorized():
                    return self.reply(401, {'error': 'Acceso no autorizado'})
                if path == '/api/admin/complaint':
                    status, result = complaints.update(data, connect, LOCK)
                    self.reply(status, result)
                else:
                    self.update_admin(path, data)
            else:
                self.reply(404, {'error': 'Ruta no encontrada'})
        except (ValueError, TypeError, KeyError):
            self.reply(400, {'error': 'Revisa los campos obligatorios y el formato de los datos.'})
        except sqlite3.Error:
            self.reply(503, {'error': 'No pudimos guardar los cambios. Intenta nuevamente.'})

    def create_order(self, data):
        import hashlib
        import re
        request_key = text_field(data, 'requestKey', 80, True)
        if not re.fullmatch(r'[a-zA-Z0-9-]{16,80}', request_key):
            raise ValueError()
        request_hash = hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()
        customer = data.get('customer')
        if not isinstance(customer, dict) or data.get('consent') is not True:
            raise ValueError()
        cleaned = {'name': text_field(customer, 'name', 100, True), 'phone': text_field(customer, 'phone', 20, True), 'email': text_field(customer, 'email', 150)}
        if not re.fullmatch(r'[+0-9 ()-]{7,20}', cleaned['phone']):
            raise ValueError()
        if cleaned['email'] and not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', cleaned['email']):
            raise ValueError()
        delivery = data.get('delivery')
        if delivery not in ['shipping', 'pickup']:
            raise ValueError()
        if delivery == 'shipping':
            for name, limit in [('region', 80), ('district', 120), ('address', 250)]:
                cleaned[name] = text_field(customer, name, limit, True)
        cod = data.get('checkout') == 'cod'
        shipping_cost = 0 if delivery == 'pickup' else None
        if cod:
            shipping_config = json.loads((ROOT / 'assets/shipping.json').read_text())
            method = data.get('paymentMethod')
            if method not in shipping_config['paymentMethods']:
                raise ValueError('Método de pago inválido')
            if delivery == 'shipping':
                matches = [zone for zone in shipping_config['zones'] if zone['region'] == cleaned['region'] and cleaned['district'] in zone['districts']]
                if len(matches) != 1:
                    return self.reply(400, {'error': 'El destino no tiene cobertura de contra entrega.'})
                shipping_cost = matches[0]['fee']
            cleaned['paymentMethod'] = method
        notes = text_field(data, 'notes', 500)
        items = data.get('items')
        if not isinstance(items, list) or not 1 <= len(items) <= 30:
            raise ValueError()
        normalized, seen, subtotal = [], set(), 0
        with LOCK, connect() as connection:
            existing = connection.execute('SELECT id,subtotal,request_hash FROM orders WHERE request_key=?', (request_key,)).fetchone()
            if existing:
                if existing['request_hash'] != request_hash:
                    return self.reply(409, {'error': 'La solicitud cambió. Actualiza y revisa tus datos.'})
                saved = connection.execute('SELECT status,shipping,customer FROM orders WHERE id=?', (existing['id'],)).fetchone()
                return self.reply(200, {'id': existing['id'], 'subtotal': existing['subtotal'], 'shipping': saved['shipping'], 'total': existing['subtotal'] + (saved['shipping'] or 0), 'status': saved['status'], 'payment': 'pendiente', 'paymentMethod': json.loads(saved['customer']).get('paymentMethod'), 'deliveryHours': 48 if cod else None})
            for line in items:
                if not isinstance(line, dict):
                    raise ValueError()
                product, color, size, qty = line.get('id'), line.get('color'), line.get('size'), line.get('qty')
                if product not in CATALOG or not isinstance(color, str) or not isinstance(size, str) or type(qty) is not int or not 1 <= qty <= 10:
                    raise ValueError()
                key = (product, color, size)
                if key in seen:
                    raise ValueError()
                seen.add(key)
                variant = connection.execute('SELECT stock FROM variants WHERE product=? AND color=? AND size=?', key).fetchone()
                if variant is None:
                    raise ValueError()
                if cod and (variant['stock'] is None or not color or not size):
                    return self.reply(409, {'error': 'Debemos confirmar existencias y variantes de ' + CATALOG[product]['name'] + ' antes de aceptar la compra. Retira esta prenda o consulta a contacto@narantha.com.'})
                if variant['stock'] is not None and variant['stock'] < qty:
                    return self.reply(409, {'error': 'La cantidad solicitada de ' + CATALOG[product]['name'] + ' no está disponible.'})
                price = CATALOG[product]['price']
                subtotal += price * qty
                normalized.append({'id': product, 'name': CATALOG[product]['name'], 'color': color, 'size': size, 'qty': qty, 'price': price})
            if cod and (type(data.get('expectedTotal')) is not int or data['expectedTotal'] != subtotal + shipping_cost):
                return self.reply(409, {'error': 'El total cambió. Actualiza la página y revisa tu pedido antes de confirmar.'})
            if cod:
                for line in normalized:
                    connection.execute('UPDATE variants SET stock=stock-? WHERE product=? AND color=? AND size=?', (line['qty'], line['id'], line['color'], line['size']))
            identifier = 'NAR-' + secrets.token_hex(6).upper()
            connection.execute('INSERT INTO orders (id,created,status,customer,items,subtotal,delivery,shipping,notes,request_key,request_hash) VALUES (?,?,?,?,?,?,?,?,?,?,?)', (identifier, datetime.now(timezone.utc).isoformat(), 'confirmado' if cod else 'solicitado', json.dumps(cleaned), json.dumps(normalized), subtotal, delivery, shipping_cost, notes, request_key, request_hash))
        self.reply(201, {'id': identifier, 'subtotal': subtotal, 'shipping': shipping_cost, 'total': subtotal + (shipping_cost or 0), 'status': 'confirmado' if cod else 'solicitado', 'payment': 'pendiente', 'paymentMethod': cleaned.get('paymentMethod'), 'deliveryHours': 48 if cod else None})

    def update_admin(self, path, data):
        with LOCK, connect() as connection:
            if path == '/api/admin/inventory':
                stock = data.get('stock')
                if stock is not None and (type(stock) is not int or not 0 <= stock <= 10000):
                    raise ValueError()
                cursor = connection.execute('UPDATE variants SET stock=? WHERE product=? AND color=? AND size=?', (stock, data.get('product'), data.get('color'), data.get('size')))
                if not cursor.rowcount:
                    raise ValueError()
            elif path == '/api/admin/order':
                status = data.get('status')
                if status not in STATUSES:
                    raise ValueError()
                shipping = data.get('shipping')
                if shipping is not None and (type(shipping) is not int or not 0 <= shipping <= 100000):
                    raise ValueError()
                payment = data.get('payment')
                if payment not in ['pendiente', 'verificado', 'reembolsado']:
                    raise ValueError()
                row = connection.execute('SELECT * FROM orders WHERE id=?', (data.get('id'),)).fetchone()
                if row is None:
                    raise ValueError()
                if row['status'] == 'cancelado' and status != 'cancelado':
                    return self.reply(409, {'error': 'Una solicitud cancelada no se puede reabrir. Crea otra solicitud.'})
                active = ['confirmado', 'preparando', 'enviado', 'entregado']
                if row['status'] == 'solicitado' and status in active:
                    for line in json.loads(row['items']):
                        key = (line['id'], line['color'], line['size'])
                        variant = connection.execute('SELECT stock FROM variants WHERE product=? AND color=? AND size=?', key).fetchone()
                        if variant['stock'] is None or variant['stock'] < line['qty']:
                            connection.rollback()
                            return self.reply(409, {'error': 'Define existencias suficientes de todas las variantes antes de confirmar.'})
                        connection.execute('UPDATE variants SET stock=stock-? WHERE product=? AND color=? AND size=?', (line['qty'], *key))
                if row['status'] in active and status == 'solicitado':
                    return self.reply(409, {'error': 'Un pedido confirmado debe avanzar o cancelarse.'})
                if row['status'] in active and status == 'cancelado':
                    for line in json.loads(row['items']):
                        connection.execute('UPDATE variants SET stock=stock+? WHERE product=? AND color=? AND size=? AND stock IS NOT NULL', (line['qty'], line['id'], line['color'], line['size']))
                connection.execute('UPDATE orders SET status=?,shipping=?,payment=? WHERE id=?', (status, 0 if row['delivery'] == 'pickup' else shipping, payment, data.get('id')))
            else:
                return self.reply(404, {'error': 'Ruta no encontrada'})
        self.reply(200, {'ok': True})


if __name__ == '__main__':
    initialize()
    port = int(os.environ.get('PORT', '8081'))
    print(f'Narantha: http://127.0.0.1:{port}', flush=True)
    if len(TOKEN) < 32:
        print('Administración desactivada: define NARANTHA_ADMIN_TOKEN con 32 caracteres o más.', flush=True)
    mail_stop = threading.Event()
    threading.Thread(target=mail_jobs.worker, args=(connect, mail_stop), daemon=True).start()
    try:
        ThreadingHTTPServer((os.environ.get('HOST', '127.0.0.1'), port), Handler).serve_forever()
    except KeyboardInterrupt:
        mail_stop.set()
