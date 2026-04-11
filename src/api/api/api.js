import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth headers
api.interceptors.request.use(
    (config) => {
        // Skip auth for public routes and initial auth requests
        const isPublic = config.url.includes('/api/public/') || 
                        config.url.includes('/api/auth/start') || 
                        config.url.includes('/api/auth/verify');
        
        // Try JWT token from localStorage for both students and admins
        const token = localStorage.getItem('icfy_token');
        if (token && !isPublic) {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        }

        // Only fallback to Basic Auth for the login endpoint if needed, or if specified via env
        // Otherwise, public routes should not have auth headers.
        const username = import.meta.env.VITE_ADMIN_USERNAME;
        const password = import.meta.env.VITE_ADMIN_PASSWORD;
        
        // Only use Basic Auth if we're hitting an admin auth endpoint OR if the developer explicitly wants it.
        if (config.url.includes('/api/admin/') && username && password) {
            const credentials = btoa(`${username}:${password}`);
            config.headers.Authorization = `Basic ${credentials}`;
            return config;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => {
        console.log('API Response Success:', response.status, response.config.url);
        console.log('Response data:', response.data);
        return response;
    },
    (error) => {
        console.error('API Response Error:', error.response?.status, error.config?.url);
        console.error('Error data:', error.response?.data);
        console.error('Error message:', error.message);
        
        if (error.response?.status === 401) {
            // Unauthorized - clear auth and let App.jsx handle navigation
            localStorage.removeItem('icfy_token');
            localStorage.removeItem('icfy_user');
            localStorage.removeItem('icfy_role');
            localStorage.removeItem('adminAuth');
            // DO NOT use window.location.href as it causes a hard reload that clears state
            // App.jsx route protection will handle navigation based on auth state change
        }
        return Promise.reject(error);
    }
);

export default api;
