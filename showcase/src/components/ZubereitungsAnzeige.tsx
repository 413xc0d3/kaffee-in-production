import { getDrink } from '../data/drinks';
import type { BaristaState } from '../logic/baristaReducer';
import './ZubereitungsAnzeige.css';

interface Props {
  state: BaristaState;
}

export function ZubereitungsAnzeige({ state }: Props) {
  if (state.status !== 'zubereitung' || !state.activeOrder) return null;

  const drink = getDrink(state.activeOrder.drink);

  return (
    <div className="zubereitung" role="status">
      <p className="zubereitung__text">
        Bereite {drink.name} ({state.activeOrder.size}) zu …
      </p>
      <div className="zubereitung__balken" role="progressbar" aria-valuenow={state.progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="zubereitung__fortschritt" style={{ width: `${state.progress}%` }} />
      </div>
      <span className="zubereitung__prozent">{state.progress}%</span>
    </div>
  );
}
