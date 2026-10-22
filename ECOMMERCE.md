# Tienda Narantha

Tienda con catálogo estático y servidor opcional en Python 3.9+ / SQLite, sin paquetes externos.

## Funciones

- Tres productos originales: Yismi, Lorena y Priscila, a S/ 120.
- Búsqueda, ordenación y favoritos locales; galerías y variantes existentes.
- Carrito persistente con variantes separadas, cantidades y eliminación.
- Checkout con contacto, dirección, envío o recojo, revisión y WhatsApp.
- Con servidor: solicitudes persistentes con código único y precio calculado en servidor; reintentos sin duplicados.
- Administración privada de pedidos, estados, envío, verificación manual de pago y existencias por variante.
- El stock se descuenta al confirmar y se repone al cancelar. Confirmar exige existencias definidas suficientes. Una solicitud no reserva stock.
- Sin servidor: se prepara una solicitud para enviar por correo electrónico y la pantalla aclara que no se registró en un servidor.

## Ejecutar

Desde la carpeta padre de `boutique`:

```sh
python3 -B boutique/server/app.py
```

Abre http://127.0.0.1:8081. El servidor escucha solo en la máquina local por defecto. PORT permite cambiar el puerto. NARANTHA_DB permite ubicar la base de datos en un volumen persistente. HOST permite definir una interfaz para un alojamiento con proxy.

Para activar `/admin.html`, configura `NARANTHA_ADMIN_TOKEN` en el entorno con una clave privada aleatoria de al menos 32 caracteres antes de iniciar. No la añadas al repositorio ni al JavaScript público. La administración queda desactivada sin esa configuración. La clave se escribe en la pantalla de acceso y se conserva solo en memoria hasta cerrar sesión o recargar.

La base de datos en `server/data/` está excluida de Git y de las rutas web. Realiza copias de seguridad y conserva ese directorio al actualizar. El servidor bloquea acceso a su código, datos y archivos ocultos.

## Archivos

- `assets/js/main.js`: catálogo, galerías y número de WhatsApp.
- `assets/js/shop.js`: carrito y checkout.
- `assets/js/admin.js` y `admin.html`: administración.
- `assets/css/shop.css`: estilos adicionales adaptables.
- `server/app.py`: API, persistencia y reglas de pedidos/inventario.

## Privacidad

Solo el carrito y los favoritos se guardan en localStorage. Con el servidor activo, los datos de contacto y entrega se registran en SQLite al preparar la solicitud. El envío a WhatsApp lo completa la clienta. GTM, Clarity y Hotjar se retiraron de inicio y producto al incorporar datos personales. Los eventos locales de dataLayer no incluyen datos de contacto. La administración no carga analítica externa.

## Antes de publicar con cobros

El código está preparado y probado localmente; no se ha publicado. El alojamiento estático actual no ejecuta Python: hace falta alojamiento de servidor con volumen persistente y HTTPS. El servidor estándar incluido sirve para desarrollo; en producción se necesita una configuración operativa revisada, control de abuso, copias de seguridad y protección del acceso administrativo.

Pendientes de negocio: confirmar tallas y colores de Lorena/Priscila, cantidades reales, tarifas y plazos de envío. Las variantes desconocidas se muestran expresamente como pendientes.

No hay pasarela ni cobros automáticos. Seleccionar pago verificado en administración requiere verificar el pago externamente. Para conectar una pasarela: credenciales solo en servidor, orden y total autorizados allí, notificaciones autenticadas e idempotentes, y conciliación de cobros/reembolsos. No entregar pedidos basándose solo en el retorno del navegador.

## Verificación

```sh
node --check boutique/assets/js/main.js
node --check boutique/assets/js/shop.js
node --check boutique/assets/js/admin.js
python3 -B -m unittest discover -s boutique/server -p 'test_*.py' -v
```

