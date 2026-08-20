import { DRINKS, getDrink } from '../data/drinks';
import { EXTRA_LABEL, INVENTORY_LABEL, INVENTORY_MAX } from '../data/config';
import { getScaledExtraAmount, getScaledRecipe, istDrinkDurchFehlendenVorratGesperrt } from './recipe';
import { calculatePriceCents } from './pricing';
import type {
  ActiveOrder,
  DayOverview,
  ExtraType,
  HinweisMessage,
  InventoryState,
  InventoryType,
  MachineStatus,
  OrderSelection,
  Size,
} from '../types';

export interface BaristaState {
  status: MachineStatus;
  inventory: InventoryState;
  day: DayOverview;
  selection: OrderSelection;
  progress: number;
  activeOrder: ActiveOrder | null;
  /** Vorratsarten, die den aktuellen Fehler-Zustand ausgelöst haben (Runde 4.1/4.2). */
  fehlerUrsachen: InventoryType[];
  /** Vorratsarten, die durch die laufende Zubereitung auf 0 fallen und beim Abschluss den Fehler-Zustand auslösen. */
  pendingFehlerUrsachen: InventoryType[];
  hinweise: HinweisMessage[];
  nextHinweisId: number;
}

export type BaristaAction =
  | { type: 'EINSCHALTEN' }
  | { type: 'AUFGEHEIZT' }
  | { type: 'AUSSCHALTEN' }
  | { type: 'WAEHLE_GETRAENK'; drink: OrderSelection['drink'] }
  | { type: 'WAEHLE_GROESSE'; size: Size }
  | { type: 'TOGGLE_EXTRA'; extra: ExtraType }
  | { type: 'BESTELLEN' }
  | { type: 'FORTSCHRITT'; value: number }
  | { type: 'ZUBEREITUNG_FERTIG' }
  | { type: 'NACHFUELLEN'; inventoryType: InventoryType }
  | { type: 'TAGESUEBERSICHT_RESET' }
  | { type: 'HINWEIS_ENTFERNEN'; id: number };

const INVENTORY_TYPES: InventoryType[] = ['wasser', 'kaffee', 'milch', 'sirup', 'zucker'];

function leererVerbrauch(): Record<InventoryType, number> {
  return { wasser: 0, kaffee: 0, milch: 0, sirup: 0, zucker: 0 };
}

/** Startvorrat: Maschine startet mit vollen Behältern (Annahme, siehe GRENZFAELLE_UND_TESTIDEEN.md). */
export function initialBaristaState(): BaristaState {
  return {
    status: 'aus',
    inventory: { ...INVENTORY_MAX },
    day: { verbrauch: leererVerbrauch(), einnahmenCents: 0 },
    selection: { drink: DRINKS[0].id, size: 'M', extras: [] },
    progress: 0,
    activeOrder: null,
    fehlerUrsachen: [],
    pendingFehlerUrsachen: [],
    hinweise: [],
    nextHinweisId: 1,
  };
}

function mitHinweis(
  state: BaristaState,
  text: string,
  art: HinweisMessage['art'],
): Pick<BaristaState, 'hinweise' | 'nextHinweisId'> {
  return {
    hinweise: [...state.hinweise, { id: state.nextHinweisId, text, art }],
    nextHinweisId: state.nextHinweisId + 1,
  };
}

