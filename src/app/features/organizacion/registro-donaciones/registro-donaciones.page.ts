import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DonacionesApiService } from '@core/api';
import { descargarCsv } from '@core/utils/archivos';
import { aDate } from '@core/utils/fechas';
import { KgPipe } from '@shared/pipes/kg.pipe';
import { EmptyStateComponent } from '@shared/ui/empty-state.component';
import { PageHeaderComponent } from '@shared/ui/page-header.component';
import { SpinnerComponent } from '@shared/ui/spinner.component';

const fechaHora = new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' });

/**
 * PARTE 5 · US13 + US33 — Registro de donaciones recibidas (formato pensado para la Ley 30498)
 * y descarga en CSV.
 */
@Component({
  selector: 'app-registro-donaciones-page',
  imports: [PageHeaderComponent, SpinnerComponent, EmptyStateComponent, KgPipe],
  template: `
    <app-page-header
      titulo="Registro de donaciones"
      subtitulo="Donaciones recibidas y confirmadas, listas para sustentar ante SUNAT (Ley 30498)."
    >
      <button
        type="button"
        class="btn btn--primario"
        (click)="descargar()"
        [disabled]="!filas.value()?.length"
      >
        ⬇ Descargar CSV
      </button>
    </app-page-header>

    @if (filas.isLoading()) {
      <app-spinner />
    } @else if (!filas.value()?.length) {
      <app-empty-state
        icono="📋"
        titulo="Aún no hay donaciones registradas"
        texto="Cada recojo que confirmes con su código se agregará automáticamente aquí."
      />
    } @else {
      <dl class="resumen">
        <div>
          <dt>Donaciones</dt>
          <dd>{{ totales().n }}</dd>
        </div>
        <div>
          <dt>Kilos recibidos</dt>
          <dd>{{ totales().kg | kg }}</dd>
        </div>
        <div>
          <dt>Unidades</dt>
          <dd>{{ totales().unidades }}</dd>
        </div>
      </dl>
      <div class="tarjeta tabla-scroll caja">
        <table class="tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Donante</th>
              <th>RUC</th>
              <th>Tipo de alimento</th>
              <th>Cant.</th>
              <th>Peso</th>
              <th>Deducible</th>
              <th>Código</th>
            </tr>
          </thead>
          <tbody>
            @for (f of filas.value(); track f.codigo) {
              <tr>
                <td>{{ formatear(f.fecha) }}</td>
                <td>{{ f.donante }}</td>
                <td>{{ f.donanteRuc ?? '—' }}</td>
                <td>{{ f.tipoAlimento }}</td>
                <td>{{ f.cantidad }}</td>
                <td>{{ f.pesoKg | kg }}</td>
                <td>
                  @if (f.deducible) {
                    <span class="si">Sí</span>
                  } @else {
                    <span class="no">No</span>
                  }
                </td>
                <td class="mono">{{ f.codigo }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      @if (!filas.value()![0].deducible) {
        <p class="aviso">
          Tu organización aún no tiene la calificación SUNAT registrada: las donaciones no figuran
          como deducibles para el donante.
        </p>
      }
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
    .caja {
      padding: 0;
    }
    .mono {
      font-family: ui-monospace, Consolas, monospace;
    }
    .si {
      color: var(--verde-oscuro);
      font-weight: 700;
    }
    .no {
      color: var(--texto-suave);
    }
    .aviso {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radio);
      background: #fff7ed;
      color: #9a3412;
      font-size: 0.875rem;
    }
  `,
})
export class RegistroDonacionesPage {
  private readonly api = inject(DonacionesApiService);
  protected readonly filas = rxResource({ stream: () => this.api.registro() });
  protected readonly totales = computed(() => {
    const l = this.filas.value() ?? [];
    return {
      n: l.length,
      kg: l.reduce((s, f) => s + f.pesoKg, 0),
      unidades: l.reduce((s, f) => s + f.cantidad, 0),
    };
  });

  formatear(iso: string): string {
    return fechaHora.format(aDate(iso));
  }

  descargar(): void {
    const filas = (this.filas.value() ?? []).map((f) => ({
      Fecha: this.formatear(f.fecha),
      Donante: f.donante,
      'RUC donante': f.donanteRuc ?? '',
      'Tipo de alimento': f.tipoAlimento,
      Cantidad: f.cantidad,
      'Peso (kg)': f.pesoKg,
      Beneficiario: f.beneficiario,
      Deducible: f.deducible ? 'Sí' : 'No',
      'Código de donación': f.codigo,
    }));
    descargarCsv(filas, `registro-donaciones-${new Date().toISOString().slice(0, 10)}.csv`);
  }
}
