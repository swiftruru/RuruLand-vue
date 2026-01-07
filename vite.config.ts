import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages base path
  // Use '/' for custom domain (ruruland.swift.moe)
  // Use '/RuruLand-vue/' for github.io subdirectory
  base: process.env.VITE_BASE_URL || '/',
  plugins: [
    vue(),
    vueDevTools(),
    VueI18nPlugin({
      include: [fileURLToPath(new URL('./src/locales/**', import.meta.url))],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
