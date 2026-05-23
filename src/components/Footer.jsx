export default function Footer({ isPrivacy }) {
  return (
    <footer className="foot" aria-label="Pie de página">
      <div className="container">
        <div className="foot-bottom">
          <div>© 2026 Narantha Boutique · Hecho con calma en Piura, Perú</div>
          <div>
            {isPrivacy ? (
              <a href="/">Volver al inicio</a>
            ) : (
              <a href="/politica-de-privacidad">Política de privacidad</a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
