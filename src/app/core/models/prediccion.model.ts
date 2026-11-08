import { FechaISO } from './comun.model';

/** PrediccionService.PrediccionCategoria */
export interface PrediccionCategoria {
  categoria: string;
  unidadesEsperadas: number;
  descuentoSugeridoPct: number;
}

/** PrediccionService.Prediccion — GET /api/prediccion/comercio (US01, Plan Premium) */
export interface Prediccion {
  /** false si hay menos de 15 días de historial. */
  disponible: boolean;
  mensaje: string;
  fechaObjetivo?: FechaISO;
  diasHistorial: number;
  predicciones?: PrediccionCategoria[];
}
