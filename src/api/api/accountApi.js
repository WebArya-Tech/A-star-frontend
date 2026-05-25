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

/**
 * Change current user password
 * @param {Object} data - { currentPassword, newPassword }
 */
export const changePassword = async (data) => {
  try {
    const response = await api.post('/api/account/change-password', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
