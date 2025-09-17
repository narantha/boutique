import React from 'react';
import Header from '../components/Header';
import { Helmet } from 'react-helmet-async';

export default function Valores() {
    return (
        <>
            <Helmet>
                <title>Nosotros - Narantha Boutique</title>
            </Helmet>
            <Header />

            <section className="container" style={{ maxWidth: '960px', margin: '40px auto', padding: '0 20px' }}>
                <h1 className="text-3xl font-bold text-center mb-6 text-[#D65A31]">
                    Nuestro Propósito y Valores
                </h1>

                <div className="max-w-3xl mx-auto text-justify text-lg leading-relaxed">
                    <p className="mb-4">
                        En <strong>Narantha</strong> creemos que la ropa no solo viste el cuerpo, sino que puede elevar el alma.
                        Nuestro propósito es inspirar a las mujeres a vivir con fuerza, vestir con esencia y recordarse cada día
                        lo valiosas que son.
                    </p>

                    <p className="mb-6">
                        Narantha nació desde el amor entre hermanas, el coraje de seguir adelante y la fe de que incluso los sueños
                        más grandes pueden nacer en los lugares más sencillos. Cada prenda representa más que estilo: representa
                        historia, superación, sensibilidad y propósito.
                    </p>

                    <h2 className="text-2xl font-semibold mb-4">Nuestros Valores</h2>

                    <ul className="space-y-3">
                        <li>
                            ✨ <strong>Autenticidad:</strong> Celebramos lo que te hace única.
                        </li>
                        <li>
                            🧡 <strong>Empatía:</strong> Diseñamos desde el corazón, pensando en mujeres reales.
                        </li>
                        <li>
                            🌱 <strong>Resiliencia:</strong> Somos testimonio de que lo difícil también florece.
                        </li>
                        <li>
                            🤝 <strong>Sororidad:</strong> Apoyamos a otras mujeres, desde nuestras clientas hasta nuestras raíces.
                        </li>
                        <li>
                            🎗️ <strong>Esperanza:</strong> Nuestra historia está tejida con fe, propósito y lucha.
                        </li>
                    </ul>

                    <blockquote className="mt-8 italic text-center text-[#555]">
                        “Cada prenda es un abrazo que te dice: sigue brillando.”
                    </blockquote>
                </div>
            </section>
        </>
    );
}