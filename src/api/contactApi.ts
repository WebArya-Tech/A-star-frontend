import { makeApiCall, type QueryRecord } from './runtimeApiBase.ts';

export type ContactSubject = {
    id: string;
    name: string;
    displayName?: string;
    createdAt?: string;
};

export type ContactFormSubmission = {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    subjectId: string;
    messageText: string;
};

export type ContactMessageStatus = 'UNREAD' | 'READ' | 'RESOLVED';

export type ContactMessage = {
    id: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    subjectId?: string;
    subject: { id: string; name: string } | null;
    messageText: string;
    status: ContactMessageStatus;
    createdAt: string;
    updatedAt: string;
};

export type PageResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    pageable?: Record<string, unknown>;
    sort?: Record<string, unknown>;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
};

export type ContactSettings = {
    phoneNumber?: string;
    whatsappNumber?: string;
    emailAddress?: string;
    officeAddress?: string;
    officeHours?: string;
    googleMapsUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
};

export const contactApi = {
    // ── Public endpoints ──

    async getSubjects(): Promise<ContactSubject[]> {
        try {
            const response = await makeApiCall<unknown>('GET', '/api/public/contact/subjects');
            const subjects = Array.isArray(response) ? response : (response as Record<string, unknown>)?.data || (response as Record<string, unknown>)?.content || [];
            return Array.isArray(subjects) ? subjects : [];
        } catch (error) {
            console.error('Failed to fetch contact subjects:', error);
            return [
                { id: '60f1b2b3b3b3b3b3b3b3b3b5', name: 'Course Inquiry' },
                { id: '60f1b2b3b3b3b3b3b3b3b3b6', name: 'Technical Support' },
            ];
        }
    },

    async submitForm(data: ContactFormSubmission): Promise<unknown> {
        return makeApiCall('POST', '/api/public/contact/message', data);
    },

    async getPublicSettings(): Promise<ContactSettings | null> {
        try {
            return await makeApiCall<ContactSettings>('GET', '/api/public/contact/settings');
        } catch {
            return null;
        }
    },

    // ── Admin endpoints ──

    async getAdminSubjects(): Promise<ContactSubject[]> {
        try {
            const response = await makeApiCall<unknown>('GET', '/api/admin/contact/subjects');
            const subjects = Array.isArray(response) ? response : (response as Record<string, unknown>)?.data || (response as Record<string, unknown>)?.content || [];
            return Array.isArray(subjects) ? subjects : [];
        } catch (error) {
            console.error('Failed to fetch admin contact subjects:', error);
            return [
                { id: '60f1b2b3b3b3b3b3b3b3b3b5', name: 'Course Inquiry' },
                { id: '60f1b2b3b3b3b3b3b3b3b3b6', name: 'Technical Support' },
            ];
        }
    },

    async createAdminSubject(data: { name: string }): Promise<ContactSubject> {
        const response = await makeApiCall<unknown>('POST', '/api/admin/contact/subjects', data);
        return (response as Record<string, unknown>)?.data as ContactSubject || (response as ContactSubject);
    },

    async deleteAdminSubject(id: string): Promise<void> {
        await makeApiCall('DELETE', `/api/admin/contact/subjects/${id}`);
    },

    async getAdminMessages(params?: {
        status?: string;
        page?: number;
        size?: number;
        sortBy?: string;
        sortDir?: string;
    }): Promise<PageResponse<ContactMessage>> {
        const queryParams: Record<string, string> = {};
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) queryParams[key] = String(value);
            });
        }
        return makeApiCall<PageResponse<ContactMessage>>(
            'GET',
            '/api/admin/contact/messages',
            undefined,
            queryParams as QueryRecord
        );
    },

    async updateAdminMessageStatus(id: string, status: string): Promise<ContactMessage> {
        const response = await makeApiCall<unknown>(
            'PUT',
            `/api/admin/contact/messages/${id}/status`,
            undefined,
            { status } as QueryRecord
        );
        return (response as Record<string, unknown>)?.data as ContactMessage || (response as ContactMessage);
    },

    async deleteAdminMessage(id: string): Promise<void> {
        await makeApiCall('DELETE', `/api/admin/contact/messages/${id}`);
    },

    async getAdminSettings(): Promise<ContactSettings | null> {
        try {
            return await makeApiCall<ContactSettings>('GET', '/api/admin/contact/settings');
        } catch {
            return null;
        }
    },

    async updateAdminSettings(data: ContactSettings): Promise<ContactSettings | null> {
        try {
            return await makeApiCall<ContactSettings>('PUT', '/api/admin/contact/settings', data);
        } catch {
            return null;
        }
    },
};
