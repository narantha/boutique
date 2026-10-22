import copy
import tempfile
import unittest
from pathlib import Path
import app


class StoreTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        app.DB = Path(self.temp.name) / 'test.sqlite3'
        app.initialize()
        self.handler = object.__new__(app.Handler)
        self.responses = []
        self.handler.reply = lambda code, body: self.responses.append((code, body))
        self.payload = {'requestKey': 'test-request-key-12345', 'customer': {'name': 'Prueba', 'phone': '000000000'}, 'consent': True, 'delivery': 'pickup', 'items': [{'id': 'yismi', 'color': 'Nude', 'size': 'M', 'qty': 2, 'price': 1}], 'notes': ''}

    def tearDown(self):
        self.temp.cleanup()

    def create(self):
        self.handler.create_order(copy.deepcopy(self.payload))
        return self.responses[-1]

    def test_price_is_calculated_on_server(self):
        code, order = self.create()
        self.assertEqual(code, 201)
        self.assertEqual(order['subtotal'], 24000)
        with app.connect() as connection:
            self.assertEqual(connection.execute('SELECT payment FROM orders').fetchone()[0], 'pendiente')

    def test_retry_does_not_duplicate(self):
        first = self.create()[1]['id']
        self.assertEqual(self.create()[1]['id'], first)
        with app.connect() as connection:
            self.assertEqual(connection.execute('SELECT count(*) FROM orders').fetchone()[0], 1)
        self.payload['items'][0]['qty'] = 1
        self.assertEqual(self.create()[0], 409)

    def test_invalid_variants_and_negative_quantity(self):
        self.payload['items'][0]['size'] = 'XXXL'
        with self.assertRaises(ValueError):
            self.create()
        self.payload['items'][0]['size'] = 'M'
        self.payload['items'][0]['qty'] = -1
        with self.assertRaises(ValueError):
            self.create()

    def test_confirm_deducts_once_cancel_restores(self):
        order = self.create()[1]
        update = {'id': order['id'], 'status': 'confirmado', 'shipping': None, 'payment': 'pendiente'}
        self.handler.update_admin('/api/admin/order', update)
        self.assertEqual(self.responses[-1][0], 409)
        self.handler.update_admin('/api/admin/inventory', {'product': 'yismi', 'color': 'Nude', 'size': 'M', 'stock': 5})
        self.handler.update_admin('/api/admin/order', update)
        self.handler.update_admin('/api/admin/order', update)
        with app.connect() as connection:
            self.assertEqual(connection.execute("SELECT stock FROM variants WHERE product='yismi' AND color='Nude' AND size='M'").fetchone()[0], 3)
        update['status'] = 'cancelado'
        self.handler.update_admin('/api/admin/order', update)
        self.handler.update_admin('/api/admin/order', update)
        with app.connect() as connection:
            self.assertEqual(connection.execute("SELECT stock FROM variants WHERE product='yismi' AND color='Nude' AND size='M'").fetchone()[0], 5)

    def test_insufficient_stock_rejects_order(self):
        self.handler.update_admin('/api/admin/inventory', {'product': 'yismi', 'color': 'Nude', 'size': 'M', 'stock': 1})
        self.assertEqual(self.create()[0], 409)
        with app.connect() as connection:
            self.assertEqual(connection.execute('SELECT count(*) FROM orders').fetchone()[0], 0)

    def prepare_cod(self, district='Chorrillos'):
        self.payload.update(checkout='cod', paymentMethod='yape', delivery='shipping', shipping=1, expectedTotal=26500 if district == 'Miraflores' else 25500)
        self.payload['customer'].update(region='Lima', district=district, address='Dirección de prueba')
        self.handler.update_admin('/api/admin/inventory', {'product': 'yismi', 'color': 'Nude', 'size': 'M', 'stock': 5})

    def test_cod_uses_server_shipping_reserves_once_and_stays_unpaid(self):
        self.prepare_cod()
        code, order = self.create()
        self.assertEqual(code, 201)
        self.assertEqual(order['shipping'], 1500)
        self.assertEqual(order['total'], 25500)
        self.assertEqual(order['status'], 'confirmado')
        self.assertEqual(order['payment'], 'pendiente')
        self.assertEqual(order['deliveryHours'], 48)
        self.assertEqual(self.create()[1]['id'], order['id'])
        with app.connect() as connection:
            self.assertEqual(connection.execute("SELECT stock FROM variants WHERE product='yismi' AND color='Nude' AND size='M'").fetchone()[0], 3)

    def test_cod_rejects_changed_total_without_reserving(self):
        self.prepare_cod()
        self.payload['expectedTotal'] = 1
        self.assertEqual(self.create()[0], 409)
        with app.connect() as connection:
            self.assertEqual(connection.execute("SELECT stock FROM variants WHERE product='yismi' AND color='Nude' AND size='M'").fetchone()[0], 5)

    def test_cod_extended_lima_and_piura_rates(self):
        self.prepare_cod('Miraflores')
        self.assertEqual(self.create()[1]['shipping'], 2500)
        self.payload['requestKey'] = 'test-piura-request-key-12345'
        self.payload['customer'].update(region='Piura', district='Piura')
        self.payload['expectedTotal'] = 25500
        self.assertEqual(self.create()[1]['shipping'], 1500)

    def test_cod_rejects_unknown_coverage_and_missing_stock(self):
        self.prepare_cod('Distrito no cubierto')
        self.assertEqual(self.create()[0], 400)
        self.payload['customer']['district'] = 'Chorrillos'
        self.handler.update_admin('/api/admin/inventory', {'product': 'yismi', 'color': 'Nude', 'size': 'M', 'stock': None})
        self.assertEqual(self.create()[0], 409)
        with app.connect() as connection:
            self.assertEqual(connection.execute('SELECT count(*) FROM orders').fetchone()[0], 0)

    def test_shipping_requires_address_and_consent(self):
        self.payload['delivery'] = 'shipping'
        with self.assertRaises(ValueError):
            self.create()
        self.payload['delivery'] = 'pickup'
        self.payload['consent'] = False
        with self.assertRaises(ValueError):
            self.create()


if __name__ == '__main__':
    unittest.main()
