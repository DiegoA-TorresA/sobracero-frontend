import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL, RUTAS_PUBLICAS_API } from '../config/api.config';
import { SesionService } from '../auth/sesion.service';

/** Adjunta "Authorization: Bearer <token>" a las peticiones hacia nuestra API. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = inject(API_URL);
  if (!req.url.startsWith(apiUrl) || RUTAS_PUBLICAS_API.some((r) => req.url.endsWith(r))) {
    return next(req);
  }
  const token = inject(SesionService).token();
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};
