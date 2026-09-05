import { apiClient } from '../../../lib/axios.js';

export const watchlistApi = {
  getWatchlists: async () => {
    const res = await apiClient.get('/watchlists');
    return res.data;
  },

  createWatchlist: async (name) => {
    const res = await apiClient.post('/watchlists', { name });
    return res.data;
  },

  getWatchlistById: async (id) => {
    const res = await apiClient.get(`/watchlists/${id}`);
    return res.data;
  },

  updateWatchlist: async (id, name) => {
    const res = await apiClient.patch(`/watchlists/${id}`, { name });
    return res.data;
  },

  deleteWatchlist: async (id) => {
    const res = await apiClient.delete(`/watchlists/${id}`);
    return res.data;
  },

  addItem: async (watchlistId, symbol, displayName) => {
    const res = await apiClient.post(`/watchlists/${watchlistId}/items`, { symbol, displayName });
    return res.data;
  },

  removeItem: async (watchlistId, symbol) => {
    const res = await apiClient.delete(`/watchlists/${watchlistId}/items/${symbol}`);
    return res.data;
  },

  reorderItems: async (watchlistId, symbols) => {
    const res = await apiClient.patch(`/watchlists/${watchlistId}/items/reorder`, { symbols });
    return res.data;
  },
};
