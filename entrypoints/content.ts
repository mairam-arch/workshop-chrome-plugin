/**
 * Content Script
 * Выполняется в контексте веб-страницы
 */

import browser from 'webextension-polyfill';
import type { ExtensionMessage, Settings } from '~/types';

// Храним текущие настройки
let currentSettings: Settings = {
  enabled: true,
  theme: 'light',
};

// Создаем индикатор на странице
function createIndicator(): void {
  // Проверяем, не создан ли уже индикатор
  if (document.getElementById('workshop-indicator')) {
    return;
  }

  const indicator = document.createElement('div');
  indicator.id = 'workshop-indicator';
  indicator.innerHTML = `
    <div class="workshop-indicator-content">
      <span class="workshop-indicator-icon">🔧</span>
      <span class="workshop-indicator-text">Workshop Plugin</span>
    </div>
  `;

  // Добавляем стили
  const style = document.createElement('style');
  style.textContent = `
    #workshop-indicator {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      background: ${currentSettings.theme === 'dark' ? '#2d2d2d' : '#ffffff'};
      border: 2px solid #4a90e2;
      border-radius: 8px;
      padding: 10px 15px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    #workshop-indicator:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .workshop-indicator-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .workshop-indicator-icon {
      font-size: 18px;
    }

    .workshop-indicator-text {
      font-size: 14px;
      font-weight: 500;
      color: ${currentSettings.theme === 'dark' ? '#ffffff' : '#333333'};
    }

    #workshop-indicator.disabled {
      opacity: 0.5;
      filter: grayscale(100%);
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(indicator);

  // Добавляем обработчик клика
  indicator.addEventListener('click', () => {
    console.log('[Content] Индикатор нажат');
    // Здесь можно добавить логику при клике на индикатор
  });
}

// Удаляем индикатор со страницы
function removeIndicator(): void {
  const indicator = document.getElementById('workshop-indicator');
  if (indicator) {
    indicator.remove();
  }
}

// Обновляем индикатор на основе настроек
function updateIndicator(): void {
  removeIndicator();
  if (currentSettings.enabled) {
    createIndicator();
  }
}

// Получаем настройки из хранилища
async function loadSettings(): Promise<void> {
  try {
    const response = await browser.runtime.sendMessage({ type: 'GET_SETTINGS' });
    if (response) {
      currentSettings = response as Settings;
      updateIndicator();
    }
  } catch (error) {
    console.error('[Content] Ошибка загрузки настроек:', error);
  }
}

// Слушаем сообщения от background script
browser.runtime.onMessage.addListener((message: unknown) => {
  console.log('[Content] Получено сообщение:', message);

  const msg = message as ExtensionMessage;
  if (msg.type === 'SETTINGS_CHANGED') {
    currentSettings = msg.settings;
    updateIndicator();
  }

  return true;
});

// Инициализация
function init(): void {
  console.log('[Content] Content Script загружен');

  // Ждем загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadSettings();
    });
  } else {
    loadSettings();
  }
}

// Запускаем инициализацию
init();
