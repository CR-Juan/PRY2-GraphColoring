import { useState } from 'react';

/**
 * PanelAlgoritmo
 * Panel de configuracion y ejecucion de los algoritmos de coloracion,
 * ademas de mostrar un resumen de las estadisticas de la ultima ejecucion.
 *
 * @param {Object} props
 * @param {Function} props.onEjecutarAlgoritmo - Funcion que dispara la ejecucion del algoritmo.
 * @param {Object|null} props.estadisticas - Estadisticas de la ultima ejecucion.
 * @returns {JSX.Element}
 */
const PanelAlgoritmo = ({ onEjecutarAlgoritmo, estadisticas }) => {
  // tipoAlgoritmo: "lasVegas" o "monteCarlo"
  const [tipoAlgoritmo, setTipoAlgoritmo] = useState('lasVegas');

  // numColores: k para la coloracion
  const [numColores, setNumColores] = useState(3);

  // maxIteraciones: limite de iteraciones o intentos
  const [maxIteraciones, setMaxIteraciones] = useState(1000);

  // buscarSolucionValida: solo aplica cuando no hay auto-incremento de k
  const [buscarSolucionValida, setBuscarSolucionValida] = useState(true);

  // autoIncrementoK: si esta activo, el algoritmo incrementa k automaticamente
  const [autoIncrementoK, setAutoIncrementoK] = useState(false);

  /**
   * ejecutar
   * Construye un objeto de configuracion y llama al callback onEjecutarAlgoritmo.
   */
  const ejecutar = () => {
    onEjecutarAlgoritmo({
      tipo: tipoAlgoritmo,
      numColores,
      maxIteraciones,
      buscarSolucionValida,
      autoIncrementoK
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Algoritmo de Coloración</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuración */}
        <div className="space-y-4">
          {/* Tipo de algoritmo */}
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

          {/* Numero de colores (k) */}
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
              disabled={autoIncrementoK}
            />
            {autoIncrementoK && (
              <p className="text-xs text-blue-600 mt-1">
                Info: este valor se usara como k inicial para el auto-incremento.
              </p>
            )}
          </div>

          {/* Maximo de iteraciones o intentos por k */}
          <div>
            <label className="block font-semibold mb-2">
              {autoIncrementoK ? 'Intentos por valor de k:' : 'Máximo de Iteraciones:'} {maxIteraciones}
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
            {autoIncrementoK && maxIteraciones < 1000 && (
              <p className="text-xs text-red-600 mt-1">
                Se recomienda un minimo de 1000 intentos para obtener mejores resultados.
              </p>
            )}
          </div>

          {/* Opcion de buscar solucion valida solo cuando no hay auto-incremento */}
          {!autoIncrementoK && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="solucionValida"
                checked={buscarSolucionValida}
                onChange={(e) => setBuscarSolucionValida(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="solucionValida" className="font-semibold">
                Buscar solución válida (ignora el límite de iteraciones hasta encontrarla)
              </label>
            </div>
          )}

          {/* Auto-incremento de k */}
          <div className="border-2 border-purple-300 bg-purple-50 rounded p-3">
            <div className="flex items-center justify-center gap-2">
              <input
                type="checkbox"
                id="autoIncremento"
                checked={autoIncrementoK}
                onChange={(e) => setAutoIncrementoK(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="autoIncremento" className="font-semibold text-purple-700">
                Auto-incremento de k
              </label>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              Si no se encuentra solución con el k actual, se incrementa k automaticamente.
            </p>
          </div>

          {/* Boton de ejecucion */}
          <button
            onClick={ejecutar}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded text-lg"
          >
            Ejecutar Algoritmo
          </button>
        </div>

        {/* Estadísticas */}
        <div className="bg-gray-50 rounded p-4">
          <h3 className="font-bold text-lg mb-3">Estadísticas</h3>
          {estadisticas ? (
            <div className="space-y-2 text-sm">
              <p><strong>Algoritmo:</strong> {estadisticas.tipo}</p>

              {estadisticas.autoIncremento && (
                <>
                  <p><strong>k inicial:</strong> {estadisticas.kInicial}</p>
                  <p><strong>k final:</strong> {estadisticas.kFinal}</p>
                </>
              )}

              <p><strong>Iteraciones:</strong> {estadisticas.iteraciones}</p>
              <p><strong>Tiempo:</strong> {estadisticas.tiempo} ms</p>
              <p><strong>Conflictos:</strong> {estadisticas.conflictos}</p>
              <p>
                <strong>Estado:</strong>{' '}
                <span className={estadisticas.exito ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                  {estadisticas.exito ? 'Solución válida' : 'Coloración con conflictos'}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Ejecuta un algoritmo para ver estadísticas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelAlgoritmo;
