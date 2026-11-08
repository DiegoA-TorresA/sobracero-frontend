import { EstadoCuenta, FechaHoraISO } from './comun.model';

/** Entidad organizaciones.OrganizacionSocial */
export interface OrganizacionSocial {
  id: number;
  usuarioId: number;
  nombre: string;
  direccion?: string;
  latitud: number;
  longitud: number;
  /** Capacidad diaria de recojo en kg (US14). Ausente = sin límite declarado. */
  capacidadDiariaKg?: number;
  estado: EstadoCuenta;
  /** US19: calificada ante SUNAT (donaciones deducibles). */
  deducibleSunat: boolean;
  motivoRechazo?: string;
  creadoEn?: FechaHoraISO;
}

/** OrganizacionController.CapacidadRequest — PATCH /api/organizaciones/yo/capacidad */
export interface CapacidadRequest {
  capacidadDiariaKg: number | null;
}

/** OrganizacionController.ValidarRequest — PATCH /api/organizaciones/{id}/validar */
export interface ValidarOrganizacionRequest {
  deducibleSunat: boolean;
}
