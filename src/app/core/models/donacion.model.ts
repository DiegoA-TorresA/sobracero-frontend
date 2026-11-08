import { FechaHoraISO } from './comun.model';

/** Estados de donaciones.Donacion.estado */
export type EstadoDonacion = 'OFRECIDA' | 'ACEPTADA' | 'COMPLETADA' | 'RECHAZADA';

/** DonacionController.CompletarRequest — POST /api/donaciones/completar (US12) */
export interface CompletarDonacionRequest {
  codigo: string;
}

/** DonacionService.DonacionVista — mias, aceptar, completar, comercio */
export interface DonacionVista {
  id: number;
  /** Código de recojo. */
  codigo: string;
  estado: EstadoDonacion;
  ofertaTitulo: string;
  categoria: string;
  cantidad: number;
  pesoKg: number;
  comercioNombre: string;
  comercioDireccion?: string;
  latitud: number;
  longitud: number;
  distanciaKm: number;
  recojoDesde: FechaHoraISO;
  recojoHasta: FechaHoraISO;
  completadaEn?: FechaHoraISO;
  organizacionNombre?: string;
}

/** DonacionService.FilaRegistro — GET /api/donaciones/registro (US13, Ley 30498) */
export interface FilaRegistroDonacion {
  fecha: FechaHoraISO;
  donante: string;
  donanteRuc?: string;
  tipoAlimento: string;
  cantidad: number;
  pesoKg: number;
  beneficiario: string;
  deducible: boolean;
  codigo: string;
}
