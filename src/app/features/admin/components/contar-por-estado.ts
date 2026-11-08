import { EstadoCuenta } from '@core/models';
import { FiltroEstado } from './filtro-estado.component';

export function contarPorEstado(
  lista: { estado: EstadoCuenta }[],
): Partial<Record<FiltroEstado, number>> {
  const c: Partial<Record<FiltroEstado, number>> = {
    TODOS: lista.length,
    PENDIENTE: 0,
    VALIDADA: 0,
    RECHAZADA: 0,
  };
  for (const x of lista) c[x.estado] = (c[x.estado] ?? 0) + 1;
  return c;
}
