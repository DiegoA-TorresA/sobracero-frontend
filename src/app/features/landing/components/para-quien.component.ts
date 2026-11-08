import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SEGMENTOS } from '../data/contenido-landing';
import { SeccionTituloComponent } from './seccion-titulo.component';

/** US22 + US23 — Beneficios por segmento con registro directo (rol preseleccionado). */
@Component({
  selector: 'app-para-quien',
  imports: [RouterLink, SeccionTituloComponent],
  template: `
    <section class="pq" id="para-quien" aria-labelledby="pq-titulo">
      <div class="contenedor">
        <app-seccion-titulo
          idTitulo="pq-titulo"
          eyebrow="Para quién"
          titulo="Todos ganan cuando la comida no se pierde"
        />
        <div class="pq__grid">
          @for (s of segmentos; track s.rol) {
            <article class="seg" [class]="'seg seg--' + s.rol.toLowerCase()">
              <span class="seg__icono" aria-hidden="true">{{ s.icono }}</span>
              <h3>{{ s.titulo }}</h3>
              <p class="seg__lema">{{ s.lema }}</p>
              <ul>
                @for (b of s.beneficios; track b) {
                  <li>{{ b }}</li>
                }
              </ul>
              <a
                class="btn btn--bloque"
                [class.btn--primario]="s.rol !== 'COMERCIO'"
                [class.btn--acento]="s.rol === 'COMERCIO'"
                routerLink="/autenticacion/registro"
                [queryParams]="{ rol: s.rol }"
                >{{ s.cta }}</a
              >
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .pq {
      padding: 5rem 0;
      background: var(--superficie);
    }
    .pq__grid {
      display: grid;
      gap: 1.25rem;
    }
    .seg {
      display: flex;
      flex-direction: column;
      padding: 2rem 1.75rem;
      border-radius: 20px;
      border: 1px solid var(--borde);
      background: var(--fondo);
    }
    .seg--comercio {
      background: #fff7ed;
      border-color: #fed7aa;
    }
    .seg--organizacion {
      background: #ecfdf5;
      border-color: #a7f3d0;
    }
    .seg__icono {
      font-size: 2.5rem;
    }
    h3 {
      margin: 0.75rem 0 0.25rem;
      font-size: 1.375rem;
    }
    .seg__lema {
      margin: 0 0 1.25rem;
      font-weight: 600;
      color: var(--verde-oscuro);
    }
    .seg--comercio .seg__lema {
      color: var(--naranja-oscuro);
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0 0 1.75rem;
      display: grid;
      gap: 0.625rem;
      flex: 1;
    }
    li {
      padding-left: 1.75rem;
      position: relative;
      color: #374151;
    }
    li::before {
      content: '✓';
      position: absolute;
      left: 0;
      top: 0;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-size: 0.75rem;
      font-weight: 700;
      background: var(--verde);
      color: #fff;
    }
    @media (min-width: 900px) {
      .pq__grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `,
})
export class ParaQuienComponent {
  protected readonly segmentos = SEGMENTOS;
}
