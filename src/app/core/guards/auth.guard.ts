import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { SesionService } from '../auth/sesion.service';
import { Rol } from '../models';

/** Exige sesión iniciada. Si no la hay, lleva al login recordando la URL. */
const PREFIJOS_PRIVADOS = [
  'consumidor',
  'comercio',
  'organizacion',
  'admin',
  'impacto',
  'notificaciones',
  'inicio',
];

export const autenticadoGuard: CanMatchFn = (_route, segments) => {
  const sesion = inject(SesionService);
  if (sesion.token()) return true;
  // URL desconocida -> que la atrape la ruta '**' (404) en lugar de mandar al login.
  if (!PREFIJOS_PRIVADOS.includes(segments[0]?.path ?? '')) return false;
  const url = '/' + segments.map((s) => s.path).join('/');
  return inject(Router).createUrlTree(['/autenticacion/login'], { queryParams: { volver: url } });
};

/** Exige uno de los roles indicados: canMatch: [rolGuard('COMERCIO')] */
export const rolGuard =
  (...roles: Rol[]): CanMatchFn =>
  () => {
    const sesion = inject(SesionService);
    if (sesion.token() && sesion.tieneRol(...roles)) return true;
    return inject(Router).createUrlTree([
      sesion.autenticado() ? sesion.rutaInicio() : '/autenticacion/login',
    ]);
  };

/** Solo para visitantes (login/registro): si ya hay sesión, va al inicio de su rol. */
export const invitadoGuard: CanMatchFn = () => {
  const sesion = inject(SesionService);
  return sesion.token() ? inject(Router).createUrlTree([sesion.rutaInicio()]) : true;
};

/** /inicio -> pantalla principal del rol conectado. */
export const inicioPorRolGuard: CanMatchFn = () => {
  const sesion = inject(SesionService);
  return inject(Router).createUrlTree([sesion.rutaInicio()]);
};
