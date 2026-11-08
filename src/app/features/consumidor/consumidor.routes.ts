import { Routes } from '@angular/router';

/**
 * PARTE 3 — Consumidor: búsqueda, reserva y recojo.
 * Montado en: /consumidor  (rol CONSUMIDOR)
 * Dueño: Desarrollador 3. Solo este desarrollador edita esta carpeta.
 */
export const CONSUMIDOR_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'ofertas' },
  {
    path: 'ofertas',
    title: 'Ofertas cercanas · SobraCero',
    data: {
      parte: 3,
      titulo: 'Ofertas cercanas (mapa y lista con filtros)',
      historias: 'US06, US07',
    },
    loadComponent: () =>
      import('./ofertas-cercanas/ofertas-cercanas.page').then((m) => m.OfertasCercanasPage),
  },
  {
    path: 'ofertas/:id',
    title: 'Detalle de la oferta, reserva y pago · SobraCero',
    data: {
      parte: 3,
      titulo: 'Detalle de la oferta, reserva y pago',
      historias: 'US07, US08, US09',
    },
    loadComponent: () =>
      import('./oferta-detalle/oferta-detalle.page').then((m) => m.OfertaDetallePage),
  },
  {
    path: 'reservas',
    title: 'Mis reservas y código de reserva · SobraCero',
    data: { parte: 3, titulo: 'Mis reservas y código de reserva', historias: 'US09, US10' },
    loadComponent: () => import('./mis-reservas/mis-reservas.page').then((m) => m.MisReservasPage),
  },
];
