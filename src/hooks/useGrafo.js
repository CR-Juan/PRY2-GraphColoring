import { useState } from "react";
import { Grafo } from "../utilidades/Grafo";
import { Nodo } from "../utilidades/Nodo";
import { Arista } from "../utilidades/Arista";

export const useGrafo = () => {
    const [grafo, setGrafo] = useState(() => {
        const g = new Grafo();
        g.agregarNodo(new Nodo(1));
        g.agregarNodo(new Nodo(2));
        g.agregarNodo(new Nodo(3));
        g.agregarArista(new Arista(1, 2));
        g.agregarArista(new Arista(2, 3));
        return g;
    });

    const [contarNodos, setContarNodos] = useState(4);

    const agregarNodo = () => {
        setGrafo(p => {
            const nuevoGrafo = p.clonar();
            nuevoGrafo.agregarNodo(new Nodo(contarNodos));
            return nuevoGrafo;
        });
        setContarNodos(p => p + 1);
    };

    const agregarArista = (desde, hasta) => {
        const nodoDesdeExiste = grafo.existeNodo(desde);
        const nodoHastaExiste = grafo.existeNodo(hasta);

        if (!nodoDesdeExiste || !nodoHastaExiste) {
            alert('Ambos nodos deben existir');
            return;
        }
        if (grafo.existeArista(desde, hasta)) {
            alert('Esta conexión ya existe');
            return;
        }

        try {
            setGrafo(p => {
                const nuevoGrafo = p.clonar();
                nuevoGrafo.agregarArista(new Arista(desde, hasta));
                return nuevoGrafo;
            });
        } catch (error) {
            alert(error.message);
        }
    };

    const generarGrafoAleatorio = () => {
        const numNodos = Math.floor(Math.random() * 118) + 3; //
        const nuevoGrafo = new Grafo();

        for (let i = 1; i <= numNodos; i++) {
            nuevoGrafo.agregarNodo(new Nodo(i));
        }
        
        const numAristas = Math.floor(Math.random() * numNodos) + numNodos;
        let creados = 0;
        let intentos = 0;
        const maxIntentos = numAristas * 3;

        while (creados < numAristas && intentos < maxIntentos) {
            const desde = Math.floor(Math.random() * numNodos) + 1;
            const hasta = Math.floor(Math.random() * numNodos) + 1;

            if (desde !== hasta && !nuevoGrafo.existeArista(desde, hasta)) {
                try {
                    nuevoGrafo.agregarArista(new Arista(desde, hasta));
                    creados++;
                } catch (error) {
                    console.error('Error agregando arista:', error);
                }
            }
            intentos++;
        }
        
        setGrafo(nuevoGrafo);
        setContarNodos(numNodos + 1);
    };

    const actualizarGrafo = (nuevoGrafo) => {
        setGrafo(nuevoGrafo);
    };

    return {
        grafo,
        nodos: grafo.nodos,
        aristas: grafo.aristas,
        agregarNodo,
        agregarArista,
        generarGrafoAleatorio,
        actualizarGrafo,
        conflictos: grafo.detectarConflictos()
    };
};