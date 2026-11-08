import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ReservasApiService } from '@core/api';
import { ReservaVista } from '@core/models';
import { minutosHasta } from '@core/utils/fechas';
import { NotificadorService } from '@core/utils/notificador.service';
import { FechaExactaPipe } from '@shared/pipes/fecha-exacta.pipe';
import { SolesPipe } from '@shared/pipes/soles.pipe';
import { EmptyStateComponent } from '@shared/ui/empty-state.component';
import { EstadoBadgeComponent } from '@shared/ui/estado-badge.component';
import { PageHeaderComponent } from '@shared/ui/page-header.component';
import { SpinnerComponent } from '@shared/ui/spinner.component';

/**
 * PARTE 3 · US09 + US10 — Mis reservas con el código de reserva.
 * Por recoger: estado PAGADA. Historial: RECOGIDA y NO_RECOGIDA.
 * Avisa en rojo cuando faltan 30 minutos o menos para que cierre la ventana (mismo umbral que el recordatorio del backend).
 */
@Component({
  selector: 'app-mis-reservas-page',
  imports: [
    RouterLink,
    PageHeaderComponent,
    SpinnerComponent,
    EmptyStateComponent,
    EstadoBadgeComponent,
    SolesPipe,
    FechaExactaPipe,
  ],
  templateUrl: './mis-reservas.page.html',
  styleUrl: './mis-reservas.page.scss',
})
export class MisReservasPage {
  private readonly api = inject(ReservasApiService);
  private readonly notificador = inject(NotificadorService);

  protected readonly reservas = rxResource({ stream: () => this.api.mias() });
  protected readonly pestana = signal<'activas' | 'historial'>('activas');

  protected readonly activas = computed(() =>
    (this.reservas.value() ?? []).filter((r) => r.estado === 'PAGADA'),
  );
  protected readonly historial = computed(() =>
    (this.reservas.value() ?? []).filter((r) => r.estado !== 'PAGADA'),
  );
  protected readonly lista = computed(() =>
    this.pestana() === 'activas' ? this.activas() : this.historial(),
  );

  /** Totales para el resumen "Mi ahorro" (US32, adelanto). */
  protected readonly ahorroRecogidas = computed(() =>
    (this.reservas.value() ?? [])
      .filter((r) => r.estado === 'RECOGIDA')
      .reduce((s, r) => s + r.monto, 0),
  );

  minutosRestantes(r: ReservaVista): number {
    return minutosHasta(r.recojoHasta);
  }

  copiar(codigo: string): void {
    navigator.clipboard?.writeText(codigo).then(
      () => this.notificador.info(`Código ${codigo} copiado`),
      () => {},
    );
  }
}
