import React from 'react';

interface Props {
    open: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
}

const CenteredModal = ({ open, onClose, title, children }: Props) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-lg max-w-md w-full mx-4 p-6 z-10">
                <div className="flex justify-between items-start">
                    {title ? <h3 className="text-xl font-bold text-gray-900">{title}</h3> : null}
                    <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-gray-800">
                        ×
                    </button>
                </div>

                <div className="mt-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CenteredModal;
