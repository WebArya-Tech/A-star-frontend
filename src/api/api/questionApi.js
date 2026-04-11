import api from './api';

/**
 * Public Endpoints
 */

/**
 * Returns a Page of questions. Supports pagination and filtering by category.
 * @param {Object} params - { categoryId, page, size, sort, direction }
 */
export const getQuestions = async (params) => {
  try {
    const response = await api.get('/api/questions', { 
      params: {
        page: params?.page || 0,
        size: params?.size || 10,
        sort: params?.sort || 'createdAt',
        direction: params?.direction || 'desc',
        categoryId: params?.categoryId
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get a single Question object with its parsed HTML
export const getQuestionById = async (id) => {
  try {
    const response = await api.get(`/api/questions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get a Question object by its SEO-friendly slug
export const getQuestionBySlug = async (slug) => {
  try {
    const response = await api.get(`/api/questions/slug/${slug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Admin Endpoints
 */

/**
 * Admin creates a new question.
 * @param {Object} data - { title, descriptionHtml, categoryId }
 */
export const createQuestion = async (data) => {
  try {
    const response = await api.post('/api/admin/questions', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Updates title, HTML, or moves the question to a new category.
 * @param {string} id - Question ID
 * @param {Object} data - { title, descriptionHtml, categoryId }
 */
export const updateQuestion = async (id, data) => {
  try {
    const response = await api.put(`/api/admin/questions/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Hard delete a question (Admin)
export const deleteQuestion = async (id) => {
  try {
    const response = await api.delete(`/api/admin/questions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