Seis pruebas cubren precios calculados en servidor, reintentos, variantes/cantidades inválidas, stock al confirmar/cancelar, stock insuficiente y validación de envío/consentimiento. En navegador se comprobó selección, persistencia tras recarga, subtotal de dos unidades, búsqueda, recojo y registro de una solicitud ficticia. No se enviaron mensajes ni se efectuaron cobros. La base local contiene esa solicitud de prueba, con nombre ficticio y teléfono 000000000.

## Información del comercio y requisitos de Culqi

Contacto actualizado: no publicado / contacto@narantha.com. Titular y dirección se basan en los datos proporcionados por la tienda: nombre personal no publicado, RUC 10483528464; Plataforma Juan Velasco Alvarado Mz. A, puesto 36, Piura, Perú. Se centralizan en `assets/business.json`, con datos visibles también en HTML sin depender de JavaScript. No se publica el DNI por separado. Los enlaces de redes no confirmados se retiraron de la página de privacidad.

Se añadieron términos y condiciones, contacto en todas las páginas principales, acceso visible al libro y actualización de privacidad. Se preservaron las condiciones comerciales de cambios ya existentes y se aclaró que no restringen derechos legales por fallas o falta de idoneidad.

### Libro de Reclamaciones integrado

`libro-de-reclamaciones.html` registra directamente en `/api/complaints`; no depende de Google Forms, Drive ni WhatsApp. Cada hoja recibe un correlativo permanente `NAR-WEB-00000001`, fecha/hora de Lima, copia de los datos del proveedor al registrar, identificación del consumidor/representante, bien o servicio, monto si se conoce, reclamo/queja, detalle y pedido. No requiere una cuenta, comprobante, pago previo ni consentimiento publicitario.

Los reintentos con el mismo contenido y clave no duplican la hoja. El registro original es inmutable desde la administración. Las acciones y respuestas se guardan aparte con historial. `/api/admin/complaints` exige la clave administrativa; no existe consulta pública por correlativo que exponga datos personales.

La constancia puede imprimirse o guardarse como PDF desde el navegador y descargarse en HTML autocontenido. El registro y vista de constancia se verificaron con una hoja ficticia local. La captura del evento de descarga en el navegador integrado no devolvió una confirmación, por lo que debe verificarse la descarga y la impresión final en el navegador de producción. No se enviaron reclamaciones ni correos reales. La base local contiene una hoja marcada explícitamente como PRUEBA TÉCNICA; no se debe desplegar esa base como libro de producción.

### Copia automática por correo

El artículo 4-B para proveedores virtuales exige impresión y envío automático de la copia al correo indicado. La cola `mail_jobs` se crea en la misma transacción que la hoja. El trabajador del servidor envía por SMTP con TLS cuando están configuradas estas variables privadas:

- `NARANTHA_SMTP_HOST`
- `NARANTHA_SMTP_PORT` (587 para STARTTLS o 465 para SSL)
- `NARANTHA_SMTP_MODE` (`starttls` o `ssl`; no se admite texto plano)
- `NARANTHA_SMTP_USER`
- `NARANTHA_SMTP_PASSWORD`
- `NARANTHA_MAIL_FROM` (remitente autorizado, por ejemplo contacto@narantha.com)

No guardar credenciales en archivos públicos ni Git. Configurar el dominio remitente y sus registros SPF/DKIM/DMARC con el proveedor de correo. Hasta configurar el servicio, las copias quedan pendientes y la interfaz no afirma que se enviaron. No considerar cumplido este requisito de Culqi hasta probar una entrega real. El trabajador reintenta hasta cinco veces con espera creciente; el estado se muestra en administración. Si el proceso se interrumpe durante un envío (`enviando`), comprobar los registros del proveedor de correo antes de reencolar para evitar una copia duplicada.