export function baristaReducer(state: BaristaState, action: BaristaAction): BaristaState {
  switch (action.type) {
    case 'EINSCHALTEN': {
      if (state.status !== 'aus') return state;
      return { ...state, status: 'aufheizen' };
    }

    case 'AUFGEHEIZT': {
      if (state.status !== 'aufheizen') return state;
      return { ...state, status: 'bereit' };
    }

    case 'AUSSCHALTEN': {
      if (state.status !== 'bereit' && state.status !== 'fehler') return state;
      return { ...state, status: 'aus', fehlerUrsachen: [] };
    }

    case 'WAEHLE_GETRAENK': {
      if (state.status !== 'bereit' && state.status !== 'fehler') return state;
      return { ...state, selection: { ...state.selection, drink: action.drink } };
    }

    case 'WAEHLE_GROESSE': {
      if (state.status !== 'bereit' && state.status !== 'fehler') return state;
      return { ...state, selection: { ...state.selection, size: action.size } };
    }

    case 'TOGGLE_EXTRA': {
      if (state.status !== 'bereit' && state.status !== 'fehler') return state;
      const extras = state.selection.extras.includes(action.extra)
        ? state.selection.extras.filter((e) => e !== action.extra)
        : [...state.selection.extras, action.extra];
      return { ...state, selection: { ...state.selection, extras } };
    }

    case 'BESTELLEN': {
      if (state.status !== 'bereit' && state.status !== 'fehler') return state;

      const drink = getDrink(state.selection.drink);
      const size = state.selection.size;
      const scaled = getScaledRecipe(drink, size);

      if (state.status === 'fehler' && istDrinkDurchFehlendenVorratGesperrt(drink, state.fehlerUrsachen)) {
        return state;
      }

      const basiszutaten: (keyof typeof scaled)[] = ['wasser', 'kaffee', 'milch'];
      const fehlendeZutaten = basiszutaten.filter((typ) => state.inventory[typ] < scaled[typ]);

      if (fehlendeZutaten.length > 0) {
        const text = `Bestellung fehlgeschlagen: nicht genug ${fehlendeZutaten
          .map((t) => INVENTORY_LABEL[t])
          .join(', ')} für ${drink.name} (${size}).`;
        return {
          ...state,
          status: 'fehler',
          fehlerUrsachen: Array.from(new Set([...state.fehlerUrsachen, ...fehlendeZutaten])),
          ...mitHinweis(state, text, 'fehler'),
        };
      }

      const appliedExtras: ExtraType[] = [];
      const extraMengen: Partial<Record<ExtraType, number>> = {};
      let hinweise = state.hinweise;
      let nextHinweisId = state.nextHinweisId;

      for (const extra of state.selection.extras) {
        const menge = getScaledExtraAmount(extra, size);
        if (state.inventory[extra] >= menge) {
          appliedExtras.push(extra);
          extraMengen[extra] = menge;
        } else {
          hinweise = [
            ...hinweise,
            {
              id: nextHinweisId,
              text: `${EXTRA_LABEL[extra]} aktuell nicht verfügbar, ${drink.name} wird ohne ${EXTRA_LABEL[extra]} zubereitet.`,
              art: 'info',
            },
          ];
          nextHinweisId += 1;
        }
      }

      const newInventory: InventoryState = { ...state.inventory };
      newInventory.wasser -= scaled.wasser;
      newInventory.kaffee -= scaled.kaffee;
      newInventory.milch -= scaled.milch;
      for (const extra of appliedExtras) {
        newInventory[extra] -= extraMengen[extra]!;
      }

      const newVerbrauch = { ...state.day.verbrauch };
      newVerbrauch.wasser += scaled.wasser;
      newVerbrauch.kaffee += scaled.kaffee;
      newVerbrauch.milch += scaled.milch;
      for (const extra of appliedExtras) {
        newVerbrauch[extra] += extraMengen[extra]!;
      }

      const priceCents = calculatePriceCents(drink, size, appliedExtras);
      const pendingFehlerUrsachen = INVENTORY_TYPES.filter((t) => newInventory[t] === 0);

      return {
        ...state,
        status: 'zubereitung',
        progress: 0,
        activeOrder: { drink: drink.id, size, extrasApplied: appliedExtras },
        inventory: newInventory,
        day: { verbrauch: newVerbrauch, einnahmenCents: state.day.einnahmenCents + priceCents },
        pendingFehlerUrsachen,
        hinweise,
        nextHinweisId,
      };
    }

    case 'FORTSCHRITT': {
      if (state.status !== 'zubereitung') return state;
      return { ...state, progress: Math.min(100, action.value) };
    }

    case 'ZUBEREITUNG_FERTIG': {
      if (state.status !== 'zubereitung') return state;
      // Bereits bekannte Fehlerursachen (z. B. aus einer vorherigen fehlgeschlagenen Bestellung eines
      // anderen Getränks) bleiben bestehen, bis explizit nachgefüllt wird (Runde 4.2) – ein dazwischen
      // erfolgreich zubereitetes, nicht betroffenes Getränk darf sie nicht stillschweigend löschen.
      const alleUrsachen = Array.from(new Set([...state.fehlerUrsachen, ...state.pendingFehlerUrsachen]));
      if (alleUrsachen.length > 0) {
        const neueUrsachen = state.pendingFehlerUrsachen.filter((t) => !state.fehlerUrsachen.includes(t));
        const hinweisUpdate =
          neueUrsachen.length > 0
            ? mitHinweis(
                state,
                `Vorrat an ${neueUrsachen.map((t) => INVENTORY_LABEL[t]).join(', ')} aufgebraucht.`,
                'fehler',
              )
            : { hinweise: state.hinweise, nextHinweisId: state.nextHinweisId };
        return {
          ...state,
          status: 'fehler',
          progress: 0,
          activeOrder: null,
          fehlerUrsachen: alleUrsachen,
          pendingFehlerUrsachen: [],
          ...hinweisUpdate,
        };
      }
      return { ...state, status: 'bereit', progress: 0, activeOrder: null, fehlerUrsachen: [] };
    }

    case 'NACHFUELLEN': {
      if (state.status === 'zubereitung') return state;
      const typ = action.inventoryType;
      const newInventory = { ...state.inventory, [typ]: INVENTORY_MAX[typ] };

      if (state.status === 'fehler') {
        const stillCause = state.fehlerUrsachen.filter((t) => newInventory[t] < INVENTORY_MAX[t]);
        if (stillCause.length === 0) {
          return { ...state, inventory: newInventory, status: 'bereit', fehlerUrsachen: [] };
        }
        return { ...state, inventory: newInventory, fehlerUrsachen: stillCause };
      }

      return { ...state, inventory: newInventory };
    }

    case 'TAGESUEBERSICHT_RESET': {
      return { ...state, day: { verbrauch: leererVerbrauch(), einnahmenCents: 0 } };
    }

    case 'HINWEIS_ENTFERNEN': {
      return { ...state, hinweise: state.hinweise.filter((h) => h.id !== action.id) };
    }

    default:
      return state;
  }
}
