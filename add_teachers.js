
const axios = require('axios');

const api = axios.create({
    baseURL: 'http://93.127.194.118:9014',
    headers: {
        'Content-Type': 'application/json',
    },
});

const teachers = [
    {
        name: 'B. Aishwarya',
        subject: 'Mathematics',
        specialty: 'IGCSE Mathematics Specialist',
        category: 'IGCSE',
        bio: 'Expert educator specializing in IGCSE Mathematics with a focus on conceptual clarity and problem-solving techniques.',
        image: 'https://images.unsplash.com/photo-1544717305-27a734ef1904?auto=format&fit=crop&q=80&w=400',
        status: 'active'
    },
    {
        name: 'Mr. Shambhu M. G',
        subject: 'Physics',
        specialty: 'Advanced Physics Consultant',
        category: 'IGCSE',
        bio: 'Dedicated Physics educator with extensive experience in teaching IGCSE students, known for making complex theories easy to understand.',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
        status: 'active'
    },
    {
        name: 'Mr. Ram G. Mohan',
        subject: 'Chemistry',
        specialty: 'IGCSE Chemistry Expert',
        category: 'IGCSE',
        bio: 'Passionate Chemistry teacher committed to helping students excel in IGCSE examinations through interactive learning and practical insights.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
        status: 'active'
    },
    {
        name: 'Ms. Neha Aggarwal',
        subject: 'Biology',
        specialty: 'IGCSE Biology Specialist',
        category: 'IGCSE',
        bio: 'Accomplished Biology educator with a deep understanding of the IGCSE curriculum, helping students achieve top grades through personalized support.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        status: 'active'
    }
];

async function addTeachers() {
    const credentials = Buffer.from('admin:SecureAdmin@2026').toString('base64');
    api.defaults.headers.common['Authorization'] = `Basic ${credentials}`;
    
    console.log('Testing connection to /api/teachers...');
    try {
        const testRes = await api.get('/api/teachers');
        console.log('Connection successful. Teachers count:', testRes.data.totalElements || testRes.data.length);
    } catch (e) {
        console.error('Test connection failed:', e.message);
    }

    for (const teacher of teachers) {
        try {
            console.log(`Adding teacher: ${teacher.name}...`);
            const response = await api.post('/api/admin/teachers', teacher);
            console.log(`✅ Added: ${teacher.name}`);
        } catch (error) {
            console.error(`❌ Failed: ${teacher.name} - Status: ${error.response?.status} - ${JSON.stringify(error.response?.data || error.message)}`);
        }
    }
}

addTeachers();
