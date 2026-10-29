import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import GiftNiftyMonitor from './pages/GiftNiftyMonitor'
import StockScanner from './pages/StockScanner'
import CorrelationLab from './pages/CorrelationLab'
import Backtester from './pages/Backtester'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/gift-nifty" element={<GiftNiftyMonitor />} />
          <Route path="/scanner" element={<StockScanner />} />
          <Route path="/correlation" element={<CorrelationLab />} />
          <Route path="/backtest" element={<Backtester />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
