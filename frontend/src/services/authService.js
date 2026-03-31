import api from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Auth Service — handles login, register, and profile API calls.
 */
const authService = {
  async login(email, password) {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    return response.data;
  },

  async register(name, email, password) {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, { name, email, password });
    return response.data;
  },

  async getProfile() {
    const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },
};

export default authService;
