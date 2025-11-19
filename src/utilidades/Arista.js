export class Arista {
    constructor(desde, hasta, datosAdicionales = {}) {
        this.desde = desde;
        this.hasta = hasta;
        this.datosAdicionales = datosAdicionales;
    }

    conecta(nodo1, nodo2) {
        return (
            this.desde === nodo1 && this.hasta === nodo2
            || this.desde === nodo2 && this.hasta === nodo1
        )
    }

    otroExtremo(nodo) {
        if (this.desde === nodo) return this.hasta;
        if (this.hasta === nodo) return this.desde;
        return null;
    }

    tieneConflicto(nodos) {
        const nodo1 = nodos.find(n=> n.id === this.desde);
        const nodo2 = nodos.find(n=> n.id === this.hasta);

        if (!nodo1 || !nodo2) return false;
        if (!nodo1.estaColoreado() || !nodo2.estaColoreado()) return false;

        return nodo1.color === nodo2.color;
    }

    toJSON() {
        return {
            desde: this.desde,
            hasta: this.hasta,
            ...this.datosAdicionales
        };
    }

    static fromJSON (json) {
        const {desde, hasta, ...datosAdicionales} = json;
        return new Arista(desde, hasta, datosAdicionales);
    }
}