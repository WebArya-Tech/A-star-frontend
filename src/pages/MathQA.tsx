import React, { useState } from 'react';
import QuestionList, { Question } from '../components/QuestionList';
import QuestionModal from '../components/QuestionModal';

// Example data
const initialQuestions: Question[] = [
  {
    id: 1,
    title: 'Evaluate the integral',
    equation: '\\int_0^1 x^2 dx',
    description: 'Find the value of the definite integral from 0 to 1 for x squared.',
    isClosed: false,
    attempts: 0,
  },
  {
    id: 2,
    title: 'Solve the quadratic equation',
    equation: 'x^2 - 5x + 6 = 0',
    description: 'Find all real solutions for the given quadratic equation.',
    isClosed: false,
    attempts: 0,
  },
  {
    id: 3,
    title: 'Find the derivative',
    equation: '\\frac{d}{dx} (\\sin x \\cdot e^x)',
    description: 'Differentiate the function with respect to x.',
    isClosed: true,
    attempts: 2,
    bestSolution: 'e^x (sin x + cos x)',
  },
];

const MathQA: React.FC = () => {
  const [tab, setTab] = useState<'open' | 'closed'>('open');
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [selected, setSelected] = useState<Question | null>(null);
  const [solutions, setSolutions] = useState<{ [id: number]: { user: string; latex: string }[] }>({});

  const handleSelect = (q: Question) => setSelected(q);
  const handleCloseModal = () => setSelected(null);
  const handleSubmitSolution = (latex: string) => {
    if (!selected) return;
    setSolutions(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || []), { user: 'User' + (prev[selected.id]?.length + 1 || 1), latex }],
    }));
    setQuestions(qs =>
      qs.map(q =>
        q.id === selected.id
          ? { ...q, attempts: (q.attempts || 0) + 1 }
          : q
      )
    );
  };

  const openQuestions = questions.filter(q => !q.isClosed);
  const closedQuestions = questions.filter(q => q.isClosed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-4 mb-8">
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold transition-all ${tab === 'open' ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setTab('open')}
          >
            Open Questions
          </button>
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold transition-all ${tab === 'closed' ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setTab('closed')}
          >
            Closed Questions
          </button>
        </div>
        {tab === 'open' && (
          <QuestionList questions={openQuestions} onSelect={handleSelect} />
        )}
        {tab === 'closed' && (
          <div className="space-y-4">
            {closedQuestions.map(q => (
              <div key={q.id} className="p-4 rounded-lg shadow border bg-white flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-indigo-700">{q.title}</span>
                  <span className="ml-2 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">Closed</span>
                </div>
                <div className="text-gray-600 text-sm">{q.description}</div>
                <div className="text-indigo-900 text-lg">{q.equation}</div>
                <div className="text-xs text-gray-400">Attempts: {q.attempts}</div>
                <div className="mt-2">
                  <span className="font-semibold text-green-700">Best Answer:</span> {q.bestSolution || 'N/A'}
                </div>
                <div className="text-xs text-gray-500">Solved</div>
              </div>
            ))}
          </div>
        )}
        {selected && (
          <QuestionModal
            question={selected}
            isOpen={!!selected}
            onClose={handleCloseModal}
            onSubmitSolution={handleSubmitSolution}
            solutions={solutions[selected.id] || []}
          />
        )}
      </div>
    </div>
  );
};

export default MathQA;
