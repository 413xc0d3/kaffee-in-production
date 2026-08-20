import { DRINKS, getDrink } from '../data/drinks';
import { EXTRA_LABEL, EXTRA_PRICE_CENTS } from '../data/config';
import { calculatePriceCents, formatCents } from '../logic/pricing';
import { istDrinkDurchFehlendenVorratGesperrt } from '../logic/recipe';
import type { BaristaAction, BaristaState } from '../logic/baristaReducer';
import type { ExtraType, Size } from '../types';
import { BESTELLUNG_GESPERRT_HINWEIS } from '../utils/statusMeta';
import { DrinkArt } from './DrinkArt';
import { ZubereitungsAnzeige } from './ZubereitungsAnzeige';
import sirupImg from '../assets/drinks/sirup.png';
import zuckerImg from '../assets/drinks/zucker.png';
import './DrinkSelector.css';

interface Props {
  state: BaristaState;
  dispatch: React.Dispatch<BaristaAction>;
}

const SIZES: Size[] = ['S', 'M', 'L'];
const EXTRAS: ExtraType[] = ['sirup', 'zucker'];
const EXTRA_IMAGE: Record<ExtraType, string> = {
  sirup: sirupImg,
  zucker: zuckerImg,
};

export function DrinkSelector({ state, dispatch }: Props) {
  const vollGesperrt = state.status !== 'bereit' && state.status !== 'fehler';
  const { drink: drinkId, size, extras } = state.selection;
  const drink = getDrink(drinkId);
  const drinkGesperrt =
    state.status === 'fehler' && istDrinkDurchFehlendenVorratGesperrt(drink, state.fehlerUrsachen);
  const gesperrt = vollGesperrt || drinkGesperrt;
  const previewCents = calculatePriceCents(drink, size, extras);

  return (
    <section className="drink-selector" aria-disabled={gesperrt}>
      <h2>Getränk wählen</h2>

      {gesperrt && (
        <p className="drink-selector__hinweis">{BESTELLUNG_GESPERRT_HINWEIS[state.status]}</p>
      )}

      <div className="drink-selector__grid">
        {DRINKS.map((d) => {
          const dGesperrt =
            vollGesperrt || (state.status === 'fehler' && istDrinkDurchFehlendenVorratGesperrt(d, state.fehlerUrsachen));
          return (
            <button
              key={d.id}
              type="button"
              disabled={dGesperrt}
              className={`drink-selector__drink${d.id === drinkId ? ' drink-selector__drink--aktiv' : ''}`}
              onClick={() => dispatch({ type: 'WAEHLE_GETRAENK', drink: d.id })}
            >
              {d.name}
            </button>
          );
        })}
      </div>

      <div className="drink-selector__mitte">
        <div className="drink-selector__optionen">
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
                <button
                  key={extra}
                  type="button"
                  disabled={gesperrt}
                  aria-pressed={extras.includes(extra)}
                  className={`drink-selector__extra${extras.includes(extra) ? ' drink-selector__extra--aktiv' : ''}`}
                  onClick={() => dispatch({ type: 'TOGGLE_EXTRA', extra })}
                >
                  <img className="drink-selector__extra-bild" src={EXTRA_IMAGE[extra]} alt="" aria-hidden="true" />
                  {EXTRA_LABEL[extra]}
                  <span className="drink-selector__extra-preis">+{formatCents(EXTRA_PRICE_CENTS)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="drink-selector__vorschau">
          <DrinkArt drinkId={drinkId} />
          <span className="drink-selector__vorschau-name">{drink.name}</span>
        </div>
      </div>

      <div className="drink-selector__fuss">
        <span className="drink-selector__preis">{formatCents(previewCents)}</span>
        <ZubereitungsAnzeige state={state} />
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
