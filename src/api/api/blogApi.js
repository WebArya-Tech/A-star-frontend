import api from './api';

/**
 * Public Endpoints
 */

// Get all published blogs with pagination
export const getBlogs = async (params) => {
  try {
    const response = await api.get('/api/blogs', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get a single blog by slug
export const getBlogBySlug = async (slug) => {
  try {
    const response = await api.get(`/api/blogs/${slug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Admin Endpoints
 */

const ADMIN_BLOG_BASE_URL = '/api/admin/blogs';

// Get all blogs for admin (paginated)
export const getAllBlogsAdmin = async (params) => {
  try {
    const response = await api.get(ADMIN_BLOG_BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create a new blog (Admin)
export const createBlog = async (data) => {
  try {
    const response = await api.post(ADMIN_BLOG_BASE_URL, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update a blog (Admin)
export const updateBlog = async (id, data) => {
  try {
    const response = await api.put(`${ADMIN_BLOG_BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete a blog (Admin)
export const deleteBlog = async (id) => {
  try {
    const response = await api.delete(`${ADMIN_BLOG_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Approve/Publish a blog (Admin)
export const publishBlog = async (id) => {
  try {
    const response = await api.patch(`${ADMIN_BLOG_BASE_URL}/${id}/publish`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
