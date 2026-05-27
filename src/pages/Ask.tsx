
import React, { useEffect, useMemo, useState } from 'react';
import { askApi } from '../api/askApi';
import RichDescriptionEditor from '../components/RichDescriptionEditor';
import { getCategories } from '../api/api/categoryApi';
import toast from 'react-hot-toast';

type Question = {
    id: string;
    title: string;
    descriptionHtml: string;
    createdAt: string;
    category?: {
        id: string;
        name: string;
    };
};

import katex from 'katex';
import 'katex/dist/katex.min.css';

const Ask: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [categoryId, setCategoryId] = useState('');
    const [title, setTitle] = useState('');
    const [descriptionHtml, setDescriptionHtml] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [cats, qs] = await Promise.all([
                getCategories(),
                askApi.getAll({ page: 0, size: 50 })
            ]);
            setCategories(cats || []);
            if (cats?.length > 0) setCategoryId(cats[0].id);
            setQuestions(qs.data?.content || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load questions or categories');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescriptionHtml('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !descriptionHtml.trim()) {
            toast.error('Please fill in both title and description');
            return;
        }

        const payload = {
            title: title.trim(),
            descriptionHtml: descriptionHtml.trim(),
            categoryId
        };

        try {
            const res = await askApi.create(payload);
            if (res.data) {
                setQuestions((prev) => [res.data, ...prev]);
                resetForm();
                toast.success('Question submitted successfully!');
            }
        } catch (error: any) {
            console.error('Submit error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to submit question';
            toast.error(`Error: ${errorMsg}`);
        }
    };

    const updateAnswer = async (id: string, answer: string) => {
        setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, answer } : q)));
        await askApi.update(id, { answer, status: 'Answered' });
    };

    // Function to render LaTeX equations in HTML (Mirroring editor logic for display)
    const renderMathInHTML = (html: string): string => {
        if (!html) return '';
        let result = html;
        // Replace display math ($$...$$)
        result = result.replace(/\$\$([^$]+)\$\$/g, (match, formula) => {
             try {
                 return `<div class="math-block py-4 overflow-x-auto">${katex.renderToString(formula.trim(), { throwOnError: false, displayMode: true })}</div>`;
             } catch (e) { return match; }
         });
         // Replace inline math ($...$)
         result = result.replace(/(?<!\$)\$([^$]+)\$(?!\$)/g, (match, formula) => {
             try {
                 return `<span class="math-inline px-1">${katex.renderToString(formula.trim(), { throwOnError: false, displayMode: false })}</span>`;
             } catch (e) { return match; }
         });
        return result;
    };

    // (navigation removed)
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 overflow-x-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Ask a Question</h1>
                    <p className="mt-3 text-lg text-gray-700 max-w-2xl mx-auto">
                        Select a category, choose the course/topic, then describe your question or upload a screenshot. Our team will answer and close it when resolved.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-10">
                    <section className="bg-white rounded-2xl shadow-lg border border-purple-200 p-8 hover:shadow-xl transition-shadow relative">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-purple-800">Ask a Question</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-purple-700">Category</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-purple-50"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-purple-700">Topic/Title</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="E.g. Newton's laws question"
                                    className="mt-1 block w-full rounded-lg border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-purple-50"
                                />
                            </div>

                            <RichDescriptionEditor
                                value={descriptionHtml}
                                onChange={setDescriptionHtml}
                            />

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
                        {loading ? (
                             <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-800"></div>
                             </div>
                        ) : questions.length === 0 ? (
                            <p className="text-blue-600">No questions yet. Submit one to get started.</p>
                        ) : (
                            <div className="space-y-6">
                                {questions.map((q) => (
                                    <div key={q.id} className="border border-blue-200 rounded-xl p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors">
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div>
                                                <div className="text-sm font-semibold text-blue-800">{q.title || 'Untitled question'}</div>
                                                <div className="text-xs text-blue-600">
                                                    {q.category?.name} • {new Date(q.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div 
                                            className="mt-3 text-sm text-blue-900 prose prose-sm max-w-none"
                                        >
                                            <div dangerouslySetInnerHTML={{ __html: renderMathInHTML(q.descriptionHtml) }} />
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
