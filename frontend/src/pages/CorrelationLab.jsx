import { useState } from 'react';
import { getCorrelation, getGiftNiftyNSECorrelation, getLeadLagAnalysis } from '../services/api';

function CorrelationLab() {
  const [symbolA, setSymbolA] = useState('GIFTNIFTY');
  const [symbolB, setSymbolB] = useState('NIFTY50');
  const [lookback, setLookback] = useState(60);
  const [returnType, setReturnType] = useState('opening_gap');
  const [correlation, setCorrelation] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeCorrelation = async () => {
    try {
      setLoading(true);
      if (symbolA === 'GIFTNIFTY' && symbolB === 'NIFTY50') {
        const data = await getGiftNiftyNSECorrelation(lookback, returnType);
        setCorrelation(data);
      } else {
        const data = await getCorrelation(symbolA, symbolB, lookback, returnType);
        setCorrelation(data);
      }
    } catch (error) {
      console.error('Error analyzing correlation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-trading-text">Correlation Lab</h2>
        <p className="text-sm text-trading-textMuted mt-1">
          Analyze relationships between GIFT Nifty and NSE instruments
        </p>
      </div>

      {/* Controls */}
      <div className="bg-trading-card border border-trading-border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-trading-textMuted block mb-1">Symbol A</label>
            <input
              type="text"
              value={symbolA}
              onChange={(e) => setSymbolA(e.target.value.toUpperCase())}
              className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2 text-sm text-trading-text"
              placeholder="e.g., GIFTNIFTY"
            />
          </div>
          <div>
            <label className="text-xs text-trading-textMuted block mb-1">Symbol B</label>
            <input
              type="text"
              value={symbolB}
              onChange={(e) => setSymbolB(e.target.value.toUpperCase())}
              className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2 text-sm text-trading-text"
              placeholder="e.g., NIFTY50"
            />
          </div>
          <div>
            <label className="text-xs text-trading-textMuted block mb-1">Lookback Period</label>
            <input
              type="number"
              value={lookback}
              onChange={(e) => setLookback(parseInt(e.target.value))}
              className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2 text-sm text-trading-text"
            />
          </div>
          <div>
            <label className="text-xs text-trading-textMuted block mb-1">Return Type</label>
            <select
              value={returnType}
              onChange={(e) => setReturnType(e.target.value)}
              className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2 text-sm text-trading-text"
            >
              <option value="opening_gap">Opening Gap</option>
              <option value="intraday_15min">Intraday 15min</option>
              <option value="intraday_30min">Intraday 30min</option>
              <option value="intraday_60min">Intraday 60min</option>
              <option value="full_session">Full Session</option>
            </select>
          </div>
        </div>
        <button
          onClick={analyzeCorrelation}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-trading-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Analyzing...' : 'Analyze Correlation'}
        </button>
      </div>

      {/* Results */}
      {correlation && (
        <div className="bg-trading-card border border-trading-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-trading-text mb-4">Correlation Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-trading-textMuted">Pearson Correlation</div>
              <div className="text-3xl font-mono font-bold text-trading-accent mt-1">
                {correlation.pearson_correlation?.toFixed(4) || correlation.correlation?.toFixed(4) || 'N/A'}
              </div>
            </div>
            {correlation.spearman_correlation && (
              <div>
                <div className="text-sm text-trading-textMuted">Spearman Correlation</div>
                <div className="text-3xl font-mono font-bold text-trading-accent mt-1">
                  {correlation.spearman_correlation.toFixed(4)}
                </div>
              </div>
            )}
            <div>
              <div className="text-sm text-trading-textMuted">Sample Size</div>
              <div className="text-3xl font-mono font-bold text-trading-text mt-1">
                {correlation.sample_size}
              </div>
            </div>
            <div>
              <div className="text-sm text-trading-textMuted">Status</div>
              <div className="text-xl font-semibold text-trading-text mt-1">
                {correlation.status}
              </div>
            </div>
          </div>
        </div>
      )}

      {!correlation && !loading && (
        <div className="bg-trading-card border border-trading-border rounded-lg p-12 text-center">
          <div className="text-trading-textMuted">
            Select instruments and click "Analyze Correlation" to view results
          </div>
        </div>
      )}
    </div>
  );
}

export default CorrelationLab;
