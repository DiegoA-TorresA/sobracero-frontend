import { FechaHoraISO } from './comun.model';

/** Entidad notificaciones.Notificacion */
export interface Notificacion {
  id: number;
  usuarioId: number;
  titulo: string;
  mensaje: string;
  leida: boolean;
  creadoEn?: FechaHoraISO;
}

/** NotificacionController.NotificacionesVista — GET /api/notificaciones (US27) */
export interface NotificacionesVista {
  sinLeer: number;
  /** Últimas 30, más recientes primero. */
  items: Notificacion[];
}
