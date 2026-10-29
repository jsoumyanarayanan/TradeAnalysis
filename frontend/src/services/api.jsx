import axios from 'axios';
import type {
  MarketOverview,
  Quote,
  Candle,
  GiftNiftySignal,
  StockScannerItem,
  TechnicalAnalysis,
  CorrelationResult,
  BacktestResult
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Market Data
export const getMarketOverview = async (): Promise<MarketOverview> => {
  const response = await api.get('/market/overview');
  return response.data;
};

export const getQuote = async (symbol: string): Promise<Quote> => {
  const response = await api.get(`/market/quotes/${symbol}`);
  return response.data;
};

export const getCandles = async (
  symbol: string,
  timeframe: string = '15min',
  limit: number = 100
): Promise<{ symbol: string; timeframe: string; candles: Candle[] }> => {
  const response = await api.get(`/market/candles/${symbol}`, {
    params: { timeframe, limit },
  });
  return response.data;
};

export const getGiftNiftySignal = async (): Promise<GiftNiftySignal> => {
  const response = await api.get('/market/gift-nifty/signal');
  return response.data;
};

export const getStockScanner = async (filters?: {
  sector?: string;
  min_change?: number;
  max_change?: number;
  min_signal_strength?: number;
}): Promise<StockScannerItem[]> => {
  const response = await api.get('/market/scanner', { params: filters });
  return response.data;
};

export const refreshMarketData = async () => {
  const response = await api.post('/market/refresh');
  return response.data;
};

// Instruments
export const getInstruments = async (filters?: {
  exchange?: string;
  instrument_type?: string;
  sector?: string;
  active_only?: boolean;
}) => {
  const response = await api.get('/instruments/', { params: filters });
  return response.data;
};

// Analysis
export const getTechnicalAnalysis = async (
  symbol: string,
  timeframe: string = '15min'
): Promise<TechnicalAnalysis> => {
  const response = await api.get(`/analysis/technical/${symbol}`, {
    params: { timeframe },
  });
  return response.data;
};

export const getSentimentScore = async (symbol: string) => {
  const response = await api.get(`/analysis/sentiment/${symbol}`);
  return response.data;
};

export const getEntryLevels = async (
  symbol: string,
  strategy: string = 'gap_continuation'
) => {
  const response = await api.get(`/analysis/entry-levels/${symbol}`, {
    params: { strategy },
  });
  return response.data;
};

export const getCorrelation = async (
  symbol_a: string,
  symbol_b: string,
  lookback: number = 60,
  return_type: string = 'opening_gap'
): Promise<CorrelationResult> => {
  const response = await api.get(`/analysis/correlation/${symbol_a}/${symbol_b}`, {
    params: { lookback, return_type },
  });
  return response.data;
};

// Research
export const getGiftNiftyNSECorrelation = async (
  lookback_period: number = 60,
  return_type: string = 'opening_gap'
) => {
  const response = await api.get('/research/gift-nifty-nse-correlation', {
    params: { lookback_period, return_type },
  });
  return response.data;
};

export const getLeadLagAnalysis = async (
  symbol_a: string,
  symbol_b: string,
  max_lag: number = 10,
  lookback: number = 120
) => {
  const response = await api.get(`/research/lead-lag/${symbol_a}/${symbol_b}`, {
    params: { max_lag, lookback },
  });
  return response.data;
};

export const getRollingCorrelation = async (
  symbol_a: string,
  symbol_b: string,
  window: number = 20,
  lookback: number = 120
) => {
  const response = await api.get(
    `/research/rolling-correlation/${symbol_a}/${symbol_b}`,
    { params: { window, lookback } }
  );
  return response.data;
};

// Backtest
export const runBacktest = async (
  strategy_name: string,
  instrument: string,
  date_start: string,
  date_end: string,
  configuration?: any
) => {
  const response = await api.post('/backtest/run', null, {
    params: { strategy_name, instrument, date_start, date_end },
    data: configuration,
  });
  return response.data;
};

export const getBacktestResults = async (run_id: number): Promise<BacktestResult> => {
  const response = await api.get(`/backtest/results/${run_id}`);
  return response.data;
};

export const getBacktestHistory = async (
  strategy_name?: string,
  limit: number = 20
): Promise<BacktestResult[]> => {
  const response = await api.get('/backtest/history', {
    params: { strategy_name, limit },
  });
  return response.data;
};

// Signals
export const getLatestSignal = async (symbol: string) => {
  const response = await api.get(`/signals/latest/${symbol}`);
  return response.data;
};

export const getSignalHistory = async (symbol: string, limit: number = 50) => {
  const response = await api.get(`/signals/history/${symbol}`, {
    params: { limit },
  });
  return response.data;
};

export const getActiveSignals = async () => {
  const response = await api.get('/signals/active');
  return response.data;
};

export const generateSignal = async (symbol: string, strategy: string = 'default') => {
  const response = await api.post(`/signals/generate/${symbol}`, null, {
    params: { strategy },
  });
  return response.data;
};

export default api;
