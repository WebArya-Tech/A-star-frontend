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

// Get blog archive index
export const getBlogArchive = async () => {
  try {
    const response = await api.get('/api/blogs/archive');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Admin Endpoints
 */

const ADMIN_BLOG_BASE_URL = '/admin/api/blogs';

// Get all blogs for admin (paginated)
export const getAllBlogsAdmin = async (params) => {
  try {
    const response = await api.get(ADMIN_BLOG_BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get blog details by ID (Admin)
export const getBlogByIdAdmin = async (id) => {
  try {
    const response = await api.get(`${ADMIN_BLOG_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create a new blog (Admin/Public)
// Note: Swagger has POST /api/blogs for public submission
export const createBlog = async (data) => {
  try {
    const response = await api.post('/api/blogs', data);
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

// Approve a blog (Admin)
export const approveBlog = async (id) => {
  try {
    const response = await api.post(`${ADMIN_BLOG_BASE_URL}/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Reject a blog (Admin)
export const rejectBlog = async (id) => {
  try {
    const response = await api.post(`${ADMIN_BLOG_BASE_URL}/${id}/reject`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Admin Comment Moderation
 */
const ADMIN_COMMENT_BASE_URL = '/admin/api/comments';

export const getAllCommentsAdmin = async () => {
  try {
    const response = await api.get(`${ADMIN_COMMENT_BASE_URL}/all`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPendingCommentsAdmin = async () => {
  try {
    const response = await api.get(`${ADMIN_COMMENT_BASE_URL}/pending`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const editCommentAdmin = async (id, data) => {
  try {
    const response = await api.put(`${ADMIN_COMMENT_BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteCommentAdmin = async (id) => {
  try {
    const response = await api.delete(`${ADMIN_COMMENT_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const approveCommentAdmin = async (id) => {
  try {
    const response = await api.post(`${ADMIN_COMMENT_BASE_URL}/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Public Blog Interactions (Reactions & Comments)
 */

export const toggleReaction = async (blogId, data) => {
  try {
    const response = await api.post(`/api/blogs/${blogId}/reactions/toggle`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getReactionStatus = async (blogId) => {
  try {
    const response = await api.get(`/api/blogs/${blogId}/reactions/status`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getBlogComments = async (blogId, params) => {
  try {
    const response = await api.get(`/api/blogs/${blogId}/comments`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const postBlogComment = async (blogId, data) => {
  try {
    const response = await api.post(`/api/blogs/${blogId}/comments`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Public Blog Subscriptions
 */
const BLOG_SUBSCRIPTION_BASE_URL = '/api/blogs/subscriptions';

export const requestSubscriptionOtp = async (data) => {
  try {
    const response = await api.post(`${BLOG_SUBSCRIPTION_BASE_URL}/request-otp`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const verifySubscription = async (data) => {
  try {
    const response = await api.post(`${BLOG_SUBSCRIPTION_BASE_URL}/verify`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const unsubscribeBlog = async (data) => {
  try {
    const response = await api.post(`${BLOG_SUBSCRIPTION_BASE_URL}/unsubscribe`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Public Blog Submissions (with OTP)
 */
const BLOG_SUBMISSION_BASE_URL = '/api/blogs/submissions';

export const startBlogSubmission = async (data) => {
  try {
    const response = await api.post(`${BLOG_SUBMISSION_BASE_URL}/start`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const verifyBlogSubmission = async (data) => {
  try {
    const response = await api.post(`${BLOG_SUBMISSION_BASE_URL}/verify`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const finishBlogSubmission = async (data) => {
  try {
    const response = await api.post(`${BLOG_SUBMISSION_BASE_URL}/finish`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
