import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

/** Marco de las pantallas de login y registro: panel de marca + tarjeta del formulario. */
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="al">
      <aside class="al__marca">
        <a routerLink="/" class="al__logo">🍃 Sobra<strong>Cero</strong></a>
        <h2>Lo que sobra hoy, alimenta a alguien.</h2>
        <p>Compra excedentes con descuento o recíbelos como donación. Nada se pierde.</p>
        <ul>
          <li>🛒 Ahorra hasta 60% en comida en buen estado</li>
          <li>🤝 Lo no vendido se dona automáticamente</li>
          <li>🌱 Mide los kilos rescatados y el CO₂ evitado</li>
        </ul>
      </aside>
      <main class="al__form">
        <a routerLink="/" class="al__logo al__logo--movil">🍃 Sobra<strong>Cero</strong></a>
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
    .al {
      min-height: 100vh;
      display: grid;
      background: var(--fondo);
    }
    .al__marca {
      display: none;
    }
    .al__form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
    }
    .al__logo {
      font-size: 1.5rem;
      color: inherit;
      text-decoration: none;
      margin-bottom: 1.5rem;
    }
    .al__logo strong {
      color: var(--verde);
    }
    @media (min-width: 960px) {
      .al {
        grid-template-columns: 1fr 1fr;
      }
      .al__marca {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
        padding: 4rem;
        color: #fff;
        background: linear-gradient(150deg, var(--verde-oscuro), var(--verde) 70%, #34d399);
      }
      .al__marca .al__logo strong {
        color: #fde68a;
      }
      .al__marca h2 {
        font-size: 2.25rem;
        line-height: 1.15;
        margin: 0;
      }
      .al__marca p {
        font-size: 1.125rem;
        opacity: 0.9;
        margin: 0;
      }
      .al__marca ul {
        list-style: none;
        padding: 0;
        display: grid;
        gap: 0.75rem;
        font-size: 1.0625rem;
      }
      .al__logo--movil {
        display: none;
      }
    }
  `,
})
export class AuthLayoutComponent {}
