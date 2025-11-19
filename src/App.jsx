import { useState } from 'react';
import CanvasGrafo from './componentes/CanvasGrafo';
import PanelControl from './componentes/PanelControl';
import PanelAlgoritmo from './componentes/PanelAlgoritmo';
import PanelEstadisticas from './componentes/PanelEstadisticas';
import ModalRecoloracion from './componentes/ModalRecoloracion';
import { algoritmoLasVegas } from './algoritmos/lasVegas';
import { algoritmoMonteCarlo } from './algoritmos/monteCarlo';
import { Grafo } from './utilidades/Grafo';
import { Nodo } from './utilidades/Nodo';
import { Arista } from './utilidades/Arista';
import './App.css';

function App() {
  // Inicializar con un Grafo
  const [grafo, setGrafo] = useState(() => {
    const g = new Grafo();
    g.agregarNodo(new Nodo(1));
    g.agregarNodo(new Nodo(2));
    g.agregarNodo(new Nodo(3));
    g.agregarArista(new Arista(1, 2));
    g.agregarArista(new Arista(2, 3));
    return g;
  });

  const [contadorNodos, setContadorNodos] = useState(4);
  const [estadisticas, setEstadisticas] = useState(null);
  const [historialEjecuciones, setHistorialEjecuciones] = useState([]);
  const [nodoSeleccionado, setNodoSeleccionado] = useState(null);
  const [numColores, setNumColores] = useState(3);
  const nodos = grafo.nodos;
  const aristas = grafo.aristas;

  // Agregar un nuevo nodo
  const agregarNodo = () => {
    setGrafo(prev => {
      const nuevoGrafo = prev.clonar();
      nuevoGrafo.agregarNodo(new Nodo(contadorNodos));
      return nuevoGrafo;
    });
    setContadorNodos(contadorNodos + 1);
  };

  // Agregar una arista entre dos nodos
  const agregarArista = (desde, hasta) => {
    try {
      setGrafo(prev => {
        const nuevoGrafo = prev.clonar();
        nuevoGrafo.agregarArista(new Arista(desde, hasta));
        return nuevoGrafo;
      });
    } catch (error) {
      alert(error.message);
    }
  };

  // Generar un grafo aleatorio
  const generarGrafoAleatorio = () => {
    const numNodos = Math.floor(Math.random() * 5) + 5;
    const nuevoGrafo = new Grafo();
    
    // Agregar nodos
    for (let i = 1; i <= numNodos; i++) {
      nuevoGrafo.agregarNodo(new Nodo(i));
    }

    // Agregar aristas aleatorias
    const numAristas = Math.floor(Math.random() * numNodos) + numNodos;
    let aristasCreadas = 0;
    let intentos = 0;
    const maxIntentos = numAristas * 3;
    
    while (aristasCreadas < numAristas && intentos < maxIntentos) {
      const desde = Math.floor(Math.random() * numNodos) + 1;
      const hasta = Math.floor(Math.random() * numNodos) + 1;
      
      if (desde !== hasta && !nuevoGrafo.existeArista(desde, hasta)) {
        try {
          nuevoGrafo.agregarArista(new Arista(desde, hasta));
          aristasCreadas++;
        } catch (error) {}
      }
      intentos++;
    }

    setGrafo(nuevoGrafo);
    setContadorNodos(numNodos + 1);
    setEstadisticas(null);
  };

  // Ejecutar algoritmo de coloración
  const ejecutarAlgoritmo = (config) => {
    if (grafo.nodos.length === 0) {
      alert('Primero agrega nodos al grafo');
      return;
    }

    setNumColores(config.numColores);
    
    // convirtiendo a objetos planos para los algoritmos lol
    const nodosPlanos = grafo.nodos.map(n => n.toJSON());
    const aristasPlanas = grafo.aristas.map(a => a.toJSON());
    
    let resultado;

    if (config.tipo === 'lasVegas') {
      resultado = algoritmoLasVegas(
        nodosPlanos,
        aristasPlanas,
        config.numColores,
        config.maxIteraciones,
        config.buscarSolucionValida
      );
    } else {
      resultado = algoritmoMonteCarlo(
        nodosPlanos,
        aristasPlanas,
        config.numColores,
        config.maxIteraciones
      );
    }

    // crear un nuevo grafo con la coloración resultante
    const nuevoGrafo = grafo.clonar();
    resultado.nodos.forEach(nodoPlano => {
      const nodo = nuevoGrafo.obtenerNodo(nodoPlano.id);
      if (nodo) {
        nodo.color = nodoPlano.color;
      }
    });

    setGrafo(nuevoGrafo);

    const conflictos = nuevoGrafo.contarConflictos();
    
    const nuevasEstadisticas = {
      tipo: resultado.tipo,
      iteraciones: resultado.iteraciones,
      tiempo: resultado.tiempo,
      conflictos: conflictos,
      exito: conflictos === 0,
      evolucion: resultado.evolucion || []
    };

    setEstadisticas(nuevasEstadisticas);
    setHistorialEjecuciones([...historialEjecuciones, nuevasEstadisticas]);
  };

  // Manejar click en nodo - abrir modal de recoloración
  const manejarClickNodo = (idNodo) => {
    const id = Number(idNodo);
    const nodo = grafo.obtenerNodo(id);
    
    if (nodo && nodo.estaColoreado()) {
      setNodoSeleccionado(nodo.toJSON());
    } else {
      alert('Este nodo aún no tiene color asignado. Ejecuta un algoritmo primero.');
    }
  };

  // Recolorear nodo manualmente
  const manejarRecoloracion = (idNodo, nuevoColor) => {
    setGrafo(prev => {
      const nuevoGrafo = prev.clonar();
      const nodo = nuevoGrafo.obtenerNodo(idNodo);
      if (nodo) {
        nodo.colorear(nuevoColor);
      }
      return nuevoGrafo;
    });
    
    if (estadisticas) {
      const nuevosConflictos = grafo.contarConflictos();
      setEstadisticas({ 
        ...estadisticas, 
        conflictos: nuevosConflictos, 
        exito: nuevosConflictos === 0 
      });
    }
    
    setNodoSeleccionado(null);
  };

  // su nombre lo dice todo
  const conflictosVisuales = grafo.detectarConflictos();

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
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <p className="text-sm text-gray-600 mb-3 italic">
            💡 Tip: Haz click en un nodo coloreado para recolorearlo manualmente
          </p>
          <CanvasGrafo 
            nodos={nodos.map(n => n.toJSON())}
            aristas={aristas.map(a => a.toJSON())}
            onNodoClick={manejarClickNodo}
            coloresConflicto={conflictosVisuales}
          />
        </div>

        <PanelEstadisticas 
          estadisticas={estadisticas}
          historialEjecuciones={historialEjecuciones}
        />
      </div>

      {nodoSeleccionado && (
        <ModalRecoloracion
          nodo={nodoSeleccionado}
          nodos={nodos.map(n => n.toJSON())}
          aristas={aristas.map(a => a.toJSON())}
          numColores={numColores}
          onRecolorear={manejarRecoloracion}
          onCerrar={() => setNodoSeleccionado(null)}
        />
      )}
    </div>
  );
}

export default App;