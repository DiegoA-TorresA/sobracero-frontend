import { Component, input } from '@angular/core';
import { DonacionVista } from '@core/models';
import { FechaExactaPipe } from '@shared/pipes/fecha-exacta.pipe';
import { KgPipe } from '@shared/pipes/kg.pipe';
import { EstadoBadgeComponent } from '@shared/ui/estado-badge.component';

/** Tarjeta de una donación: qué es, cuánto pesa, dónde recogerla y hasta cuándo. Las acciones van proyectadas. */
@Component({
  selector: 'app-tarjeta-donacion',
  imports: [EstadoBadgeComponent, KgPipe, FechaExactaPipe],
  template: `
    <article class="td">
      <div class="td__info">
        <div class="td__cabecera">
          <h2>{{ d().cantidad }} × {{ d().ofertaTitulo }}</h2>
          <app-estado-badge [estado]="d().estado" />
        </div>
        <p class="td__peso">
          {{ d().categoria }} · <strong>{{ d().pesoKg | kg }}</strong>
        </p>
        <p>
          🏪 {{ d().comercioNombre }}
          @if (d().comercioDireccion) {
            · {{ d().comercioDireccion }}
          }
        </p>
        <p class="td__meta">
          📍
          {{
            d().distanciaKm < 1
              ? (d().distanciaKm * 1000).toFixed(0) + ' m'
              : d().distanciaKm.toFixed(1) + ' km'
          }}
          ·
          <a
            [href]="
              'https://www.google.com/maps/dir/?api=1&destination=' +
              d().latitud +
              ',' +
              d().longitud
            "
            target="_blank"
            rel="noopener"
            >Cómo llegar</a
          >
        </p>
        @if (d().estado === 'COMPLETADA' && d().completadaEn) {
          <p class="td__meta">✔ Recogida {{ d().completadaEn | fechaExacta }}</p>
        } @else {
          <p class="td__recojo">
            ⏰ Recojo {{ d().recojoDesde | fechaExacta }} –
            {{ d().recojoHasta | fechaExacta: 'hora' }}
          </p>
        }
      </div>
      <div class="td__acciones"><ng-content /></div>
    </article>
  `,
  styles: `
    .td {
      display: grid;
      gap: 1rem;
      padding: 1.25rem;
      background: var(--superficie);
      border: 1px solid var(--borde);
      border-radius: var(--radio-lg);
    }
    .td__cabecera {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      align-items: start;
    }
    h2 {
      margin: 0;
      font-size: 1.0625rem;
    }
    p {
      margin: 0.25rem 0 0;
    }
    .td__peso strong {
      color: var(--verde-oscuro);
    }
    .td__meta {
      font-size: 0.875rem;
      color: var(--texto-suave);
    }
    .td__recojo {
      font-weight: 600;
      font-size: 0.9375rem;
      color: var(--rojo);
    }
    .td__acciones:empty {
      display: none;
    }
    .td__acciones {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    @media (min-width: 768px) {
      .td {
        grid-template-columns: 1fr auto;
        align-items: center;
      }
      .td__acciones {
        flex-direction: column;
        min-width: 180px;
      }
    }
  `,
})
export class TarjetaDonacionComponent {
  readonly d = input.required<DonacionVista>();
}
