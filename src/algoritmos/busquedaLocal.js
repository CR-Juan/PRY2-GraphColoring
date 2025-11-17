import { obtenerVecinos, coloresVecinos, contarConflictos } from '../utilidades/grafoUtils';

// Recolorar un nodo específico con un nuevo color
export const recolorearNodo = (nodos, aristas, idNodo, nuevoColor) => {
  const nodosActualizados = nodos.map(nodo => 
    nodo.id === idNodo ? { ...nodo, color: nuevoColor } : nodo
  );
  
  return nodosActualizados;
};

// Calcular la probabilidad de éxito de recoloración
export const calcularProbabilidadExito = (nodos, aristas, idNodo, nuevoColor, numColores) => {
  const vecinos = obtenerVecinos(idNodo, aristas);
  const coloresUsadosVecinos = coloresVecinos(idNodo, nodos, aristas);
  
  // Si el nuevo color no está usado por vecinos, probabilidad alta
  if (!coloresUsadosVecinos.includes(nuevoColor)) {
    return 100;
  }
  
  // Si está usado, probabilidad baja
  const conflictosVecinos = vecinos.filter(idVecino => {
    const vecino = nodos.find(n => n.id === idVecino);
    return vecino && vecino.color === nuevoColor;
  }).length;
  
  const probabilidad = Math.max(0, 100 - (conflictosVecinos / vecinos.length) * 100);
  return Math.round(probabilidad);
};

// Contar cuántos nodos necesitan recolorearse para resolver conflictos
export const contarNodosARecolorear = (nodos, aristas, idNodo) => {
  const vecinos = obtenerVecinos(idNodo, aristas);
  const nodoActual = nodos.find(n => n.id === idNodo);
  
  if (!nodoActual) return 0;
  
  // Contar vecinos con el mismo color
  const nodosConflictivos = vecinos.filter(idVecino => {
    const vecino = nodos.find(n => n.id === idVecino);
    return vecino && vecino.color === nodoActual.color;
  });
  
  return nodosConflictivos.length;
};

// Búsqueda local: intentar mejorar la coloración actual
export const busquedaLocalGreedy = (nodos, aristas, numColores) => {
  const coloresDisponibles = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#ABEBC6'
  ].slice(0, numColores);
  
  let nodosActuales = [...nodos];
  let mejoro = true;
  let iteraciones = 0;
  const maxIteraciones = 100;
  
  while (mejoro && iteraciones < maxIteraciones) {
    mejoro = false;
    iteraciones++;
    
    // Para cada nodo con conflictos
    for (let nodo of nodosActuales) {
      const conflictosActuales = contarNodosARecolorear(nodosActuales, aristas, nodo.id);
      
      if (conflictosActuales > 0) {
        // Probar cada color disponible
        for (let color of coloresDisponibles) {
          const nodosTemp = recolorearNodo(nodosActuales, aristas, nodo.id, color);
          const nuevosConflictos = contarNodosARecolorear(nodosTemp, aristas, nodo.id);
          
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