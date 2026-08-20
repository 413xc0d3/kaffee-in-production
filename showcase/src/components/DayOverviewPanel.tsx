import { INVENTORY_LABEL, INVENTORY_UNIT } from '../data/config';
import { formatCents } from '../logic/pricing';
import type { BaristaAction, BaristaState } from '../logic/baristaReducer';
import type { InventoryType } from '../types';
import './DayOverviewPanel.css';

interface Props {
  state: BaristaState;
  dispatch: React.Dispatch<BaristaAction>;
}

const TYPES: InventoryType[] = ['wasser', 'kaffee', 'milch', 'sirup', 'zucker'];

export function DayOverviewPanel({ state, dispatch }: Props) {
  return (
    <section className="day-overview">
      <div className="day-overview__kopf">
        <h2>Tagesüberblick</h2>
        <button type="button" onClick={() => dispatch({ type: 'TAGESUEBERSICHT_RESET' })}>
          Zurücksetzen
        </button>
      </div>
      <dl className="day-overview__verbrauch">
        {TYPES.map((typ) => (
          <div key={typ} className="day-overview__zeile">
            <dt>{INVENTORY_LABEL[typ]}</dt>
            <dd>
              {state.day.verbrauch[typ]} {INVENTORY_UNIT[typ]}
            </dd>
          </div>
        ))}
      </dl>
      <p className="day-overview__einnahmen">
        Einnahmen: <strong>{formatCents(state.day.einnahmenCents)}</strong>
      </p>
    </section>
  );
}
