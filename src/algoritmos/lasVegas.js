import { generarColorAleatorio, esColoracionValida, contarConflictos } from '../utilidades/grafoUtils';

export const algoritmoLasVegas = (nodos, aristas, numColores, maxIteraciones, buscarSolucionValida) => {
  const inicio = performance.now();
  let iteraciones = 0;
  let nodosColoreados = [];
  let exito = false;
  const evolucionConflictos = [];

  const limite = buscarSolucionValida ? Infinity : maxIteraciones;

  while (iteraciones < limite) {
    iteraciones++;

    // Asignar colores aleatorios a todos los nodos
    nodosColoreados = nodos.map(nodo => ({ ...nodo, color: generarColorAleatorio(numColores) }));

    // Contar conflictos actuales
    const conflictosActuales = contarConflictos(nodosColoreados, aristas);
    
    // Guardar evolución cada 10 iteraciones (para no saturar)
    if (iteraciones % 10 === 0 || conflictosActuales === 0) {
      evolucionConflictos.push({
        iteracion: iteraciones,
        conflictos: conflictosActuales
      });
    }

    // Verificar si la coloración es válida
    if (esColoracionValida(nodosColoreados, aristas)) {
      exito = true;
      break;
    }

    // Límite de seguridad para el UI (máximo 50000 iteraciones)
    if (iteraciones >= 50000) {
      break;
    }
  }

  const fin = performance.now();
  const tiempo = (fin - inicio).toFixed(2);

  return {
    nodos: nodosColoreados,
    exito,
    iteraciones,
    tiempo,
    tipo: 'Las Vegas',
    evolucion: evolucionConflictos
  };
};