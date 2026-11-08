import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `<div class="sp" role="status"><span class="sp__rueda"></span>{{ texto() }}</div>`,
  styles: `
    .sp {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: var(--texto-suave);
    }
    .sp__rueda {
      width: 1.25rem;
      height: 1.25rem;
      border: 3px solid var(--gris-claro);
      border-top-color: var(--verde);
      border-radius: 50%;
      animation: girar 0.8s linear infinite;
    }
    @keyframes girar {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class SpinnerComponent {
  readonly texto = input('Cargando…');
}
