export interface Coordenadas {
  lat: number;
  lng: number;
}

/** Centro por defecto: San Miguel, Lima (zona de los datos demo). */
export const COORDENADAS_LIMA: Coordenadas = { lat: -12.0762, lng: -77.0845 };

/** Ubicación del navegador; si el usuario la niega o falla, devuelve el centro por defecto. */
export function obtenerUbicacion(timeoutMs = 8000): Promise<Coordenadas & { aproximada: boolean }> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve({ ...COORDENADAS_LIMA, aproximada: true });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, aproximada: false }),
      () => resolve({ ...COORDENADAS_LIMA, aproximada: true }),
      { timeout: timeoutMs, enableHighAccuracy: true },
    );
  });
}
