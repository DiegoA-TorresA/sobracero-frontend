import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { DonacionesApiService } from '@core/api';
import { EstadoDonacion } from '@core/models';
import { mensajeDeError } from '@core/utils/errores';
import { NotificadorService } from '@core/utils/notificador.service';
import { EmptyStateComponent } from '@shared/ui/empty-state.component';
import { PageHeaderComponent } from '@shared/ui/page-header.component';
import { SpinnerComponent } from '@shared/ui/spinner.component';
import { TarjetaDonacionComponent } from '../components/tarjeta-donacion.component';

/**
 * PARTE 5 · US12 — Mis recojos: donaciones aceptadas y confirmación del recojo con el código de donación.
 * Filtro por estado (ofrecida, aceptada, completada), como pide Searching Systems.
 */
@Component({
  selector: 'app-mis-recojos-page',
  imports: [
    FormsModule,
    PageHeaderComponent,
    SpinnerComponent,
    EmptyStateComponent,
    TarjetaDonacionComponent,
  ],
  template: `
    <app-page-header
      titulo="Mis recojos"
      subtitulo="Confirma cada recojo con el código de donación que te da el comercio."
    />

    <form class="tarjeta confirmar" (ngSubmit)="completar()">
      <label for="codigo">Código de donación</label>
      <div class="confirmar__fila">
        <input
          id="codigo"
          name="codigo"
          placeholder="DON-XXXXX"
          autocomplete="off"
          maxlength="9"
          [ngModel]="codigo()"
          (ngModelChange)="codigo.set($event.toUpperCase().trim()); error.set(null)"
        />
        <button type="submit" class="btn btn--primario" [disabled]="!codigo() || enviando()">
          {{ enviando() ? 'Confirmando…' : 'Confirmar recojo' }}
        </button>
      </div>
      @if (error(); as e) {
        <p class="error" role="alert">{{ e }}</p>
      }
    </form>

    <div class="chips" role="group" aria-label="Filtrar por estado">
      @for (f of filtros; track f.valor) {
        <button
          type="button"
          class="chip"
          [class.chip--activo]="filtro() === f.valor"
          (click)="filtro.set(f.valor)"
        >
          {{ f.texto }}
        </button>
      }
    </div>

    @if (donaciones.isLoading()) {
      <app-spinner />
    } @else {
      <div class="lista">
        @for (d of filtradas(); track d.id) {
          <app-tarjeta-donacion [d]="d" />
        } @empty {
          <app-empty-state
            icono="🚚"
            titulo="Nada por aquí"
            texto="Las donaciones que aceptes aparecerán en esta lista."
          />
        }
      </div>
    }
  `,
  styles: `
    .confirmar {
      display: grid;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }
    .confirmar label {
      font-weight: 600;
    }
    .confirmar__fila {
      display: grid;
      gap: 0.5rem;
    }
    .confirmar input {
      font:
        700 1.25rem ui-monospace,
        Consolas,
        monospace !important;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .error {
      margin: 0;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-bottom: 1rem;
    }
    .chip {
      min-height: 34px;
      padding: 0 0.875rem;
      border-radius: 999px;
      border: 1px solid var(--borde);
      background: var(--superficie);
      font: inherit;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
    }
    .chip--activo {
      background: var(--verde);
      border-color: var(--verde);
      color: #fff;
    }
    .lista {
      display: grid;
      gap: 0.75rem;
    }
    @media (min-width: 640px) {
      .confirmar__fila {
        grid-template-columns: 1fr auto;
      }
    }
  `,
})
export class MisRecojosPage {
  private readonly api = inject(DonacionesApiService);
  private readonly notificador = inject(NotificadorService);

  protected readonly donaciones = rxResource({ stream: () => this.api.mias() });
  protected readonly filtros: { valor: EstadoDonacion | 'PENDIENTES'; texto: string }[] = [
    { valor: 'PENDIENTES', texto: 'Por recoger' },
    { valor: 'OFRECIDA', texto: 'Ofrecidas' },
    { valor: 'COMPLETADA', texto: 'Completadas' },
    { valor: 'RECHAZADA', texto: 'Rechazadas' },
  ];
  protected readonly filtro = signal<EstadoDonacion | 'PENDIENTES'>('PENDIENTES');
  protected readonly filtradas = computed(() => {
    const f = this.filtro();
    return (this.donaciones.value() ?? []).filter((d) =>
      f === 'PENDIENTES' ? d.estado === 'ACEPTADA' : d.estado === f,
    );
  });

  protected readonly codigo = signal('');
  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);

  completar(): void {
    let c = this.codigo();
    if (/^[A-Z0-9]{5}$/.test(c)) c = 'DON-' + c;
    this.enviando.set(true);
    this.api.completar({ codigo: c }).subscribe({
      next: (d) => {
        this.notificador.exito(
          `¡Recojo confirmado! ${d.cantidad} × ${d.ofertaTitulo} ya está en tu registro.`,
        );
        this.codigo.set('');
        this.enviando.set(false);
        this.filtro.set('COMPLETADA');
        this.donaciones.reload();
      },
      error: (e: HttpErrorResponse) => {
        this.error.set(mensajeDeError(e));
        this.enviando.set(false);
      },
    });
  }
}
