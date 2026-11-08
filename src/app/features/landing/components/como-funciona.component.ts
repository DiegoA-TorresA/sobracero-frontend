import { Component } from '@angular/core';
import { PASOS } from '../data/contenido-landing';
import { SeccionTituloComponent } from './seccion-titulo.component';

/** US22 — Cómo funciona: los 4 pasos del canal dual. */
@Component({
  selector: 'app-como-funciona',
  imports: [SeccionTituloComponent],
  template: `
    <section class="cf" id="como-funciona" aria-labelledby="cf-titulo">
      <div class="contenedor">
        <app-seccion-titulo
          idTitulo="cf-titulo"
          eyebrow="Cómo funciona"
          titulo="Una segunda oportunidad como venta, una tercera como donación"
          bajada="Así llega cada excedente a una mesa en lugar de a la basura."
        />
        <ol class="cf__pasos">
          @for (p of pasos; track p.n) {
            <li class="paso" [class.paso--dona]="p.n === 4">
              <span class="paso__n">{{ p.n }}</span>
              <span class="paso__icono" aria-hidden="true">{{ p.icono }}</span>
              <h3>{{ p.titulo }}</h3>
              <p>{{ p.texto }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    .cf {
      padding: 5rem 0;
      background: var(--fondo);
    }
    .cf__pasos {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 1rem;
      counter-reset: paso;
    }
    .paso {
      position: relative;
      padding: 1.75rem 1.5rem 1.5rem;
      background: var(--superficie);
      border: 1px solid var(--borde);
      border-radius: var(--radio-lg);
      transition:
        transform 0.15s,
        box-shadow 0.15s;
    }
    .paso:hover {
      transform: translateY(-3px);
      box-shadow: var(--sombra-2);
    }
    .paso--dona {
      background: #ecfdf5;
      border-color: #a7f3d0;
    }
    .paso__n {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--gris-claro);
      font-weight: 700;
      font-size: 0.875rem;
      color: var(--texto-suave);
    }
    .paso--dona .paso__n {
      background: var(--verde);
      color: #fff;
    }
    .paso__icono {
      font-size: 2.25rem;
    }
    h3 {
      margin: 0.75rem 0 0.5rem;
      font-size: 1.1875rem;
    }
    p {
      margin: 0;
      color: #4b5563;
    }
    @media (min-width: 640px) {
      .cf__pasos {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 1024px) {
      .cf__pasos {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  `,
})
export class ComoFuncionaComponent {
  protected readonly pasos = PASOS;
}
