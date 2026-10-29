import { supabase, TABLES } from './supabase';

// Market Data
export const getMarketOverview = async () => {
  try {
    // Get GIFT Nifty
    const { data: giftNifty } = await supabase
      .from(TABLES.MARKET_QUOTES)
      .select(`
        *,
        instruments!inner(symbol, company_name, exchange, instrument_type, sector)
      `)
      .eq('instruments.symbol', 'GIFTNIFTY')
      .order('received_timestamp', { ascending: false })
      .limit(1)
      .single();

    // Get NIFTY 50
    const { data: nifty50 } = await supabase
      .from(TABLES.MARKET_QUOTES)
      .select(`
        *,
        instruments!inner(symbol, company_name, exchange, instrument_type, sector)
      `)
      .eq('instruments.symbol', 'NIFTY50')
      .order('received_timestamp', { ascending: false })
      .limit(1)
      .single();

    // Get NIFTY BANK
    const { data: niftyBank } = await supabase
      .from(TABLES.MARKET_QUOTES)
      .select(`
        *,
        instruments!inner(symbol, company_name, exchange, instrument_type, sector)
      `)
      .eq('instruments.symbol', 'NIFTYBANK')
      .order('received_timestamp', { ascending: false })
      .limit(1)
      .single();

    // Get sector summary
    const { data: sectors } = await supabase
      .from(TABLES.MARKET_QUOTES)
      .select(`
        *,
        instruments!inner(symbol, company_name, exchange, instrument_type, sector)
      `)
      .in('instruments.symbol', ['NIFTYIT', 'NIFTYFMCG', 'NIFTYAUTO', 'NIFTYPHARMA'])
      .order('received_timestamp', { ascending: false });

    return {
      gift_nifty: giftNifty ? formatQuote(giftNifty) : null,
      nifty_50: nifty50 ? formatQuote(nifty50) : null,
      nifty_bank: niftyBank ? formatQuote(niftyBank) : null,
      sector_summary: sectors ? sectors.map(s => ({
        sector: s.instruments.symbol,
        change_pct: s.percentage_change || 0,
        volume: s.volume || 0
      })) : [],
      market_breadth: {
        advancing: 0,
        declining: 0,
        unchanged: 0,
        advance_decline_ratio: 0,
        total_traded: 0
      },
      timestamp: new Date().toISOString(),
      data_freshness: 'GOOD'
    };
  } catch (error) {
    console.error('Error fetching market overview:', error);
    throw error;
  }
};

const formatQuote = (quote) => ({
  symbol: quote.instruments.symbol,
  last_price: quote.last_price,
  reference_price: quote.reference_price,
  absolute_change: quote.absolute_change,
  percentage_change: quote.percentage_change,
  session_high: quote.session_high,
  session_low: quote.session_low,
  session_open: quote.session_open,
  volume: quote.volume,
  provider_timestamp: quote.provider_timestamp,
  data_status: quote.data_status,
  active_session: quote.active_session
});

