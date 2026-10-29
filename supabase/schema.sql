-- Supabase Database Schema for GIFT Nifty NSE Market Intelligence Terminal

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Instruments table
CREATE TABLE instruments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  symbol VARCHAR(50) UNIQUE NOT NULL,
  company_name VARCHAR(200),
  exchange VARCHAR(20) NOT NULL,
  instrument_type VARCHAR(20) NOT NULL, -- INDEX, STOCK, FUTURES
  sector VARCHAR(50),
  active_status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_instruments_symbol ON instruments(symbol);
CREATE INDEX idx_instruments_exchange ON instruments(exchange);
CREATE INDEX idx_instruments_sector ON instruments(sector);
CREATE INDEX idx_instruments_active ON instruments(active_status);

-- Market candles table
CREATE TABLE market_candles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  instrument_id UUID REFERENCES instruments(id) ON DELETE CASCADE,
  timeframe VARCHAR(10) NOT NULL, -- 1min, 5min, 15min, 1hour, 1day
  timestamp_utc TIMESTAMP WITH TIME ZONE NOT NULL,
  open NUMERIC NOT NULL,
  high NUMERIC NOT NULL,
  low NUMERIC NOT NULL,
  close NUMERIC NOT NULL,
  volume NUMERIC DEFAULT 0,
  provider VARCHAR(50) NOT NULL,
  data_quality_status VARCHAR(20) DEFAULT 'GOOD', -- GOOD, SUSPECT, BAD
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_candles_instrument ON market_candles(instrument_id);
CREATE INDEX idx_candles_timeframe ON market_candles(timeframe);
CREATE INDEX idx_candles_timestamp ON market_candles(timestamp_utc);
CREATE INDEX idx_candles_instrument_timeframe_timestamp ON market_candles(instrument_id, timeframe, timestamp_utc);

-- Market quotes table
CREATE TABLE market_quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  instrument_id UUID REFERENCES instruments(id) ON DELETE CASCADE,
  last_price NUMERIC NOT NULL,
  reference_price NUMERIC, -- Previous close, settlement, etc.
  absolute_change NUMERIC,
  percentage_change NUMERIC,
  provider_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  received_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_status VARCHAR(20) DEFAULT 'LIVE', -- LIVE, DELAYED, STALE, DEMO
  session_high NUMERIC,
  session_low NUMERIC,
  session_open NUMERIC,
  volume NUMERIC,
  contract_expiry VARCHAR(20),
  active_session VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_quotes_instrument ON market_quotes(instrument_id);
CREATE INDEX idx_quotes_received ON market_quotes(received_timestamp);
CREATE INDEX idx_quotes_instrument_received ON market_quotes(instrument_id, received_timestamp);

-- Market sessions table
CREATE TABLE market_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  exchange VARCHAR(20) NOT NULL,
  session_date DATE NOT NULL,
  open_time TIMESTAMP WITH TIME ZONE NOT NULL,
  close_time TIMESTAMP WITH TIME ZONE NOT NULL,
  session_type VARCHAR(20) NOT NULL, -- REGULAR, PRE_MARKET, AFTER_HOURS
  holiday_status BOOLEAN DEFAULT FALSE
);

-- Create indexes
CREATE INDEX idx_sessions_exchange ON market_sessions(exchange);
CREATE INDEX idx_sessions_date ON market_sessions(session_date);

-- Market signals table
CREATE TABLE market_signals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  instrument_id UUID REFERENCES instruments(id) ON DELETE CASCADE,
  signal_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  signal_direction VARCHAR(10) NOT NULL, -- BUY, SELL, HOLD
  signal_strength NUMERIC, -- 0-100
  confidence_score NUMERIC, -- 0-100
  supporting_metrics TEXT, -- JSON string
  invalidation_conditions TEXT, -- JSON string
  calculation_version VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_signals_instrument ON market_signals(instrument_id);
CREATE INDEX idx_signals_timestamp ON market_signals(signal_timestamp);

-- Correlation results table
CREATE TABLE correlation_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  instrument_a VARCHAR(50) NOT NULL,
  instrument_b VARCHAR(50) NOT NULL,
  lookback_period INTEGER NOT NULL,
  correlation_value NUMERIC NOT NULL,
  sample_size INTEGER NOT NULL,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  correlation_type VARCHAR(50), -- pearson, spearman
  return_type VARCHAR(50) -- opening_gap, intraday_15min, etc.
);

-- Create indexes
CREATE INDEX idx_correlation_instruments ON correlation_results(instrument_a, instrument_b);
CREATE INDEX idx_correlation_calculated ON correlation_results(calculated_at);

