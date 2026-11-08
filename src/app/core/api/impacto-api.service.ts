import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { SIN_TOAST_DE_ERROR } from '../interceptors/error.interceptor';
import { ImpactoComercio, ImpactoOrganizacion, ImpactoPlataforma } from '../models';

/** ImpactoController — /api/impacto */
@Injectable({ providedIn: 'root' })
export class ImpactoApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(API_URL)}/api/impacto`;

  /** GET /comercio (COMERCIO, US05/US16/US17). */
  comercio(): Observable<ImpactoComercio> {
    return this.http.get<ImpactoComercio>(`${this.base}/comercio`);
  }

  /** GET /comercio/reporte.csv (COMERCIO Premium) — 403 con Plan Gratis. Devuelve el archivo como Blob. */
  reporteComercioCsv(): Observable<Blob> {
    return this.http.get(`${this.base}/comercio/reporte.csv`, { responseType: 'blob' });
  }

  /** GET /organizacion (ORGANIZACION). */
  organizacion(): Observable<ImpactoOrganizacion> {
    return this.http.get<ImpactoOrganizacion>(`${this.base}/organizacion`);
  }

  /** GET /plataforma (público, US20). silencioso=true: sin toast si falla (landing pública). */
  plataforma(silencioso = false): Observable<ImpactoPlataforma> {
    const context = new HttpContext().set(SIN_TOAST_DE_ERROR, silencioso);
    return this.http.get<ImpactoPlataforma>(`${this.base}/plataforma`, { context });
  }
}
