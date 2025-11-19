export class Nodo {
    constructor(id, color = null, datosAdicionales = {}) {
        this.id = id;
        this.color = color;
        this.datosAdicionales = datosAdicionales;
    }

    colorear(color) {
        this.color = color;
    }

    estaColoreado() {
        return this.color !== null;
    }

    obtenerVecinos(aristas) {
        return aristas.filter(
            a => a.desde === this.id || a.hasta === this.id
        ).map(
            a => a.desde === this.id ? a.hasta : a.desde
        );
    }

    tieneConflicto(aristas, nodos) {
        if (!this.estaColoreado()) return false;

        const vecinos = this.obtenerVecinos(aristas);
        return vecinos.some(vecinoId => {
            const vecino = nodos.find(n => n.id === vecinoId);
            return vecino && vecino.color === this.color;
        });
    }

    clonar() {
        return new Nodo(this.id, this.color, {...this.datosAdicionales});
    }

    toJSON() {
        return {
            id: this.id,
            color: this.color,
            ...this.datosAdicionales
        };
    }

    static fromJSON(json) {
        const {id, color, ...datosAdicionales} = json;
        return new Nodo(id, color, datosAdicionales);
    }
}