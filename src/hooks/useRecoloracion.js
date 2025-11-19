import { useState } from 'react';

export const useRecoloracion = (grafo, actualizarGrafo, estadisticas, setEstadisticas) => {
  const [nodoSeleccionado, setNodoSeleccionado] = useState(null);

  const manejarClickNodo = (idNodo) => {
    const id = Number(idNodo);
    const nodo = grafo.obtenerNodo(id);
    
    if (nodo && nodo.estaColoreado()) {
      setNodoSeleccionado(nodo.toJSON());
    } else {
      alert('Este nodo aún no tiene color asignado. Ejecuta un algoritmo primero.');
    }
  };

  const manejarRecoloracion = (idNodo, nuevoColor) => {
    const nuevoGrafo = grafo.clonar();
    const nodo = nuevoGrafo.obtenerNodo(idNodo);
    
    if (nodo) {
      nodo.colorear(nuevoColor);
    }
    
    actualizarGrafo(nuevoGrafo);

    if (estadisticas && setEstadisticas) {
      const nuevosConflictos = nuevoGrafo.contarConflictos();
      setEstadisticas({ 
        ...estadisticas, 
        conflictos: nuevosConflictos, 
        exito: nuevosConflictos === 0 
      });
    }
    
    setNodoSeleccionado(null);
  };

  const cerrarModal = () => {
    setNodoSeleccionado(null);
  };

  return {
    nodoSeleccionado,
    manejarClickNodo,
    manejarRecoloracion,
    cerrarModal
  };
};