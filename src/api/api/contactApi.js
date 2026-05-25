import api from './api';

/**
 * Public Endpoints
 */

// Get Contact Subjects (Public)
export const getContactSubjects = async () => {
  try {
    const response = await api.get('/api/public/contact/subjects');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Submit Contact Form (Public)
export const submitContactForm = async (data) => {
  try {
    const response = await api.post('/api/public/contact/message', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Admin Endpoints
 */

const ADMIN_CONTACT_BASE_URL = '/admin/api/contact';

// Admin - List All Messages
export const getAdminMessages = async (params = { page: 0, size: 10 }) => {
  try {
    const response = await api.get(`${ADMIN_CONTACT_BASE_URL}/messages`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - Update Message Status
export const updateMessageStatusAdmin = async (id, status) => {
  try {
    const response = await api.put(`${ADMIN_CONTACT_BASE_URL}/messages/${id}/status`, null, { params: { status } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - Delete Message
export const deleteMessageAdmin = async (id) => {
  try {
    const response = await api.delete(`${ADMIN_CONTACT_BASE_URL}/messages/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - List All Subjects
export const getAdminSubjects = async () => {
  try {
    const response = await api.get(`${ADMIN_CONTACT_BASE_URL}/subjects`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - Get Subject by ID
export const getAdminSubjectById = async (id) => {
  try {
    const response = await api.get(`${ADMIN_CONTACT_BASE_URL}/subjects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - Create Subject
export const createSubjectAdmin = async (data) => {
  try {
    const response = await api.post(`${ADMIN_CONTACT_BASE_URL}/subjects`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - Update Subject
export const updateSubjectAdmin = async (id, data) => {
  try {
    const response = await api.put(`${ADMIN_CONTACT_BASE_URL}/subjects/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - Delete Subject
export const deleteSubjectAdmin = async (id) => {
  try {
    const response = await api.delete(`${ADMIN_CONTACT_BASE_URL}/subjects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Contact Settings Endpoints
 */

// Admin - Get Contact Settings
export const getContactSettingsAdmin = async () => {
  try {
    const response = await api.get(`${ADMIN_CONTACT_BASE_URL}/settings`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - Update Contact Settings
export const updateContactSettingsAdmin = async (data) => {
  try {
    const response = await api.put(`${ADMIN_CONTACT_BASE_URL}/settings`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Public - Get Contact Settings
export const getContactSettingsPublic = async () => {
  try {
    const response = await api.get('/api/public/contact/settings');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
