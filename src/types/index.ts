/**
 * Общие типы для расширения
 */

/**
 * Настройки расширения
 */
export interface Settings {
  /** Включено ли расширение */
  enabled: boolean;
  /** Тема оформления */
  theme: 'light' | 'dark';
}

/**
 * Типы сообщений между компонентами расширения
 */
export type MessageType =
  | 'GET_SETTINGS'
  | 'UPDATE_SETTINGS'
  | 'SETTINGS_CHANGED'
  | 'TOGGLE_EXTENSION'
  | 'GET_STATUS';

/**
 * Базовое сообщение
 */
export interface Message {
  /** Тип сообщения */
  type: MessageType;
  /** Дополнительные данные */
  data?: unknown;
}

/**
 * Сообщение для получения настроек
 */
export interface GetSettingsMessage extends Message {
  type: 'GET_SETTINGS';
}

/**
 * Сообщение для обновления настроек
 */
export interface UpdateSettingsMessage extends Message {
  type: 'UPDATE_SETTINGS';
  settings: Settings;
}

/**
 * Сообщение об изменении настроек
 */
export interface SettingsChangedMessage extends Message {
  type: 'SETTINGS_CHANGED';
  settings: Settings;
}

/**
 * Объединение всех типов сообщений
 */
export type ExtensionMessage =
  | GetSettingsMessage
  | UpdateSettingsMessage
  | SettingsChangedMessage;
