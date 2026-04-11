type Testimonial = {
    _id: string;
    name: string;
    role: string;
    message: string;
    rating: number;
    status: 'pending' | 'approved' | 'rejected';
};

import { getApiBaseCandidates, setActiveApiBaseUrl } from './runtimeApiBase.ts';

const STORAGE_KEY = 'icfy_testimonials';

const defaultTestimonials: Testimonial[] = [
    {
        _id: 'testimonial-1',
        name: 'Riya Sharma',
        role: 'CFA Level II Candidate',
        message: 'A Star Classes has completely transformed the way I prepare for my CFA exams.',
        rating: 5,
        status: 'approved',
    },
    {
        _id: 'testimonial-2',
        name: 'Aman Verma',
        role: 'IGCSE Student',
        message: 'The tutors are responsive and the classes are structured really well.',
        rating: 4,
        status: 'pending',
    },
];

function readTestimonials(): Testimonial[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as Testimonial[]) : null;
        return parsed && parsed.length > 0 ? parsed : defaultTestimonials;
    } catch {
        return defaultTestimonials;
    }
}

function writeTestimonials(testimonials: Testimonial[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(testimonials));
}

function updateTestimonialStatus(id: string, status: Testimonial['status']): Testimonial[] {
    return readTestimonials().map<Testimonial>((item) => {
        if (item._id !== id) {
            return item;
        }

        return {
            ...item,
            status,
        };
    });
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

export async function getAllTestimonials() {
    try {
        return await tryRequest('/api/admin/testimonials', { method: 'GET' });
    } catch {
        return readTestimonials();
    }
}

export async function approveTestimonial(id: string) {
    try {
        await tryRequest(`/api/admin/testimonials/${id}/approve`, { method: 'POST' });
        writeTestimonials(updateTestimonialStatus(id, 'approved'));
    } catch {
        writeTestimonials(updateTestimonialStatus(id, 'approved'));
    }
}

export async function rejectTestimonial(id: string) {
    try {
        await tryRequest(`/api/admin/testimonials/${id}/reject`, { method: 'POST' });
        writeTestimonials(updateTestimonialStatus(id, 'rejected'));
    } catch {
        writeTestimonials(updateTestimonialStatus(id, 'rejected'));
    }
}

export async function setPrimaryTestimonial(id: string) {
    try {
        await tryRequest(`/api/admin/testimonials/${id}/primary`, { method: 'POST' });
    } catch {
        // Fallback or ignore
    }
}

export async function deleteTestimonial(id: string) {
    try {
        await tryRequest(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
        writeTestimonials(readTestimonials().filter((t) => t._id !== id));
    } catch {
        writeTestimonials(readTestimonials().filter((t) => t._id !== id));
    }
}

export async function submitTestimonial(data: Omit<Testimonial, '_id' | 'status'>) {
    try {
        return await tryRequest('/api/testimonials/submit', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    } catch {
        const testimonials = readTestimonials();
        const newTestimonial: Testimonial = {
            ...data,
            _id: `temp-${Date.now()}`,
            status: 'pending',
        };
        writeTestimonials([...testimonials, newTestimonial]);
        return newTestimonial;
    }
}

export async function getApprovedTestimonials() {
    try {
        return await tryRequest('/api/testimonials/approved', { method: 'GET' });
    } catch {
        return readTestimonials().filter((t) => t.status === 'approved');
    }
}
