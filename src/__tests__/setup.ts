import { config } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach } from 'vitest'

// 設定全局測試配置
beforeEach(() => {
  // 為每個測試創建新的 Pinia 實例
  const pinia = createPinia()
  setActivePinia(pinia)
})

// 配置 Vue Test Utils
config.global.plugins = []