export const getQuote = async (symbol) => {
  const { data, error } = await supabase
    .from(TABLES.MARKET_QUOTES)
    .select(`
      *,
      instruments!inner(symbol, company_name, exchange, instrument_type, sector)
    `)
    .eq('instruments.symbol', symbol)
    .order('received_timestamp', { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return formatQuote(data);
};

export const getCandles = async (symbol, timeframe = '15min', limit = 100) => {
  const { data: instrument } = await supabase
    .from(TABLES.INSTRUMENTS)
    .select('id')
    .eq('symbol', symbol)
    .single();

  if (!instrument) throw new Error('Instrument not found');

  const { data, error } = await supabase
    .from(TABLES.MARKET_CANDLES)
    .select('*')
    .eq('instrument_id', instrument.id)
    .eq('timeframe', timeframe)
    .order('timestamp_utc', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return {
    symbol,
    timeframe,
    candles: data.reverse().map(c => ({
      timestamp: c.timestamp_utc,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      volume: c.volume
    }))
  };
};

export const getGiftNiftySignal = async () => {
  // This would typically call a Supabase Edge Function
  // For now, return demo data
  return {
    gift_nifty_price: 24500.50,
    gift_nifty_change_pct: 0.33,
    gift_nifty_session_return: 0.33,
    previous_nse_close: 24420.00,
    estimated_nse_gap_pct: 0.26,
    historical_correlation: 0.65,
    forecast_error_mae: 0.15,
    model_confidence: 70,
    data_freshness: 'GOOD',
    last_update: new Date().toISOString()
  };
};

export const getStockScanner = async (filters = {}) => {
  let query = supabase
    .from(TABLES.MARKET_QUOTES)
    .select(`
      *,
      instruments!inner(symbol, company_name, exchange, instrument_type, sector)
    `)
    .eq('instruments.instrument_type', 'STOCK')
    .eq('instruments.active_status', true)
    .order('received_timestamp', { ascending: false });

  if (filters.sector) {
    query = query.eq('instruments.sector', filters.sector);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data.map(quote => ({
    symbol: quote.instruments.symbol,
    company: quote.instruments.company_name,
    sector: quote.instruments.sector,
    previous_close: quote.reference_price || 0,
    current_price: quote.last_price,
    absolute_change: quote.absolute_change || 0,
    percentage_change: quote.percentage_change || 0,
    opening_gap_pct: 0,
    vwap_deviation: 0,
    relative_volume: 1.0,
    rsi: null,
    momentum: 0,
    trend: 'NEUTRAL',
    market_breadth_confirmation: false,
    gift_nifty_relationship: null,
    signal_strength: 50,
    entry_reference: null,
    target_reference: null,
    invalidation_level: null,
    data_freshness: quote.data_status
  }));
};

export const refreshMarketData = async () => {
  // This would call a Supabase Edge Function to refresh data
  return {
    status: 'success',
    message: 'Data refresh triggered',
    timestamp: new Date().toISOString()
  };
};

// Instruments
export const getInstruments = async (filters = {}) => {
  let query = supabase
    .from(TABLES.INSTRUMENTS)
    .select('*');

  if (filters.exchange) query = query.eq('exchange', filters.exchange);
  if (filters.instrument_type) query = query.eq('instrument_type', filters.instrument_type);
  if (filters.sector) query = query.eq('sector', filters.sector);
  if (filters.active_only !== false) query = query.eq('active_status', true);

  const { data, error } = await query;
  if (error) throw error;

  return data.map(inst => ({
    symbol: inst.symbol,
    company_name: inst.company_name,
    exchange: inst.exchange,
    instrument_type: inst.instrument_type,
    sector: inst.sector
  }));
};

// Analysis
export const getTechnicalAnalysis = async (symbol, timeframe = '15min') => {
  // This would typically call a Supabase Edge Function
  return {
    symbol,
    timeframe,
    rsi: null,
    macd: { line: null, signal: null, histogram: null },
    vwap: null,
    atr: null,
    momentum: null,
    relative_volume: null,
    support: null,
    resistance: null,
    status: 'NOT_IMPLEMENTED'
  };
};

export const getSentimentScore = async (symbol) => {
  return {
    symbol,
    score: 0,
    breakdown: {},
    status: 'NOT_IMPLEMENTED'
  };
};

export const getEntryLevels = async (symbol, strategy = 'gap_continuation') => {
  return {
    symbol,
    strategy,
    entry: null,
    target: null,
    invalidation: null,
    risk_reward: null,
    status: 'NOT_IMPLEMENTED'
  };
};

export const getCorrelation = async (symbolA, symbolB, lookback = 60, returnType = 'opening_gap') => {
  const { data, error } = await supabase
    .from(TABLES.CORRELATION_RESULTS)
    .select('*')
    .eq('instrument_a', symbolA)
    .eq('instrument_b', symbolB)
    .eq('lookback_period', lookback)
    .eq('return_type', returnType)
    .order('calculated_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return {
      symbol_a: symbolA,
      symbol_b: symbolB,
      lookback,
      return_type: returnType,
      correlation: null,
      status: 'NOT_FOUND'
    };
  }

  return {
    symbol_a: data.instrument_a,
    symbol_b: data.instrument_b,
    lookback: data.lookback_period,
    return_type: data.return_type,
    correlation: data.correlation_value,
    sample_size: data.sample_size,
    status: 'SUCCESS'
  };
};

// Research
export const getGiftNiftyNSECorrelation = async (lookbackPeriod = 60, returnType = 'opening_gap') => {
  const { data, error } = await supabase
    .from(TABLES.CORRELATION_RESULTS)
    .select('*')
    .eq('instrument_a', 'GIFTNIFTY')
    .eq('instrument_b', 'NIFTY50')
    .eq('lookback_period', lookbackPeriod)
    .eq('return_type', returnType)
    .order('calculated_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return {
      lookback_period: lookbackPeriod,
      return_type: returnType,
      correlation: null,
      sample_size: 0,
      status: 'INSUFFICIENT_DATA'
    };
  }

  return {
    lookback_period: data.lookback_period,
    return_type: data.return_type,
    pearson_correlation: data.correlation_value,
    spearman_correlation: null,
    sample_size: data.sample_size,
    status: 'SUCCESS'
  };
};

export const getLeadLagAnalysis = async (symbolA, symbolB, maxLag = 10, lookback = 120) => {
  return {
    symbol_a: symbolA,
    symbol_b: symbolB,
    max_lag: maxLag,
    lookback,
    optimal_lag: null,
    correlations: [],
    status: 'NOT_IMPLEMENTED'
  };
};

export const getRollingCorrelation = async (symbolA, symbolB, window = 20, lookback = 120) => {
  return {
    symbol_a: symbolA,
    symbol_b: symbolB,
    window,
    lookback,
    rolling_correlations: [],
    status: 'NOT_IMPLEMENTED'
  };
};

// Backtest
export const runBacktest = async (strategyName, instrument, dateStart, dateEnd, configuration) => {
  const { data, error } = await supabase
    .from(TABLES.BACKTEST_RUNS)
    .insert({
      strategy_name: strategyName,
      date_range_start: dateStart,
      date_range_end: dateEnd,
      configuration: JSON.stringify(configuration || {}),
      performance_metrics: null
    })
    .select()
    .single();

  if (error) throw error;

  return {
    status: 'CREATED',
    id: data.id,
    ...data
  };
};

export const getBacktestResults = async (runId) => {
  const { data, error } = await supabase
    .from(TABLES.BACKTEST_RUNS)
    .select('*')
    .eq('id', runId)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    strategy_name: data.strategy_name,
    date_range: {
      start: data.date_range_start,
      end: data.date_range_end
    },
    configuration: data.configuration,
    performance_metrics: data.performance_metrics,
    created_at: data.created_at
  };
};

export const getBacktestHistory = async (strategyName = null, limit = 20) => {
  let query = supabase
    .from(TABLES.BACKTEST_RUNS)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (strategyName) {
    query = query.eq('strategy_name', strategyName);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data.map(run => ({
    id: run.id,
    strategy_name: run.strategy_name,
    date_range_start: run.date_range_start,
    date_range_end: run.date_range_end,
    created_at: run.created_at
  }));
};

// Signals
export const getLatestSignal = async (symbol) => {
  const { data: instrument } = await supabase
    .from(TABLES.INSTRUMENTS)
    .select('id')
    .eq('symbol', symbol)
    .single();

  if (!instrument) return null;

  const { data, error } = await supabase
    .from(TABLES.MARKET_SIGNALS)
    .select('*')
    .eq('instrument_id', instrument.id)
    .order('signal_timestamp', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;

  return {
    symbol,
    timestamp: data.signal_timestamp,
    direction: data.signal_direction,
    strength: data.signal_strength,
    confidence: data.confidence_score,
    supporting_metrics: data.supporting_metrics,
    invalidation_conditions: data.invalidation_conditions
  };
};

export const getSignalHistory = async (symbol, limit = 50) => {
  const { data: instrument } = await supabase
    .from(TABLES.INSTRUMENTS)
    .select('id')
    .eq('symbol', symbol)
    .single();

  if (!instrument) return [];

  const { data, error } = await supabase
    .from(TABLES.MARKET_SIGNALS)
    .select('*')
    .eq('instrument_id', instrument.id)
    .order('signal_timestamp', { ascending: false })
    .limit(limit);

  if (error) return [];

  return data.map(signal => ({
    timestamp: signal.signal_timestamp,
    direction: signal.signal_direction,
    strength: signal.signal_strength,
    confidence: signal.confidence_score
  }));
};

export const getActiveSignals = async () => {
  return [];
};

export const generateSignal = async (symbol, strategy = 'default') => {
  return {
    symbol,
    strategy,
    status: 'NOT_IMPLEMENTED',
    message: 'Signal generation not yet implemented'
  };
};
