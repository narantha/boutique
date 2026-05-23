export default function PrivacyPage() {
  return (
    <main id="top" className="privacy-page">
      <section className="privacy-hero">
        <div className="container">
          <div className="eyebrow">Transparencia</div>
          <h1 className="mt-16">Política de <span className="accent">privacidad</span></h1>
          <p className="hero-sub">En Narantha Boutique cuidamos tu información personal con dedicación.</p>
        </div>
      </section>

      <section className="privacy-content">
        <div className="container privacy-card">
          <h2>1. Cómo usamos tu información</h2>
          <p>Usamos tus datos para atender consultas, procesar pedidos, mejorar la experiencia del sitio y analizar tráfico.</p>
          <h2>2. Cookies</h2>
          <p>Utilizamos cookies para recordar preferencias y medir rendimiento.</p>
          <h2>3. Compartición de datos</h2>
          <p>No vendemos tus datos personales.</p>
          <p className="mt-28"><strong>Última actualización:</strong> 21 de mayo de 2026.</p>
        </div>
      </section>
    </main>
  );
}
