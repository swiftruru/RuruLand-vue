import { config } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach } from 'vitest'

// 禁用 vue-i18n 的 missing key 警告
const originalWarn = console.warn
const originalError = console.error

beforeEach(() => {
  // 為每個測試創建新的 Pinia 實例
  const pinia = createPinia()
  setActivePinia(pinia)

  // 過濾 i18n 警告
  console.warn = (...args: any[]) => {
    const msg = args[0]?.toString() || ''
    if (msg.includes('[intlify]') || msg.includes('Not found')) {
      return
    }
    originalWarn.apply(console, args)
  }

  console.error = (...args: any[]) => {
    const msg = args[0]?.toString() || ''
    if (msg.includes('Message compilation error')) {
      return
    }
    originalError.apply(console, args)
  }
})

// 配置 Vue Test Utils
config.global.plugins = []
