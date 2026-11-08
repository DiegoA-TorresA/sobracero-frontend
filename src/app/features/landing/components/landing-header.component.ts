import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SesionService } from '@core/auth/sesion.service';

/** Barra superior de las páginas públicas (Navigation Systems → Visitante). */
@Component({
  selector: 'app-landing-header',
  imports: [RouterLink],
  template: `
    <header class="lh" [class.lh--abierto]="abierto()">
      <div class="lh__barra contenedor">
        <a routerLink="/" class="lh__logo" (click)="abierto.set(false)"
          >🍃 Sobra<strong>Cero</strong></a
        >

        <button
          type="button"
          class="lh__hamburguesa"
          (click)="abierto.set(!abierto())"
          [attr.aria-expanded]="abierto()"
          aria-controls="menu-publico"
          aria-label="Abrir menú"
        >
          <span></span><span></span><span></span>
        </button>

        <nav id="menu-publico" class="lh__nav" aria-label="Menú principal">
          @for (l of enlaces; track l.ancla) {
            <a routerLink="/" [fragment]="l.ancla" (click)="abierto.set(false)">{{ l.texto }}</a>
          }
          <a routerLink="/nuestro-impacto" (click)="abierto.set(false)">Impacto</a>
          <span class="lh__sep"></span>
          @if (sesion.autenticado()) {
            <a class="btn btn--primario btn--sm" [routerLink]="sesion.rutaInicio()"
              >Ir a mi panel</a
            >
          } @else {
            <a class="lh__login" routerLink="/autenticacion/login">Iniciar sesión</a>
            <a class="btn btn--primario btn--sm" routerLink="/autenticacion/registro"
              >Registrarse</a
            >
          }
        </nav>
      </div>
    </header>
  `,
  styles: `
    .lh {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--borde);
    }
    .lh__barra {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 68px;
    }
    .lh__logo {
      font-size: 1.375rem;
      color: var(--texto);
      text-decoration: none;
    }
    .lh__logo strong {
      color: var(--verde);
    }
    .lh__hamburguesa {
      display: grid;
      gap: 5px;
      width: 44px;
      height: 44px;
      place-content: center;
      border: 0;
      background: none;
      cursor: pointer;
    }
    .lh__hamburguesa span {
      width: 22px;
      height: 2px;
      background: var(--texto);
      border-radius: 2px;
      transition:
        transform 0.2s,
        opacity 0.2s;
    }
    .lh--abierto .lh__hamburguesa span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    .lh--abierto .lh__hamburguesa span:nth-child(2) {
      opacity: 0;
    }
    .lh--abierto .lh__hamburguesa span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
    .lh__nav {
      display: none;
    }
    .lh--abierto .lh__nav {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      position: absolute;
      top: 68px;
      left: 0;
      right: 0;
      padding: 1rem;
      background: var(--superficie);
      border-bottom: 1px solid var(--borde);
      box-shadow: var(--sombra-2);
    }
    .lh__nav a:not(.btn) {
      padding: 0.625rem 0.5rem;
      color: var(--texto);
      text-decoration: none;
      font-weight: 500;
      border-radius: 8px;
    }
    .lh__nav a:not(.btn):hover {
      color: var(--verde-oscuro);
      background: var(--gris-claro);
    }
    .lh__sep {
      height: 1px;
      background: var(--borde);
      margin: 0.25rem 0;
    }
    @media (min-width: 960px) {
      .lh__hamburguesa {
        display: none;
      }
      .lh__nav,
      .lh--abierto .lh__nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.25rem;
        position: static;
        padding: 0;
        background: none;
        border: 0;
        box-shadow: none;
      }
      .lh__nav a:not(.btn) {
        padding: 0.5rem 0.75rem;
        font-size: 0.9375rem;
      }
      .lh__sep {
        width: 1px;
        height: 24px;
        margin: 0 0.5rem;
      }
      .lh__login {
        font-weight: 600 !important;
      }
    }
  `,
})
export class LandingHeaderComponent {
  protected readonly sesion = inject(SesionService);
  protected readonly abierto = signal(false);
  protected readonly enlaces = [
    { ancla: 'propuesta', texto: 'Propuesta de valor' },
    { ancla: 'como-funciona', texto: 'Cómo funciona' },
    { ancla: 'para-quien', texto: 'Para quién' },
    { ancla: 'diferenciadores', texto: 'Por qué SobraCero' },
  ];
}
