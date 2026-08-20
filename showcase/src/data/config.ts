import type { ExtraType, InventoryType, Size } from '../types';

/** Maximale Vorratskapazität je Vorratsart (Runde 3.1) */
export const INVENTORY_MAX: Record<InventoryType, number> = {
  wasser: 1000,
  kaffee: 150,
  milch: 750,
  sirup: 100,
  zucker: 100,
};

/** Einheit je Vorratsart, für die Anzeige */
export const INVENTORY_UNIT: Record<InventoryType, string> = {
  wasser: 'ml',
  kaffee: 'g',
  milch: 'ml',
  sirup: 'ml',
  zucker: 'g',
};

export const INVENTORY_LABEL: Record<InventoryType, string> = {
  wasser: 'Wasser',
  kaffee: 'Kaffee',
  milch: 'Milch',
  sirup: 'Sirup',
  zucker: 'Zucker',
};

/** Warnschwelle: 20 % der maximalen Kapazität (Runde 3.2) */
export const WARN_RATIO = 0.2;

/** Größenskalierung der Zutatenmengen (Runde 2.5) */
export const SIZE_FACTORS: Record<Size, number> = { S: 0.7, M: 1, L: 1.5 };

/** Fester Größenaufschlag auf den Grundpreis, in Cent (Runde 2.8) */
export const SIZE_PRICE_SURCHARGE_CENTS: Record<Size, number> = { S: -30, M: 0, L: 40 };

/** Sirup/Zucker-Basismenge bei Größe M, vor Skalierung (Runde 2.6) */
export const EXTRA_BASE_AMOUNT: Record<ExtraType, number> = { sirup: 10, zucker: 5 };

export const EXTRA_LABEL: Record<ExtraType, string> = { sirup: 'Sirup', zucker: 'Zucker' };

/** Aufpreis je gewähltem Extra, in Cent (Runde 2.8) */
export const EXTRA_PRICE_CENTS = 50;

/** Feste Zubereitungsdauer für alle Getränke/Größen (Runde 5.2) */
export const ZUBEREITUNG_DAUER_MS = 5000;

export const ZUBEREITUNG_TICK_MS = 100;
