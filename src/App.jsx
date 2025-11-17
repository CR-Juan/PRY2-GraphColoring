import { useState } from 'react';
import CanvasGrafo from './componentes/CanvasGrafo';
import PanelControl from './componentes/PanelControl';
import PanelAlgoritmo from './componentes/PanelAlgoritmo';
import { algoritmoLasVegas } from './algoritmos/lasVegas';
import { algoritmoMonteCarlo } from './algoritmos/monteCarlo';
import { detectarConflictos, contarConflictos } from './utilidades/grafoUtils';
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

  const [contadorNodos, setContadorNodos] = useState(4);
  const [estadisticas, setEstadisticas] = useState(null);

  // Agregar un nuevo nodo
  const agregarNodo = () => {
    const nuevoNodo = { id: contadorNodos, color: null };
    setNodos([...nodos, nuevoNodo]);
    setContadorNodos(contadorNodos + 1);
  };

  // Agregar una arista entre dos nodos
  const agregarArista = (desde, hasta) => {
    const nodoDesdeExiste = nodos.find(n => n.id === desde);
    const nodoHastaExiste = nodos.find(n => n.id === hasta);
    
    if (!nodoDesdeExiste || !nodoHastaExiste) {
      alert('Ambos nodos deben existir');
      return;
    }

    const aristaExiste = aristas.find(
      a => (a.desde === desde && a.hasta === hasta) || (a.desde === hasta && a.hasta === desde)
    );

    if (aristaExiste) {
      alert('Esta conexión ya existe');
      return;
    }

    setAristas([...aristas, { desde, hasta }]);
  };

  // Generar un grafo aleatorio
  const generarGrafoAleatorio = () => {
    const numNodos = Math.floor(Math.random() * 5) + 5;
    const nuevosNodos = [];
    
    for (let i = 1; i <= numNodos; i++) {
      nuevosNodos.push({ id: i, color: null });
    }

    const nuevasAristas = [];
    const numAristas = Math.floor(Math.random() * numNodos) + numNodos;
    
    for (let i = 0; i < numAristas; i++) {
      const desde = Math.floor(Math.random() * numNodos) + 1;
      const hasta = Math.floor(Math.random() * numNodos) + 1;
      
      if (desde !== hasta) {
        const aristaExiste = nuevasAristas.find(
          a => (a.desde === desde && a.hasta === hasta) || (a.desde === hasta && a.hasta === desde)
        );
        
        if (!aristaExiste) {
          nuevasAristas.push({ desde, hasta });
        }
      }
    }

    setNodos(nuevosNodos);
    setAristas(nuevasAristas);
    setContadorNodos(numNodos + 1);
    setEstadisticas(null);
  };

  // Ejecutar algoritmo de coloración
  const ejecutarAlgoritmo = (config) => {
    if (nodos.length === 0) {
      alert('Primero agrega nodos al grafo');
      return;
    }

    let resultado;

    if (config.tipo === 'lasVegas') {
      resultado = algoritmoLasVegas(
        nodos,
        aristas,
        config.numColores,
        config.maxIteraciones,
        config.buscarSolucionValida
      );
    } else {
      resultado = algoritmoMonteCarlo(
        nodos,
        aristas,
        config.numColores,
        config.maxIteraciones
      );
    }

    // Actualizar nodos con los colores
    setNodos(resultado.nodos);

    // Calcular estadísticas
    const conflictos = contarConflictos(resultado.nodos, aristas);
    
    setEstadisticas({
      tipo: resultado.tipo,
      iteraciones: resultado.iteraciones,
      tiempo: resultado.tiempo,
      conflictos: conflictos,
      exito: resultado.exito
    });
  };

  const manejarClickNodo = (idNodo) => {
    console.log('Nodo clickeado:', idNodo);
  };

  // Detectar conflictos para visualización
  const conflictosVisuales = detectarConflictos(nodos, aristas);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Coloración Probabilística de Grafos
        </h1>
        
        <PanelControl 
          onAgregarNodo={agregarNodo}
          onAgregarArista={agregarArista}
          onGenerarAleatorio={generarGrafoAleatorio}
        />

        <PanelAlgoritmo
          onEjecutarAlgoritmo={ejecutarAlgoritmo}
          estadisticas={estadisticas}
        />
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <CanvasGrafo 
            nodos={nodos}
            aristas={aristas}
            onNodoClick={manejarClickNodo}
            coloresConflicto={conflictosVisuales}
          />
        </div>
      </div>
    </div>
  );
}

export default App;