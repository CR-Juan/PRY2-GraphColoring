import { useState } from "react";
import { algoritmoLasVegas } from "../algoritmos/lasVegas";
import { algoritmoMonteCarlo } from "../algoritmos/monteCarlo";

export const useColoracion = (grafo, actualizarGrafo) => {
    const [estadisticas, setEstadisticas] = useState(null);
    const [historialEjecuciones, setHistorialEjecuciones] = useState([]);
    const [numColores, setNumColores] = useState(3);

    const ejecutarAlgoritmo = (config) => {
        if (grafo.nodos.length === 0) {
            alert("El grafo no tiene nodos.");
            return;
        }
        setNumColores(config.numColores);
        
        const nodosPlanos = grafo.nodos.map(n => n.toJSON());
        const aristasPlanas = grafo.aristas.map(a => a.toJSON());
        let resultado;

        if (config.tipo === "lasVegas") {
            resultado = algoritmoLasVegas(
                nodosPlanos,
                aristasPlanas,
                config.numColores,
                config.maxIteraciones,
                config.buscarSolucionValida
            );
        } else {
            resultado = algoritmoMonteCarlo(
                nodosPlanos,
                aristasPlanas,
                config.numColores,
                config.maxIteraciones
            )
        }

        // nP = nodoPlano
        const nuevoGrafo = grafo.clonar();
        resultado.nodos.array.forEach(nP => {
            const nodo = nuevoGrafo.obtenerNodo(nP.id);
            if (nodo) {
                nodo.color = nP.color;
            }
        });
        actualizarGrafo(nuevoGrafo);

        const conflictos = nuevoGrafo.contarConflictos();
        const nuevasEstadisticas = {
            tipo: resultado.tipo,
            iteraciones: resultado.iteraciones,
            tiempo: resultado.tiempo,
            conflictos: conflictos,
            exito: conflictos === 0,
            evolucion: resultado.evolucion || []
        }
        setEstadisticas(nuevasEstadisticas);
        setHistorialEjecuciones(prev => [...prev, nuevasEstadisticas]);
    };

    const limpiarEstadisticas = () => {
        setEstadisticas(null);
    };

    return {
        estadisticas,
        historialEjecuciones,
        numColores,
        ejecutarAlgoritmo,
        limpiarEstadisticas
    }
}