import React, { useState } from 'react';

// Example questions (replace with API or props as needed)
const predefinedQuestions = [
    { id: 1, text: 'What is Newton\'s First Law?' },
    { id: 2, text: 'Explain Ohm\'s Law.' },
    { id: 3, text: 'Define acceleration.' },
    { id: 4, text: 'What is the value of gravity on Earth?' },
    { id: 5, text: 'Describe the process of photosynthesis.' },
];

const AskQuestionTabs: React.FC = () => {
    const [tab, setTab] = useState<'open' | 'closed'>('open');
    const [answers, setAnswers] = useState<{ [id: number]: string }>({});
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

    const unanswered = predefinedQuestions.filter(q => !answers[q.id]);
    const answered = predefinedQuestions.filter(q => answers[q.id]);

    const handleSelect = (id: number) => {
        setSelectedQuestion(id);
        setCurrentAnswer(answers[id] || '');
    };

    const handleSubmit = () => {
        if (selectedQuestion && currentAnswer.trim()) {
            setAnswers(prev => ({ ...prev, [selectedQuestion]: currentAnswer.trim() }));
            setSelectedQuestion(null);
            setCurrentAnswer('');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex gap-2 mb-6">
                <button
                    className={`px-6 py-2 rounded-t-lg font-semibold transition-all ${tab === 'open' ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setTab('open')}
                >
                    Open
                </button>
                <button
                    className={`px-6 py-2 rounded-t-lg font-semibold transition-all ${tab === 'closed' ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setTab('closed')}
                >
                    Closed
                </button>
            </div>

            {tab === 'open' && (
                <div>
                    <h2 className="text-lg font-bold mb-4 text-indigo-700">Unanswered Questions</h2>
                    {unanswered.length === 0 ? (
                        <div className="text-green-600 font-semibold">All questions have been answered!</div>
                    ) : (
                        <ul className="space-y-3">
                            {unanswered.map(q => (
                                <li key={q.id} className="border-b pb-2 flex items-center justify-between">
                                    <span>{q.text}</span>
                                    <button
                                        className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 font-medium"
                                        onClick={() => handleSelect(q.id)}
                                    >
                                        Answer
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {selectedQuestion && (
                        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                            <div className="mb-2 font-semibold text-indigo-800">
                                {predefinedQuestions.find(q => q.id === selectedQuestion)?.text}
                            </div>
                            <textarea
                                className="w-full p-2 border rounded mb-2"
                                rows={3}
                                value={currentAnswer}
                                onChange={e => setCurrentAnswer(e.target.value)}
                                placeholder="Type your answer here..."
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                                <button
                                    className="px-4 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-semibold"
                                    onClick={() => setSelectedQuestion(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {tab === 'closed' && (
                <div>
                    <h2 className="text-lg font-bold mb-4 text-indigo-700">Answered Questions</h2>
                    <div className="mb-2 text-gray-700">
                        <span className="font-semibold">Answered:</span> {answered.length} / {predefinedQuestions.length}
                        <span className="ml-4 font-semibold">Unanswered:</span> {unanswered.length}
                    </div>
                    {answered.length === 0 ? (
                        <div className="text-gray-500">No questions have been answered yet.</div>
                    ) : (
                        <ul className="space-y-4 mt-4">
                            {answered.map(q => (
                                <li key={q.id} className="border-b pb-2">
                                    <div className="font-medium text-gray-800">{q.text}</div>
                                    <div className="mt-1 text-green-700 bg-green-50 rounded p-2">{answers[q.id]}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default AskQuestionTabs;
