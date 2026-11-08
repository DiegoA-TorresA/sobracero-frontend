import { Routes } from '@angular/router';

/**
 * PARTE 2 — Landing pública e impacto público.
 * Montado en: / (raíz)
 * La página 404 (no-encontrado/) también es de esta parte; se monta en app.routes.ts como '**'.
 * Dueño: Desarrollador 2. Solo este desarrollador edita esta carpeta.
 */
export const LANDING_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Landing · SobraCero',
    data: {
      parte: 2,
      titulo: 'Landing: propuesta de valor, cómo funciona, para quién, diferenciadores',
      historias: 'US21, US22, US23, US24',
    },
    loadComponent: () => import('./landing/landing.page').then((m) => m.LandingPage),
  },
  {
    path: 'nuestro-impacto',
    title: 'Impacto de la plataforma · SobraCero',
    data: { parte: 2, titulo: 'Impacto de la plataforma (público)', historias: 'US20' },
    loadComponent: () =>
      import('./impacto-publico/impacto-publico.page').then((m) => m.ImpactoPublicoPage),
  },
];
