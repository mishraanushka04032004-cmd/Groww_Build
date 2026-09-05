import { apiClient } from '../../../lib/axios.js';

export const authApi = {
  /**
   * Register a new user
   */
  register: async ({ name, email, password }) => {
    const response = await apiClient.post('/auth/register', { name, email, password });
    return response.data;
  },

  /**
   * Authenticate user with credentials
   */
  login: async ({ email, password }) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Request fresh access token using HTTP-only cookie
   */
  refresh: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  /**
   * Terminate session & clear cookies
   */
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  /**
   * Retrieve current authenticated user profile
   */
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
