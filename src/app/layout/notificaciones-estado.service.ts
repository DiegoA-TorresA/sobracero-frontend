import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { NotificacionesApiService } from '@core/api';
import { Notificacion, NotificacionesVista } from '@core/models';
import { Observable, tap } from 'rxjs';

/**
 * Estado compartido del centro de notificaciones (US27).
 * El layout lo consulta cada 60 s para actualizar el contador de la campana.
 */
@Injectable({ providedIn: 'root' })
export class NotificacionesEstadoService {
  private readonly api = inject(NotificacionesApiService);

  readonly sinLeer = signal(0);
  readonly items = signal<Notificacion[]>([]);

  cargar(silencioso = false): Observable<NotificacionesVista> {
    return this.api.mias(silencioso).pipe(
      tap((v) => {
        this.sinLeer.set(v.sinLeer);
        this.items.set(v.items);
      }),
    );
  }

  marcarTodasLeidas(): Observable<void> {
    return this.api.leerTodas().pipe(
      tap(() => {
        this.sinLeer.set(0);
        this.items.update((l) => l.map((n) => ({ ...n, leida: true })));
      }),
    );
  }

  /** Sondeo silencioso mientras el layout esté vivo. */
  iniciarSondeo(destroyRef: DestroyRef, ms = 60_000): void {
    const consultar = () => this.cargar(true).subscribe({ error: () => {} });
    consultar();
    const id = setInterval(consultar, ms);
    destroyRef.onDestroy(() => clearInterval(id));
  }
}
