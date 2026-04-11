
import React, { useEffect, useMemo, useState } from 'react';
import { askApi } from '../api/askApi';
import RichDescriptionEditor from '../components/RichDescriptionEditor';

type Question = {
    id: string;
    category: string;
    course: string;
    topic: string;
    description: string;
    attachment?: string;
    createdAt: string;
    status: 'Open' | 'Answered' | 'Closed';
    answer?: string;
};

const CATEGORY_OPTIONS = [
    { label: 'IGCSE', value: 'IGCSE', courses: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Economics', 'Languages'] },
    { label: 'AS/A Level', value: 'AS/A Level', courses: ['Physics', 'Chemistry', 'Mathematics', 'Economics', 'Biology', 'Further Math'] },
    { label: 'SAT', value: 'SAT', courses: ['SAT Math', 'SAT Reading', 'SAT Writing'] },
    { label: 'College Counselling', value: 'College Counselling', courses: ['Applications', 'Essays', 'Interviews'] }
];

const formatDate = (iso: string) => new Date(iso).toLocaleString();

const Ask = () => {
    const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value);
    const [course, setCourse] = useState(CATEGORY_OPTIONS[0].courses[0]);
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState<string | undefined>(undefined);
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        (async () => {
            const res = await askApi.getAll();
            setQuestions(res.data || []);
        })();
    }, []);

    const courseOptions = useMemo(() => {
        const entry = CATEGORY_OPTIONS.find((opt) => opt.value === category);
        return entry?.courses ?? [];
    }, [category]);

    useEffect(() => {
        if (!courseOptions.includes(course)) {
            setCourse(courseOptions[0] ?? '');
        }
    }, [courseOptions, course]);

    const resetForm = () => {
        setTopic('');
        setDescription('');
        setAttachment(undefined);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setAttachment(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!topic.trim() && !attachment) return;

        const payload = {
            category,
            course,
            topic: topic.trim(),
            description: description.trim(),
            attachment,
        };

        const res = await askApi.create(payload);
        if (res.data) {
            setQuestions((prev) => [res.data, ...prev]);
            resetForm();
        }
    };

    const updateAnswer = async (id: string, answer: string) => {
        setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, answer } : q)));
        await askApi.update(id, { answer, status: 'Answered' });
    };

    const closeQuestion = async (id: string) => {
        setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'Closed' } : q)));
        await askApi.update(id, { status: 'Closed' });
    };

    // (navigation removed)
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Ask a Question</h1>
                    <p className="mt-3 text-lg text-gray-700 max-w-2xl mx-auto">
                        Select a category, choose the course/topic, then describe your question or upload a screenshot. Our team will answer and close it when resolved.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <section className="bg-white rounded-2xl shadow-lg border border-purple-200 p-8 hover:shadow-xl transition-shadow relative">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-purple-800">Ask a Question</h2>
                            <div className="flex gap-2">
                                <button className="px-4 py-1 rounded-lg font-semibold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-all">Open</button>
                                <button className="px-4 py-1 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">Closed</button>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-purple-700">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-purple-50"
                                >
                                    {CATEGORY_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-purple-700">Course</label>
                                <select
                                    value={course}
                                    onChange={(e) => setCourse(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-purple-50"
                                >
                                    {courseOptions.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-purple-700">Topic</label>
                                <input
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="E.g. Newton's laws question"
                                    className="mt-1 block w-full rounded-lg border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-purple-50"
                                />
                            </div>

                            <RichDescriptionEditor
                                value={description}
                                onChange={setDescription}
                            />

                            <div>
                                <label className="block text-sm font-medium text-purple-700">Upload Question (optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full text-sm text-purple-600 bg-purple-50 rounded-lg border-purple-300"
                                />
                                {attachment && (
                                    <div className="mt-3">
                                        <div className="text-xs text-purple-500 mb-1">Preview:</div>
                                        <img src={attachment} alt="Attachment preview" className="max-h-48 rounded-lg border border-purple-200 shadow-sm" />
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full inline-flex justify-center items-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
                            >
                                Submit Question
                            </button>
                        </form>

                    </section>


                    <section className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-semibold text-blue-800 mb-4">Questions & Answers</h2>
                        {questions.length === 0 ? (
                            <p className="text-blue-600">No questions yet. Submit one to get started.</p>
                        ) : (
                            <div className="space-y-6">
                                {questions.map((q) => (
                                    <div key={q.id} className="border border-blue-200 rounded-xl p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors">
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div>
                                                <div className="text-sm font-semibold text-blue-800">{q.topic || 'Untitled question'}</div>
                                                <div className="text-xs text-blue-600">
                                                    {q.category} • {q.course} • {formatDate(q.createdAt)}
                                                </div>
                                            </div>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${q.status === 'Open'
                                                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                                    : q.status === 'Answered'
                                                        ? 'bg-green-100 text-green-800 border border-green-300'
                                                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                                                    }`}
                                            >
                                                {q.status}
                                            </span>
                                        </div>
                                        {q.description && (
                                            <p className="mt-3 text-sm text-blue-700">{q.description}</p>
                                        )}
                                        {q.attachment && (
                                            <div className="mt-3">
                                                <div className="text-xs text-blue-500 mb-1">Attachment:</div>
                                                <img src={q.attachment} alt="Question attachment" className="max-h-52 rounded-lg border border-blue-200 shadow-sm" />
                                            </div>
                                        )}
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-blue-700">Answer</label>
                                            <textarea
                                                value={q.answer ?? ''}
                                                onChange={(e) => updateAnswer(q.id, e.target.value)}
                                                rows={3}
                                                placeholder="Write your answer here..."
                                                className="mt-1 block w-full rounded-lg border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
                                            />
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <button
                                                onClick={() => closeQuestion(q.id)}
                                                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-gray-400 to-gray-500 px-4 py-2 text-sm font-semibold text-white hover:from-gray-500 hover:to-gray-600 transition-all transform hover:scale-105"
                                            >
                                                Close Question
                                            </button>
                                            {q.status === 'Open' && (
                                                <button
                                                    onClick={() => updateAnswer(q.id, q.answer ?? '')}
                                                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm font-semibold text-white hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
                                                >
                                                    Mark Answered
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Ask;
