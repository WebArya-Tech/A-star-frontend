import React, { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface TutorCardProps {
    name: string;
    subject: string;
    specialty: string;
    image: string;
    bio: string;
}

const TutorCard: React.FC<TutorCardProps> = ({ name, subject, specialty, image, bio }) => {
    const [zoom, setZoom] = useState(1);
    const [expanded, setExpanded] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    const handleZoom = (direction: 'in' | 'out') => {
        if (direction === 'in' && zoom < 2) {
            setZoom(zoom + 0.2);
        } else if (direction === 'out' && zoom > 1) {
            setZoom(zoom - 0.2);
        }
    };

    const showReadMore = bio && bio.length > 140;
    const displayBio = expanded ? bio : showReadMore ? `${bio.slice(0, 140).trim()}...` : bio;

    return (
        <>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Image Container with Zoom Controls */}
                <div className="relative bg-gray-100 h-64 overflow-hidden flex items-center justify-center">
                    <button
                        type="button"
                        onClick={() => setShowImageModal(true)}
                        className="absolute inset-0 z-20"
                        aria-label={`View full image of ${name}`}
                    />
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover object-center transition-transform duration-300"
                        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />

                    <div className="absolute bottom-3 right-3 bg-white rounded-lg shadow-md flex gap-2">
                        <button
                            onClick={() => handleZoom('in')}
                            disabled={zoom >= 2}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Zoom In"
                        >
                            <ZoomIn className="h-5 w-5 text-blue-600" />
                        </button>
                        <button
                            onClick={() => handleZoom('out')}
                            disabled={zoom <= 1}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Zoom Out"
                        >
                            <ZoomOut className="h-5 w-5 text-blue-600" />
                        </button>
                    </div>

                    <span className="absolute left-3 bottom-3 inline-flex items-center gap-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                        Click to view full image
                    </span>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
                    <p className="text-blue-600 font-semibold mb-2">{subject}</p>
                    <p className="text-sm text-gray-600 mb-3">{specialty}</p>
                    <p className={`text-gray-700 text-sm leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
                        {displayBio}
                    </p>
                    {showReadMore && (
                        <button
                            type="button"
                            onClick={() => setExpanded(!expanded)}
                            className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                            {expanded ? 'Show less' : 'Read more'}
                        </button>
                    )}
                </div>
            </div>

            {/* Full Image Modal */}
            {showImageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
                    <div className="absolute inset-0" onClick={() => setShowImageModal(false)} />
                    <div className="relative max-w-5xl w-full max-h-full overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <button
                            type="button"
                            onClick={() => setShowImageModal(false)}
                            className="absolute top-4 right-4 z-20 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                            aria-label="Close full image"
                        >
                            ✕
                        </button>
                        <div className="flex items-center justify-center min-h-[60vh] bg-black">
                            <img
                                src={image}
                                alt={name}
                                className="max-h-[90vh] max-w-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TutorCard;
