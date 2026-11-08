import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ComerciosApiService } from '@core/api';
import { SesionService } from '@core/auth/sesion.service';
import { FechaExactaPipe } from '@shared/pipes/fecha-exacta.pipe';
import { EstadoBadgeComponent } from '@shared/ui/estado-badge.component';
import { PageHeaderComponent } from '@shared/ui/page-header.component';
import { SpinnerComponent } from '@shared/ui/spinner.component';
import { AvisoCuentaComponent } from '../components/aviso-cuenta.component';

/** PARTE 4 · US18 + US26 — Datos del comercio, estado de validación y plan. */
@Component({
  selector: 'app-perfil-comercio-page',
  imports: [
    RouterLink,
    PageHeaderComponent,
    SpinnerComponent,
    EstadoBadgeComponent,
    AvisoCuentaComponent,
    FechaExactaPipe,
  ],
  template: `
    <app-page-header titulo="Mi comercio" />
    @if (comercio.isLoading()) {
      <app-spinner />
    } @else if (comercio.value(); as c) {
      <app-aviso-cuenta [comercio]="c" />
      <div class="pc">
        <section class="tarjeta">
          <div class="pc__cabecera">
            <h2>{{ c.nombre }}</h2>
            <app-estado-badge [estado]="c.estado" />
          </div>
          <dl class="datos">
            <div>
              <dt>Correo</dt>
              <dd>{{ sesion.usuario()?.correo }}</dd>
            </div>
            <div>
              <dt>RUC</dt>
              <dd>{{ c.ruc ?? '—' }}</dd>
            </div>
            <div>
              <dt>Dirección</dt>
              <dd>{{ c.direccion ?? '—' }}</dd>
            </div>
            <div>
              <dt>Distrito</dt>
              <dd>{{ c.distrito ?? '—' }}</dd>
            </div>
            <div>
              <dt>Ubicación</dt>
              <dd>{{ c.latitud.toFixed(5) }}, {{ c.longitud.toFixed(5) }}</dd>
            </div>
            @if (c.creadoEn) {
              <div>
                <dt>Registrado</dt>
                <dd>{{ c.creadoEn | fechaExacta: 'dia' }}</dd>
              </div>
            }
          </dl>
        </section>

        <section class="tarjeta plan" [class.plan--premium]="c.plan === 'PREMIUM'">
          <p class="plan__etiqueta">Tu plan</p>
          <h2>{{ c.plan === 'PREMIUM' ? '⭐ Plan Premium' : 'Plan Gratis' }}</h2>
          @if (c.plan === 'PREMIUM') {
            <p>
              Tienes predicción de excedentes, reporte CSV de impacto y el distintivo de empresa
              comprometida.
            </p>
            <a class="btn btn--acento" routerLink="/impacto/prediccion">Ver predicción</a>
          } @else {
            <p>Publica ofertas y deriva donaciones sin costo. Con el Plan Premium sumas:</p>
            <ul>
              <li>📈 Predicción de excedentes por categoría</li>
              <li>📄 Reporte de impacto descargable</li>
              <li>🏅 Distintivo de empresa comprometida</li>
            </ul>
            <p class="texto-suave">Para activarlo, escribe al equipo de SobraCero.</p>
          }
        </section>
      </div>
    }
  `,
  styles: `
    .pc {
      display: grid;
      gap: 1rem;
    }
    .pc__cabecera {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: start;
    }
    h2 {
      margin: 0;
      font-size: 1.25rem;
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
      word-break: break-word;
    }
    .plan__etiqueta {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--texto-suave);
      font-weight: 600;
    }
    .plan--premium {
      background: #fff7ed;
      border-color: #fed7aa;
    }
    .plan ul {
      padding-left: 0;
      list-style: none;
      display: grid;
      gap: 0.375rem;
    }
    @media (min-width: 900px) {
      .pc {
        grid-template-columns: 1.4fr 1fr;
        align-items: start;
      }
      .datos {
        grid-template-columns: 1fr 1fr;
      }
    }
  `,
})
export class PerfilComercioPage {
  protected readonly sesion = inject(SesionService);
  private readonly api = inject(ComerciosApiService);
  protected readonly comercio = rxResource({ stream: () => this.api.yo() });
}
