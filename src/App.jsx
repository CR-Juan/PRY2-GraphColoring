import CanvasGrafo from './componentes/CanvasGrafo';
import PanelControl from './componentes/PanelControl';
import PanelAlgoritmo from './componentes/PanelAlgoritmo';
import PanelEstadisticas from './componentes/PanelEstadisticas';
import ModalRecoloracion from './componentes/ModalRecoloracion';
import { useGrafo } from './hooks/useGrafo';
import { useColoracion } from './hooks/useColoracion';
import { useRecoloracion } from './hooks/useRecoloracion';
import './App.css';

function App() {
  const {
    grafo,
    nodos,
    aristas,
    agregarNodo,
    agregarArista,
    generarGrafoAleatorio,
    actualizarGrafo,
    conflictos: conflictosVisuales
  } = useGrafo();

  const {
    estadisticas,
    historialEjecuciones,
    numColores,
    ejecutarAlgoritmo,
    setEstadisticas
  } = useColoracion(grafo, actualizarGrafo);

  const {
    nodoSeleccionado,
    manejarClickNodo,
    manejarRecoloracion,
    cerrarModal
  } = useRecoloracion(grafo, actualizarGrafo, estadisticas, setEstadisticas);

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
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-600 italic">
              💡 Tip: Haz click en un nodo coloreado para recolorearlo manualmente
            </p>
            {numColores >= 3 && (
              <div className="bg-purple-100 px-4 py-2 rounded-lg">
                <p className="text-sm font-semibold text-purple-700">
                  🎨 {numColores} posibles colores a usar (k-coloración)
                </p>
              </div>
            )}
          </div>
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
          onCerrar={cerrarModal}
        />
      )}
    </div>
  );
}

export default App;