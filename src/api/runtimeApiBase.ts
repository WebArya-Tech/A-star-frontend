const ACTIVE_API_BASE_URL_STORAGE_KEY = 'icfy_active_api_base_url';
const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8080';

export type Primitive = string | number | boolean;
export type QueryValue = Primitive | null | undefined;
export type QueryRecord = Record<string, QueryValue>;

export class ApiError extends Error {
    response?: { data?: unknown; status: number };

    constructor(message: string, status: number, data?: unknown) {
        super(message);
        this.name = 'ApiError';
        this.response = { data, status };
    }
}

function normalizeBaseUrl(value?: string | null) {
    return String(value || '').trim().replace(/\/$/, '');
}

export function getStoredActiveApiBaseUrl() {
    try {
        const stored = localStorage.getItem(ACTIVE_API_BASE_URL_STORAGE_KEY);
        // If stored value is old (8009, 8024), clear it
        if (stored && (stored.includes(':8009') || stored.includes(':8024'))) {
            localStorage.removeItem(ACTIVE_API_BASE_URL_STORAGE_KEY);
            return '';
        }
        return normalizeBaseUrl(stored);
    } catch {
        return '';
    }
}

export function setActiveApiBaseUrl(baseUrl: string) {
    const normalized = normalizeBaseUrl(baseUrl);
    if (!normalized) return;
    localStorage.setItem(ACTIVE_API_BASE_URL_STORAGE_KEY, normalized);
}

export function clearActiveApiBaseUrl() {
    localStorage.removeItem(ACTIVE_API_BASE_URL_STORAGE_KEY);
}

export function getApiBaseCandidates() {
    const candidates = [
        DEFAULT_API_BASE_URL, // Prioritize the .env value (port 9014)
        getStoredActiveApiBaseUrl(),
    ].map(normalizeBaseUrl).filter(Boolean);

    return Array.from(new Set(candidates));
}

export function getPreferredApiBaseUrl() {
    return getApiBaseCandidates()[0] || DEFAULT_API_BASE_URL;
}

export async function makeApiCall<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: unknown,
    query?: QueryRecord
): Promise<T> {
    const candidates = getApiBaseCandidates();

    for (const baseUrl of candidates) {
        try {
            const url = new URL(endpoint.startsWith('/') ? endpoint : `/${endpoint}`, baseUrl);

            if (query) {
                Object.entries(query).forEach(([key, value]) => {
                    if (value != null) {
                        url.searchParams.set(key, String(value));
                    }
                });
            }

            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            const token = localStorage.getItem('icfy_token');
            // Only add auth header if token exists AND it's not a public endpoint
            if (token && !endpoint.includes('/public/') && !endpoint.includes('/api/auth/')) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url.toString(), {
                method,
                headers,
                ...(data ? { body: JSON.stringify(data) } : {})
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = await response.text().catch(() => null);
                }
                throw new ApiError(
                    `HTTP ${response.status}: ${response.statusText}`,
                    response.status,
                    errorData
                );
            }

            const result = await response.json();
            setActiveApiBaseUrl(baseUrl);
            return result;
        } catch (error) {
            console.warn(`API call failed for ${baseUrl}${endpoint}:`, error);
            if (baseUrl === candidates[candidates.length - 1]) {
                throw error;
            }
        }
    }

    throw new Error(`All API endpoints failed for ${endpoint}`);
}
