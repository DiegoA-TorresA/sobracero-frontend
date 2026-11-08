import { Routes } from '@angular/router';

/**
 * PARTE 4 — Comercio: publicación, canje y donaciones derivadas.
 * Montado en: /comercio  (rol COMERCIO)
 * Dueño: Desarrollador 4. Solo este desarrollador edita esta carpeta.
 */
export const COMERCIO_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'publicar' },
  {
    path: 'publicar',
    title: 'Publicar oferta con ventana de recojo · SobraCero',
    data: { parte: 4, titulo: 'Publicar oferta con ventana de recojo', historias: 'US02, US03' },
    loadComponent: () =>
      import('./publicar-oferta/publicar-oferta.page').then((m) => m.PublicarOfertaPage),
  },
  {
    path: 'mis-ofertas',
    title: 'Mis ofertas e historial · SobraCero',
    data: { parte: 4, titulo: 'Mis ofertas e historial', historias: 'US05' },
    loadComponent: () => import('./mis-ofertas/mis-ofertas.page').then((m) => m.MisOfertasPage),
  },
  {
    path: 'canjear',
    title: 'Canjear código de reserva · SobraCero',
    data: { parte: 4, titulo: 'Canjear código de reserva', historias: 'US09' },
    loadComponent: () =>
      import('./canjear-codigo/canjear-codigo.page').then((m) => m.CanjearCodigoPage),
  },
  {
    path: 'donaciones',
    title: 'Donaciones generadas por mis ofertas · SobraCero',
    data: { parte: 4, titulo: 'Donaciones generadas por mis ofertas', historias: 'US04' },
    loadComponent: () =>
      import('./donaciones-comercio/donaciones-comercio.page').then(
        (m) => m.DonacionesComercioPage,
      ),
  },
  {
    path: 'perfil',
    title: 'Mi comercio · SobraCero',
    data: {
      parte: 4,
      titulo: 'Mi comercio (estado de validación y plan)',
      historias: 'US18, US26',
    },
    loadComponent: () =>
      import('./perfil-comercio/perfil-comercio.page').then((m) => m.PerfilComercioPage),
  },
];
