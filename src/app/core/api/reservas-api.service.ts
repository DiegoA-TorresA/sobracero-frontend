import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { CanjearRequest, ReservarRequest, ReservaVista } from '../models';

/** ReservaController — /api/reservas */
@Injectable({ providedIn: 'root' })
export class ReservasApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(API_URL)}/api/reservas`;

  /** POST / (CONSUMIDOR, US08 + US09) — 201 con código; 402 si el pago es rechazado. */
  reservar(body: ReservarRequest): Observable<ReservaVista> {
    return this.http.post<ReservaVista>(this.base, body);
  }

  /** GET /mias (CONSUMIDOR). */
  mias(): Observable<ReservaVista[]> {
    return this.http.get<ReservaVista[]>(`${this.base}/mias`);
  }

  /** POST /canjear (COMERCIO) — 409 si el código ya fue usado. */
  canjear(body: CanjearRequest): Observable<ReservaVista> {
    return this.http.post<ReservaVista>(`${this.base}/canjear`, body);
  }
}
