import { Component } from '@angular/core';
import { COMPARACION, DIFERENCIADORES } from '../data/contenido-landing';
import { SeccionTituloComponent } from './seccion-titulo.component';

/** US24 — Diferenciadores y comparación con otras alternativas. */
@Component({
  selector: 'app-diferenciadores',
  imports: [SeccionTituloComponent],
  template: `
    <section class="df" id="diferenciadores" aria-labelledby="df-titulo">
      <div class="contenedor">
        <app-seccion-titulo
          idTitulo="df-titulo"
          eyebrow="Por qué SobraCero"
          titulo="La única plataforma de ciclo completo en Lima"
          bajada="Otras apps solo venden con descuento; los bancos de alimentos solo donan. Nosotros hacemos las dos cosas, en automático."
        />

        <div class="df__cards">
          @for (d of diferenciadores; track d.titulo) {
            <article>
              <span aria-hidden="true">{{ d.icono }}</span>
              <h3>{{ d.titulo }}</h3>
              <p>{{ d.texto }}</p>
            </article>
          }
        </div>

        <div class="tabla-scroll df__tabla">
          <table>
            <caption>
              Comparación con otras alternativas
            </caption>
            <thead>
              <tr>
                <th scope="col"></th>
                @for (c of comparacion.columnas; track c; let i = $index) {
                  <th scope="col" [class.propia]="i === 0">{{ c }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (f of comparacion.filas; track f.criterio) {
                <tr>
                  <th scope="row">{{ f.criterio }}</th>
                  @for (v of f.valores; track $index; let i = $index) {
                    <td [class.propia]="i === 0">
                      @if (v) {
                        <span class="si" aria-label="Sí">✓</span>
                      } @else {
                        <span class="no" aria-label="No">—</span>
                      }
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
  styles: `
    .df {
      padding: 5rem 0;
      background: var(--fondo);
    }
    .df__cards {
      display: grid;
      gap: 1rem;
      margin-bottom: 3rem;
    }
    article {
      padding: 1.5rem;
      background: var(--superficie);
      border: 1px solid var(--borde);
      border-radius: var(--radio-lg);
    }
    article span {
      font-size: 2rem;
    }
    h3 {
      margin: 0.5rem 0 0.375rem;
      font-size: 1.125rem;
    }
    article p {
      margin: 0;
      color: #4b5563;
    }
    @media (min-width: 640px) {
      .df__cards {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 1024px) {
      .df__cards {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .df__tabla {
      background: var(--superficie);
      border: 1px solid var(--borde);
      border-radius: var(--radio-lg);
    }
    table {
      width: 100%;
      min-width: 640px;
      border-collapse: collapse;
    }
    caption {
      text-align: left;
      padding: 1.25rem 1.25rem 0.5rem;
      font-weight: 700;
      font-size: 1.125rem;
    }
    th,
    td {
      padding: 0.875rem 1rem;
      border-bottom: 1px solid var(--borde);
      text-align: center;
    }
    thead th {
      font-size: 0.8125rem;
      color: var(--texto-suave);
      font-weight: 600;
    }
    tbody th {
      text-align: left;
      font-weight: 500;
    }
    tbody tr:last-child > * {
      border-bottom: 0;
    }
    .propia {
      background: #ecfdf5;
    }
    thead .propia {
      color: var(--verde-oscuro);
      font-weight: 800;
      font-size: 0.9375rem;
    }
    .si {
      display: inline-grid;
      place-items: center;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: var(--verde);
      color: #fff;
      font-weight: 700;
      font-size: 0.875rem;
    }
    .no {
      color: #9ca3af;
    }
  `,
})
export class DiferenciadoresComponent {
  protected readonly diferenciadores = DIFERENCIADORES;
  protected readonly comparacion = COMPARACION;
}
