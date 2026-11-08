import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { Comercio, EstadoCuenta, Plan } from '../models';

/** ComercioController — /api/comercios */
@Injectable({ providedIn: 'root' })
export class ComerciosApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(API_URL)}/api/comercios`;

  /** GET /yo (COMERCIO) — datos del comercio autenticado (estado, plan, motivo de rechazo). */
  yo(): Observable<Comercio> {
    return this.http.get<Comercio>(`${this.base}/yo`);
  }

  /** GET / (ADMINISTRADOR) — opcionalmente filtrado por estado. */
  listar(estado?: EstadoCuenta): Observable<Comercio[]> {
    const params = estado ? new HttpParams().set('estado', estado) : undefined;
    return this.http.get<Comercio[]>(this.base, { params });
  }

  /** PATCH /{id}/validar (ADMINISTRADOR, US18). */
  validar(id: number): Observable<Comercio> {
    return this.http.patch<Comercio>(`${this.base}/${id}/validar`, null);
  }

  /** PATCH /{id}/rechazar (ADMINISTRADOR, US18) — motivo obligatorio. */
  rechazar(id: number, motivo: string): Observable<Comercio> {
    return this.http.patch<Comercio>(`${this.base}/${id}/rechazar`, { motivo });
  }

  /** PATCH /{id}/plan (ADMINISTRADOR, US26) — GRATIS o PREMIUM. */
  cambiarPlan(id: number, plan: Plan): Observable<Comercio> {
    return this.http.patch<Comercio>(`${this.base}/${id}/plan`, { plan });
  }
}