-- Research log table
CREATE TABLE research_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  instrument_id UUID REFERENCES instruments(id) ON DELETE CASCADE,
  observation_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  signal_snapshot TEXT NOT NULL, -- JSON string
  subsequent_return NUMERIC,
  evaluation_status VARCHAR(20), -- PENDING, EVALUATED, INVALID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_research_instrument ON research_log(instrument_id);
CREATE INDEX idx_research_timestamp ON research_log(observation_timestamp);

-- Backtest runs table
CREATE TABLE backtest_runs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  strategy_name VARCHAR(100) NOT NULL,
  date_range_start DATE NOT NULL,
  date_range_end DATE NOT NULL,
  configuration TEXT NOT NULL, -- JSON string
  performance_metrics TEXT, -- JSON string
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_backtest_strategy ON backtest_runs(strategy_name);
CREATE INDEX idx_backtest_created ON backtest_runs(created_at);

-- Data ingestion log table
CREATE TABLE data_ingestion_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider VARCHAR(50) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  records_received INTEGER DEFAULT 0,
  records_rejected INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'RUNNING', -- RUNNING, COMPLETED, FAILED
  error_message TEXT
);

-- Create indexes
CREATE INDEX idx_ingestion_provider ON data_ingestion_log(provider);
CREATE INDEX idx_ingestion_started ON data_ingestion_log(started_at);

-- Row Level Security (RLS) Policies
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_candles ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE correlation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE backtest_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_ingestion_log ENABLE ROW LEVEL SECURITY;

-- Allow public read access for demo purposes
-- In production, you should implement proper authentication
CREATE POLICY "Public read access for instruments" ON instruments FOR SELECT USING (true);
CREATE POLICY "Public read access for market_candles" ON market_candles FOR SELECT USING (true);
CREATE POLICY "Public read access for market_quotes" ON market_quotes FOR SELECT USING (true);
CREATE POLICY "Public read access for market_sessions" ON market_sessions FOR SELECT USING (true);
CREATE POLICY "Public read access for market_signals" ON market_signals FOR SELECT USING (true);
CREATE POLICY "Public read access for correlation_results" ON correlation_results FOR SELECT USING (true);
CREATE POLICY "Public read access for research_log" ON research_log FOR SELECT USING (true);
CREATE POLICY "Public read access for backtest_runs" ON backtest_runs FOR SELECT USING (true);
CREATE POLICY "Public read access for data_ingestion_log" ON data_ingestion_log FOR SELECT USING (true);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_instruments_updated_at BEFORE UPDATE ON instruments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo data
INSERT INTO instruments (symbol, company_name, exchange, instrument_type, sector) VALUES
  ('GIFTNIFTY', 'GIFT Nifty 50 Futures', 'GIFT', 'FUTURES', 'INDEX'),
  ('NIFTY50', 'NIFTY 50', 'NSE', 'INDEX', 'INDEX'),
  ('NIFTYBANK', 'NIFTY BANK', 'NSE', 'INDEX', 'INDEX'),
  ('NIFTYIT', 'NIFTY IT', 'NSE', 'INDEX', 'IT'),
  ('NIFTYFMCG', 'NIFTY FMCG', 'NSE', 'INDEX', 'FMCG'),
  ('NIFTYAUTO', 'NIFTY AUTO', 'NSE', 'INDEX', 'AUTO'),
  ('NIFTYPHARMA', 'NIFTY PHARMA', 'NSE', 'INDEX', 'PHARMA'),
  ('RELIANCE', 'Reliance Industries', 'NSE', 'STOCK', 'ENERGY'),
  ('TCS', 'Tata Consultancy Services', 'NSE', 'STOCK', 'IT'),
  ('HDFCBANK', 'HDFC Bank', 'NSE', 'STOCK', 'FINANCIAL'),
  ('INFY', 'Infosys', 'NSE', 'STOCK', 'IT'),
  ('ICICIBANK', 'ICICI Bank', 'NSE', 'STOCK', 'FINANCIAL'),
  ('SBIN', 'State Bank of India', 'NSE', 'STOCK', 'FINANCIAL'),
  ('BHARTIARTL', 'Bharti Airtel', 'NSE', 'STOCK', 'TELECOM'),
  ('ITC', 'ITC Limited', 'NSE', 'STOCK', 'FMCG'),
  ('KOTAKBANK', 'Kotak Mahindra Bank', 'NSE', 'STOCK', 'FINANCIAL')
ON CONFLICT (symbol) DO NOTHING;
