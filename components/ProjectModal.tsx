
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
        <div className="relative w-full h-full group/image cursor-zoom-in" onClick={onClick}>
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
                className={`absolute block w-full h-full object-contain -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-lg transition-all duration-300 hover:scale-[1.02] ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
            />
            {/* Hover overlay with zoom icon for better affordance */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-black/30 backdrop-blur-sm p-3 rounded-full text-white/90 shadow-lg transform scale-90 group-hover/image:scale-100 transition-transform">
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
                
                <div id="project-carousel" className="relative w-full group/carousel" {...swipeHandlers}>
                    <div className="relative h-56 overflow-hidden rounded-lg md:h-80 bg-gray-50 dark:bg-gray-800">
                        {project.images.map((image, index) => (
                            <div key={index} className={`carousel-slide ${index === currentSlideIndex ? 'active' : ''} h-full w-full relative`}>
                                <CarouselImage src={image.url} alt={image.caption || project.title} onClick={toggleFullscreen} />
                            </div>
                        ))}
                    </div>
                    
                    <button onClick={prevSlide} className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none hidden md:flex">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-black/30 group-hover:bg-white/50 dark:group-hover:bg-black/50 transition-colors">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/></svg>
                        </span>
                    </button>
                    <button onClick={nextSlide} className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none hidden md:flex">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-black/30 group-hover:bg-white/50 dark:group-hover:bg-black/50 transition-colors">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/></svg>
                        </span>
                    </button>
                </div>

                <div className="min-h-[1.5rem] my-3 text-center">
                    {currentImage.caption && <p className="text-sm text-gray-500 dark:text-gray-400 italic font-medium">{currentImage.caption}</p>}
                </div>

                <div className="flex gap-2 mb-2 overflow-x-auto pt-10 pb-2 justify-center px-2">
                    {project.images.map((img, index) => (
                        <div key={index} className="relative group/thumb flex-shrink-0">
                            <button
                                onClick={() => setCurrentSlideIndex(index)}
                                className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${index === currentSlideIndex ? 'border-indigo-600 shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                            >
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                            </button>
                        </div>
                    ))}
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">{project.description}</p>
                
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {project.client && (
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-1">{t.projectModal.client}</span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{project.client}</span>
                        </div>
                    )}
                    {project.projectType && (
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-1">{t.projectModal.type}</span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{project.projectType}</span>
                        </div>
                    )}
                    {project.tools && project.tools.length > 0 && (
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-2">{t.projectModal.tools}</span>
                            <div className="flex flex-wrap gap-1.5">
                                {project.tools.map(tool => (
                                    <span key={tool} className="text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/50">
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isFullscreen && (
                <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm cursor-grab active:cursor-grabbing" onClick={handleFullscreenClose} {...swipeHandlers}>
                    <button className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all z-[210] focus:outline-none" onClick={handleFullscreenClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    
                    {/* Fullscreen Navigation Arrows */}
                    <button 
                        onClick={prevSlide} 
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all z-[210] focus:outline-none hidden md:block"
                        aria-label="Previous image"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button 
                        onClick={nextSlide} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all z-[210] focus:outline-none hidden md:block"
                         aria-label="Next image"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>

                    <FullscreenImage src={currentImage.url} alt={currentImage.caption || project.title} />
                    
                    {currentImage.caption && (
                        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                            <span className="inline-block bg-black/50 backdrop-blur-md text-white/90 px-4 py-2 rounded-lg text-sm max-w-[90%] truncate">
                                {currentImage.caption}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectModal;
