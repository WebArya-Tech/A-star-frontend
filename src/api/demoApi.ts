import { makeApiCall, type QueryRecord } from './runtimeApiBase.ts';

const FORCE_LOCAL_DEMO_API = String(import.meta.env.VITE_USE_LOCAL_DEMO_API || '').toLowerCase() === 'true';
const USE_LOCAL_MODE = FORCE_LOCAL_DEMO_API;

const DEMO_GRADES_STORAGE_KEY = 'icfy_demo_grades_v4';
const DEMO_BOARDS_STORAGE_KEY = 'icfy_demo_boards_v4';
const DEMO_SCHEDULES_STORAGE_KEY = 'icfy_demo_schedules';

type Grade = {
    id: string;
    name: string;
    displayName: string;
};

type Board = {
    id: string;
    name: string;
    displayName: string;
};

type PageResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
};

export type DemoScheduleRequest = {
    studentName: string;
    parentName: string;
    gradeId: string;
    boardId: string;
    emailId: string;
    mobileNumber: string;
    preferredDate: string;
    preferredTime: string;
    otp: string;
    scheduledAt: string;
};

type DemoScheduleResponse = {
    id: string;
    status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    meetingLink?: string;
    scheduledAt: string;
};

type AdminDemoSchedule = {
    id: string;
    studentName: string;
    parentName: string;
    emailId: string;
    mobileNumber: string;
    boardId?: string;
    board?: { id: string; name: string; createdAt?: string } | null;
    gradeId?: string;
    grade?: { id: string; name: string; createdAt?: string } | null;
    preferredDate: string;
    preferredTime: string;
    status: 'PENDING' | 'APPROVED' | 'CANCELLED';
    cancelReason?: string;
    createdAt: string;
    updatedAt: string;
};

type OtpResponse = {
    success: boolean;
    message: string;
    otpSent?: boolean;
};

