
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import EditableImage from './EditableImage';

const CityLandscape: React.FC = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden print:hidden" aria-hidden="true">
            {/* Sky Background with Dusk till Dawn Animation */}
            <div className="absolute inset-0 animate-sky-cycle"></div>
            
            {/* Stars - only visible at night */}
            <div className="absolute inset-0 opacity-0 animate-stars-fade">
                {new Array(100).fill(0).map((_, i) => (
                    <div 
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            top: `${Math.random() * 70}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            opacity: Math.random() * 0.8 + 0.2,
                            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            {/* Sun / Moon */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] animate-celestial-rotate">
                {/* Sun */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-yellow-400 rounded-full shadow-[0_0_60px_rgba(250,204,21,0.8)]"></div>
                {/* Moon */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-gray-100 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                    {/* Moon craters */}
                    <div className="absolute top-4 left-4 w-4 h-4 bg-gray-300 rounded-full opacity-40"></div>
                    <div className="absolute top-10 left-8 w-6 h-6 bg-gray-300 rounded-full opacity-40"></div>
                    <div className="absolute top-6 left-12 w-3 h-3 bg-gray-300 rounded-full opacity-40"></div>
                </div>
            </div>

            {/* City Silhouette */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 flex items-end justify-center">
                <svg viewBox="0 0 1200 400" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                    {/* Back buildings */}
                    <path d="M0,400 L0,300 L50,300 L50,250 L100,250 L100,320 L150,320 L150,200 L200,200 L200,350 L250,350 L250,280 L300,280 L300,400 Z" fill="#1e1b4b" opacity="0.4" />
                    <path d="M900,400 L900,320 L950,320 L950,220 L1000,220 L1000,300 L1050,300 L1050,260 L1100,260 L1100,350 L1150,350 L1150,400 Z" fill="#1e1b4b" opacity="0.4" />
                    
                    {/* Mid buildings */}
                    <path d="M100,400 L100,280 L180,280 L180,220 L250,220 L250,300 L320,300 L320,180 L400,180 L400,350 L480,350 L480,400 Z" fill="#1e1b4b" opacity="0.7" />
                    <path d="M700,400 L700,300 L780,300 L780,200 L850,200 L850,320 L920,320 L920,250 L1000,250 L1000,400 Z" fill="#1e1b4b" opacity="0.7" />
                    
                    {/* Front buildings */}
                    <path d="M0,400 L0,350 L80,350 L80,250 L160,250 L160,320 L240,320 L240,200 L320,200 L320,380 L400,380 L400,280 L480,280 L480,150 L560,150 L560,320 L640,320 L640,220 L720,220 L720,350 L800,350 L800,260 L880,260 L880,380 L960,380 L960,300 L1040,300 L1040,360 L1120,360 L1120,280 L1200,280 L1200,400 Z" fill="#0f172a" />
                    
                    {/* Windows - glowing at night */}
                    <g className="animate-windows-glow">
                        <rect x="100" y="300" width="10" height="10" fill="#fef08a" />
                        <rect x="120" y="300" width="10" height="10" fill="#fef08a" />
                        <rect x="100" y="320" width="10" height="10" fill="#fef08a" />
                        <rect x="260" y="220" width="10" height="10" fill="#fef08a" />
                        <rect x="280" y="220" width="10" height="10" fill="#fef08a" />
                        <rect x="500" y="180" width="10" height="10" fill="#fef08a" />
                        <rect x="520" y="180" width="10" height="10" fill="#fef08a" />
                        <rect x="500" y="200" width="10" height="10" fill="#fef08a" />
                        <rect x="740" y="250" width="10" height="10" fill="#fef08a" />
                        <rect x="760" y="250" width="10" height="10" fill="#fef08a" />
                        <rect x="1060" y="320" width="10" height="10" fill="#fef08a" />
                        <rect x="1080" y="320" width="10" height="10" fill="#fef08a" />
                    </g>
                </svg>
            </div>
            
            {/* Fog / Mist */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-900/40 to-transparent z-10"></div>
        </div>
    );
};

const HomeSection: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="home" className="relative min-h-[100dvh] w-full flex flex-col justify-center items-center text-center px-4 py-20 overflow-hidden group print:min-h-0 print:p-0 print:block">
            {/* City Landscape Background */}
            <CityLandscape />

            {/* Reduced overlay opacity to make animation significantly more visible */}
            <div className="absolute inset-0 bg-gray-900/10 z-0 pointer-events-none print:hidden"></div>
            {/* Gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-transparent to-gray-900/60 z-0 pointer-events-none print:hidden"></div>

            {/* Main content container with adjusted padding for header clearance and better mobile spacing */}
            <div className="relative z-10 max-w-4xl mx-auto text-white w-full flex flex-col items-center justify-center pt-24 pb-16 md:py-0 print:text-black print:block print:pt-0 print:pb-0 print:w-full">
                {/* Print only contact info */}
                <div className="hidden print:block text-gray-600 mb-6 text-sm text-center">
                    <p>jaakko.kkallio@gmail.com &bull; +358 442457835 &bull; {t.home.location}</p>
                    <p>www.jaakkodesign.com</p>
                </div>

                <div className="flex flex-col-reverse md:flex-col items-center gap-6 sm:gap-8 print:block print:clearfix">
                     {/* Text color light blue (blue-200), reduced size for mobile */}
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-2 sm:mb-4 animate-on-scroll zoom-in text-blue-200 drop-shadow-lg leading-tight print:text-4xl print:text-black print:drop-shadow-none print:mb-2">{t.home.greeting}</h1>
                    
                    {/* Responsive image size: Larger on all screens for prominence, distinct white sticker-like border */}
                    <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 mx-auto bg-white rounded-full flex items-center justify-center overflow-hidden shadow-2xl border-[6px] border-white group/avatar animate-on-scroll zoom-in print:float-right print:w-32 print:h-32 print:shadow-none print:border-0 print:mb-4 relative" style={{ transitionDelay: '0.4s' }}>
                         <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500 z-10 rounded-full pointer-events-none"></div>
                        <EditableImage 
                            storageKey="home-avatar"
                            defaultSrc="https://lh3.googleusercontent.com/a/ACg8ocIbYAtYBynI5k_UqBs1sOOl8RnaqJ3VHv89wBhQZTyr4OOJ2EtFHQ=s288-c-no"
                            alt="Jaakko"
                            wrapperClassName="w-full h-full"
                            className="w-full h-full object-cover transform group-hover/avatar:scale-110 transition-transform duration-700 ease-in-out"
                        />
                    </div>
                </div>

                <p className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-8 animate-on-scroll fade-in-up text-white/90 drop-shadow-md print:text-black print:drop-shadow-none print:text-left print:text-xl print:font-bold print:mb-4" style={{ transitionDelay: '0.2s' }}>{t.home.role}</p>
                
                <p className="mt-4 sm:mt-8 text-sm sm:text-lg max-w-2xl mx-auto animate-on-scroll fade-in-up text-white/80 drop-shadow-sm px-2 sm:px-4 print:text-black print:drop-shadow-none print:px-0 print:text-left print:max-w-full print:mt-2" style={{ transitionDelay: '0.6s' }}>
                    {t.home.description}
                </p>
            </div>
        </section>
    );
};

export default HomeSection;
