import { Routes } from '@angular/router';
import { rolGuard } from '@core/guards/auth.guard';

/**
 * PARTE 6 — Impacto, reportes, distintivo y predicción.
 * Montado en: /impacto  (guard por ruta)
 * Dueño: Desarrollador 6. Solo este desarrollador edita esta carpeta.
 */
export const IMPACTO_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'comercio' },
  {
    path: 'comercio',
    canMatch: [rolGuard('COMERCIO')],
    title: 'Impacto del comercio, reporte CSV y distintivo · SobraCero',
    data: {
      parte: 6,
      titulo: 'Impacto del comercio, reporte CSV y distintivo',
      historias: 'US05, US16, US17',
    },
    loadComponent: () =>
      import('./impacto-comercio/impacto-comercio.page').then((m) => m.ImpactoComercioPage),
  },
  {
    path: 'prediccion',
    canMatch: [rolGuard('COMERCIO')],
    title: 'Predicción de excedentes · SobraCero',
    data: {
      parte: 6,
      titulo: 'Predicción de excedentes (Plan Premium)',
      historias: 'US01, US15, US26',
    },
    loadComponent: () => import('./prediccion/prediccion.page').then((m) => m.PrediccionPage),
  },
  {
    path: 'plataforma',
    canMatch: [rolGuard('ADMINISTRADOR')],
    title: 'Impacto agregado de la plataforma · SobraCero',
    data: { parte: 6, titulo: 'Impacto agregado de la plataforma', historias: 'US20' },
    loadComponent: () =>
      import('./impacto-plataforma/impacto-plataforma.page').then((m) => m.ImpactoPlataformaPage),
  },
];
