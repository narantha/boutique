# Migración progresiva a React + Vite (sin romper el sitio actual)

## Estado actual de fases

- ✅ **Fase 1 completada:** arquitectura React + Vite creada.
- ✅ **Fase 2 completada:** rutas reales (`index.html` y `politica-de-privacidad.html`) ya montan React.
- ⏭️ **Siguiente:** canary de despliegue (Fase 3) y migración total por lotes (Fase 4).

## Aclaración importante

Vas a **seguir viendo** los archivos `index.html` y `politica-de-privacidad.html`, porque en Vite siempre existe un HTML por ruta de entrada.
La diferencia es que ahora esos archivos son solo un *shell* que monta React en `#root`.

## Qué se hizo en Fase 2

1. `index.html` ahora monta `src/home-main.jsx`.
2. `politica-de-privacidad.html` ahora monta `src/privacy-main.jsx`.
3. Se conservan metadatos SEO básicos en cada HTML y se centraliza la UI repetida en React (`BaseLayout`, `Navbar`, `Footer`).

## Flujo recomendado

1. **Fase 3 (canary):** publicar solo una ruta migrada primero (`/politica-de-privacidad.html`).
2. Validar métricas: errores JS, rebote, tiempo de carga, CTR de CTA.
3. Luego publicar home (`/`).

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```
