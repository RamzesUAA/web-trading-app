import './App.css';
import OrderBook from './pages/OrderBook';
import MarketDepthChart from './pages/MarketDepthChart';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MarketDepthChart />
      </header>
    </div>
  );
}

export default App;
