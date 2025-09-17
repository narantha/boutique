import React from 'react';
import Header from '../components/Header';
import { Helmet } from 'react-helmet-async';

export default function Nosotros() {
  return (
    <>
      <Helmet>
        <title>Nosotros - Narantha Boutique</title>
      </Helmet>
      <Header />

      <section className="hero" style={{ backgroundColor: '#D65A31', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <h1>Sobre Narantha Boutique</h1>
        <p>Una historia de amor, fuerza y estilo</p>
      </section>

      <section className="container" style={{ maxWidth: '960px', margin: '40px auto', padding: '0 20px' }}>
        <div className="story" style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#D65A31', fontSize: '2em', marginBottom: '20px' }}>¿Por qué nació <span style={{ color: '#C9A76B', fontWeight: 'bold' }}>Narantha</span>?</h2>
          <p>
            Narantha nació de un sueño profundo, de esos que florecen desde el corazón. Fue creado por dos hermanas que, en medio de la adversidad, decidieron no rendirse. Desde una pequeña habitación en Piura y luego desde Lima, construimos este espacio como un refugio de belleza, amor propio y esperanza.
          </p>
          <p>
            Cada prenda que elegimos cuenta una historia. Cada detalle está inspirado en la mujer valiente, fuerte, alegre, que abraza su esencia con libertad.
          </p>
          <p>
            <span style={{ color: '#C9A76B', fontWeight: 'bold' }}>Narantha</span> no es solo una boutique. Es un símbolo de resiliencia, de sueños tejidos con fe, de volver a empezar una y otra vez con más luz.
          </p>

          <h2 style={{ color: '#D65A31', fontSize: '2em', marginTop: '40px' }}>¿Qué soñamos con esta tienda?</h2>
          <p>
            Más allá de las ventas, soñamos con que <strong>Narantha</strong> se convierta en un movimiento. Queremos empoderar a mujeres a sentirse hermosas y valientes, sin importar las circunstancias.
          </p>
          <p>
            Imaginamos nuestras prendas viajando por el mundo, inspirando a otras mujeres a perseguir sus sueños. Queremos crecer contigo, estar presentes en los momentos importantes de tu vida y recordarte siempre lo valiosa que eres.
          </p>
        </div>
      </section>
    </>
  );
}