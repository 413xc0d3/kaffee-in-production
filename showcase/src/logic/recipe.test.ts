import { describe, expect, it } from 'vitest';
import {
  getScaledExtraAmount,
  getScaledRecipe,
  istDrinkDurchFehlendenVorratGesperrt,
  scaleAmount,
} from './recipe';
import { getDrink } from '../data/drinks';

describe('scaleAmount', () => {
  it('lässt Größe M unverändert', () => {
    expect(scaleAmount(100, 'M')).toBe(100);
  });

  it('skaliert und rundet für S und L', () => {
    expect(scaleAmount(30, 'S')).toBe(21); // 30 * 0.7
    expect(scaleAmount(30, 'L')).toBe(45); // 30 * 1.5
    expect(scaleAmount(18, 'S')).toBe(13); // 12.6 gerundet
  });
});

describe('getScaledRecipe', () => {
  it('skaliert alle Basiszutaten eines Getränks konsistent', () => {
    const cappuccino = getDrink('cappuccino');
    expect(getScaledRecipe(cappuccino, 'M')).toEqual({ wasser: 40, kaffee: 18, milch: 120 });
    expect(getScaledRecipe(cappuccino, 'L')).toEqual({ wasser: 60, kaffee: 27, milch: 180 });
  });
});

describe('getScaledExtraAmount', () => {
  it('skaliert Sirup- und Zuckermengen nach Größe', () => {
    expect(getScaledExtraAmount('sirup', 'M')).toBe(10);
    expect(getScaledExtraAmount('sirup', 'L')).toBe(15);
    expect(getScaledExtraAmount('zucker', 'S')).toBe(4); // 3.5 gerundet
  });
});

describe('istDrinkDurchFehlendenVorratGesperrt', () => {
  it('sperrt ein Getränk, das die fehlende Zutat benötigt', () => {
    const latte = getDrink('latte');
    expect(istDrinkDurchFehlendenVorratGesperrt(latte, ['milch'])).toBe(true);
  });

  it('lässt ein Getränk zu, das die fehlende Zutat nicht benötigt (Runde 11)', () => {
    const americano = getDrink('americano'); // braucht keine Milch
    expect(istDrinkDurchFehlendenVorratGesperrt(americano, ['milch'])).toBe(false);
  });

  it('lässt ein Getränk zu, wenn keine Fehlerursachen vorliegen', () => {
    const latte = getDrink('latte');
    expect(istDrinkDurchFehlendenVorratGesperrt(latte, [])).toBe(false);
  });
});
