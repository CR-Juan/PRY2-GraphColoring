// Generar colores aleatorios en formato hex

/**
 * Genera un color aleatorio a partir de una lista de colores predefinidos.
 * @param {number} k - Cantidad de colores disponibles a considerar (primeros k de la lista).
 * @returns {string} Color en formato hexadecimal.
 */
export const generarColorAleatorio = (k) => {
  const colores = [
    '#FF6B6B', // Rojo
    '#4ECDC4', // Cyan
    '#45B7D1', // Azul
    '#FFA07A', // Naranja
    '#98D8C8', // Verde agua
    '#F7DC6F', // Amarillo
    '#BB8FCE', // Morado
    '#85C1E2', // Azul claro
    '#F8B88B', // Durazno
    '#ABEBC6', // Verde menta
  ];
  
  // Selecciona un indice aleatorio entre 0 y k-1
  return colores[Math.floor(Math.random() * k)];
};


/**
 * Detecta los conflictos de color en un grafo coloreado.
 * Un conflicto ocurre cuando dos nodos conectados tienen el mismo color.
 * @param {Array} nodos - Lista de nodos del grafo.
 * @param {Array} aristas - Lista de aristas del grafo.
 * @returns {Array<string>} Lista de conflictos en formato "desde-hasta".
 */
export const detectarConflictos = (nodos, aristas) => {
  const conflictos = [];
  
  aristas.forEach(arista => {
    const nodoDesde = nodos.find(n => n.id === arista.desde);
    const nodoHasta = nodos.find(n => n.id === arista.hasta);
    
    if (nodoDesde && nodoHasta && 
        nodoDesde.color && nodoHasta.color &&
        nodoDesde.color === nodoHasta.color) {
      conflictos.push(`${arista.desde}-${arista.hasta}`);
    }
  });
  
  return conflictos;
};


/**
 * Cuenta el numero total de conflictos en un grafo.
 * @param {Array} nodos - Lista de nodos.
 * @param {Array} aristas - Lista de aristas.
 * @returns {number} Numero de conflictos detectados.
 */
export const contarConflictos = (nodos, aristas) => {
  return detectarConflictos(nodos, aristas).length;
};


/**
 * Verifica si una coloracion es valida.
 * Una coloracion es valida si no existe ningun conflicto.
 * @param {Array} nodos - Lista de nodos.
 * @param {Array} aristas - Lista de aristas.
 * @returns {boolean} True si la coloracion es valida.
 */
export const esColoracionValida = (nodos, aristas) => {
  return contarConflictos(nodos, aristas) === 0;
};


/**
 * Obtiene los vecinos (ids) de un nodo a partir de las aristas.
 * @param {string|number} idNodo - Id del nodo.
 * @param {Array} aristas - Lista de aristas.
 * @returns {Array<string|number>} Lista de ids de nodos vecinos.
 */
export const obtenerVecinos = (idNodo, aristas) => {
  const vecinos = [];
  
  aristas.forEach(arista => {
    if (arista.desde === idNodo) {
      vecinos.push(arista.hasta);
    } else if (arista.hasta === idNodo) {
      vecinos.push(arista.desde);
    }
  });
  
  return vecinos;
};


/**
 * Obtiene los colores usados por los vecinos de un nodo.
 * @param {string|number} idNodo - Id del nodo objetivo.
 * @param {Array} nodos - Lista de nodos.
 * @param {Array} aristas - Lista de aristas.
 * @returns {Array<string>} Lista de colores distintos usados por los vecinos.
 */
export const coloresVecinos = (idNodo, nodos, aristas) => {
  const vecinos = obtenerVecinos(idNodo, aristas);
  const colores = new Set();
  
  vecinos.forEach(idVecino => {
    const vecino = nodos.find(n => n.id === idVecino);
    if (vecino && vecino.color) {
      colores.add(vecino.color);
    }
  });
  
  return Array.from(colores);
};
