/**
 * Общие константы расширения
 */

/**
 * Имя расширения
 */
export const EXTENSION_NAME = 'Workshop Chrome Plugin';

/**
 * Версия расширения
 */
export const EXTENSION_VERSION = '1.0.0';

/**
 * Идентификатор хранилища настроек
 */
export const STORAGE_KEY_SETTINGS = 'settings';

/**
 * CSS классы для элементов расширения
 */
export const CSS_CLASSES = {
  INDICATOR: 'workshop-indicator',
  INDICATOR_CONTENT: 'workshop-indicator-content',
  INDICATOR_ICON: 'workshop-indicator-icon',
  INDICATOR_TEXT: 'workshop-indicator-text',
  INDICATOR_DISABLED: 'disabled',
} as const;

/**
 * Сообщения логирования
 */
export const LOG_MESSAGES = {
  BACKGROUND_INIT: '[Background] Service Worker запущен',
  BACKGROUND_INSTALL: '[Background] Расширение установлено',
  BACKGROUND_UPDATE: '[Background] Расширение обновлено',
  BACKGROUND_MESSAGE: '[Background] Получено сообщение',
  BACKGROUND_SETTINGS_CHANGED: '[Background] Настройки изменены',

  CONTENT_INIT: '[Content] Content Script загружен',
  CONTENT_MESSAGE: '[Content] Получено сообщение',
  CONTENT_INDICATOR_CLICK: '[Content] Индикатор нажат',

  POPUP_INIT: '[Popup] Инициализация завершена',
  POPUP_ERROR: '[Popup] Ошибка инициализации',

  OPTIONS_INIT: '[Options] Инициализация завершена',
  OPTIONS_ERROR: '[Options] Ошибка инициализации',
  OPTIONS_SAVED: '[Options] Настройки сохранены',
  OPTIONS_RESET: '[Options] Настройки сброшены',

  STORAGE_ERROR: '[Storage] Ошибка',
  MESSAGING_ERROR: '[Messaging] Ошибка',
} as const;

/**
 * Цвета для тем
 */
export const THEME_COLORS = {
  light: {
    background: '#ffffff',
    text: '#333333',
    border: '#4a90e2',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    background: '#2d2d2d',
    text: '#ffffff',
    border: '#4a90e2',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
} as const;
