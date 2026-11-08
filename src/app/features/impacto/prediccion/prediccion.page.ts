import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ImpactoApiService, PrediccionApiService } from '@core/api';
import { of, switchMap } from 'rxjs';
import { FechaExactaPipe } from '@shared/pipes/fecha-exacta.pipe';
import { PageHeaderComponent } from '@shared/ui/page-header.component';
import { SpinnerComponent } from '@shared/ui/spinner.component';
import { BannerPremiumComponent } from '../components/banner-premium.component';

const MIN_DIAS = 15;

/**
 * PARTE 6 · US01 + US15 + US26 — Predicción de excedentes por categoría (Plan Premium).
 * Primero se consulta el plan (GET /api/impacto/comercio) para no provocar el 403 con Plan Gratis.
 */
@Component({
  selector: 'app-prediccion-page',
  imports: [
    RouterLink,
    PageHeaderComponent,
    SpinnerComponent,
    BannerPremiumComponent,
    FechaExactaPipe,
  ],
  templateUrl: './prediccion.page.html',
  styleUrl: './prediccion.page.scss',
})
export class PrediccionPage {
  private readonly impactoApi = inject(ImpactoApiService);
  private readonly prediccionApi = inject(PrediccionApiService);
  protected readonly minDias = MIN_DIAS;

  protected readonly datos = rxResource({
    stream: () =>
      this.impactoApi
        .comercio()
        .pipe(
          switchMap((i) =>
            i.plan === 'PREMIUM'
              ? this.prediccionApi
                  .comercio()
                  .pipe(switchMap((p) => of({ premium: true, prediccion: p })))
              : of({ premium: false, prediccion: null }),
          ),
        ),
  });

  protected readonly maxUnidades = computed(() =>
    Math.max(
      1,
      ...(this.datos.value()?.prediccion?.predicciones ?? []).map((p) => p.unidadesEsperadas),
    ),
  );
}
