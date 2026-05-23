export default function Navbar({ isPrivacy }) {
  return (
    <nav className={`nav ${isPrivacy ? 'scrolled' : ''}`} aria-label="Navegación principal">
      <div className="container nav-inner">
        <a href="/" className="brandmark" aria-label="Narantha Boutique — inicio">
          <span className="dot" aria-hidden="true"></span>
          <span>Narantha <em>Boutique</em></span>
        </a>
        {isPrivacy ? (
          <a href="/" className="nav-cta">Volver al inicio →</a>
        ) : (
          <a href="#coleccion" className="nav-cta">Ver colección →</a>
        )}
      </div>
    </nav>
  );
}
