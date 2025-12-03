import CanvasGrafo from './componentes/CanvasGrafo';
import PanelControl from './componentes/PanelControl';
import PanelAlgoritmo from './componentes/PanelAlgoritmo';
import PanelEstadisticas from './componentes/PanelEstadisticas';
import ModalRecoloracion from './componentes/ModalRecoloracion';
import { useGrafo } from './hooks/useGrafo';
import { useColoracion } from './hooks/useColoracion';
import { useRecoloracion } from './hooks/useRecoloracion';
import './App.css';

/**
 * App - Componente principal de la aplicacion de coloracion probabilistica de grafos.
 * Se encarga de orquestar los paneles, el canvas del grafo y el modal de recoloracion.
 * 
 * @returns {JSX.Element} Interfaz principal de la aplicacion.
 */
function App() {
  // ----- useGrafo -----
  // grafo: objeto principal con la estructura del grafo (nodos y aristas)
  // nodos: lista de objetos Nodo
  // aristas: lista de objetos Arista
  // agregarNodo: funcion para agregar un nodo al grafo
  // agregarArista: funcion para agregar una arista entre dos nodos
  // generarGrafoAleatorio: genera un grafo aleatorio segun alguna configuracion interna
  // actualizarGrafo: actualiza el estado del grafo al aplicar cambios
  // conflictosVisuales: nodos o aristas en conflicto de color (para resaltarlos en el canvas)
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

  // ----- useColoracion -----
  // estadisticas: objeto con datos del ultimo algoritmo ejecutado (conflictos, tiempo, etc.)
  // historialEjecuciones: lista con el historial de ejecuciones anteriores
  // numColores: cantidad de colores usados / configurados para la k-coloracion
  // ejecutarAlgoritmo: funcion que corre el algoritmo de coloracion sobre el grafo actual
  // setEstadisticas: permite actualizar manualmente las estadisticas
  const {
    estadisticas,
    historialEjecuciones,
    numColores,
    ejecutarAlgoritmo,
    setEstadisticas
  } = useColoracion(grafo, actualizarGrafo);

  // ----- useRecoloracion -----
  // nodoSeleccionado: nodo actual sobre el que se va a realizar recoloracion manual
  // manejarClickNodo: handler para cuando el usuario hace click sobre un nodo en el canvas
  // manejarRecoloracion: aplica el nuevo color seleccionado al nodo
  // cerrarModal: cierra el modal de recoloracion
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
        
        {/* Panel para crear nodos, aristas y generar grafos aleatorios */}
        <PanelControl 
          onAgregarNodo={agregarNodo}
          onAgregarArista={agregarArista}
          onGenerarAleatorio={generarGrafoAleatorio}
        />

        {/* Panel para ejecutar el algoritmo de coloracion y ver info basica */}
        <PanelAlgoritmo
          onEjecutarAlgoritmo={ejecutarAlgoritmo}
          estadisticas={estadisticas}
        />
        
        {/* Seccion principal donde se dibuja el grafo */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-600 italic">
              💡 Tip: Haz click en un nodo coloreado para recolorearlo manualmente
            </p>

            {/* Mensaje extra mostrando la k-coloracion disponible */}
            {numColores >= 3 && (
              <div className="bg-purple-100 px-4 py-2 rounded-lg">
                <p className="text-sm font-semibold text-purple-700">
                  🎨 {numColores} posibles colores a usar (k-coloración)
                </p>
              </div>
            )}
          </div>

          {/* CanvasGrafo recibe nodos y aristas ya convertidos a JSON simples */}
          <CanvasGrafo 
            nodos={nodos.map(n => n.toJSON())}
            aristas={aristas.map(a => a.toJSON())}
            onNodoClick={manejarClickNodo}
            coloresConflicto={conflictosVisuales}
          />
        </div>

        {/* Panel que muestra estadisticas y el historial de ejecuciones */}
        <PanelEstadisticas 
          estadisticas={estadisticas}
          historialEjecuciones={historialEjecuciones}
        />
      </div>

      {/* Modal para recolorear un nodo especifico cuando hay uno seleccionado */}
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
