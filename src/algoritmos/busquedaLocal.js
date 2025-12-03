import { obtenerVecinos, coloresVecinos, contarConflictos } from '../utilidades/grafoUtils';

/**
 * recolorearNodo
 * Crea una nueva lista de nodos donde el nodo indicado cambia de color.
 *
 * @param {Array<Object>} nodos - Lista de nodos (objetos planos).
 * @param {Array<Object>} aristas - Lista de aristas (no se usan directamente aqui, pero se mantiene por consistencia).
 * @param {string|number} idNodo - Id del nodo a recolorear.
 * @param {string} nuevoColor - Color en formato hexadecimal a asignar.
 * @returns {Array<Object>} Nueva lista de nodos con el cambio aplicado.
 */
export const recolorearNodo = (nodos, aristas, idNodo, nuevoColor) => {
  const nodosActualizados = nodos.map(nodo => 
    nodo.id === idNodo ? { ...nodo, color: nuevoColor } : nodo
  );
  
  return nodosActualizados;
};


/**
 * calcularProbabilidadExito
 * Estima la probabilidad de que recolorear un nodo con un nuevo color
 * no genere conflictos o los reduzca.
 *
 * @param {Array<Object>} nodos - Lista de nodos actuales.
 * @param {Array<Object>} aristas - Lista de aristas.
 * @param {string|number} idNodo - Id del nodo objetivo.
 * @param {string} nuevoColor - Color propuesto para el nodo.
 * @param {number} numColores - Numero total de colores disponibles (k).
 * @returns {number} Probabilidad estimada en porcentaje (0 a 100).
 */
export const calcularProbabilidadExito = (nodos, aristas, idNodo, nuevoColor, numColores) => {
  const vecinos = obtenerVecinos(idNodo, aristas);
  const coloresUsadosVecinos = coloresVecinos(idNodo, nodos, aristas);
  
  // Si el nuevo color no esta usado por ningun vecino, probabilidad maxima
  if (!coloresUsadosVecinos.includes(nuevoColor)) {
    return 100;
  }
  
  // Si el color ya se usa, se calcula una penalizacion en base a cuantos vecinos lo tienen
  const conflictosVecinos = vecinos.filter(idVecino => {
    const vecino = nodos.find(n => n.id === idVecino);
    return vecino && vecino.color === nuevoColor;
  }).length;
  
  const probabilidad = Math.max(0, 100 - (conflictosVecinos / vecinos.length) * 100);
  return Math.round(probabilidad);
};


/**
 * contarNodosARecolorear
 * Cuenta cuantos vecinos de un nodo estan en conflicto de color con el.
 *
 * @param {Array<Object>} nodos - Lista de nodos.
 * @param {Array<Object>} aristas - Lista de aristas.
 * @param {string|number} idNodo - Id del nodo de referencia.
 * @returns {number} Cantidad de nodos vecinos que comparten el mismo color.
 */
export const contarNodosARecolorear = (nodos, aristas, idNodo) => {
  const vecinos = obtenerVecinos(idNodo, aristas);
  const nodoActual = nodos.find(n => n.id === idNodo);
  
  if (!nodoActual) return 0;
  
  // Contar vecinos con el mismo color que el nodo actual
  const nodosConflictivos = vecinos.filter(idVecino => {
    const vecino = nodos.find(n => n.id === idVecino);
    return vecino && vecino.color === nodoActual.color;
  });
  
  return nodosConflictivos.length;
};


/**
 * busquedaLocalGreedy
 * Aplica una estrategia de busqueda local para intentar mejorar la coloracion
 * reduciendo conflictos, recoloreando nodos conflictivos de forma codiciosa.
 *
 * @param {Array<Object>} nodos - Lista inicial de nodos (con colores).
 * @param {Array<Object>} aristas - Lista de aristas.
 * @param {number} numColores - Numero de colores disponibles (k).
 * @returns {Object} Resultado con nodos finales, iteraciones y conflictos finales.
 */
export const busquedaLocalGreedy = (nodos, aristas, numColores) => {
  const coloresDisponibles = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#ABEBC6'
  ].slice(0, numColores);
  
  // Copia de trabajo de los nodos
  let nodosActuales = [...nodos];

  // Bandera para saber si hubo mejoras en la ultima pasada
  let mejoro = true;

  // Contador de iteraciones de la busqueda local
  let iteraciones = 0;

  // Limite de iteraciones para evitar ciclos infinitos
  const maxIteraciones = 100;
  
  while (mejoro && iteraciones < maxIteraciones) {
    mejoro = false;
    iteraciones++;
    
    // Revisar cada nodo y verificar si tiene conflictos
    for (let nodo of nodosActuales) {
      const conflictosActuales = contarNodosARecolorear(nodosActuales, aristas, nodo.id);
      
      if (conflictosActuales > 0) {
        // Probar recolorear el nodo con cada color disponible
        for (let color of coloresDisponibles) {
          const nodosTemp = recolorearNodo(nodosActuales, aristas, nodo.id, color);
          const nuevosConflictos = contarNodosARecolorear(nodosTemp, aristas, nodo.id);
          
          // Si el nuevo color reduce el numero de conflictos, se acepta el cambio
          if (nuevosConflictos < conflictosActuales) {
            nodosActuales = nodosTemp;
            mejoro = true;
            break;
          }
        }
      }
    }
  }
  
  return {
    nodos: nodosActuales,
    iteraciones,
    conflictosFinales: contarConflictos(nodosActuales, aristas)
  };
};
