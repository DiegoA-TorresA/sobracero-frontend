import { EstadoCuenta, InstanteISO, Rol } from './comun.model';

/** AutenticacionDtos.RegistroRequest — POST /api/autenticacion/registro */
export interface RegistroRequest {
  correo: string;
  /** Mínimo 8 caracteres. */
  clave: string;
  rol: Rol;
  nombre: string;
  /** Comercio (obligatorio para comercios). */
  ruc?: string | null;
  direccion?: string | null;
  distrito?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  /** Solo organizaciones (US14). */
  capacidadDiariaKg?: number | null;
}

/** AutenticacionDtos.LoginRequest — POST /api/autenticacion/login */
export interface LoginRequest {
  correo: string;
  clave: string;
}

/** AutenticacionDtos.UsuarioVista — GET /api/autenticacion/yo */
export interface UsuarioVista {
  id: number;
  correo: string;
  nombre: string;
  rol: Rol;
  /** Puede no venir para consumidores/administradores (non_null). */
  estadoCuenta?: EstadoCuenta;
}

/** AutenticacionDtos.RespuestaAutenticacion — respuesta de login y registro */
export interface RespuestaAutenticacion {
  token: string;
  expiraEn: InstanteISO;
  usuario: UsuarioVista;
}
