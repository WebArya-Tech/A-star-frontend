import api from './api';

/**
 * Public Endpoints
 */

// Get all teachers (Public)
export const getPublicTeachers = async () => {
  try {
    const response = await api.get('/api/teachers');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get a single teacher by ID (Public)
export const getPublicTeacherById = async (id) => {
  try {
    const response = await api.get(`/api/teachers/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Admin Endpoints
 */

const ADMIN_TEACHER_BASE_URL = '/api/admin/teachers';

// Get all teachers (Admin)
export const getAllTeachersAdmin = async () => {
  try {
    const response = await api.get(ADMIN_TEACHER_BASE_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get a single teacher by ID (Admin)
export const getTeacherByIdAdmin = async (id) => {
  try {
    const response = await api.get(`${ADMIN_TEACHER_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create a new teacher (Admin)
export const createTeacherAdmin = async (data) => {
  try {
    const payload = {
      fullName: data.fullName,
      mainSubject: data.mainSubject || data.subject,
      speciality: data.speciality || data.specialization || data.specialty,
      category: data.category, // Integrated category field
      bio: data.bio,
      photoUrl: data.photoUrl
    };
    const response = await api.post(ADMIN_TEACHER_BASE_URL, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update a teacher (Admin)
export const updateTeacherAdmin = async (id, data) => {
  try {
    const response = await api.put(`${ADMIN_TEACHER_BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete a teacher (Admin)
export const deleteTeacherAdmin = async (id) => {
  try {
    const response = await api.delete(`${ADMIN_TEACHER_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
