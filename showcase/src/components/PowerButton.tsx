import type { BaristaAction, BaristaState } from '../logic/baristaReducer';
import './PowerButton.css';

interface Props {
  state: BaristaState;
  dispatch: React.Dispatch<BaristaAction>;
}

export function PowerButton({ state, dispatch }: Props) {
  const kannEinschalten = state.status === 'aus';
  const kannAusschalten = state.status === 'bereit' || state.status === 'fehler';

  return (
    <button
      type="button"
      className="power-button"
      disabled={!kannEinschalten && !kannAusschalten}
      onClick={() => dispatch({ type: kannEinschalten ? 'EINSCHALTEN' : 'AUSSCHALTEN' })}
      aria-label={kannEinschalten ? 'Maschine einschalten' : 'Maschine ausschalten'}
    >
      {kannEinschalten ? 'Einschalten' : 'Ausschalten'}
    </button>
  );
}
