import { INVENTORY_LABEL, INVENTORY_MAX, INVENTORY_UNIT, WARN_RATIO } from '../data/config';
import type { BaristaAction, BaristaState } from '../logic/baristaReducer';
import type { InventoryType } from '../types';
import wasserImg from '../assets/drinks/wasser.png';
import kaffeeImg from '../assets/drinks/kaffee.png';
import milchImg from '../assets/drinks/milch.png';
import zuckerImg from '../assets/drinks/zucker.png';
import sirupImg from '../assets/drinks/sirup.png';
import './InventoryPanel.css';

const INVENTORY_ICON: Partial<Record<InventoryType, string>> = {
  wasser: wasserImg,
  kaffee: kaffeeImg,
  milch: milchImg,
  zucker: zuckerImg,
  sirup: sirupImg,
};

interface Props {
  state: BaristaState;
  dispatch: React.Dispatch<BaristaAction>;
}

const TYPES: InventoryType[] = ['wasser', 'kaffee', 'milch', 'sirup', 'zucker'];

export function InventoryPanel({ state, dispatch }: Props) {
  const nachfuellenGesperrt = state.status === 'zubereitung';

  return (
    <section className="inventory-panel">
      <h2>Vorrat</h2>
      <ul className="inventory-panel__liste">
        {TYPES.map((typ) => {
          const max = INVENTORY_MAX[typ];
          const wert = state.inventory[typ];
          const anteil = wert / max;
          const niedrig = anteil <= WARN_RATIO;
          const leer = wert === 0;
          return (
            <li key={typ} className="inventory-panel__eintrag">
              <div className="inventory-panel__kopf">
                <span className="inventory-panel__label">
                  {INVENTORY_ICON[typ] && (
                    <img className="inventory-panel__icon" src={INVENTORY_ICON[typ]} alt="" aria-hidden="true" />
                  )}
                  {INVENTORY_LABEL[typ]}
                </span>
                <span className={leer ? 'inventory-panel__wert--leer' : niedrig ? 'inventory-panel__wert--niedrig' : ''}>
                  {wert} / {max} {INVENTORY_UNIT[typ]}
                </span>
              </div>
              <div className="inventory-panel__balken">
                <div
                  className={`inventory-panel__fuellstand${leer ? ' inventory-panel__fuellstand--leer' : niedrig ? ' inventory-panel__fuellstand--niedrig' : ''}`}
                  style={{ width: `${Math.max(0, anteil * 100)}%` }}
                />
              </div>
              <button
                type="button"
                disabled={nachfuellenGesperrt || wert === max}
                onClick={() => dispatch({ type: 'NACHFUELLEN', inventoryType: typ })}
              >
                Nachfüllen
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
