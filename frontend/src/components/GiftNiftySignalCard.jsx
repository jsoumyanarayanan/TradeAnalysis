import { AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

function GiftNiftySignalCard({ signal }) {
  if (!signal) {
    return (
      <div className="bg-trading-card border border-trading-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-trading-text mb-4">
          GIFT Nifty Pre-Market Signal
        </h3>
        <div className="text-trading-textMuted">No signal data available</div>
      </div>
    );
  }

  const isPositiveGap = signal.estimated_nse_gap_pct > 0;
  const isNegativeGap = signal.estimated_nse_gap_pct < 0;
  const gapColor = isPositiveGap ? 'text-trading-green' : isNegativeGap ? 'text-trading-red' : 'text-trading-text';
  const GapIcon = isPositiveGap ? TrendingUp : isNegativeGap ? TrendingDown : Minus;

  return (
    <div className="bg-trading-card border border-trading-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-trading-text">
          GIFT Nifty Pre-Market Signal
        </h3>
        <div className="flex items-center gap-2">
          {signal.data_freshness === 'GOOD' ? (
            <span className="text-xs px-2 py-1 rounded bg-trading-greenBg text-trading-green">
              Fresh Data
            </span>
          ) : (
            <span className="text-xs px-2 py-1 rounded bg-yellow-900/30 text-yellow-500 flex items-center gap-1">
              <AlertCircle size={12} />
              {signal.data_freshness}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* GIFT Nifty Movement */}
        <div className="space-y-2">
          <div className="text-xs text-trading-textMuted">GIFT Nifty Price</div>
          <div className="text-2xl font-mono font-bold text-trading-text">
            {signal.gift_nifty_price.toFixed(2)}
          </div>
          <div className={`font-mono text-sm ${gapColor}`}>
            {signal.gift_nifty_change_pct.toFixed(2)}%
          </div>
        </div>

        {/* Estimated NSE Gap */}
        <div className="space-y-2">
          <div className="text-xs text-trading-textMuted">Estimated NSE Gap</div>
          <div className="flex items-center gap-2">
            <GapIcon size={20} className={gapColor} />
            <div className={`text-2xl font-mono font-bold ${gapColor}`}>
              {signal.estimated_nse_gap_pct.toFixed(2)}%
            </div>
          </div>
          <div className="text-xs text-trading-textMuted">
            Previous Close: {signal.previous_nse_close.toFixed(2)}
          </div>
        </div>

        {/* Historical Correlation */}
        <div className="space-y-2">
          <div className="text-xs text-trading-textMuted">Historical Correlation</div>
          <div className="text-2xl font-mono font-bold text-trading-accent">
            {signal.historical_correlation?.toFixed(3) || 'N/A'}
          </div>
          <div className="text-xs text-trading-textMuted">
            Forecast Error (MAE): {signal.forecast_error_mae?.toFixed(3) || 'N/A'}
          </div>
        </div>

        {/* Model Confidence */}
        <div className="space-y-2">
          <div className="text-xs text-trading-textMuted">Model Confidence</div>
          <div className="text-2xl font-mono font-bold text-trading-text">
            {signal.model_confidence}%
          </div>
          <div className="w-full bg-trading-border rounded-full h-2 mt-2">
            <div
              className="bg-trading-accent h-2 rounded-full transition-all"
              style={{ width: `${signal.model_confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 pt-4 border-t border-trading-border">
        <div className="text-xs text-trading-textMuted flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <div>
            This is an analytical estimate based on historical correlation. Actual NSE opening
            may differ significantly. GIFT Nifty futures prices are not directly comparable to
            NSE cash index prices due to fair value and basis differences.
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiftNiftySignalCard;
