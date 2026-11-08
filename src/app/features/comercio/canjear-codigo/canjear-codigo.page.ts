import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservasApiService } from '@core/api';
import { ReservaVista } from '@core/models';
import { mensajeDeError } from '@core/utils/errores';
import { SolesPipe } from '@shared/pipes/soles.pipe';
import { PageHeaderComponent } from '@shared/ui/page-header.component';

/**
 * PARTE 4 · US09 — El comercio confirma el recojo con el código de reserva del consumidor.
 * POST /api/reservas/canjear → 404 código no válido · 409 ya usado o ventana vencida.
 */
@Component({
  selector: 'app-canjear-codigo-page',
  imports: [FormsModule, PageHeaderComponent, SolesPipe],
  templateUrl: './canjear-codigo.page.html',
  styleUrl: './canjear-codigo.page.scss',
})
export class CanjearCodigoPage {
  private readonly api = inject(ReservasApiService);

  protected readonly codigo = signal('');
  protected readonly enviando = signal(false);
  protected readonly ultimo = signal<ReservaVista | null>(null);
  protected readonly error = signal<string | null>(null);
  /** Canjes de esta sesión (solo en memoria). */
  protected readonly canjeados = signal<ReservaVista[]>([]);

  normalizar(valor: string): void {
    this.codigo.set(valor.toUpperCase().replace(/\s+/g, ''));
    this.error.set(null);
  }

  canjear(): void {
    let c = this.codigo().trim();
    if (!c) return;
    if (!c.startsWith('SC-') && /^[A-Z0-9]{5}$/.test(c)) c = 'SC-' + c;
    this.enviando.set(true);
    this.error.set(null);
    this.ultimo.set(null);
    this.api.canjear({ codigo: c }).subscribe({
      next: (r) => {
        this.ultimo.set(r);
        this.canjeados.update((l) => [r, ...l]);
        this.codigo.set('');
        this.enviando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.error.set(mensajeDeError(e));
        this.enviando.set(false);
      },
    });
  }
}
