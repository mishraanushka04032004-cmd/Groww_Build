import { apiClient } from '../../../lib/axios.js';

export const changesApi = {
  getChangeHistory: async (symbol, limit = 20) => {
    const res = await apiClient.get(`/changes/${symbol}?limit=${limit}`);
    return res.data;
  },
};
