type RunningClass = Record<string, unknown> & { id: number | string };

import { getApiBaseCandidates, setActiveApiBaseUrl } from './runtimeApiBase.ts';

const STORAGE_KEY = 'icfy_running_classes';

const defaultClasses: RunningClass[] = [
    {
        id: 1,
        subject: 'UG Mathematics',
        level: 'Undergraduate',
        instructor: 'Ms. Neha Aggarwal',
        schedule: 'Mon, Wed, Fri - 6:00 PM IST',
        students: '12-15',
        description: 'Comprehensive mathematics coverage for B.Sc and B.Tech students',
        image: '',
        status: 'Active',
        enrolledStudents: [],
    },
];

function readClasses(): RunningClass[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as RunningClass[]) : null;
        return parsed && parsed.length > 0 ? parsed : defaultClasses;
    } catch {
        return defaultClasses;
    }
}

function writeClasses(classes: RunningClass[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
}

async function tryRequest(path: string, options?: RequestInit) {
    const pathCandidates = path.startsWith('/api/') ? [path] : [path, `/api${path}`];
    let lastError: Error | null = null;

    for (const baseUrl of getApiBaseCandidates()) {
        for (const candidatePath of pathCandidates) {
            try {
                const response = await fetch(`${baseUrl}${candidatePath}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(localStorage.getItem('icfy_token') && {
                            'Authorization': `Bearer ${localStorage.getItem('icfy_token')}`
                        }),
                        ...(options?.headers || {})
                    },
                    ...options,
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        lastError = new Error(`Not found: ${candidatePath}`);
                        continue;
                    }
                    throw new Error(`Request failed with status ${response.status}`);
                }

                setActiveApiBaseUrl(baseUrl);
                return response.json();
            } catch (error) {
                lastError = error instanceof Error ? error : new Error('Network error');
            }
        }
    }

    throw lastError || new Error('Request failed');
}

export const runningClassesApi = {
    async getAll() {
        try {
            const data = await tryRequest('/running-classes', { method: 'GET' });
            return { data };
        } catch {
            return { data: readClasses() };
        }
    },

    async create(payload: Omit<RunningClass, 'id'>) {
        try {
            const data = await tryRequest('/running-classes', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            return { data };
        } catch {
            const classes = readClasses();
            const next = { ...payload, id: Date.now() } as RunningClass;
            const updated = [...classes, next];
            writeClasses(updated);
            return { data: next };
        }
    },

    async update(id: number | string, payload: Partial<RunningClass>) {
        try {
            const data = await tryRequest(`/running-classes/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
            });
            return { data };
        } catch {
            const updated = readClasses().map((item) => (item.id === id ? { ...item, ...payload } : item));
            writeClasses(updated);
            return { data: updated.find((item) => item.id === id) };
        }
    },

    async delete(id: number | string) {
        try {
            const data = await tryRequest(`/running-classes/${id}`, { method: 'DELETE' });
            return { data };
        } catch {
            const updated = readClasses().filter((item) => item.id !== id);
            writeClasses(updated);
            return { data: { success: true } };
        }
    },
};
