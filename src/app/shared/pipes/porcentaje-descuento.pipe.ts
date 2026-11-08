import { Pipe, PipeTransform } from '@angular/core';

/** (precioOriginal, precioDescuento) -> 60  · uso: {{ o.precioOriginal | descuento: o.precioDescuento }}% */
@Pipe({ name: 'descuento' })
export class PorcentajeDescuentoPipe implements PipeTransform {
  transform(original: number | null | undefined, rebajado: number | null | undefined): number {
    if (!original || rebajado == null || original <= 0) return 0;
    return Math.round((1 - rebajado / original) * 100);
  }
}