async function getGrades(): Promise<Grade[]> {
    if (USE_LOCAL_MODE) {
        const stored = localStorage.getItem(DEMO_GRADES_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }

        const localGrades: Grade[] = [
            { id: '9', name: 'Grade 9', displayName: 'Grade 9' },
            { id: '10', name: 'Grade 10', displayName: 'Grade 10' },
            { id: '11', name: 'Grade 11', displayName: 'Grade 11' },
            { id: '12', name: 'Grade 12', displayName: 'Grade 12' }
        ];

        localStorage.setItem(DEMO_GRADES_STORAGE_KEY, JSON.stringify(localGrades));
        return localGrades;
    }

    try {
        const response = await makeApiCall<{ data: Grade[] }>('GET', '/api/public/demo/settings/grades');
        const grades = response.data;
        localStorage.setItem(DEMO_GRADES_STORAGE_KEY, JSON.stringify(grades));
        return grades;
    } catch (error) {
        console.error('Failed to fetch grades:', error);
        // Fallback to local data
        const stored = localStorage.getItem(DEMO_GRADES_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return getLocalGrades();
    }
}

function getLocalGrades(): Grade[] {
    return [
        { id: "69f59c3b7fba777198d8f380", name: "Grade 8", displayName: "Grade 8" },
        { id: "69f59c3b7fba777198d8f381", name: "Grade 9", displayName: "Grade 9" },
        { id: "69f59c3b7fba777198d8f382", name: "Grade 10", displayName: "Grade 10" },
        { id: "69f59c3b7fba777198d8f383", name: "Grade 11", displayName: "Grade 11" },
        { id: "69f59c3b7fba777198d8f384", name: "Grade 12", displayName: "Grade 12" }
    ];
}

function getLocalBoards(): Board[] {
    return [
        { id: "69f59c3b7fba777198d8f379", name: "AS level and A level", displayName: "AS level and A level" },
        { id: "69f59c3b7fba777198d8f37b", name: "IGCSE", displayName: "IGCSE" }
    ];
}

function filterDemoBoards(boards: Board[]): Board[] {
    if (!Array.isArray(boards) || boards.length === 0) return getLocalBoards();
    // Return all boards from API if available, only fallback to hardcoded if empty
    return boards.map(b => ({
        ...b,
        displayName: b.displayName || b.name
    }));
}

async function getBoards(): Promise<Board[]> {
    if (USE_LOCAL_MODE) {
        const stored = localStorage.getItem(DEMO_BOARDS_STORAGE_KEY);
        if (stored) {
            return filterDemoBoards(JSON.parse(stored));
        }

        const localBoards: Board[] = getLocalBoards();

        localStorage.setItem(DEMO_BOARDS_STORAGE_KEY, JSON.stringify(localBoards));
        return localBoards;
    }

    try {
        const response = await makeApiCall<{ data: Board[] }>('GET', '/api/public/demo/settings/boards');
        const boards = filterDemoBoards(response.data);
        localStorage.setItem(DEMO_BOARDS_STORAGE_KEY, JSON.stringify(boards));
        return boards;
    } catch (error) {
        console.error('Failed to fetch boards:', error);
        // Fallback to local data
        const stored = localStorage.getItem(DEMO_BOARDS_STORAGE_KEY);
        if (stored) {
            return filterDemoBoards(JSON.parse(stored));
        }
        return getLocalBoards();
    }
}

async function scheduleDemo(demoData: DemoScheduleRequest): Promise<DemoScheduleResponse> {
    if (USE_LOCAL_MODE) {
        // Simulate successful scheduling
        const response: DemoScheduleResponse = {
            id: `demo_${Date.now()}`,
            status: 'SCHEDULED',
            scheduledAt: `${demoData.preferredDate}T${demoData.preferredTime}:00Z`
        };

        // Store in localStorage for demo purposes
        const storedDemos = JSON.parse(localStorage.getItem('icfy_demo_schedules') || '[]');
        storedDemos.push({ ...demoData, ...response, createdAt: new Date().toISOString() });
        localStorage.setItem('icfy_demo_schedules', JSON.stringify(storedDemos));

        return response;
    }

    try {
        const response = await makeApiCall<DemoScheduleResponse>('POST', '/api/public/demo/schedule', demoData);
        return response;
    } catch (error) {
        console.error('Failed to schedule demo:', error);
        throw error;
    }
}

async function sendDemoOtp(email: string): Promise<OtpResponse> {
    if (USE_LOCAL_MODE) {
        // Simulate OTP sending
        return {
            success: true,
            message: 'OTP sent successfully',
            otpSent: true
        };
    }

    try {
        const response = await makeApiCall<OtpResponse>('POST', '/api/public/demo/schedule/send-otp', { 
            email,
            isResend: false 
        });
        return response;
    } catch (error) {
        console.error('Failed to send demo OTP:', error);
        throw error;
    }
}

async function verifyDemoOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    if (USE_LOCAL_MODE) {
        if (otp === '123456') {
            return { success: true, message: 'OTP verified successfully' };
        }
        return { success: false, message: 'Invalid OTP' };
    }

    try {
        const response = await makeApiCall<{ success: boolean; message: string }>('POST', '/api/public/demo/schedule/verify-otp', { email, otp });
        return response;
    } catch (error) {
        console.error('Failed to verify demo OTP:', error);
        throw error;
    }
}

