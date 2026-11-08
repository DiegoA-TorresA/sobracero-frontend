import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ImpactoApiService } from '@core/api';
import { KgPipe } from '@shared/pipes/kg.pipe';
import { SpinnerComponent } from '@shared/ui/spinner.component';
import { ContadorAnimadoComponent } from '../components/contador-animado.component';
import { LandingFooterComponent } from '../components/landing-footer.component';
import { LandingHeaderComponent } from '../components/landing-header.component';

/**
 * PARTE 2 · US20 (vista pública) — Impacto agregado de la plataforma.
 * Datos: GET /api/impacto/plataforma (ImpactoPlataforma).
 */
@Component({
  selector: 'app-impacto-publico-page',
  imports: [
    RouterLink,
    LandingHeaderComponent,
    LandingFooterComponent,
    SpinnerComponent,
    ContadorAnimadoComponent,
    KgPipe,
  ],
  templateUrl: './impacto-publico.page.html',
  styleUrl: './impacto-publico.page.scss',
})
export class ImpactoPublicoPage {
  private readonly api = inject(ImpactoApiService);
  protected readonly impacto = rxResource({ stream: () => this.api.plataforma(true) });

  /** Reparto venta / donación del total rescatado (en %). */
  protected readonly reparto = computed(() => {
    const i = this.impacto.value();
    if (!i || i.rescatadoKg <= 0) return { venta: 0, donacion: 0 };
    const venta = Math.round((i.vendidoKg / i.rescatadoKg) * 100);
    return { venta, donacion: 100 - venta };
  });

  /** Avance hacia la meta acotado a 0–100 para la barra. */
  protected readonly avance = computed(() =>
    Math.min(100, Math.max(0, this.impacto.value()?.avanceMetaPct ?? 0)),
  );

  recargar(): void {
    this.impacto.reload();
  }
}
