import { apiClient } from '../../../lib/axios.js';

export const marketApi = {
  getQuote: async (symbol) => {
    const res = await apiClient.get(`/market/quote/${symbol}`);
    return res.data;
  },

  getHistoricalData: async (symbol, range = '1M') => {
    const res = await apiClient.get(`/market/history/${symbol}?range=${range}`);
    return res.data;
  },

  searchSymbols: async (query) => {
    const res = await apiClient.get(`/market/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
