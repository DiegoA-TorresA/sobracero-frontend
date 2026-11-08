import { InjectionToken } from '@angular/core';
import { environment } from '@env/environment';

/** URL base del backend (sin "/" final). Se cambia en src/environments/*.ts */
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => environment.apiUrl.replace(/\/$/, ''),
});

/** Rutas públicas del backend: el interceptor NO adjunta el token en ellas. */
export const RUTAS_PUBLICAS_API = ['/api/autenticacion/login', '/api/autenticacion/registro'];
