import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'Calorie Counter',
    description: 'Приложение для подсчета калорий',
    version: '1.0.0',
    permissions: ['storage'],
    host_permissions: ['https://world.openfoodfacts.org/*'],
  },
  runner: {
    disabled: false,
  },
});