async function getAdminGrades(): Promise<Grade[]> {
    if (USE_LOCAL_MODE) {
        const stored = localStorage.getItem(DEMO_GRADES_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return getLocalGrades();
    }

    try {
        const response = await makeApiCall<unknown>('GET', '/api/admin/demo/settings/grades');
        const grades = Array.isArray(response) ? response : (response as Record<string, unknown>)?.data || (response as Record<string, unknown>)?.content || [];
        return Array.isArray(grades) ? grades : getLocalGrades();
    } catch (error) {
        console.error('Failed to fetch admin grades:', error);
        const stored = localStorage.getItem(DEMO_GRADES_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed : getLocalGrades();
        }
        return getLocalGrades();
    }
}

async function createAdminGrade(gradeData: { name: string }): Promise<Grade> {
    if (USE_LOCAL_MODE) {
        const stored = localStorage.getItem(DEMO_GRADES_STORAGE_KEY);
        const grades = stored ? JSON.parse(stored) : [];
        const newGrade: Grade = {
            id: `grade_${Date.now()}`,
            name: gradeData.name,
            displayName: gradeData.name
        };
        grades.push(newGrade);
        localStorage.setItem(DEMO_GRADES_STORAGE_KEY, JSON.stringify(grades));
        return newGrade;
    }

    try {
        const response = await makeApiCall<unknown>('POST', '/api/admin/demo/settings/grades', {
            name: gradeData.name
        });
        return response as Grade;
    } catch (error) {
        console.error('Failed to create grade:', error);
        throw error;
    }
}

async function updateAdminGrade(id: string, gradeData: { name: string }): Promise<Grade> {
    if (USE_LOCAL_MODE) {
        const stored = localStorage.getItem(DEMO_GRADES_STORAGE_KEY);
        const grades = stored ? JSON.parse(stored) : [];
        const index = grades.findIndex((g: Grade) => g.id === id);
        if (index !== -1) {
            grades[index] = { ...grades[index], ...gradeData, displayName: gradeData.name };
            localStorage.setItem(DEMO_GRADES_STORAGE_KEY, JSON.stringify(grades));
            return grades[index];
        }
        throw new Error('Grade not found');
    }

    try {
        const response = await makeApiCall<unknown>('PUT', `/api/admin/demo/settings/grades/${id}`, { name: gradeData.name });
        return (response as Record<string, unknown>)?.data as Grade || (response as Grade);
    } catch (error) {
        console.error('Failed to update grade:', error);
        throw error;
    }
}

async function deleteAdminGrade(id: string): Promise<void> {
    if (USE_LOCAL_MODE) {
        const stored = localStorage.getItem(DEMO_GRADES_STORAGE_KEY);
        const grades = stored ? JSON.parse(stored) : [];
        const filtered = grades.filter((g: Grade) => g.id !== id);
        localStorage.setItem(DEMO_GRADES_STORAGE_KEY, JSON.stringify(filtered));
        return;
    }

    try {
        await makeApiCall('DELETE', `/api/admin/demo/settings/grades/${id}`);
    } catch (error) {
        console.error('Failed to delete grade:', error);
        throw error;
    }
}

async function getAdminBoards(): Promise<Board[]> {
    if (USE_LOCAL_MODE) {
        const stored = localStorage.getItem(DEMO_BOARDS_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed : getLocalBoards();
        }
        return getLocalBoards();
    }

    try {
        const response = await makeApiCall<unknown>('GET', '/api/admin/demo/settings/boards');
        const boards = Array.isArray(response) ? response : (response as Record<string, unknown>)?.data || (response as Record<string, unknown>)?.content || [];
        return Array.isArray(boards) ? boards : getLocalBoards();
    } catch (error) {
        console.error('Failed to fetch admin boards:', error);
        const stored = localStorage.getItem(DEMO_BOARDS_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? filterDemoBoards(parsed) : getLocalBoards();
        }
        return getLocalBoards();
    }
}

async function createAdminBoard(boardData: { name: string }): Promise<Board> {
    if (USE_LOCAL_MODE) {
        const stored = localStorage.getItem(DEMO_BOARDS_STORAGE_KEY);
        const boards = stored ? JSON.parse(stored) : [];
        const newBoard: Board = {
            id: `board_${Date.now()}`,
            name: boardData.name,
            displayName: boardData.name
        };
        boards.push(newBoard);
        localStorage.setItem(DEMO_BOARDS_STORAGE_KEY, JSON.stringify(boards));
        return newBoard;
    }

    try {
        const response = await makeApiCall<unknown>('POST', '/api/admin/demo/settings/boards', {
            name: boardData.name
        });
        return response as Board;
    } catch (error) {
        console.error('Failed to create board:', error);
        throw error;
    }
}

async function updateAdminBoard(id: string, boardData: { name: string }): Promise<Board> {
    if (USE_LOCAL_MODE) {
        const stored = localStorage.getItem(DEMO_BOARDS_STORAGE_KEY);
        const boards = stored ? JSON.parse(stored) : [];
        const index = boards.findIndex((b: Board) => b.id === id);
        if (index !== -1) {
            boards[index] = { ...boards[index], ...boardData, displayName: boardData.name };
            localStorage.setItem(DEMO_BOARDS_STORAGE_KEY, JSON.stringify(boards));
            return boards[index];
        }
        throw new Error('Board not found');
    }

    try {
        const response = await makeApiCall<unknown>('PUT', `/api/admin/demo/settings/boards/${id}`, { name: boardData.name });
        return (response as Record<string, unknown>)?.data as Board || (response as Board);
    } catch (error) {
        console.error('Failed to update board:', error);
        throw error;
    }
}

async function deleteAdminBoard(id: string): Promise<void> {
    if (USE_LOCAL_MODE) {
        const stored = localStorage.getItem(DEMO_BOARDS_STORAGE_KEY);
        const boards = stored ? JSON.parse(stored) : [];
        const filtered = boards.filter((b: Board) => b.id !== id);
        localStorage.setItem(DEMO_BOARDS_STORAGE_KEY, JSON.stringify(filtered));
        return;
    }

    try {
        await makeApiCall('DELETE', `/api/admin/demo/settings/boards/${id}`);
    } catch (error) {
        console.error('Failed to delete board:', error);
        throw error;
    }
}

async function getAdminSchedules(params?: { date?: string; status?: string; page?: number; size?: number; sortBy?: string; sortDir?: string }): Promise<PageResponse<AdminDemoSchedule>> {
    if (USE_LOCAL_MODE) {
        const stored = localStorage.getItem(DEMO_SCHEDULES_STORAGE_KEY);
        const content = stored ? JSON.parse(stored) : [];
        return {
            content: content,
            totalElements: content.length,
            totalPages: Math.ceil(content.length / (params?.size || 10)),
            number: params?.page || 0,
            size: params?.size || 10
        };
    }

    try {
        const queryParams: QueryRecord = {};
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) queryParams[key] = String(value);
            });
        }
        // The API returns the paginated object directly
        return await makeApiCall<PageResponse<AdminDemoSchedule>>('GET', '/api/admin/demo/schedule', undefined, queryParams);
    } catch (error) {
        console.error('Failed to fetch admin schedules:', error);
        throw error;
    }
}

