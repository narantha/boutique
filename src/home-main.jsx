// Fase 3 canary: la home oficial sigue siendo estática.
// Si se abre accidentalmente este entrypoint, redirigimos al inicio real.
window.location.replace('/');
