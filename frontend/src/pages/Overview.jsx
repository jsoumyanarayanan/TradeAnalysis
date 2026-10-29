import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { getMarketOverview, getGiftNiftySignal, refreshMarketData } from '../services/api';
import QuoteCard from '../components/QuoteCard';
import GiftNiftySignalCard from '../components/GiftNiftySignalCard';
import SectorSummary from '../components/SectorSummary';

function Overview() {
  const [overview, setOverview] = useState(null);
  const [giftSignal, setGiftSignal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [overviewData, signalData] = await Promise.all([
        getMarketOverview(),
        getGiftNiftySignal(),
      ]);
      setOverview(overviewData);
      setGiftSignal(signalData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshMarketData();
      await loadData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-trading-textMuted">Loading market data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-trading-text">Market Overview</h2>
          <p className="text-sm text-trading-textMuted mt-1">
            Last updated: {formatTime(lastUpdate)}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-trading-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Panel A - Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GIFT Nifty */}
        <QuoteCard
          title="GIFT Nifty Futures"
          quote={overview?.gift_nifty}
          dataStatus={overview?.data_freshness}
        />

        {/* NIFTY 50 */}
        <QuoteCard
          title="NSE NIFTY 50"
          quote={overview?.nifty_50}
          dataStatus={overview?.data_freshness}
        />

        {/* NIFTY BANK */}
        <QuoteCard
          title="NSE NIFTY BANK"
          quote={overview?.nifty_bank}
          dataStatus={overview?.data_freshness}
        />
      </div>

      {/* Panel B - GIFT Nifty Pre-Market Signal */}
      <GiftNiftySignalCard signal={giftSignal} />

      {/* Sector Summary */}
      <div className="bg-trading-card border border-trading-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-trading-text mb-4">
          Sector Performance
        </h3>
        <SectorSummary sectors={overview?.sector_summary || []} />
      </div>

      {/* Market Breadth */}
      <div className="bg-trading-card border border-trading-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-trading-text mb-4">
          Market Breadth
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-mono font-semibold text-trading-green">
              {overview?.market_breadth.advancing || 0}
            </div>
            <div className="text-sm text-trading-textMuted">Advancing</div>
          </div>
          <div>
            <div className="text-2xl font-mono font-semibold text-trading-red">
              {overview?.market_breadth.declining || 0}
            </div>
            <div className="text-sm text-trading-textMuted">Declining</div>
          </div>
          <div>
            <div className="text-2xl font-mono font-semibold text-trading-text">
              {overview?.market_breadth.unchanged || 0}
            </div>
            <div className="text-sm text-trading-textMuted">Unchanged</div>
          </div>
          <div>
            <div className="text-2xl font-mono font-semibold text-trading-accent">
              {overview?.market_breadth.advance_decline_ratio?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-trading-textMuted">A/D Ratio</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
