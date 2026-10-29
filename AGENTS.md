# Project Notes for Devin

## Project Overview
GIFT Nifty → NSE Market Intelligence Terminal - A cloud-hosted trading research dashboard.

**Tech Stack**: React, JavaScript, Supabase

## Setup Instructions

### Quick Start (Windows)
Run `start.bat` from the project root. This will:
- Install frontend dependencies
- Start frontend dev server on http://localhost:5173

### Manual Setup
See README.md for detailed manual setup instructions.

## Key Technical Decisions

### Architecture
- **React + JavaScript**: Frontend with JSX (no TypeScript for simplicity)
- **Supabase**: Backend-as-a-Service providing PostgreSQL database and real-time capabilities
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Custom trading theme
- **Lightweight Charts**: High-performance charting

### Why Supabase?
- Free tier available
- Built-in PostgreSQL database
- Real-time subscriptions
- Row Level Security (RLS)
- Easy to deploy with GitHub Pages/Vercel/Netlify
- No server maintenance required

### Database
- PostgreSQL via Supabase
- All timestamps stored in UTC
- Display times in Asia/Kolkata timezone
- Tables: instruments, market_candles, market_quotes, market_sessions, market_signals, correlation_results, research_log, backtest_runs, data_ingestion_log
- RLS policies for security

## Architecture

### Data Flow
1. Frontend (React) → Supabase Client → Supabase Database
2. Data Providers (external) → Supabase Edge Functions/Scripts → Database
3. Frontend reads directly from Supabase using Supabase client

### Key Services
- `supabase.js`: Supabase client initialization
- `api.js`: All database operations via Supabase client
- React components: UI rendering with real-time data

### Data Providers
For production, you'll need to implement data ingestion:
- Option 1: Supabase Edge Functions (serverless)
- Option 2: External scripts (Python/Node) writing to Supabase
- Option 3: Webhooks from data providers

Current implementation uses demo data inserted via SQL schema.

## Configuration

All configuration via environment variables in `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Setup

1. Create project at https://supabase.com
2. Run SQL schema from `supabase/schema.sql`
3. Copy URL and anon key to `.env`
4. Configure CORS in Supabase if deploying to custom domain

## File Structure

```
TRADER/
├── frontend/
│   ├── src/
│   │   ├── components/          # React components (.jsx)
│   │   ├── pages/               # Page components (.jsx)
│   │   ├── services/            # Supabase client and API (.js)
│   │   ├── main.jsx             # React entry point
│   │   └── App.jsx              # Main app with routing
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── supabase/
│   └── schema.sql               # Database schema
├── skills/
│   └── gift_nifty_nse_analysis.md
├── .env.example
├── README.md
└── start.bat
```

## Known Limitations

1. Data ingestion not implemented - uses demo data
2. Technical analysis calculations should move to Edge Functions
3. Correlation calculations need to be implemented in backend
4. No authentication (public read access via RLS)
5. Real-time subscriptions not yet implemented

## Deployment

### GitHub Pages
1. Build: `cd frontend && npm run build`
2. Deploy `dist` folder to GitHub Pages
3. Set environment variables in GitHub

### Vercel/Netlify
1. Connect repository
2. Set environment variables
3. Auto-deploy on push

## Verification Steps

To verify the application works:
1. Set up Supabase project
2. Run schema.sql in Supabase SQL editor
3. Configure .env with Supabase credentials
4. Run `start.bat` or `cd frontend && npm install && npm run dev`
5. Open http://localhost:5173
6. Check that Overview page loads
7. Verify data displays from Supabase

## Troubleshooting

- If frontend won't start: Check Node.js version (18+), npm install completed
- If no data: Check Supabase credentials, schema applied, RLS policies
- If Supabase errors: Verify URL and anon key, check project status
- Port conflicts: Frontend uses 5173

## Future Enhancements

- Implement data ingestion via Edge Functions
- Add authentication with Supabase Auth
- Implement real-time subscriptions
- Move calculations to Edge Functions
- Add user-specific features (watchlists, alerts)
- Implement correlation calculations in backend
