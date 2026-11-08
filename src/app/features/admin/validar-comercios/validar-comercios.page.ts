import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ComerciosApiService } from '@core/api';
import { Comercio, Plan } from '@core/models';
import { NotificadorService } from '@core/utils/notificador.service';
import { FechaExactaPipe } from '@shared/pipes/fecha-exacta.pipe';
import { DialogoComponent } from '@shared/ui/dialogo.component';
import { EmptyStateComponent } from '@shared/ui/empty-state.component';
import { EstadoBadgeComponent } from '@shared/ui/estado-badge.component';
import { PageHeaderComponent } from '@shared/ui/page-header.component';
import { SpinnerComponent } from '@shared/ui/spinner.component';
import { contarPorEstado } from '../components/contar-por-estado';
import { FiltroEstado, FiltroEstadoComponent } from '../components/filtro-estado.component';

/**
 * PARTE 6 · US18 + US26 — Validación de comercios (aprobar / rechazar con motivo) y gestión del plan.
 * Se carga la lista completa una vez (GET /api/comercios) y se filtra aquí por estado.
 */
@Component({
  selector: 'app-validar-comercios-page',
  imports: [
    FormsModule,
    PageHeaderComponent,
    SpinnerComponent,
    EmptyStateComponent,
    EstadoBadgeComponent,
    DialogoComponent,
    FiltroEstadoComponent,
    FechaExactaPipe,
  ],
  templateUrl: './validar-comercios.page.html',
  styleUrl: '../admin.scss',
})
export class ValidarComerciosPage {
  private readonly api = inject(ComerciosApiService);
  private readonly notificador = inject(NotificadorService);

  protected readonly comercios = rxResource({ stream: () => this.api.listar() });
  protected readonly filtro = signal<FiltroEstado>('PENDIENTE');
  protected readonly busqueda = signal('');
  protected readonly conteos = computed(() => contarPorEstado(this.comercios.value() ?? []));
  protected readonly filtrados = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    return (this.comercios.value() ?? [])
      .filter((c) => this.filtro() === 'TODOS' || c.estado === this.filtro())
      .filter(
        (c) =>
          !q ||
          c.nombre.toLowerCase().includes(q) ||
          (c.ruc ?? '').includes(q) ||
          (c.distrito ?? '').toLowerCase().includes(q),
      )
      .sort((a, b) => (b.creadoEn ?? '').localeCompare(a.creadoEn ?? ''));
  });

  protected readonly procesando = signal<number | null>(null);
  protected readonly aRechazar = signal<Comercio | null>(null);
  protected readonly motivo = signal('');
  protected readonly motivosRapidos = [
    'RUC no coincide con la razón social',
    'RUC inactivo o no habido en SUNAT',
    'Dirección no verificable',
    'Rubro no relacionado con alimentos',
  ];

  validar(c: Comercio): void {
    this.procesando.set(c.id);
    this.api.validar(c.id).subscribe({
      next: (r) => this.actualizar(r, `${r.nombre} fue validado.`),
      error: () => this.procesando.set(null),
    });
  }

  abrirRechazo(c: Comercio): void {
    this.motivo.set('');
    this.aRechazar.set(c);
  }

  confirmarRechazo(): void {
    const c = this.aRechazar();
    const motivo = this.motivo().trim();
    if (!c || !motivo) return;
    this.aRechazar.set(null);
    this.procesando.set(c.id);
    this.api.rechazar(c.id, motivo).subscribe({
      next: (r) => this.actualizar(r, `${r.nombre} fue rechazado.`),
      error: () => this.procesando.set(null),
    });
  }

  cambiarPlan(c: Comercio, plan: Plan): void {
    if (plan === c.plan) return;
    this.procesando.set(c.id);
    this.api.cambiarPlan(c.id, plan).subscribe({
      next: (r) =>
        this.actualizar(
          r,
          `${r.nombre} ahora tiene Plan ${plan === 'PREMIUM' ? 'Premium' : 'Gratis'}.`,
        ),
      error: () => this.procesando.set(null),
    });
  }

  private actualizar(r: Comercio, mensaje: string): void {
    this.comercios.update((l) => l?.map((x) => (x.id === r.id ? r : x)));
    this.procesando.set(null);
    this.notificador.exito(mensaje);
  }
}
