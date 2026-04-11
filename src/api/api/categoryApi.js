import api from './api';

/**
 * Public Endpoints
 */

// Get all taxonomy categories
export const getCategories = async () => {
  try {
    const response = await api.get('/api/categories');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get a single category by ID
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get a category by its slug
export const getCategoryBySlug = async (slug) => {
  try {
    const response = await api.get(`/api/categories/slug/${slug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Admin Endpoints
 */

// Create a new category (Admin)
export const createCategory = async (name) => {
  try {
    const response = await api.post('/api/admin/categories', { name });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update category (Admin)
export const updateCategory = async (id, name) => {
  try {
    const response = await api.put(`/api/admin/categories/${id}`, { name });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete category (Admin)
export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/api/admin/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
