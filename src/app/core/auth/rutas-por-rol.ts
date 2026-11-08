import { Rol } from '../models';

/** Pantalla de inicio de cada rol después del login. */
export const RUTA_INICIO_POR_ROL: Record<Rol, string> = {
  CONSUMIDOR: '/consumidor/ofertas',
  COMERCIO: '/comercio/mis-ofertas',
  ORGANIZACION: '/organizacion/donaciones',
  ADMINISTRADOR: '/admin/comercios',
};

export interface ItemMenu {
  etiqueta: string;
  ruta: string;
  icono: string;
}

/**
 * Menú principal por rol (sección "Navigation Systems" del informe).
 * Cada dueño de módulo puede agregar SUS entradas aquí avisando al responsable de la Parte 1.
 */
export const MENU_POR_ROL: Record<Rol, ItemMenu[]> = {
  CONSUMIDOR: [
    { etiqueta: 'Ofertas cercanas', ruta: '/consumidor/ofertas', icono: '📍' },
    { etiqueta: 'Mis reservas', ruta: '/consumidor/reservas', icono: '🧾' },
  ],
  COMERCIO: [
    { etiqueta: 'Publicar oferta', ruta: '/comercio/publicar', icono: '➕' },
    { etiqueta: 'Mis ofertas', ruta: '/comercio/mis-ofertas', icono: '🥖' },
    { etiqueta: 'Canjear código', ruta: '/comercio/canjear', icono: '✅' },
    { etiqueta: 'Donaciones', ruta: '/comercio/donaciones', icono: '🤝' },
    { etiqueta: 'Impacto', ruta: '/impacto/comercio', icono: '🌱' },
    { etiqueta: 'Plan Premium', ruta: '/impacto/prediccion', icono: '⭐' },
  ],
  ORGANIZACION: [
    { etiqueta: 'Donaciones disponibles', ruta: '/organizacion/donaciones', icono: '📦' },
    { etiqueta: 'Mis recojos', ruta: '/organizacion/recojos', icono: '🚚' },
    { etiqueta: 'Registro de donaciones', ruta: '/organizacion/registro', icono: '📋' },
    { etiqueta: 'Mi organización', ruta: '/organizacion/perfil', icono: '🏠' },
  ],
  ADMINISTRADOR: [
    { etiqueta: 'Comercios', ruta: '/admin/comercios', icono: '🏪' },
    { etiqueta: 'Organizaciones', ruta: '/admin/organizaciones', icono: '🤝' },
    { etiqueta: 'Impacto de la plataforma', ruta: '/impacto/plataforma', icono: '🌍' },
  ],
};
