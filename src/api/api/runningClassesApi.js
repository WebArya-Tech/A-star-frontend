import api from './api';

/**
 * Public Endpoints
 */

// List Active Classes (Public)
export const getActiveClasses = async (params = {}) => {
  try {
    // Try both /api/classes and /api/public/classes if one fails, 
    // but default to /api/classes as it seems to be the intended path
    const response = await api.get('/api/classes', { params });
    return response.data;
  } catch (error) {
    // Fallback for some environments that might use /api/public/
    if (error.response?.status === 404) {
      try {
        const response = await api.get('/api/public/classes', { params });
        return response.data;
      } catch (innerError) {
        throw innerError.response?.data || innerError;
      }
    }
    throw error.response?.data || error;
  }
};

// Get a Single Class
export const getClassById = async (id) => {
  try {
    const response = await api.get(`/api/classes/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * User Endpoints (Login Required)
 */

// Enroll in a Class
export const enrollInClass = async (classId, data) => {
  try {
    const response = await api.post(`/api/classes/${classId}/enroll`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get My Enrollments
export const getMyEnrollments = async () => {
  try {
    const response = await api.get('/api/classes/my-enrollments');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Cancel My Enrollment
export const cancelMyEnrollment = async (enrollmentId) => {
  try {
    const response = await api.post(`/api/classes/enrollments/${enrollmentId}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Admin Endpoints
 */

const ADMIN_CLASS_BASE_URL = '/admin/api/classes';

// Admin - List All Classes
export const getAllClassesAdmin = async (params = { page: 0, size: 10 }) => {
  try {
    const response = await api.get(ADMIN_CLASS_BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - Create Class
export const createClassAdmin = async (data) => {
  try {
    const response = await api.post(ADMIN_CLASS_BASE_URL, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - Update Class
export const updateClassAdmin = async (id, data) => {
  try {
    const response = await api.put(`${ADMIN_CLASS_BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - Delete Class
export const deleteClassAdmin = async (id) => {
  try {
    const response = await api.delete(`${ADMIN_CLASS_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - List All Enrollments
export const getAllEnrollmentsAdmin = async (params = { page: 0, size: 10 }) => {
  try {
    const response = await api.get(`${ADMIN_CLASS_BASE_URL}/enrollments`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - Get Single Enrollment
export const getEnrollmentByIdAdmin = async (id) => {
  try {
    const response = await api.get(`${ADMIN_CLASS_BASE_URL}/enrollments/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - Get Single Class
export const getClassByIdAdmin = async (id) => {
  try {
    const response = await api.get(`${ADMIN_CLASS_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - Confirm Enrollment
export const confirmEnrollmentAdmin = async (id) => {
  try {
    const response = await api.post(`${ADMIN_CLASS_BASE_URL}/enrollments/${id}/confirm`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - Reject Enrollment
export const rejectEnrollmentAdmin = async (id, reason) => {
  try {
    const response = await api.post(`${ADMIN_CLASS_BASE_URL}/enrollments/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin - Delete Enrollment
export const deleteEnrollmentAdmin = async (id) => {
  try {
    const response = await api.delete(`${ADMIN_CLASS_BASE_URL}/enrollments/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
