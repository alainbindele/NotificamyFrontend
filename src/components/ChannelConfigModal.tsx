import React, { useState, useEffect } from 'react';
import { X, Mail, MessageSquare, Slack, Hash, Phone, Link, User, Key } from 'lucide-react';
import { NotificationChannel, ChannelConfig } from '../App';

type Language = 'en' | 'it' | 'es' | 'fr' | 'de' | 'zh';

interface ChannelConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (configs: ChannelConfig) => void;
  selectedChannels: NotificationChannel[];
  existingConfigs: ChannelConfig;
  language: Language;
}

const configTranslations = {
  en: {
    title: 'Configure Notification Channels',
    subtitle: 'Enter the required information for each selected channel',
    save: 'Save & Continue',
    cancel: 'Cancel',
    required: 'Required',
    optional: 'Optional',
    fields: {
      email: {
        title: 'Email Configuration',
        email: 'Email Address',
        emailPlaceholder: 'your-email@example.com'
      },
      whatsapp: {
        title: 'WhatsApp Configuration',
        phone: 'Phone Number',
        phonePlaceholder: '+1234567890 (with country code)'
      },
      slack: {
        title: 'Slack Configuration',
        webhook: 'Webhook URL',
        webhookPlaceholder: 'https://hooks.slack.com/services/...',
        channel: 'Channel Name',
        channelPlaceholder: '#general or @username'
      },
      discord: {
        title: 'Discord Configuration',
        webhook: 'Webhook URL',
        webhookPlaceholder: 'https://discord.com/api/webhooks/...',
        username: 'Bot Username',
        usernamePlaceholder: 'NotifyMe Bot'
      }
    },
    validation: {
      emailInvalid: 'Please enter a valid email address',
      phoneInvalid: 'Please enter a valid phone number with country code',
      webhookInvalid: 'Please enter a valid webhook URL',
      required: 'This field is required'
    }
  },
  it: {
    title: 'Configura Canali di Notifica',
    subtitle: 'Inserisci le informazioni richieste per ogni canale selezionato',
    save: 'Salva e Continua',
    cancel: 'Annulla',
    required: 'Obbligatorio',
    optional: 'Opzionale',
    fields: {
      email: {
        title: 'Configurazione Email',
        email: 'Indirizzo Email',
        emailPlaceholder: 'tua-email@esempio.com'
      },
      whatsapp: {
        title: 'Configurazione WhatsApp',
        phone: 'Numero di Telefono',
        phonePlaceholder: '+391234567890 (con prefisso internazionale)'
      },
      slack: {
        title: 'Configurazione Slack',
        webhook: 'URL Webhook',
        webhookPlaceholder: 'https://hooks.slack.com/services/...',
        channel: 'Nome Canale',
        channelPlaceholder: '#generale o @nomeutente'
      },
      discord: {
        title: 'Configurazione Discord',
        webhook: 'URL Webhook',
        webhookPlaceholder: 'https://discord.com/api/webhooks/...',
        username: 'Nome Bot',
        usernamePlaceholder: 'NotifyMe Bot'
      }
    },
    validation: {
      emailInvalid: 'Inserisci un indirizzo email valido',
      phoneInvalid: 'Inserisci un numero di telefono valido con prefisso internazionale',
      webhookInvalid: 'Inserisci un URL webhook valido',
      required: 'Questo campo è obbligatorio'
    }
  },
  es: {
    title: 'Configurar Canales de Notificación',
    subtitle: 'Ingresa la información requerida para cada canal seleccionado',
    save: 'Guardar y Continuar',
    cancel: 'Cancelar',
    required: 'Requerido',
    optional: 'Opcional',
    fields: {
      email: {
        title: 'Configuración de Email',
        email: 'Dirección de Email',
        emailPlaceholder: 'tu-email@ejemplo.com'
      },
      whatsapp: {
        title: 'Configuración de WhatsApp',
        phone: 'Número de Teléfono',
        phonePlaceholder: '+1234567890 (con código de país)'
      },
      slack: {
        title: 'Configuración de Slack',
        webhook: 'URL de Webhook',
        webhookPlaceholder: 'https://hooks.slack.com/services/...',
        channel: 'Nombre del Canal',
        channelPlaceholder: '#general o @usuario'
      },
      discord: {
        title: 'Configuración de Discord',
        webhook: 'URL de Webhook',
        webhookPlaceholder: 'https://discord.com/api/webhooks/...',
        username: 'Nombre del Bot',
        usernamePlaceholder: 'NotifyMe Bot'
      }
    },
    validation: {
      emailInvalid: 'Ingresa una dirección de email válida',
      phoneInvalid: 'Ingresa un número de teléfono válido con código de país',
      webhookInvalid: 'Ingresa una URL de webhook válida',
      required: 'Este campo es requerido'
    }
  },
  fr: {
    title: 'Configurer les Canaux de Notification',
    subtitle: 'Entrez les informations requises pour chaque canal sélectionné',
    save: 'Sauvegarder et Continuer',
    cancel: 'Annuler',
    required: 'Requis',
    optional: 'Optionnel',
    fields: {
      email: {
        title: 'Configuration Email',
        email: 'Adresse Email',
        emailPlaceholder: 'votre-email@exemple.com'
      },
      whatsapp: {
        title: 'Configuration WhatsApp',
        phone: 'Numéro de Téléphone',
        phonePlaceholder: '+33123456789 (avec indicatif pays)'
      },
      slack: {
        title: 'Configuration Slack',
        webhook: 'URL Webhook',
        webhookPlaceholder: 'https://hooks.slack.com/services/...',
        channel: 'Nom du Canal',
        channelPlaceholder: '#general ou @utilisateur'
      },
      discord: {
        title: 'Configuration Discord',
        webhook: 'URL Webhook',
        webhookPlaceholder: 'https://discord.com/api/webhooks/...',
        username: 'Nom du Bot',
        usernamePlaceholder: 'NotifyMe Bot'
      }
    },
    validation: {
      emailInvalid: 'Veuillez entrer une adresse email valide',
      phoneInvalid: 'Veuillez entrer un numéro de téléphone valide avec indicatif pays',
      webhookInvalid: 'Veuillez entrer une URL webhook valide',
      required: 'Ce champ est requis'
    }
  },
  de: {
    title: 'Benachrichtigungskanäle Konfigurieren',
    subtitle: 'Geben Sie die erforderlichen Informationen für jeden ausgewählten Kanal ein',
    save: 'Speichern und Fortfahren',
    cancel: 'Abbrechen',
    required: 'Erforderlich',
    optional: 'Optional',
    fields: {
      email: {
        title: 'E-Mail-Konfiguration',
        email: 'E-Mail-Adresse',
        emailPlaceholder: 'ihre-email@beispiel.com'
      },
      whatsapp: {
        title: 'WhatsApp-Konfiguration',
        phone: 'Telefonnummer',
        phonePlaceholder: '+491234567890 (mit Ländercode)'
      },
      slack: {
        title: 'Slack-Konfiguration',
        webhook: 'Webhook-URL',
        webhookPlaceholder: 'https://hooks.slack.com/services/...',
        channel: 'Kanalname',
        channelPlaceholder: '#allgemein oder @benutzername'
      },
      discord: {
        title: 'Discord-Konfiguration',
        webhook: 'Webhook-URL',
        webhookPlaceholder: 'https://discord.com/api/webhooks/...',
        username: 'Bot-Benutzername',
        usernamePlaceholder: 'NotifyMe Bot'
      }
    },
    validation: {
      emailInvalid: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      phoneInvalid: 'Bitte geben Sie eine gültige Telefonnummer mit Ländercode ein',
      webhookInvalid: 'Bitte geben Sie eine gültige Webhook-URL ein',
      required: 'Dieses Feld ist erforderlich'
    }
  },
  zh: {
    title: '配置通知渠道',
    subtitle: '为每个选定的渠道输入所需信息',
    save: '保存并继续',
    cancel: '取消',
    required: '必填',
    optional: '可选',
    fields: {
      email: {
        title: '电子邮件配置',
        email: '电子邮件地址',
        emailPlaceholder: 'your-email@example.com'
      },
      whatsapp: {
        title: 'WhatsApp 配置',
        phone: '电话号码',
        phonePlaceholder: '+8612345678901 (包含国家代码)'
      },
      slack: {
        title: 'Slack 配置',
        webhook: 'Webhook URL',
        webhookPlaceholder: 'https://hooks.slack.com/services/...',
        channel: '频道名称',
        channelPlaceholder: '#general 或 @用户名'
      },
      discord: {
        title: 'Discord 配置',
        webhook: 'Webhook URL',
        webhookPlaceholder: 'https://discord.com/api/webhooks/...',
        username: '机器人用户名',
        usernamePlaceholder: 'NotifyMe Bot'
      }
    },
    validation: {
      emailInvalid: '请输入有效的电子邮件地址',
      phoneInvalid: '请输入包含国家代码的有效电话号码',
      webhookInvalid: '请输入有效的 webhook URL',
      required: '此字段为必填项'
    }
  }
};

