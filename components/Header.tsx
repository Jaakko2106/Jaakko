
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
    onMenuToggle: () => void;
    isMenuOpen: boolean;
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen, theme, onThemeToggle }) => {
    const { language, setLanguage, t } = useLanguage();
    const [activeSection, setActiveSection] = useState('home');
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            setScrollProgress((currentScroll / totalScroll) * 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const sections = ['home', 'about', 'experience', 'education', 'works', 'contact'];
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'fi' : 'en');
    };

    const handlePrint = () => {
        window.print();
    };

    const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href')?.substring(1);
        if (targetId) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm fixed w-full top-0 left-0 z-50 transition-colors duration-300 print:hidden">
            {/* Scroll Progress Bar */}
            <div 
                className="absolute top-0 left-0 h-1 bg-indigo-600 transition-all duration-150 ease-out z-50" 
                style={{ width: `${scrollProgress}%` }}
            />
            
            <div className="container mx-auto px-4 h-16 sm:h-20 flex justify-between items-center">
                <div className="flex items-center">
                    <svg width="40" height="40" viewBox="0 0 100 100" className="mr-3 flex-shrink-0" aria-hidden="true">
                        <rect width="100" height="100" rx="20" fill="#4f46e5"/>
                        <text x="50" y="65" fontFamily="Inter, sans-serif" fontSize="50" fill="white" textAnchor="middle" fontWeight="bold">J</text>
                    </svg>
                    <span className="text-lg sm:text-xl font-bold text-indigo-700 dark:text-indigo-400 whitespace-nowrap">Jaakko |</span>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center ml-10 space-x-2">
                        {[
                            { href: "#home", label: t.menu.home },
                            { href: "#about", label: t.menu.about },
                            { href: "#experience", label: t.menu.experience },
                            { href: "#education", label: t.menu.education },
                            { href: "#works", label: t.menu.works },
                            { href: "#contact", label: t.menu.contact }
                        ].map((item) => (
                            <a 
                                key={item.href}
                                href={item.href}
                                onClick={handleLinkClick}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                                    activeSection === item.href.substring(1) 
                                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' 
                                    : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Language Toggle */}
                    <button
                        onClick={toggleLanguage}
                        className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-indigo-700 dark:text-indigo-400 font-bold text-sm uppercase hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-10 h-10 flex items-center justify-center"
                        aria-label={`Switch to ${language === 'en' ? 'Finnish' : 'English'}`}
                    >
                        {language === 'en' ? 'FI' : 'EN'}
                    </button>

                     <button 
                        onClick={handlePrint}
                        className="bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out text-sm shadow-md inline-flex items-center gap-2 p-2 sm:py-2 sm:px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        aria-label={t.header.downloadCv}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        <span className="hidden sm:inline">{t.header.downloadCv}</span>
                    </button>

                    {/* Theme Toggle Button */}
                    <button 
                        onClick={onThemeToggle}
                        className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label={t.header.themeToggle}
                    >
                        {theme === 'light' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        )}
                    </button>

                    <button 
                        id="menu-toggle" 
                        onClick={onMenuToggle} 
                        className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-800 lg:hidden"
                        aria-label={isMenuOpen ? t.header.menuClose : t.header.menuOpen}
                        aria-expanded={isMenuOpen}
                        aria-controls="off-canvas-menu"
                    >
                        <svg className="w-6 h-6 text-indigo-700 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
