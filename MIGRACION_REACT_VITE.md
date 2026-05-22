# Migración progresiva a React + Vite (sin romper el sitio actual)

## Qué se hizo

1. Se agregó una app React + Vite paralela, sin modificar tus páginas actuales (`index.html` y `politica-de-privacidad.html`).
2. Se crearon componentes reutilizables para `head` (metadatos), navbar y footer.
3. Se prepararon dos páginas React de ejemplo para mostrar cómo dejar de repetir estructura.

## Flujo recomendado

1. **Fase 0 (actual):** Mantener sitio actual en producción.
2. **Fase 1:** Desarrollar páginas equivalentes en `react-pages/`.
3. **Fase 2:** Comparar visualmente y funcionalmente una página React vs la original.
4. **Fase 3:** Redirigir sólo una ruta en deploy hacia `dist/` (canary).
5. **Fase 4:** Migrar el resto por lotes y retirar HTML duplicado.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Estructura

- `src/layout/BaseLayout.jsx`: composición de Head + Navbar + Footer.
- `src/layout/Helmet.jsx`: actualiza `title` y `meta description`.
- `src/components/*`: componentes compartidos.
- `src/pages/*`: páginas por ruta.
- `react-pages/*.html`: entrypoints multipágina para Vite.

## Siguiente paso sugerido

Migrar primero la página con menos riesgos (por ejemplo privacidad), validar SEO/performance y luego homepage.
