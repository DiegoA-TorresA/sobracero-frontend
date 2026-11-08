import { Component, inject, OnInit, signal } from '@angular/core';
import { NotificacionesEstadoService } from '@layout/notificaciones-estado.service';
import {
  EmptyStateComponent,
  FechaExactaPipe,
  PageHeaderComponent,
  SpinnerComponent,
} from '@shared/index';

/** US27 — Centro de notificaciones con contador de no leídas. */
@Component({
  selector: 'app-notificaciones-page',
  imports: [PageHeaderComponent, EmptyStateComponent, SpinnerComponent, FechaExactaPipe],
  template: `
    <app-page-header
      titulo="Notificaciones"
      [subtitulo]="estado.sinLeer() ? estado.sinLeer() + ' sin leer' : 'Estás al día'"
    >
      @if (estado.sinLeer() > 0) {
        <button type="button" class="btn btn--secundario" (click)="marcarTodas()">
          Marcar todas como leídas
        </button>
      }
    </app-page-header>

    @if (cargando()) {
      <app-spinner />
    } @else if (estado.items().length === 0) {
      <app-empty-state
        icono="🔔"
        titulo="No tienes notificaciones"
        texto="Aquí verás recordatorios de recojo, avisos de donación y cambios en tu cuenta."
      />
    } @else {
      <ul class="lista">
        @for (n of estado.items(); track n.id) {
          <li class="noti" [class.noti--nueva]="!n.leida">
            <span class="noti__punto" aria-hidden="true"></span>
            <div>
              <p class="noti__titulo">{{ n.titulo }}</p>
              <p class="noti__mensaje">{{ n.mensaje }}</p>
              @if (n.creadoEn) {
                <p class="noti__fecha">{{ n.creadoEn | fechaExacta }}</p>
              }
            </div>
          </li>
        }
      </ul>
    }
  `,
  styles: `
    .lista {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.5rem;
    }
    .noti {
      display: flex;
      gap: 0.875rem;
      padding: 1rem;
      background: var(--superficie);
      border: 1px solid var(--borde);
      border-radius: var(--radio);
    }
    .noti--nueva {
      border-color: #a7f3d0;
      background: #f0fdf4;
    }
    .noti__punto {
      flex-shrink: 0;
      width: 10px;
      height: 10px;
      margin-top: 0.4rem;
      border-radius: 50%;
      background: transparent;
    }
    .noti--nueva .noti__punto {
      background: var(--verde);
    }
    .noti__titulo {
      margin: 0;
      font-weight: 600;
    }
    .noti__mensaje {
      margin: 0.25rem 0;
    }
    .noti__fecha {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--texto-suave);
    }
  `,
})
export class NotificacionesPage implements OnInit {
  protected readonly estado = inject(NotificacionesEstadoService);
  protected readonly cargando = signal(true);

  ngOnInit(): void {
    this.estado.cargar().subscribe({
      next: () => this.cargando.set(false),
      error: () => this.cargando.set(false),
    });
  }

  marcarTodas(): void {
    this.estado.marcarTodasLeidas().subscribe();
  }
}
