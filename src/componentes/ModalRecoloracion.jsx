import { useState, useEffect } from 'react';
import { calcularProbabilidadExito, contarNodosARecolorear } from '../algoritmos/busquedaLocal';

const ModalRecoloracion = ({ nodo, nodos, aristas, numColores, onRecolorear, onCerrar }) => {
  const [colorSeleccionado, setColorSeleccionado] = useState(nodo.color);
  const [probabilidad, setProbabilidad] = useState(100);
  const [nodosAfectados, setNodosAfectados] = useState(0);

  const coloresDisponibles = [
    { hex: '#FF6B6B', nombre: 'Rojo' },
    { hex: '#4ECDC4', nombre: 'Cyan' },
    { hex: '#45B7D1', nombre: 'Azul' },
    { hex: '#FFA07A', nombre: 'Naranja' },
    { hex: '#98D8C8', nombre: 'Verde Agua' },
    { hex: '#F7DC6F', nombre: 'Amarillo' },
    { hex: '#BB8FCE', nombre: 'Morado' },
    { hex: '#85C1E2', nombre: 'Azul Claro' },
    { hex: '#F8B88B', nombre: 'Durazno' },
    { hex: '#ABEBC6', nombre: 'Verde Menta' },
  ].slice(0, numColores);

  useEffect(() => {
    if (colorSeleccionado) {
      const prob = calcularProbabilidadExito(nodos, aristas, nodo.id, colorSeleccionado, numColores);
      setProbabilidad(prob);
      
      // Calcular nodos que tendrían conflictos con este color
      const nodosTemp = nodos.map(n => n.id === nodo.id ? { ...n, color: colorSeleccionado } : n);
      const afectados = contarNodosARecolorear(nodosTemp, aristas, nodo.id);
      setNodosAfectados(afectados);
    }
  }, [colorSeleccionado, nodos, aristas, nodo.id, numColores]);

  const manejarRecolorear = () => {
    onRecolorear(nodo.id, colorSeleccionado);
    onCerrar();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Recolorear Nodo {nodo.id}</h2>
        
        <div className="mb-4">
          <label className="block font-semibold mb-2">Seleccionar Color:</label>
          <div className="grid grid-cols-5 gap-2">
            {coloresDisponibles.map((color) => (
              <button
                key={color.hex}
                onClick={() => setColorSeleccionado(color.hex)}
                className={`w-12 h-12 rounded-lg border-4 transition-all ${
                  colorSeleccionado === color.hex 
                    ? 'border-black scale-110' 
                    : 'border-gray-300 hover:border-gray-500'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.nombre}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-100 rounded p-4 mb-4">
          <p className="font-semibold mb-2">Análisis de Recoloración:</p>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Probabilidad de éxito:</strong>{' '}
              <span className={`font-bold ${
                probabilidad >= 70 ? 'text-green-600' : 
                probabilidad >= 40 ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                {probabilidad}%
              </span>
            </p>
            <p>
              <strong>Nodos en conflicto:</strong>{' '}
              <span className={`font-bold ${nodosAfectados === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {nodosAfectados}
              </span>
            </p>
            {nodosAfectados > 0 && (
              <p className="text-red-600 text-xs italic mt-2">
                ⚠️ Este color causará conflictos. Se necesitarán {nodosAfectados} recoloraciones adicionales.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={manejarRecolorear}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Aplicar
          </button>
          <button
            onClick={onCerrar}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRecoloracion;