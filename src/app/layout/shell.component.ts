import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SesionService } from '@core/auth/sesion.service';
import { MENU_POR_ROL } from '@core/auth/rutas-por-rol';
import { NotificacionesEstadoService } from './notificaciones-estado.service';

const NOMBRE_ROL = {
  CONSUMIDOR: 'Consumidor',
  COMERCIO: 'Comercio',
  ORGANIZACION: 'Organización social',
  ADMINISTRADOR: 'Administrador',
} as const;

/**
 * Layout de la zona privada: barra superior global (logo, notificaciones, perfil),
 * menú lateral por rol en escritorio y barra inferior en móvil.
 */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  protected readonly sesion = inject(SesionService);
  protected readonly notis = inject(NotificacionesEstadoService);
  private readonly router = inject(Router);

  protected readonly menu = computed(() => {
    const rol = this.sesion.rol();
    return rol ? MENU_POR_ROL[rol] : [];
  });
  protected readonly nombreRol = computed(() => {
    const rol = this.sesion.rol();
    return rol ? NOMBRE_ROL[rol] : '';
  });
  protected readonly iniciales = computed(() =>
    (this.sesion.usuario()?.nombre ?? '?')
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join(''),
  );
  protected readonly menuPerfilAbierto = signal(false);

  constructor() {
    this.notis.iniciarSondeo(inject(DestroyRef));
  }

  irANotificaciones(): void {
    this.router.navigateByUrl('/notificaciones');
  }

  cerrarSesion(): void {
    this.menuPerfilAbierto.set(false);
    this.sesion.cerrarSesion();
  }
}
