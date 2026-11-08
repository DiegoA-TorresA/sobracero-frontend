import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  input,
  output,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { COORDENADAS_LIMA, Coordenadas, obtenerUbicacion } from '@core/utils/geolocalizacion';

/**
 * Mapa (Leaflet + OpenStreetMap) para elegir una ubicación con un clic.
 * <app-mapa-selector [inicial]="coords" (cambio)="onCoords($event)" />
 */
@Component({
  selector: 'app-mapa-selector',
  template: `
    <div class="ms">
      <div
        #contenedor
        class="ms__mapa"
        role="application"
        aria-label="Mapa para elegir la ubicación"
      ></div>
      <button type="button" class="btn btn--secundario btn--sm ms__gps" (click)="usarMiUbicacion()">
        📍 Usar mi ubicación
      </button>
    </div>
  `,
  styles: `
    .ms {
      position: relative;
    }
    .ms__mapa {
      height: 260px;
      border-radius: var(--radio);
      border: 1px solid var(--borde);
      z-index: 0;
    }
    .ms__gps {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      z-index: 500;
    }
  `,
})
export class MapaSelectorComponent implements AfterViewInit, OnDestroy {
  readonly inicial = input<Coordenadas | null>(null);
  readonly cambio = output<Coordenadas>();

  private readonly contenedor = viewChild.required<ElementRef<HTMLDivElement>>('contenedor');
  private mapa?: L.Map;
  private marcador?: L.CircleMarker;

  ngAfterViewInit(): void {
    const centro = this.inicial() ?? COORDENADAS_LIMA;
    this.mapa = L.map(this.contenedor().nativeElement).setView([centro.lat, centro.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(this.mapa);
    if (this.inicial()) this.colocar(centro, false);
    this.mapa.on('click', (e: L.LeafletMouseEvent) =>
      this.colocar({ lat: e.latlng.lat, lng: e.latlng.lng }),
    );
  }

  async usarMiUbicacion(): Promise<void> {
    const c = await obtenerUbicacion();
    this.mapa?.setView([c.lat, c.lng], 16);
    this.colocar(c);
  }

  private colocar(c: Coordenadas, emitir = true): void {
    if (!this.mapa) return;
    if (this.marcador) this.marcador.setLatLng([c.lat, c.lng]);
    else
      this.marcador = L.circleMarker([c.lat, c.lng], {
        radius: 10,
        color: '#059669',
        fillColor: '#10B981',
        fillOpacity: 0.9,
      }).addTo(this.mapa);
    if (emitir) this.cambio.emit({ lat: +c.lat.toFixed(6), lng: +c.lng.toFixed(6) });
  }

  ngOnDestroy(): void {
    this.mapa?.remove();
  }
}
