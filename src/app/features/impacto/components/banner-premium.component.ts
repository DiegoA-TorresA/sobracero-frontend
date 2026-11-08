import { Component, input } from '@angular/core';

/** US26 — Invitación al Plan Premium cuando el comercio tiene Plan Gratis. */
@Component({
  selector: 'app-banner-premium',
  template: `
    <section class="bp">
      <span class="bp__icono" aria-hidden="true">⭐</span>
      <div>
        <h2>{{ titulo() }}</h2>
        <p>
          Con el <strong>Plan Premium</strong> anticipas tus excedentes por categoría, descargas tu
          reporte de impacto y obtienes el distintivo de empresa comprometida.
        </p>
        <p class="texto-suave">
          Para activarlo, solicita el cambio de plan al equipo de SobraCero.
        </p>
      </div>
    </section>
  `,
  styles: `
    .bp {
      display: flex;
      gap: 1rem;
      align-items: start;
      padding: 1.5rem;
      border-radius: var(--radio-lg);
      background: linear-gradient(135deg, #fff7ed, #ffedd5);
      border: 1px solid #fed7aa;
    }
    .bp__icono {
      font-size: 2.25rem;
    }
    h2 {
      margin: 0 0 0.375rem;
      font-size: 1.1875rem;
    }
    p {
      margin: 0.25rem 0 0;
    }
  `,
})
export class BannerPremiumComponent {
  readonly titulo = input('Esta función es parte del Plan Premium');
}
