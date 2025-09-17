import React from 'react';
import { Link } from 'react-router-dom';

export default function Blog() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Nuestro Blog</h1>
      
      <article className="mb-10">
        <h2 className="text-xl font-semibold mb-2 text-rose-600">Empezar desde abajo: lo que nadie te dice, pero toda mujer debería saber</h2>
        <p className="text-gray-700 mb-4">
          Narantha nació desde abajo, desde el esfuerzo de dos hermanas, una que trabajaba lejos y otra que vendía con valentía en ferias y calles de Piura...
        </p>
        <Link
          to="/blog/empezar-desde-abajo"
          className="text-rose-500 hover:underline font-medium"
        >
          Leer artículo completo →
        </Link>
      </article>

      {/* Aquí puedes agregar más artículos */}
    </main>
  );
}
