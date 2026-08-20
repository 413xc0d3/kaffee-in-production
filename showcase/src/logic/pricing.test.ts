import { describe, expect, it } from 'vitest';
import { calculatePriceCents, formatCents } from './pricing';
import { getDrink } from '../data/drinks';

describe('calculatePriceCents', () => {
  it('berechnet den Grundpreis bei Größe M ohne Extras', () => {
    const espresso = getDrink('espresso');
    expect(calculatePriceCents(espresso, 'M', [])).toBe(220);
  });

  it('zieht den Größenabschlag bei S ab', () => {
    const espresso = getDrink('espresso');
    expect(calculatePriceCents(espresso, 'S', [])).toBe(190);
  });

  it('addiert den Größenaufschlag bei L', () => {
    const espresso = getDrink('espresso');
    expect(calculatePriceCents(espresso, 'L', [])).toBe(260);
  });

  it('berechnet nur die tatsächlich angewendeten Extras, nicht die gewählten', () => {
    const latte = getDrink('latte');
    expect(calculatePriceCents(latte, 'L', ['sirup', 'zucker'])).toBe(350 + 40 + 2 * 50);
    expect(calculatePriceCents(latte, 'L', ['sirup'])).toBe(350 + 40 + 50);
    expect(calculatePriceCents(latte, 'L', [])).toBe(350 + 40);
  });
});

describe('formatCents', () => {
  it('formatiert Cent-Beträge als Euro mit Komma', () => {
    expect(formatCents(220)).toBe('2,20 €');
    expect(formatCents(0)).toBe('0,00 €');
    expect(formatCents(5)).toBe('0,05 €');
  });
});
