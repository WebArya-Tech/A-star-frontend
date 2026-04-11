import { useState, useRef, useCallback, useEffect, type ClipboardEvent, type KeyboardEvent, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react';
import {
    Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3,
    List, ListOrdered, Code, Quote, Link as LinkIcon, Image as ImageIcon,
    Minus, Eye, Edit3, AlignLeft, AlignCenter, AlignRight, ImageOff, Undo, Redo,
    Type
} from 'lucide-react';

type ToolbarAction = {
    key: string;
    separator?: false;
    icon: (props: { size?: number | string; className?: string }) => ReactNode;
    label: string;
    command?: string;
    value?: string;
    special?: 'code' | 'image' | 'link';
};

type ToolbarSeparator = {
    key: string;
    separator: true;
};

type ToolbarItem = ToolbarAction | ToolbarSeparator;

type ContentEditorProps = {
    initialContent?: string;
    onChange: (html: string) => void;
};

/* ─── Toolbar config ─── */
const TOOLBAR: ToolbarItem[] = [
    { key: 'undo', icon: Undo, label: 'Undo', command: 'undo' },
    { key: 'redo', icon: Redo, label: 'Redo', command: 'redo' },
    { key: 'sep0', separator: true },
    { key: 'bold', icon: Bold, label: 'Bold (Ctrl+B)', command: 'bold' },
    { key: 'italic', icon: Italic, label: 'Italic (Ctrl+I)', command: 'italic' },
    { key: 'underline', icon: Underline, label: 'Underline (Ctrl+U)', command: 'underline' },
    { key: 'strikethrough', icon: Strikethrough, label: 'Strikethrough', command: 'strikeThrough' },
    { key: 'sep1', separator: true },
    { key: 'h1', icon: Heading1, label: 'Heading 1', command: 'formatBlock', value: 'h1' },
    { key: 'h2', icon: Heading2, label: 'Heading 2', command: 'formatBlock', value: 'h2' },
    { key: 'h3', icon: Heading3, label: 'Heading 3', command: 'formatBlock', value: 'h3' },
    { key: 'paragraph', icon: Type, label: 'Normal Text', command: 'formatBlock', value: 'p' },
    { key: 'sep2', separator: true },
    { key: 'ul', icon: List, label: 'Bullet List', command: 'insertUnorderedList' },
    { key: 'ol', icon: ListOrdered, label: 'Numbered List', command: 'insertOrderedList' },
    { key: 'blockquote', icon: Quote, label: 'Blockquote', command: 'formatBlock', value: 'blockquote' },
    { key: 'sep3', separator: true },
    { key: 'code', icon: Code, label: 'Code Block', special: 'code' },
    { key: 'hr', icon: Minus, label: 'Horizontal Rule', command: 'insertHorizontalRule' },
    { key: 'sep4', separator: true },
    { key: 'alignLeft', icon: AlignLeft, label: 'Align Left', command: 'justifyLeft' },
    { key: 'alignCenter', icon: AlignCenter, label: 'Align Center', command: 'justifyCenter' },
    { key: 'alignRight', icon: AlignRight, label: 'Align Right', command: 'justifyRight' },
    { key: 'sep5', separator: true },
    { key: 'link', icon: LinkIcon, label: 'Insert Link', special: 'link' },
    { key: 'image', icon: ImageIcon, label: 'Insert Image', special: 'image' },
];

export const ContentEditor = ({ initialContent, onChange }: ContentEditorProps) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [htmlContent, setHtmlContent] = useState(initialContent || '');
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [savedSelection, setSavedSelection] = useState<Range | null>(null);
    const [wordCount, setWordCount] = useState(0);

    // Restore content into editor when switching back to edit mode
    useEffect(() => {
        if (mode === 'edit' && editorRef.current && htmlContent) {
            editorRef.current.innerHTML = htmlContent;
            updateWordCount();
        }
    }, [mode]);

    // Set initial content on first mount
    useEffect(() => {
        if (editorRef.current && initialContent && !editorRef.current.innerHTML) {
            editorRef.current.innerHTML = initialContent;
            setHtmlContent(initialContent);
            updateWordCount();
        }
    }, [initialContent]);

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            setSavedSelection(sel.getRangeAt(0).cloneRange());
        }
    };

    const restoreSelection = () => {
        if (savedSelection && editorRef.current) {
            const sel = window.getSelection();
            if (!sel) return;
            sel.removeAllRanges();
            sel.addRange(savedSelection.cloneRange());
        }
    };

    const focusEditorWithSelection = () => {
        const editor = editorRef.current;
        if (!editor) return;

        editor.focus();
        const sel = window.getSelection();
        if (!sel) return;

        // If we have a previously saved selection, restore it
        if (savedSelection) {
            try {
                sel.removeAllRanges();
                sel.addRange(savedSelection.cloneRange());
            } catch (e) {
                console.error('Failed to restore selection:', e);
            }
        }
        // Otherwise, just ensure editor is focused - don't manipulate selection
    };

    const updateWordCount = () => {
        if (editorRef.current) {
            const text = editorRef.current.innerText.trim();
            setWordCount(text ? text.split(/\s+/).length : 0);
        }
    };

    const handleInput = useCallback(() => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            setHtmlContent(html);
            onChange(html);
            updateWordCount();
        }
    }, [onChange]);

    // Save content before switching to preview
    const switchMode = (newMode: 'edit' | 'preview') => {
        if (mode === 'edit' && editorRef.current) {
            const html = editorRef.current.innerHTML;
            setHtmlContent(html);
        }
        setMode(newMode);
    };

    const execCommand = (command: string, value: string | null = null) => {
        const editor = editorRef.current;
        if (!editor) return;

        // Get current selection before any focus changes
        const sel = window.getSelection();
        let currentRange: Range | null = null;
        if (sel && sel.rangeCount > 0) {
            currentRange = sel.getRangeAt(0).cloneRange();
        }

        // Focus editor
        editor.focus();

        // Restore selection if we have it
        if (currentRange) {
            sel?.removeAllRanges();
            sel?.addRange(currentRange);
        }

        // Execute the command
        try {
            if (value) {
                document.execCommand(command, false, value);
            } else {
                document.execCommand(command, false);
            }
        } catch (e) {
            console.error(`Command '${command}' failed:`, e);
        }

        // Save new selection state
        saveSelection();
        handleInput();
    };

    const handleToolbar = useCallback((item: ToolbarAction) => {
        const editor = editorRef.current;
        if (!editor) return;

        const sel = window.getSelection();
        if (!sel) return;

        // Save current selection before any focus changes
        const savedRange = sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
        setSavedSelection(savedRange);

        if (item.special === 'image') {
            setShowImageDialog(true);
            return;
        }
        if (item.special === 'link') {
            const linkTextContent = sel.toString();
            setLinkText(linkTextContent);
            setShowLinkDialog(true);
            return;
        }
        if (item.special === 'code') {
            const selectedText = sel.toString();
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.textContent = selectedText || 'code here';
            pre.appendChild(code);

            if (savedRange) {
                savedRange.deleteContents();
                savedRange.insertNode(pre);
                savedRange.setStartAfter(pre);
                savedRange.collapse(true);
                sel.removeAllRanges();
                sel.addRange(savedRange);
            } else {
                editor.appendChild(pre);
            }
            saveSelection();
            handleInput();
            return;
        }

        // For all other commands, execute directly
        if (item.command) {
            if (item.command === 'formatBlock') {
                execCommand(item.command, item.value || null);
            } else {
                execCommand(item.command, null);
            }
        }
    }, [handleInput]);

    const handleInsertImage = () => {
        if (!imageUrl.trim()) { setShowImageDialog(false); return; }
        editorRef.current?.focus();
        restoreSelection();

        const figure = document.createElement('figure');
        figure.className = 'blog-figure';

        const img = document.createElement('img');
        img.src = imageUrl.trim();
        img.alt = imageAlt.trim() || 'image';
        img.className = 'blog-img';
        img.onerror = function () {
            this.remove();
        };

        figure.appendChild(img);

        if (imageAlt.trim()) {
            const caption = document.createElement('figcaption');
            caption.textContent = imageAlt.trim();
            figure.appendChild(caption);
        }

        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(figure);
            range.setStartAfter(figure);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        } else {
            editorRef.current?.appendChild(figure);
        }

        handleInput();
        setShowImageDialog(false);
        setImageUrl('');
        setImageAlt('');
    };

    const handleInsertLink = () => {
        if (!linkUrl.trim()) { setShowLinkDialog(false); return; }
        editorRef.current?.focus();
        restoreSelection();

        const text = linkText.trim() || linkUrl.trim();
        const a = document.createElement('a');
        a.href = linkUrl.trim();
        a.textContent = text;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';

        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(a);
            range.setStartAfter(a);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }

        handleInput();
        setShowLinkDialog(false);
        setLinkUrl('');
        setLinkText('');
    };

    const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
        // Paste as clean HTML, stripping dangerous scripts
        e.preventDefault();
        const html = e.clipboardData.getData('text/html');
        const text = e.clipboardData.getData('text/plain');

        if (html) {
            // Insert cleaned HTML
            const temp = document.createElement('div');
            temp.innerHTML = html;
            // Remove scripts and event handlers
            temp.querySelectorAll('script, style').forEach(el => el.remove());
            temp.querySelectorAll('*').forEach(el => {
                for (const attr of [...el.attributes]) {
                    if (attr.name.startsWith('on')) el.removeAttribute(attr.name);
                }
            });
            document.execCommand('insertHTML', false, temp.innerHTML);
        } else {
            document.execCommand('insertText', false, text);
        }
        handleInput();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        // Handle keyboard shortcuts for formatting
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
            const editor = editorRef.current;
            if (!editor) return;
            saveSelection();

            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    execCommand('bold');
                    return;
                case 'i':
                    e.preventDefault();
                    execCommand('italic');
                    return;
                case 'u':
                    e.preventDefault();
                    execCommand('underline');
                    return;
                default:
                    break;
            }
        }
        // Tab key inserts spaces in code blocks
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertText', false, '    ');
        }
    };

    return (
        <div className="border border-border-primary rounded-xl overflow-hidden bg-bg-card">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-bg-secondary border-b border-border-primary">
                {TOOLBAR.map((item) =>
                    item.separator ? (
                        <div key={item.key} className="w-px h-6 bg-border-primary mx-0.5" />
                    ) : (
                        <button
                            key={item.key}
                            type="button"
                            onMouseDown={(e) => {
                                // Keep text selection in contentEditable while clicking toolbar buttons.
                                e.preventDefault();
                                saveSelection();
                            }}
                            onClick={() => handleToolbar(item)}
                            className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                            title={item.label}
                        >
                            <item.icon size={16} />
                        </button>
                    )
                )}

                <div className="flex-1" />

                {/* Edit / Preview toggle */}
                <div className="flex items-center bg-bg-tertiary rounded-lg p-0.5">
                    <button type="button" onClick={() => switchMode('edit')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${mode === 'edit' ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}>
                        <Edit3 size={13} /> Edit
                    </button>
                    <button type="button" onClick={() => switchMode('preview')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${mode === 'preview' ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}>
                        <Eye size={13} /> Preview
                    </button>
                </div>
            </div>

            {/* Editor / Preview Area */}
            {mode === 'edit' ? (
                <div className="flex flex-col">
                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleInput}
                        onPaste={handlePaste}
                        onKeyDown={handleKeyDown}
                        className="blog-content p-5 min-h-[400px] max-h-[600px] overflow-y-auto outline-none focus:outline-none"
                        data-placeholder="Start writing your blog content...

Click the toolbar buttons above to format your text:
• Bold, Italic, Underline for text styling
• H1, H2, H3 for headings
• Lists, Blockquotes, Code blocks
• Insert images and links

Just select text and click a formatting button!"
                        style={{ minHeight: '400px' }}
                    />
                    <div className="flex items-center justify-between px-4 py-2 border-t border-border-secondary text-text-tertiary text-xs">
                        <span>{wordCount} words</span>
                        <span>Select text → click toolbar to format</span>
                    </div>
                </div>
            ) : (
                <div className="blog-content p-6 min-h-[400px] max-h-[600px] overflow-y-auto"
                    ref={(el) => {
                        if (!el) return;
                        // Apply image fallback handlers to preview
                        el.querySelectorAll('img').forEach(img => {
                            img.onerror = function () {
                                this.remove();
                            };
                        });
                    }}
                    dangerouslySetInnerHTML={{ __html: htmlContent || '<p style="color: var(--text-tertiary)">Switch to Edit mode to start writing...</p>' }}
                />
            )}

            {/* Image Dialog */}
            {showImageDialog && (
                <div className="fixed inset-0 bg-bg-overlay z-50 flex items-center justify-center p-4" onClick={() => setShowImageDialog(false)}>
                    <div className="bg-bg-card border border-border-primary rounded-xl p-6 w-full max-w-md shadow-lg animate-scale-in" onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                            <ImageIcon size={20} /> Insert Image
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Image URL *</label>
                                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/photo.jpg" className="input-clean w-full" autoFocus />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Caption / Alt Text</label>
                                <input type="text" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)}
                                    placeholder="Describe the image" className="input-clean w-full" />
                            </div>
                            {imageUrl && (
                                <div className="border border-border-secondary rounded-lg p-3 bg-bg-secondary">
                                    <p className="text-xs text-text-tertiary mb-2">Preview:</p>
                                    <img src={imageUrl} alt={imageAlt || 'preview'} className="max-h-32 rounded-md object-cover mx-auto"
                                        onError={(e: SyntheticEvent<HTMLImageElement>) => {
                                            e.currentTarget.style.display = 'none';
                                            const sibling = e.currentTarget.nextElementSibling as HTMLDivElement | null;
                                            if (sibling) {
                                                sibling.style.display = 'flex';
                                            }
                                        }} />
                                    <div className="blog-img-fallback" style={{ display: 'none', padding: '1rem' }}>
                                        <ImageOff size={24} /><span className="text-sm">Could not load preview</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 mt-5">
                            <button type="button" onClick={() => setShowImageDialog(false)} className="btn-secondary flex-1 text-sm py-2">Cancel</button>
                            <button type="button" onClick={handleInsertImage} disabled={!imageUrl.trim()} className="btn-primary flex-1 text-sm py-2 disabled:opacity-40">Insert</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Link Dialog */}
            {showLinkDialog && (
                <div className="fixed inset-0 bg-bg-overlay z-50 flex items-center justify-center p-4" onClick={() => setShowLinkDialog(false)}>
                    <div className="bg-bg-card border border-border-primary rounded-xl p-6 w-full max-w-md shadow-lg animate-scale-in" onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                            <LinkIcon size={20} /> Insert Link
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">URL *</label>
                                <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://example.com" className="input-clean w-full" autoFocus />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Link Text</label>
                                <input type="text" value={linkText} onChange={(e) => setLinkText(e.target.value)}
                                    placeholder="Click here" className="input-clean w-full" />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-5">
                            <button type="button" onClick={() => setShowLinkDialog(false)} className="btn-secondary flex-1 text-sm py-2">Cancel</button>
                            <button type="button" onClick={handleInsertLink} disabled={!linkUrl.trim()} className="btn-primary flex-1 text-sm py-2 disabled:opacity-40">Insert</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
