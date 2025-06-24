import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

export type Language = 'en' | 'it' | 'es' | 'fr' | 'de' | 'zh';

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' }
] as const;

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onLanguageChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === language);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleLanguageSelect = (langCode: Language) => {
    onLanguageChange(langCode);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800 border border-white/20 hover:bg-gray-700 hover:border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
        style={{ position: 'relative', zIndex: 50 }}
      >
        <Globe className="w-4 h-4 text-white" />
        <span className="text-sm font-medium text-white hidden md:block">
          {currentLanguage?.nativeName}
        </span>
        <span className="text-sm font-medium text-white md:hidden">
          {currentLanguage?.flag}
        </span>
        <ChevronDown 
          className={`w-3 h-3 text-white transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 w-48 rounded-xl shadow-2xl overflow-hidden"
          style={{ 
            position: 'absolute',
            zIndex: 9999,
            backgroundColor: '#1f2937',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="py-2">
            {languages.map((lang) => {
              const isSelected = language === lang.code;
              
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code as Language)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-200"
                  style={{
                    backgroundColor: isSelected ? 'rgba(217, 70, 239, 0.2)' : 'transparent',
                    color: isSelected ? '#f0abfc' : '#d1d5db',
                    borderRight: isSelected ? '2px solid #d946ef' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#d1d5db';
                    }
                  }}
                >
                  <span className="text-lg flex-shrink-0">{lang.flag}</span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">{lang.nativeName}</span>
                    <span className="text-xs opacity-70 truncate">{lang.name}</span>
                  </div>
                  {isSelected && (
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: '#c084fc' }}
                    ></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};