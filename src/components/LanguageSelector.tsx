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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === language);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHoveredIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setHoveredIndex(null);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  const handleLanguageSelect = (langCode: Language) => {
    onLanguageChange(langCode);
    setIsOpen(false);
    setHoveredIndex(null);
  };

  return (
    <>
      {/* Container with maximum z-index */}
      <div 
        className="relative"
        ref={dropdownRef}
        style={{ zIndex: 999999 }}
      >
        {/* Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50
            ${isOpen 
              ? 'bg-gray-800 border-fuchsia-500/50 shadow-lg' 
              : 'bg-gray-800 border-white/20 hover:bg-gray-700 hover:border-white/30'
            }
          `}
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

        {/* Dropdown Menu with Portal-like positioning */}
        {isOpen && (
          <>
            {/* Backdrop to ensure clicks outside close the dropdown */}
            <div 
              className="fixed inset-0"
              style={{ zIndex: 999998 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Menu */}
            <div 
              className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-white/20 rounded-xl shadow-2xl overflow-hidden"
              style={{ 
                zIndex: 999999,
                animation: 'fadeInSlideDown 0.2s ease-out forwards'
              }}
            >
              <div className="py-2">
                {languages.map((lang, index) => {
                  const isSelected = language === lang.code;
                  const isHovered = hoveredIndex === index;
                  
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code as Language)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-150 relative
                        ${isSelected 
                          ? 'bg-fuchsia-500/20 text-fuchsia-300 border-r-2 border-fuchsia-500' 
                          : isHovered
                            ? 'bg-white/15 text-white'
                            : 'text-gray-300 hover:text-white'
                        }
                      `}
                      style={{
                        transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
                      }}
                    >
                      <span className="text-lg flex-shrink-0">{lang.flag}</span>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-medium truncate">{lang.nativeName}</span>
                        <span className="text-xs opacity-70 truncate">{lang.name}</span>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 bg-fuchsia-400 rounded-full flex-shrink-0"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes fadeInSlideDown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
};