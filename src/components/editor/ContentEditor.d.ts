import type { FC } from 'react';

export interface ContentEditorProps {
    initialContent?: string;
    onChange: (html: string) => void;
}

export const ContentEditor: FC<ContentEditorProps>;
