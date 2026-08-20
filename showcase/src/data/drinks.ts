import type { DrinkRecipe } from '../types';

export const DRINKS: DrinkRecipe[] = [
  { id: 'espresso', name: 'Espresso', wasser: 30, kaffee: 18, milch: 0, basePriceCents: 220 },
  { id: 'americano', name: 'Americano', wasser: 150, kaffee: 18, milch: 0, basePriceCents: 260 },
  { id: 'macchiato', name: 'Macchiato', wasser: 30, kaffee: 18, milch: 15, basePriceCents: 280 },
  { id: 'cappuccino', name: 'Cappuccino', wasser: 40, kaffee: 18, milch: 120, basePriceCents: 320 },
  { id: 'latte', name: 'Latte', wasser: 40, kaffee: 18, milch: 210, basePriceCents: 350 },
];

export function getDrink(id: string): DrinkRecipe {
  const drink = DRINKS.find((d) => d.id === id);
  if (!drink) throw new Error(`Unbekanntes Getränk: ${id}`);
  return drink;
}
