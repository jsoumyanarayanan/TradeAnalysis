import { useState } from 'react';
import { getBacktestHistory, runBacktest } from '../services/api';

function Backtester() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    strategy_name: 'gap_continuation',
    instrument: 'NIFTY50',
    date_start: '',
    date_end: '',
  });

  const loadHistory = async () => {
    try {
      const data = await getBacktestHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error loading backtest history:', error);
    }
  };

  const runBacktestStrategy = async () => {
    try {
      setLoading(true);
      await runBacktest(
        config.strategy_name,
        config.instrument,
        config.date_start,
        config.date_end
      );
      await loadHistory();
    } catch (error) {
      console.error('Error running backtest:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-trading-text">Backtester</h2>
        <p className="text-sm text-trading-textMuted mt-1">
          Test trading strategies on historical data
        </p>
      </div>

      {/* Backtest Configuration */}
      <div className="bg-trading-card border border-trading-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-trading-text mb-4">New Backtest</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-trading-textMuted block mb-1">Strategy</label>
            <select
              value={config.strategy_name}
              onChange={(e) => setConfig({ ...config, strategy_name: e.target.value })}
              className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2 text-sm text-trading-text"
            >
              <option value="gap_continuation">Gap Continuation</option>
              <option value="gap_reversal">Gap Reversal</option>
              <option value="vwap_reclaim">VWAP Reclaim</option>
              <option value="momentum">Momentum</option>
              <option value="mean_reversion">Mean Reversion</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-trading-textMuted block mb-1">Instrument</label>
            <input
              type="text"
              value={config.instrument}
              onChange={(e) => setConfig({ ...config, instrument: e.target.value.toUpperCase() })}
              className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2 text-sm text-trading-text"
              placeholder="e.g., NIFTY50"
            />
          </div>
          <div>
            <label className="text-xs text-trading-textMuted block mb-1">Start Date</label>
            <input
              type="date"
              value={config.date_start}
              onChange={(e) => setConfig({ ...config, date_start: e.target.value })}
              className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2 text-sm text-trading-text"
            />
          </div>
          <div>
            <label className="text-xs text-trading-textMuted block mb-1">End Date</label>
            <input
              type="date"
              value={config.date_end}
              onChange={(e) => setConfig({ ...config, date_end: e.target.value })}
              className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2 text-sm text-trading-text"
            />
          </div>
        </div>
        <button
          onClick={runBacktestStrategy}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-trading-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Running...' : 'Run Backtest'}
        </button>
      </div>

      {/* Backtest History */}
      <div className="bg-trading-card border border-trading-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-trading-text mb-4">Backtest History</h3>
        {history.length === 0 ? (
          <div className="text-trading-textMuted text-center py-8">
            No backtest runs yet. Configure and run a backtest above.
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((run) => (
              <div
                key={run.id}
                className="p-4 bg-trading-bg border border-trading-border rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-trading-text">{run.strategy_name}</div>
                    <div className="text-sm text-trading-textMuted">
                      {run.date_range_start} to {run.date_range_end}
                    </div>
                  </div>
                  <div className="text-sm text-trading-textMuted">
                    {new Date(run.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Backtester;
