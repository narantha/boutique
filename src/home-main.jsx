// Fase 3 canary: Home debe ser estática.
// Evitamos loops infinitos si por error index.html vuelve a montar este entrypoint.
if (window.location.pathname !== '/') {
  window.location.replace('/');
}
