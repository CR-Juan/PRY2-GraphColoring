import { algoritmoLasVegas } from './lasVegas';
import { algoritmoMonteCarlo } from './monteCarlo';
import { contarConflictos } from '../utilidades/grafoUtils';

export const algoritmoConAutoIncrementoK = (
  nodos, 
  aristas, 
  kInicial, 
  tipoAlgoritmo, 
  intentosPorK = 1000,
  kMaximo = 10
) => {
  const inicioTotal = performance.now();
  let kActual = kInicial;
  let resultado = null;
  let historialIntentos = [];
  let iteracionesTotales = 0;

  while (kActual <= kMaximo) {
    console.log(`Intentando con k=${kActual}...`);
    
    // Ejecutar algoritmo con k actual
    if (tipoAlgoritmo === 'lasVegas') {
      resultado = algoritmoLasVegas(nodos, aristas, kActual, intentosPorK, false);
    } else {
      resultado = algoritmoMonteCarlo(nodos, aristas, kActual, intentosPorK);
    }

    iteracionesTotales += resultado.iteraciones;

    // Registrar intento
    historialIntentos.push({
      k: kActual,
      iteraciones: resultado.iteraciones,
      conflictos: contarConflictos(resultado.nodos, aristas),
      exito: resultado.exito
    });

    // Si encontramos solución válida, terminamos
    if (resultado.exito) {
      console.log(`✓ Solución encontrada con k=${kActual}`);
      break;
    }

    // Si no, incrementar k
    console.log(`✗ No se encontró solución con k=${kActual}, incrementando...`);
    kActual++;
  }

  const finTotal = performance.now();
  const tiempoTotal = (finTotal - inicioTotal).toFixed(2);

  return {
    nodos: resultado.nodos,
    exito: resultado.exito,
    iteraciones: iteracionesTotales,
    tiempo: tiempoTotal,
    tipo: `${tipoAlgoritmo === 'lasVegas' ? 'Las Vegas' : 'Monte Carlo'} + Auto K`,
    kInicial: kInicial,
    kFinal: kActual,
    historialIntentos: historialIntentos,
    autoIncremento: true
  };
};