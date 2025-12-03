import { useState } from 'react';

/**
 * useRecoloracion - Hook personalizado para manejar la recoloracion manual de nodos.
 * Permite seleccionar nodos, cambiar colores y actualizar las estadisticas.
 *
 * @param {Grafo} grafo - Instancia actual del grafo.
 * @param {Function} actualizarGrafo - Funcion para actualizar el estado del grafo.
 * @param {Object|null} estadisticas - Estadisticas actuales del algoritmo.
 * @param {Function|null} setEstadisticas - Funcion para actualizar estadisticas.
 * @returns {Object} Funciones y estados de recoloracion.
 */
export const useRecoloracion = (grafo, actualizarGrafo, estadisticas, setEstadisticas) => {

  // nodoSeleccionado: almacena el nodo actualmente seleccionado para recoloracion
  const [nodoSeleccionado, setNodoSeleccionado] = useState(null);

  /**
   * Maneja el click sobre un nodo del canvas.
   * Solo permite seleccionar nodos que ya tienen color.
   *
   * @param {string|number} idNodo - Id del nodo seleccionado.
   */
  const manejarClickNodo = (idNodo) => {
    const id = Number(idNodo);
    const nodo = grafo.obtenerNodo(id);

    // Solo se permite recolorar nodos ya coloreados
    if (nodo && nodo.estaColoreado()) {
      setNodoSeleccionado(nodo.toJSON());
    } else {
      alert('Este nodo aún no tiene color asignado. Ejecuta un algoritmo primero.');
    }
  };

  /**
   * Aplica un nuevo color al nodo seleccionado.
   * Actualiza el grafo y las estadisticas.
   *
   * @param {string|number} idNodo - Id del nodo.
   * @param {string} nuevoColor - Nuevo color a asignar.
   */
  const manejarRecoloracion = (idNodo, nuevoColor) => {
    const nuevoGrafo = grafo.clonar();
    const nodo = nuevoGrafo.obtenerNodo(idNodo);

    // Aplica el nuevo color al nodo
    if (nodo) {
      nodo.colorear(nuevoColor);
    }

    // Actualiza el grafo externo
    actualizarGrafo(nuevoGrafo);

    // Recalcula conflictos y actualiza estadisticas si existen
    if (estadisticas && setEstadisticas) {
      const nuevosConflictos = nuevoGrafo.contarConflictos();
      setEstadisticas({ 
        ...estadisticas, 
        conflictos: nuevosConflictos, 
        exito: nuevosConflictos === 0 
      });
    }

    // Cierra el modal luego de aplicar el cambio
    setNodoSeleccionado(null);
  };

  /**
   * Cierra el modal sin aplicar cambios.
   */
  const cerrarModal = () => {
    setNodoSeleccionado(null);
  };

  // Retorna la interfaz publica del hook
  return {
    nodoSeleccionado,
    manejarClickNodo,
    manejarRecoloracion,
    cerrarModal
  };
};
