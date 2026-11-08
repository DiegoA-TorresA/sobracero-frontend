import { EstadoCuenta, FechaHoraISO, Plan } from './comun.model';

/** Entidad comercios.Comercio — GET /api/comercios/yo, GET /api/comercios, PATCH ... */
export interface Comercio {
  id: number;
  usuarioId: number;
  nombre: string;
  ruc?: string;
  direccion?: string;
  distrito?: string;
  latitud: number;
  longitud: number;
  estado: EstadoCuenta;
  plan: Plan;
  motivoRechazo?: string;
  creadoEn?: FechaHoraISO;
}

/** ComercioController.RechazoRequest / OrganizacionController.RechazoRequest */
export interface RechazoRequest {
  motivo: string;
}

/** ComercioController.PlanRequest — PATCH /api/comercios/{id}/plan */
export interface PlanRequest {
  plan: Plan;
}
