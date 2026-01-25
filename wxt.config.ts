import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'Workshop Chrome Plugin',
    description: 'Базовый Chrome плагин на WXT с TypeScript',
    version: '1.0.0',
    permissions: ['storage', 'tabs'],
    host_permissions: ['<all_urls>'],
  },
});
