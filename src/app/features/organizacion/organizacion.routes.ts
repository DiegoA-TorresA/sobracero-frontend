import { Routes } from '@angular/router';

/**
 * PARTE 5 — Organización social: donaciones.
 * Montado en: /organizacion  (rol ORGANIZACION)
 * Dueño: Desarrollador 5. Solo este desarrollador edita esta carpeta.
 */
export const ORGANIZACION_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'donaciones' },
  {
    path: 'donaciones',
    title: 'Donaciones disponibles · SobraCero',
    data: {
      parte: 5,
      titulo: 'Donaciones disponibles (aceptar / rechazar)',
      historias: 'US04, US11',
    },
    loadComponent: () =>
      import('./donaciones-disponibles/donaciones-disponibles.page').then(
        (m) => m.DonacionesDisponiblesPage,
      ),
  },
  {
    path: 'recojos',
    title: 'Mis recojos y confirmación con código · SobraCero',
    data: { parte: 5, titulo: 'Mis recojos y confirmación con código', historias: 'US12' },
    loadComponent: () => import('./mis-recojos/mis-recojos.page').then((m) => m.MisRecojosPage),
  },
  {
    path: 'registro',
    title: 'Registro de donaciones recibidas · SobraCero',
    data: {
      parte: 5,
      titulo: 'Registro de donaciones recibidas (Ley 30498)',
      historias: 'US13, US33',
    },
    loadComponent: () =>
      import('./registro-donaciones/registro-donaciones.page').then(
        (m) => m.RegistroDonacionesPage,
      ),
  },
  {
    path: 'perfil',
    title: 'Mi organización · SobraCero',
    data: { parte: 5, titulo: 'Mi organización: capacidad e impacto', historias: 'US14, US19' },
    loadComponent: () =>
      import('./perfil-organizacion/perfil-organizacion.page').then(
        (m) => m.PerfilOrganizacionPage,
      ),
  },
];
