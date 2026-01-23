
import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project;
}

const CarouselImage: React.FC<{ src: string; alt: string; onClick: () => void }> = ({ src, alt, onClick }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="relative w-full h-full group/image cursor-zoom-in overflow-hidden rounded-lg" onClick={onClick}>
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                    <svg className="w-8 h-8 text-indigo-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}
            <img 
                src={src} 
                alt={alt} 
                className={`absolute block w-full h-full object-contain -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-lg transition-transform duration-500 ease-out group-hover/image:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
            />
            {/* Hover overlay with zoom icon for better affordance */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/5 backdrop-blur-[1px]">
                <div className="bg-black/40 backdrop-blur-md p-3 rounded-full text-white shadow-lg transform scale-75 group-hover/image:scale-100 transition-transform duration-300 border border-white/20">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                </div>
            </div>
        </div>
    );
};

const FullscreenImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
    }, [src]);

    return (
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none p-2 md:p-8">
             {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                     <svg className="w-12 h-12 text-white/50 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}
            <img 
                src={src} 
                alt={alt} 
                className={`max-w-full max-h-[85vh] md:max-h-[90vh] object-contain shadow-2xl rounded-lg transition-transform duration-500 ease-out pointer-events-auto cursor-default ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onClick={(e) => e.stopPropagation()} 
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
};

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project }) => {
    const { t } = useLanguage();
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showCopyFeedback, setShowCopyFeedback] = useState(false);
    const modalContentRef = useRef<HTMLDivElement>(null);

    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const touchEndY = useRef<number | null>(null);
    const isSwiping = useRef(false);
    const minSwipeDistance = 50;

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setIsVisible(true);
                setCurrentSlideIndex(0);
                setIsFullscreen(false);
                setShowCopyFeedback(false);
                modalContentRef.current?.focus();
            }, 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            setIsFullscreen(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isFullscreen) return;
            if (e.key === 'Escape') setIsFullscreen(false);
            else if (e.key === 'ArrowLeft') setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + project.images.length) % project.images.length);
            else if (e.key === 'ArrowRight') setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % project.images.length);
        };
        if (isFullscreen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen, project.images.length]);

    if (!isOpen) return null;

    const nextSlide = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % project.images.length);
    };

    const prevSlide = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + project.images.length) % project.images.length);
    };

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
        touchStartY.current = e.targetTouches[0].clientY;
        touchEndX.current = null;
        touchEndY.current = null;
        isSwiping.current = false;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
        touchEndY.current = e.targetTouches[0].clientY;
    };

    const onTouchEnd = () => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        
        // If no movement was recorded, it's just a tap
        if (touchEndX.current === null || touchEndY.current === null) {
            touchStartX.current = null;
            touchStartY.current = null;
            return;
        }

        const distanceX = touchStartX.current - touchEndX.current;
        const distanceY = touchStartY.current - touchEndY.current;
        const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY) * 2;
        
        if (isHorizontalSwipe) {
            const isLeftSwipe = distanceX > minSwipeDistance;
            const isRightSwipe = distanceX < -minSwipeDistance;
            if (isLeftSwipe || isRightSwipe) {
                isSwiping.current = true;
                if (isLeftSwipe) nextSlide();
                else prevSlide();
                
                // Add a small delay before resetting swiping state to prevent immediate click events
                setTimeout(() => { isSwiping.current = false; }, 300);
            }
        }
        
        touchStartX.current = null;
        touchStartY.current = null;
        touchEndX.current = null;
        touchEndY.current = null;
    };

    const swipeHandlers = {
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isSwiping.current) return;
        if (e.target === e.currentTarget) onClose();
    };

    const toggleFullscreen = () => {
        if (!isSwiping.current) {
            setIsFullscreen(!isFullscreen);
        }
    };

    const handleFullscreenClose = (e: React.MouseEvent) => {
        if (isSwiping.current) return;
        e.stopPropagation();
        setIsFullscreen(false);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(window.location.href).then(() => {
            setShowCopyFeedback(true);
            setTimeout(() => setShowCopyFeedback(false), 2000);
        }).catch(err => console.error('Failed to copy URL:', err));
    };

    const currentImage = project.images[currentSlideIndex];

    return (
        <div 
            id="project-details-modal" 
            className={`modal ${isVisible ? 'open' : ''}`} 
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-details-title"
        >
            <div 
                className="modal-content overflow-y-auto max-h-[90vh] relative focus:outline-none bg-white dark:bg-gray-900 transition-colors duration-300"
                ref={modalContentRef}
                tabIndex={-1}
            >
                <div className="absolute top-4 right-4 z-50 group/close">
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        aria-label={t.projectModal.close}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <button 
                    onClick={onClose}
                    className="mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors group/back focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md px-1 -ml-1"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 transition-transform group-hover/back:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                     {t.projectModal.backToProjects}
                </button>

                <div className="flex items-center gap-2 mb-4 pr-12">
                    <h3 id="project-details-title" className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{project.title}</h3>
                    <div className="relative group/share">
                        <button 
                            onClick={handleShare}
                            className="p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            aria-label={t.projectModal.share}
                        >
                             {showCopyFeedback ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                            )}
                        </button>
                    </div>
                </div>
                
                <div id="project-carousel" className="relative mb-8" {...swipeHandlers}>
                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                         {project.images.length > 0 ? (
                            <CarouselImage 
                                src={currentImage.url} 
                                alt={currentImage.caption || `Project image ${currentSlideIndex + 1}`} 
                                onClick={toggleFullscreen}
                            />
                         ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-400">No images available</div>
                         )}

                         {/* Navigation Arrows */}
                         {project.images.length > 1 && (
                             <>
                                <button 
                                    onClick={prevSlide}
                                    className="absolute top-1/2 left-4 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-900/60 hover:bg-white dark:hover:bg-gray-900 text-gray-800 dark:text-white shadow-md backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 opacity-0 group-hover:opacity-100 md:opacity-100"
                                    aria-label="Previous image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button 
                                    onClick={nextSlide}
                                    className="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-900/60 hover:bg-white dark:hover:bg-gray-900 text-gray-800 dark:text-white shadow-md backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 opacity-0 group-hover:opacity-100 md:opacity-100"
                                    aria-label="Next image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                </button>
                             </>
                         )}

                         {/* Dots */}
                         {project.images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {project.images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setCurrentSlideIndex(idx); }}
                                        className={`w-2 h-2 rounded-full transition-all shadow-sm ${idx === currentSlideIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                         )}
                    </div>
                    {currentImage?.caption && (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">{currentImage.caption}</p>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                         <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">About this project</h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {project.description}
                        </p>
                    </div>
                    <div className="space-y-6">
                        {project.client && (
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{t.projectModal.client}</h4>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">{project.client}</p>
                            </div>
                        )}
                        {project.projectType && (
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{t.projectModal.type}</h4>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">{project.projectType}</p>
                            </div>
                        )}
                        {project.tools && project.tools.length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">{t.projectModal.tools}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.tools.map(tool => (
                                        <span key={tool} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-md border border-indigo-100 dark:border-indigo-800/50">
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Fullscreen Overlay */}
            {isFullscreen && (
                <div 
                    className="fixed inset-0 z-[110] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-300"
                    onClick={handleFullscreenClose}
                >
                    <button 
                        onClick={handleFullscreenClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-[120]"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    <FullscreenImage src={currentImage.url} alt={currentImage.caption || ''} />

                    {project.images.length > 1 && (
                         <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-[120]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-[120]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                         </>
                    )}
                    
                    {currentImage?.caption && (
                        <div className="absolute bottom-8 left-0 right-0 text-center text-white/80 text-lg font-light tracking-wide px-4">
                            {currentImage.caption}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectModal;
