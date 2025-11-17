import { useState } from 'react';

const PanelAlgoritmo = ({ onEjecutarAlgoritmo, estadisticas }) => {
  const [tipoAlgoritmo, setTipoAlgoritmo] = useState('lasVegas');
  const [numColores, setNumColores] = useState(3);
  const [maxIteraciones, setMaxIteraciones] = useState(1000);
  const [buscarSolucionValida, setBuscarSolucionValida] = useState(true);

  const ejecutar = () => {
    onEjecutarAlgoritmo({
      tipo: tipoAlgoritmo,
      numColores,
      maxIteraciones,
      buscarSolucionValida
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Algoritmo de Coloración</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuración */}
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Tipo de Algoritmo</label>
            <select
              value={tipoAlgoritmo}
              onChange={(e) => setTipoAlgoritmo(e.target.value)}
              className="w-full border-2 border-gray-300 rounded px-3 py-2"
            >
              <option value="lasVegas">Las Vegas</option>
              <option value="monteCarlo">Monte Carlo</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Número de Colores (k): {numColores}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={numColores}
              onChange={(e) => setNumColores(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Máximo de Iteraciones: {maxIteraciones}
            </label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={maxIteraciones}
              onChange={(e) => setMaxIteraciones(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="solucionValida"
              checked={buscarSolucionValida}
              onChange={(e) => setBuscarSolucionValida(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="solucionValida" className="font-semibold">
              Buscar solución válida (sin límite de intentos)
            </label>
          </div>

          <button
            onClick={ejecutar}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded text-lg"
          >
            🚀 Ejecutar Algoritmo
          </button>
        </div>

        {/* Estadísticas */}
        <div className="bg-gray-50 rounded p-4">
          <h3 className="font-bold text-lg mb-3">Estadísticas</h3>
          {estadisticas ? (
            <div className="space-y-2 text-sm">
              <p><strong>Algoritmo:</strong> {estadisticas.tipo}</p>
              <p><strong>Iteraciones:</strong> {estadisticas.iteraciones}</p>
              <p><strong>Tiempo:</strong> {estadisticas.tiempo}ms</p>
              <p><strong>Conflictos:</strong> {estadisticas.conflictos}</p>
              <p><strong>Estado:</strong> 
                <span className={estadisticas.exito ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                  {estadisticas.exito ? ' ✓ Solución válida' : ' ✗ Con conflictos'}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-gray-500 italic">Ejecuta un algoritmo para ver estadísticas</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelAlgoritmo;