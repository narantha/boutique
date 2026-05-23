# Migración progresiva a React + Vite (sin romper el sitio actual)

## Estado actual

- ✅ **Fase 1:** arquitectura React + Vite base.
- ✅ **Fase 2:** shell por ruta funcionando.
- ✅ **Fase 3 (canary):** solo `politica-de-privacidad.html` queda migrada a React; `index.html` se mantiene en versión estática original para minimizar riesgo.

## Importante (para evitar confusión)

- La URL oficial de inicio es **`/`** y sigue siendo HTML estático completo.
- Si abres `react-pages/home.html`, ahora redirige automáticamente a `/` para evitar ver la home de placeholder.
- `src/home-main.jsx` quedó solo como redirección de seguridad durante el canary.

## Qué significa Fase 3 aquí

1. **Home (`/`) sigue estática** mientras validamos estabilidad y métricas.
2. **Privacidad (`/politica-de-privacidad.html`) corre en React** usando layout reutilizable.
3. Si el canary sale bien, pasamos la home a React en el siguiente lote.

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
