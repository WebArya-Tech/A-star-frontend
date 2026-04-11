import { getApiBaseCandidates, setActiveApiBaseUrl } from './runtimeApiBase.ts';

type AskQuestion = {
    id: string;
    category: string;
    course: string;
    topic: string;
    description: string;
    attachment?: string;
    status: 'Open' | 'Answered' | 'Closed';
    answer?: string;
    createdAt: string;
};

const STORAGE_KEY = 'astar_ask_questions';

function readLocalQuestions(): AskQuestion[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as AskQuestion[]) : [];
    } catch {
        return [];
    }
}

function writeLocalQuestions(data: AskQuestion[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

export const askApi = {
    async getAll() {
        try {
            const data = await tryRequest('/ask', { method: 'GET' });
            return { data };
        } catch {
            return { data: readLocalQuestions() };
        }
    },

    async create(payload: Omit<AskQuestion, 'id' | 'createdAt' | 'status'>) {
        try {
            const data = await tryRequest('/ask', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            return { data };
        } catch {
            const existing = readLocalQuestions();
            const next: AskQuestion = {
                ...payload,
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                createdAt: new Date().toISOString(),
                status: 'Open',
            };
            const updated = [next, ...existing];
            writeLocalQuestions(updated);
            return { data: next };
        }
    },

    async update(id: string, payload: Partial<Omit<AskQuestion, 'id' | 'createdAt'>>) {
        try {
            const data = await tryRequest(`/ask/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
            });
            return { data };
        } catch {
            const existing = readLocalQuestions();
            const updated = existing.map((item) => (item.id === id ? { ...item, ...payload } : item));
            writeLocalQuestions(updated);
            return { data: updated.find((item) => item.id === id) };
        }
    },
};
