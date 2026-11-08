import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DonacionesApiService } from '@core/api';
import { FechaExactaPipe } from '@shared/pipes/fecha-exacta.pipe';
import { KgPipe } from '@shared/pipes/kg.pipe';
import { EmptyStateComponent } from '@shared/ui/empty-state.component';
import { EstadoBadgeComponent } from '@shared/ui/estado-badge.component';
import { PageHeaderComponent } from '@shared/ui/page-header.component';
import { SpinnerComponent } from '@shared/ui/spinner.component';

/**
 * PARTE 4 · US04 (seguimiento) — Donaciones generadas por las ofertas del comercio.
 * La organización confirma el recojo ingresando el código de donación que el comercio le muestra.
 */
@Component({
  selector: 'app-donaciones-comercio-page',
  imports: [
    PageHeaderComponent,
    SpinnerComponent,
    EmptyStateComponent,
    EstadoBadgeComponent,
    KgPipe,
    FechaExactaPipe,
  ],
  template: `
    <app-page-header
      titulo="Donaciones"
      subtitulo="Lo que no vendiste y se derivó automáticamente a organizaciones sociales."
    >
      <button type="button" class="btn btn--secundario btn--sm" (click)="donaciones.reload()">
        ↻ Actualizar
      </button>
    </app-page-header>

    @if (donaciones.isLoading()) {
      <app-spinner />
    } @else {
      <dl class="resumen">
        <div>
          <dt>Donaciones entregadas</dt>
          <dd>{{ totales().completadas }}</dd>
        </div>
        <div>
          <dt>Kilos donados</dt>
          <dd>{{ totales().kg | kg }}</dd>
        </div>
        <div>
          <dt>Por recoger</dt>
          <dd>{{ totales().pendientes }}</dd>
        </div>
      </dl>

      <div class="lista">
        @for (d of donaciones.value() ?? []; track d.id) {
          <article class="tarjeta don">
            <div>
              <div class="don__cabecera">
                <h2>{{ d.cantidad }} × {{ d.ofertaTitulo }}</h2>
                <app-estado-badge [estado]="d.estado" />
              </div>
              <p class="texto-suave">{{ d.categoria }} · {{ d.pesoKg | kg }}</p>
              <p>🤝 {{ d.organizacionNombre ?? 'Organización asignada' }}</p>
              @if (d.estado === 'COMPLETADA' && d.completadaEn) {
                <p class="texto-suave">Recogida {{ d.completadaEn | fechaExacta }}</p>
              } @else {
                <p class="texto-suave">Recojo hasta {{ d.recojoHasta | fechaExacta }}</p>
              }
            </div>
            @if (d.estado === 'OFRECIDA' || d.estado === 'ACEPTADA') {
              <div class="codigo">
                <span>Código de recojo</span>
                <strong>{{ d.codigo }}</strong>
                <small>Dáselo a la organización cuando recoja.</small>
              </div>
            }
          </article>
        } @empty {
          <app-empty-state
            icono="🤝"
            titulo="Aún no hay donaciones"
            texto="Cuando una oferta no se reserve antes del cierre, se ofrecerá aquí a una organización cercana."
          />
        }
      </div>
    }
  `,
  styles: `
    .resumen {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      margin: 0 0 1.25rem;
    }
    .resumen > div {
      padding: 1rem;
      background: var(--superficie);
      border: 1px solid var(--borde);
      border-radius: var(--radio);
    }
    .resumen dt {
      font-size: 0.8125rem;
      color: var(--texto-suave);
    }
    .resumen dd {
      margin: 0.25rem 0 0;
      font-size: 1.375rem;
      font-weight: 800;
    }
    .lista {
      display: grid;
      gap: 0.75rem;
    }
    .don {
      display: grid;
      gap: 1rem;
      padding: 1.25rem;
    }
    .don__cabecera {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
    }
    h2 {
      margin: 0;
      font-size: 1.0625rem;
    }
    .don p {
      margin: 0.25rem 0 0;
    }
    .codigo {
      display: grid;
      gap: 0.125rem;
      place-items: center;
      padding: 0.875rem;
      border: 2px dashed var(--verde);
      border-radius: var(--radio);
      background: #ecfdf5;
      text-align: center;
    }
    .codigo span {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--verde-oscuro);
      font-weight: 600;
    }
    .codigo strong {
      font:
        800 1.5rem/1.2 ui-monospace,
        Consolas,
        monospace;
      letter-spacing: 0.08em;
      color: var(--verde-oscuro);
    }
    .codigo small {
      color: var(--texto-suave);
    }
    @media (min-width: 768px) {
      .don {
        grid-template-columns: 1fr 240px;
        align-items: center;
      }
    }
  `,
})
export class DonacionesComercioPage {
  private readonly api = inject(DonacionesApiService);
  protected readonly donaciones = rxResource({ stream: () => this.api.deComercio() });
  protected readonly totales = computed(() => {
    const l = this.donaciones.value() ?? [];
    const completadas = l.filter((d) => d.estado === 'COMPLETADA');
    return {
      completadas: completadas.length,
      kg: completadas.reduce((s, d) => s + d.pesoKg, 0),
      pendientes: l.filter((d) => d.estado === 'OFRECIDA' || d.estado === 'ACEPTADA').length,
    };
  });
}
