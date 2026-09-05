import { apiClient } from '../../../lib/axios.js';

export const dashboardApi = {
  getDashboard: async (watchlistId = null) => {
    const url = watchlistId ? `/dashboard?watchlistId=${watchlistId}` : '/dashboard';
    const res = await apiClient.get(url);
    return res.data;
  },

  acknowledgeChanges: async ({ symbol = null, all = false } = {}) => {
    const res = await apiClient.patch('/dashboard/acknowledge', { symbol, all });
    return res.data;
  },
};
