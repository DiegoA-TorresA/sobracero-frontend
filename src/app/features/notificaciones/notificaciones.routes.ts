import { Routes } from '@angular/router';

/** PARTE 1 — Centro de notificaciones (US10, US11, US27). Montado en /notificaciones */
export const NOTIFICACIONES_ROUTES: Routes = [
  {
    path: '',
    title: 'Notificaciones · SobraCero',
    loadComponent: () => import('./notificaciones.page').then((m) => m.NotificacionesPage),
  },
];
