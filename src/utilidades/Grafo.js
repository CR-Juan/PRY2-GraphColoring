import { Nodo } from "./Nodo.js";
import { Arista } from "./Arista.js";

/**
 * Clase Grafo
 * Representa un grafo compuesto por nodos y aristas.
 * Incluye operaciones para gestion, analisis y validacion de coloracion.
 */
export class Grafo {

    /**
     * Crea una instancia de Grafo.
     * @param {Array<Nodo|Object>} nodos - Lista inicial de nodos.
     * @param {Array<Arista|Object>} aristas - Lista inicial de aristas.
     * @param {string} tipo - Tipo de grafo.
     */
    constructor(nodos = [], aristas = [], tipo = 'Personalizado') {
        // Normaliza nodos (asegura instancias de Nodo)
        this.nodos = nodos.map(n => n instanceof Nodo ? n : Nodo.fromJSON(n));

        // Normaliza aristas (asegura instancias de Arista)
        this.aristas = aristas.map(a => a instanceof Arista ? a : Arista.fromJSON(a));

        // Tipo descriptivo del grafo
        this.tipo = tipo;
    }

    /**
     * Agrega un nodo al grafo.
     * @param {Nodo} nodo - Nodo a insertar.
     * @throws Error si el nodo ya existe.
     */
    agregarNodo(nodo) {
        if (this.existeNodo(nodo.id)) {
            throw new Error(`El nodo con id ${nodo.id} ya existe en el grafo.`);
        }
        this.nodos.push(nodo);
    }

    /**
     * Agrega una arista al grafo.
     * @param {Arista} arista - Arista a insertar.
     * @throws Error si los nodos no existen o la arista ya esta creada.
     */
    agregarArista(arista) {
        if (!this.existeNodo(arista.desde) || !this.existeNodo(arista.hasta)) {
            throw new Error(`No se pueden agregar aristas entre nodos inexistentes.`);
        }

        if (this.existeArista(arista.desde, arista.hasta)) {
            throw new Error(`La arista entre ${arista.desde} y ${arista.hasta} ya existe.`);
        }
        this.aristas.push(arista);
    }

    /**
     * Comprueba si un nodo existe en el grafo.
     * @param {string|number} id - Id del nodo.
     * @returns {boolean} True si existe.
     */
    existeNodo(id) {
        return this.nodos.some(n => n.id === id);
    }

    /**
     * Comprueba si existe una arista entre dos nodos.
     * @param {string|number} desde
     * @param {string|number} hasta
     * @returns {boolean} True si existe la arista.
     */
    existeArista(desde, hasta) {
        return this.aristas.some(a => a.conecta(desde, hasta));
    }

    /**
     * Obtiene un nodo por su identificador.
     * @param {string|number} id
     * @returns {Nodo|null} Nodo si existe, null si no.
     */
    obtenerNodo(id) {
        return this.nodos.find(n => n.id === id) || null;
    }

    /**
     * Devuelve la lista de nodos vecinos.
     * @param {string|number} idNodo
     * @returns {Nodo[]} Lista de vecinos.
     */
    obtenerVecinos(idNodo) {
        return this.aristas
            .filter(a => a.desde === idNodo || a.hasta === idNodo)
            .map(a => a.otroExtremo(idNodo))
            .map(id => this.obtenerNodo(id))
            .filter(n => n !== null);
    }

    /**
     * Calcula el grado de un nodo.
     * @param {string|number} idNodo
     * @returns {number} Grado del nodo.
     */
    calcularGrado(idNodo) {
        return this.aristas.filter(
            a => a.desde === idNodo || a.hasta === idNodo
        ).length;
    }

    /**
     * Calcula el grado de todos los nodos.
     * @returns {Object} Diccionario id -> grado.
     */
    calcularGrados() {
        const grados = {};
        this.nodos.forEach(nodo => {
            grados[nodo.id] = this.calcularGrado(nodo.id);
        });
        return grados;
    }

    /**
     * Devuelve los pares de nodos que generan conflicto de color.
     * @returns {Array} Lista de pares [id1, id2].
     */
    detectarConflictos() {
        return this.aristas
            .filter(a => a.tieneConflicto(this.nodos))
            .map(a => [a.desde, a.hasta]);
    }

    /**
     * Cuenta el numero total de conflictos.
     * @returns {number} Cantidad de conflictos.
     */
    contarConflictos() {
        return this.detectarConflictos().length;
    }

    /**
     * Verifica si la coloracion es valida.
     * @returns {boolean} True si no hay conflictos y todos los nodos estan coloreados.
     */
    esColoracionValida() {
        return this.contarConflictos() === 0 &&
               this.nodos.every(n => n.estaColoreado());
    }

    /**
     * Devuelve cuantos colores distintos se usan.
     * @returns {number} Numero de colores usados.
     */
    contarColoresUsados() {
        const colores = new Set(
            this.nodos.filter(n => n.estaColoreado()).map(n => n.color)
        );
        return colores.size;
    }

    /**
     * Limpia el color de todos los nodos.
     */
    limpiarColores() {
        this.nodos.forEach(n => n.color = null);
    }

    /**
     * Crea una copia profunda del grafo.
     * @returns {Grafo} Nuevo grafo clonado.
     */
    clonar() {
        const nodosClonados = this.nodos.map(n => n.clonar());
        const aristasClonadas = this.aristas.map(
            a => new Arista(a.desde, a.hasta, { ...a.datosAdicionales })
        );
        return new Grafo(nodosClonados, aristasClonadas, this.tipo);
    }

    /**
     * Convierte el grafo en un JSON plano.
     * @returns {Object} Representacion serializable del grafo.
     */
    toJSON() {
        return {
            nodos: this.nodos.map(n => n.toJSON()),
            aristas: this.aristas.map(a => a.toJSON()),
            tipo: this.tipo
        };
    }

    /**
     * Crea una instancia de Grafo a partir de JSON.
     * @param {Object} json
     * @returns {Grafo}
     */
    static fromJSON(json) {
        const grafo = new Grafo(json.nodos, json.aristas, json.tipo || 'Personalizado');
        return grafo;
    }

    /**
     * Calcula estadisticas generales del grafo.
     * @returns {Object} Resumen estadistico del grafo.
     */
    obtenerEstadisticas() {
        const grados = this.calcularGrados();
        return {
            numNodos: this.nodos.length,
            numAristas: this.aristas.length,
            gradosMinimos: Math.min(...Object.values(grados)),
            gradosMaximos: Math.max(...Object.values(grados)),
            gradosPromedio: Object.values(grados)
                .reduce((a, b) => a + b, 0) / this.nodos.length,
            densidad: (2 * this.aristas.length) /
                (this.nodos.length * (this.nodos.length - 1)),
            coloresUsados: this.contarColoresUsados(),
            conflictos: this.contarConflictos(),
            esValida: this.esColoracionValida()
        };
    }
}
