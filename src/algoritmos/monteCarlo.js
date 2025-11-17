import { generarColorAleatorio, contarConflictos } from '../utilidades/grafoUtils';

export const algoritmoMonteCarlo = (nodos, aristas, numColores, maxIteraciones) => {
  const inicio = performance.now();
  let mejorSolucion = null;
  let menorConflictos = Infinity;

  for (let i = 0; i < maxIteraciones; i++) {
    // Asignar colores aleatorios
    const nodosColoreados = nodos.map(nodo => ({...nodo, color: generarColorAleatorio(numColores)}));

    // Contar conflictos
    const conflictos = contarConflictos(nodosColoreados, aristas);

    // Guardar si es mejor solución
    if (conflictos < menorConflictos) {
      menorConflictos = conflictos;
      mejorSolucion = nodosColoreados;
    }

    // Si encontramos solución perfecta, terminamos
    if (conflictos === 0) {
      break;
    }
  }

  const fin = performance.now();
  const tiempo = Math.round(fin - inicio);

  return {
    nodos: mejorSolucion,
    exito: menorConflictos === 0,
    iteraciones: maxIteraciones,
    tiempo,
    tipo: 'Monte Carlo',
    conflictos: menorConflictos
  };
};