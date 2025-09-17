import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Valores from './pages/valores';
import Layout from './components/Layout';
import DetalleProducto from './pages/DetalleProducto';
import Blog from './pages/Blog';
import EmpezarDesdeAbajo from './pages/articulos/empezardesdeabajo'; // lo crearemos en el siguiente paso


function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/valores" element={<Valores />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/empezar-desde-abajo" element={<EmpezarDesdeAbajo />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
