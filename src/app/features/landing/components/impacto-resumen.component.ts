import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ImpactoApiService } from '@core/api';
import { ContadorAnimadoComponent } from './contador-animado.component';
import { SeccionTituloComponent } from './seccion-titulo.component';

/**
 * US20 (vista pública) — Cifras en vivo de GET /api/impacto/plataforma.
 * Si el backend no responde, la sección se oculta sin mostrar error al visitante.
 */
@Component({
  selector: 'app-impacto-resumen',
  imports: [RouterLink, ContadorAnimadoComponent, SeccionTituloComponent],
  template: `
    @if (impacto.value(); as i) {
      <section class="ir" id="impacto" aria-labelledby="ir-titulo">
        <div class="contenedor">
          <app-seccion-titulo
            idTitulo="ir-titulo"
            eyebrow="Impacto en vivo"
            titulo="Lo que ya rescatamos juntos"
          />
          <dl class="ir__grid">
            <div class="m m--principal">
              <dt>Kilos rescatados</dt>
              <dd>
                <app-contador-animado [valor]="i.rescatadoKg" [decimales]="1" /> <small>kg</small>
              </dd>
            </div>
            <div class="m">
              <dt>CO₂ evitado</dt>
              <dd>
                <app-contador-animado [valor]="i.co2EvitadoKg" [decimales]="1" /> <small>kg</small>
              </dd>
            </div>
            <div class="m">
              <dt>Comercios activos</dt>
              <dd><app-contador-animado [valor]="i.comerciosActivos" /></dd>
            </div>
            <div class="m">
              <dt>Organizaciones sociales</dt>
              <dd><app-contador-animado [valor]="i.organizacionesActivas" /></dd>
            </div>
          </dl>
          @if (conEnlace()) {
            <p class="ir__mas"><a routerLink="/nuestro-impacto">Ver el detalle del impacto →</a></p>
          }
        </div>
      </section>
    }
  `,
  styles: `
    .ir {
      padding: 4.5rem 0;
      background: linear-gradient(160deg, var(--verde-oscuro), var(--verde));
      color: #fff;
    }
    :host ::ng-deep .ir .st__eyebrow {
      color: #ecfdf5;
    }
    :host ::ng-deep .ir h2 {
      color: #fff;
    }
    .ir__grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin: 0;
    }
    .m {
      padding: 1.5rem;
      border-radius: var(--radio-lg);
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    dt {
      font-size: 0.9375rem;
      opacity: 0.9;
    }
    dd {
      margin: 0.25rem 0 0;
      font-size: clamp(1.75rem, 5vw, 2.75rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
    }
    dd small {
      margin-left: 0.25rem;
      font-size: 1rem;
      font-weight: 600;
      opacity: 0.85;
    }
    .ir__mas {
      text-align: center;
      margin: 2rem 0 0;
    }
    .ir__mas a {
      color: #fff;
      font-weight: 600;
    }
    @media (min-width: 900px) {
      .ir__grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  `,
})
export class ImpactoResumenComponent {
  private readonly api = inject(ImpactoApiService);
  readonly conEnlace = input(true);
  protected readonly impacto = rxResource({ stream: () => this.api.plataforma(true) });
}
