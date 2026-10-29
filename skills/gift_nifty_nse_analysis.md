# GIFT Nifty → NSE Analysis Skill

## Overview
This skill implements a deterministic Python analysis pipeline for GIFT Nifty and NSE market intelligence.

## Analysis Workflow

### STEP 1: Validate Data Freshness
- Verify data freshness, timestamps, contract selection and market sessions
- Check for stale or missing data
- Validate session alignment between GIFT Nifty and NSE

### STEP 2: Summarize GIFT Nifty Movement
- Calculate GIFT Nifty futures percentage change
- Determine session return between defined timestamps
- Record the previous NSE close
- Identify overnight and pre-market movements

### STEP 3: Estimate NSE Opening Gap
- Use historically validated model to estimate expected NSE opening gap
- Apply historical correlation coefficients
- Account for model error estimates
- Return confidence score based on data quality and historical accuracy

### STEP 4: Analyze Technical Conditions
- Calculate NSE index technical indicators (RSI, MACD, VWAP, ATR)
- Analyze sector-level momentum and trends
- Evaluate stock-level technical conditions
- Assess market breadth indicators

### STEP 5: Score Evidence
- Score bullish and bearish evidence
- Identify conflicting signals
- Calculate weighted sentiment score
- Document supporting and contradictory factors

### STEP 6: Generate Scenarios
- Generate bullish scenario with explicit invalidation conditions
- Generate bearish scenario with explicit invalidation conditions
- Generate neutral/wait scenario if evidence is mixed
- Define clear trigger points for each scenario

### STEP 7: Classify Candidates
Classify each candidate as:
- STRONG POSITIVE
- POSITIVE
- MIXED / WAIT
- NEGATIVE
- STRONG NEGATIVE
- INSUFFICIENT DATA

### STEP 8: Evaluate Historical Performance
- Compare earlier signals with actual NSE performance
- Calculate historical hit rate
- Measure forecast error
- Update model confidence based on recent performance

## Output Format

The analysis pipeline produces structured JSON:

```json
{
  "analysis_timestamp": "UTC timestamp",
  "data_validation": {
    "gift_nifty_fresh": true,
    "nse_fresh": true,
    "session_aligned": true,
    "data_quality": "GOOD"
  },
  "gift_nifty_summary": {
    "price": 24500.50,
    "change_pct": 0.33,
    "session_return": 0.33,
    "session_high": 24550.00,
    "session_low": 24380.00,
    "volume": 150000,
    "contract_expiry": "2024-12-26"
  },
  "nse_summary": {
    "previous_close": 24420.00,
    "expected_gap_pct": 0.26,
    "historical_correlation": 0.65,
    "forecast_error_mae": 0.15
  },
  "technical_analysis": {
    "nifty_50": {
      "rsi": 55.5,
      "trend": "NEUTRAL",
      "support": 24300,
      "resistance": 24600
    },
    "sectors": [
      {
        "name": "IT",
        "strength": "POSITIVE",
        "change_pct": 0.5
      }
    ]
  },
  "evidence_scoring": {
    "bullish_score": 45,
    "bearish_score": 35,
    "conflicting_signals": [
      "GIFT Nifty positive but NSE technicals neutral"
    ]
  },
  "scenarios": {
    "bullish": {
      "probability": 0.45,
      "entry": 24450,
      "target": 24600,
      "invalidation": 24380,
      "conditions": [
        "Gap holds above 0.2%",
        "Volume above average"
      ]
    },
    "bearish": {
      "probability": 0.35,
      "entry": 24350,
      "target": 24200,
      "invalidation": 24450,
      "conditions": [
        "Gap fills within 30 minutes",
        "Volume below average"
      ]
    }
  },
  "classification": "MIXED / WAIT",
  "confidence": 65,
  "recommendation": "Wait for clear directional signal before entering"
}
```

## Key Principles

1. **No Future Information**: All calculations use only data available at the time of signal generation
2. **Clear Separation**: GIFT Nifty futures and NSE cash data are never mixed without proper adjustment
3. **Transparent Uncertainty**: Confidence scores reflect actual data quality and historical accuracy
4. **Explicit Invalidation**: Every scenario includes clear invalidation conditions
5. **No Fabrication**: If data is insufficient, return "INSUFFICIENT DATA" rather than inventing values

## Usage

Run the analysis pipeline:

```python
from app.services.analysis_pipeline import AnalysisPipeline

pipeline = AnalysisPipeline()
result = pipeline.run_analysis(db_session)
```

## Notes

- This is a deterministic calculation pipeline
- An optional LLM may explain the findings but must not alter numerical outputs
- All timestamps are stored in UTC and displayed in Asia/Kolkata
- Historical correlations are calculated from actual aligned data
- Model confidence is derived from measured forecast accuracy, not assumptions