async function approveAdminSchedule(id: string): Promise<AdminDemoSchedule> {
    if (USE_LOCAL_MODE) {
        const stored = localStorage.getItem(DEMO_SCHEDULES_STORAGE_KEY);
        const schedules = stored ? JSON.parse(stored) : [];
        const index = schedules.findIndex((s: AdminDemoSchedule) => s.id === id);
        if (index !== -1) {
            schedules[index].status = 'APPROVED';
            schedules[index].updatedAt = new Date().toISOString();
            localStorage.setItem(DEMO_SCHEDULES_STORAGE_KEY, JSON.stringify(schedules));
            return schedules[index];
        }
        throw new Error('Schedule not found');
    }

    try {
        const response = await makeApiCall<unknown>('PUT', `/api/admin/demo/schedule/${id}/approve`);
        return response as AdminDemoSchedule;
    } catch (error) {
        console.error('Failed to approve schedule:', error);
        throw error;
    }
}

async function cancelAdminSchedule(id: string, cancelReason: string = 'Cancelled by admin'): Promise<AdminDemoSchedule> {
    if (USE_LOCAL_MODE) {
        const stored = localStorage.getItem(DEMO_SCHEDULES_STORAGE_KEY);
        const schedules = stored ? JSON.parse(stored) : [];
        const index = schedules.findIndex((s: AdminDemoSchedule) => s.id === id);
        if (index !== -1) {
            schedules[index].status = 'CANCELLED';
            schedules[index].cancelReason = cancelReason;
            schedules[index].updatedAt = new Date().toISOString();
            localStorage.setItem(DEMO_SCHEDULES_STORAGE_KEY, JSON.stringify(schedules));
            return schedules[index];
        }
        throw new Error('Schedule not found');
    }

    try {
        const response = await makeApiCall<unknown>('PUT', `/api/admin/demo/schedule/${id}/cancel`, { cancelReason });
        return response as AdminDemoSchedule;
    } catch (error) {
        console.error('Failed to cancel schedule:', error);
        throw error;
    }
}

export const demoApi = {
    // Public APIs
    getGrades,
    getBoards,
    scheduleDemo,
    sendDemoOtp,
    verifyDemoOtp,

    // Admin APIs
    getAdminGrades,
    createAdminGrade,
    updateAdminGrade,
    deleteAdminGrade,
    getAdminBoards,
    createAdminBoard,
    updateAdminBoard,
    deleteAdminBoard,
    getAdminSchedules,
    approveAdminSchedule,
    cancelAdminSchedule
};