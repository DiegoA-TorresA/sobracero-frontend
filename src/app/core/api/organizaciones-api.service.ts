import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { EstadoCuenta, OrganizacionSocial } from '../models';

/** OrganizacionController — /api/organizaciones */
@Injectable({ providedIn: 'root' })
export class OrganizacionesApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(API_URL)}/api/organizaciones`;

  /** GET /yo (ORGANIZACION). */
  yo(): Observable<OrganizacionSocial> {
    return this.http.get<OrganizacionSocial>(`${this.base}/yo`);
  }

  /** PATCH /yo/capacidad (ORGANIZACION, US14) — null = sin límite. */
  actualizarCapacidad(capacidadDiariaKg: number | null): Observable<OrganizacionSocial> {
    return this.http.patch<OrganizacionSocial>(`${this.base}/yo/capacidad`, { capacidadDiariaKg });
  }

  /** GET / (ADMINISTRADOR) — opcionalmente filtrado por estado. */
  listar(estado?: EstadoCuenta): Observable<OrganizacionSocial[]> {
    const params = estado ? new HttpParams().set('estado', estado) : undefined;
    return this.http.get<OrganizacionSocial[]>(this.base, { params });
  }

  /** PATCH /{id}/validar (ADMINISTRADOR, US18 + US19). */
  validar(id: number, deducibleSunat: boolean): Observable<OrganizacionSocial> {
    return this.http.patch<OrganizacionSocial>(`${this.base}/${id}/validar`, { deducibleSunat });
  }

  /** PATCH /{id}/rechazar (ADMINISTRADOR) — motivo obligatorio. */
  rechazar(id: number, motivo: string): Observable<OrganizacionSocial> {
    return this.http.patch<OrganizacionSocial>(`${this.base}/${id}/rechazar`, { motivo });
  }
}
