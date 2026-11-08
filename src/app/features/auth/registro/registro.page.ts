import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SesionService } from '@core/auth/sesion.service';
import { RegistroRequest, Rol } from '@core/models';
import { Coordenadas } from '@core/utils/geolocalizacion';
import { NotificadorService } from '@core/utils/notificador.service';
import { MapaSelectorComponent } from '@shared/ui/mapa-selector.component';

type RolRegistrable = Exclude<Rol, 'ADMINISTRADOR'>;

/** Distritos de Lima Metropolitana más frecuentes para el selector. */
const DISTRITOS = [
  'Barranco',
  'Breña',
  'Chorrillos',
  'Jesús María',
  'La Molina',
  'La Victoria',
  'Lima Cercado',
  'Lince',
  'Los Olivos',
  'Magdalena',
  'Miraflores',
  'Pueblo Libre',
  'San Borja',
  'San Isidro',
  'San Juan de Lurigancho',
  'San Martín de Porres',
  'San Miguel',
  'Santiago de Surco',
  'Surquillo',
  'Otro',
];

/**
 * US25 + US23 — Registro según tipo de usuario.
 * Comercios: RUC (11 dígitos) + dirección + ubicación. Organizaciones: dirección + ubicación + capacidad (US14).
 * Comercios y organizaciones nacen PENDIENTES hasta que el administrador los valida (US18).
 */
@Component({
  selector: 'app-registro-page',
  imports: [ReactiveFormsModule, RouterLink, MapaSelectorComponent],
  templateUrl: './registro.page.html',
  styleUrl: '../auth-form.scss',
})
export class RegistroPage {
  private readonly fb = inject(FormBuilder);
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);
  private readonly notificador = inject(NotificadorService);

  protected readonly distritos = DISTRITOS;
  protected readonly roles: {
    valor: RolRegistrable;
    icono: string;
    nombre: string;
    desc: string;
  }[] = [
    { valor: 'CONSUMIDOR', icono: '🛒', nombre: 'Consumidor', desc: 'Compro con descuento' },
    { valor: 'COMERCIO', icono: '🏪', nombre: 'Comercio', desc: 'Vendo mis excedentes' },
    { valor: 'ORGANIZACION', icono: '🤝', nombre: 'Organización', desc: 'Recibo donaciones' },
  ];

  private readonly rolInicial = (inject(ActivatedRoute).snapshot.queryParamMap.get('rol') ??
    'CONSUMIDOR') as RolRegistrable;

  protected readonly form = this.fb.group({
    rol: this.fb.nonNullable.control<RolRegistrable>(
      this.roles.some((r) => r.valor === this.rolInicial) ? this.rolInicial : 'CONSUMIDOR',
    ),
    nombre: this.fb.nonNullable.control('', Validators.required),
    correo: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    clave: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
    ruc: this.fb.control<string | null>(null),
    direccion: this.fb.control<string | null>(null),
    distrito: this.fb.control<string | null>(null),
    capacidadDiariaKg: this.fb.control<number | null>(null, Validators.min(0)),
    aceptaTerminos: this.fb.nonNullable.control(false, Validators.requiredTrue),
  });

  protected readonly rol = toSignal(this.form.controls.rol.valueChanges, {
    initialValue: this.form.controls.rol.value,
  });
  protected readonly esEmpresa = computed(() => this.rol() !== 'CONSUMIDOR');
  protected readonly etiquetaNombre = computed(
    () =>
      ({
        CONSUMIDOR: 'Nombre completo',
        COMERCIO: 'Nombre del comercio',
        ORGANIZACION: 'Nombre de la organización',
      })[this.rol()],
  );

  protected readonly ubicacion = signal<Coordenadas | null>(null);
  protected readonly intentoEnviar = signal(false);
  protected readonly enviando = signal(false);

  constructor() {
    this.form.controls.rol.valueChanges.subscribe((rol) => this.ajustarValidadores(rol));
    this.ajustarValidadores(this.form.controls.rol.value);
  }

  elegirRol(rol: RolRegistrable): void {
    this.form.controls.rol.setValue(rol);
  }

  private ajustarValidadores(rol: RolRegistrable): void {
    const { ruc, direccion } = this.form.controls;
    ruc.setValidators(
      rol === 'COMERCIO' ? [Validators.required, Validators.pattern(/^\d{11}$/)] : null,
    );
    direccion.setValidators(rol === 'CONSUMIDOR' ? null : Validators.required);
    ruc.updateValueAndValidity();
    direccion.updateValueAndValidity();
  }

  enviar(): void {
    this.intentoEnviar.set(true);
    const faltaUbicacion = this.esEmpresa() && !this.ubicacion();
    if (this.form.invalid || faltaUbicacion) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const coords = this.ubicacion();
    const body: RegistroRequest = {
      rol: v.rol,
      nombre: v.nombre.trim(),
      correo: v.correo.trim(),
      clave: v.clave,
      ...(v.rol === 'COMERCIO' && { ruc: v.ruc, distrito: v.distrito }),
      ...(v.rol !== 'CONSUMIDOR' && {
        direccion: v.direccion,
        latitud: coords?.lat,
        longitud: coords?.lng,
      }),
      ...(v.rol === 'ORGANIZACION' && { capacidadDiariaKg: v.capacidadDiariaKg }),
    };
    this.enviando.set(true);
    this.sesion.registrar(body).subscribe({
      next: () => {
        this.notificador.exito(
          v.rol === 'CONSUMIDOR'
            ? '¡Cuenta creada! Ya puedes buscar ofertas.'
            : 'Cuenta creada. Un administrador validará tus datos para activarla.',
        );
        this.router.navigateByUrl(this.sesion.rutaInicio());
      },
      error: () => this.enviando.set(false),
    });
  }
}
