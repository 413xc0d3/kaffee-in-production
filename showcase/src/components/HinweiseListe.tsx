import type { BaristaAction, BaristaState } from '../logic/baristaReducer';
import './HinweiseListe.css';

interface Props {
  state: BaristaState;
  dispatch: React.Dispatch<BaristaAction>;
}

export function HinweiseListe({ state, dispatch }: Props) {
  if (state.hinweise.length === 0) return null;

  return (
    <ul className="hinweise-liste" aria-live="polite">
      {state.hinweise.map((h) => (
        <li key={h.id} className={`hinweise-liste__eintrag hinweise-liste__eintrag--${h.art}`}>
          <span>{h.text}</span>
          <button
            type="button"
            aria-label="Hinweis schließen"
            onClick={() => dispatch({ type: 'HINWEIS_ENTFERNEN', id: h.id })}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
