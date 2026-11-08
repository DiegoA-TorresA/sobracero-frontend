import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-footer',
  imports: [RouterLink],
  template: `
    <footer class="lf">
      <div class="contenedor lf__grid">
        <div>
          <p class="lf__logo">🍃 Sobra<strong>Cero</strong></p>
          <p class="lf__mision">
            Hacemos que rescatar un alimento sea más fácil que desecharlo. Lima Metropolitana.
          </p>
        </div>
        <nav aria-label="Plataforma">
          <p class="lf__titulo">Plataforma</p>
          <a routerLink="/" fragment="como-funciona">Cómo funciona</a>
          <a routerLink="/nuestro-impacto">Nuestro impacto</a>
          <a routerLink="/autenticacion/login">Iniciar sesión</a>
        </nav>
        <nav aria-label="Únete">
          <p class="lf__titulo">Únete</p>
          <a routerLink="/autenticacion/registro" [queryParams]="{ rol: 'CONSUMIDOR' }"
            >Soy consumidor</a
          >
          <a routerLink="/autenticacion/registro" [queryParams]="{ rol: 'COMERCIO' }"
            >Tengo un comercio</a
          >
          <a routerLink="/autenticacion/registro" [queryParams]="{ rol: 'ORGANIZACION' }"
            >Soy una organización social</a
          >
        </nav>
      </div>
      <div class="contenedor lf__legal">© {{ anio }} SobraCero · Proyecto académico UPC</div>
    </footer>
  `,
  styles: `
    .lf {
      background: #0b1f17;
      color: #d1d5db;
      padding: 3.5rem 0 1.5rem;
    }
    .lf__grid {
      display: grid;
      gap: 2rem;
    }
    .lf__logo {
      font-size: 1.375rem;
      color: #fff;
      margin: 0 0 0.5rem;
    }
    .lf__logo strong {
      color: var(--verde);
    }
    .lf__mision {
      max-width: 22rem;
      margin: 0;
      color: #9ca3af;
    }
    .lf__titulo {
      color: #fff;
      font-weight: 700;
      margin: 0 0 0.75rem;
    }
    nav {
      display: grid;
      gap: 0.5rem;
      align-content: start;
    }
    nav a {
      color: #d1d5db;
      text-decoration: none;
    }
    nav a:hover {
      color: #6ee7b7;
    }
    .lf__legal {
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #1f3a2e;
      font-size: 0.875rem;
      color: #9ca3af;
    }
    @media (min-width: 768px) {
      .lf__grid {
        grid-template-columns: 2fr 1fr 1fr;
      }
    }
  `,
})
export class LandingFooterComponent {
  protected readonly anio = new Date().getFullYear();
}
