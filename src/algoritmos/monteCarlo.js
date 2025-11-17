import { generarColorAleatorio, contarConflictos } from '../utilidades/grafoUtils';

export const algoritmoMonteCarlo = (nodos, aristas, numColores, maxIteraciones) => {
  const inicio = performance.now();
  let mejorSolucion = null;
  let menorConflictos = Infinity;
  const evolucionConflictos = [];

  for (let i = 0; i < maxIteraciones; i++) {
    // Asignar colores aleatorios
    const nodosColoreados = nodos.map(nodo => ({ ...nodo, color: generarColorAleatorio(numColores) }));

    // Contar conflictos
    const conflictos = contarConflictos(nodosColoreados, aristas);

    // Guardar evolución cada 10 iteraciones
    if (i % 10 === 0) {
      evolucionConflictos.push({
        iteracion: i + 1,
        conflictos: menorConflictos === Infinity ? conflictos : menorConflictos
      });
    }

    // Guardar si es mejor solución
    if (conflictos < menorConflictos) {
      menorConflictos = conflictos;
      mejorSolucion = nodosColoreados;
      
      // Guardar este punto importante
      evolucionConflictos.push({
        iteracion: i + 1,
        conflictos: conflictos
      });
    }

    // Si encontramos solución perfecta, terminamos
    if (conflictos === 0) {
      break;
    }
  }

  const fin = performance.now();
  const tiempo = (fin - inicio).toFixed(2);

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