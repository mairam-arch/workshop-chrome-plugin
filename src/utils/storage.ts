/**
 * Утилиты для работы с хранилищем расширения
 */

import browser from 'webextension-polyfill';
import type { Settings } from '../types';

/**
 * Значения настроек по умолчанию
 */
export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  theme: 'light',
};

/**
 * Получает настройки из хранилища
 */
export async function getSettings(): Promise<Settings> {
  try {
    const result = await browser.storage.local.get('settings');
    return (result.settings as Settings) || DEFAULT_SETTINGS;
  } catch (error) {
    console.error('[Storage] Ошибка получения настроек:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Сохраняет настройки в хранилище
 */
export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await browser.storage.local.set({ settings });
  } catch (error) {
    console.error('[Storage] Ошибка сохранения настроек:', error);
    throw error;
  }
}

/**
 * Сбрасывает настройки к значениям по умолчанию
 */
export async function resetSettings(): Promise<void> {
  try {
    await browser.storage.local.set({ settings: DEFAULT_SETTINGS });
  } catch (error) {
    console.error('[Storage] Ошибка сброса настроек:', error);
    throw error;
  }
}

/**
 * Очищает всё хранилище
 */
export async function clearStorage(): Promise<void> {
  try {
    await browser.storage.local.clear();
  } catch (error) {
    console.error('[Storage] Ошибка очистки хранилища:', error);
    throw error;
  }
}

/**
 * Подписывается на изменения в хранилище
 */
export function onSettingsChanged(
  callback: (newSettings: Settings, oldSettings?: Settings) => void
): () => void {
  const listener = (
    changes: { [key: string]: browser.Storage.StorageChange },
    areaName: string
  ) => {
    if (areaName === 'local' && changes.settings) {
      callback(changes.settings.newValue as Settings, changes.settings.oldValue as Settings);
    }
  };

  browser.storage.onChanged.addListener(listener);

  // Возвращает функцию для отписки
  return () => {
    browser.storage.onChanged.removeListener(listener);
  };
}
