import { DRINKS, getDrink } from '../data/drinks';
import { EXTRA_LABEL } from '../data/config';
import { calculatePriceCents, formatCents } from '../logic/pricing';
import type { BaristaAction, BaristaState } from '../logic/baristaReducer';
import type { ExtraType, Size } from '../types';
import { BESTELLUNG_GESPERRT_HINWEIS } from '../utils/statusMeta';
import './DrinkSelector.css';

interface Props {
  state: BaristaState;
  dispatch: React.Dispatch<BaristaAction>;
}

const SIZES: Size[] = ['S', 'M', 'L'];
const EXTRAS: ExtraType[] = ['sirup', 'zucker'];

export function DrinkSelector({ state, dispatch }: Props) {
  const gesperrt = state.status !== 'bereit';
  const { drink: drinkId, size, extras } = state.selection;
  const drink = getDrink(drinkId);
  const previewCents = calculatePriceCents(drink, size, extras);

  return (
    <section className="drink-selector" aria-disabled={gesperrt}>
      <h2>Getränk wählen</h2>

      {gesperrt && (
        <p className="drink-selector__hinweis">{BESTELLUNG_GESPERRT_HINWEIS[state.status]}</p>
      )}

      <div className="drink-selector__grid">
        {DRINKS.map((d) => (
          <button
            key={d.id}
            type="button"
            disabled={gesperrt}
            className={`drink-selector__drink${d.id === drinkId ? ' drink-selector__drink--aktiv' : ''}`}
            onClick={() => dispatch({ type: 'WAEHLE_GETRAENK', drink: d.id })}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="drink-selector__reihe">
        <span className="drink-selector__label">Größe</span>
        <div className="drink-selector__groessen">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={gesperrt}
              className={`drink-selector__groesse${s === size ? ' drink-selector__groesse--aktiv' : ''}`}
              onClick={() => dispatch({ type: 'WAEHLE_GROESSE', size: s })}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="drink-selector__reihe">
        <span className="drink-selector__label">Extras</span>
        <div className="drink-selector__extras">
          {EXTRAS.map((extra) => (
            <label key={extra} className="drink-selector__extra">
              <input
                type="checkbox"
                disabled={gesperrt}
                checked={extras.includes(extra)}
                onChange={() => dispatch({ type: 'TOGGLE_EXTRA', extra })}
              />
              {EXTRA_LABEL[extra]}
            </label>
          ))}
        </div>
      </div>

      <div className="drink-selector__fuss">
        <span className="drink-selector__preis">{formatCents(previewCents)}</span>
        <button
          type="button"
          className="drink-selector__bestellen"
          disabled={gesperrt}
          onClick={() => dispatch({ type: 'BESTELLEN' })}
        >
          Bestellen
        </button>
      </div>
    </section>
  );
}
