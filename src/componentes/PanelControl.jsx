import { useState } from 'react';

/**
 * PanelControl
 * Permite administrar la estructura del grafo.
 * Incluye agregar nodos, conectar nodos y generar grafos aleatorios.
 *
 * @param {Object} props
 * @param {Function} props.onAgregarNodo - Funcion para agregar un nuevo nodo.
 * @param {Function} props.onAgregarArista - Funcion para crear una nueva arista.
 * @param {Function} props.onGenerarAleatorio - Funcion para generar un grafo aleatorio.
 * @returns {JSX.Element}
 */
const PanelControl = ({ onAgregarNodo, onAgregarArista, onGenerarAleatorio }) => {

  // nodoDesde: almacena el id del nodo origen para crear aristas
  const [nodoDesde, setNodoDesde] = useState('');

  // nodoHasta: almacena el id del nodo destino para crear aristas
  const [nodoHasta, setNodoHasta] = useState('');

  /**
   * manejarAgregarArista
   * Ejecuta la accion de conectar dos nodos.
   */
  const manejarAgregarArista = () => {
    if (nodoDesde && nodoHasta) {
      onAgregarArista(parseInt(nodoDesde), parseInt(nodoHasta));
      setNodoDesde('');
      setNodoHasta('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">

      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Panel de Control
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Agregar Nodo */}
        <div className="border-2 border-gray-200 rounded p-4">
          <h3 className="font-semibold mb-2">
            Agregar Nodo
          </h3>

          <button
            onClick={onAgregarNodo}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Nuevo Nodo
          </button>
        </div>

        {/* Agregar Arista */}
        <div className="border-2 border-gray-200 rounded p-4">
          <h3 className="font-semibold mb-2">
            Conectar Nodos
          </h3>

          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Desde"
              value={nodoDesde}
              onChange={(e) => setNodoDesde(e.target.value)}
              className="w-1/2 border-2 border-gray-300 rounded px-2 py-1"
            />

            <input
              type="number"
              placeholder="Hasta"
              value={nodoHasta}
              onChange={(e) => setNodoHasta(e.target.value)}
              className="w-1/2 border-2 border-gray-300 rounded px-2 py-1"
            />
          </div>

          <button
            onClick={manejarAgregarArista}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Conectar
          </button>
        </div>

        {/* Generar grafo aleatorio */}
        <div className="border-2 border-gray-200 rounded p-4">
          <h3 className="font-semibold mb-2">
            Grafo Aleatorio
          </h3>

          <button
            onClick={onGenerarAleatorio}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
          >
            Generar
          </button>
        </div>

      </div>
    </div>
  );
};

export default PanelControl;
