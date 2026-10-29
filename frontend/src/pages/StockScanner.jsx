import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { getStockScanner } from '../services/api';

function StockScanner() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sector: '',
    min_change: '',
    max_change: '',
    min_signal_strength: '',
  });
  const [sortField, setSortField] = useState('percentage_change');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    loadScannerData();
  }, [filters]);

  const loadScannerData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.sector) params.sector = filters.sector;
      if (filters.min_change) params.min_change = parseFloat(filters.min_change);
      if (filters.max_change) params.max_change = parseFloat(filters.max_change);
      if (filters.min_signal_strength) params.min_signal_strength = parseFloat(filters.min_signal_strength);

      const data = await getStockScanner(params);
      setStocks(data);
    } catch (error) {
      console.error('Error loading scanner data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const getChangeColor = (value) => {
    if (value > 0) return 'text-trading-green';
    if (value < 0) return 'text-trading-red';
    return 'text-trading-text';
  };

  const getSignalStrengthColor = (strength) => {
    if (strength >= 70) return 'bg-trading-green';
    if (strength >= 50) return 'bg-yellow-500';
    return 'bg-trading-red';
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-trading-text">NSE Stock Scanner</h2>
        <p className="text-sm text-trading-textMuted mt-1">
          Scan NSE stocks for trading opportunities
        </p>
      </div>

      {/* Filters */}
      <div className="bg-trading-card border border-trading-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-trading-textMuted" />
          <span className="text-sm font-medium text-trading-text">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-trading-textMuted block mb-1">Sector</label>
            <select
              value={filters.sector}
              onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
              className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2 text-sm text-trading-text"
            >
              <option value="">All Sectors</option>
              <option value="IT">IT</option>
              <option value="FINANCIAL">Financial</option>
              <option value="ENERGY">Energy</option>
              <option value="FMCG">FMCG</option>
              <option value="PHARMA">Pharma</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-trading-textMuted block mb-1">Min Change %</label>
            <input
              type="number"
              value={filters.min_change}
              onChange={(e) => setFilters({ ...filters, min_change: e.target.value })}
              className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2 text-sm text-trading-text"
              placeholder="e.g., -5"
            />
          </div>
          <div>
            <label className="text-xs text-trading-textMuted block mb-1">Max Change %</label>
            <input
              type="number"
              value={filters.max_change}
              onChange={(e) => setFilters({ ...filters, max_change: e.target.value })}
              className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2 text-sm text-trading-text"
              placeholder="e.g., 5"
            />
          </div>
          <div>
            <label className="text-xs text-trading-textMuted block mb-1">Min Signal Strength</label>
            <input
              type="number"
              value={filters.min_signal_strength}
              onChange={(e) => setFilters({ ...filters, min_signal_strength: e.target.value })}
              className="w-full bg-trading-bg border border-trading-border rounded px-3 py-2 text-sm text-trading-text"
              placeholder="e.g., 50"
            />
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-trading-card border border-trading-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead className="bg-trading-border">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-trading-textMuted cursor-pointer hover:text-trading-text"
                  onClick={() => handleSort('symbol')}
                >
                  Symbol {sortField === 'symbol' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-trading-textMuted">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-trading-textMuted">
                  Sector
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-medium text-trading-textMuted cursor-pointer hover:text-trading-text"
                  onClick={() => handleSort('current_price')}
                >
                  Price {sortField === 'current_price' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-medium text-trading-textMuted cursor-pointer hover:text-trading-text"
                  onClick={() => handleSort('percentage_change')}
                >
                  Change % {sortField === 'percentage_change' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-trading-textMuted">
                  Gap %
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-trading-textMuted">
                  RSI
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-trading-textMuted">
                  Signal
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-trading-textMuted">
                  Entry
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-trading-textMuted">
                  Target
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-trading-textMuted">
                  Stop
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-trading-textMuted">
                    Loading scanner data...
                  </td>
                </tr>
              ) : sortedStocks.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-trading-textMuted">
                    No stocks match the current filters
                  </td>
                </tr>
              ) : (
                sortedStocks.map((stock) => (
                  <tr key={stock.symbol} className="border-t border-trading-border hover:bg-trading-border/50">
                    <td className="px-4 py-3 text-sm font-mono font-medium text-trading-text">
                      {stock.symbol}
                    </td>
                    <td className="px-4 py-3 text-sm text-trading-text">{stock.company}</td>
                    <td className="px-4 py-3 text-sm text-trading-textMuted">{stock.sector}</td>
                    <td className="px-4 py-3 text-sm font-mono text-right text-trading-text">
                      {stock.current_price.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-sm font-mono text-right ${getChangeColor(stock.percentage_change)}`}>
                      {stock.percentage_change.toFixed(2)}%
                    </td>
                    <td className={`px-4 py-3 text-sm font-mono text-right ${getChangeColor(stock.opening_gap_pct)}`}>
                      {stock.opening_gap_pct.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-right text-trading-text">
                      {stock.rsi?.toFixed(1) || '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-trading-border rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getSignalStrengthColor(stock.signal_strength)}`}
                            style={{ width: `${stock.signal_strength}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-trading-text">
                          {stock.signal_strength.toFixed(0)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-right text-trading-text">
                      {stock.entry_reference?.toFixed(2) || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-right text-trading-green">
                      {stock.target_reference?.toFixed(2) || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-right text-trading-red">
                      {stock.invalidation_level?.toFixed(2) || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StockScanner;
