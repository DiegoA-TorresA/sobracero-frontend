import { Component, ElementRef, effect, input, output, viewChild } from '@angular/core';

/**
 * Diálogo modal accesible basado en <dialog> nativo.
 * <app-dialogo [abierto]="abierto()" titulo="Rechazar" (cerrar)="abierto.set(false)"> ...contenido... </app-dialogo>
 */
@Component({
  selector: 'app-dialogo',
  template: `
    <dialog
      #dlg
      class="dlg"
      (close)="cerrar.emit()"
      (click)="clicFondo($event)"
      [attr.aria-labelledby]="'dlg-' + id"
    >
      <div class="dlg__caja">
        <header class="dlg__cabecera">
          <h2 [id]="'dlg-' + id">{{ titulo() }}</h2>
          <button type="button" class="dlg__x" (click)="cerrar.emit()" aria-label="Cerrar">
            ×
          </button>
        </header>
        <ng-content />
      </div>
    </dialog>
  `,
  styles: `
    .dlg {
      padding: 0;
      border: 0;
      border-radius: var(--radio-lg);
      width: min(30rem, calc(100vw - 2rem));
      box-shadow: var(--sombra-2);
    }
    .dlg::backdrop {
      background: rgba(17, 24, 39, 0.45);
    }
    .dlg__caja {
      padding: 1.5rem;
    }
    .dlg__cabecera {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    h2 {
      margin: 0;
      font-size: 1.25rem;
    }
    .dlg__x {
      border: 0;
      background: none;
      font-size: 1.5rem;
      line-height: 1;
      cursor: pointer;
      color: var(--texto-suave);
    }
  `,
})
export class DialogoComponent {
  private static siguiente = 1;
  protected readonly id = DialogoComponent.siguiente++;
  readonly abierto = input(false);
  readonly titulo = input.required<string>();
  readonly cerrar = output<void>();
  private readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  constructor() {
    effect(() => {
      const d = this.dlg().nativeElement;
      if (this.abierto() && !d.open) d.showModal();
      if (!this.abierto() && d.open) d.close();
    });
  }

  protected clicFondo(e: MouseEvent): void {
    if (e.target === this.dlg().nativeElement) this.cerrar.emit();
  }
}
