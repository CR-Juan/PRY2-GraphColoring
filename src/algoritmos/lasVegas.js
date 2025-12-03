import { generarColorAleatorio, esColoracionValida, contarConflictos } from '../utilidades/grafoUtils';

/**
 * algoritmoLasVegas
 * Implementacion de un algoritmo de tipo Las Vegas para la coloracion de grafos.
 * Asigna colores aleatorios a todos los nodos en cada intento y verifica si
 * la coloracion resultante es valida (sin conflictos).
 *
 * - Si buscarSolucionValida es true, intentara indefinidamente hasta encontrar
 *   una coloracion valida o llegar a un limite de seguridad.
 * - Si buscarSolucionValida es false, se detendra al alcanzar maxIteraciones.
 *
 * @param {Array<Object>} nodos - Lista de nodos en formato plano.
 * @param {Array<Object>} aristas - Lista de aristas en formato plano.
 * @param {number} numColores - Numero de colores disponibles (k).
 * @param {number} maxIteraciones - Maximo de iteraciones permitidas si no se fuerza una solucion valida.
 * @param {boolean} buscarSolucionValida - Indica si se debe buscar necesariamente una coloracion valida.
 * @returns {Object} Resultado con nodos coloreados, exito, iteraciones, tiempo y evolucion de conflictos.
 */
export const algoritmoLasVegas = (nodos, aristas, numColores, maxIteraciones, buscarSolucionValida) => {
  // marca de tiempo inicial
  const inicio = performance.now();

  // contador de iteraciones realizadas
  let iteraciones = 0;

  // arreglo que contendra la mejor o ultima coloracion probada
  let nodosColoreados = [];

  // indica si se encontro una coloracion valida
  let exito = false;

  // registro de la evolucion de los conflictos a lo largo de las iteraciones
  const evolucionConflictos = [];

  // limite efectivo de iteraciones
  const limite = buscarSolucionValida ? Infinity : maxIteraciones;

  // bucle principal de intentos
  while (iteraciones < limite) {
    iteraciones++;

    // asignar colores aleatorios a todos los nodos
    nodosColoreados = nodos.map(nodo => ({
      ...nodo,
      color: generarColorAleatorio(numColores)
    }));

    // contar conflictos actuales en la coloracion
    const conflictosActuales = contarConflictos(nodosColoreados, aristas);
    
    // guardar el estado de conflictos solo cada cierto numero de iteraciones
    // para no saturar la grafica (cada 10 iteraciones o si no hay conflictos)
    if (iteraciones % 10 === 0 || conflictosActuales === 0) {
      evolucionConflictos.push({
        iteracion: iteraciones,
        conflictos: conflictosActuales
      });
    }

    // verificar si la coloracion es valida (sin conflictos)
    if (esColoracionValida(nodosColoreados, aristas)) {
      exito = true;
      break;
    }

    // limite de seguridad para proteger la interfaz
    // evita ciclos extremadamente largos
    if (iteraciones >= 50000) {
      break;
    }
  }

  // calculo del tiempo total de ejecucion
  const fin = performance.now();
  const tiempo = (fin - inicio).toFixed(2);

  // se devuelve un objeto resumen del resultado
  return {
    nodos: nodosColoreados,
    exito,
    iteraciones,
    tiempo,
    tipo: 'Las Vegas',
    evolucion: evolucionConflictos
  };
};
