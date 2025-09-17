import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

<Helmet>
  <title>Empezar desde abajo como mujer | Blog Narantha Boutique</title>
  <meta name="description" content="Descubre la historia real de dos hermanas que comenzaron desde cero y crearon Narantha, una boutique que empodera mujeres desde la raíz." />
  <meta name="keywords" content="empezar desde abajo, boutique mujeres, historia real, hermanas, Piura, moda femenina, ropa peruana, inspiración" />
</Helmet>

export default function EmpezarDesdeAbajo() {

    useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'narantha/narantha-comentarios');
    script.setAttribute('data-repo-id', 'R_kgDOO0bllQ');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOO0bllc4Cq61l');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'light');
    script.setAttribute('data-lang', 'es');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    const container = document.getElementById('giscus-container');
    if (container) container.appendChild(script);
  }, []);
  return (
    <main className="text-gray-800">
      {/* Hero banner */}
      <div className="w-full h-64 bg-cover bg-center mb-10" style={{ backgroundImage: `url('/images/banner_blog_narantha.jpg')` }}>
        <div className="bg-black bg-opacity-40 h-full flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center px-4">
            Empezar desde abajo: lo que nadie te dice, pero toda mujer debería saber
          </h1>
        </div>
      </div>

      {/* Contenido del artículo */}
      <section className="max-w-3xl mx-auto px-4 leading-relaxed">
        <p className="mb-4">
          Empezar desde abajo puede ser dejar tu casa a los 16 años porque quieres ayudar a tu familia, aunque eso signifique estar lejos. 
          Puede ser, trabajar como empleada del hogar con lágrimas en el corazón, pero con la mirada puesta en un futuro distinto.
        </p>

        <p className="mb-4">
          Es también tener a una hermana que se queda, que no se rinde, que es el rostro visible de un sueño que aún no tiene nombre. 
          Ella vendía en la calle, iba a ferias, atendía con una sonrisa mientras tú, desde otra ciudad, trabajabas duro para que todo funcione por detrás.
        </p>

        <p className="mb-4">
          Así nació Narantha: desde abajo, desde el amor, desde una lucha compartida entre hermanas.
        </p>

        <h2 className="text-xl font-semibold text-rose-600 mt-8 mb-4">Lo que nadie te dice, pero aprendimos:</h2>

        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li><strong>Empezar desde abajo se siente como empujar una montaña…</strong> pero lo que estás haciendo es escalarla.</li>
          <li><strong>Los roles invisibles también construyen sueños.</strong> Una vendía, la otra planificaba. Eso también es éxito.</li>
          <li><strong>El éxito no se mide en likes, se mide en fidelidad.</strong> Cada clienta que regresa, cada sonrisa, cada abrazo.</li>
          <li><strong>No necesitas ser perfecta, solo persistente.</strong> Empezar desde abajo no es debilidad. Es raíz.</li>
        </ul>

        <p className="mb-6">
          Si tú también estás empezando desde abajo, este mensaje es para ti: estás en el camino correcto. Porque no es el más fácil, pero sí es el más auténtico.
        </p>

        <p className="mb-6 font-semibold italic text-rose-700">
          Narantha Boutique no solo es ropa. Es una historia real, construida por dos hermanas que creyeron que sí se podía.
        </p>

        <p className="mb-12">
          Gracias por estar aquí. Gracias por apoyar un negocio que nace desde el corazón.
          <br />
          <strong>Empezar desde abajo… también es empezar con valor.</strong>
        </p>
      </section>
      <section>
              <div id="giscus-container" className="mt-10" />

      </section>
    </main>
  );
}
