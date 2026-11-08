import { Component, input } from '@angular/core';

/** Estado vacío: <app-empty-state icono="🥐" titulo="Aún no hay ofertas" texto="..."> [botón] </app-empty-state> */
@Component({
  selector: 'app-empty-state',
  template: `
    <div class="vacio">
      <div class="vacio__icono" aria-hidden="true">{{ icono() }}</div>
      <h2>{{ titulo() }}</h2>
      @if (texto()) {
        <p class="texto-suave">{{ texto() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: `
    .vacio {
      text-align: center;
      padding: 3rem 1rem;
      background: var(--superficie);
      border: 1px dashed var(--borde);
      border-radius: var(--radio-lg);
    }
    .vacio__icono {
      font-size: 2.5rem;
    }
    h2 {
      font-size: 1.125rem;
      margin: 0.5rem 0 0.25rem;
    }
    p {
      margin: 0 auto 1rem;
      max-width: 32rem;
    }
  `,
})
export class EmptyStateComponent {
  readonly icono = input('🍃');
  readonly titulo = input.required<string>();
  readonly texto = input<string>();
}
