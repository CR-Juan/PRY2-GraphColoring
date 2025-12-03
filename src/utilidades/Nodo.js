/**
 * Clase Nodo
 * Representa un nodo de un grafo, con un id, un color y datos adicionales opcionales.
 */
export class Nodo {

    /**
     * Crea una nueva instancia de Nodo.
     * @param {string|number} id - Identificador unico del nodo.
     * @param {string|null} color - Color asignado al nodo (puede ser null si no esta coloreado).
     * @param {Object} datosAdicionales - Metadatos asociados al nodo.
     */
    constructor(id, color = null, datosAdicionales = {}) {
        this.id = id;
        this.color = color;
        this.datosAdicionales = datosAdicionales;
    }

    /**
     * Asigna un color al nodo.
     * @param {string} color - Color a asignar.
     */
    colorear(color) {
        this.color = color;
    }

    /**
     * Indica si el nodo tiene un color asignado.
     * @returns {boolean} True si el nodo esta coloreado, false en caso contrario.
     */
    estaColoreado() {
        return this.color !== null;
    }

    /**
     * Obtiene los ids de los nodos vecinos a este nodo.
     * @param {Array} aristas - Lista de aristas del grafo.
     * @returns {Array<string|number>} Lista de ids de nodos vecinos.
     */
    obtenerVecinos(aristas) {
        return aristas
            .filter(a => a.desde === this.id || a.hasta === this.id)
            .map(a => a.desde === this.id ? a.hasta : a.desde);
    }

    /**
     * Verifica si este nodo tiene conflicto de color con alguno de sus vecinos.
     * Un conflicto ocurre si un vecino tiene el mismo color.
     * @param {Array} aristas - Lista de aristas del grafo.
     * @param {Array<Nodo>} nodos - Lista de nodos del grafo.
     * @returns {boolean} True si existe al menos un conflicto.
     */
    tieneConflicto(aristas, nodos) {
        if (!this.estaColoreado()) return false;

        const vecinos = this.obtenerVecinos(aristas);
        return vecinos.some(vecinoId => {
            const vecino = nodos.find(n => n.id === vecinoId);
            return vecino && vecino.color === this.color;
        });
    }

    /**
     * Crea una copia del nodo actual.
     * @returns {Nodo} Nuevo nodo clonado.
     */
    clonar() {
        return new Nodo(this.id, this.color, { ...this.datosAdicionales });
    }

    /**
     * Convierte el nodo a un objeto plano para serializacion.
     * @returns {Object} Representacion JSON del nodo.
     */
    toJSON() {
        return {
            id: this.id,
            color: this.color,
            ...this.datosAdicionales
        };
    }

    /**
     * Crea una instancia de Nodo a partir de un objeto JSON.
     * @param {Object} json - Objeto con los datos del nodo.
     * @returns {Nodo} Nueva instancia de Nodo.
     */
    static fromJSON(json) {
        const { id, color, ...datosAdicionales } = json;
        return new Nodo(id, color, datosAdicionales);
    }
}
