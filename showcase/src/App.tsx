import { StatusBar } from './components/StatusBar';
import { DrinkSelector } from './components/DrinkSelector';
import { InventoryPanel } from './components/InventoryPanel';
import { DayOverviewPanel } from './components/DayOverviewPanel';
import { HinweiseListe } from './components/HinweiseListe';
import { PowerButton } from './components/PowerButton';
import { useBaristaMachine } from './hooks/useBaristaMachine';
import './App.css';

function App() {
  const { state, dispatch } = useBaristaMachine();

  return (
    <div className="app">
      <StatusBar state={state} />
      <HinweiseListe state={state} dispatch={dispatch} />
      <main className="app__inhalt">
        <DrinkSelector state={state} dispatch={dispatch} />
        <div className="app__unten">
          <InventoryPanel state={state} dispatch={dispatch} />
          <div className="app__spalte">
            <DayOverviewPanel state={state} dispatch={dispatch} />
            <PowerButton state={state} dispatch={dispatch} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
