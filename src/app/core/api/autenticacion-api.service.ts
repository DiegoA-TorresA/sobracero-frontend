import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { LoginRequest, RegistroRequest, RespuestaAutenticacion, UsuarioVista } from '../models';

/** AutenticacionController — /api/autenticacion */
@Injectable({ providedIn: 'root' })
export class AutenticacionApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(API_URL)}/api/autenticacion`;

  /** POST /registro — 201; 409 si el correo o RUC ya existe. */
  registrar(body: RegistroRequest): Observable<RespuestaAutenticacion> {
    return this.http.post<RespuestaAutenticacion>(`${this.base}/registro`, body);
  }

  /** POST /login — 200 con token JWT; 401 si las credenciales son inválidas. */
  login(body: LoginRequest): Observable<RespuestaAutenticacion> {
    return this.http.post<RespuestaAutenticacion>(`${this.base}/login`, body);
  }

  /** GET /yo — usuario autenticado. */
  yo(): Observable<UsuarioVista> {
    return this.http.get<UsuarioVista>(`${this.base}/yo`);
  }
}
