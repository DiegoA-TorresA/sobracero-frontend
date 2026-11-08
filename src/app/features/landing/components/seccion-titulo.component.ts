import { booleanAttribute, Component, input } from '@angular/core';

/** Encabezado centrado de cada sección de la landing. */
@Component({
  selector: 'app-seccion-titulo',
  template: `
    <div class="st" [class.st--claro]="claro()">
      <p class="st__eyebrow">{{ eyebrow() }}</p>
      <h2 [id]="idTitulo()">{{ titulo() }}</h2>
      @if (bajada()) {
        <p class="st__bajada">{{ bajada() }}</p>
      }
    </div>
  `,
  styles: `
    .st {
      text-align: center;
      max-width: 44rem;
      margin: 0 auto 2.5rem;
    }
    .st__eyebrow {
      margin: 0 0 0.5rem;
      color: var(--verde-oscuro);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.8125rem;
    }
    h2 {
      margin: 0;
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      letter-spacing: -0.01em;
      font-weight: 800;
    }
    .st__bajada {
      margin: 0.75rem 0 0;
      font-size: 1.0625rem;
      color: var(--texto-suave);
    }
    .st--claro .st__eyebrow {
      color: #6ee7b7;
    }
    .st--claro h2 {
      color: #fff;
    }
    .st--claro .st__bajada {
      color: #d1d5db;
    }
  `,
})
export class SeccionTituloComponent {
  readonly eyebrow = input.required<string>();
  readonly titulo = input.required<string>();
  readonly bajada = input<string>();
  readonly idTitulo = input<string>();
  readonly claro = input(false, { transform: booleanAttribute });
}
