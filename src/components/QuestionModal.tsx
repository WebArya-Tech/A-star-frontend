import React from 'react';
import MathEditor from './MathEditor';
import SolutionList from './SolutionList';
import { Question } from './QuestionList';

interface QuestionModalProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSolution: (latex: string) => void;
  solutions: { user: string; latex: string }[];
}

const QuestionModal: React.FC<QuestionModalProps> = ({ question, isOpen, onClose, onSubmitSolution, solutions }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">{question.title}</h2>
        <div className="mb-2 text-lg text-indigo-900">
          {/* Render equation using KaTeX or MathJax here */}
          <span>{question.equation}</span>
        </div>
        <div className="mb-4 text-gray-700">{question.description}</div>
        <MathEditor onSubmit={onSubmitSolution} />
        <SolutionList solutions={solutions} />
        <div className="mt-4 text-xs text-gray-500">Total Attempts: {solutions.length}</div>
      </div>
    </div>
  );
};

export default QuestionModal;
