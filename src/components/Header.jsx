import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            src="/images/logo_header.png"
            alt="Logo Narantha"
            className="w-24 h-auto object-contain"
          />
        </Link>

        <button
          className="lg:hidden text-narantha-dark"
          onClick={() => setOpen(!open)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <nav className={`flex-col gap-4 lg:flex lg:flex-row lg:items-center text-sm font-medium ${open ? 'flex' : 'hidden'} lg:flex`}>
          <a href="#catalogo" className="px-3 py-2 hover:text-narantha-orange">Colección</a>
          <a href="#frases" className="px-3 py-2 hover:text-narantha-orange">Frases</a>
          <a href="#contacto" className="px-3 py-2 hover:text-narantha-orange">Contacto</a>
          <Link to="/nosotros" className="px-3 py-2 hover:text-narantha-orange">Nosotros</Link>
          <Link to="/valores" className="nav-link">Valores y Propósito</Link>
          <Link to="/blog" className="hover:text-rose-600">Blog</Link>
        </nav>
      </div>
    </header>
  );
}
