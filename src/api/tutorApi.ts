import { getApiBaseCandidates, setActiveApiBaseUrl } from './runtimeApiBase.ts';

export type Tutor = {
    _id: string;
    name: string;
    subject: string;
    specialty: string;
    image: string;
    bio: string;
    category: 'IGCSE' | 'AS/A Level' | 'All';
    status: 'active' | 'inactive';
};

const STORAGE_KEY = 'astar_tutors';

const defaultTutors: Tutor[] = [
    {
        _id: 'tutor-1',
        name: 'Aishwarya',
        subject: 'Mathematics',
        specialty: 'IGCSE Specialist',
        image: '/src/assets/AISHWARYA.png',
        bio: 'Expert in IGCSE Mathematics with over 5 years of teaching experience.',
        category: 'IGCSE',
        status: 'active'
    },
    {
        _id: 'tutor-2',
        name: 'Rohit Gupta',
        subject: 'Physics',
        specialty: 'AS/A Level Specialist',
        image: '/src/assets/Rohit Gupta.png',
        bio: 'Specializes in Advanced Physics for AS/A Level students.',
        category: 'AS/A Level',
        status: 'active'
    },
    {
        _id: 'tutor-3',
        name: 'Balu',
        subject: 'Chemistry',
        specialty: 'IGCSE & AS/A Level Expert',
        image: '/src/assets/Balu.PNG',
        bio: 'Chemistry specialist with focus on practical learning.',
        category: 'AS/A Level',
        status: 'active'
    },
    {
        _id: 'tutor-4',
        name: 'Saritha',
        subject: 'Biology',
        specialty: 'IGCSE Specialist',
        image: '/src/assets/SARITHA.PNG',
        bio: 'Dedicated Biology teacher for IGCSE students.',
        category: 'IGCSE',
        status: 'active'
    },
    {
        _id: 'tutor-5',
        name: 'Neha',
        subject: 'English',
        specialty: 'IGCSE Specialist',
        image: '/src/assets/Neha.png',
        bio: 'Experienced English language and literature educator.',
        category: 'IGCSE',
        status: 'active'
    },
    {
        _id: 'tutor-6',
        name: 'Rakesh',
        subject: 'Computer Science',
        specialty: 'AS/A Level Specialist',
        image: '/src/assets/Rakesh.jpg',
        bio: 'Expert in programming and computer science concepts.',
        category: 'AS/A Level',
        status: 'active'
    },
    {
        _id: 'tutor-7',
        name: 'Ram Mohan',
        subject: 'Economics',
        specialty: 'AS/A Level Specialist',
        image: '/src/assets/Ram Mohan.jpg',
        bio: 'Specialist in Economics and Business Studies.',
        category: 'AS/A Level',
        status: 'active'
    },
    {
        _id: 'tutor-8',
        name: 'Ramya',
        subject: 'Business Studies',
        specialty: 'IGCSE Specialist',
        image: '/src/assets/Ramya.PNG',
        bio: 'Dedicated teacher for Business Studies and Commerce.',
        category: 'IGCSE',
        status: 'active'
    }
];

function readTutors(): Tutor[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as any[]) : null;

        if (parsed && parsed.length > 0) {
            // Migration for categories
            return parsed.map(t => {
                if (t.category === 'AS Level' || t.category === 'A Level' || t.category === 'SAT') {
                    return { ...t, category: 'AS/A Level' };
                }
                return t as Tutor;
            });
        }
        return defaultTutors;
    } catch {
        return defaultTutors;
    }
}

function writeTutors(tutors: Tutor[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tutors));
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

export async function getAllTutors() {
    try {
        return await tryRequest('/tutors/all', { method: 'GET' });
    } catch {
        return readTutors();
    }
}

export async function addTutor(tutorData: Omit<Tutor, '_id'>) {
    try {
        return await tryRequest('/tutors/add', {
            method: 'POST',
            body: JSON.stringify(tutorData)
        });
    } catch {
        const tutors = readTutors();
        const newTutor = { ...tutorData, _id: `tutor-${Date.now()}` };
        writeTutors([...tutors, newTutor]);
        return newTutor;
    }
}

export async function updateTutor(id: string, tutorData: Partial<Tutor>) {
    try {
        return await tryRequest(`/tutors/${id}`, {
            method: 'PUT',
            body: JSON.stringify(tutorData)
        });
    } catch {
        const tutors = readTutors();
        const updated = tutors.map(t => t._id === id ? { ...t, ...tutorData } : t);
        writeTutors(updated);
        return { success: true };
    }
}

export async function deleteTutor(id: string) {
    try {
        return await tryRequest(`/tutors/${id}`, { method: 'DELETE' });
    } catch {
        const tutors = readTutors();
        const updated = tutors.filter(t => t._id !== id);
        writeTutors(updated);
        return { success: true };
    }
}
