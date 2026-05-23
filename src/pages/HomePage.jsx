export default function HomePage() {
  return (
    <main>
      <header id="top" className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">Boutique de autora — Perú</div>
              <h1 className="mt-28">Más que ropa, una forma de <span className="accent">volver a sentirte segura.</span></h1>
              <p className="hero-sub">Narantha es una boutique pequeña hecha con calma. Piezas seleccionadas una por una para mujeres reales.</p>
              <div className="hero-cta-row">
                <a href="#coleccion" className="btn btn-primary">Ver colección →</a>
                <a href="/politica-de-privacidad" className="btn btn-ghost">Política de privacidad</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="coleccion" className="catalog">
        <div className="container">
          <div className="section-head">
            <div className="title">
              <div className="eyebrow">Capítulo 01 · Otoño 2026</div>
              <h2>Colección <em>"Volver a casa"</em></h2>
            </div>
          </div>
          <p>Base migrada a React + Vite con layout compartido para evitar repetir head, navbar y footer.</p>
        </div>
      </section>
    </main>
  );
}
