/**
 * Popup Script
 * Логика всплывающего окна расширения
 */

import browser from 'webextension-polyfill';
import type { Settings } from '~/types';

// Получаем элементы DOM
const statusElement = document.getElementById('status') as HTMLElement;
const themeElement = document.getElementById('theme') as HTMLElement;
const toggleBtn = document.getElementById('toggleBtn') as HTMLButtonElement;
const optionsBtn = document.getElementById('optionsBtn') as HTMLButtonElement;

// Загружаем настройки
async function loadSettings(): Promise<Settings> {
  const response = await browser.runtime.sendMessage({ type: 'GET_SETTINGS' });
  return (response as Settings) || { enabled: true, theme: 'light' };
}

// Обновляем UI на основе настроек
function updateUI(settings: Settings): void {
  // Обновляем статус
  if (settings.enabled) {
    statusElement.textContent = 'Активен';
    statusElement.classList.remove('inactive');
    statusElement.classList.add('active');
  } else {
    statusElement.textContent = 'Неактивен';
    statusElement.classList.remove('active');
    statusElement.classList.add('inactive');
  }

  // Обновляем тему
  themeElement.textContent = settings.theme === 'light' ? 'Светлая' : 'Тёмная';
}

// Переключаем статус расширения
async function toggleStatus(): Promise<void> {
  const settings = await loadSettings();
  settings.enabled = !settings.enabled;

  await browser.runtime.sendMessage({
    type: 'UPDATE_SETTINGS',
    settings,
  });

  updateUI(settings);
}

// Открываем страницу настроек
function openOptions(): void {
  browser.runtime.openOptionsPage();
}

// Инициализация
async function init(): Promise<void> {
  try {
    const settings = await loadSettings();
    updateUI(settings);

    // Добавляем обработчики событий
    toggleBtn.addEventListener('click', toggleStatus);
    optionsBtn.addEventListener('click', openOptions);

    console.log('[Popup] Инициализация завершена');
  } catch (error) {
    console.error('[Popup] Ошибка инициализации:', error);
  }
}

// Запускаем инициализацию при загрузке
document.addEventListener('DOMContentLoaded', init);
