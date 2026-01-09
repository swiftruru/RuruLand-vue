# 測試與 CI/CD 說明文件

## 測試框架

本專案使用以下測試工具：

- **Vitest** - 快速的單元測試框架，與 Vite 原生整合
- **Vue Test Utils** - Vue 官方組件測試工具
- **jsdom** - 模擬瀏覽器環境
- **@testing-library/vue** - 提供更好的測試工具

## 可用的測試指令

```bash
# 執行測試（watch 模式）
npm run test

# 執行測試並產生覆蓋率報告
npm run test:coverage

# 單次執行所有測試（CI 模式）
npm run test:run

# 開啟測試 UI 介面
npm run test:ui
```

## 測試結構

```text
src/
  __tests__/
    setup.ts              # 測試環境設定
    composables/          # Composable 單元測試
      useLanguage.spec.ts
      usePhotoModal.spec.ts
    components/           # 組件測試
      NavigationBar.spec.ts
```

## 撰寫測試

### Composable 測試範例

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { usePhotoModal } from '../../composables/usePhotoModal'

describe('usePhotoModal', () => {
  it('should open modal with image', () => {
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.openModal('/test.jpg')
    expect(vm.isModalOpen).toBe(true)
  })
})
```

### 組件測試範例

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NavigationBar from '../../components/NavigationBar.vue'

describe('NavigationBar', () => {
  it('should render navigation items', () => {
    const wrapper = mount(NavigationBar, {
      global: {
        plugins: [i18n, pinia]
      }
    })

    expect(wrapper.text()).toContain('首頁')
  })
})
```

## CI/CD Pipeline

### GitHub Actions 工作流程

本專案使用 GitHub Actions 實現完整的 CI/CD 流程：

#### 1. 測試與建置 (test-and-build)

- 在 Node.js 20.x 和 22.x 上執行
- 執行型別檢查 (`npm run type-check`)
- 執行單元測試 (`npm run test:run`)
- 建置專案 (`npm run build`)
- 上傳建置產物

#### 2. 測試覆蓋率 (coverage)

- 產生測試覆蓋率報告
- 上傳到 Codecov（可選）

#### 3. 部署 (deploy)

- **觸發條件**: 只在 `main` 分支的 push 事件
- 自動部署到 GitHub Pages
- 使用 CNAME: `ruruland.swift.moe`

### Pipeline 觸發條件

```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
```

### 工作流程圖

```text
推送程式碼到 main/develop
  ↓
測試與建置 (Node 20.x, 22.x)
  ├─ 型別檢查
  ├─ 單元測試
  └─ 建置專案
  ↓
測試覆蓋率報告
  ↓
部署到 GitHub Pages (僅 main 分支)
```

## 最佳實踐

1. **每個功能都應該有測試** - 至少要測試主要功能
2. **保持測試簡潔** - 一個測試只測試一個行為
3. **使用描述性的測試名稱** - 清楚說明測試的目的
4. **Mock 外部依賴** - 測試應該是獨立的
5. **提交前執行測試** - 確保所有測試都通過

## 測試覆蓋率目標

- **單元測試**: 至少 70% 覆蓋率
- **關鍵功能**: 100% 覆蓋率
- **Composables**: 80% 以上覆蓋率

## 故障排除

### 常見問題

**Q: 測試失敗並顯示 "getActivePinia" 錯誤**
A: 確保在 `setup.ts` 中正確設定了 Pinia

**Q: i18n 相關錯誤**
A: 在組件測試中確保有提供 i18n plugin

**Q: Lifecycle hooks 錯誤**
A: Composables 必須在 Vue 組件上下文中測試

## 相關資源

- [Vitest 文檔](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [GitHub Actions](https://docs.github.com/en/actions)
