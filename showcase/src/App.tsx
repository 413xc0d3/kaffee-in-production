import { StatusBar } from './components/StatusBar';
import { DrinkSelector } from './components/DrinkSelector';
import { ZubereitungsAnzeige } from './components/ZubereitungsAnzeige';
import { InventoryPanel } from './components/InventoryPanel';
import { DayOverviewPanel } from './components/DayOverviewPanel';
import { HinweiseListe } from './components/HinweiseListe';
import { useBaristaMachine } from './hooks/useBaristaMachine';
import './App.css';

function App() {
  const { state, dispatch } = useBaristaMachine();

  return (
    <div className="app">
      <StatusBar state={state} dispatch={dispatch} />
      <HinweiseListe state={state} dispatch={dispatch} />
      <main className="app__inhalt">
        <div className="app__spalte">
          <DrinkSelector state={state} dispatch={dispatch} />
          <ZubereitungsAnzeige state={state} />
        </div>
        <div className="app__spalte">
          <InventoryPanel state={state} dispatch={dispatch} />
          <DayOverviewPanel state={state} dispatch={dispatch} />
        </div>
      </main>
    </div>
  );
}

export default App;
