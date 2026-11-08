import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** US23 — Registro desde la landing: llamada final. */
@Component({
  selector: 'app-cta-final',
  imports: [RouterLink],
  template: `
    <section class="cta" aria-labelledby="cta-titulo">
      <div class="contenedor">
        <div class="cta__caja">
          <div>
            <h2 id="cta-titulo">Ahorra hoy y evita que se pierda comida.</h2>
            <p>Crear tu cuenta toma menos de un minuto.</p>
          </div>
          <div class="cta__botones">
            <a class="btn btn--primario cta__btn" routerLink="/autenticacion/registro"
              >Crear mi cuenta gratis</a
            >
            <a class="btn btn--secundario cta__btn" routerLink="/autenticacion/login"
              >Ya tengo cuenta</a
            >
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .cta {
      padding: 4rem 0 5rem;
      background: var(--superficie);
    }
    .cta__caja {
      display: grid;
      gap: 1.5rem;
      align-items: center;
      padding: 2rem 1.5rem;
      border-radius: 24px;
      background: #fff7ed;
      border: 1px solid #fed7aa;
    }
    h2 {
      margin: 0;
      font-size: clamp(1.5rem, 3.5vw, 2.125rem);
      font-weight: 800;
    }
    p {
      margin: 0.5rem 0 0;
      color: #4b5563;
      font-size: 1.0625rem;
    }
    .cta__botones {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .cta__btn {
      min-height: 52px;
      padding: 0 1.5rem;
    }
    @media (min-width: 900px) {
      .cta__caja {
        grid-template-columns: 1fr auto;
        padding: 3rem;
      }
    }
  `,
})
export class CtaFinalComponent {}
