import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';

/** PARTE 1 — Autenticación (US23, US25, TS01). Montado en /autenticacion */
export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      {
        path: 'login',
        title: 'Iniciar sesión · SobraCero',
        loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'registro',
        title: 'Crear cuenta · SobraCero',
        loadComponent: () => import('./registro/registro.page').then((m) => m.RegistroPage),
      },
    ],
  },
];
