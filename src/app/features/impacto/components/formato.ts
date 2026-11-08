const n1 = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 1 });
const soles = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });
export const fmtKg = (v: number) => `${n1.format(v)} kg`;
export const fmtSoles = (v: number) => soles.format(v);
export const fmtNum = (v: number) => n1.format(v);
