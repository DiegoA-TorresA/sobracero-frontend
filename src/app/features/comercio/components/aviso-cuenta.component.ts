import { Component, input } from '@angular/core';
import { Comercio } from '@core/models';

/** US18 — Aviso cuando la cuenta del comercio aún no está validada o fue rechazada. */
@Component({
  selector: 'app-aviso-cuenta',
  template: `
    @if (comercio(); as c) {
      @if (c.estado === 'PENDIENTE') {
        <div class="aviso aviso--pendiente" role="status">
          <strong>⏳ Tu cuenta está en revisión.</strong>
          Un administrador validará tus datos (RUC y dirección). Podrás publicar ofertas apenas se
          apruebe.
        </div>
      } @else if (c.estado === 'RECHAZADA') {
        <div class="aviso aviso--rechazada" role="alert">
          <strong>Tu cuenta fue rechazada.</strong>
          @if (c.motivoRechazo) {
            Motivo: {{ c.motivoRechazo }}.
          }
          Escríbenos para corregir tus datos.
        </div>
      }
    }
  `,
  styles: `
    .aviso {
      margin-bottom: 1.25rem;
      padding: 1rem 1.125rem;
      border-radius: var(--radio);
      line-height: 1.5;
    }
    .aviso--pendiente {
      background: #fff7ed;
      color: #9a3412;
      border: 1px solid #fed7aa;
    }
    .aviso--rechazada {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
  `,
})
export class AvisoCuentaComponent {
  readonly comercio = input<Comercio | undefined>();
}
