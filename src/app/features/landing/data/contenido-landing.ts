/**
 * Textos de la landing tomados del informe (TB1): resumen ejecutivo, segmentos,
 * análisis competitivo y estrategias frente a competidores.
 * Cambiar un texto aquí no obliga a tocar los componentes.
 */

export const CIFRAS_PROBLEMA = [
  {
    valor: '12.8 M t',
    texto: 'de alimentos se pierden o desperdician al año en el Perú',
    fuente: 'Bedoya-Perales y Dal’ Magro, 2021',
  },
  {
    valor: '47.76 %',
    texto: 'del suministro nacional de alimentos termina perdido',
    fuente: 'Bedoya-Perales y Dal’ Magro, 2021',
  },
  {
    valor: '30.5 %',
    texto: 'de peruanos enfrentó inseguridad alimentaria moderada o severa en 2025',
    fuente: 'INEI, 2026',
  },
];

export const PASOS = [
  {
    n: 1,
    icono: '🏪',
    titulo: 'El comercio publica',
    texto:
      'Panaderías, restaurantes y minimarkets suben su excedente con precio rebajado, cantidad, fecha exacta de vencimiento y ventana de recojo.',
  },
  {
    n: 2,
    icono: '📍',
    titulo: 'Tú reservas cerca',
    texto:
      'Ves en el mapa las ofertas a 1 km o 10 cuadras, pagas con Yape, Plin o tarjeta y recibes un código de reserva.',
  },
  {
    n: 3,
    icono: '🛍️',
    titulo: 'Recoges y ahorras',
    texto:
      'Muestras tu código en el local dentro del horario. Producto identificado, nada de cajas sorpresa.',
  },
  {
    n: 4,
    icono: '🤝',
    titulo: 'Lo que sobra, se dona',
    texto:
      'Si nadie lo reserva antes del cierre, SobraCero lo deriva automáticamente a una organización social validada cercana.',
  },
];

export type RolDestino = 'CONSUMIDOR' | 'COMERCIO' | 'ORGANIZACION';

export const SEGMENTOS: {
  rol: RolDestino;
  icono: string;
  titulo: string;
  lema: string;
  beneficios: string[];
  cta: string;
}[] = [
  {
    rol: 'CONSUMIDOR',
    icono: '🛒',
    titulo: 'Consumidores',
    lema: 'Come rico, paga menos.',
    beneficios: [
      'Descuentos en comida en buen estado cerca de ti',
      'Sabes exactamente qué compras y hasta cuándo vence',
      'Reserva y paga en segundos, recoge con tu código',
    ],
    cta: 'Buscar ofertas',
  },
  {
    rol: 'COMERCIO',
    icono: '🏪',
    titulo: 'Comercios y empresas',
    lema: 'Recupera costos, no tires comida.',
    beneficios: [
      'Vende tus excedentes del día con descuento',
      'Lo no vendido se dona solo, sin coordinar nada',
      'Reportes de impacto, distintivo y predicción de excedentes (Plan Premium)',
    ],
    cta: 'Registrar mi comercio',
  },
  {
    rol: 'ORGANIZACION',
    icono: '🤝',
    titulo: 'Organizaciones sociales',
    lema: 'Recibe alimentos sin llamar a nadie.',
    beneficios: [
      'Avisos automáticos de donaciones cercanas',
      'Acepta según tu capacidad diaria de recojo',
      'Registro de donaciones listo para la Ley 30498',
    ],
    cta: 'Registrar mi organización',
  },
];

/** Comparación por tipo de alternativa (US24). */
export const COMPARACION = {
  columnas: [
    'SobraCero',
    'Apps de packs sorpresa',
    'Apps de venta con descuento',
    'Bancos de alimentos',
  ],
  filas: [
    { criterio: 'Venta con descuento', valores: [true, true, true, false] },
    { criterio: 'Producto identificado (sin sorpresas)', valores: [true, false, true, true] },
    { criterio: 'Fecha y hora exactas de vencimiento', valores: [true, false, true, false] },
    { criterio: 'Donación automática de lo no vendido', valores: [true, false, false, false] },
    { criterio: 'Registro para deducción (Ley 30498)', valores: [true, false, false, true] },
    { criterio: 'Predicción de excedentes', valores: [true, false, false, false] },
  ],
};

export const DIFERENCIADORES = [
  {
    icono: '♻️',
    titulo: 'Canal dual, residuo cero',
    texto:
      'Primero se intenta vender; si no se vende, se dona. El alimento tiene una segunda y una tercera oportunidad.',
  },
  {
    icono: '🔍',
    titulo: 'Transparencia total',
    texto:
      'Cada oferta muestra cantidad, precio original, precio rebajado y la fecha exacta de vencimiento.',
  },
  {
    icono: '📑',
    titulo: 'Trazabilidad tributaria',
    texto:
      'Cada donación queda registrada con donante, peso y beneficiario, útil para sustentar la Ley 30498.',
  },
  {
    icono: '📈',
    titulo: 'Predicción con datos',
    texto:
      'El Plan Premium anticipa cuánto sobrará por categoría y sugiere el descuento para publicar a tiempo.',
  },
];
