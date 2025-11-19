import {Nodo} from "./Nodo.js";
import {Arista} from "./Arista.js";

export class Grafo {
    constructor(nodos = [], aristas = [], tipo = 'Personalizado') {
        this.nodos = nodos.map(n => n instanceof Nodo ? n : Nodo.fromJSON(n));
        this.aristas = aristas.map(a => a instanceof Arista ? a : Arista.fromJSON(a));
        this.tipo = tipo;
    }

    agregarNodo(nodo) {
        if (this.existeNodo(nodo.id)) {
            throw new Error(`El nodo con id ${nodo.id} ya existe en el grafo.`);
        }
        this.nodos.push(nodo);
    }

    agregarArista(arista) {
        if (!this.existeNodo(arista.desde) || !this.existeNodo(arista.hasta)) {
            throw new Error(`No se pueden agregar aristas entre nodos inexistentes.`);
        }

        if (this.existeArista(arista.desde, arista.hasta)) {
            throw new Error(`La arista entre ${arista.desde} y ${arista.hasta} ya existe.`);
        }
        this.aristas.push(arista);
    }

    existeNodo(id) {
        return this.nodos.some(n => n.id === id);
    }

    existeArista(desde, hasta) {
        return this.aristas.some(a => a.conecta(desde, hasta));
    }

    obtenerNodo(id) {
        return this.nodos.find(n => n.id === id) || null;
    }

    obtenerVecinos(idNodo) {
        return this.aristas
        .filter(a => a.desde === idNodo || a.hasta === idNodo)
        .map(a => a.otroExtremo(idNodo))
        .map(id => this.obtenerNodo(id))
        .filter(n => n !== null)
    }

    calcularGrado(idNodo) {
        return this.aristas.filter(
            a => a.desde === idNodo || a.hasta === idNodo
        ).length;
    }

    calcularGrados() {
        const grados = {};
        this.nodos.forEach(nodo => {
            grados[nodo.id] = this.calcularGrado(nodo.id);
        });
        return grados;
    }

    detectarConflictos() {
        return this.aristas
        .filter(a => a.tieneConflicto(this.nodos))
        .map(a => [a.desde, a.hasta])
    }

    contarConflictos() {
        return this.detectarConflictos().length;
    }

    esColoracionValida() {
        return this.contarConflictos() === 0 &&
         this.nodos.every(n => n.estaColoreado());
    }

    contarColoresUsados() {
        const colores = new Set(
            this.nodos.filter(n=>n.estaColoreado()).map(n => n.color)
        )
        return colores.size;
    }

    limpiarColores() {
        this.nodos.forEach(n => n.color = null);
    }

    clonar () {
        const nodosClonados = this.nodos.map(n => n.clonar());
        const aristasClonadas = this.aristas.map(
            a => new Arista(a.desde, a.hasta, {...a.datosAdicionales} )
        );
        return new Grafo(nodosClonados, aristasClonadas, this.tipo);
    }

    toJSON() {
        return {
            nodos: this.nodos.map(n => n.toJSON()),
            aristas: this.aristas.map(a => a.toJSON()),
            tipo: this.tipo
        };
    }

    static fromJSON (json) {
        const grafo = new Grafo(json.nodos, json.aristas, json.tipo || 'Personalizado')
        return grafo;
    }

    obtenerEstadisticas() {
        const grados = this.calcularGrados();
        return {
            numNodos: this.nodos.length,
            numAristas: this.aristas.length,
            gradosMinimos: Math.min(...Object.values(grados)),
            gradosMaximos: Math.max(...Object.values(grados)),
            gradosPromedio: Object.values(grados).reduce((a,b) => a + b, 0) / this.nodos.length,
            densidad: (2 * this.aristas.length) / (this.nodos.length * (this.nodos.length -1)),
            coloresUsados: this.contarColoresUsados(),
            conflictos: this.contarConflictos(),
            esValida: this.esColoracionValida()
        }
    }
}