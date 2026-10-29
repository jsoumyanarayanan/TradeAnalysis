import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function SectorSummary({ sectors }) {
  if (sectors.length === 0) {
    return (
      <div className="text-trading-textMuted">No sector data available</div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {sectors.map((sector) => {
        const isPositive = sector.change_pct > 0;
        const isNegative = sector.change_pct < 0;
        const changeColor = isPositive ? 'text-trading-green' : isNegative ? 'text-trading-red' : 'text-trading-text';
        const ChangeIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
        const bgColor = isPositive ? 'bg-trading-greenBg' : isNegative ? 'bg-trading-redBg' : 'bg-trading-card';

        return (
          <div key={sector.sector} className={`p-4 rounded-lg border border-trading-border ${bgColor}`}>
            <div className="text-sm text-trading-textMuted mb-2">{sector.sector}</div>
            <div className="flex items-center gap-2">
              <ChangeIcon size={16} className={changeColor} />
              <span className={`font-mono font-semibold ${changeColor}`}>
                {sector.change_pct.toFixed(2)}%
              </span>
            </div>
            <div className="text-xs text-trading-textMuted mt-1">
              Vol: {(sector.volume / 1000000).toFixed(1)}M
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SectorSummary;
