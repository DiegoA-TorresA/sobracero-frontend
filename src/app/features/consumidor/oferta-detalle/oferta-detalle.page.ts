import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { OfertasApiService, ReservasApiService } from '@core/api';
import { MetodoPago, ReservaVista } from '@core/models';
import { mensajeDeError } from '@core/utils/errores';
import { minutosHasta } from '@core/utils/fechas';
import { FechaExactaPipe } from '@shared/pipes/fecha-exacta.pipe';
import { KgPipe } from '@shared/pipes/kg.pipe';
import { PorcentajeDescuentoPipe } from '@shared/pipes/porcentaje-descuento.pipe';
import { SolesPipe } from '@shared/pipes/soles.pipe';
import { SpinnerComponent } from '@shared/ui/spinner.component';

interface OpcionPago {
  valor: MetodoPago;
  nombre: string;
  icono: string;
}

/**
 * PARTE 3 · US07 + US08 + US09 — Detalle de la oferta, reserva y pago en línea.
 * Flujo con migas de pan: Oferta → Pago → Código de reserva.
 * POST /api/reservas devuelve 402 si el pago es rechazado (no descuenta stock) y 409 si ya no hay unidades.
 */
@Component({
  selector: 'app-oferta-detalle-page',
  imports: [
    RouterLink,
    SpinnerComponent,
    SolesPipe,
    FechaExactaPipe,
    KgPipe,
    PorcentajeDescuentoPipe,
  ],
  templateUrl: './oferta-detalle.page.html',
  styleUrl: './oferta-detalle.page.scss',
})
export class OfertaDetallePage {
  private readonly ofertasApi = inject(OfertasApiService);
  private readonly reservasApi = inject(ReservasApiService);

  /** :id de la URL (withComponentInputBinding). */
  readonly id = input.required<string>();

  protected readonly oferta = rxResource({
    params: () => Number(this.id()),
    stream: ({ params }) => this.ofertasApi.detalle(params),
  });

  protected readonly metodos: OpcionPago[] = [
    { valor: 'YAPE', nombre: 'Yape', icono: '📱' },
    { valor: 'PLIN', nombre: 'Plin', icono: '📲' },
    { valor: 'TARJETA', nombre: 'Tarjeta', icono: '💳' },
    // Solo en desarrollo: la pasarela simulada rechaza este método (HTTP 402).
    ...(environment.production
      ? []
      : [
          {
            valor: 'TARJETA_RECHAZADA' as MetodoPago,
            nombre: 'Tarjeta (simular rechazo)',
            icono: '🚫',
          },
        ]),
  ];

  protected readonly paso = signal<'oferta' | 'pago' | 'listo'>('oferta');
  protected readonly cantidad = signal(1);
  protected readonly metodo = signal<MetodoPago>('YAPE');
  protected readonly pagando = signal(false);
  protected readonly errorPago = signal<string | null>(null);
  protected readonly reserva = signal<ReservaVista | null>(null);

  protected readonly total = computed(
    () => (this.oferta.value()?.precioDescuento ?? 0) * this.cantidad(),
  );
  protected readonly ahorro = computed(() => {
    const o = this.oferta.value();
    return o ? (o.precioOriginal - o.precioDescuento) * this.cantidad() : 0;
  });
  protected readonly minutosParaCerrar = computed(() => {
    const o = this.oferta.value();
    return o ? minutosHasta(o.recojoHasta) : 0;
  });
  protected readonly disponible = computed(() => {
    const o = this.oferta.value();
    return !!o && o.cantidad > 0 && this.minutosParaCerrar() > 0;
  });

  cambiarCantidad(delta: number): void {
    const max = this.oferta.value()?.cantidad ?? 1;
    this.cantidad.update((c) => Math.min(max, Math.max(1, c + delta)));
  }

  irAPago(): void {
    this.errorPago.set(null);
    this.paso.set('pago');
  }

  pagar(): void {
    const o = this.oferta.value();
    if (!o) return;
    this.pagando.set(true);
    this.errorPago.set(null);
    this.reservasApi
      .reservar({ ofertaId: o.id, cantidad: this.cantidad(), metodoPago: this.metodo() })
      .subscribe({
        next: (r) => {
          this.reserva.set(r);
          this.paso.set('listo');
          this.pagando.set(false);
        },
        error: (e: HttpErrorResponse) => {
          this.pagando.set(false);
          this.errorPago.set(mensajeDeError(e));
          if (e.status === 409) this.oferta.reload();
        },
      });
  }

  copiarCodigo(codigo: string): void {
    navigator.clipboard?.writeText(codigo).catch(() => {});
  }
}