La atención de fondo sigue a cargo de la tienda: responder por carta/correo según lo elegido, dentro de 15 días hábiles improrrogables, considerando feriados. El panel permite registrar respuesta, fecha y referencia de la constancia de envío; no manda esa respuesta manual automáticamente. Guardar los originales y las constancias al menos dos años, con copias de seguridad; mantener un libro físico de respaldo para contingencias. No hay eliminación automática de hojas.

### Validación adicional

Dieciséis pruebas de servidor, incluidas diez sobre reclamaciones/correo: correlativos, reintentos, copia del proveedor, representante de menor, medio de respuesta, validación, respuesta con evidencia, datos del proveedor, cola sin duplicados y recuperación ante fallo SMTP. El envío SMTP se prueba con un transporte simulado, sin conexión externa. Se verificaron las referencias locales de siete páginas y la presentación en el navegador integrado.

Fuentes consultadas:
- https://consumidor.gob.pe/wp-content/uploads/2020/07/Preguntas_Respuestas_LR_12.11.2025.pdf
- https://busquedas.elperuano.pe/dispositivo/NL/1041477-1 (campos, conservación y artículo 4-B)
- https://busquedas.elperuano.pe/dispositivo/NL/2095978-1 (plazo vigente de 15 días hábiles)

Los cambios son locales. Falta alojamiento persistente con HTTPS, acceso administrativo configurado, correo operativo y validación de producción antes de presentar la web a Culqi. La integración de cobros Culqi sigue pendiente; estas páginas no afirman que ya exista.

Actualización de privacidad: la tienda muestra Nombre comercial: NARANTHA y no publica nombre personal ni teléfono. La identificación legal completa está pendiente; el libro no se habilita sin ella. Las solicitudes de compra se comparten por correo electrónico.

## Correcciones de páginas para Merchant Center

Las fichas canónicas ahora están en `/productos/josy/`, `/productos/yismi/`, `/productos/lorena/` y `/productos/priscila/`. Ejecutar `python3 boutique/scripts/build-products.py` después de cambiar catálogo o plantilla para regenerar el HTML, metadatos de producto y sitemap. El generador no declara existencias que no se hayan verificado.

La página 404 conserva el error y ofrece un enlace a la colección, sin redirigir automáticamente al inicio. Los enlaces antiguos válidos `producto.html?producto=...` siguen funcionando. Un identificador desconocido muestra producto no encontrado en vez de sustituirlo por Yismi.

Pendiente para resolver el aviso de compra de Google: método de pago real, backend de producción, total de envío conocido, stock y variantes confirmados y correspondencia con las URLs del feed. La solicitud por correo no completa ese requisito. Las correcciones de páginas no equivalen a aprobación de Merchant Center.

## Contra entrega (configuración confirmada)

`assets/shipping.json` es la fuente compartida de tarifas y cobertura. Lima: S/ 15 en Chorrillos, Barranco, Santiago de Surco y San Juan de Miraflores; S/ 25 en los otros 39 distritos de la provincia de Lima. Distrito de Piura: S/ 15. Callao, Castilla y Veintiséis de Octubre no están habilitados sin confirmación de cobertura. Entrega en un máximo de 48 horas. Efectivo, Yape y Plin al recibir; recojo en tienda sin costo.

El checkout revisa el pedido y después confirma mediante `/api/checkout`. No utiliza mailto como sustituto del registro. El servidor recalcula precios/envío, exige stock conocido y variantes definidas, reserva en una transacción y registra estado confirmado con pago pendiente. Los reintentos no duplican pedidos ni descuentan dos veces. La confirmación muestra el número y total sin marcarlo como pagado. Los pedidos históricos de solicitud siguen en `/api/orders`.

Las tarifas se prueban sin usar stock ficticio en la base real. Para activar: registrar cantidades reales por variante en administración y desplegar el backend en alojamiento persistente con HTTPS. GitHub Pages no ejecuta esta API. Sin API, se informa del fallo y no se muestra un pedido ficticio confirmado. Hay 20 pruebas de servidor, incluidas las de tarifas, cobertura, stock y reintentos de contra entrega.
