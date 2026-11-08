import { Component, effect, input, signal } from '@angular/core';

/**
 * Número que sube de 0 al valor con una animación corta.
 * Respeta "prefers-reduced-motion". <app-contador-animado [valor]="1234.5" [decimales]="1" />
 */
@Component({
  selector: 'app-contador-animado',
  template: `{{ texto() }}`,
})
export class ContadorAnimadoComponent {
  readonly valor = input.required<number>();
  readonly decimales = input(0);
  readonly duracionMs = input(1200);

  protected readonly texto = signal('0');

  constructor() {
    effect((onCleanup) => {
      const fin = this.valor();
      const fmt = new Intl.NumberFormat('es-PE', {
        maximumFractionDigits: this.decimales(),
        minimumFractionDigits: 0,
      });
      const reducido =
        typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducido || fin === 0) {
        this.texto.set(fmt.format(fin));
        return;
      }
      const inicio = performance.now();
      let id = 0;
      const paso = (t: number) => {
        const p = Math.min(1, (t - inicio) / this.duracionMs());
        const suave = 1 - Math.pow(1 - p, 3);
        this.texto.set(fmt.format(fin * suave));
        if (p < 1) id = requestAnimationFrame(paso);
      };
      id = requestAnimationFrame(paso);
      onCleanup(() => cancelAnimationFrame(id));
    });
  }
}
