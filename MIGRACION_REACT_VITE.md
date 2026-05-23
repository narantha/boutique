# Migración progresiva a React + Vite (sin romper el sitio actual)

## Estado actual

- ✅ **Fase 1:** arquitectura React + Vite base.
- ✅ **Fase 2:** shell por ruta funcionando.
- ✅ **Fase 3 (canary):** `politica-de-privacidad.html` en React y `index.html` compatible con React para evitar pantallas en blanco en entornos donde ya quedó montado `#root`.

## Importante (para evitar pantalla en blanco)

- Si `index.html` tiene `<div id="root"></div>` + `<script type="module" src="/src/home-main.jsx"></script>`, ahora **sí renderiza HomePage** (ya no redirige).
- Esto evita el caso de pantalla blanca que ocurría cuando el entrypoint de home solo redirigía.
- `react-pages/home.html` puede seguir existiendo como página auxiliar de pruebas.

## Qué significa Fase 3 aquí

1. Privacidad (`/politica-de-privacidad.html`) corre en React usando layout reutilizable.
2. Home puede funcionar en modo estático o en modo React-shell sin quedarse en blanco.
3. Luego se define el corte final (home estática o home React completa) según métricas.

## Checklist de validación canary

- Carga correcta en móvil y desktop.
- Sin errores en consola.
- Navegación a inicio y política funcionando.
- Meta title y description correctos.
- Métricas: rebote y tiempo en página estables.

## Comandos

```bash
npm run dev
npm run build
npm run preview
```
