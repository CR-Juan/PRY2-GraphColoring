import { useRef, useEffect } from 'react';
import { Network } from 'vis-network';

const CanvasGrafo = ({ nodos, aristas, onNodoClick, coloresConflicto = [] }) => {
  const contenedorRef = useRef(null);
  const redRef = useRef(null);

  useEffect(() => {
  if (!contenedorRef.current) return;

  const datosNodos = nodos.map(nodo => ({
    id: nodo.id,
    label: `${nodo.id}`,
    color: nodo.color || '#CCCCCC',
    borderWidth: 2,
    borderColor: '#000000'
  }));

  const datosAristas = aristas.map(arista => ({
    from: arista.desde,
    to: arista.hasta,
    color: coloresConflicto.includes(`${arista.desde}-${arista.hasta}`) 
      ? '#FF0000' 
      : '#848484',
    width: coloresConflicto.includes(`${arista.desde}-${arista.hasta}`) ? 3 : 1
  }));

  const datos = {
    nodes: datosNodos,
    edges: datosAristas
  };

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

  // DESTRUIR Y RECREAR la red cada vez
  if (redRef.current) {
    redRef.current.destroy();
    redRef.current = null;
  }

  redRef.current = new Network(contenedorRef.current, datos, opciones);
  
  // Evento de click en nodo
  redRef.current.on('click', (params) => {
    if (params.nodes.length > 0 && onNodoClick) {
      const idNodo = params.nodes[0];
      console.log('ID del nodo clickeado:', idNodo, 'Tipo:', typeof idNodo);
      onNodoClick(idNodo);
    }
  });

}, [nodos, aristas, coloresConflicto, onNodoClick]);

  return (
    <div 
      ref={contenedorRef} 
      className="w-full h-[600px] border-2 border-gray-300 rounded-lg bg-white"
    />
  );
};

export default CanvasGrafo;