import React from 'react';
import Header from '../components/Header';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import realeza from '../assets/images/productos/enterizos/Enterizo_realeza.png';
import eloisa from '../assets/images/productos/enterizos/coquet.jpg';
import aruba from '../assets/images/productos/enterizos/aruba.png';
import vestido_corte_s from '../assets/images/productos/vestidos/cortos/joy.jpg';
import dance from '../assets/images/productos/vestidos/cortos/Vestido_short_dance.png';
import camila from '../assets/images/productos/vestidos/largos/vestido_cruzado.png';
import ariel from '../assets/images/productos/vestidos/largos/ariel.png';

const productos = [
  { id: 'camila', nombre: 'Vestido Camila', precio: 'S/90', imagen: camila },
  { id: 'carolina', nombre: 'Vestido Carolina', precio: 'S/90', imagen: vestido_corte_s },
  { id: 'aruba', nombre: 'Enterizo Aruba', precio: 'S/95', imagen: aruba },
  { id: 'eloisa', nombre: 'Enterizo Eloisa', precio: 'S/120', imagen: eloisa },
  { id: 'ariel', nombre: 'Vestido Ariel', precio: 'S/90', imagen: ariel },
  { id: 'dance', nombre: 'Vestido Dance', precio: 'S/75', imagen: dance },
  { id: 'realeza', nombre: 'Enterizo Realeza', precio: 'S/90', imagen: realeza }
];

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Narantha Boutique</title>
      </Helmet>

      <Header />

      <main className="flex-grow">

        <section className="w-full">
          <img
            src="/images/banner_1.png"
            alt="Banner Promocional Narantha"
            className="w-full h-auto"
          />
        </section>

        <section id="catalogo" className="py-8 px-4">
          <h2 className="text-2xl font-bold text-narantha-dark mb-4">Destacados</h2>

          <Swiper
            spaceBetween={15}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 }
            }}
          >
            {productos.map((p, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-lg shadow p-3 text-center h-full flex flex-col justify-between">
                  <div>
                    <img src={p.imagen} className="w-full h-48 object-cover rounded mb-3" alt={p.nombre} />
                    <h5 className="text-sm font-semibold">{p.nombre}</h5>
                    <p className="text-narantha-dark mb-2">{p.precio}</p>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <a
                      href="https://wa.me/51971998418"
                      target="_blank"
                      rel="noreferrer"
                      className="bg-narantha-orange text-white px-4 py-1 rounded text-sm"
                    >
                      Pedir por WhatsApp
                    </a>
                    <Link
                      to={`/producto/${p.id}`}
                      className="border border-narantha-orange text-narantha-orange px-4 py-1 rounded text-sm"
                    >
                      Ver producto
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <section id="frases" className="bg-narantha-cream py-10 text-center">
          <h2 className="text-xl font-bold mb-2">El alma de Narantha</h2>
          <p className="text-narantha-dark italic">
            “Vestirnos con esencia es recordarnos cada día que merecemos sentirnos hermosas.”
          </p>
        </section>

        <section id="contacto" className="py-10 px-4">
          <h2 className="text-center text-xl font-bold mb-6">Contáctanos</h2>
          <form
            action="https://formspree.io/f/tu-id"
            method="POST"
            className="mx-auto max-w-lg flex flex-col gap-4"
          >
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              className="p-3 border border-gray-300 rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Tu correo"
              className="p-3 border border-gray-300 rounded"
              required
            />
            <textarea
              name="mensaje"
              placeholder="Tu mensaje"
              className="p-3 border border-gray-300 rounded h-32"
            />
            <button
              type="submit"
              className="bg-narantha-orange text-white py-2 rounded font-semibold"
            >
              Enviar
            </button>
          </form>
        </section>
        <a
          href="https://wa.me/971998418?text=Hola%20quiero%20saber%20más%20sobre%20un%20producto"
          className="fixed bottom-4 right-4 z-50"
          target="_blank"
          rel="noreferrer"
        >
        </a>
      </main>
    </>
  );
}
