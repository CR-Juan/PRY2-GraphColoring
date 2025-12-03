import { algoritmoLasVegas } from './lasVegas';
import { algoritmoMonteCarlo } from './monteCarlo';
import { contarConflictos } from '../utilidades/grafoUtils';

/**
 * algoritmoConAutoIncrementoK
 * Ejecuta un algoritmo de coloracion (Las Vegas o Monte Carlo) aumentando
 * automaticamente el valor de k hasta encontrar una solucion valida o
 * llegar a un k maximo.
 *
 * @param {Array<Object>} nodos - Lista de nodos en formato plano.
 * @param {Array<Object>} aristas - Lista de aristas en formato plano.
 * @param {number} kInicial - Valor inicial de k (numero de colores).
 * @param {string} tipoAlgoritmo - Tipo de algoritmo: "lasVegas" o "monteCarlo".
 * @param {number} intentosPorK - Cantidad maxima de iteraciones/intentos por valor de k.
 * @param {number} kMaximo - Valor maximo de k permitido.
 * @returns {Object} Resultado de la ejecucion con informacion de nodos, tiempo y estadisticas.
 */
export const algoritmoConAutoIncrementoK = (
  nodos, 
  aristas, 
  kInicial, 
  tipoAlgoritmo, 
  intentosPorK = 1000,
  kMaximo = 10
) => {
  // Marca de tiempo de inicio total
  const inicioTotal = performance.now();

  // kActual: valor de k con el que se esta probando
  let kActual = kInicial;

  // resultado: ultimo resultado devuelto por el algoritmo base
  let resultado = null;

  // historialIntentos: almacena informacion de cada intento con cada k
  let historialIntentos = [];

  // iteracionesTotales: suma de iteraciones usadas en todos los intentos
  let iteracionesTotales = 0;

  // Bucle principal: incrementa k hasta encontrar solucion o llegar al maximo
  while (kActual <= kMaximo) {
    console.log(`Intentando con k = ${kActual}...`);
    
    // Ejecutar algoritmo con k actual
    if (tipoAlgoritmo === 'lasVegas') {
      resultado = algoritmoLasVegas(nodos, aristas, kActual, intentosPorK, false);
    } else {
      resultado = algoritmoMonteCarlo(nodos, aristas, kActual, intentosPorK);
    }

    iteracionesTotales += resultado.iteraciones;

    // Registrar intento en el historial
    historialIntentos.push({
      k: kActual,
      iteraciones: resultado.iteraciones,
      conflictos: contarConflictos(resultado.nodos, aristas),
      exito: resultado.exito
    });

    // Si se encontro una solucion valida, se detiene el proceso
    if (resultado.exito) {
      console.log(`Solucion encontrada con k = ${kActual}`);
      break;
    }

    // Si no hay exito, se incrementa k y se repite
    console.log(`No se encontro solucion con k = ${kActual}. Incrementando k...`);
    kActual++;
  }

  // Tiempo total de ejecucion
  const finTotal = performance.now();
  const tiempoTotal = (finTotal - inicioTotal).toFixed(2);

  // Se devuelve un resumen de la ejecucion completa
  return {
    nodos: resultado.nodos,
    exito: resultado.exito,
    iteraciones: iteracionesTotales,
    tiempo: tiempoTotal,
    tipo: `${tipoAlgoritmo === 'lasVegas' ? 'Las Vegas' : 'Monte Carlo'} + Auto K`,
    kInicial: kInicial,
    kFinal: kActual,
    historialIntentos: historialIntentos,
    autoIncremento: true
  };
};
