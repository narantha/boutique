import copy
import tempfile
import threading
import unittest
from pathlib import Path
from unittest.mock import patch
import app
import complaints
import mail_jobs

PROVIDER = {'tradeName': 'Narantha Boutique', 'legalName': 'Proveedor de prueba', 'ruc': '10000000001', 'address': 'Dirección de prueba', 'addressConfirmed': True, 'phone': '000000000', 'email': 'contacto@narantha.com', 'claimsAvailable': True}


class ComplaintTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        app.DB = Path(self.temp.name) / 'test.sqlite3'
        app.initialize()
        self.patch = patch('complaints.business', side_effect=lambda: dict(PROVIDER))
        self.patch.start()
        self.lock = threading.Lock()
        self.payload = {'requestKey': 'complaint-test-request-12345', 'consumer': {'name': 'Consumidora de prueba', 'documentType': 'DNI', 'document': '00000000', 'address': 'Domicilio ficticio', 'phone': '', 'email': 'prueba@example.com', 'replyVia': 'email', 'minor': False}, 'purchase': {'type': 'producto', 'description': '<script>alert(1)</script> Enterizo', 'order': '', 'amount': None}, 'kind': 'queja', 'detail': 'Atención de prueba', 'request': 'Solicito una respuesta escrita'}

    def tearDown(self):
        self.patch.stop()
        self.temp.cleanup()

    def create(self):
        return complaints.create(copy.deepcopy(self.payload), app.connect, self.lock)

    def test_registered_copy_has_supplier_number_and_original_text(self):
        code, result = self.create()
        self.assertEqual(code, 201)
        record = result['complaint']
        self.assertEqual(record['code'], 'NAR-WEB-00000001')
        self.assertEqual(record['provider']['ruc'], PROVIDER['ruc'])
        self.assertEqual(record['purchase']['description'], self.payload['purchase']['description'])
        self.assertNotIn('request_key', record)
        self.assertEqual(record['status'], 'recibido')
        self.assertTrue(record['created'].endswith('-05:00'))

    def test_retry_and_correlative(self):
        first = self.create()[1]['complaint']['code']
        self.assertEqual(self.create()[1]['complaint']['code'], first)
        self.payload['request'] = 'Pedido diferente'
        self.assertEqual(self.create()[0], 409)
        self.payload['requestKey'] = 'complaint-test-request-67890'
        self.assertEqual(self.create()[1]['complaint']['code'], 'NAR-WEB-00000002')

    def test_minor_requires_representative(self):
        self.payload['consumer']['minor'] = True
        with self.assertRaises(ValueError):
            self.create()
        self.payload['consumer']['representative'] = {'name': 'Representante de prueba', 'document': '00000001', 'address': 'Dirección ficticia'}
        self.assertEqual(self.create()[0], 201)

    def test_only_email_reply_with_address_is_accepted(self):
        self.payload['consumer']['replyVia'] = 'carta'
        with self.assertRaises(ValueError):
            self.create()
        self.payload['consumer']['replyVia'] = 'email'
        self.payload['consumer']['email'] = ''
        with self.assertRaises(ValueError):
            self.create()

    def test_validation(self):
        self.payload['consumer']['document'] = 'incorrecto'
        with self.assertRaises(ValueError):
            self.create()
        self.payload['consumer']['document'] = '00000000'
        self.payload['purchase']['amount'] = -1
        with self.assertRaises(ValueError):
            self.create()

    def test_response_requires_evidence_and_preserves_original(self):
        record = self.create()[1]['complaint']
        data = {'code': record['code'], 'status': 'respondido', 'response': 'Respuesta de prueba', 'responseDate': record['created'][:10], 'deliveryEvidence': ''}
        self.assertEqual(complaints.update(data, app.connect, self.lock)[0], 400)
        data['deliveryEvidence'] = 'Referencia de correo de prueba'
        self.assertEqual(complaints.update(data, app.connect, self.lock)[0], 200)
        saved = complaints.list_records(app.connect)['complaints'][0]
        self.assertEqual(saved['detail'], self.payload['detail'])
        self.assertEqual(saved['status'], 'respondido')
        with app.connect() as connection:
            self.assertEqual(connection.execute('SELECT count(*) FROM complaint_history').fetchone()[0], 1)

    def test_incomplete_provider_cannot_issue_receipt(self):
        with patch('complaints.business', return_value={'claimsAvailable': False}):
            self.assertEqual(self.create()[0], 503)
        self.assertEqual(complaints.list_records(app.connect)['complaints'], [])

    def test_email_outbox_is_durable_and_not_duplicated(self):
        self.create()
        self.create()
        deliveries = []
        self.assertTrue(mail_jobs.deliver_one(app.connect, sender=deliveries.append))
        self.assertFalse(mail_jobs.deliver_one(app.connect, sender=deliveries.append))
        self.assertEqual(len(deliveries), 1)
        self.assertIn('NAR-WEB-00000001', deliveries[0]['body'])
        self.assertIn(self.payload['request'], deliveries[0]['body'])
        self.assertEqual(complaints.list_records(app.connect)['complaints'][0]['emailCopy']['status'], 'enviado')

    def test_email_failure_does_not_lose_complaint(self):
        self.create()
        def fail(job):
            raise OSError('Simulated SMTP failure')
        mail_jobs.deliver_one(app.connect, sender=fail)
        records = complaints.list_records(app.connect)['complaints']
        self.assertEqual(len(records), 1)
        self.assertEqual(records[0]['emailCopy']['status'], 'reintentar')
        self.assertEqual(records[0]['detail'], self.payload['detail'])

    def test_no_purchase_or_marketing_consent_required(self):
        self.payload['kind'] = 'reclamo'
        self.assertEqual(self.create()[0], 201)


if __name__ == '__main__':
    unittest.main()
