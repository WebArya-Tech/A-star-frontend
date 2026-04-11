import React, { useState } from 'react';

const mathQuestions = [
    'Evaluate the integral: ∫₀¹ x² dx',
    'Solve for x: x² - 5x + 6 = 0',
    'Find the derivative of sin(x)·eˣ',
    'If A = [1 2; 3 4], find det(A)',
    'Prove that the sum of the first n natural numbers is n(n+1)/2',
    'Find the value of limₓ→0 (sin x)/x',
    'If f(x) = x³, find f⁻¹(x)',
    'Solve the differential equation: dy/dx = y',
    'Find the area under y = x² between x = 0 and x = 2',
    'If logₐb = 2 and logₐc = 3, find logₐ(bc)',
    'Find the roots of x³ - 1 = 0',
    'Evaluate: ∑ₙ₌₁^∞ 1/n²',
    'If z = 3 + 4i, find |z|',
    'Find the equation of the tangent to y = x² at x = 1',
    'If P(A) = 0.3, P(B) = 0.4, P(A∩B) = 0.1, find P(A∪B)',
    'Find the general solution of d²y/dx² + y = 0',
    'If a vector a = 2i + 3j, find its magnitude',
    'Find the sum of the GP: 2, 4, 8, ... up to 10 terms',
    'If f(x) = eˣ, find the Maclaurin series up to x²',
    'Evaluate: ∫₀^π sin²x dx',
];

const IITJEEQuestionTabs: React.FC = () => {
    const [tab, setTab] = useState<'open' | 'closed'>('open');
    const [answers, setAnswers] = useState<{ [idx: number]: string }>({});

    const handleAnswer = (idx: number, value: string) => {
        setAnswers(prev => ({ ...prev, [idx]: value }));
    };

    const openQuestions = mathQuestions.filter((_, idx) => answers[idx]);
    const closedQuestions = mathQuestions.filter((_, idx) => !answers[idx]);

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-end gap-2 mb-6">
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
                    <h2 className="text-lg font-bold mb-4 text-indigo-700">Attempted Questions</h2>
                    {openQuestions.length === 0 ? (
                        <div className="text-gray-500">No questions attempted yet. Select a question below to answer.</div>
                    ) : (
                        <ul className="space-y-6">
                            {mathQuestions.map((q, idx) =>
                                answers[idx] ? (
                                    <li key={idx} className="border-b pb-2">
                                        <div className="font-medium text-gray-800 mb-2">Q{idx + 1}. {q}</div>
                                        <textarea
                                            className="w-full p-2 border rounded mb-2"
                                            rows={3}
                                            value={answers[idx]}
                                            onChange={e => handleAnswer(idx, e.target.value)}
                                            placeholder="Write your solution here..."
                                        />
                                    </li>
                                ) : null
                            )}
                        </ul>
                    )}
                </div>
            )}

            {tab === 'closed' && (
                <div>
                    <h2 className="text-lg font-bold mb-4 text-indigo-700">Unattempted Questions</h2>
                    {closedQuestions.length === 0 ? (
                        <div className="text-green-600 font-semibold">All questions have been attempted!</div>
                    ) : (
                        <ul className="space-y-6">
                            {mathQuestions.map((q, idx) =>
                                !answers[idx] ? (
                                    <li key={idx} className="border-b pb-2">
                                        <div className="font-medium text-gray-800 mb-2">Q{idx + 1}. {q}</div>
                                        <textarea
                                            className="w-full p-2 border rounded mb-2"
                                            rows={3}
                                            value={answers[idx] || ''}
                                            onChange={e => handleAnswer(idx, e.target.value)}
                                            placeholder="Write your solution here..."
                                        />
                                    </li>
                                ) : null
                            )}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default IITJEEQuestionTabs;
