import { Component, input } from '@angular/core';

/** Métrica grande: <app-tarjeta-metrica icono="🌱" etiqueta="Kilos rescatados" valor="120 kg" detalle="..." tono="verde" /> */
@Component({
  selector: 'app-tarjeta-metrica',
  template: `
    <div class="tm" [class]="'tm tm--' + tono()">
      <p class="tm__etiqueta">
        <span aria-hidden="true">{{ icono() }}</span> {{ etiqueta() }}
      </p>
      <p class="tm__valor">{{ valor() }}</p>
      @if (detalle()) {
        <p class="tm__detalle">{{ detalle() }}</p>
      }
    </div>
  `,
  styles: `
    .tm {
      height: 100%;
      padding: 1.25rem;
      border-radius: var(--radio-lg);
      background: var(--superficie);
      border: 1px solid var(--borde);
    }
    .tm--verde {
      background: #ecfdf5;
      border-color: #a7f3d0;
    }
    .tm--naranja {
      background: #fff7ed;
      border-color: #fed7aa;
    }
    .tm--rojo {
      background: #fef2f2;
      border-color: #fecaca;
    }
    .tm__etiqueta {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--texto-suave);
    }
    .tm__valor {
      margin: 0.375rem 0 0;
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.01em;
      font-variant-numeric: tabular-nums;
    }
    .tm--verde .tm__valor {
      color: var(--verde-oscuro);
    }
    .tm--rojo .tm__valor {
      color: #b91c1c;
    }
    .tm__detalle {
      margin: 0.25rem 0 0;
      font-size: 0.8125rem;
      color: var(--texto-suave);
    }
  `,
})
export class TarjetaMetricaComponent {
  readonly icono = input('');
  readonly etiqueta = input.required<string>();
  readonly valor = input.required<string>();
  readonly detalle = input<string>();
  readonly tono = input<'neutro' | 'verde' | 'naranja' | 'rojo'>('neutro');
}
