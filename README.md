# GIFT Nifty → NSE Market Intelligence Terminal

A comprehensive, cloud-hosted trading research dashboard that analyzes GIFT Nifty futures movements and their relationship with NSE India indices and individual NSE-listed stocks.

**Tech Stack**: React, JavaScript, Supabase

## Features

- **GIFT Nifty Monitoring**: Real-time tracking of GIFT Nifty futures with pre-market signal analysis
- **NSE Market Overview**: NIFTY 50, NIFTY BANK, and sector index tracking
- **Stock Scanner**: Advanced filtering and sorting of NSE stocks with technical indicators
- **Correlation Analysis**: Research module to analyze lead-lag relationships between GIFT Nifty and NSE
- **Backtesting**: Historical strategy testing with walk-forward validation
- **Technical Indicators**: RSI, MACD, VWAP, ATR, Bollinger Bands, and more
- **Cloud Database**: Supabase for data persistence and real-time sync

## Technology Stack

### Frontend
- **React 18**: UI library
- **JavaScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Lightweight Charts**: High-performance charting library
- **Lucide React**: Icon library

### Backend / Database
- **Supabase**: Backend-as-a-Service with PostgreSQL
- **Real-time Database**: Live data updates
- **Row Level Security**: Secure data access
- **Edge Functions**: Serverless compute (optional for advanced features)

## Installation

### Prerequisites

- Node.js 18 or higher
- npm (Node package manager)
- Supabase account (free tier available)

### Step 1: Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for your project to be ready (1-2 minutes)
3. Go to the SQL Editor in your Supabase dashboard
4. Copy and run the SQL schema from `supabase/schema.sql`
5. Go to Project Settings → API
6. Copy your project URL and anon key

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 3: Install Dependencies

```bash
cd frontend
npm install
```

### Step 4: Start Development Server

```bash
npm run dev
```

Or use the Windows startup script:
```bash
start.bat
```

Open http://localhost:5173 in your browser.

## Deployment

### Deploy to GitHub Pages

1. Build the application:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `dist` folder to GitHub Pages or any static hosting service

3. Make sure your Supabase project allows CORS from your domain

### Deploy to Vercel/Netlify

1. Connect your repository to Vercel or Netlify
2. Set environment variables in the deployment settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automatically on push

## Database Schema

The application uses Supabase (PostgreSQL) with the following tables:

- **instruments**: Market instruments (indices, stocks, futures)
- **market_candles**: OHLCV candle data
- **market_quotes**: Real-time quote data
- **market_sessions**: Trading session information
- **market_signals**: Generated trading signals
- **correlation_results**: Correlation analysis results
- **research_log**: Historical signal evaluations
- **backtest_runs**: Backtest execution records
- **data_ingestion_log**: Data ingestion tracking

See `supabase/schema.sql` for the complete schema definition.

## Data Ingestion

For production use, you'll need to set up data ingestion from market data providers. Options include:

1. **Supabase Edge Functions**: Create serverless functions to fetch data from providers
2. **External Scripts**: Run Python/Node scripts to ingest data into Supabase
3. **Webhooks**: Configure webhooks from data providers to Supabase

The current implementation uses demo data for testing purposes.

## Key Features Explained

### GIFT Nifty Pre-Market Signal

The application analyzes GIFT Nifty futures movements before NSE market opening to estimate the expected NSE opening gap. This includes:

- GIFT Nifty overnight percentage change
- Historical correlation with NSE opening gaps
- Forecast error metrics
- Model confidence scoring

**Important**: GIFT Nifty futures prices are not directly comparable to NSE cash index prices due to fair value and basis differences. The signal is an analytical estimate, not a guarantee.

### Stock Scanner

The scanner provides:
- Real-time price changes and gaps
- Technical indicators (RSI, momentum, trend)
- Signal strength scoring
- Entry, target, and invalidation levels
- Multiple filtering options (sector, price change, volume, etc.)

### Correlation Analysis

The research module allows you to:
- Calculate Pearson and Spearman correlations
- Analyze lead-lag relationships
- View rolling correlations over time
- Test different return types (opening gap, intraday intervals)

### Backtesting

Test strategies on historical data with:
- Multiple strategy options (gap continuation, reversal, VWAP, etc.)
- Configurable date ranges
- Performance metrics (win rate, P&L, drawdown, etc.)
- Walk-forward validation to prevent look-ahead bias

## Data Quality and Limitations

### Demo Mode
- Uses simulated data for testing
- Not suitable for live trading
- Values are randomly generated for demonstration

### Live Data
- Requires data provider integration (not included)
- Subject to provider rate limits and data availability
- Always verify data freshness and timestamps
- Stale data may produce invalid signals

### Important Notes
- The application is for research and analysis purposes only
- Signals are analytical references, not trading recommendations
- Always validate with multiple data sources
- Past performance does not guarantee future results
- Use appropriate risk management in actual trading

## Security

- Supabase provides built-in authentication and authorization
- Row Level Security (RLS) policies protect your data
- API keys are stored in environment variables
- No automatic order placement is implemented
- Use read-only broker access where possible

## Troubleshooting

### Frontend won't start
- Ensure Node.js 18+ is installed
- Check that dependencies are installed: `cd frontend && npm install`
- Verify that port 5173 is not in use

### Supabase connection errors
- Verify your Supabase URL and anon key in `.env`
- Check that your Supabase project is active
- Ensure you've run the SQL schema in Supabase
- Check CORS settings in Supabase if deploying to a custom domain

### No data appearing
- Check that instruments exist in the database
- Verify RLS policies allow public read access
- Check browser console for Supabase errors
- Ensure data has been ingested into the database

## Project Structure

```
TRADER/
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── services/            # Supabase client and API
│   │   ├── main.jsx             # React entry point
│   │   └── App.jsx              # Main app component
│   ├── package.json             # Node dependencies
│   ├── vite.config.js           # Vite configuration
│   └── tailwind.config.js       # Tailwind configuration
├── supabase/
│   └── schema.sql               # Database schema
├── skills/
│   └── gift_nifty_nse_analysis.md  # Analysis workflow documentation
├── .env.example                 # Environment variables template
├── README.md                    # This file
└── start.bat                    # Windows startup script
```

## Development

### Running Locally

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Adding New Features

1. Update the Supabase schema if needed
2. Add API functions in `frontend/src/services/api.js`
3. Create React components in `frontend/src/components/`
4. Add pages in `frontend/src/pages/`
5. Update routing in `frontend/src/App.jsx`

## License

This project is provided as-is for educational and research purposes.

## Disclaimer

This software is for research and educational purposes only. It does not constitute financial advice. Trading in financial markets involves substantial risk of loss. Always conduct your own research and consult with a qualified financial advisor before making any trading decisions.

## Roadmap

Future enhancements may include:
- Supabase Edge Functions for data ingestion
- More technical indicators
- Advanced backtesting features
- Authentication with Supabase Auth
- User-specific watchlists
- Alert system integration
- Mobile-friendly interface improvements
