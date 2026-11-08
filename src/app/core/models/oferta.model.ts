import { FechaHoraISO, FechaISO } from './comun.model';

/** Estados posibles de ofertas.Oferta.estado */
export type EstadoOferta = 'ACTIVA' | 'AGOTADA' | 'DONADA' | 'VENCIDA' | 'PERDIDA';

/** Entidad ofertas.Oferta — respuesta de POST /api/ofertas y GET /api/ofertas/mias */
export interface Oferta {
  id: number;
  comercioId: number;
  titulo: string;
  descripcion?: string;
  categoria: string;
  /** Unidades disponibles (baja con cada reserva). */
  cantidad: number;
  cantidadInicial: number;
  pesoUnitarioKg: number;
  precioOriginal: number;
  precioDescuento: number;
  venceEl: FechaISO;
  recojoDesde: FechaHoraISO;
  recojoHasta: FechaHoraISO;
  estado: EstadoOferta;
  creadoEn?: FechaHoraISO;
}

/** OfertaController.CrearOfertaRequest — POST /api/ofertas (US02 + US03) */
export interface CrearOfertaRequest {
  titulo: string;
  descripcion?: string | null;
  categoria: string;
  /** >= 1 */
  cantidad: number;
  /** >= 0.01; si se omite el backend usa 0.5 */
  pesoUnitarioKg?: number | null;
  precioOriginal: number;
  /** Debe ser menor que precioOriginal. */
  precioDescuento: number;
  venceEl: FechaISO;
  recojoDesde: FechaHoraISO;
  /** Debe ser posterior a recojoDesde y al momento actual. */
  recojoHasta: FechaHoraISO;
}

/** OfertaController.OfertaVista — GET /api/ofertas/cercanas y GET /api/ofertas/{id} */
export interface OfertaVista {
  id: number;
  comercioId: number;
  comercioNombre: string;
  comercioDireccion?: string;
  latitud: number;
  longitud: number;
  /** 0 en el detalle (no se envía lat/lng). */
  distanciaKm: number;
  titulo: string;
  descripcion?: string;
  categoria: string;
  cantidad: number;
  pesoUnitarioKg: number;
  precioOriginal: number;
  precioDescuento: number;
  venceEl: FechaISO;
  recojoDesde: FechaHoraISO;
  recojoHasta: FechaHoraISO;
}

/** Parámetros de GET /api/ofertas/cercanas (US06). */
export interface BusquedaCercanasParams {
  lat: number;
  lng: number;
  /** Por defecto 1 km en el backend. */
  radioKm?: number;
}

/** Categorías usadas en los datos demo; el backend acepta texto libre. */
export const CATEGORIAS_OFERTA = [
  'Panadería',
  'Comida preparada',
  'Lácteos',
  'Frutas y verduras',
  'Abarrotes',
  'Postres',
  'Bebidas',
] as const;
