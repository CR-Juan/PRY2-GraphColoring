import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PanelEstadisticas = ({ estadisticas, historialEjecuciones }) => {
  if (!estadisticas && (!historialEjecuciones || historialEjecuciones.length === 0)) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Estadísticas</h2>
        <p className="text-gray-500 italic">Ejecuta un algoritmo para ver estadísticas detalladas</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Estadísticas Detalladas</h2>

      {/* Estadísticas Actuales */}
      {estadisticas && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Última Ejecución</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600">Algoritmo</p>
              <p className="text-lg font-bold text-blue-600">{estadisticas.tipo}</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-600">Iteraciones</p>
              <p className="text-lg font-bold text-green-600">{estadisticas.iteraciones.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <p className="text-sm text-gray-600">Tiempo</p>
              <p className="text-lg font-bold text-yellow-600">{estadisticas.tiempo}ms</p>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <p className="text-sm text-gray-600">Conflictos</p>
              <p className="text-lg font-bold text-red-600">{estadisticas.conflictos}</p>
            </div>
            <div className={`${estadisticas.exito ? 'bg-green-50' : 'bg-red-50'} p-4 rounded`}>
              <p className="text-sm text-gray-600">Estado</p>
              <p className={`text-lg font-bold ${estadisticas.exito ? 'text-green-600' : 'text-red-600'}`}>
                {estadisticas.exito ? '✓ Válida' : '✗ Con conflictos'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gráfica de Evolución */}
      {estadisticas && estadisticas.evolucion && estadisticas.evolucion.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Evolución de Conflictos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={estadisticas.evolucion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="iteracion" 
                label={{ value: 'Iteración', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: 'Conflictos', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="conflictos" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Conflictos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Historial de Ejecuciones */}
      {historialEjecuciones && historialEjecuciones.length > 0 && (
        <div>
            <h3 className="text-xl font-semibold mb-3">
                Historial de Ejecuciones ({historialEjecuciones.length} total)
            </h3>
        <div className="overflow-auto max-h-96 border border-gray-300 rounded">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b text-left">#</th>
                  <th className="px-4 py-2 border-b text-left">Algoritmo</th>
                  <th className="px-4 py-2 border-b text-left">Iteraciones</th>
                  <th className="px-4 py-2 border-b text-left">Tiempo (ms)</th>
                  <th className="px-4 py-2 border-b text-left">Conflictos</th>
                  <th className="px-4 py-2 border-b text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {historialEjecuciones.slice().reverse().map((ejecucion, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{historialEjecuciones.length - index}</td>
                    <td className="px-4 py-2 border-b">{ejecucion.tipo}</td>
                    <td className="px-4 py-2 border-b">{ejecucion.iteraciones.toLocaleString()}</td>
                    <td className="px-4 py-2 border-b">{ejecucion.tiempo}</td>
                    <td className="px-4 py-2 border-b">{ejecucion.conflictos}</td>
                    <td className="px-4 py-2 border-b">
                      <span className={`font-semibold ${ejecucion.exito ? 'text-green-600' : 'text-red-600'}`}>
                        {ejecucion.exito ? '✓' : '✗'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelEstadisticas;