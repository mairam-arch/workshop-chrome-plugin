/**
 * Background Service Worker
 * Выполняется в фоновом режиме и обрабатывает события расширения
 */

import browser from 'webextension-polyfill';
import type { ExtensionMessage } from '~/types';

console.log('[Background] Service Worker запущен');

// Слушаем установку расширения
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[Background] Расширение установлено');
    // Инициализация хранилища при установке
    browser.storage.local.set({
      settings: {
        enabled: true,
        theme: 'light',
      },
    });
  } else if (details.reason === 'update') {
    console.log('[Background] Расширение обновлено');
  }
});

// Слушаем сообщения от content scripts и popup
// @ts-ignore - webextension-polyfill типы несовместимы с TypeScript
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Background] Получено сообщение:', message);

  const msg = message as ExtensionMessage;

  if (msg.type === 'GET_SETTINGS') {
    browser.storage.local.get('settings').then((result) => {
      sendResponse(result.settings);
    });
    return true;
  }

  if (msg.type === 'UPDATE_SETTINGS') {
    browser.storage.local.set({ settings: msg.settings }).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }

  console.warn('[Background] Неизвестный тип сообщения:', msg.type);
  return false;
});

// Слушаем изменения в хранилище
browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.settings) {
    console.log('[Background] Настройки изменены:', changes.settings.newValue);
    // Отправляем уведомление всем вкладкам
    browser.tabs.query({}).then((tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          browser.tabs.sendMessage(tab.id, {
            type: 'SETTINGS_CHANGED',
            settings: changes.settings.newValue,
          }).catch(() => {
            // Игнорируем ошибки, если вкладка не может принять сообщения
          });
        }
      });
    });
  }
});
