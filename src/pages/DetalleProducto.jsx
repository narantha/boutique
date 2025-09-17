// DetalleProducto.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import productos from '../data/productos';
import { Helmet } from 'react-helmet-async';

export default function DetalleProducto() {
    const { id } = useParams();
    const producto = productos.find((p) => p.id === id);
    const [colorSeleccionado, setColorSeleccionado] = useState(producto.colores?.[0]?.nombre || '');
    const [imagenActiva, setImagenActiva] = useState(0);
    const [modalAbierto, setModalAbierto] = useState(false);
    <Helmet>
        <title>{producto.nombre}</title>
    </Helmet>
    if (!producto) {
        return (
            <main className="p-10 text-center">
                <h1 className="text-2xl font-bold text-red-500">Producto no encontrado</h1>
            </main>
        );
    }

    const mensajeWhatsApp = `Hola, estoy interesada en el producto: *${producto.nombre}*\nColor: ${colorSeleccionado}`;

    const cambiarImagen = (direccion) => {
        const total = producto.galeria.length;
        if (direccion === 'prev') {
            setImagenActiva((prev) => (prev - 1 + total) % total);
        } else {
            setImagenActiva((prev) => (prev + 1) % total);
        }
    };

    return (
        <>

            <Header />

            {/* Modal ampliación de imagen */}
            {modalAbierto && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4">
                    <div className="relative bg-white p-4 rounded max-w-4xl w-full max-h-[90vh] overflow-auto shadow-xl">
                        {/* Botón de cerrar */}
                        <button
                            className="absolute top-3 right-4 text-gray-700 text-3xl font-bold hover:text-black transition"
                            onClick={() => setModalAbierto(false)}
                            aria-label="Cerrar"
                        >
                            &times;
                        </button>

                        {/* Imagen grande */}
                        <img
                            src={producto.galeria[imagenActiva]}
                            alt={`${producto.nombre} ampliada`}
                            className="w-full h-auto rounded shadow"
                        />
                    </div>
                </div>
            )}


            {/* Página principal */}
            <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
                {/* Carrusel mejorado */}
                <div className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-lg">
                    <img
                        src={producto.galeria[imagenActiva]}
                        alt={`${producto.nombre} ${imagenActiva + 1}`}
                        className="w-full h-auto object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                        onClick={() => setModalAbierto(true)}
                    />
                    {/* Flecha izquierda grande y elegante */}
                    <button
                        onClick={() => cambiarImagen('prev')}
                        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white text-narantha-dark hover:bg-narantha-orange hover:text-white shadow p-3 rounded-full z-10 transition"
                        aria-label="Anterior"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Flecha derecha */}
                    <button
                        onClick={() => cambiarImagen('next')}
                        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white text-narantha-dark hover:bg-narantha-orange hover:text-white shadow p-3 rounded-full z-10 transition"
                        aria-label="Siguiente"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>


                </div>

                {/* Detalles */}
                <div className="flex flex-col gap-6 text-gray-800">
                    <h1 className="text-4xl font-semibold">{producto.nombre}</h1>

                    <p className="text-lg leading-relaxed text-gray-600 whitespace-pre-line">
                        {producto.descripcion}
                    </p>

                    <p className="text-2xl font-bold text-narantha-dark">S/ {producto.precio}</p>

                    {/* Selector de color */}
                    {producto.colores?.length > 0 && (
                        <div>
                            <p className="text-sm text-gray-700 font-medium">Color:</p>
                            <div className="flex flex-wrap gap-3 mt-2">
                                {producto.colores.map((colorObj) => (
                                    <div key={colorObj.hex} className="relative group">
                                        <button
                                            onClick={() => setColorSeleccionado(colorObj.nombre)}
                                            className={`w-8 h-8 rounded-full border-2 ${colorSeleccionado === colorObj.nombre
                                                ? 'border-black scale-110'
                                                : 'border-gray-300'
                                                } transition transform duration-200`}
                                            style={{ backgroundColor: colorObj.hex }}
                                        ></button>
                                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-10">
                                            {colorObj.nombre}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA WhatsApp */}
                    <a
                        href={`https://wa.me/51971998418?text=${encodeURIComponent(mensajeWhatsApp)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block bg-narantha-orange text-white px-6 py-3 rounded font-medium hover:bg-orange-700 transition"
                    >
                        Pedir por WhatsApp
                    </a>
                </div>
            </div>
        </>
    );
}
