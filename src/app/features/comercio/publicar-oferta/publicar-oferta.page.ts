import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ComerciosApiService, OfertasApiService } from '@core/api';
import { CATEGORIAS_OFERTA, CrearOfertaRequest } from '@core/models';
import { aFechaISO, desdeInputDatetime } from '@core/utils/fechas';
import { NotificadorService } from '@core/utils/notificador.service';
import { SolesPipe } from '@shared/pipes/soles.pipe';
import { PageHeaderComponent } from '@shared/ui/page-header.component';
import { SpinnerComponent } from '@shared/ui/spinner.component';
import { AvisoCuentaComponent } from '../components/aviso-cuenta.component';

/** "YYYY-MM-DDTHH:mm" de hoy a la hora indicada, para <input type="datetime-local">. */
function hoyALas(h: number): string {
  return `${aFechaISO(new Date())}T${String(h).padStart(2, '0')}:00`;
}

/** Mismas reglas que OfertaController.crear en el backend, para avisar antes de enviar. */
function validarOferta(g: AbstractControl): ValidationErrors | null {
  const v = g.value as {
    precioOriginal: number | null;
    precioDescuento: number | null;
    recojoDesde: string;
    recojoHasta: string;
  };
  const errores: ValidationErrors = {};
  if (
    v.precioOriginal != null &&
    v.precioDescuento != null &&
    v.precioDescuento >= v.precioOriginal
  )
    errores['precio'] = true;
  if (v.recojoDesde && v.recojoHasta) {
    if (v.recojoHasta <= v.recojoDesde) errores['ventana'] = true;
    else if (new Date(v.recojoHasta) <= new Date()) errores['ventanaPasada'] = true;
  }
  return Object.keys(errores).length ? errores : null;
}

/**
 * PARTE 4 · US02 + US03 — Publicar una oferta con cantidad, precio, vencimiento y ventana de recojo.
 * Solo comercios VALIDADOS (el backend responde 403 si no).
 */
@Component({
  selector: 'app-publicar-oferta-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    PageHeaderComponent,
    SpinnerComponent,
    AvisoCuentaComponent,
    SolesPipe,
  ],
  templateUrl: './publicar-oferta.page.html',
  styleUrl: './publicar-oferta.page.scss',
})
export class PublicarOfertaPage {
  private readonly fb = inject(FormBuilder);
  private readonly ofertasApi = inject(OfertasApiService);
  private readonly router = inject(Router);
  private readonly notificador = inject(NotificadorService);

  private readonly comerciosApi = inject(ComerciosApiService);
  protected readonly comercio = rxResource({ stream: () => this.comerciosApi.yo() });
  protected readonly puedePublicar = computed(() => this.comercio.value()?.estado === 'VALIDADA');
  protected readonly categorias = CATEGORIAS_OFERTA;
  protected readonly enviando = signal(false);
  protected readonly hoy = aFechaISO(new Date());

  protected readonly form = this.fb.group(
    {
      titulo: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(120)]),
      descripcion: this.fb.nonNullable.control(''),
      categoria: this.fb.nonNullable.control('', Validators.required),
      cantidad: this.fb.control<number | null>(1, [Validators.required, Validators.min(1)]),
      pesoUnitarioKg: this.fb.control<number | null>(0.5, [
        Validators.required,
        Validators.min(0.01),
      ]),
      precioOriginal: this.fb.control<number | null>(null, [
        Validators.required,
        Validators.min(0.01),
      ]),
      precioDescuento: this.fb.control<number | null>(null, [
        Validators.required,
        Validators.min(0),
      ]),
      venceEl: this.fb.nonNullable.control(this.hoy, Validators.required),
      recojoDesde: this.fb.nonNullable.control(hoyALas(19), Validators.required),
      recojoHasta: this.fb.nonNullable.control(hoyALas(21), Validators.required),
    },
    { validators: validarOferta },
  );

  private readonly valores = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });
  protected readonly descuentoPct = computed(() => {
    const { precioOriginal: o, precioDescuento: d } = this.valores();
    return o && d != null && o > 0 && d < o ? Math.round((1 - d / o) * 100) : null;
  });
  protected readonly pesoTotal = computed(() => {
    const { cantidad, pesoUnitarioKg } = this.valores();
    return (cantidad ?? 0) * (pesoUnitarioKg ?? 0);
  });

  /** Atajo: aplica un % de descuento sobre el precio original. */
  aplicarDescuento(pct: number): void {
    const o = this.form.controls.precioOriginal.value;
    if (o) this.form.controls.precioDescuento.setValue(Math.round(o * (1 - pct / 100) * 100) / 100);
  }

  invalido(nombre: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[nombre];
    return c.invalid && c.touched;
  }

  publicar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const body: CrearOfertaRequest = {
      titulo: v.titulo.trim(),
      descripcion: v.descripcion.trim() || null,
      categoria: v.categoria,
      cantidad: v.cantidad!,
      pesoUnitarioKg: v.pesoUnitarioKg,
      precioOriginal: v.precioOriginal!,
      precioDescuento: v.precioDescuento!,
      venceEl: v.venceEl,
      recojoDesde: desdeInputDatetime(v.recojoDesde),
      recojoHasta: desdeInputDatetime(v.recojoHasta),
    };
    this.enviando.set(true);
    this.ofertasApi.crear(body).subscribe({
      next: (o) => {
        this.notificador.exito(`¡"${o.titulo}" ya está publicada!`);
        this.router.navigateByUrl('/comercio/mis-ofertas');
      },
      error: () => this.enviando.set(false),
    });
  }
}
