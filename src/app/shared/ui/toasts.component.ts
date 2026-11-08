import { Component, inject } from '@angular/core';
import { NotificadorService } from '@core/utils/notificador.service';

/** Contenedor de toasts. Se coloca una sola vez en el App/layout. */
@Component({
  selector: 'app-toasts',
  template: `
    <div class="toasts" aria-live="polite">
      @for (t of notificador.toasts(); track t.id) {
        <div class="toast" [class]="'toast toast--' + t.tipo" role="status">
          <span>{{ t.mensaje }}</span>
          <button
            type="button"
            class="toast__cerrar"
            (click)="notificador.cerrar(t.id)"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toasts {
      position: fixed;
      right: 1rem;
      bottom: 5rem;
      z-index: 1000;
      display: grid;
      gap: 0.5rem;
      max-width: min(24rem, calc(100vw - 2rem));
    }
    .toast {
      display: flex;
      gap: 0.75rem;
      align-items: start;
      padding: 0.75rem 1rem;
      border-radius: var(--radio);
      background: var(--superficie);
      box-shadow: var(--sombra-2);
      border-left: 4px solid var(--info);
      animation: entrar 0.2s ease-out;
    }
    .toast--exito {
      border-color: var(--verde);
    }
    .toast--error {
      border-color: var(--rojo);
    }
    .toast span {
      flex: 1;
    }
    .toast__cerrar {
      background: none;
      border: 0;
      font-size: 1.25rem;
      line-height: 1;
      cursor: pointer;
      color: var(--texto-suave);
    }
    @keyframes entrar {
      from {
        transform: translateY(8px);
        opacity: 0;
      }
    }
    @media (min-width: 768px) {
      .toasts {
        bottom: 1rem;
      }
    }
  `,
})
export class ToastsComponent {
  protected readonly notificador = inject(NotificadorService);
}
