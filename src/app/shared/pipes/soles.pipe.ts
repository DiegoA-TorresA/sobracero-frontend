import { Pipe, PipeTransform } from '@angular/core';

const formato = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });

/** 12.5 -> "S/ 12.50" */
@Pipe({ name: 'soles' })
export class SolesPipe implements PipeTransform {
  transform(valor: number | null | undefined): string {
    return valor == null ? '—' : formato.format(valor);
  }
}
