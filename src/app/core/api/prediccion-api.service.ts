import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { Prediccion } from '../models';

/** PrediccionController — /api/prediccion */
@Injectable({ providedIn: 'root' })
export class PrediccionApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(API_URL)}/api/prediccion`;

  /** GET /comercio (COMERCIO Premium, US01) — disponible=false si hay < 15 días de historial. */
  comercio(): Observable<Prediccion> {
    return this.http.get<Prediccion>(`${this.base}/comercio`);
  }
}
