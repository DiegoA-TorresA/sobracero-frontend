import { HttpErrorResponse } from '@angular/common/http';
import { ProblemDetail } from '../models';

/** Extrae un mensaje legible (en español) de un error HTTP del backend. */
export function mensajeDeError(err: unknown): string {
  if (!(err instanceof HttpErrorResponse)) return 'Ocurrió un error inesperado.';
  if (err.status === 0) return 'No se pudo conectar con el servidor. ¿Está levantado el backend?';
  const cuerpo = err.error as Partial<ProblemDetail> | null;
  if (cuerpo && typeof cuerpo === 'object' && cuerpo.detail) return cuerpo.detail;
  switch (err.status) {
    case 401:
      return 'Correo o contraseña incorrectos.';
    case 402:
      return 'Pago rechazado, intenta con otro método.';
    case 403:
      return 'No tienes permiso para realizar esta acción.';
    case 404:
      return 'No encontramos lo que buscabas.';
    case 409:
      return 'Ya existe un registro con esos datos.';
    default:
      return `Error ${err.status}. Inténtalo de nuevo.`;
  }
}
