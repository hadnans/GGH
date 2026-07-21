// GGH — Gomla Go Home (جملة لحد البيت)
// Money formatting utilities — All values are integer piastres (EGP 14.50 = 1450)

import { type Piastres, fromPiastres } from '@/types/ggh';

/**
 * Format piastres as a display string: "EGP 14.50" or "14.50 ج.م"
 */
export function formatPriceWithCurrency(piastres: Piastres, lang: 'en' | 'ar' = 'en'): string {
  const egp = fromPiastres(piastres);
  const formatted = egp.toLocaleString('en-EG', {
    minimumFractionDigits: egp % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return lang === 'ar' ? `${formatted} ج.م` : `EGP ${formatted}`;
}

/**
 * Format piastres as a number string: "14.50"
 */
export function formatPrice(piastres: Piastres): string {
  const egp = fromPiastres(piastres);
  return egp.toLocaleString('en-EG', {
    minimumFractionDigits: egp % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Calculate discount percentage between two piastres values
 */
export function calcDiscountPercent(today: Piastres, yesterday: Piastres): number {
  if (!yesterday || yesterday <= 0) return 0;
  return Math.round(((yesterday - today) / yesterday) * 100);
}

/**
 * Calculate savings in piastres
 */
export function calcSavings(today: Piastres, yesterday: Piastres): Piastres {
  return (yesterday - today) as Piastres;
}

/**
 * Sum piastres values
 */
export function sumPiastres(...values: Piastres[]): Piastres {
  return values.reduce((sum, v) => (sum + v) as Piastres, 0 as Piastres);
}

/**
 * Multiply piastres by quantity
 */
export function multiplyPiastres(price: Piastres, qty: number): Piastres {
  return (price * qty) as Piastres;
}

/**
 * Check if a price represents free (0 piastres)
 */
export function isFree(piastres: Piastres): boolean {
  return piastres === 0;
}

/**
 * Convert EGP number to piastres
 */
export function egpToPiastres(egp: number): Piastres {
  return Math.round(egp * 100) as Piastres;
}

/**
 * Convert piastres to EGP number
 */
export function piastresToEgp(piastres: Piastres): number {
  return piastres / 100;
}
