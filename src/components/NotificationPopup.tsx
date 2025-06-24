import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

type Language = 'en' | 'it' | 'es' | 'fr' | 'de' | 'zh';

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  message: string;
  language: Language;
}

const popupTranslations = {
  en: {
    success: 'Success!',
    error: 'Validation Failed',
    successMessage: 'You will receive notifications as requested!',
    close: 'Close'
  },
  it: {
    success: 'Successo!',
    error: 'Validazione Fallita',
    successMessage: 'Riceverai le notifiche come richiesto!',
    close: 'Chiudi'
  },
  es: {
    success: '¡Éxito!',
    error: 'Validación Fallida',
    successMessage: '¡Recibirás notificaciones como solicitaste!',
    close: 'Cerrar'
  },
  fr: {
    success: 'Succès!',
    error: 'Validation Échouée',
    successMessage: 'Vous recevrez des notifications comme demandé!',
    close: 'Fermer'
  },
  de: {
    success: 'Erfolg!',
    error: 'Validierung Fehlgeschlagen',
    successMessage: 'Sie erhalten Benachrichtigungen wie angefordert!',
    close: 'Schließen'
  },
  zh: {
    success: '成功！',
    error: '验证失败',
    successMessage: '您将按要求收到通知！',
    close: '关闭'
  }
};

export const NotificationPopup: React.FC<NotificationPopupProps> = ({
  isOpen,
  onClose,
  isSuccess,
  message,
  language
}) => {
  const t = popupTranslations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="relative bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isSuccess 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {isSuccess ? (
              <CheckCircle className="w-8 h-8" />
            ) : (
              <XCircle className="w-8 h-8" />
            )}
          </div>

          {/* Title */}
          <h3 className={`text-xl font-bold mb-4 ${
            isSuccess ? 'text-green-400' : 'text-red-400'
          }`}>
            {isSuccess ? t.success : t.error}
          </h3>

          {/* Message */}
          <p className="text-gray-300 mb-6 leading-relaxed">
            {isSuccess ? t.successMessage : message}
          </p>

          {/* Close button */}
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isSuccess
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};