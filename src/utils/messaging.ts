/**
 * Утилиты для работы с сообщениями между компонентами расширения
 */

import browser from 'webextension-polyfill';
import type { ExtensionMessage, Settings } from '../types';

/**
 * Отправляет сообщение в background script
 */
export async function sendMessage<T = unknown>(
  message: ExtensionMessage
): Promise<T> {
  try {
    const response = await browser.runtime.sendMessage(message);
    return response as T;
  } catch (error) {
    console.error('[Messaging] Ошибка отправки сообщения:', error);
    throw error;
  }
}

/**
 * Отправляет сообщение конкретной вкладке
 */
export async function sendMessageToTab<T = unknown>(
  tabId: number,
  message: ExtensionMessage
): Promise<T> {
  try {
    const response = await browser.tabs.sendMessage(tabId, message);
    return response as T;
  } catch (error) {
    console.error('[Messaging] Ошибка отправки сообщения вкладке:', error);
    throw error;
  }
}

/**
 * Подписывается на сообщения от других компонентов
 */
export function onMessage<T = unknown>(
  callback: (message: ExtensionMessage, sender: browser.Runtime.MessageSender) => T | Promise<T>
): () => void {
  const listener = (
    message: unknown,
    sender: browser.Runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => {
    const result = callback(message as ExtensionMessage, sender);

    // Если результат - Promise, ждём его завершения
    if (result instanceof Promise) {
      result.then((value) => sendResponse(value)).catch((error) => {
        console.error('[Messaging] Ошибка обработки сообщения:', error);
        sendResponse({ error: error.message });
      });
      return true; // Указываем, что ответ будет асинхронным
    }

    sendResponse(result);
    return true;
  };

  // @ts-ignore - webextension-polyfill типы несовместимы с TypeScript
  browser.runtime.onMessage.addListener(listener);

  // Возвращает функцию для отписки
  return () => {
    // @ts-ignore - webextension-polyfill типы несовместимы с TypeScript
    browser.runtime.onMessage.removeListener(listener);
  };
}

/**
 * Создаёт обработчик сообщений для background script
 */
export function createMessageHandler(
  handlers: Partial<{
    [K in ExtensionMessage['type']]: (
      message: Extract<ExtensionMessage, { type: K }>,
      sender: browser.Runtime.MessageSender
    ) => unknown | Promise<unknown>;
  }>
): void {
  // @ts-ignore - webextension-polyfill типы несовместимы с TypeScript
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const handler = handlers[(message as ExtensionMessage).type as ExtensionMessage['type']];

    if (handler) {
      const result = handler(message as any, sender);

      if (result instanceof Promise) {
        result
          .then((value) => sendResponse(value))
          .catch((error) => {
            console.error('[Messaging] Ошибка в обработчике:', error);
            sendResponse({ error: error.message });
          });
        return true;
      }

      sendResponse(result);
      return true;
    }

    console.warn('[Messaging] Неизвестный тип сообщения:', (message as ExtensionMessage).type);
    return false;
  });
}
