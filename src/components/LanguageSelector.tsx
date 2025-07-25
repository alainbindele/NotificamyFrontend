import React from 'react';
import { Globe } from 'lucide-react';

export type Language = 'en' | 'it' | 'es' | 'fr' | 'de' | 'zh';

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  zh: { name: '中文', flag: '🇨🇳' }
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onLanguageChange
}) => {
  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="appearance-none bg-gray-800 border border-white/20 rounded-lg px-3 py-2 pr-8 text-white text-sm focus:outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all duration-300"
      >
        {Object.entries(languages).map(([code, lang]) => (
          <option 
            key={code} 
            value={code}
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <Globe className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
};