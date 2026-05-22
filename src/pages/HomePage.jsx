import { BaseLayout } from '../layout/BaseLayout';

export function HomePage() {
  return (
    <BaseLayout title="Boutique | Inicio" description="Colección boutique de vestidos y enterizos.">
      <section className="container hero">
        <h1>Colección destacada</h1>
        <p>Esta vista ya corre en React + Vite sin tocar tu sitio estático actual.</p>
      </section>
    </BaseLayout>
  );
}
