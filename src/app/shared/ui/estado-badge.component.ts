import { Component, computed, input } from '@angular/core';

type Tono = 'verde' | 'naranja' | 'rojo' | 'gris' | 'azul';

/** Colores por estado (cuenta, oferta, reserva, donación). */
const TONO_POR_ESTADO: Record<string, Tono> = {
  VALIDADA: 'verde',
  PENDIENTE: 'naranja',
  RECHAZADA: 'rojo',
  ACTIVA: 'verde',
  AGOTADA: 'gris',
  DONADA: 'azul',
  VENCIDA: 'gris',
  PERDIDA: 'rojo',
  PAGADA: 'naranja',
  RECOGIDA: 'verde',
  NO_RECOGIDA: 'rojo',
  OFRECIDA: 'naranja',
  ACEPTADA: 'azul',
  COMPLETADA: 'verde',
  PREMIUM: 'naranja',
  GRATIS: 'gris',
};

const ETIQUETA: Record<string, string> = {
  NO_RECOGIDA: 'No recogida',
  PREMIUM: 'Plan Premium',
  GRATIS: 'Plan Gratis',
};

/** <app-estado-badge [estado]="oferta.estado" /> */
@Component({
  selector: 'app-estado-badge',
  template: `<span class="badge" [class]="'badge badge--' + tono()">{{ texto() }}</span>`,
  styles: `
    .badge {
      display: inline-block;
      padding: 0.125rem 0.625rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.02em;
    }
    .badge--verde {
      background: #d1fae5;
      color: #065f46;
    }
    .badge--naranja {
      background: #ffedd5;
      color: #9a3412;
    }
    .badge--rojo {
      background: #fee2e2;
      color: #991b1b;
    }
    .badge--gris {
      background: var(--gris-claro);
      color: #374151;
    }
    .badge--azul {
      background: #dbeafe;
      color: #1e40af;
    }
  `,
})
export class EstadoBadgeComponent {
  readonly estado = input.required<string>();
  protected readonly tono = computed(() => TONO_POR_ESTADO[this.estado()] ?? 'gris');
  protected readonly texto = computed(() => {
    const e = this.estado();
    return ETIQUETA[e] ?? e.charAt(0) + e.slice(1).toLowerCase().replace(/_/g, ' ');
  });
}
