import type { BaristaAction, BaristaState } from '../logic/baristaReducer';
import { STATUS_LABEL } from '../utils/statusMeta';
import './StatusBar.css';

interface Props {
  state: BaristaState;
  dispatch: React.Dispatch<BaristaAction>;
}

export function StatusBar({ state, dispatch }: Props) {
  const kannEinschalten = state.status === 'aus';
  const kannAusschalten = state.status === 'bereit' || state.status === 'fehler';

  return (
    <header className="status-bar">
      <div className="status-bar__titel">
        <span className="status-bar__symbol" aria-hidden="true">
          ☕
        </span>
        <h1>Barista-Automat</h1>
      </div>
      <div className="status-bar__rechts">
        <span className={`status-bar__badge status-bar__badge--${state.status}`}>
          {STATUS_LABEL[state.status]}
        </span>
        <button
          type="button"
          className="status-bar__power"
          disabled={!kannEinschalten && !kannAusschalten}
          onClick={() => dispatch({ type: kannEinschalten ? 'EINSCHALTEN' : 'AUSSCHALTEN' })}
          aria-label={kannEinschalten ? 'Maschine einschalten' : 'Maschine ausschalten'}
        >
          {kannEinschalten ? 'Einschalten' : 'Ausschalten'}
        </button>
      </div>
    </header>
  );
}
