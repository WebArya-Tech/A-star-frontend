import api from './api';

/**
 * Public Endpoints
 */

// Lists all globally approved testimonials
export const getApprovedTestimonials = async () => {
  try {
    const response = await api.get('/api/testimonials');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Lists approved testimonials for a specific teacher
export const getApprovedTestimonialsByTeacher = async (teacherId) => {
  try {
    const response = await api.get(`/api/testimonials/teacher/${teacherId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Gets the single primary/featured testimonial (Public)
export const getPrimaryTestimonial = async () => {
  try {
    const response = await api.get('/api/testimonials/primary');
    return response.data;
  } catch (error) {
    // If no primary testimonial is set, return null instead of throwing
    if (error.response?.status === 404) {
      return null;
    }
    throw error.response?.data || error;
  }
};

/**
 * User/Public Endpoints
 */

/**
 * A user submits a testimonial for moderation.
 */
export const submitTestimonial = async (data) => {
  try {
    // According to Swagger, public submission is POST /api/testimonials
    const response = await api.post('/api/testimonials', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Admin Endpoints
 */

const ADMIN_TESTIMONIAL_BASE_URL = '/api/admin/testimonials';

// Get all testimonials for admin dashboard (supports pagination/filtering)
export const getAllTestimonials = async (params) => {
  try {
    const response = await api.get(ADMIN_TESTIMONIAL_BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create a new testimonial (Admin)
export const createTestimonialAdmin = async (data) => {
  try {
    const payload = {
      text: data.text || data.message || data.quote || data.content,
      mediaUrl: data.mediaUrl || data.image || data.videoUrl || data.audioUrl || (data.type === 'URL' ? data.content : '')
    };
    const response = await api.post(ADMIN_TESTIMONIAL_BASE_URL, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Approve a testimonial (Admin)
export const approveTestimonial = async (id) => {
  try {
    const response = await api.post(`${ADMIN_TESTIMONIAL_BASE_URL}/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Reject a testimonial (Admin)
export const rejectTestimonial = async (id) => {
  try {
    const response = await api.post(`${ADMIN_TESTIMONIAL_BASE_URL}/${id}/reject`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update a testimonial (Admin)
export const updateTestimonial = async (id, data) => {
  try {
    const response = await api.put(`${ADMIN_TESTIMONIAL_BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Set primary testimonial (Admin)
export const setPrimaryTestimonial = async (id) => {
  try {
    const response = await api.post(`${ADMIN_TESTIMONIAL_BASE_URL}/${id}/primary`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Hard delete a testimonial (Admin)
export const deleteTestimonial = async (id) => {
  try {
    const response = await api.delete(`${ADMIN_TESTIMONIAL_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Export all testimonials as CSV (Admin)
export const exportTestimonialsToCSV = async () => {
  try {
    const response = await api.get('/api/admin/export/testimonials', {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Export all testimonials (Admin)
export const exportTestimonials = async () => {
  try {
    const response = await api.get('/api/admin/export/testimonials', {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `testimonials-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    throw error.response?.data || error;
  }
};
