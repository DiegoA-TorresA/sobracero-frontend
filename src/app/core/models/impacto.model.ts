import { Plan } from './comun.model';

/** ImpactoService.Distintivo (US17) */
export interface Distintivo {
  otorgado: boolean;
  minKg: number;
  avancePct: number;
  mensaje: string;
}

/** ImpactoService.ImpactoComercio — GET /api/impacto/comercio (US05, US16) */
export interface ImpactoComercio {
  vendidoKg: number;
  donadoKg: number;
  rescatadoKg: number;
  perdidoKg: number;
  ingresos: number;
  co2EvitadoKg: number;
  donacionesCompletadas: number;
  plan: Plan;
  distintivo: Distintivo;
}

/** ImpactoService.ImpactoPlataforma — GET /api/impacto/plataforma (público, US20) */
export interface ImpactoPlataforma {
  rescatadoKg: number;
  vendidoKg: number;
  donadoKg: number;
  co2EvitadoKg: number;
  comerciosActivos: number;
  organizacionesActivas: number;
  metaKg: number;
  avanceMetaPct: number;
}

/** ImpactoService.ImpactoOrganizacion — GET /api/impacto/organizacion */
export interface ImpactoOrganizacion {
  recibidoKg: number;
  donacionesCompletadas: number;
  co2EvitadoKg: number;
}
