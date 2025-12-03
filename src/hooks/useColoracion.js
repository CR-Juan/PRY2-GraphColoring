import { useState } from "react";
import { algoritmoLasVegas } from "../algoritmos/lasVegas";
import { algoritmoMonteCarlo } from "../algoritmos/monteCarlo";
import { algoritmoConAutoIncrementoK } from "../algoritmos/autoIncrementoK";

/**
 * useColoracion - Hook personalizado para manejar la logica de coloracion del grafo.
 * Se encarga de ejecutar los algoritmos, actualizar el grafo y registrar estadisticas.
 *
 * @param {Grafo} grafo - Instancia actual del grafo.
 * @param {Function} actualizarGrafo - Funcion para actualizar el grafo en el estado global.
 * @returns {Object} Estado y funciones relacionadas con la coloracion.
 */
export const useColoracion = (grafo, actualizarGrafo) => {
    // estadisticas: guarda la informacion de la ultima ejecucion del algoritmo
    const [estadisticas, setEstadisticas] = useState(null);

    // historialEjecuciones: lista de todas las ejecuciones realizadas
    const [historialEjecuciones, setHistorialEjecuciones] = useState([]);

    // numColores: cantidad de colores (k) que se usaran en la coloracion
    const [numColores, setNumColores] = useState(3);

    /**
     * ejecutarAlgoritmo - Ejecuta un algoritmo de coloracion segun la configuracion recibida.
     *
     * @param {Object} config - Configuracion de la ejecucion.
     * @param {number} config.numColores - Numero de colores (k).
     * @param {string} config.tipo - Tipo de algoritmo ("lasVegas" o "monteCarlo").
     * @param {number} config.maxIteraciones - Maximo de iteraciones permitidas.
     * @param {boolean} [config.autoIncrementoK] - Indica si se usa el algoritmo con auto-incremento de k.
     * @param {boolean} [config.buscarSolucionValida] - Si true, Las Vegas busca necesariamente una solucion valida.
     */
    const ejecutarAlgoritmo = (config) => {
        // Validacion basica: el grafo debe tener nodos
        if (grafo.nodos.length === 0) {
            alert("El grafo no tiene nodos.");
            return;
        }
        
        // Actualiza el k global visible en la UI
        setNumColores(config.numColores);
        
        // Se trabaja con versiones planas (JSON) para los algoritmos
        const nodosPlanos = grafo.nodos.map(n => n.toJSON());
        const aristasPlanas = grafo.aristas.map(a => a.toJSON());
        let resultado;

        // Modo: algoritmo con auto-incremento de k
        if (config.autoIncrementoK) {
            resultado = algoritmoConAutoIncrementoK(
                nodosPlanos,
                aristasPlanas,
                config.numColores,
                config.tipo,
                config.maxIteraciones, 
                10 // paso o limite de intentos por k (segun definicion del algoritmo)
            );
        } else {
            // Modo: Las Vegas
            if (config.tipo === "lasVegas") {
                resultado = algoritmoLasVegas(
                    nodosPlanos,
                    aristasPlanas,
                    config.numColores,
                    config.maxIteraciones,
                    config.buscarSolucionValida
                );
            } else {
                // Modo: Monte Carlo
                resultado = algoritmoMonteCarlo(
                    nodosPlanos,
                    aristasPlanas,
                    config.numColores,
                    config.maxIteraciones
                );
            }
        }

        // Se clona el grafo para no modificar el original directamente
        const nuevoGrafo = grafo.clonar();

        // Se transfieren los colores calculados en resultado.nodos al grafo clonado
        resultado.nodos.forEach(nP => {
            const nodo = nuevoGrafo.obtenerNodo(nP.id);
            if (nodo) {
                nodo.color = nP.color;
            }
        });

        // Actualiza el grafo en el estado externo
        actualizarGrafo(nuevoGrafo);

        // Se calculan conflictos finales sobre el nuevo grafo
        const conflictos = nuevoGrafo.contarConflictos();
        
        // Se construye el objeto de estadisticas de la ejecucion
        const nuevasEstadisticas = {
            tipo: resultado.tipo,
            iteraciones: resultado.iteraciones,
            tiempo: resultado.tiempo,
            conflictos: conflictos,
            exito: resultado.exito !== undefined ? resultado.exito : conflictos === 0,
            evolucion: resultado.evolucion || [],           // evolucion de conflictos o metricas por iteracion
            autoIncremento: resultado.autoIncremento || false,
            kInicial: resultado.kInicial,
            kFinal: resultado.kFinal
        };
        
        // Actualiza las estadisticas actuales
        setEstadisticas(nuevasEstadisticas);

        // Agrega la ejecucion al historial
        setHistorialEjecuciones(prev => [...prev, nuevasEstadisticas]);
    };

    /**
     * limpiarEstadisticas - Limpia las estadisticas actuales.
     */
    const limpiarEstadisticas = () => {
        setEstadisticas(null);
    };

    // Se exponen estados y funciones para que los use el componente
    return {
        estadisticas,
        historialEjecuciones,
        numColores,
        ejecutarAlgoritmo,
        limpiarEstadisticas,
        setEstadisticas
    };
};
