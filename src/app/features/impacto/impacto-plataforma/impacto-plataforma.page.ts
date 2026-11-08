import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ImpactoApiService } from '@core/api';
import { PageHeaderComponent } from '@shared/ui/page-header.component';
import { SpinnerComponent } from '@shared/ui/spinner.component';
import { fmtKg, fmtNum } from '../components/formato';
import { TarjetaMetricaComponent } from '../components/tarjeta-metrica.component';

/** PARTE 6 · US20 — Panel de impacto agregado de la plataforma para el administrador. */
@Component({
  selector: 'app-impacto-plataforma-page',
  imports: [PageHeaderComponent, SpinnerComponent, TarjetaMetricaComponent],
  template: `
    <app-page-header
      titulo="Impacto de la plataforma"
      subtitulo="Indicadores del objetivo a tres años: kilos rescatados, CO₂ evitado y red de aliados."
    >
      <button type="button" class="btn btn--secundario btn--sm" (click)="impacto.reload()">
        ↻ Actualizar
      </button>
    </app-page-header>
    @if (impacto.isLoading()) {
      <app-spinner />
    } @else if (impacto.value(); as i) {
      <section class="tarjeta meta">
        <div class="meta__cab">
          <div>
            <p class="texto-suave">Kilos rescatados</p>
            <p class="meta__valor">{{ f.kg(i.rescatadoKg) }}</p>
          </div>
          <p class="texto-suave">
            Meta: <strong>{{ f.kg(i.metaKg) }}</strong>
          </p>
        </div>
        <div class="barra"><span [style.width.%]="avance()"></span></div>
        <p class="meta__pct">{{ i.avanceMetaPct }}% de la meta</p>
      </section>
      <div class="metricas">
        <app-tarjeta-metrica
          icono="🛒"
          etiqueta="Vendido"
          [valor]="f.kg(i.vendidoKg)"
          tono="naranja"
        />
        <app-tarjeta-metrica icono="🤝" etiqueta="Donado" [valor]="f.kg(i.donadoKg)" tono="verde" />
        <app-tarjeta-metrica icono="🌍" etiqueta="CO₂ evitado" [valor]="f.kg(i.co2EvitadoKg)" />
        <app-tarjeta-metrica
          icono="🏪"
          etiqueta="Comercios validados"
          [valor]="f.num(i.comerciosActivos)"
          detalle="Meta: 300"
        />
        <app-tarjeta-metrica
          icono="🏠"
          etiqueta="Organizaciones validadas"
          [valor]="f.num(i.organizacionesActivas)"
          detalle="Meta: 40"
        />
      </div>
    }
  `,
  styles: `
    .meta {
      margin-bottom: 1rem;
    }
    .meta__cab {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: end;
      gap: 1rem;
    }
    .meta p {
      margin: 0;
    }
    .meta__valor {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--verde-oscuro);
    }
    .barra {
      height: 14px;
      margin-top: 1rem;
      border-radius: 999px;
      background: var(--gris-claro);
      overflow: hidden;
    }
    .barra span {
      display: block;
      height: 100%;
      min-width: 4px;
      background: linear-gradient(90deg, var(--verde), #34d399);
    }
    .meta__pct {
      margin-top: 0.5rem !important;
      font-weight: 600;
      color: var(--verde-oscuro);
      font-size: 0.875rem;
    }
    .metricas {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
    }
    @media (min-width: 1000px) {
      .metricas {
        grid-template-columns: repeat(5, minmax(0, 1fr));
      }
    }
  `,
})
export class ImpactoPlataformaPage {
  private readonly api = inject(ImpactoApiService);
  protected readonly impacto = rxResource({ stream: () => this.api.plataforma() });
  protected readonly avance = computed(() =>
    Math.min(100, this.impacto.value()?.avanceMetaPct ?? 0),
  );
  protected readonly f = { kg: fmtKg, num: fmtNum };
}
