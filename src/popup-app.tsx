/**
 * Popup компонент для приложения подсчета калорий
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../src/components/App';
import '../src/styles/popup.css';

// Инициализация React приложения
function init() {
  const container = document.getElementById('app-container');
  if (!container) {
    console.error('Container element not found');
    return;
  }

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// Запускаем инициализацию при загрузке
document.addEventListener('DOMContentLoaded', init);
