import { BaseLayout } from '../layout/BaseLayout';

export function PrivacyPage() {
  return (
    <BaseLayout title="Política de privacidad — Narantha Boutique" description="Política de privacidad de Narantha Boutique.">
      <section className="privacy-hero">
        <div className="container">
          <div className="eyebrow">Transparencia</div>
          <h1 className="mt-16">Política de <span className="accent">privacidad</span></h1>
          <p className="hero-sub">En Narantha Boutique cuidamos tu información personal con la misma dedicación con la que elegimos cada prenda.</p>
        </div>
      </section>

      <section className="privacy-content">
        <div className="container privacy-card">
          <h2>1. Cómo usamos tu información</h2>
          <p>Usamos tus datos para atender consultas, procesar pedidos, mejorar la experiencia del sitio y analizar el tráfico para optimizar nuestro contenido y servicios.</p>

          <h2>2. Cookies</h2>
          <p>Utilizamos cookies para recordar preferencias, medir rendimiento y entender cómo se utiliza el sitio. Puedes gestionar su uso desde la configuración de tu navegador.</p>

          <h2>3. Compartición de datos</h2>
          <p>No vendemos tus datos personales. Podemos recopilar información no personal sobre el uso de nuestros servicios digitales mediante herramientas tecnológicas y de analítica.</p>

          <h2>4. Derechos del usuario</h2>
          <p>Puedes solicitar acceso, corrección o eliminación de tus datos escribiéndonos a <a href="mailto:contacto@narantha.com">contacto@narantha.com</a>.</p>

          <h2>5. Cambios en esta política</h2>
          <p>Podemos actualizar esta política para reflejar mejoras en nuestros procesos. Te recomendamos revisarla periódicamente.</p>

          <p className="mt-28"><strong>Última actualización:</strong> 21 de mayo de 2026.</p>
        </div>
      </section>
    </BaseLayout>
  );
}
