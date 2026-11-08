import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

/**
 * Pantalla temporal usada por los placeholders de las Partes 2–6.
 * Cada desarrollador la reemplaza por su componente real (ver README).
 */
@Component({
  selector: 'app-en-construccion',
  template: `
    <div class="ec">
      <div class="ec__icono" aria-hidden="true">🚧</div>
      <h1>{{ datos()?.['titulo'] ?? 'Pantalla en construcción' }}</h1>
      <p class="texto-suave">
        Parte {{ datos()?.['parte'] ?? '?' }} · {{ datos()?.['historias'] ?? '' }}
      </p>
      <p class="texto-suave">Esta vista la implementa el responsable de su módulo.</p>
    </div>
  `,
  styles: `
    .ec {
      text-align: center;
      padding: 4rem 1rem;
    }
    .ec__icono {
      font-size: 3rem;
    }
    h1 {
      margin: 0.5rem 0;
    }
  `,
})
export class EnConstruccionComponent {
  protected readonly datos = toSignal(inject(ActivatedRoute).data.pipe(map((d) => d)));
}
