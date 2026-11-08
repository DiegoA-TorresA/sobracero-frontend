import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { BusquedaCercanasParams, CrearOfertaRequest, Oferta, OfertaVista } from '../models';

/** OfertaController — /api/ofertas */
@Injectable({ providedIn: 'root' })
export class OfertasApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(API_URL)}/api/ofertas`;

  /** GET /cercanas (público, US06) — ofertas activas ordenadas por distancia. */
  cercanas({ lat, lng, radioKm = 1 }: BusquedaCercanasParams): Observable<OfertaVista[]> {
    const params = new HttpParams().set('lat', lat).set('lng', lng).set('radioKm', radioKm);
    return this.http.get<OfertaVista[]>(`${this.base}/cercanas`, { params });
  }

  /** GET /{id} (público, US07) — 404 si no existe. */
  detalle(id: number): Observable<OfertaVista> {
    return this.http.get<OfertaVista>(`${this.base}/${id}`);
  }

  /** POST / (COMERCIO validado, US02 + US03) — 201 con la oferta; 403 si la cuenta no está validada. */
  crear(body: CrearOfertaRequest): Observable<Oferta> {
    return this.http.post<Oferta>(this.base, body);
  }

  /** GET /mias (COMERCIO) — todas sus ofertas con su estado. */
  mias(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${this.base}/mias`);
  }
}
