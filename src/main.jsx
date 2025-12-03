import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Obtiene el elemento HTML con id "root" donde se montara React
const root = document.getElementById('root')

// Crea la aplicacion React dentro del contenedor root
createRoot(root).render(

  // StrictMode ayuda a detectar errores y malas practicas en desarrollo
  <StrictMode>

    // Componente principal de la aplicacion
    <App />

  </StrictMode>
)
