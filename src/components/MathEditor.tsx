import React, { useState } from 'react';
// @ts-ignore
import { EditableMathField } from 'react-mathquill';

interface MathEditorProps {
  onSubmit: (latex: string) => void;
}

const MathEditor: React.FC<MathEditorProps> = ({ onSubmit }) => {
  const [latex, setLatex] = useState('');

  return (
    <div className="mb-4">
      <EditableMathField
        latex={latex}
        onChange={(_, l) => setLatex(l)}
        className="border rounded p-2 min-h-[48px] bg-gray-50 text-lg w-full"
      />
      <button
        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold"
        onClick={() => { if (latex.trim()) { onSubmit(latex); setLatex(''); } }}
      >
        Submit Solution
      </button>
    </div>
  );
};

export default MathEditor;
