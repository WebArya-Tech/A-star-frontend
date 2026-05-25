import { makeApiCall } from './runtimeApiBase.ts';

export type ContactSubject = {
    id: string;
    name: string;
    displayName: string;
};

export type ContactFormSubmission = {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    subjectId: string;
    messageText: string;
};

export type ContactMessage = {
    id: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    subject: {
        id: string;
        name: string;
    } | null;
    messageText: string;
    status: 'UNREAD' | 'READ' | 'RESOLVED';
    createdAt: string;
    updatedAt: string;
};

export const contactApi = {
    // Public endpoints
    async getSubjects(): Promise<ContactSubject[]> {
        try {
            const response = await makeApiCall<any>('GET', '/api/public/contact/subjects');
            const subjects = Array.isArray(response) ? response : (response?.data || response?.content || []);
            return subjects;
        } catch (error) {
            console.error('Failed to fetch contact subjects:', error);
            // Return fallback hardcoded subjects if API fails
            return [
                { id: '60f1b2b3b3b3b3b3b3b3b3b5', name: 'Course Inquiry', displayName: 'Course Inquiry' },
                { id: '60f1b2b3b3b3b3b3b3b3b3b6', name: 'Technical Support', displayName: 'Technical Support' }
            ];
        }
    },

    async submitForm(data: ContactFormSubmission): Promise<any> {
        try {
            const response = await makeApiCall<any>('POST', '/api/public/contact/message', data);
            return response;
        } catch (error) {
            console.error('Failed to submit contact form:', error);
            throw error;
        }
    },

    // Admin endpoints
    async getAdminSubjects(): Promise<ContactSubject[]> {
        try {
            const response = await makeApiCall<any>('GET', '/api/admin/contact/subjects');
            const subjects = Array.isArray(response) ? response : (response?.data || response?.content || []);
            return Array.isArray(subjects) ? subjects : [];
        } catch (error) {
            console.error('Failed to fetch admin contact subjects:', error);
            // Return fallback hardcoded subjects if API fails
            return [
                { id: '60f1b2b3b3b3b3b3b3b3b3b5', name: 'Course Inquiry', displayName: 'Course Inquiry' },
                { id: '60f1b2b3b3b3b3b3b3b3b3b6', name: 'Technical Support', displayName: 'Technical Support' }
            ];
        }
    },

    async createAdminSubject(data: { name: string }): Promise<ContactSubject> {
        const response = await makeApiCall<any>('POST', '/api/admin/contact/subjects', { name: data.name });
        return response.data || response;
    },

    async deleteAdminSubject(id: string): Promise<void> {
        await makeApiCall('DELETE', `/api/admin/contact/subjects/${id}`);
    },

    async getAdminMessages(params?: { status?: string; page?: number; size?: number; sortBy?: string; sortDir?: string }): Promise<any> {
        const queryParams: Record<string, any> = {};
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) queryParams[key] = String(value);
            });
        }
        return await makeApiCall<any>('GET', '/api/admin/contact/messages', undefined, queryParams);
    },

    async updateAdminMessageStatus(id: string, status: string): Promise<ContactMessage> {
        // Correctly using PUT for status updates as per documentation
        const response = await makeApiCall<any>('PUT', `/api/admin/contact/messages/${id}/status`, undefined, { status });
        return response.data || response;
    },

    async deleteAdminMessage(id: string): Promise<void> {
        await makeApiCall('DELETE', `/api/admin/contact/messages/${id}`);
    }
};
