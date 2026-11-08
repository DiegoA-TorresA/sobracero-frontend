import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { SIN_TOAST_DE_ERROR } from '../interceptors/error.interceptor';
import { NotificacionesVista } from '../models';

/** NotificacionController — /api/notificaciones */
@Injectable({ providedIn: 'root' })
export class NotificacionesApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(API_URL)}/api/notificaciones`;

  /** GET / — contador de no leídas + últimas 30. silencioso=true: sin toast si falla (sondeo). */
  mias(silencioso = false): Observable<NotificacionesVista> {
    const context = new HttpContext().set(SIN_TOAST_DE_ERROR, silencioso);
    return this.http.get<NotificacionesVista>(this.base, { context });
  }

  /** POST /leer-todas */
  leerTodas(): Observable<void> {
    return this.http.post<void>(`${this.base}/leer-todas`, null);
  }
}
