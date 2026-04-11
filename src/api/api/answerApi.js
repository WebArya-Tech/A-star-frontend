import api from './api';

/**
 * Public Endpoints
 */

/**
 * Fetches ONLY the APPROVED answers for a specific question ID to display publicly.
 * @param {string} questionId - Question ID
 */
export const getApprovedAnswersByQuestion = async (questionId) => {
  try {
    const response = await api.get(`/api/answers/question/${questionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * User Endpoints
 */

/**
 * A logged-in user submits an answer. It defaults to PENDING internally.
 * @param {Object} data - { questionId, contentHtml }
 */
export const submitAnswer = async (data) => {
  try {
    const response = await api.post('/api/answers', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Media Signature Endpoint
 */

/**
 * The backend returns a cryptographically signed ticket for direct Cloudinary upload.
 * @returns { signature, timestamp, cloud_name, api_key, folder }
 */
export const getMediaSignature = async () => {
  try {
    const response = await api.get('/api/media/signature');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Admin Endpoints
 */

/**
 * Admin dashboard queue for reviewing answers.
 * @param {Object} params - { status: 'PENDING', questionId, page, size }
 */
export const getAdminAnswers = async (params) => {
  try {
    const response = await api.get('/api/admin/answers', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Switches answer to APPROVED and emails the author (Admin)
export const approveAnswer = async (id) => {
  try {
    const response = await api.patch(`/api/admin/answers/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Switches answer to REJECTED and emails the author with the reason (Admin).
 * @param {string} id - Answer ID
 * @param {string} reason - Rejection reason
 */
export const rejectAnswer = async (id, reason) => {
  try {
    const response = await api.patch(`/api/admin/answers/${id}/reject`, null, {
      params: { reason }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Hard deletes an answer (Admin)
export const deleteAnswer = async (id) => {
  try {
    const response = await api.delete(`/api/admin/answers/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
