import type { BaristaAction, BaristaState } from '../logic/baristaReducer';
import { STATUS_LABEL } from '../utils/statusMeta';
import logoImg from '../assets/barista-automat-logo.png';
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
      <div className="status-bar__hero">
        <h1>
          <img className="status-bar__logo" src={logoImg} alt="Barista-Automat" />
        </h1>
      </div>
      <div className="status-bar__controls">
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
