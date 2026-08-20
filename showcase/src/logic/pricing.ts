import { EXTRA_PRICE_CENTS, SIZE_PRICE_SURCHARGE_CENTS } from '../data/config';
import type { DrinkRecipe, ExtraType, Size } from '../types';

/**
 * Preis in Cent = Grundpreis (M) + fester Größenaufschlag + Aufpreis je tatsächlich
 * zubereitetem Extra (Runde 2.7/2.8). Nicht verfügbare, entfallene Extras (Runde 7.3)
 * werden nicht berechnet — daher zählt hier nur die Anzahl der angewendeten Extras.
 */
export function calculatePriceCents(
  drink: DrinkRecipe,
  size: Size,
  appliedExtras: ExtraType[],
): number {
  return (
    drink.basePriceCents + SIZE_PRICE_SURCHARGE_CENTS[size] + appliedExtras.length * EXTRA_PRICE_CENTS
  );
}

export function formatCents(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}
