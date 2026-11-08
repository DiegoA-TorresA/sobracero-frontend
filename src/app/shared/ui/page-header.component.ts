import { Component, input } from '@angular/core';

/** Encabezado de página: <app-page-header titulo="Mis ofertas" subtitulo="..."> [acciones] </app-page-header> */
@Component({
  selector: 'app-page-header',
  template: `
    <header class="ph">
      <div>
        <h1>{{ titulo() }}</h1>
        @if (subtitulo()) {
          <p class="texto-suave">{{ subtitulo() }}</p>
        }
      </div>
      <div class="ph__acciones"><ng-content /></div>
    </header>
  `,
  styles: `
    .ph {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: end;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    h1 {
      margin: 0;
      font-size: 1.75rem;
    }
    p {
      margin: 0.25rem 0 0;
    }
    .ph__acciones {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
  `,
})
export class PageHeaderComponent {
  readonly titulo = input.required<string>();
  readonly subtitulo = input<string>();
}
