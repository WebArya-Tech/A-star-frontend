import api from './api';

const ADMIN_AUTH_BASE_URL = '/api/admin/auth';
const USER_AUTH_BASE_URL = '/api/auth';

/**
 * User Journey (OTP Login)
 */

// Step 1: Request OTP
export const requestUserOTP = async (email, isResend = false) => {
  try {
    const response = await api.post(`${USER_AUTH_BASE_URL}/start`, { email, isResend });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Step 2: Verify OTP & Get Token
export const verifyUserOTP = async (data) => {
  try {
    // data: { email, otp, name (opt), mobile (opt) }
    const response = await api.post(`${USER_AUTH_BASE_URL}/verify`, data);
    if (response.data.token) {
      localStorage.setItem('icfy_token', response.data.token);
      localStorage.setItem('icfy_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * User Journey (Email/Password)
 */

// User Login with Password
export const loginWithPassword = async (email, password) => {
  try {
    const response = await api.post(`${USER_AUTH_BASE_URL}/login-password`, { email, password });
    if (response.data.token) {
      localStorage.setItem('icfy_token', response.data.token);
      localStorage.setItem('icfy_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// User Forgot Password (Request OTP)
export const userForgotPassword = async (email) => {
  try {
    const response = await api.post(`${USER_AUTH_BASE_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// User Reset Password
export const userResetPassword = async (data) => {
  try {
    // data: { email, otp, newPassword }
    const response = await api.post(`${USER_AUTH_BASE_URL}/reset-password`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Admin Journey (Email/Password)
 */

// Admin Login
export const adminLogin = async (email, password) => {
  try {
    const response = await api.post(`${ADMIN_AUTH_BASE_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('icfy_token', response.data.token);
      localStorage.setItem('icfy_user', JSON.stringify(response.data.user));
      localStorage.setItem('icfy_role', 'admin');
      localStorage.setItem('adminAuth', 'true');
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin Login OTP (Request)
export const requestAdminLoginOTP = async (email) => {
  try {
    const response = await api.post(`${ADMIN_AUTH_BASE_URL}/login/otp/request`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin Login OTP (Verify)
export const verifyAdminLoginOTP = async (data) => {
  try {
    // data: { email, otp }
    const response = await api.post(`${ADMIN_AUTH_BASE_URL}/login/otp/verify`, data);
    if (response.data.token) {
      localStorage.setItem('icfy_token', response.data.token);
      localStorage.setItem('icfy_user', JSON.stringify(response.data.user));
      localStorage.setItem('icfy_role', 'admin');
      localStorage.setItem('adminAuth', 'true');
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin Forgot Password (Request OTP)
export const adminForgotPassword = async (email) => {
  try {
    const response = await api.post(`${ADMIN_AUTH_BASE_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin Reset Password
export const adminResetPassword = async (data) => {
  try {
    // data: { email, otp, newPassword }
    const response = await api.post(`${ADMIN_AUTH_BASE_URL}/reset-password`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const logout = () => {
  localStorage.removeItem('icfy_token');
  localStorage.removeItem('icfy_user');
  localStorage.removeItem('icfy_role');
  localStorage.removeItem('adminAuth');
};
