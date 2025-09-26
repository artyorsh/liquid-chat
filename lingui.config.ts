import { defineConfig } from '@lingui/cli';

/**
 * @see https://lingui.dev/ref/conf
 */
export default defineConfig({
  locales: ['en'],
  catalogs: [
    {
      path: 'src/i18n/locales/{locale}',
      include: ['src'],
    },
  ],
});
