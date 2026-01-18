
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface OffCanvasMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

interface MenuItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

const OffCanvasMenu: React.FC<OffCanvasMenuProps> = ({ isOpen, onClose }) => {
    const { t, language, setLanguage } = useLanguage();

    const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href')?.substring(1);
        if (targetId) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
        onClose();
    };

    const menuItems: MenuItem[] = [
        {
            href: "#home",
            label: t.menu.home,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home mr-3" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        },
        {
            href: "#about",
            label: t.menu.about,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user mr-3" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        },
        {
            href: "#experience",
            label: t.menu.experience,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase-business mr-3" aria-hidden="true"><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13a10 10 0 0 1-10 10c-4.42 0-8-3.13-8-7a10 10 0 0 1 10-10c4.42 0 8 3.13 8 7"/><path d="M12 12h.01"/></svg>
        },
        {
            href: "#education",
            label: t.menu.education,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap mr-3" aria-hidden="true"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.084a1 1 0 0 0 0 1.838l8.57 3.838a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
        },
        {
            href: "#works",
            label: t.menu.works,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette mr-3" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M17.5 6.5 17 7l-1.75 1.75A.5.5 0 0 1 13.75 9l-1.5-1.5a.5.5 0 0 1-.13-.45c-.3-.83-.98-1.5-1.82-1.82a.5.5 0 0 1-.45-.13L7 7.5l.5-.5"/><path d="M4.6 9.4a5.5 5.5 0 0 0 0 7.2L9.4 19"/><path d="M14.6 19.4a5.5 5.5 0 0 0 7.2 0L19.4 14.6"/><path d="M19.4 9.4a5.5 5.5 0 0 0-7.2 0L14.6 4.6"/></svg>
        },
        {
            href: "#contact",
            label: t.menu.contact,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail mr-3" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        }
    ];

    return (
        <div 
            id="off-canvas-menu" 
            className={`off-canvas-menu fixed top-0 left-0 h-full w-72 text-white shadow-2xl p-6 pt-28 z-50 flex flex-col ${isOpen ? 'open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            aria-hidden={!isOpen}
        >
            {/* Logo at the top */}
            <div className="absolute top-6 left-6 flex items-center">
                <svg width="40" height="40" viewBox="0 0 100 100" className="mr-3 flex-shrink-0" aria-hidden="true">
                    <rect width="100" height="100" rx="20" fill="#4f46e5"/>
                    <text x="50" y="65" fontFamily="Inter, sans-serif" fontSize="50" fill="white" textAnchor="middle" fontWeight="bold">J</text>
                </svg>
                <span className="text-xl font-bold text-white whitespace-nowrap">{t.menu.title}</span>
            </div>

            <button 
                id="close-menu" 
                onClick={onClose} 
                className="absolute top-4 right-4 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label={t.header.menuClose}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            <nav className="flex flex-col space-y-3">
                {menuItems.map((item) => (
                    <a 
                        key={item.href}
                        href={item.href} 
                        onClick={handleLinkClick} 
                        className="group relative flex items-center px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300 ease-out hover:bg-white/10 hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 overflow-hidden"
                        tabIndex={isOpen ? 0 : -1}
                    >
                         {/* Subtle Left Border Accent */}
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-xl"></span>

                         {/* Icon with subtle scale/rotate animation */}
                         <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 origin-center">
                             {item.icon}
                         </span>
                        
                         {/* Label with underline animation */}
                         <span className="relative">
                            {item.label}
                            <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-indigo-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                         </span>
                    </a>
                ))}
            </nav>
            <div className="mt-auto border-t border-indigo-400/30 pt-6">
                 {/* Mobile Language Toggle */}
                 <div className="flex gap-2 mb-4 justify-center">
                    <button 
                        onClick={() => setLanguage('fi')}
                        className={`px-3 py-1 rounded border ${language === 'fi' ? 'bg-white text-indigo-900 border-white' : 'text-white border-white/30'}`}
                    >
                        Suomi
                    </button>
                    <button 
                        onClick={() => setLanguage('en')}
                        className={`px-3 py-1 rounded border ${language === 'en' ? 'bg-white text-indigo-900 border-white' : 'text-white border-white/30'}`}
                    >
                        English
                    </button>
                 </div>
                <p className="font-bold text-lg">Jaakko</p>
                <p className="text-sm text-indigo-200 mt-1">jaakko.kkallio@gmail.com</p>
            </div>
        </div>
    );
};

export default OffCanvasMenu;
