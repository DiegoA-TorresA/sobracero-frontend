/**
 * Tipos comunes compartidos por todos los módulos.
 * Fuente: pe.upc.sobracero.comun.* del backend.
 *
 * Convenciones de serialización del backend (Jackson):
 *  - Long / int / double / BigDecimal  -> number
 *  - LocalDate                         -> string "YYYY-MM-DD"
 *  - LocalDateTime                     -> string "YYYY-MM-DDTHH:mm:ss" (hora de Lima, SIN zona)
 *  - Instant                           -> string ISO-8601 con "Z"
 *  - spring.jackson.default-property-inclusion = non_null
 *    -> los campos null NO llegan en el JSON; por eso se marcan como opcionales (?).
 */

/** comun.Rol */
export type Rol = 'COMERCIO' | 'CONSUMIDOR' | 'ORGANIZACION' | 'ADMINISTRADOR';

/** comun.EstadoCuenta */
export type EstadoCuenta = 'PENDIENTE' | 'VALIDADA' | 'RECHAZADA';

/** Plan del comercio (Comercio.plan). */
export type Plan = 'GRATIS' | 'PREMIUM';

/** java.time.LocalDate  -> "2026-11-06" */
export type FechaISO = string;
/** java.time.LocalDateTime -> "2026-11-06T19:00:00" (hora local de Lima, sin zona) */
export type FechaHoraISO = string;
/** java.time.Instant -> "2026-11-07T05:42:00Z" */
export type InstanteISO = string;

/**
 * Respuesta de error del backend (Spring ProblemDetail, RFC 9457).
 * Lo produce comun.ManejadorExcepciones. El mensaje para el usuario viene en `detail` (en español).
 */
export interface ProblemDetail {
  type?: string;
  title?: string;
  status: number;
  detail?: string;
  instance?: string;
}
