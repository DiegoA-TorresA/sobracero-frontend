import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SesionService } from '@core/auth/sesion.service';
import { LandingHeaderComponent } from '../components/landing-header.component';

/** PARTE 2 · Página 404 (montada como '**' en app.routes.ts). */
@Component({
  selector: 'app-no-encontrado-page',
  imports: [RouterLink, LandingHeaderComponent],
  template: `
    <app-landing-header />
    <main class="ne contenedor">
      <p class="ne__codigo" aria-hidden="true">4<span>🥐</span>4</p>
      <h1>Página no encontrada</h1>
      <p class="texto-suave">
        Esta página ya no está disponible, como el pan de ayer. Pero hay ofertas frescas
        esperándote.
      </p>
      <div class="ne__ctas">
        @if (sesion.autenticado()) {
          <a class="btn btn--primario" [routerLink]="sesion.rutaInicio()">Ir a mi panel</a>
        } @else {
          <a class="btn btn--primario" routerLink="/">Volver al inicio</a>
        }
        <a class="btn btn--secundario" routerLink="/nuestro-impacto">Ver nuestro impacto</a>
      </div>
    </main>
  `,
  styles: `
    .ne {
      min-height: calc(100vh - 68px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding-top: 3rem;
      padding-bottom: 3rem;
    }
    .ne__codigo {
      margin: 0;
      font-size: clamp(5rem, 18vw, 9rem);
      font-weight: 800;
      line-height: 1;
      color: var(--verde);
      letter-spacing: -0.04em;
    }
    .ne__codigo span {
      display: inline-block;
      font-size: 0.75em;
      transform: rotate(-12deg);
    }
    h1 {
      margin: 1rem 0 0.5rem;
    }
    p {
      max-width: 30rem;
    }
    .ne__ctas {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;
      margin-top: 1rem;
    }
  `,
})
export class NoEncontradoPage {
  protected readonly sesion = inject(SesionService);
}
