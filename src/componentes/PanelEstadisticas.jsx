import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * PanelEstadisticas
 * Muestra informacion detallada del resultado de la ejecucion de algoritmos,
 * incluyendo resultados actuales, grafica de evolucion y el historial completo.
 *
 * @param {Object} props
 * @param {Object|null} props.estadisticas - Datos de la ultima ejecucion.
 * @param {Array<Object>} props.historialEjecuciones - Lista completa de ejecuciones.
 * @returns {JSX.Element}
 */
const PanelEstadisticas = ({ estadisticas, historialEjecuciones }) => {
  const [graficaExpandida, setGraficaExpandida] = useState(false);
  const [modoRendimiento, setModoRendimiento] = useState(true);
  const [anchoGrafica, setAnchoGrafica] = useState(100);

  const datosOptimizados = useMemo(() => {
    if (!estadisticas?.evolucion) return [];
    
    const datos = estadisticas.evolucion;
    const totalPuntos = datos.length;
    
    if (!modoRendimiento) return datos;
    
    if (totalPuntos <= 1000) return datos;
    
    const factorReduccion = Math.ceil(totalPuntos / 1000);
    return datos.filter((_, index) => index % factorReduccion === 0 || index === totalPuntos - 1);
  }, [estadisticas?.evolucion, modoRendimiento]);

  const metricas = useMemo(() => {
    if (!estadisticas?.evolucion || estadisticas.evolucion.length === 0) return null;
    
    const conflictos = estadisticas.evolucion.map(d => d.conflictos);
    return {
      min: Math.min(...conflictos),
      max: Math.max(...conflictos),
      promedio: (conflictos.reduce((a, b) => a + b, 0) / conflictos.length).toFixed(2)
    };
  }, [estadisticas?.evolucion]);

  if (!estadisticas && (!historialEjecuciones || historialEjecuciones.length === 0)) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-xl p-8 border border-blue-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Estadísticas</h2>
          <p className="text-gray-600 text-lg">Ejecuta un algoritmo para ver estadísticas detalladas</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-2xl p-8 border border-gray-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Estadísticas Detalladas</h2>
        </div>

        {/* Estadísticas Actuales */}
        {estadisticas && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-700">Última Ejecución</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200 transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-blue-700">Algoritmo</p>
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-blue-900">{estadisticas.tipo}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200 transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-green-700">Iteraciones</p>
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-green-900">{estadisticas.iteraciones.toLocaleString()}</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg border border-yellow-200 transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-yellow-700">Tiempo</p>
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-yellow-900">{estadisticas.tiempo}ms</p>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-lg border border-red-200 transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-red-700">Conflictos</p>
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-red-900">{estadisticas.conflictos}</p>
              </div>
              
              <div className={`bg-gradient-to-br ${estadisticas.exito ? 'from-emerald-50 to-emerald-100 border-emerald-200' : 'from-rose-50 to-rose-100 border-rose-200'} p-6 rounded-xl shadow-lg border transform hover:scale-105 transition-transform duration-200`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm font-medium ${estadisticas.exito ? 'text-emerald-700' : 'text-rose-700'}`}>Estado</p>
                  <svg className={`w-5 h-5 ${estadisticas.exito ? 'text-emerald-500' : 'text-rose-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {estadisticas.exito ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </div>
                <p className={`text-xl font-bold ${estadisticas.exito ? 'text-emerald-900' : 'text-rose-900'}`}>
                  {estadisticas.exito ? '✓ Válida' : '✗ Con conflictos'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Gráfica de Evolución */}
        {estadisticas && datosOptimizados.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-700">Evolución de Conflictos</h3>
              </div>
              <button
                onClick={() => setGraficaExpandida(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="font-semibold">Expandir</span>
              </button>
            </div>

            {/* Métricas de la gráfica */}
            {metricas && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 font-medium">Mín. Conflictos</p>
                  <p className="text-xl font-bold text-blue-900">{metricas.min}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-700 font-medium">Promedio</p>
                  <p className="text-xl font-bold text-purple-900">{metricas.promedio}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                  <p className="text-xs text-pink-700 font-medium">Máx. Conflictos</p>
                  <p className="text-xl font-bold text-pink-900">{metricas.max}</p>
                </div>
              </div>
            )}

            {/* Control de Modo Rendimiento */}
            {estadisticas.evolucion.length > 1000 && (
              <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-800">Modo Rendimiento</p>
                      <p className="text-sm text-gray-600">
                        {modoRendimiento 
                          ? `Mostrando ${datosOptimizados.length.toLocaleString()} de ${estadisticas.evolucion.length.toLocaleString()} puntos` 
                          : 'Mostrando todos los puntos (puede ser lento)'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setModoRendimiento(!modoRendimiento)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      modoRendimiento ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        modoRendimiento ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Información de optimización */}
            {modoRendimiento && estadisticas.evolucion.length > datosOptimizados.length && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">Modo optimizado activo:</span> Mostrando {datosOptimizados.length.toLocaleString()} de {estadisticas.evolucion.length.toLocaleString()} puntos para mejor rendimiento
                  </p>
                </div>
              </div>
            )}

            {/* Control de Zoom/Ancho */}
            <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                  Zoom gráfica:
                </label>
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="50"
                  value={anchoGrafica}
                  onChange={(e) => setAnchoGrafica(Number(e.target.value))}
                  className="flex-1 h-2 bg-gradient-to-r from-purple-200 to-pink-300 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full min-w-[70px] text-center">
                  {anchoGrafica}%
                </span>
                <button
                  onClick={() => setAnchoGrafica(100)}
                  className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg transition-colors whitespace-nowrap"
                >
                  Restablecer
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
              <div style={{ width: `${anchoGrafica}%`, minWidth: '100%', transition: 'width 0.3s ease' }}>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={datosOptimizados}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="iteracion" 
                      label={{ value: 'Iteración', position: 'insideBottom', offset: -5, style: { fontWeight: 'bold' } }}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      label={{ value: 'Conflictos', angle: -90, position: 'insideLeft', style: { fontWeight: 'bold' } }}
                      stroke="#6b7280"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="conflictos" 
                      stroke="url(#colorGradient)" 
                      strokeWidth={3}
                      dot={datosOptimizados.length <= 500 ? { r: 4, fill: '#3b82f6' } : false}
                      activeDot={{ r: 6 }}
                      name="Conflictos"
                      isAnimationActive={false}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* Historial de Ejecuciones */}
        {historialEjecuciones && historialEjecuciones.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-700">
                Historial de Ejecuciones 
                <span className="ml-2 text-lg text-gray-500">({historialEjecuciones.length} total)</span>
              </h3>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-auto max-h-96">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-gray-100 to-gray-200 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">#</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Algoritmo</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Iteraciones</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Tiempo (ms)</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Conflictos</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {historialEjecuciones.slice().reverse().map((ejecucion, index) => (
                      <tr key={index} className="hover:bg-blue-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
                            {historialEjecuciones.length - index}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">{ejecucion.tipo}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{ejecucion.iteraciones.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{ejecucion.tiempo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                            ejecucion.conflictos === 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {ejecucion.conflictos}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                            ejecucion.exito 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {ejecucion.exito ? '✓ Válida' : '✗ Conflictos'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Gráfica Expandida */}
      {graficaExpandida && datosOptimizados && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setGraficaExpandida(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-auto animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">Evolución de Conflictos - Vista Detallada</h3>
                </div>
                <button
                  onClick={() => setGraficaExpandida(false)}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="font-semibold">Cerrar</span>
                </button>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
                <ResponsiveContainer width="100%" height={650}>
                  <LineChart data={datosOptimizados}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis 
                      dataKey="iteracion" 
                      label={{ value: 'Iteración', position: 'insideBottom', offset: -5, style: { fontWeight: 'bold', fontSize: 14 } }}
                      stroke="#475569"
                    />
                    <YAxis 
                      label={{ value: 'Conflictos', angle: -90, position: 'insideLeft', style: { fontWeight: 'bold', fontSize: 14 } }}
                      stroke="#475569"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '2px solid #3b82f6', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend wrapperStyle={{ fontWeight: 'bold' }} />
                    <Line 
                      type="monotone" 
                      dataKey="conflictos" 
                      stroke="url(#colorGradientExpanded)" 
                      strokeWidth={3}
                      dot={datosOptimizados.length <= 500 ? { r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' } : false}
                      activeDot={{ r: 7, fill: '#ef4444' }}
                      name="Conflictos"
                      isAnimationActive={false}
                    />
                    <defs>
                      <linearGradient id="colorGradientExpanded" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        /* Estilos para el slider de zoom */
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s;
        }
        
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </>
  );
};

export default PanelEstadisticas;
