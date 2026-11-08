import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { OfertasApiService } from '@core/api';
import { CATEGORIAS_OFERTA, OfertaVista } from '@core/models';
import { aDate } from '@core/utils/fechas';
import { Coordenadas, obtenerUbicacion } from '@core/utils/geolocalizacion';
import { EmptyStateComponent } from '@shared/ui/empty-state.component';
import { PageHeaderComponent } from '@shared/ui/page-header.component';
import { SpinnerComponent } from '@shared/ui/spinner.component';
import { MapaOfertasComponent } from '../components/mapa-ofertas.component';
import { TarjetaOfertaComponent } from '../components/tarjeta-oferta.component';

type FranjaRecojo = 'todas' | 'tarde' | 'noche';

/**
 * PARTE 3 · US06 + US07 — Ofertas cercanas en mapa y lista.
 * El radio se consulta al backend (GET /api/ofertas/cercanas); categoría, descuento y horario se filtran aquí.
 */
@Component({
  selector: 'app-ofertas-cercanas-page',
  imports: [
    FormsModule,
    PageHeaderComponent,
    SpinnerComponent,
    EmptyStateComponent,
    MapaOfertasComponent,
    TarjetaOfertaComponent,
  ],
  templateUrl: './ofertas-cercanas.page.html',
  styleUrl: './ofertas-cercanas.page.scss',
})
export class OfertasCercanasPage implements OnInit {
  private readonly api = inject(OfertasApiService);

  protected readonly categorias = CATEGORIAS_OFERTA;
  protected readonly radios = [0.5, 1, 2, 5, 10];
  protected readonly descuentos = [0, 30, 50, 70];

  protected readonly ubicacion = signal<Coordenadas | null>(null);
  protected readonly aproximada = signal(false);
  protected readonly radioKm = signal(1);
  protected readonly categoria = signal('');
  protected readonly descuentoMin = signal(0);
  protected readonly franja = signal<FranjaRecojo>('todas');
  protected readonly vista = signal<'lista' | 'mapa'>('lista');
  protected readonly seleccionada = signal<number | null>(null);

  /** Se vuelve a pedir al backend cuando cambian la ubicación o el radio. */
  protected readonly ofertas = rxResource({
    params: () => {
      const u = this.ubicacion();
      return u ? { lat: u.lat, lng: u.lng, radioKm: this.radioKm() } : undefined;
    },
    stream: ({ params }) => this.api.cercanas(params),
  });

  protected readonly filtradas = computed<OfertaVista[]>(() => {
    const lista = this.ofertas.value() ?? [];
    const cat = this.categoria();
    const min = this.descuentoMin();
    const franja = this.franja();
    return lista.filter((o) => {
      if (cat && o.categoria !== cat) return false;
      const desc = (1 - o.precioDescuento / o.precioOriginal) * 100;
      if (desc < min) return false;
      if (franja !== 'todas') {
        const hora = aDate(o.recojoHasta).getHours();
        if (franja === 'tarde' && hora > 18) return false;
        if (franja === 'noche' && hora < 18) return false;
      }
      return true;
    });
  });

  protected readonly hayFiltros = computed(
    () => !!this.categoria() || this.descuentoMin() > 0 || this.franja() !== 'todas',
  );

  async ngOnInit(): Promise<void> {
    const u = await obtenerUbicacion();
    this.aproximada.set(u.aproximada);
    this.ubicacion.set({ lat: u.lat, lng: u.lng });
  }

  ampliarRadio(): void {
    const siguiente = this.radios.find((r) => r > this.radioKm());
    if (siguiente) this.radioKm.set(siguiente);
  }

  limpiarFiltros(): void {
    this.categoria.set('');
    this.descuentoMin.set(0);
    this.franja.set('todas');
  }

  elegirEnMapa(id: number): void {
    this.seleccionada.set(id);
    this.vista.set('lista');
    queueMicrotask(() =>
      document
        .getElementById(`oferta-${id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    );
  }

  etiquetaRadio(r: number): string {
    return r < 1 ? `${r * 1000} m` : `${r} km`;
  }
}