export const ChannelConfigModal: React.FC<ChannelConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedChannels,
  existingConfigs,
  language
}) => {
  const [configs, setConfigs] = useState<ChannelConfig>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const t = configTranslations[language];

  // Initialize configs properly when modal opens
  useEffect(() => {
    if (isOpen) {
      // Initialize with clean string values, not objects
      const initialConfigs: ChannelConfig = {};
      
      selectedChannels.forEach(channel => {
        if (channel === 'email' && existingConfigs.email) {
          initialConfigs.email = typeof existingConfigs.email === 'string' 
            ? existingConfigs.email 
            : '';
        } else if (channel === 'whatsapp' && existingConfigs.whatsapp) {
          initialConfigs.whatsapp = typeof existingConfigs.whatsapp === 'string' 
            ? existingConfigs.whatsapp 
            : '';
        } else if (channel === 'slack' && existingConfigs.slack) {
          initialConfigs.slack = typeof existingConfigs.slack === 'string' 
            ? existingConfigs.slack 
            : '';
        } else if (channel === 'discord' && existingConfigs.discord) {
          initialConfigs.discord = typeof existingConfigs.discord === 'string' 
            ? existingConfigs.discord 
            : '';
        }
      });
      
      setConfigs(initialConfigs);
      setErrors({});
    }
  }, [isOpen, selectedChannels, existingConfigs]);

  if (!isOpen) return null;

  const channelIcons = {
    email: Mail,
    whatsapp: MessageSquare,
    slack: Slack,
    discord: Hash
  };

  const channelColors = {
    email: 'red',
    whatsapp: 'green',
    slack: 'purple',
    discord: 'indigo'
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const validateWebhook = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleInputChange = (channel: NotificationChannel, value: string) => {
    setConfigs(prev => ({
      ...prev,
      [channel]: value
    }));

    // Clear error when user starts typing
    const errorKey = channel;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    selectedChannels.forEach(channel => {
      if (channel === 'email') {
        const email = configs.email || '';
        if (!email) {
          newErrors['email'] = t.validation.required;
        } else if (!validateEmail(email)) {
          newErrors['email'] = t.validation.emailInvalid;
        }
      } else if (channel === 'whatsapp') {
        const phone = configs.whatsapp || '';
        if (!phone) {
          newErrors['whatsapp'] = t.validation.required;
        } else if (!validatePhone(phone)) {
          newErrors['whatsapp'] = t.validation.phoneInvalid;
        }
      } else if (channel === 'slack') {
        const webhook = configs.slack || '';
        if (!webhook) {
          newErrors['slack'] = t.validation.required;
        } else if (!validateWebhook(webhook)) {
          newErrors['slack'] = t.validation.webhookInvalid;
        }
      } else if (channel === 'discord') {
        const webhook = configs.discord || '';
        if (!webhook) {
          newErrors['discord'] = t.validation.required;
        } else if (!validateWebhook(webhook)) {
          newErrors['discord'] = t.validation.webhookInvalid;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Ensure we're passing clean string values
      const cleanConfigs: ChannelConfig = {};
      Object.keys(configs).forEach(key => {
        const value = configs[key as NotificationChannel];
        if (value && typeof value === 'string') {
          cleanConfigs[key as NotificationChannel] = value;
        }
      });
      onSave(cleanConfigs);
    }
  };

  const renderEmailConfig = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
          <Mail className="w-5 h-5 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-red-400">{t.fields.email.title}</h3>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t.fields.email.email} <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          value={configs.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder={t.fields.email.emailPlaceholder}
          className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
            errors['email'] 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-red-500/30 focus:border-red-500 focus:ring-red-500/20'
          }`}
        />
        {errors['email'] && (
          <p className="text-red-400 text-sm mt-1">{errors['email']}</p>
        )}
      </div>
    </div>
  );

  const renderWhatsAppConfig = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-green-400">{t.fields.whatsapp.title}</h3>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t.fields.whatsapp.phone} <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            value={configs.whatsapp || ''}
            onChange={(e) => handleInputChange('whatsapp', e.target.value)}
            placeholder={t.fields.whatsapp.phonePlaceholder}
            className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors['whatsapp'] 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-green-500/30 focus:border-green-500 focus:ring-green-500/20'
            }`}
          />
        </div>
        {errors['whatsapp'] && (
          <p className="text-red-400 text-sm mt-1">{errors['whatsapp']}</p>
        )}
      </div>
    </div>
  );

  const renderSlackConfig = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <Slack className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-purple-400">{t.fields.slack.title}</h3>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t.fields.slack.webhook} <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="url"
            value={configs.slack || ''}
            onChange={(e) => handleInputChange('slack', e.target.value)}
            placeholder={t.fields.slack.webhookPlaceholder}
            className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors['slack'] 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-purple-500/30 focus:border-purple-500 focus:ring-purple-500/20'
            }`}
          />
        </div>
        {errors['slack'] && (
          <p className="text-red-400 text-sm mt-1">{errors['slack']}</p>
        )}
      </div>
    </div>
  );

  const renderDiscordConfig = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
          <Hash className="w-5 h-5 text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-indigo-400">{t.fields.discord.title}</h3>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t.fields.discord.webhook} <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="url"
            value={configs.discord || ''}
            onChange={(e) => handleInputChange('discord', e.target.value)}
            placeholder={t.fields.discord.webhookPlaceholder}
            className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors['discord'] 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-indigo-500/30 focus:border-indigo-500 focus:ring-indigo-500/20'
            }`}
          />
        </div>
        {errors['discord'] && (
          <p className="text-red-400 text-sm mt-1">{errors['discord']}</p>
        )}
      </div>
    </div>
  );

  const renderChannelConfig = (channel: NotificationChannel) => {
    switch (channel) {
      case 'email':
        return renderEmailConfig();
      case 'whatsapp':
        return renderWhatsAppConfig();
      case 'slack':
        return renderSlackConfig();
      case 'discord':
        return renderDiscordConfig();
      default:
        return null;
    }
  };

  // Filter out email if it's already configured
  const channelsNeedingConfig = selectedChannels.filter(channel => 
    channel !== 'email' || !existingConfigs.email
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            {t.title}
          </h2>
          <p className="text-gray-400 text-sm">{t.subtitle}</p>
        </div>

        {/* Channel Configurations */}
        <div className="space-y-8">
          {channelsNeedingConfig.map((channel) => (
            <div key={channel} className="p-6 rounded-xl bg-white/5 border border-white/10">
              {renderChannelConfig(channel)}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl font-semibold text-white hover:from-fuchsia-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};