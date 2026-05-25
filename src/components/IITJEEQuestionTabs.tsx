import React, { useState, useEffect } from 'react';
import { getQuestions } from '../api/api/questionApi';
import { submitAnswer } from '../api/api/answerApi';
import toast from 'react-hot-toast';

const IITJEEQuestionTabs: React.FC = () => {
    const [tab, setTab] = useState<'open' | 'closed'>('open');
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<{ [id: string]: string }>({});
    const [submitting, setSubmitting] = useState<{ [id: string]: boolean }>({});

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const data = await getQuestions({ page: 0, size: 20 });
            setQuestions(data.content || []);
        } catch (error) {
            console.error('Error fetching questions:', error);
            toast.error('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (id: string, value: string) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (id: string) => {
        const content = answers[id];
        if (!content?.trim()) {
            toast.error('Please write a solution first');
            return;
        }

        setSubmitting(prev => ({ ...prev, [id]: true }));
        try {
            await submitAnswer({ questionId: id, contentHtml: content });
            toast.success('Solution submitted for review!');
            // Clear answer after submission
            setAnswers(prev => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit solution');
        } finally {
            setSubmitting(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-end gap-2 mb-6">
                <button
                    className={`px-6 py-2 rounded-t-lg font-semibold transition-all ${tab === 'open' ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setTab('open')}
                >
                    Questions
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            ) : questions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No questions available at the moment.</div>
            ) : (
                <ul className="space-y-8">
                    {questions.map((q, idx) => (
                        <li key={q.id} className="border-b pb-6 last:border-0">
                            <div className="font-bold text-lg text-indigo-700 mb-2">Q{idx + 1}. {q.title}</div>
                            <div 
                                className="text-gray-700 mb-4 prose prose-indigo max-w-none"
                                dangerouslySetInnerHTML={{ __html: q.descriptionHtml }}
                            />
                            <div className="space-y-3">
                                <textarea
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    rows={4}
                                    value={answers[q.id] || ''}
                                    onChange={e => handleAnswerChange(q.id, e.target.value)}
                                    placeholder="Write your step-by-step solution here..."
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleSubmit(q.id)}
                                        disabled={submitting[q.id]}
                                        className={`px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2`}
                                    >
                                        {submitting[q.id] ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Submitting...
                                            </>
                                        ) : 'Submit Solution'}
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default IITJEEQuestionTabs;
