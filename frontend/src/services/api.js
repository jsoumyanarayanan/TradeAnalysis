import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Market Data
export const getMarketOverview = async () => {
  const response = await api.get('/overview');
  return response.data;
};

export const getQuote = async (symbol) => {
  const response = await api.get(`/quotes/${symbol}`);
  return response.data;
};

export const getCandles = async (symbol, timeframe = '15min', limit = 100) => {
  const response = await api.get(`/candles/${symbol}`, {
    params: { timeframe, limit },
  });
  return response.data;
};

export const getGiftNiftySignal = async () => {
  const response = await api.get('/gift-nifty/signal');
  return response.data;
};

export const getStockScanner = async (filters = {}) => {
  const response = await api.get('/scanner', { params: filters });
  return response.data;
};

export const refreshMarketData = async () => {
  const response = await api.post('/refresh');
  return response.data;
};

// Instruments
export const getInstruments = async (filters = {}) => {
  const response = await api.get('/instruments/', { params: filters });
  return response.data;
};

export default api;
