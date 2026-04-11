import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { X, Maximize2, Minimize2, Eye, Edit2, Plus } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface RichDescriptionEditorProps {
    value: string;
    onChange: (content: string) => void;
}

const RichDescriptionEditor: React.FC<RichDescriptionEditorProps> = ({ value, onChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            })
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return <div>Loading editor...</div>;
    }

    // Function to render LaTeX equations in HTML
    const renderMathInHTML = (html: string): string => {
        let result = html;

        // Replace display math ($$...$$)
        result = result.replace(/\$\$([^$]+)\$\$/g, (match, formula) => {
            try {
                const rendered = katex.renderToString(formula, {
                    throwOnError: false,
                    displayMode: true,
                });
                return `<div class="math-block">${rendered}</div>`;
            } catch (e) {
                return match;
            }
        });

        // Replace inline math ($...$) but not $$...$$
        result = result.replace(/(?<!\$)\$([^$]+)\$(?!\$)/g, (match, formula) => {
            try {
                const rendered = katex.renderToString(formula, {
                    throwOnError: false,
                    displayMode: false,
                });
                return `<span class="math-inline">${rendered}</span>`;
            } catch (e) {
                return match;
            }
        });

        return result;
    };


    // Insert LaTeX at cursor (inline or block)
    const insertLatex = (latex: string, display: boolean = false) => {
        const content = display ? `\n\n$$${latex}$$\n\n` : `$${latex}$`;
        editor.chain().focus().insertContent(content).run();
    };

    // Dropdown for advanced math/scientific symbols
    const mathSymbols = [
        { label: '∫ Integral', latex: '\\int', tip: 'Integral' },
        { label: '∑ Sum', latex: '\\sum', tip: 'Sum' },
        { label: '√ Root', latex: '\\sqrt{x}', tip: 'Square Root' },
        { label: 'π Pi', latex: '\\pi', tip: 'Pi' },
        { label: '∞ Infinity', latex: '\\infty', tip: 'Infinity' },
        { label: 'α Alpha', latex: '\\alpha', tip: 'Alpha' },
        { label: 'β Beta', latex: '\\beta', tip: 'Beta' },
        { label: 'γ Gamma', latex: '\\gamma', tip: 'Gamma' },
        { label: 'θ Theta', latex: '\\theta', tip: 'Theta' },
        { label: 'Δ Delta', latex: '\\Delta', tip: 'Delta' },
        { label: '→ Arrow', latex: '\\rightarrow', tip: 'Right Arrow' },
        { label: '← Arrow', latex: '\\leftarrow', tip: 'Left Arrow' },
        { label: '⇔ Iff', latex: '\\Leftrightarrow', tip: 'If and only if' },
        { label: '≠ Not Equal', latex: '\\neq', tip: 'Not Equal' },
        { label: '≤ Less/Equal', latex: '\\leq', tip: 'Less or Equal' },
        { label: '≥ Greater/Equal', latex: '\\geq', tip: 'Greater or Equal' },
        { label: '∈ In', latex: '\\in', tip: 'Element of' },
        { label: '∉ Not In', latex: '\\notin', tip: 'Not Element of' },
        { label: '∅ Empty Set', latex: '\\emptyset', tip: 'Empty Set' },
        { label: 'ℝ Reals', latex: '\\mathbb{R}', tip: 'Real Numbers' },
        { label: 'ℤ Integers', latex: '\\mathbb{Z}', tip: 'Integers' },
        { label: 'ℕ Naturals', latex: '\\mathbb{N}', tip: 'Natural Numbers' },
        { label: '∃ Exists', latex: '\\exists', tip: 'Exists' },
        { label: '∀ For All', latex: '\\forall', tip: 'For All' },
        { label: '∂ Partial', latex: '\\partial', tip: 'Partial Derivative' },
        { label: '∇ Nabla', latex: '\\nabla', tip: 'Nabla/Del' },
        { label: '⋂ Intersection', latex: '\\cap', tip: 'Intersection' },
        { label: '⋃ Union', latex: '\\cup', tip: 'Union' },
        { label: '⊂ Subset', latex: '\\subset', tip: 'Subset' },
        { label: '⊆ SubsetEq', latex: '\\subseteq', tip: 'Subset or Equal' },
        { label: '⊃ Superset', latex: '\\supset', tip: 'Superset' },
        { label: '⊇ SupersetEq', latex: '\\supseteq', tip: 'Superset or Equal' },
        { label: '∠ Angle', latex: '\\angle', tip: 'Angle' },
        { label: '° Degree', latex: '^\\circ', tip: 'Degree' },
        { label: '≈ Approx', latex: '\\approx', tip: 'Approximately' },
        { label: '≅ Congruent', latex: '\\cong', tip: 'Congruent' },
        { label: '∝ Proportional', latex: '\\propto', tip: 'Proportional' },
        { label: '∫∫ Double Integral', latex: '\\iint', tip: 'Double Integral' },
        { label: '∑∑ Double Sum', latex: '\\sum_{i=1}^n \\sum_{j=1}^m', tip: 'Double Sum' },
        { label: 'lim Limit', latex: '\\lim_{x \to 0}', tip: 'Limit' },
        { label: 'log Log', latex: '\\log', tip: 'Logarithm' },
        { label: 'exp Exponential', latex: '\\exp', tip: 'Exponential' },
        { label: 'binom Binomial', latex: '\\binom{n}{k}', tip: 'Binomial Coefficient' },
        { label: 'matrix Matrix', latex: '\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}', tip: '2x2 Matrix' },
        { label: 'vec Vector', latex: '\\vec{v}', tip: 'Vector' },
        { label: 'hat Unit', latex: '\\hat{u}', tip: 'Unit Vector' },
        { label: 'bar Mean', latex: '\\bar{x}', tip: 'Mean/Bar' },
        { label: 'underline Underline', latex: '\\underline{a}', tip: 'Underline' },
        { label: 'overline Overline', latex: '\\overline{AB}', tip: 'Overline' },
        { label: 'cdot Dot', latex: '\\cdot', tip: 'Dot Product' },
        { label: 'times Times', latex: '\\times', tip: 'Multiplication' },
        { label: 'div Divide', latex: '\\div', tip: 'Division' },
        { label: 'pm PlusMinus', latex: '\\pm', tip: 'Plus/Minus' },
        { label: 'mp MinusPlus', latex: '\\mp', tip: 'Minus/Plus' },
        { label: 'ldots Ellipsis', latex: '\\ldots', tip: 'Ellipsis' },
        { label: 'dotsc Dots', latex: '\\dotsc', tip: 'Dots' },
        { label: 'prime Prime', latex: '\\prime', tip: 'Prime' },
        { label: 'degree Degree', latex: '^\\circ', tip: 'Degree' },
        // Add more as needed
    ];

    // Writing/blog symbols
    const writingSymbols = [
        { label: '— Em Dash', latex: '—', tip: 'Em Dash' },
        { label: '– En Dash', latex: '–', tip: 'En Dash' },
        { label: '• Bullet', latex: '•', tip: 'Bullet' },
        { label: '© Copyright', latex: '©', tip: 'Copyright' },
        { label: '® Registered', latex: '®', tip: 'Registered' },
        { label: '™ Trademark', latex: '™', tip: 'Trademark' },
        { label: '§ Section', latex: '§', tip: 'Section' },
        { label: '¶ Paragraph', latex: '¶', tip: 'Paragraph' },
        { label: '† Dagger', latex: '†', tip: 'Dagger' },
        { label: '‡ Double Dagger', latex: '‡', tip: 'Double Dagger' },
        { label: '… Ellipsis', latex: '…', tip: 'Ellipsis' },
        // Add more as needed
    ];

    // Dropdown component for symbol palettes
    const SymbolDropdown = ({ symbols, label }: { symbols: any[]; label: string }) => {
        const [open, setOpen] = useState(false);
        return (
            <div className="relative inline-block">
                <button
                    type="button"
                    className="p-2 rounded text-sm bg-white text-purple-700 hover:bg-purple-50 border border-purple-300 font-medium"
                    onClick={() => setOpen((v) => !v)}
                    title={label}
                >
                    {label} ▼
                </button>
                {open && (
                    <div className="absolute z-10 mt-2 w-56 bg-white border border-purple-200 rounded shadow-lg max-h-72 overflow-y-auto">
                        {symbols.map((sym, i) => (
                            <button
                                key={i}
                                className="block w-full text-left px-4 py-2 hover:bg-purple-50 text-sm"
                                title={sym.tip}
                                onClick={() => {
                                    insertLatex(sym.latex, sym.latex.includes('\\') || sym.latex.includes('^') || sym.latex.includes('=') || sym.latex.includes('\\begin'));
                                    setOpen(false);
                                }}
                            >
                                {sym.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const EditorToolbar = () => (
        <div className="flex flex-wrap gap-1 bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-t-lg border-b border-gray-300">
            {/* Text Styling */}
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded text-sm font-semibold transition-colors ${editor.isActive('bold') ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                title="Bold (Ctrl+B)"
            >
                <strong>B</strong>
            </button>

            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded text-sm italic transition-colors ${editor.isActive('italic') ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                title="Italic (Ctrl+I)"
            >
                <em>I</em>
            </button>

            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded text-sm underline transition-colors ${editor.isActive('underline') ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                title="Underline (Ctrl+U)"
            >
                <u>U</u>
            </button>

            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded text-sm line-through transition-colors ${editor.isActive('strike') ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                title="Strikethrough"
            >
                <s>S</s>
            </button>

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Headings */}
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`px-2 py-1 rounded text-sm font-bold transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                title="Heading 1"
            >
                H1
            </button>

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-2 py-1 rounded text-sm font-bold transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                title="Heading 2"
            >
                H2
            </button>

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`px-2 py-1 rounded text-sm font-bold transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                title="Heading 3"
            >
                H3
            </button>

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Lists */}
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded text-sm transition-colors ${editor.isActive('bulletList') ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                title="Bullet List"
            >
                ◦ •
            </button>

            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded text-sm transition-colors ${editor.isActive('orderedList') ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                title="Ordered List"
            >
                1.
            </button>

            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-2 rounded text-sm font-mono transition-colors ${editor.isActive('codeBlock') ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                title="Code Block"
            >
                {'<>'}
            </button>

            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded text-sm transition-colors ${editor.isActive('blockquote') ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                title="Blockquote"
            >
                "
            </button>

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Math Buttons & Dropdowns */}
            <button
                onClick={() => insertLatex('\\frac{a}{b}', true)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm bg-white text-purple-700 hover:bg-purple-50 transition-colors border border-purple-300 font-medium"
                title="Insert Fraction"
            >
                <Plus className="h-4 w-4" />
                ∑
            </button>
            <button
                onClick={() => insertLatex('\\int', false)}
                className="px-2 py-1 rounded text-sm bg-white text-purple-700 hover:bg-purple-50 border border-purple-300 font-medium"
                title="Insert Integral"
            >
                ∫
            </button>
            <button
                onClick={() => insertLatex('\\sqrt{x}', false)}
                className="px-2 py-1 rounded text-sm bg-white text-purple-700 hover:bg-purple-50 border border-purple-300 font-medium"
                title="Insert Square Root"
            >
                √
            </button>
            <button
                onClick={() => insertLatex('\\pi', false)}
                className="px-2 py-1 rounded text-sm bg-white text-purple-700 hover:bg-purple-50 border border-purple-300 font-medium"
                title="Insert Pi"
            >
                π
            </button>
            <SymbolDropdown symbols={mathSymbols} label="More Math" />
            <SymbolDropdown symbols={writingSymbols} label="Writing" />

            {/* Clear Formatting */}
            <button
                onClick={() => editor.chain().focus().clearNodes().run()}
                className="p-2 rounded text-sm bg-white text-gray-700 hover:bg-gray-200 transition-colors"
                title="Clear Formatting"
            >
                ✕
            </button>

            <div className="flex-1"></div>

            {/* Expand Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                title="Open in full-screen"
            >
                <Maximize2 className="h-4 w-4" />
                Expand
            </button>
        </div>
    );

    const EditorView = ({ isFullScreen = false }: { isFullScreen?: boolean }) => (
        <div className={`border-2 border-purple-300 rounded-lg ${!isFullScreen ? 'rounded-t-none' : ''} bg-white`}>
            <EditorContent
                editor={editor}
                className={`prose prose-sm max-w-none focus:outline-none p-4 ${isFullScreen ? 'min-h-[50vh]' : 'min-h-[150px]'} bg-white`}
            />
        </div>
    );

    const PreviewView = ({ content, isFullScreen = false }: { content: string; isFullScreen?: boolean }) => {
        const renderedHTML = renderMathInHTML(content || '<p class="text-gray-400">No content yet</p>');
        return (
            <div
                className={`border-2 border-purple-300 rounded-lg bg-white prose prose-sm max-w-none p-4 ${isFullScreen ? 'min-h-[60vh]' : 'min-h-[150px]'} overflow-y-auto`}
                dangerouslySetInnerHTML={{ __html: renderedHTML }}
            />
        );
    };

    return (
        <div className="space-y-3">
            {/* Inline Editor */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-purple-700 flex items-center gap-2">
                        <span>📝 Description</span>
                        {isPreviewMode && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Preview</span>}
                    </label>
                </div>

                {!isPreviewMode ? (
                    <>
                        <EditorToolbar />
                        <EditorView />
                    </>
                ) : (
                    <PreviewView content={value} />
                )}

                <button
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 transition-all shadow-md"
                >
                    {isPreviewMode ? (
                        <>
                            <Edit2 className="h-4 w-4" />
                            Edit
                        </>
                    ) : (
                        <>
                            <Eye className="h-4 w-4" />
                            Preview
                        </>
                    )}
                </button>
            </div>

            {/* Full-Screen Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-5xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-2xl font-bold text-white">📝 Rich Description Editor</h2>
                                <p className="text-sm text-purple-100 mt-1">Professional blog-style editor with full mathematical support</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-full p-2 text-white hover:bg-white/20 transition-colors focus:outline-none"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-6 space-y-4">
                                {/* Mode Toggle */}
                                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <span className="text-sm font-medium text-gray-700">Mode:</span>
                                    <button
                                        onClick={() => setIsPreviewMode(false)}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${!isPreviewMode
                                            ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setIsPreviewMode(true)}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${isPreviewMode
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                    >
                                        <Eye className="h-4 w-4" />
                                        Preview
                                    </button>
                                </div>

                                {!isPreviewMode ? (
                                    <>
                                        <EditorToolbar />
                                        <div className="border-2 border-purple-300 rounded-lg bg-white overflow-hidden">
                                            <EditorContent
                                                editor={editor}
                                                className="prose prose-base max-w-none focus:outline-none p-6 min-h-[60vh] bg-white"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <PreviewView content={value} isFullScreen={true} />
                                )}

                                {/* Formatting Tips */}
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-600 p-6 rounded-r-lg">
                                    <h3 className="font-bold text-indigo-900 mb-3 text-lg">💡 Complete Formatting Guide</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-indigo-800 mb-2">Text Formatting</h4>
                                            <ul className="text-sm text-indigo-800 space-y-1">
                                                <li>• <strong>Bold</strong> - Select & press Ctrl+B or click <strong>B</strong></li>
                                                <li>• <em>Italic</em> - Select & press Ctrl+I or click <em>I</em></li>
                                                <li>• <u>Underline</u> - Click U button</li>
                                                <li>• <s>Strikethrough</s> - Click S button</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-indigo-800 mb-2">Structure & Lists</h4>
                                            <ul className="text-sm text-indigo-800 space-y-1">
                                                <li>• Headings: H1, H2, H3 buttons</li>
                                                <li>• Bullet list (•) for unordered items</li>
                                                <li>• Numbered list (1.) for steps</li>
                                                <li>• Blockquote (&quot;) for quotes</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-indigo-800 mb-2">Mathematical Equations</h4>
                                            <ul className="text-sm text-indigo-800 space-y-1">
                                                <li>• Inline: <code>{"$\\frac{a}{b}$"}</code> → <span dangerouslySetInnerHTML={{ __html: katex.renderToString("\\frac{a}{b}", { throwOnError: false }) }} /></li>
                                                <li>• Display: <code>{"$$\\sqrt{x}$$"}</code> (on new line) → <span dangerouslySetInnerHTML={{ __html: katex.renderToString("\\sqrt{x}", { throwOnError: false, displayMode: true }) }} /></li>
                                                <li>• Or click the <strong>∑</strong> button to insert</li>
                                                <li>• Examples:</li>
                                                <li className="flex flex-wrap gap-4 pl-4">
                                                    <span><code>{"$\\sin x$"}</code> → <span dangerouslySetInnerHTML={{ __html: katex.renderToString("\\sin x", { throwOnError: false }) }} /></span>
                                                    <span><code>{"$\\cos x$"}</code> → <span dangerouslySetInnerHTML={{ __html: katex.renderToString("\\cos x", { throwOnError: false }) }} /></span>
                                                    <span><code>{"$\\int_0^1 x^2 dx$"}</code> → <span dangerouslySetInnerHTML={{ __html: katex.renderToString("\\int_0^1 x^2 dx", { throwOnError: false }) }} /></span>
                                                    <span><code>{"$\\sum_{n=1}^\infty 2^{-n}$"}</code> → <span dangerouslySetInnerHTML={{ __html: katex.renderToString("\\sum_{n=1}^\\infty 2^{-n}", { throwOnError: false }) }} /></span>
                                                    <span><code>{"$\\alpha$"}</code> → <span dangerouslySetInnerHTML={{ __html: katex.renderToString("\\alpha", { throwOnError: false }) }} /></span>
                                                    <span><code>{"$\\beta$"}</code> → <span dangerouslySetInnerHTML={{ __html: katex.renderToString("\\beta", { throwOnError: false }) }} /></span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-indigo-800 mb-2">Code & Details</h4>
                                            <ul className="text-sm text-indigo-800 space-y-1">
                                                <li>• Code block {'<>'} - Multi-line code</li>
                                                <li>• Supports syntax highlighting</li>
                                                <li>• Perfect for technical content</li>
                                                <li>• Use "Clear" button to reset formatting</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-indigo-200">
                                        <p className="text-xs text-indigo-700 font-semibold">
                                            💡 Tip: Click Preview to see how your content looks with rendered math equations!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 p-6 flex items-center justify-between">
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                <span>✅</span>
                                <span>Content updates automatically as you type</span>
                            </p>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md"
                            >
                                <Minimize2 className="h-4 w-4" />
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* KaTeX styles for math rendering */}
            <style>{`
                .math-block {
                    display: block;
                    text-align: center;
                    margin: 1em 0;
                    overflow-x: auto;
                }
                .math-inline {
                    display: inline;
                    padding: 0 2px;
                }
                .katex {
                    font-size: 1em;
                }
            `}</style>
        </div>
    );
};

export default RichDescriptionEditor;
