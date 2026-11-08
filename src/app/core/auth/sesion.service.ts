import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AutenticacionApiService } from '../api/autenticacion-api.service';
import {
  LoginRequest,
  RegistroRequest,
  RespuestaAutenticacion,
  Rol,
  UsuarioVista,
} from '../models';
import { RUTA_INICIO_POR_ROL } from './rutas-por-rol';

const CLAVE_STORAGE = 'sobracero.sesion';

interface SesionGuardada {
  token: string;
  expiraEn: string;
  usuario: UsuarioVista;
}

/**
 * Estado de la sesión (JWT + usuario) basado en signals.
 * Es la ÚNICA fuente de verdad sobre "quién está conectado" en el frontend.
 */
@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly api = inject(AutenticacionApiService);
  private readonly router = inject(Router);

  private readonly _sesion = signal<SesionGuardada | null>(this.leerStorage());

  readonly usuario = computed(() => this._sesion()?.usuario ?? null);
  readonly rol = computed<Rol | null>(() => this._sesion()?.usuario.rol ?? null);
  readonly autenticado = computed(() => this._sesion() !== null);
  readonly rutaInicio = computed(() => {
    const rol = this.rol();
    return rol ? RUTA_INICIO_POR_ROL[rol] : '/';
  });

  /** Token vigente o null (si expiró, cierra la sesión). */
  token(): string | null {
    const s = this._sesion();
    if (!s) return null;
    if (new Date(s.expiraEn).getTime() <= Date.now()) {
      this.limpiar();
      return null;
    }
    return s.token;
  }

  tieneRol(...roles: Rol[]): boolean {
    const r = this.rol();
    return r !== null && roles.includes(r);
  }

  login(body: LoginRequest): Observable<RespuestaAutenticacion> {
    return this.api.login(body).pipe(tap((r) => this.guardar(r)));
  }

  registrar(body: RegistroRequest): Observable<RespuestaAutenticacion> {
    return this.api.registrar(body).pipe(tap((r) => this.guardar(r)));
  }

  /** Refresca los datos del usuario (p. ej. tras ser validado por el admin). */
  refrescarUsuario(): Observable<UsuarioVista> {
    return this.api.yo().pipe(
      tap((usuario) => {
        const s = this._sesion();
        if (s) this.persistir({ ...s, usuario });
      }),
    );
  }

  cerrarSesion(redirigir = true): void {
    this.limpiar();
    if (redirigir) this.router.navigateByUrl('/autenticacion/login');
  }

  private guardar(r: RespuestaAutenticacion): void {
    this.persistir({ token: r.token, expiraEn: r.expiraEn, usuario: r.usuario });
  }

  private persistir(s: SesionGuardada): void {
    this._sesion.set(s);
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(s));
    } catch {
      /* almacenamiento no disponible: la sesión vive solo en memoria */
    }
  }

  private limpiar(): void {
    this._sesion.set(null);
    try {
      localStorage.removeItem(CLAVE_STORAGE);
    } catch {
      /* nada */
    }
  }

  private leerStorage(): SesionGuardada | null {
    try {
      const crudo = localStorage.getItem(CLAVE_STORAGE);
      if (!crudo) return null;
      const s = JSON.parse(crudo) as SesionGuardada;
      return new Date(s.expiraEn).getTime() > Date.now() ? s : null;
    } catch {
      return null;
    }
  }
}
