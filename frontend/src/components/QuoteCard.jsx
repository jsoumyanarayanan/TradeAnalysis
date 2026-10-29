import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function QuoteCard({ title, quote, dataStatus }) {
  if (!quote) {
    return (
      <div className="bg-trading-card border border-trading-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-trading-text mb-4">{title}</h3>
        <div className="text-trading-textMuted">No data available</div>
      </div>
    );
  }

  const isPositive = (quote.percentage_change || 0) > 0;
  const isNegative = (quote.percentage_change || 0) < 0;
  const changeColor = isPositive ? 'text-trading-green' : isNegative ? 'text-trading-red' : 'text-trading-text';
  const ChangeIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
  const bgColor = isPositive ? 'bg-trading-greenBg' : isNegative ? 'bg-trading-redBg' : 'bg-trading-card';

  return (
    <div className={`bg-trading-card border border-trading-border rounded-lg p-6 ${bgColor}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-trading-text">{title}</h3>
        <span className="text-xs px-2 py-1 rounded bg-trading-border text-trading-textMuted">
          {quote.data_status}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-3xl font-mono font-bold text-trading-text">
            {quote.last_price.toFixed(2)}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <ChangeIcon size={16} className={changeColor} />
            <span className={`font-mono ${changeColor}`}>
              {quote.absolute_change?.toFixed(2) || 0} ({quote.percentage_change?.toFixed(2) || 0}%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-trading-border">
          <div>
            <div className="text-xs text-trading-textMuted">High</div>
            <div className="font-mono text-sm text-trading-text">
              {quote.session_high?.toFixed(2) || '-'}
            </div>
          </div>
          <div>
            <div className="text-xs text-trading-textMuted">Low</div>
            <div className="font-mono text-sm text-trading-text">
              {quote.session_low?.toFixed(2) || '-'}
            </div>
          </div>
          <div>
            <div className="text-xs text-trading-textMuted">Open</div>
            <div className="font-mono text-sm text-trading-text">
              {quote.session_open?.toFixed(2) || '-'}
            </div>
          </div>
          <div>
            <div className="text-xs text-trading-textMuted">Volume</div>
            <div className="font-mono text-sm text-trading-text">
              {quote.volume ? (quote.volume / 1000000).toFixed(2) + 'M' : '-'}
            </div>
          </div>
        </div>

        <div className="text-xs text-trading-textMuted pt-2">
          {new Date(quote.provider_timestamp).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}

export default QuoteCard;
