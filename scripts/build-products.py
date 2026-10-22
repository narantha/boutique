"""Generate crawlable product pages from the store's existing catalog."""
import html
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
source = "const fs=require('fs'),vm=require('vm');const code=fs.readFileSync(process.argv[1],'utf8').split('function item(')[0];process.stdout.write(vm.runInNewContext(code+';JSON.stringify(PRODUCTS)'));"
products = json.loads(subprocess.check_output(['node', '-e', source, str(ROOT / 'assets/js/main.js')]))
template = (ROOT / 'producto.html').read_text()
urls = ['https://narantha.com/', *['https://narantha.com/' + path for path in ['politica-de-devoluciones.html', 'politica-de-privacidad.html', 'terminos-y-condiciones.html', 'libro-de-reclamaciones.html', 'envios-y-pagos.html']]]
for key, product in products.items():
    kind = 'Vestido' if product['category'] == 'Vestidos' else 'Enterizo'
    name = f"{kind} {product['name']}"
    url = f'https://narantha.com/productos/{key}/'
    page = template.replace('<head>', '<head><base href="../../">', 1)
    page = re.sub(r'<title>.*?</title>', f'<title>{html.escape(name)} — Narantha</title>', page, count=1)
    page = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{html.escape(product["descriptor"], quote=True)}">', page, count=1)
    page = page.replace('<body data-page="product">', f'<body data-page="product" data-product-id="{key}">')
    for identifier, value in [('productName', name), ('productPrice', product['priceLabel']), ('productDescription', product['descriptor']), ('productDetails', product['details']), ('mobileProduct', name), ('mobilePrice', product['priceLabel'])]:
        page = re.sub(r'(<[^>]+id="' + identifier + r'"[^>]*>).*?(</[^>]+>)', lambda m: m[1] + html.escape(value) + m[2], page, count=1)
    image = product['images'][0]
    page = page.replace('<div class="gallery-main" id="galleryMain"></div>', '<div class="gallery-main" id="galleryMain"><img src="' + html.escape(image['src'], quote=True) + '" alt="' + html.escape(image['alt'], quote=True) + '"></div>')
    schema = {'@context': 'https://schema.org', '@type': 'Product', 'name': name, 'sku': key, 'brand': {'@type': 'Brand', 'name': 'NARANTHA'}, 'description': product['descriptor'], 'image': ['https://narantha.com/' + image['src'] for image in product['images']], 'url': url, 'offers': {'@type': 'Offer', 'url': url, 'priceCurrency': 'PEN', 'price': f"{product['price']:.2f}"}}
    page = page.replace('</head>', f'<link rel="canonical" href="{url}"><meta property="og:title" content="{html.escape(name, quote=True)}"><meta property="og:image" content="https://narantha.com/{image["src"]}"><script type="application/ld+json">' + json.dumps(schema, ensure_ascii=False).replace('<', '\\u003c') + '</script></head>', 1)
    page = page.replace('href="#', f'href="/productos/{key}/#')
    page = page.replace('</main>', '<noscript><p>Activa JavaScript para seleccionar variantes y usar el carrito. La compra en línea está pendiente de habilitación; para consultas escribe a contacto@narantha.com.</p></noscript></main>', 1)
    target = ROOT / 'productos' / key / 'index.html'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(page)
    urls.append(url)
(ROOT / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + '\n'.join('<url><loc>' + html.escape(url) + '</loc></url>' for url in urls) + '\n</urlset>\n')
print(f'{len(products)} fichas estáticas y sitemap generados.')
