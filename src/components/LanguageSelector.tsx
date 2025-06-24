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

  const getItemStyle = (index: number, isSelected: boolean) => {
    if (isSelected) {
      return {
        backgroundColor: 'rgba(217, 70, 239, 0.2)',
        borderRight: '2px solid rgb(217, 70, 239)',
        color: 'rgb(232, 121, 249)',
        transform: 'translateX(0px)'
      };
    }
    
    if (hoveredIndex === index) {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        color: 'rgb(255, 255, 255)',
        transform: 'translateX(3px)'
      };
    }
    
    return {
      backgroundColor: 'transparent',
      color: 'rgb(209, 213, 219)',
      transform: 'translateX(0px)'
    };
  };

  return (
    <div className="relative z-[9999]" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative z-[9999] flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 w-48 rounded-xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: 'rgb(31, 41, 55)', // gray-800 solid
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animation: 'fadeInSlideDown 0.2s ease-out forwards',
            zIndex: 99999, // Massimo z-index possibile
            position: 'absolute'
          }}
        >
          <div className="py-2">
            {languages.map((lang, index) => {
              const isSelected = language === lang.code;
              const itemStyle = getItemStyle(index, isSelected);
              
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code as Language)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-150 relative"
                  style={itemStyle}
                >
                  <span className="text-lg flex-shrink-0">{lang.flag}</span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">{lang.nativeName}</span>
                    <span className="text-xs opacity-70 truncate">{lang.name}</span>
                  </div>
                  {isSelected && (
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: 'rgb(232, 121, 249)' }}
                    ></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
    </div>
  );
};