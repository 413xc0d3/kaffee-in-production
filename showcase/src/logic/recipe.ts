import { EXTRA_BASE_AMOUNT, SIZE_FACTORS } from '../data/config';
import type { DrinkRecipe, ExtraType, InventoryType, Size } from '../types';

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

/** Ob ein Getränk eine bestimmte Basis-Vorratsart überhaupt benötigt (z. B. Americano braucht keine Milch). */
function drinkBenoetigtZutat(drink: DrinkRecipe, inventoryType: InventoryType): boolean {
  if (inventoryType === 'wasser') return drink.wasser > 0;
  if (inventoryType === 'kaffee') return drink.kaffee > 0;
  if (inventoryType === 'milch') return drink.milch > 0;
  return false;
}

/**
 * Ob ein Getränk im Fehler-Zustand gesperrt bleiben muss, weil es eine der aufgebrauchten
 * Vorratsarten benötigt (Sperre pro Getränk statt maschinenweit, siehe ENTSCHEIDUNGSPROTOKOLL.md Runde 11).
 */
export function istDrinkDurchFehlendenVorratGesperrt(
  drink: DrinkRecipe,
  fehlerUrsachen: InventoryType[],
): boolean {
  return fehlerUrsachen.some((typ) => drinkBenoetigtZutat(drink, typ));
}
