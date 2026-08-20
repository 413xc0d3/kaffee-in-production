import { EXTRA_BASE_AMOUNT, SIZE_FACTORS } from '../data/config';
import type { DrinkRecipe, ExtraType, Size } from '../types';

/** Skaliert eine Basismenge (bei Größe M) auf die gewählte Größe. */
export function scaleAmount(baseAmount: number, size: Size): number {
  return Math.round(baseAmount * SIZE_FACTORS[size]);
}

export interface ScaledRecipe {
  wasser: number;
  kaffee: number;
  milch: number;
}

/** Berechnet die tatsächlich benötigten Basis-Zutatenmengen für Getränk + Größe. */
export function getScaledRecipe(drink: DrinkRecipe, size: Size): ScaledRecipe {
  return {
    wasser: scaleAmount(drink.wasser, size),
    kaffee: scaleAmount(drink.kaffee, size),
    milch: scaleAmount(drink.milch, size),
  };
}

/** Berechnet die tatsächlich benötigte Menge eines optionalen Extras für die gewählte Größe. */
export function getScaledExtraAmount(extra: ExtraType, size: Size): number {
  return scaleAmount(EXTRA_BASE_AMOUNT[extra], size);
}
