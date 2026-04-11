import React from 'react';
// Use KaTeX or MathJax for rendering

interface SolutionListProps {
  solutions: { user: string; latex: string }[];
}

const SolutionList: React.FC<SolutionListProps> = ({ solutions }) => (
  <div className="mt-6">
    <h3 className="font-semibold text-indigo-800 mb-2">Submitted Solutions</h3>
    {solutions.length === 0 ? (
      <div className="text-gray-500">No solutions yet.</div>
    ) : (
      <ul className="space-y-3">
        {solutions.map((sol, idx) => (
          <li key={idx} className="bg-indigo-50 rounded p-3">
            <div className="text-sm text-gray-700 mb-1 font-medium">By: {sol.user}</div>
            {/* Render math here with KaTeX/MathJax */}
            <div className="text-lg text-indigo-900">{sol.latex}</div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default SolutionList;
