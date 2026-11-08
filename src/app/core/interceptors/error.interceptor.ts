import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SesionService } from '../auth/sesion.service';
import { NotificadorService } from '../utils/notificador.service';
import { mensajeDeError } from '../utils/errores';

/**
 * Si una petición quiere manejar su error ella misma (sin toast global), se envía con:
 *   this.http.get(url, { context: new HttpContext().set(SIN_TOAST_DE_ERROR, true) })
 */
export const SIN_TOAST_DE_ERROR = new HttpContextToken<boolean>(() => false);

/** Manejo global: 401 -> cierra sesión; demás errores -> toast con el "detail" del backend. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const sesion = inject(SesionService);
  const notificador = inject(NotificadorService);
  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const esLogin = req.url.endsWith('/api/autenticacion/login');
        if (err.status === 401 && !esLogin && sesion.autenticado()) {
          notificador.error('Tu sesión expiró. Vuelve a iniciar sesión.');
          sesion.cerrarSesion();
        } else if (!req.context.get(SIN_TOAST_DE_ERROR)) {
          notificador.error(mensajeDeError(err));
        }
      }
      return throwError(() => err);
    }),
  );
};
