export type MachineStatus = 'aus' | 'aufheizen' | 'bereit' | 'zubereitung' | 'fehler';

export type DrinkId = 'espresso' | 'americano' | 'macchiato' | 'cappuccino' | 'latte';

export type Size = 'S' | 'M' | 'L';

export type ExtraType = 'sirup' | 'zucker';

export type InventoryType = 'wasser' | 'kaffee' | 'milch' | 'sirup' | 'zucker';

export interface DrinkRecipe {
  id: DrinkId;
  name: string;
  /** Zutatenmengen bei Größe M, vor der S/M/L-Skalierung */
  wasser: number;
  kaffee: number;
  milch: number;
  /** Grundpreis bei Größe M, in Cent */
  basePriceCents: number;
}

export type InventoryState = Record<InventoryType, number>;

export interface DayOverview {
  verbrauch: Record<InventoryType, number>;
  einnahmenCents: number;
}

export interface OrderSelection {
  drink: DrinkId;
  size: Size;
  extras: ExtraType[];
}

export interface ActiveOrder {
  drink: DrinkId;
  size: Size;
  extrasApplied: ExtraType[];
}

export interface HinweisMessage {
  id: number;
  text: string;
  art: 'info' | 'fehler';
}
