/**
 * Clase Arista
 * Representa una conexion entre dos nodos del grafo.
 * Puede almacenar informacion adicional como color, peso u otros metadatos.
 */
export class Arista {

    /**
     * Crea una nueva arista.
     * @param {string|number} desde - Id del nodo de origen.
     * @param {string|number} hasta - Id del nodo de destino.
     * @param {Object} datosAdicionales - Informacion extra asociada a la arista.
     */
    constructor(desde, hasta, datosAdicionales = {}) {
        this.desde = desde;
        this.hasta = hasta;
        this.datosAdicionales = datosAdicionales;
    }

    /**
     * Verifica si la arista conecta dos nodos sin importar el orden.
     * @param {string|number} nodo1 - Primer nodo.
     * @param {string|number} nodo2 - Segundo nodo.
     * @returns {boolean} True si la arista conecta esos nodos.
     */
    conecta(nodo1, nodo2) {
        return (
            (this.desde === nodo1 && this.hasta === nodo2) ||
            (this.desde === nodo2 && this.hasta === nodo1)
        );
    }

    /**
     * Devuelve el extremo opuesto de la arista dado un nodo.
     * @param {string|number} nodo - Nodo conocido.
     * @returns {string|number|null} El otro nodo o null si no pertenece a la arista.
     */
    otroExtremo(nodo) {
        if (this.desde === nodo) return this.hasta;
        if (this.hasta === nodo) return this.desde;
        return null;
    }

    /**
     * Comprueba si la arista tiene conflicto de color entre sus nodos.
     * @param {Array} nodos - Lista de nodos del grafo.
     * @returns {boolean} True si hay conflicto de color.
     */
    tieneConflicto(nodos) {
        const nodo1 = nodos.find(n => n.id === this.desde);
        const nodo2 = nodos.find(n => n.id === this.hasta);

        if (!nodo1 || !nodo2) return false;
        if (!nodo1.estaColoreado() || !nodo2.estaColoreado()) return false;

        return nodo1.color === nodo2.color;
    }

    /**
     * Convierte la arista en un objeto plano para exportar o guardar.
     * @returns {Object} Representacion serializable de la arista.
     */
    toJSON() {
        return {
            desde: this.desde,
            hasta: this.hasta,
            ...this.datosAdicionales
        };
    }

    /**
     * Crea una nueva arista a partir de un objeto JSON.
     * @param {Object} json - Objeto con datos serializados.
     * @returns {Arista} Nueva instancia de la clase Arista.
     */
    static fromJSON(json) {
        const { desde, hasta, ...datosAdicionales } = json;
        return new Arista(desde, hasta, datosAdicionales);
    }
}
