import { useState, useEffect } from 'react';
import { getQuote, getCandles } from '../services/api';
import QuoteCard from '../components/QuoteCard';
import CandleChart from '../components/CandleChart';

function GiftNiftyMonitor() {
  const [quote, setQuote] = useState(null);
  const [candles, setCandles] = useState([]);
  const [timeframe, setTimeframe] = useState('15min');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [timeframe]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [quoteData, candlesData] = await Promise.all([
        getQuote('GIFTNIFTY'),
        getCandles('GIFTNIFTY', timeframe, 100),
      ]);
      setQuote(quoteData);
      setCandles(candlesData.candles);
    } catch (error) {
      console.error('Error loading GIFT Nifty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeframes = ['1min', '5min', '15min', '1hour', '1day'];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-trading-text">GIFT Nifty Monitor</h2>
        <p className="text-sm text-trading-textMuted mt-1">
          Real-time GIFT Nifty futures tracking
        </p>
      </div>

      {/* Quote Card */}
      <QuoteCard
        title="GIFT Nifty Futures"
        quote={quote}
        dataStatus={quote?.data_status}
      />

      {/* Timeframe Selector */}
      <div className="flex gap-2">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeframe === tf
                ? 'bg-trading-accent text-white'
                : 'bg-trading-card border border-trading-border text-trading-text hover:bg-trading-border'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-trading-card border border-trading-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-trading-text mb-4">Price Chart</h3>
        {loading ? (
          <div className="text-trading-textMuted">Loading chart...</div>
        ) : (
          <CandleChart data={candles} />
        )}
      </div>
    </div>
  );
}

export default GiftNiftyMonitor;
