/**
 * Options Script
 * Логика страницы настроек расширения
 */

import browser from 'webextension-polyfill';
import type { Settings } from '~/types';

// Получаем элементы DOM
const enabledToggle = document.getElementById('enabledToggle') as HTMLInputElement;
const themeLight = document.getElementById('themeLight') as HTMLInputElement;
const themeDark = document.getElementById('themeDark') as HTMLInputElement;
const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;
const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
const statusMessage = document.getElementById('statusMessage') as HTMLElement;

// Храним текущие настройки
let currentSettings: Settings = {
  enabled: true,
  theme: 'light',
};

// Показываем статусное сообщение
function showStatusMessage(message: string, type: 'success' | 'error'): void {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;

  // Автоматически скрываем через 3 секунды
  setTimeout(() => {
    statusMessage.className = 'status-message';
    statusMessage.textContent = '';
  }, 3000);
}

// Загружаем настройки
async function loadSettings(): Promise<Settings> {
  try {
    const response = await browser.runtime.sendMessage({ type: 'GET_SETTINGS' });
    return (response as Settings) || { enabled: true, theme: 'light' };
  } catch (error) {
    console.error('[Options] Ошибка загрузки настроек:', error);
    return { enabled: true, theme: 'light' };
  }
}

// Обновляем UI на основе настроек
function updateUI(settings: Settings): void {
  currentSettings = settings;

  // Обновляем переключатель включения
  enabledToggle.checked = settings.enabled;

  // Обновляем тему
  if (settings.theme === 'light') {
    themeLight.checked = true;
  } else {
    themeDark.checked = true;
  }
}

// Получаем настройки из UI
function getSettingsFromUI(): Settings {
  return {
    enabled: enabledToggle.checked,
    theme: themeLight.checked ? 'light' : 'dark',
  };
}

// Сохраняем настройки
async function saveSettings(): Promise<void> {
  try {
    const settings = getSettingsFromUI();

    await browser.runtime.sendMessage({
      type: 'UPDATE_SETTINGS',
      settings,
    });

    currentSettings = settings;
    showStatusMessage('Настройки успешно сохранены!', 'success');
    console.log('[Options] Настройки сохранены:', settings);
  } catch (error) {
    console.error('[Options] Ошибка сохранения настроек:', error);
    showStatusMessage('Ошибка при сохранении настроек', 'error');
  }
}

// Сбрасываем настройки к значениям по умолчанию
async function resetSettings(): Promise<void> {
  const defaultSettings: Settings = {
    enabled: true,
    theme: 'light',
  };

  try {
    await browser.runtime.sendMessage({
      type: 'UPDATE_SETTINGS',
      settings: defaultSettings,
    });

    updateUI(defaultSettings);
    showStatusMessage('Настройки сброшены к значениям по умолчанию', 'success');
    console.log('[Options] Настройки сброшены');
  } catch (error) {
    console.error('[Options] Ошибка сброса настроек:', error);
    showStatusMessage('Ошибка при сбросе настроек', 'error');
  }
}

// Инициализация
async function init(): Promise<void> {
  try {
    const settings = await loadSettings();
    updateUI(settings);

    // Добавляем обработчики событий
    saveBtn.addEventListener('click', saveSettings);
    resetBtn.addEventListener('click', resetSettings);

    // Сохраняем при нажатии Enter
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        saveSettings();
      }
    });

    console.log('[Options] Инициализация завершена');
  } catch (error) {
    console.error('[Options] Ошибка инициализации:', error);
  }
}

// Запускаем инициализацию при загрузке
document.addEventListener('DOMContentLoaded', init);
