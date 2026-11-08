import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { CompletarDonacionRequest, DonacionVista, FilaRegistroDonacion } from '../models';

/** DonacionController — /api/donaciones */
@Injectable({ providedIn: 'root' })
export class DonacionesApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(API_URL)}/api/donaciones`;

  /** GET /mias (ORGANIZACION, US11) — ofrecidas, aceptadas y completadas. */
  mias(): Observable<DonacionVista[]> {
    return this.http.get<DonacionVista[]>(`${this.base}/mias`);
  }

  /** POST /{id}/aceptar (ORGANIZACION). */
  aceptar(id: number): Observable<DonacionVista> {
    return this.http.post<DonacionVista>(`${this.base}/${id}/aceptar`, null);
  }

  /** POST /{id}/rechazar (ORGANIZACION) — sin cuerpo de respuesta; el backend redirige a otra organización. */
  rechazar(id: number): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/rechazar`, null);
  }

  /** POST /completar (ORGANIZACION, US12) — confirma el recojo con el código. */
  completar(body: CompletarDonacionRequest): Observable<DonacionVista> {
    return this.http.post<DonacionVista>(`${this.base}/completar`, body);
  }

  /** GET /registro (ORGANIZACION, US13) — filas del registro Ley 30498. */
  registro(): Observable<FilaRegistroDonacion[]> {
    return this.http.get<FilaRegistroDonacion[]>(`${this.base}/registro`);
  }

  /** GET /comercio (COMERCIO) — donaciones generadas por sus ofertas. */
  deComercio(): Observable<DonacionVista[]> {
    return this.http.get<DonacionVista[]>(`${this.base}/comercio`);
  }
}
