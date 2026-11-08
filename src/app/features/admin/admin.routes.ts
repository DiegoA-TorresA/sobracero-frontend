import { Routes } from '@angular/router';

/**
 * PARTE 6 — Administración: validación de cuentas y planes.
 * Montado en: /admin  (rol ADMINISTRADOR)
 * Dueño: Desarrollador 6. Solo este desarrollador edita esta carpeta.
 */
export const ADMIN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'comercios' },
  {
    path: 'comercios',
    title: 'Validación de comercios y plan · SobraCero',
    data: { parte: 6, titulo: 'Validación de comercios y plan', historias: 'US18, US26' },
    loadComponent: () =>
      import('./validar-comercios/validar-comercios.page').then((m) => m.ValidarComerciosPage),
  },
  {
    path: 'organizaciones',
    title: 'Validación de organizaciones y SUNAT · SobraCero',
    data: { parte: 6, titulo: 'Validación de organizaciones y SUNAT', historias: 'US18, US19' },
    loadComponent: () =>
      import('./validar-organizaciones/validar-organizaciones.page').then(
        (m) => m.ValidarOrganizacionesPage,
      ),
  },
];
