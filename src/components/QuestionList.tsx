import React from 'react';

export interface Question {
  id: number;
  title: string;
  equation: string;
  description: string;
  isClosed: boolean;
  attempts: number;
  bestSolution?: string;
}

interface QuestionListProps {
  questions: Question[];
  onSelect: (question: Question) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onSelect }) => (
  <div className="space-y-4">
    {questions.map(q => (
      <div
        key={q.id}
        className={`p-4 rounded-lg shadow border cursor-pointer bg-white hover:bg-indigo-50 transition-all flex flex-col gap-2 ${q.isClosed ? 'opacity-70' : ''}`}
        onClick={() => onSelect(q)}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-indigo-700">{q.title}</span>
          {q.isClosed && <span className="ml-2 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">Closed</span>}
        </div>
        <div className="text-gray-600 text-sm line-clamp-2">{q.description}</div>
        <div className="text-xs text-gray-400">Attempts: {q.attempts}</div>
      </div>
    ))}
  </div>
);

export default QuestionList;
