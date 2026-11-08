import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { OrganizacionesApiService } from '@core/api';
import { OrganizacionSocial } from '@core/models';
import { NotificadorService } from '@core/utils/notificador.service';
import { FechaExactaPipe } from '@shared/pipes/fecha-exacta.pipe';
import { KgPipe } from '@shared/pipes/kg.pipe';
import { DialogoComponent } from '@shared/ui/dialogo.component';
import { EmptyStateComponent } from '@shared/ui/empty-state.component';
import { EstadoBadgeComponent } from '@shared/ui/estado-badge.component';
import { PageHeaderComponent } from '@shared/ui/page-header.component';
import { SpinnerComponent } from '@shared/ui/spinner.component';
import { contarPorEstado } from '../components/contar-por-estado';
import { FiltroEstado, FiltroEstadoComponent } from '../components/filtro-estado.component';

/**
 * PARTE 6 · US18 + US19 — Validación de organizaciones sociales con calificación SUNAT
 * (entidad perceptora de donaciones deducibles).
 */
@Component({
  selector: 'app-validar-organizaciones-page',
  imports: [
    FormsModule,
    PageHeaderComponent,
    SpinnerComponent,
    EmptyStateComponent,
    EstadoBadgeComponent,
    DialogoComponent,
    FiltroEstadoComponent,
    FechaExactaPipe,
    KgPipe,
  ],
  templateUrl: './validar-organizaciones.page.html',
  styleUrl: '../admin.scss',
})
export class ValidarOrganizacionesPage {
  private readonly api = inject(OrganizacionesApiService);
  private readonly notificador = inject(NotificadorService);

  protected readonly orgs = rxResource({ stream: () => this.api.listar() });
  protected readonly filtro = signal<FiltroEstado>('PENDIENTE');
  protected readonly conteos = computed(() => contarPorEstado(this.orgs.value() ?? []));
  protected readonly filtradas = computed(() =>
    (this.orgs.value() ?? []).filter(
      (o) => this.filtro() === 'TODOS' || o.estado === this.filtro(),
    ),
  );

  protected readonly procesando = signal<number | null>(null);
  protected readonly aValidar = signal<OrganizacionSocial | null>(null);
  protected readonly sunat = signal(false);
  protected readonly aRechazar = signal<OrganizacionSocial | null>(null);
  protected readonly motivo = signal('');
  protected readonly motivosRapidos = [
    'No se pudo verificar la existencia de la organización',
    'Dirección no verificable',
    'Documentación incompleta',
  ];

  abrirValidacion(o: OrganizacionSocial): void {
    this.sunat.set(o.deducibleSunat);
    this.aValidar.set(o);
  }

  confirmarValidacion(): void {
    const o = this.aValidar();
    if (!o) return;
    this.aValidar.set(null);
    this.procesando.set(o.id);
    this.api.validar(o.id, this.sunat()).subscribe({
      next: (r) =>
        this.actualizar(
          r,
          `${r.nombre} fue validada${r.deducibleSunat ? ' con calificación SUNAT' : ''}.`,
        ),
      error: () => this.procesando.set(null),
    });
  }

  abrirRechazo(o: OrganizacionSocial): void {
    this.motivo.set('');
    this.aRechazar.set(o);
  }

  confirmarRechazo(): void {
    const o = this.aRechazar();
    const motivo = this.motivo().trim();
    if (!o || !motivo) return;
    this.aRechazar.set(null);
    this.procesando.set(o.id);
    this.api.rechazar(o.id, motivo).subscribe({
      next: (r) => this.actualizar(r, `${r.nombre} fue rechazada.`),
      error: () => this.procesando.set(null),
    });
  }

  private actualizar(r: OrganizacionSocial, mensaje: string): void {
    this.orgs.update((l) => l?.map((x) => (x.id === r.id ? r : x)));
    this.procesando.set(null);
    this.notificador.exito(mensaje);
  }
}
