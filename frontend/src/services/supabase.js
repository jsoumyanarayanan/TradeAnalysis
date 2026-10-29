import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  INSTRUMENTS: 'instruments',
  MARKET_CANDLES: 'market_candles',
  MARKET_QUOTES: 'market_quotes',
  MARKET_SESSIONS: 'market_sessions',
  MARKET_SIGNALS: 'market_signals',
  CORRELATION_RESULTS: 'correlation_results',
  RESEARCH_LOG: 'research_log',
  BACKTEST_RUNS: 'backtest_runs',
  DATA_INGESTION_LOG: 'data_ingestion_log',
};
