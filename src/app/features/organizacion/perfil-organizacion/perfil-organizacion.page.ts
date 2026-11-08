import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ImpactoApiService, OrganizacionesApiService } from '@core/api';
import { NotificadorService } from '@core/utils/notificador.service';
import { KgPipe } from '@shared/pipes/kg.pipe';
import { EstadoBadgeComponent } from '@shared/ui/estado-badge.component';
import { PageHeaderComponent } from '@shared/ui/page-header.component';
import { SpinnerComponent } from '@shared/ui/spinner.component';

/**
 * PARTE 5 · US14 + US19 — Mi organización: capacidad diaria de recojo, calificación SUNAT e impacto recibido.
 */
@Component({
  selector: 'app-perfil-organizacion-page',
  imports: [FormsModule, PageHeaderComponent, SpinnerComponent, EstadoBadgeComponent, KgPipe],
  template: `
    <app-page-header titulo="Mi organización" />
    @if (org.isLoading()) {
      <app-spinner />
    } @else if (org.value(); as o) {
      @if (o.estado === 'PENDIENTE') {
        <p class="aviso aviso--pendiente">
          ⏳ Tu organización está en revisión. Recibirás donaciones cuando un administrador la
          valide.
        </p>
      } @else if (o.estado === 'RECHAZADA') {
        <p class="aviso aviso--rechazada">
          Tu registro fue rechazado.
          @if (o.motivoRechazo) {
            Motivo: {{ o.motivoRechazo }}.
          }
        </p>
      }

      @if (impacto.value(); as i) {
        <dl class="impacto">
          <div>
            <dt>Kilos recibidos</dt>
            <dd>{{ i.recibidoKg | kg }}</dd>
          </div>
          <div>
            <dt>Recojos completados</dt>
            <dd>{{ i.donacionesCompletadas }}</dd>
          </div>
          <div>
            <dt>CO₂ evitado</dt>
            <dd>{{ i.co2EvitadoKg | kg }}</dd>
          </div>
        </dl>
      }

      <div class="po">
        <section class="tarjeta">
          <div class="cab">
            <h2>{{ o.nombre }}</h2>
            <app-estado-badge [estado]="o.estado" />
          </div>
          <dl class="datos">
            <div>
              <dt>Dirección</dt>
              <dd>{{ o.direccion ?? '—' }}</dd>
            </div>
            <div>
              <dt>Ubicación</dt>
              <dd>{{ o.latitud.toFixed(5) }}, {{ o.longitud.toFixed(5) }}</dd>
            </div>
            <div>
              <dt>Calificación SUNAT</dt>
              <dd>
                @if (o.deducibleSunat) {
                  <span class="ok">✔ Entidad perceptora: donaciones deducibles</span>
                } @else {
                  <span class="texto-suave">Sin calificación registrada</span>
                }
              </dd>
            </div>
          </dl>
        </section>

        <form class="tarjeta" (ngSubmit)="guardar()">
          <h2>Capacidad de recojo</h2>
          <p class="texto-suave">
            Solo te ofreceremos donaciones que entren en tu capacidad diaria. Déjalo vacío si no
            tienes límite.
          </p>
          <div class="campo">
            <label for="cap">Kilos por día</label>
            <input
              id="cap"
              name="cap"
              type="number"
              min="0"
              step="1"
              placeholder="Sin límite"
              [ngModel]="capacidad()"
              (ngModelChange)="capacidad.set($event)"
            />
          </div>
          <button type="submit" class="btn btn--primario" [disabled]="guardando()">
            {{ guardando() ? 'Guardando…' : 'Guardar capacidad' }}
          </button>
        </form>
      </div>
    }
  `,
  styles: `
    .aviso {
      padding: 1rem;
      border-radius: var(--radio);
      margin: 0 0 1rem;
    }
    .aviso--pendiente {
      background: #fff7ed;
      color: #9a3412;
    }
    .aviso--rechazada {
      background: #fef2f2;
      color: #991b1b;
    }
    .impacto {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      margin: 0 0 1rem;
    }
    .impacto > div {
      padding: 1rem;
      border-radius: var(--radio);
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
    }
    .impacto dt {
      font-size: 0.8125rem;
      color: var(--verde-oscuro);
    }
    .impacto dd {
      margin: 0.25rem 0 0;
      font-size: 1.375rem;
      font-weight: 800;
      color: var(--verde-oscuro);
    }
    .po {
      display: grid;
      gap: 1rem;
    }
    .cab {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }
    h2 {
      margin: 0;
      font-size: 1.1875rem;
    }
    .datos {
      display: grid;
      gap: 0.875rem;
      margin: 1.25rem 0 0;
    }
    .datos dt {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--texto-suave);
    }
    .datos dd {
      margin: 0.125rem 0 0;
      font-weight: 600;
    }
    .ok {
      color: var(--verde-oscuro);
    }
    form {
      display: grid;
      gap: 1rem;
      align-content: start;
    }
    form p {
      margin: 0;
    }
    @media (min-width: 900px) {
      .po {
        grid-template-columns: 1.3fr 1fr;
        align-items: start;
      }
    }
  `,
})
export class PerfilOrganizacionPage {
  private readonly orgApi = inject(OrganizacionesApiService);
  private readonly impactoApi = inject(ImpactoApiService);
  private readonly notificador = inject(NotificadorService);

  protected readonly org = rxResource({ stream: () => this.orgApi.yo() });
  protected readonly impacto = rxResource({ stream: () => this.impactoApi.organizacion() });
  protected readonly capacidad = signal<number | null>(null);
  protected readonly guardando = signal(false);

  constructor() {
    effect(() => {
      const o = this.org.value();
      if (o) this.capacidad.set(o.capacidadDiariaKg ?? null);
    });
  }

  guardar(): void {
    const v = this.capacidad();
    const valor = v === null || (v as unknown) === '' ? null : Number(v);
    if (valor !== null && (isNaN(valor) || valor < 0)) {
      this.notificador.error('La capacidad no puede ser negativa.');
      return;
    }
    this.guardando.set(true);
    this.orgApi.actualizarCapacidad(valor).subscribe({
      next: (o) => {
        this.org.set(o);
        this.notificador.exito(
          valor === null
            ? 'Capacidad: sin límite.'
            : `Capacidad actualizada a ${valor} kg por día.`,
        );
        this.guardando.set(false);
      },
      error: () => this.guardando.set(false),
    });
  }
}
