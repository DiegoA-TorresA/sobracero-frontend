import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OfertaVista } from '@core/models';
import { minutosHasta } from '@core/utils/fechas';
import { FechaExactaPipe } from '@shared/pipes/fecha-exacta.pipe';
import { PorcentajeDescuentoPipe } from '@shared/pipes/porcentaje-descuento.pipe';
import { SolesPipe } from '@shared/pipes/soles.pipe';

const EMOJI_CATEGORIA: Record<string, string> = {
  Panadería: '🥖',
  'Comida preparada': '🍲',
  Lácteos: '🥛',
  'Frutas y verduras': '🥕',
  Abarrotes: '🥫',
  Postres: '🍰',
  Bebidas: '🧃',
};

/** Tarjeta de resultado (Searching Systems): comercio, precio con descuento, vencimiento exacto y distancia. */
@Component({
  selector: 'app-tarjeta-oferta',
  imports: [RouterLink, SolesPipe, FechaExactaPipe, PorcentajeDescuentoPipe],
  template: `
    <a class="to" [class.to--activa]="activa()" [routerLink]="['/consumidor/ofertas', oferta().id]">
      <div class="to__foto" aria-hidden="true">{{ emoji() }}</div>
      <div class="to__cuerpo">
        <div class="to__fila">
          <span class="to__desc"
            >-{{ oferta().precioOriginal | descuento: oferta().precioDescuento }}%</span
          >
          <span class="to__dist">📍 {{ distancia() }}</span>
        </div>
        <h3>{{ oferta().titulo }}</h3>
        <p class="to__comercio">{{ oferta().comercioNombre }}</p>
        <p class="to__precio">
          <strong>{{ oferta().precioDescuento | soles }}</strong>
          <s>{{ oferta().precioOriginal | soles }}</s>
          <span class="to__quedan">· quedan {{ oferta().cantidad }}</span>
        </p>
        <p class="to__recojo" [class.to__recojo--urgente]="urgente()">
          ⏰ Recojo hasta {{ oferta().recojoHasta | fechaExacta }}
        </p>
      </div>
    </a>
  `,
  styles: `
    .to {
      display: flex;
      text-decoration: none;
      color: inherit;
      background: var(--superficie);
      border: 1px solid var(--borde);
      border-radius: var(--radio-lg);
      overflow: hidden;
      transition:
        box-shadow 0.15s,
        border-color 0.15s,
        transform 0.1s;
    }
    .to:hover {
      box-shadow: var(--sombra-2);
      border-color: #a7f3d0;
    }
    .to:active {
      transform: translateY(1px);
    }
    .to--activa {
      border-color: var(--naranja);
      box-shadow: 0 0 0 2px #fed7aa;
    }
    .to__foto {
      display: grid;
      place-items: center;
      width: 92px;
      flex-shrink: 0;
      font-size: 2.25rem;
      background: linear-gradient(160deg, #fef3c7, #fde68a);
    }
    .to__cuerpo {
      padding: 0.875rem 1rem;
      min-width: 0;
      flex: 1;
    }
    .to__fila {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .to__desc {
      padding: 0.125rem 0.5rem;
      border-radius: 999px;
      background: var(--verde);
      color: #fff;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .to__dist {
      font-size: 0.8125rem;
      color: var(--texto-suave);
    }
    h3 {
      margin: 0.375rem 0 0;
      font-size: 1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .to__comercio {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--texto-suave);
    }
    .to__precio {
      margin: 0.375rem 0 0;
    }
    .to__precio strong {
      font-size: 1.125rem;
      color: var(--verde-oscuro);
    }
    .to__precio s {
      margin-left: 0.375rem;
      font-size: 0.8125rem;
      color: var(--texto-suave);
    }
    .to__quedan {
      font-size: 0.8125rem;
      color: var(--texto-suave);
    }
    .to__recojo {
      margin: 0.25rem 0 0;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #4b5563;
    }
    .to__recojo--urgente {
      color: var(--rojo);
    }
  `,
})
export class TarjetaOfertaComponent {
  readonly oferta = input.required<OfertaVista>();
  readonly activa = input(false);

  protected readonly emoji = computed(() => EMOJI_CATEGORIA[this.oferta().categoria] ?? '🍽️');
  protected readonly distancia = computed(() => {
    const km = this.oferta().distanciaKm;
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  });
  /** Rojo cuando falta 1 hora o menos para cerrar la ventana (color de alerta del informe). */
  protected readonly urgente = computed(() => minutosHasta(this.oferta().recojoHasta) <= 60);
}
