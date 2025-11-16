import { useState } from 'react';
import CanvasGrafo from './componentes/CanvasGrafo';
import './App.css';

function App() {
  const [nodos, setNodos] = useState([
    { id: 1, color: null },
    { id: 2, color: null },
    { id: 3, color: null }
  ]);

  const [aristas, setAristas] = useState([
    { desde: 1, hasta: 2 },
    { desde: 2, hasta: 3 }
  ]);

  const manejarClickNodo = (idNodo) => {
    console.log('Nodo clickeado:', idNodo);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Coloración Probabilística de Grafos
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <CanvasGrafo 
            nodos={nodos}
            aristas={aristas}
            onNodoClick={manejarClickNodo}
          />
        </div>
      </div>
    </div>
  );
}

export default App;