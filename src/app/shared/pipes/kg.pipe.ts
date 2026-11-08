import { Pipe, PipeTransform } from '@angular/core';

const formato = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 1 });

/** 1234.56 -> "1 234,6 kg" ; >= 1000 kg con { toneladas: true } -> "1,2 t" */
@Pipe({ name: 'kg' })
export class KgPipe implements PipeTransform {
  transform(valor: number | null | undefined, toneladas = false): string {
    if (valor == null) return '—';
    return toneladas && valor >= 1000
      ? `${formato.format(valor / 1000)} t`
      : `${formato.format(valor)} kg`;
  }
}
