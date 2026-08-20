import type { BaristaState } from '../logic/baristaReducer';
import { STATUS_LABEL } from '../utils/statusMeta';
import logoImg from '../assets/barista-automat-logo.png';
import './StatusBar.css';

interface Props {
  state: BaristaState;
}

export function StatusBar({ state }: Props) {
  return (
    <header className="status-bar">
      <div className="status-bar__hero">
        <h1>
          <img className="status-bar__logo" src={logoImg} alt="Barista-Automat" />
        </h1>
      </div>
      <span className={`status-bar__badge status-bar__badge--${state.status}`}>
        {STATUS_LABEL[state.status]}
      </span>
    </header>
  );
}
