import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'id', name: 'Indonesia', flag: 'https://flagcdn.com/id.svg' },
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/gb.svg' },
  { code: 'zh', name: '中文', flag: 'https://flagcdn.com/cn.svg' },
];

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <header className="bg-white/90 backdrop-blur border-b border-green-100 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-white">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-full h-full object-cover origin-center transition-transform duration-300 hover:scale-125 hover:rotate-[15deg]"
          />
        </div>
        <div>
          <h1 className="text-xl font-black text-green-800 leading-tight tracking-tight">{t('appName')}</h1>
          <div className="flex items-center gap-2">
            <p className="text-xs text-green-600 font-medium">{t('appDesc')}</p>
            <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm uppercase tracking-wide">
              by JOSI AI
            </span>
          </div>
        </div>
      </div>
      <nav className="hidden md:flex gap-6 items-center">
        <div className="relative" ref={langRef}>
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 bg-white border border-green-200 text-green-800 text-sm rounded-lg hover:border-green-300 focus:ring-2 focus:ring-green-500/20 px-3 py-2 cursor-pointer font-medium outline-none transition-all"
          >
            <img src={currentLang.flag} alt={currentLang.name} className="w-5 h-auto rounded-[2px] shadow-sm" />
            <span>{currentLang.name}</span>
            <ChevronDown className="w-4 h-4 text-green-500" />
          </button>

          {isLangOpen && (
            <div className="absolute top-full right-0 mt-2 w-36 bg-white border border-green-100 rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as any);
                    setIsLangOpen(false);
                  }}
                  className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-green-50 ${language === lang.code ? 'bg-green-50/50 text-green-700' : 'text-slate-600'}`}
                >
                  <img src={lang.flag} alt={lang.name} className="w-5 h-auto rounded-[2px] shadow-sm shrink-0" />
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-green-700 font-bold">
          J
        </div>
      </nav>
    </header>
  );
}
