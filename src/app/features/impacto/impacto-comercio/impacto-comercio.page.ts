import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ImpactoApiService } from '@core/api';
import { descargarBlob } from '@core/utils/archivos';
import { NotificadorService } from '@core/utils/notificador.service';
import { PageHeaderComponent } from '@shared/ui/page-header.component';
import { SpinnerComponent } from '@shared/ui/spinner.component';
import { BannerPremiumComponent } from '../components/banner-premium.component';
import { fmtKg, fmtNum, fmtSoles } from '../components/formato';
import { TarjetaMetricaComponent } from '../components/tarjeta-metrica.component';

/**
 * PARTE 6 · US05 + US16 + US17 — Impacto del comercio: kilos vendidos, donados y perdidos, ingresos,
 * CO₂ evitado, distintivo de impacto y reporte CSV (solo Plan Premium; el backend responde 403 con Plan Gratis).
 */
@Component({
  selector: 'app-impacto-comercio-page',
  imports: [PageHeaderComponent, SpinnerComponent, TarjetaMetricaComponent, BannerPremiumComponent],
  templateUrl: './impacto-comercio.page.html',
  styleUrl: './impacto-comercio.page.scss',
})
export class ImpactoComercioPage {
  private readonly api = inject(ImpactoApiService);
  private readonly notificador = inject(NotificadorService);

  protected readonly impacto = rxResource({ stream: () => this.api.comercio() });
  protected readonly descargando = signal(false);
  protected readonly f = { kg: fmtKg, soles: fmtSoles, num: fmtNum };

  protected readonly premium = computed(() => this.impacto.value()?.plan === 'PREMIUM');
  /** % del total ofertado que se rescató (vendido + donado) frente a lo perdido. */
  protected readonly tasaRescate = computed(() => {
    const i = this.impacto.value();
    if (!i) return 0;
    const total = i.rescatadoKg + i.perdidoKg;
    return total > 0 ? Math.round((i.rescatadoKg / total) * 100) : 0;
  });
  protected readonly reparto = computed(() => {
    const i = this.impacto.value();
    const total = i ? i.vendidoKg + i.donadoKg + i.perdidoKg : 0;
    const pct = (v: number) => (total > 0 ? (v / total) * 100 : 0);
    return i
      ? { vendido: pct(i.vendidoKg), donado: pct(i.donadoKg), perdido: pct(i.perdidoKg) }
      : null;
  });

  descargarReporte(): void {
    this.descargando.set(true);
    this.api.reporteComercioCsv().subscribe({
      next: (blob) => {
        descargarBlob(blob, `reporte-impacto-${new Date().toISOString().slice(0, 10)}.csv`);
        this.notificador.exito('Reporte descargado.');
        this.descargando.set(false);
      },
      error: () => this.descargando.set(false),
    });
  }
}
