import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ComerciosApiService, OfertasApiService } from '@core/api';
import { EstadoOferta, Oferta } from '@core/models';
import { aDate } from '@core/utils/fechas';
import { FechaExactaPipe } from '@shared/pipes/fecha-exacta.pipe';
import { SolesPipe } from '@shared/pipes/soles.pipe';
import { EmptyStateComponent } from '@shared/ui/empty-state.component';
import { EstadoBadgeComponent } from '@shared/ui/estado-badge.component';
import { PageHeaderComponent } from '@shared/ui/page-header.component';
import { SpinnerComponent } from '@shared/ui/spinner.component';
import { AvisoCuentaComponent } from '../components/aviso-cuenta.component';

type Periodo = 'hoy' | '7' | '30' | 'todo';

/**
 * PARTE 4 · US05 — Mis ofertas e historial (filtrable por fecha y estado).
 * GET /api/ofertas/mias devuelve todas las ofertas con su estado.
 */
@Component({
  selector: 'app-mis-ofertas-page',
  imports: [
    FormsModule,
    RouterLink,
    PageHeaderComponent,
    SpinnerComponent,
    EmptyStateComponent,
    EstadoBadgeComponent,
    AvisoCuentaComponent,
    SolesPipe,
    FechaExactaPipe,
  ],
  templateUrl: './mis-ofertas.page.html',
  styleUrl: './mis-ofertas.page.scss',
})
export class MisOfertasPage {
  private readonly api = inject(OfertasApiService);
  private readonly comerciosApi = inject(ComerciosApiService);
  protected readonly comercio = rxResource({ stream: () => this.comerciosApi.yo() });
  protected readonly ofertas = rxResource({ stream: () => this.api.mias() });

  protected readonly estados: { valor: EstadoOferta | ''; texto: string }[] = [
    { valor: '', texto: 'Todos' },
    { valor: 'ACTIVA', texto: 'Activas' },
    { valor: 'AGOTADA', texto: 'Agotadas' },
    { valor: 'DONADA', texto: 'Donadas' },
    { valor: 'VENCIDA', texto: 'Vencidas' },
    { valor: 'PERDIDA', texto: 'Perdidas' },
  ];
  protected readonly estado = signal<EstadoOferta | ''>('');
  protected readonly periodo = signal<Periodo>('30');

  protected readonly filtradas = computed(() => {
    const ahora = new Date();
    const desde = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const p = this.periodo();
    if (p !== 'todo' && p !== 'hoy') desde.setDate(desde.getDate() - Number(p));
    return (this.ofertas.value() ?? []).filter((o) => {
      if (this.estado() && o.estado !== this.estado()) return false;
      return p === 'todo' || aDate(o.recojoDesde) >= desde;
    });
  });

  protected readonly resumen = computed(() => {
    const l = this.filtradas();
    const vendidas = l.reduce((s, o) => s + this.vendidas(o), 0);
    const ingresos = l.reduce((s, o) => s + this.vendidas(o) * o.precioDescuento, 0);
    return {
      publicadas: l.length,
      activas: l.filter((o) => o.estado === 'ACTIVA').length,
      vendidas,
      ingresos,
    };
  });

  vendidas(o: Oferta): number {
    return o.cantidadInicial - o.cantidad;
  }
}
