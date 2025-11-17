import { generarColorAleatorio, esColoracionValida } from '../utilidades/grafoUtils';

export const algoritmoLasVegas = (nodos, aristas, numColores, maxIteraciones, buscarSolucionValida) => {
  const inicio = performance.now();
  let iteraciones = 0;
  let nodosColoreados = [];
  let exito = false;

  // Si buscarSolucionValida = true, ignora maxIteraciones y busca hasta encontrar
  const limite = buscarSolucionValida ? Infinity : maxIteraciones;

  while (iteraciones < limite) {
    iteraciones++;

    // Asignar colores aleatorios a todos los nodos
    nodosColoreados = nodos.map(nodo => ({ ...nodo, color: generarColorAleatorio(numColores) }));

    // Verificar si la coloración es válida
    if (esColoracionValida(nodosColoreados, aristas)) {
      exito = true;
      break;
    }
  }

  const fin = performance.now();
  const tiempo = Math.round(fin - inicio);

  return {
    nodos: nodosColoreados,
    exito,
    iteraciones,
    tiempo,
    tipo: 'Las Vegas'
  };
};