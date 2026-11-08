import { FechaHoraISO } from './comun.model';

/** Estados de reservas.Reserva.estado */
export type EstadoReserva = 'PAGADA' | 'RECOGIDA' | 'NO_RECOGIDA';

/** Métodos aceptados por la pasarela simulada (TARJETA_RECHAZADA simula un rechazo -> HTTP 402). */
export type MetodoPago = 'YAPE' | 'PLIN' | 'TARJETA' | 'TARJETA_RECHAZADA';

/** ReservaController.ReservarRequest — POST /api/reservas (US08) */
export interface ReservarRequest {
  ofertaId: number;
  /** >= 1 */
  cantidad: number;
  metodoPago: MetodoPago;
}

/** ReservaController.CanjearRequest — POST /api/reservas/canjear */
export interface CanjearRequest {
  codigo: string;
}

/** ReservaService.ReservaVista — respuesta de reservar, mias y canjear (US09) */
export interface ReservaVista {
  id: number;
  /** Código de reserva que el consumidor muestra en el local. */
  codigo: string;
  estado: EstadoReserva;
  cantidad: number;
  monto: number;
  ofertaId: number;
  ofertaTitulo: string;
  comercioNombre: string;
  comercioDireccion?: string;
  recojoDesde: FechaHoraISO;
  recojoHasta: FechaHoraISO;
  creadoEn?: FechaHoraISO;
}
