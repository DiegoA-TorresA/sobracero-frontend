import { Component, input, model } from '@angular/core';
import { EstadoCuenta } from '@core/models';

export type FiltroEstado = EstadoCuenta | 'TODOS';

/** Pestañas Pendientes / Validadas / Rechazadas / Todas con contador. */
@Component({
  selector: 'app-filtro-estado',
  template: `
    <div class="fe" role="tablist" aria-label="Filtrar por estado">
      @for (o of opciones; track o.valor) {
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="valor() === o.valor"
          [class.activo]="valor() === o.valor"
          (click)="valor.set(o.valor)"
        >
          {{ o.texto }}
          @if (conteos()[o.valor] !== undefined) {
            <span class="n">{{ conteos()[o.valor] }}</span>
          }
        </button>
      }
    </div>
  `,
  styles: `
    .fe {
      display: flex;
      gap: 0.25rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid var(--borde);
      overflow-x: auto;
    }
    button {
      padding: 0.75rem 1rem;
      border: 0;
      border-bottom: 3px solid transparent;
      background: none;
      font: inherit;
      font-weight: 600;
      color: var(--texto-suave);
      cursor: pointer;
      white-space: nowrap;
    }
    button.activo {
      color: var(--verde-oscuro);
      border-bottom-color: var(--verde);
    }
    .n {
      display: inline-block;
      min-width: 1.5rem;
      margin-left: 0.25rem;
      padding: 0 0.375rem;
      border-radius: 999px;
      background: var(--gris-claro);
      font-size: 0.75rem;
    }
  `,
})
export class FiltroEstadoComponent {
  readonly valor = model<FiltroEstado>('PENDIENTE');
  readonly conteos = input<Partial<Record<FiltroEstado, number>>>({});
  protected readonly opciones: { valor: FiltroEstado; texto: string }[] = [
    { valor: 'PENDIENTE', texto: 'Pendientes' },
    { valor: 'VALIDADA', texto: 'Validadas' },
    { valor: 'RECHAZADA', texto: 'Rechazadas' },
    { valor: 'TODOS', texto: 'Todas' },
  ];
}
