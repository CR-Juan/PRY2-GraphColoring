// Generar colores aleatorios en formato hex
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
  
  return colores[Math.floor(Math.random() * k)];
};

// Detectar si hay conflictos en el grafo coloreado
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

// Contar el número de conflictos
export const contarConflictos = (nodos, aristas) => {
  return detectarConflictos(nodos, aristas).length;
};

// Verificar si una coloración es válida (sin conflictos)
export const esColoracionValida = (nodos, aristas) => {
  return contarConflictos(nodos, aristas) === 0;
};

// Obtener vecinos de un nodo
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

// Obtener colores usados por los vecinos de un nodo
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