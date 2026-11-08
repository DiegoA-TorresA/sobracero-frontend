import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SesionService } from '@core/auth/sesion.service';
import { NotificadorService } from '@core/utils/notificador.service';

/** TS01 — Inicio de sesión con JWT. Redirige al inicio del rol o a la URL ?volver=. */
@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: '../auth-form.scss',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notificador = inject(NotificadorService);

  protected readonly enviando = signal(false);
  protected readonly verClave = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', Validators.required],
  });

  /** Cuentas del perfil dev del backend (README del backend, sección 3). */
  protected readonly cuentasDemo = [
    { rol: 'Consumidor', correo: 'consumidor@demo.pe', clave: 'Demo1234' },
    { rol: 'Comercio', correo: 'comercio1@demo.pe', clave: 'Demo1234' },
    { rol: 'Organización', correo: 'ong1@demo.pe', clave: 'Demo1234' },
    { rol: 'Admin', correo: 'admin@sobracero.pe', clave: 'Admin1234' },
  ];

  usarDemo(c: { correo: string; clave: string }): void {
    this.form.setValue({ correo: c.correo, clave: c.clave });
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.sesion.login(this.form.getRawValue()).subscribe({
      next: (r) => {
        this.notificador.exito(`¡Hola, ${r.usuario.nombre}!`);
        const volver = this.route.snapshot.queryParamMap.get('volver');
        this.router.navigateByUrl(
          volver && volver.startsWith('/') ? volver : this.sesion.rutaInicio(),
        );
      },
      error: () => this.enviando.set(false),
    });
  }
}
