# Calorie Counter - Chrome Extension

Инструкция по запуску и использованию расширения для подсчёта калорий.

## Требования

- Node.js (версия 18 или выше)
- npm или yarn
- Google Chrome

## Установка зависимостей

```bash
npm install
```

## Запуск в режиме разработки

```bash
npm run dev
```

Эта команда:
1. Запустит dev сервер на `http://localhost:3000`
2. Скомпилирует расширение в папку `.output/chrome-mv3-dev/`
3. Автоматически откроет Chrome с загруженным расширением

## Ручная установка расширения (если автоматический запуск не сработал)

### 1. Соберите расширение

```bash
npm run build
```

### 2. Откройте Chrome и перейдите в настройки расширений

- В адресной строке введите: `chrome://extensions/`
- Или через меню: ⋮ → Дополнительные инструменты → Расширения

### 3. Включите режим разработчика

В правом верхнем углу переключите переключатель **"Режим разработчика"**

### 4. Загрузите распакованное расширение

Нажмите кнопку **"Загрузить распакованное"** и выберите папку:
- Для разработки: `.output/chrome-mv3-dev/`
- Для production: `.output/chrome-mv3/`

## Использование расширения

1. Нажмите на иконку расширения в панели браузера
2. Введите название продукта в поле поиска
3. Нажмите кнопку "Добавить"
4. Продукт появится в списке с количеством калорий
5. Общее количество калорий отображается внизу

## Доступные команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск в режиме разработки с горячей перезагрузкой |
| `npm run build` | Сборка для production |
| `npm run zip` | Создание ZIP-архива для публикации |
| `npm run lint` | Проверка кода на ошибки |
| `npm run lint:fix` | Исправление ошибок линтера |
| `npm run format` | Форматирование кода |

## Структура проекта

```
workshop-chrome-plugin/
├── entrypoints/          # Точки входа расширения
│   └── popup.html        # Popup HTML файл
├── src/
│   ├── popup-app.tsx     # Popup React приложение
│   ├── components/       # React компоненты
│   │   ├── App.tsx      # Главный компонент
│   │   ├── ProductForm.tsx
│   │   ├── ProductList.tsx
│   │   └── TotalCalories.tsx
│   ├── hooks/           # React хуки
│   ├── services/        # API сервисы
│   ├── storage/         # Локальное хранилище
│   └── types/           # TypeScript типы
├── wxt.config.ts        # Конфигурация WXT
└── package.json
```

## Решение проблем

### Иконка расширения не кликабельна / ERR_FILE_NOT_FOUND

Если при нажатии на иконку расширения ничего не происходит или появляется ошибка `ERR_FILE_NOT_FOUND`:

**Причина:** В WXT для popup entrypoint требуется HTML файл в папке `entrypoints/`. React код должен быть в отдельном файле вне папки `entrypoints/`.

**Решение:**
1. Убедитесь, что `entrypoints/popup.html` существует
2. Убедитесь, что React код находится в `src/popup-app.tsx` (или другом файле вне `entrypoints/`)
3. В `popup.html` должна быть ссылка на React файл:
   ```html
   <script type="module" src="../src/popup-app.tsx"></script>
   ```

### Ошибка "Multiple entrypoints with the same name detected"

Эта ошибка возникает, когда в папке `entrypoints/` есть несколько файлов с одинаковым именем (например, `popup.html` и `popup.tsx`).

**Решение:** В папке `entrypoints/` должен быть только HTML файл для popup. React код должен быть вынесен в отдельный файл (например, `src/popup-app.tsx`).

### Предупреждение о deprecated runner

Если видите предупреждение `InlineConfig#runner is deprecated`, это можно игнорировать или обновить конфигурацию в `wxt.config.ts`:

```typescript
export default defineConfig({
  // ...
  webExt: {
    disabled: false,
  },
});
```

## Лицензия

ISC
