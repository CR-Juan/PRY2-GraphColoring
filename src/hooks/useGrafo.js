import { useState } from "react";
import { Grafo } from "../utilidades/Grafo";
import { Nodo } from "../utilidades/Nodo";
import { Arista } from "../utilidades/Arista";

/**
 * useGrafo - Hook personalizado para gestionar la estructura del grafo.
 * Administra nodos, aristas y la generacion de grafos aleatorios.
 *
 * @returns {Object} Estados y funciones para manipular el grafo.
 */
export const useGrafo = () => {

    // Estado principal que contiene el grafo completo
    const [grafo, setGrafo] = useState(() => {
        const g = new Grafo();

        // Se inicializa con tres nodos de ejemplo y dos aristas
        g.agregarNodo(new Nodo(1));
        g.agregarNodo(new Nodo(2));
        g.agregarNodo(new Nodo(3));
        g.agregarArista(new Arista(1, 2));
        g.agregarArista(new Arista(2, 3));

        return g;
    });

    // Contador interno para asignar ids de nodos automaticamente
    const [contarNodos, setContarNodos] = useState(4);

    /**
     * Agrega un nuevo nodo al grafo.
     * El id se genera automaticamente con el contador interno.
     */
    const agregarNodo = () => {
        setGrafo(p => {
            const nuevoGrafo = p.clonar();
            nuevoGrafo.agregarNodo(new Nodo(contarNodos));
            return nuevoGrafo;
        });
        setContarNodos(p => p + 1);
    };

    /**
     * Agrega una arista entre dos nodos existentes.
     * @param {string|number} desde - Nodo origen.
     * @param {string|number} hasta - Nodo destino.
     */
    const agregarArista = (desde, hasta) => {
        const nodoDesdeExiste = grafo.existeNodo(desde);
        const nodoHastaExiste = grafo.existeNodo(hasta);

        // Validacion: ambos nodos deben existir
        if (!nodoDesdeExiste || !nodoHastaExiste) {
            alert('Ambos nodos deben existir');
            return;
        }

        // Validacion: no permitir aristas duplicadas
        if (grafo.existeArista(desde, hasta)) {
            alert('Esta conexion ya existe');
            return;
        }

        try {
            // Se clona el grafo antes de modificarlo
            setGrafo(p => {
                const nuevoGrafo = p.clonar();
                nuevoGrafo.agregarArista(new Arista(desde, hasta));
                return nuevoGrafo;
            });
        } catch (error) {
            alert(error.message);
        }
    };

    /**
     * Genera un grafo aleatorio con nodos y aristas.
     * La cantidad de nodos y aristas se genera aleatoriamente.
     */
    const generarGrafoAleatorio = () => {
        const numNodos = Math.floor(Math.random() * 5) + 5;
        const nuevoGrafo = new Grafo();

        // Crear nodos
        for (let i = 1; i <= numNodos; i++) {
            nuevoGrafo.agregarNodo(new Nodo(i));
        }
        
        // Numero aproximado de aristas a generar
        const numAristas = Math.floor(Math.random() * numNodos) + numNodos;
        let creados = 0;
        let intentos = 0;
        const maxIntentos = numAristas * 3;

        // Crear aristas aleatorias evitando duplicados y bucles
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
        
        // Actualiza el estado con el nuevo grafo generado
        setGrafo(nuevoGrafo);
        setContarNodos(numNodos + 1);
    };

    /**
     * Reemplaza completamente el grafo actual.
     * @param {Grafo} nuevoGrafo - Nuevo grafo a establecer.
     */
    const actualizarGrafo = (nuevoGrafo) => {
        setGrafo(nuevoGrafo);
    };

    // Se retorna la interfaz publica del hook
    return {
        grafo,                     // estructura completa
        nodos: grafo.nodos,        // lista de nodos
        aristas: grafo.aristas,    // lista de aristas
        agregarNodo,
        agregarArista,
        generarGrafoAleatorio,
        actualizarGrafo,
        conflictos: grafo.detectarConflictos()
    };
};
