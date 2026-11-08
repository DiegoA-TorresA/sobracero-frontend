import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** US21 — Propuesta de valor. La tarjeta de la derecha ilustra el canal dual con una oferta de ejemplo. */
@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  template: `
    <section class="hero" id="propuesta" aria-labelledby="hero-titulo">
      <div class="contenedor hero__grid">
        <div class="hero__texto">
          <p class="eyebrow">Rescate de alimentos en Lima</p>
          <h1 id="hero-titulo">
            Lo que sobra hoy, <span class="resaltado">alimenta a alguien</span>.
          </h1>
          <p class="hero__sub">
            Compra excedentes de panaderías, restaurantes y minimarkets cerca de ti con descuento. Y
            si nadie los compra, se donan automáticamente a una organización social.
            <strong>Nada se pierde.</strong>
          </p>
          <div class="hero__ctas">
            <a
              class="btn btn--primario hero__btn"
              routerLink="/autenticacion/registro"
              [queryParams]="{ rol: 'CONSUMIDOR' }"
              >Pide tu oferta</a
            >
            <a
              class="btn btn--secundario hero__btn"
              routerLink="/autenticacion/registro"
              [queryParams]="{ rol: 'COMERCIO' }"
              >Tengo un comercio</a
            >
          </div>
          <ul class="hero__garantias">
            <li>✓ Producto identificado, sin cajas sorpresa</li>
            <li>✓ Fecha y hora exactas de vencimiento</li>
          </ul>
        </div>

        <div class="hero__visual" aria-hidden="true">
          <article class="demo-oferta">
            <div class="demo-oferta__foto">🥖</div>
            <div class="demo-oferta__cuerpo">
              <div class="demo-oferta__fila">
                <span class="chip chip--verde">-60%</span>
                <span class="demo-oferta__dist">📍 350 m</span>
              </div>
              <p class="demo-oferta__titulo">Pan francés (bolsa x10)</p>
              <p class="demo-oferta__comercio">Panadería Doña Rosa · San Miguel</p>
              <p class="demo-oferta__precio"><strong>S/ 4.00</strong> <s>S/ 10.00</s></p>
              <p class="demo-oferta__vence">⏰ Vence hoy a las 9:00 p. m.</p>
            </div>
          </article>
          <div class="flujo">
            <span class="flujo__linea"></span>
            <span class="flujo__texto">¿No se vendió a las 8:45 p. m.?</span>
          </div>
          <article class="demo-donacion">
            <span class="demo-donacion__icono">🤝</span>
            <div>
              <p class="demo-donacion__titulo">Donación derivada</p>
              <p class="demo-donacion__texto">
                Comedor Las Palmeras · 1,2 km · código de recojo enviado
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero {
      position: relative;
      overflow: hidden;
      padding: 3rem 0 4rem;
      background:
        radial-gradient(60rem 30rem at 85% -10%, #d1fae5 0%, transparent 60%),
        radial-gradient(40rem 24rem at -10% 110%, #ffedd5 0%, transparent 60%), var(--superficie);
    }
    .hero__grid {
      display: grid;
      gap: 3rem;
      align-items: center;
    }
    .eyebrow {
      display: inline-block;
      margin: 0 0 1rem;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      background: #ecfdf5;
      color: var(--verde-oscuro);
      font-weight: 600;
      font-size: 0.875rem;
    }
    h1 {
      font-size: clamp(2.25rem, 6vw, 3.75rem);
      line-height: 1.05;
      letter-spacing: -0.02em;
      margin: 0;
      font-weight: 800;
    }
    .resaltado {
      color: var(--verde);
    }
    .hero__sub {
      font-size: 1.125rem;
      color: #374151;
      max-width: 36rem;
      margin: 1.25rem 0 1.75rem;
    }
    .hero__ctas {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .hero__btn {
      min-height: 52px;
      padding: 0 1.5rem;
      font-size: 1.0625rem;
    }
    .hero__garantias {
      list-style: none;
      padding: 0;
      margin: 1.5rem 0 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1.5rem;
      color: var(--texto-suave);
      font-size: 0.9375rem;
    }

    .hero__visual {
      display: grid;
      justify-items: center;
    }
    .demo-oferta {
      display: flex;
      width: 100%;
      max-width: 380px;
      background: var(--superficie);
      border-radius: 20px;
      box-shadow:
        0 24px 48px -12px rgba(4, 120, 87, 0.25),
        var(--sombra-1);
      overflow: hidden;
      transform: rotate(-1.5deg);
    }
    .demo-oferta__foto {
      display: grid;
      place-items: center;
      width: 110px;
      flex-shrink: 0;
      font-size: 3rem;
      background: linear-gradient(160deg, #fef3c7, #fde68a);
    }
    .demo-oferta__cuerpo {
      padding: 1rem 1.125rem;
    }
    .demo-oferta__fila {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chip {
      padding: 0.125rem 0.5rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .chip--verde {
      background: var(--verde);
      color: #fff;
    }
    .demo-oferta__dist {
      font-size: 0.8125rem;
      color: var(--texto-suave);
    }
    .demo-oferta__titulo {
      margin: 0.5rem 0 0;
      font-weight: 700;
    }
    .demo-oferta__comercio {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--texto-suave);
    }
    .demo-oferta__precio {
      margin: 0.5rem 0 0;
      font-size: 1.25rem;
    }
    .demo-oferta__precio strong {
      color: var(--verde-oscuro);
    }
    .demo-oferta__precio s {
      margin-left: 0.375rem;
      font-size: 0.875rem;
      color: var(--texto-suave);
    }
    .demo-oferta__vence {
      margin: 0.25rem 0 0;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--rojo);
    }

    .flujo {
      display: grid;
      justify-items: center;
      gap: 0.5rem;
      padding: 0.75rem 0;
    }
    .flujo__linea {
      width: 2px;
      height: 36px;
      background: repeating-linear-gradient(to bottom, var(--naranja) 0 6px, transparent 6px 12px);
    }
    .flujo__texto {
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      background: #fff7ed;
      color: var(--naranja-oscuro);
      font-size: 0.8125rem;
      font-weight: 600;
    }

    .demo-donacion {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      width: 100%;
      max-width: 340px;
      padding: 1rem 1.125rem;
      background: var(--superficie);
      border: 2px solid #a7f3d0;
      border-radius: 16px;
      box-shadow: var(--sombra-1);
      transform: rotate(1deg);
    }
    .demo-donacion__icono {
      font-size: 2rem;
    }
    .demo-donacion__titulo {
      margin: 0;
      font-weight: 700;
      color: var(--verde-oscuro);
    }
    .demo-donacion__texto {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--texto-suave);
    }

    @media (min-width: 960px) {
      .hero {
        padding: 5rem 0 6rem;
      }
      .hero__grid {
        grid-template-columns: 1.15fr 0.85fr;
      }
    }
  `,
})
export class HeroComponent {}
