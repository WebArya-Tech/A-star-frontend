import api from './api';

/**
 * Get current logged in user details
 */
export const getMe = async () => {
  try {
    const response = await api.get('/api/account/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
