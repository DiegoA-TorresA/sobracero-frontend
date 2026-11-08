import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { OfertaVista } from '@core/models';
import { Coordenadas } from '@core/utils/geolocalizacion';

/**
 * Mapa de ofertas (Leaflet + OpenStreetMap). Un marcador con el precio por oferta,
 * tu ubicación y el círculo del radio de búsqueda.
 */
@Component({
  selector: 'app-mapa-ofertas',
  template: `<div
    #contenedor
    class="mo"
    role="region"
    aria-label="Mapa de ofertas cercanas"
  ></div>`,
  styles: `
    :host {
      display: block;
    }
    .mo {
      height: 100%;
      min-height: 320px;
      border-radius: var(--radio-lg);
      border: 1px solid var(--borde);
      z-index: 0;
    }
    :host ::ng-deep .pin-precio {
      background: none;
      border: 0;
    }
    :host ::ng-deep .pin-precio span {
      display: inline-block;
      transform: translate(-50%, -100%);
      white-space: nowrap;
      padding: 4px 8px;
      border-radius: 999px;
      background: var(--verde);
      color: #fff;
      font: 700 12px/1.2 var(--fuente);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
      border: 2px solid #fff;
      cursor: pointer;
    }
    :host ::ng-deep .pin-precio--activo span {
      background: var(--naranja);
      color: #1f1300;
      transform: translate(-50%, -100%) scale(1.15);
    }
  `,
})
export class MapaOfertasComponent implements AfterViewInit, OnDestroy {
  readonly centro = input.required<Coordenadas>();
  readonly radioKm = input(1);
  readonly ofertas = input<OfertaVista[]>([]);
  readonly seleccionada = input<number | null>(null);
  readonly elegir = output<number>();

  private readonly contenedor = viewChild.required<ElementRef<HTMLDivElement>>('contenedor');
  private mapa?: L.Map;
  private capaOfertas = L.layerGroup();
  private yo?: L.CircleMarker;
  private circulo?: L.Circle;
  private observador?: ResizeObserver;
  private tamanoPrevio = 0;

  constructor() {
    effect(() => this.pintarOfertas(this.ofertas(), this.seleccionada()));
    effect(() => this.pintarCentro(this.centro(), this.radioKm()));
  }

  ngAfterViewInit(): void {
    const c = this.centro();
    this.mapa = L.map(this.contenedor().nativeElement, { zoomControl: true }).setView(
      [c.lat, c.lng],
      15,
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(this.mapa);
    this.capaOfertas.addTo(this.mapa);
    this.pintarCentro(c, this.radioKm());
    this.pintarOfertas(this.ofertas(), this.seleccionada());
    // En móvil el mapa empieza oculto (vista "Lista"): al mostrarse, Leaflet debe recalcular su tamaño.
    this.observador = new ResizeObserver(() => {
      const ancho = this.contenedor().nativeElement.clientWidth;
      if (!this.mapa || ancho === 0) return;
      this.mapa.invalidateSize();
      if (this.tamanoPrevio === 0 && this.circulo)
        this.mapa.fitBounds(this.circulo.getBounds(), { padding: [16, 16] });
      this.tamanoPrevio = ancho;
    });
    this.observador.observe(this.contenedor().nativeElement);
  }

  private pintarCentro(c: Coordenadas, radioKm: number): void {
    if (!this.mapa) return;
    this.yo?.remove();
    this.circulo?.remove();
    this.circulo = L.circle([c.lat, c.lng], {
      radius: radioKm * 1000,
      color: '#10B981',
      weight: 1,
      fillOpacity: 0.06,
    }).addTo(this.mapa);
    this.yo = L.circleMarker([c.lat, c.lng], {
      radius: 8,
      color: '#fff',
      weight: 3,
      fillColor: '#3b82f6',
      fillOpacity: 1,
    })
      .bindTooltip('Tú estás aquí')
      .addTo(this.mapa);
    if (this.contenedor().nativeElement.clientWidth > 0)
      this.mapa.fitBounds(this.circulo.getBounds(), { padding: [16, 16] });
  }

  /** Un marcador por comercio (sus ofertas comparten ubicación): "S/ 4.00" o "2 ofertas · desde S/ 4.00". */
  private pintarOfertas(ofertas: OfertaVista[], activa: number | null): void {
    if (!this.mapa) return;
    this.capaOfertas.clearLayers();
    const porComercio = new Map<number, OfertaVista[]>();
    for (const o of ofertas)
      porComercio.set(o.comercioId, [...(porComercio.get(o.comercioId) ?? []), o]);
    for (const grupo of porComercio.values()) {
      const primera = grupo[0];
      const desde = Math.min(...grupo.map((o) => o.precioDescuento)).toFixed(2);
      const texto =
        grupo.length === 1 ? `S/ ${desde}` : `${grupo.length} ofertas · desde S/ ${desde}`;
      const esActiva = grupo.some((o) => o.id === activa);
      const icono = L.divIcon({
        className: 'pin-precio' + (esActiva ? ' pin-precio--activo' : ''),
        html: `<span>${texto}</span>`,
        iconSize: [0, 0],
      });
      L.marker([primera.latitud, primera.longitud], {
        icon: icono,
        title: `${primera.comercioNombre}: ${grupo.map((o) => o.titulo).join(', ')}`,
        keyboard: true,
        zIndexOffset: esActiva ? 1000 : 0,
      })
        .on('click', () => this.elegir.emit(primera.id))
        .addTo(this.capaOfertas);
    }
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
    this.mapa?.remove();
  }
}
