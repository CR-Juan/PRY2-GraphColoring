import { useState } from "react";
import { algoritmoLasVegas } from "../algoritmos/lasVegas";
import { algoritmoMonteCarlo } from "../algoritmos/monteCarlo";
import { algoritmoConAutoIncrementoK } from "../algoritmos/autoIncrementoK";

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

        if (config.autoIncrementoK) {
            console.log('Ejecutando con auto-incremento de k...');
            resultado = algoritmoConAutoIncrementoK(
                nodosPlanos,
                aristasPlanas,
                config.numColores,
                config.tipo,
                config.maxIteraciones, 
                10
            );
        } else {
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
                );
            }
        }

        const nuevoGrafo = grafo.clonar();
        resultado.nodos.forEach(nP => {
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
            exito: resultado.exito !== undefined ? resultado.exito : conflictos === 0,
            evolucion: resultado.evolucion || [],
            autoIncremento: resultado.autoIncremento || false,
            kInicial: resultado.kInicial,
            kFinal: resultado.kFinal
        };
        
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
        limpiarEstadisticas,
        setEstadisticas
    };
};