/**
 * El backend trabaja con LocalDateTime en hora de Lima y SIN zona horaria.
 * Estas funciones evitan que JavaScript convierta a UTC al enviar o leer fechas.
 */

const dos = (n: number) => String(n).padStart(2, '0');

/** Date -> "YYYY-MM-DD" (LocalDate) usando la hora local del navegador. */
export function aFechaISO(d: Date): string {
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}

/** Date -> "YYYY-MM-DDTHH:mm:ss" (LocalDateTime) sin convertir a UTC. */
export function aFechaHoraISO(d: Date): string {
  return `${aFechaISO(d)}T${dos(d.getHours())}:${dos(d.getMinutes())}:${dos(d.getSeconds())}`;
}

/** Valor de un <input type="datetime-local"> ("YYYY-MM-DDTHH:mm") -> LocalDateTime. */
export function desdeInputDatetime(valor: string): string {
  return valor.length === 16 ? `${valor}:00` : valor;
}

/** LocalDate / LocalDateTime del backend -> Date local (sin desfase de zona). */
export function aDate(iso: string): Date {
  const [f, h = '00:00:00'] = iso.split('T');
  const [y, m, d] = f.split('-').map(Number);
  const [hh, mm, ss] = h.split(':').map((x) => parseInt(x, 10) || 0);
  return new Date(y, m - 1, d, hh, mm, ss);
}

/** Minutos que faltan hasta una fecha (negativo si ya pasó). */
export function minutosHasta(iso: string): number {
  return Math.round((aDate(iso).getTime() - Date.now()) / 60000);
}
