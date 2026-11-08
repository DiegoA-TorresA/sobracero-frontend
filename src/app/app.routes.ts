import { Routes } from '@angular/router';
import {
  autenticadoGuard,
  inicioPorRolGuard,
  invitadoGuard,
  rolGuard,
} from '@core/guards/auth.guard';
import { ShellComponent } from '@layout/shell.component';

/**
 * Enrutamiento principal. ⚠️ ARCHIVO CONGELADO: lo mantiene solo el Desarrollador 1.
 * Cada parte agrega/cambia sus pantallas en su propio *.routes.ts, nunca aquí.
 *
 *   /                      -> Parte 2 (landing, pública)
 *   /autenticacion/...     -> Parte 1 (login, registro)
 *   /notificaciones        -> Parte 1
 *   /consumidor/...        -> Parte 3
 *   /comercio/...          -> Parte 4
 *   /organizacion/...      -> Parte 5
 *   /admin/...             -> Parte 6
 *   /impacto/...           -> Parte 6
 */
export const routes: Routes = [
  {
    path: 'autenticacion',
    canMatch: [invitadoGuard],
    loadChildren: () => import('@features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    loadChildren: () => import('@features/landing/landing.routes').then((m) => m.LANDING_ROUTES),
  },
  {
    path: '',
    component: ShellComponent,
    canMatch: [autenticadoGuard],
    children: [
      { path: 'inicio', canMatch: [inicioPorRolGuard], children: [] },
      {
        path: 'notificaciones',
        loadChildren: () =>
          import('@features/notificaciones/notificaciones.routes').then(
            (m) => m.NOTIFICACIONES_ROUTES,
          ),
      },
      {
        path: 'consumidor',
        canMatch: [rolGuard('CONSUMIDOR')],
        loadChildren: () =>
          import('@features/consumidor/consumidor.routes').then((m) => m.CONSUMIDOR_ROUTES),
      },
      {
        path: 'comercio',
        canMatch: [rolGuard('COMERCIO')],
        loadChildren: () =>
          import('@features/comercio/comercio.routes').then((m) => m.COMERCIO_ROUTES),
      },
      {
        path: 'organizacion',
        canMatch: [rolGuard('ORGANIZACION')],
        loadChildren: () =>
          import('@features/organizacion/organizacion.routes').then((m) => m.ORGANIZACION_ROUTES),
      },
      {
        path: 'admin',
        canMatch: [rolGuard('ADMINISTRADOR')],
        loadChildren: () => import('@features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
      },
      {
        // Cada ruta hija de impacto aplica su propio rolGuard (COMERCIO o ADMINISTRADOR).
        path: 'impacto',
        loadChildren: () =>
          import('@features/impacto/impacto.routes').then((m) => m.IMPACTO_ROUTES),
      },
    ],
  },
  {
    path: '**',
    title: 'Página no encontrada · SobraCero',
    data: { parte: 2, titulo: 'Página no encontrada', historias: '—' },
    loadComponent: () =>
      import('@features/landing/no-encontrado/no-encontrado.page').then((m) => m.NoEncontradoPage),
  },
];
