import { apiClient } from '../../../lib/axios.js';

export const aiApi = {
  getBriefing: async (symbol) => {
    const res = await apiClient.get(`/ai/briefing/${symbol}`);
    return res.data;
  },
};
