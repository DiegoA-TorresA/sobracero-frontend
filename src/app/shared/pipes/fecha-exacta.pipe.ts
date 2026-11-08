import { Pipe, PipeTransform } from '@angular/core';
import { aDate } from '@core/utils/fechas';

const hora = new Intl.DateTimeFormat('es-PE', { hour: 'numeric', minute: '2-digit', hour12: true });
const dia = new Intl.DateTimeFormat('es-PE', { weekday: 'short', day: 'numeric', month: 'short' });

/**
 * Etiqueta del informe (Labeling Systems): "Vence hoy a las 7:00 p. m."
 * Uso: {{ oferta.recojoHasta | fechaExacta }}  -> "hoy a las 9:00 p. m."
 *      {{ oferta.venceEl | fechaExacta: 'dia' }} -> "hoy" / "mañana" / "sáb, 8 nov"
 */
@Pipe({ name: 'fechaExacta' })
export class FechaExactaPipe implements PipeTransform {
  transform(
    iso: string | null | undefined,
    modo: 'completa' | 'dia' | 'hora' = 'completa',
  ): string {
    if (!iso) return '—';
    const d = aDate(iso);
    const hoy = new Date();
    const manana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
    const mismoDia = (a: Date, b: Date) => a.toDateString() === b.toDateString();
    const nombreDia = mismoDia(d, hoy) ? 'hoy' : mismoDia(d, manana) ? 'mañana' : dia.format(d);
    if (modo === 'dia') return nombreDia;
    if (modo === 'hora') return hora.format(d);
    return `${nombreDia} a las ${hora.format(d)}`;
  }
}
