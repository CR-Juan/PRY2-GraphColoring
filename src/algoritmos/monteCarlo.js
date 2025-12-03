import { generarColorAleatorio, contarConflictos } from '../utilidades/grafoUtils';

/**
 * algoritmoMonteCarlo
 * Implementacion de un algoritmo de tipo Monte Carlo para la coloracion de grafos.
 * Intenta distintas coloraciones aleatorias y conserva la mejor solucion encontrada
 * segun la minima cantidad de conflictos.
 *
 * A diferencia de Las Vegas, este algoritmo no garantiza encontrar una solucion valida,
 * sino que busca mejorar progresivamente el resultado.
 *
 * @param {Array<Object>} nodos - Lista de nodos en formato plano.
 * @param {Array<Object>} aristas - Lista de aristas en formato plano.
 * @param {number} numColores - Numero de colores disponibles (k).
 * @param {number} maxIteraciones - Numero maximo de intentos aleatorios.
 * @returns {Object} Resultado con la mejor solucion encontrada, estadisticas y evolucion.
 */
export const algoritmoMonteCarlo = (nodos, aristas, numColores, maxIteraciones) => {

  // Marca de tiempo inicial
  const inicio = performance.now();

  // Almacena la mejor solucion encontrada hasta el momento
  let mejorSolucion = null;

  // Numero de conflictos de la mejor solucion encontrada
  let menorConflictos = Infinity;

  // Registro de la evolucion del proceso
  const evolucionConflictos = [];

  // Bucle principal de iteraciones
  for (let i = 0; i < maxIteraciones; i++) {

    // Asignar colores aleatorios a todos los nodos
    const nodosColoreados = nodos.map(nodo => ({
      ...nodo,
      color: generarColorAleatorio(numColores)
    }));

    // Contar conflictos para esta configuracion
    const conflictos = contarConflictos(nodosColoreados, aristas);

    // Registrar evolucion cada 10 iteraciones
    if (i % 10 === 0) {
      evolucionConflictos.push({
        iteracion: i + 1,
        conflictos: menorConflictos === Infinity ? conflictos : menorConflictos
      });
    }

    // Actualizar mejor solucion si se encuentra una peor cantidad de conflictos
    if (conflictos < menorConflictos) {
      menorConflictos = conflictos;
      mejorSolucion = nodosColoreados;

      // Guardar mejora puntual
      evolucionConflictos.push({
        iteracion: i + 1,
        conflictos: conflictos
      });
    }

    // Si se alcanza una solucion perfecta, se detiene el algoritmo
    if (conflictos === 0) {
      break;
    }
  }

  // Tiempo total de ejecucion
  const fin = performance.now();
  const tiempo = (fin - inicio).toFixed(2);

  // Retornar resultado final
  return {
    nodos: mejorSolucion,
    exito: menorConflictos === 0,
    iteraciones: maxIteraciones,
    tiempo,
    tipo: 'Monte Carlo',
    conflictos: menorConflictos,
    evolucion: evolucionConflictos
  };
};
