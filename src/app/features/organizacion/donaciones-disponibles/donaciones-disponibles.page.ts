import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DonacionesApiService } from '@core/api';
import { DonacionVista } from '@core/models';
import { NotificadorService } from '@core/utils/notificador.service';
import { KgPipe } from '@shared/pipes/kg.pipe';
import { DialogoComponent } from '@shared/ui/dialogo.component';
import { EmptyStateComponent } from '@shared/ui/empty-state.component';
import { PageHeaderComponent } from '@shared/ui/page-header.component';
import { SpinnerComponent } from '@shared/ui/spinner.component';
import { TarjetaDonacionComponent } from '../components/tarjeta-donacion.component';

/**
 * PARTE 5 · US04 + US11 — Donaciones ofrecidas a la organización: aceptar o rechazar.
 * Al rechazar, el backend la ofrece a la siguiente organización compatible.
 */
@Component({
  selector: 'app-donaciones-disponibles-page',
  imports: [
    RouterLink,
    PageHeaderComponent,
    SpinnerComponent,
    EmptyStateComponent,
    DialogoComponent,
    TarjetaDonacionComponent,
    KgPipe,
  ],
  template: `
    <app-page-header
      titulo="Donaciones disponibles"
      subtitulo="Excedentes no vendidos que se te ofrecen por cercanía y capacidad."
    >
      <button type="button" class="btn btn--secundario btn--sm" (click)="donaciones.reload()">
        ↻ Actualizar
      </button>
    </app-page-header>

    @if (donaciones.isLoading()) {
      <app-spinner />
    } @else {
      @if (ofrecidas().length) {
        <p class="resumen">
          {{ ofrecidas().length }} {{ ofrecidas().length === 1 ? 'donación' : 'donaciones' }} ·
          {{ kgOfrecidos() | kg }} en total
        </p>
      }
      <div class="lista">
        @for (d of ofrecidas(); track d.id) {
          <app-tarjeta-donacion [d]="d">
            <button
              type="button"
              class="btn btn--primario"
              (click)="aceptar(d)"
              [disabled]="procesando() === d.id"
            >
              {{ procesando() === d.id ? 'Aceptando…' : 'Aceptar' }}
            </button>
            <button
              type="button"
              class="btn btn--peligro"
              (click)="aRechazar.set(d)"
              [disabled]="procesando() === d.id"
            >
              Rechazar
            </button>
          </app-tarjeta-donacion>
        } @empty {
          <app-empty-state
            icono="📦"
            titulo="No hay donaciones nuevas"
            texto="Te avisaremos en Notificaciones cuando un comercio cercano tenga excedentes para tu organización."
          >
            <a class="btn btn--secundario" routerLink="/organizacion/recojos">Ver mis recojos</a>
          </app-empty-state>
        }
      </div>
    }

    <app-dialogo
      titulo="¿Rechazar esta donación?"
      [abierto]="!!aRechazar()"
      (cerrar)="aRechazar.set(null)"
    >
      @if (aRechazar(); as d) {
        <p>
          <strong>{{ d.cantidad }} × {{ d.ofertaTitulo }}</strong> de {{ d.comercioNombre }}.
        </p>
        <p class="texto-suave">
          Se ofrecerá a otra organización cercana. No podrás volver a aceptarla.
        </p>
        <div class="dlg-acciones">
          <button type="button" class="btn btn--secundario" (click)="aRechazar.set(null)">
            Cancelar
          </button>
          <button type="button" class="btn btn--peligro" (click)="rechazar(d)">Sí, rechazar</button>
        </div>
      }
    </app-dialogo>
  `,
  styles: `
    .resumen {
      margin: 0 0 0.75rem;
      color: var(--texto-suave);
      font-weight: 600;
    }
    .lista {
      display: grid;
      gap: 0.75rem;
    }
    .dlg-acciones {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1.25rem;
    }
  `,
})
export class DonacionesDisponiblesPage {
  private readonly api = inject(DonacionesApiService);
  private readonly notificador = inject(NotificadorService);

  protected readonly donaciones = rxResource({ stream: () => this.api.mias() });
  protected readonly ofrecidas = computed(() =>
    (this.donaciones.value() ?? []).filter((d) => d.estado === 'OFRECIDA'),
  );
  protected readonly kgOfrecidos = computed(() =>
    this.ofrecidas().reduce((s, d) => s + d.pesoKg, 0),
  );
  protected readonly procesando = signal<number | null>(null);
  protected readonly aRechazar = signal<DonacionVista | null>(null);

  aceptar(d: DonacionVista): void {
    this.procesando.set(d.id);
    this.api.aceptar(d.id).subscribe({
      next: () => {
        this.notificador.exito(
          `Aceptaste "${d.ofertaTitulo}". Recógela antes del cierre y confirma con el código del comercio.`,
        );
        this.procesando.set(null);
        this.donaciones.reload();
      },
      error: () => {
        this.procesando.set(null);
        this.donaciones.reload();
      },
    });
  }

  rechazar(d: DonacionVista): void {
    this.aRechazar.set(null);
    this.procesando.set(d.id);
    this.api.rechazar(d.id).subscribe({
      next: () => {
        this.notificador.info('Donación rechazada. Se ofrecerá a otra organización.');
        this.procesando.set(null);
        this.donaciones.reload();
      },
      error: () => this.procesando.set(null),
    });
  }
}
