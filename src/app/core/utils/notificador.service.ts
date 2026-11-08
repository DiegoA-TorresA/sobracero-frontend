import { Injectable, signal } from '@angular/core';

export type TipoToast = 'exito' | 'error' | 'info';

export interface Toast {
  id: number;
  tipo: TipoToast;
  mensaje: string;
}

/** Mensajes emergentes (toasts). Se pintan en <app-toasts> dentro del layout. */
@Injectable({ providedIn: 'root' })
export class NotificadorService {
  private siguienteId = 1;
  readonly toasts = signal<Toast[]>([]);

  exito(mensaje: string): void {
    this.mostrar('exito', mensaje);
  }
  error(mensaje: string): void {
    this.mostrar('error', mensaje, 6000);
  }
  info(mensaje: string): void {
    this.mostrar('info', mensaje);
  }

  cerrar(id: number): void {
    this.toasts.update((t) => t.filter((x) => x.id !== id));
  }

  private mostrar(tipo: TipoToast, mensaje: string, ms = 4000): void {
    const id = this.siguienteId++;
    this.toasts.update((t) => [...t, { id, tipo, mensaje }]);
    setTimeout(() => this.cerrar(id), ms);
  }
}
