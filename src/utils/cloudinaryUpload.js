import axios from 'axios';
import { getMediaSignature } from '../api/api/answerApi';

/**
 * Uploads a file directly to Cloudinary using a backend-generated signature.
 * @param {File} file - The file to upload.
 * @returns {Promise<string>} - The URL of the uploaded resource.
 */
export const uploadToCloudinary = async (file) => {
  try {
    // 1. Get signature from backend
    const signatureData = await getMediaSignature();
    const { signature, timestamp, cloud_name, api_key, folder } = signatureData;

    // 2. Prepare FormData for Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', api_key);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    // 3. Post to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`;
    const response = await axios.post(uploadUrl, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload media. Please try again.');
  }
};
