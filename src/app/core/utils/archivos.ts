/** Descarga un Blob como archivo (p. ej. el reporte CSV del comercio). */
export function descargarBlob(blob: Blob, nombre: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}

/** Genera y descarga un CSV a partir de filas (UTF-8 con BOM para que Excel respete tildes). */
export function descargarCsv(filas: Record<string, unknown>[], nombre: string): void {
  if (!filas.length) return;
  const columnas = Object.keys(filas[0]);
  const escapar = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const contenido = [
    columnas.join(','),
    ...filas.map((f) => columnas.map((c) => escapar(f[c])).join(',')),
  ].join('\n');
  descargarBlob(new Blob(['﻿' + contenido], { type: 'text/csv;charset=utf-8' }), nombre);
}
