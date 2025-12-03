import { useRef, useEffect } from 'react';
import { Network } from 'vis-network';

/**
 * CanvasGrafo
 * Componente encargado de renderizar el grafo usando vis-network.
 * Dibuja nodos, aristas y maneja eventos de seleccion de nodos.
 *
 * @param {Object} props
 * @param {Array<Object>} props.nodos - Lista de nodos en formato plano.
 * @param {Array<Object>} props.aristas - Lista de aristas en formato plano.
 * @param {Function} props.onNodoClick - Handler al hacer click en un nodo.
 * @param {Array<string>} props.coloresConflicto - Lista de aristas en conflicto (formato "a-b").
 * @returns {JSX.Element} Contenedor del canvas.
 */
const CanvasGrafo = ({ nodos, aristas, onNodoClick, coloresConflicto = [] }) => {

  // Referencia al div donde se renderiza la red
  const contenedorRef = useRef(null);

  // Referencia a la instancia de vis-network
  const redRef = useRef(null);

  /**
   * useEffect principal
   * Se ejecuta cada vez que cambian nodos, aristas o conflictos.
   * Reconstruye la red completamente.
   */
  useEffect(() => {
    // Si el contenedor aun no existe, se detiene la ejecucion
    if (!contenedorRef.current) return;

    /**
     * Transforma los nodos a formato vis-network
     */
    const datosNodos = nodos.map(nodo => ({
      id: nodo.id,
      label: `${nodo.id}`,
      color: nodo.color || '#CCCCCC',
      borderWidth: 2,
      borderColor: '#000000'
    }));

    /**
     * Transforma las aristas a formato vis-network
     */
    const datosAristas = aristas.map(arista => ({
      from: arista.desde,
      to: arista.hasta,
      color: coloresConflicto.includes(`${arista.desde}-${arista.hasta}`) 
        ? '#FF0000' 
        : '#848484',
      width: coloresConflicto.includes(`${arista.desde}-${arista.hasta}`) ? 3 : 1
    }));

    /**
     * Objeto de datos final para la red
     */
    const datos = {
      nodes: datosNodos,
      edges: datosAristas
    };

    /**
     * Opciones de comportamiento y apariencia del grafo
     */
    const opciones = {
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -2000,
          springLength: 150
        }
      },
      interaction: {
        hover: true,
        dragNodes: true
      },
      nodes: {
        shape: 'dot',
        size: 20,
        font: {
          size: 14,
          color: '#000000'
        }
      }
    };

    /**
     * Destruye la red anterior si existe
     * Esto evita duplicaciones o errores visuales
     */
    if (redRef.current) {
      redRef.current.destroy();
      redRef.current = null;
    }

    /**
     * Crea una nueva instancia de vis-network
     */
    redRef.current = new Network(contenedorRef.current, datos, opciones);

    /**
     * Evento de seleccion de nodo
     * Se llama cuando el usuario hace click sobre un nodo
     */
    redRef.current.on('click', (params) => {
      if (params.nodes.length > 0 && onNodoClick) {
        const idNodo = params.nodes[0];
        onNodoClick(idNodo);
      }
    });

  }, [nodos, aristas, coloresConflicto, onNodoClick]);

  /**
   * Render del contenedor grafico
   */
  return (
    <div 
      ref={contenedorRef} 
      className="w-full h-[600px] border-2 border-gray-300 rounded-lg bg-white"
    />
  );
};

export default CanvasGrafo;
