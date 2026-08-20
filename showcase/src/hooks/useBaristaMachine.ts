import { useEffect, useReducer } from 'react';
import { ZUBEREITUNG_DAUER_MS, ZUBEREITUNG_TICK_MS } from '../data/config';
import { baristaReducer, initialBaristaState } from '../logic/baristaReducer';

export function useBaristaMachine() {
  const [state, dispatch] = useReducer(baristaReducer, undefined, initialBaristaState);

  // Aus -> Aufheizen -> Bereit ohne künstliche Verzögerung (Runde 1.4).
  useEffect(() => {
    if (state.status !== 'aufheizen') return;
    const timer = setTimeout(() => dispatch({ type: 'AUFGEHEIZT' }), 0);
    return () => clearTimeout(timer);
  }, [state.status]);

  // Feste Zubereitungsdauer mit Fortschrittsanzeige (Runde 5.2).
  useEffect(() => {
    if (state.status !== 'zubereitung') return;
    const schritte = ZUBEREITUNG_DAUER_MS / ZUBEREITUNG_TICK_MS;
    let schritt = 0;
    const interval = setInterval(() => {
      schritt += 1;
      dispatch({ type: 'FORTSCHRITT', value: Math.round((schritt / schritte) * 100) });
      if (schritt >= schritte) {
        clearInterval(interval);
        dispatch({ type: 'ZUBEREITUNG_FERTIG' });
      }
    }, ZUBEREITUNG_TICK_MS);
    return () => clearInterval(interval);
  }, [state.status]);

  return { state, dispatch };
}
