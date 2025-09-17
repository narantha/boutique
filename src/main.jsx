import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/main.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { HelmetProvider } from 'react-helmet-async';

AOS.init()

// ✅ Este bloque maneja redirecciones para rutas como /nosotros en GitHub Pages
const redirect = sessionStorage.redirect
if (redirect) {
  sessionStorage.removeItem('redirect')
  window.history.replaceState(null, '', redirect)
}

// 🎯 React inicia la app normalmente
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
)
