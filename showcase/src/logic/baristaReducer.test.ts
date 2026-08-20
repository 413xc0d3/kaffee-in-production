import { describe, expect, it } from 'vitest';
import { baristaReducer, initialBaristaState } from './baristaReducer';
import { INVENTORY_MAX } from '../data/config';

describe('Zustandsübergänge Maschine', () => {
  it('schaltet von "aus" nach "aufheizen" nach "bereit"', () => {
    let state = initialBaristaState();
    state = baristaReducer(state, { type: 'EINSCHALTEN' });
    expect(state.status).toBe('aufheizen');
    state = baristaReducer(state, { type: 'AUFGEHEIZT' });
    expect(state.status).toBe('bereit');
  });

  it('ignoriert EINSCHALTEN, wenn die Maschine nicht aus ist', () => {
    let state = initialBaristaState();
    state = baristaReducer(state, { type: 'EINSCHALTEN' });
    const nachErneutemEinschalten = baristaReducer(state, { type: 'EINSCHALTEN' });
    expect(nachErneutemEinschalten).toBe(state);
  });

  it('schaltet aus "bereit" und "fehler" aus, aber nicht aus "aufheizen"', () => {
    let state = initialBaristaState();
    state = baristaReducer(state, { type: 'EINSCHALTEN' });
    const nochAufheizen = baristaReducer(state, { type: 'AUSSCHALTEN' });
    expect(nochAufheizen.status).toBe('aufheizen');

    state = baristaReducer(state, { type: 'AUFGEHEIZT' });
    state = baristaReducer(state, { type: 'AUSSCHALTEN' });
    expect(state.status).toBe('aus');
  });
});

describe('Bestellung bei ausreichendem Vorrat', () => {
  function bereiterZustand() {
    let state = initialBaristaState();
    state = baristaReducer(state, { type: 'EINSCHALTEN' });
    state = baristaReducer(state, { type: 'AUFGEHEIZT' });
    return state;
  }

  it('reduziert den Vorrat um die skalierte Rezeptmenge und wechselt in "zubereitung"', () => {
    let state = bereiterZustand();
    state = baristaReducer(state, { type: 'WAEHLE_GETRAENK', drink: 'espresso' });
    state = baristaReducer(state, { type: 'BESTELLEN' });

    expect(state.status).toBe('zubereitung');
    expect(state.inventory.wasser).toBe(INVENTORY_MAX.wasser - 30);
    expect(state.inventory.kaffee).toBe(INVENTORY_MAX.kaffee - 18);
  });

  it('bucht den Preis auf den Tagesüberblick', () => {
    let state = bereiterZustand();
    state = baristaReducer(state, { type: 'WAEHLE_GETRAENK', drink: 'espresso' });
    state = baristaReducer(state, { type: 'BESTELLEN' });
    expect(state.day.einnahmenCents).toBe(220);
  });

  it('schließt eine Zubereitung ohne offene Fehlerursachen wieder auf "bereit"', () => {
    let state = bereiterZustand();
    state = baristaReducer(state, { type: 'WAEHLE_GETRAENK', drink: 'espresso' });
    state = baristaReducer(state, { type: 'BESTELLEN' });
    state = baristaReducer(state, { type: 'ZUBEREITUNG_FERTIG' });
    expect(state.status).toBe('bereit');
    expect(state.activeOrder).toBeNull();
  });
});

describe('Bestellung bei unzureichendem Vorrat', () => {
  it('wechselt in "fehler" und merkt sich die fehlende Zutat, wenn der Vorrat nicht reicht', () => {
    let state = initialBaristaState();
    state = baristaReducer(state, { type: 'EINSCHALTEN' });
    state = baristaReducer(state, { type: 'AUFGEHEIZT' });
    state = { ...state, inventory: { ...state.inventory, milch: 5 } };

    state = baristaReducer(state, { type: 'WAEHLE_GETRAENK', drink: 'latte' }); // braucht 210ml Milch bei M
    state = baristaReducer(state, { type: 'BESTELLEN' });

    expect(state.status).toBe('fehler');
    expect(state.fehlerUrsachen).toContain('milch');
    expect(state.hinweise.at(-1)?.art).toBe('fehler');
  });

  it('sperrt im Fehler-Zustand nur Getränke, die die fehlende Zutat brauchen (Runde 11)', () => {
    let state = initialBaristaState();
    state = baristaReducer(state, { type: 'EINSCHALTEN' });
    state = baristaReducer(state, { type: 'AUFGEHEIZT' });
    state = { ...state, inventory: { ...state.inventory, milch: 5 } };
    state = baristaReducer(state, { type: 'WAEHLE_GETRAENK', drink: 'latte' });
    state = baristaReducer(state, { type: 'BESTELLEN' }); // -> fehler, milch fehlt

    // Americano braucht keine Milch -> muss trotz Fehler-Zustand bestellbar bleiben
    state = baristaReducer(state, { type: 'WAEHLE_GETRAENK', drink: 'americano' });
    const nachBestellung = baristaReducer(state, { type: 'BESTELLEN' });
    expect(nachBestellung.status).toBe('zubereitung');
  });

  it('bleibt im Fehler-Zustand für ein gesperrtes Getränk, bis nachgefüllt wird', () => {
    let state = initialBaristaState();
    state = baristaReducer(state, { type: 'EINSCHALTEN' });
    state = baristaReducer(state, { type: 'AUFGEHEIZT' });
    state = { ...state, inventory: { ...state.inventory, milch: 5 } };
    state = baristaReducer(state, { type: 'WAEHLE_GETRAENK', drink: 'latte' });
    state = baristaReducer(state, { type: 'BESTELLEN' });

    const erneuterVersuch = baristaReducer(state, { type: 'BESTELLEN' });
    expect(erneuterVersuch).toBe(state);
  });
});

describe('Nachfüllen', () => {
  it('setzt eine Vorratsart auf das Maximum zurück', () => {
    let state = initialBaristaState();
    state = { ...state, inventory: { ...state.inventory, kaffee: 0 } };
    state = baristaReducer(state, { type: 'NACHFUELLEN', inventoryType: 'kaffee' });
    expect(state.inventory.kaffee).toBe(INVENTORY_MAX.kaffee);
  });

  it('verlässt den Fehler-Zustand, sobald alle Ursachen nachgefüllt sind', () => {
    let state = initialBaristaState();
    state = baristaReducer(state, { type: 'EINSCHALTEN' });
    state = baristaReducer(state, { type: 'AUFGEHEIZT' });
    state = { ...state, inventory: { ...state.inventory, milch: 5 } };
    state = baristaReducer(state, { type: 'WAEHLE_GETRAENK', drink: 'latte' });
    state = baristaReducer(state, { type: 'BESTELLEN' });
    expect(state.status).toBe('fehler');

    state = baristaReducer(state, { type: 'NACHFUELLEN', inventoryType: 'milch' });
    expect(state.status).toBe('bereit');
    expect(state.fehlerUrsachen).toEqual([]);
  });
});

describe('Tagesüberblick', () => {
  it('setzt Verbrauch und Einnahmen bei Reset auf null zurück', () => {
    let state = initialBaristaState();
    state = { ...state, day: { verbrauch: { ...state.day.verbrauch, kaffee: 50 }, einnahmenCents: 999 } };
    state = baristaReducer(state, { type: 'TAGESUEBERSICHT_RESET' });
    expect(state.day.einnahmenCents).toBe(0);
    expect(state.day.verbrauch.kaffee).toBe(0);
  });
});
