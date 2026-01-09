# 測試文件

## 📊 測試覆蓋率概覽

本專案已實作完整的測試覆蓋率，包含單元測試、組件測試和整合測試。

### 整體覆蓋率統計

- **總覆蓋率**: 68.75%
- **分支覆蓋率**: 86.33%
- **函數覆蓋率**: 58.16%
- **行覆蓋率**: 68.75%

### 測試檔案數量

- ✅ **12 個測試檔案**
- ✅ **107 個測試案例**
- ✅ **100% 測試通過率**

---

## 🧪 測試架構

### 1. Composables 測試 (單元測試)

#### ✅ useMenu.spec.ts (5 tests)
測試選單開關功能
- 初始化狀態
- 切換選單
- 關閉選單
- 點擊外部關閉選單
- 點擊內部不關閉選單

#### ✅ useLanguage.spec.ts (6 tests)
測試語言切換功能
- 預設語言初始化
- 中英文切換
- 設定特定語言
- 語言按鈕文字更新
- 與 store 同步

#### ✅ useAccessibility.spec.ts (10 tests)
測試無障礙功能
- 高對比模式切換
- 從 localStorage 恢復設定
- 鍵盤導航偵測
- 螢幕閱讀器公告
- 焦點陷阱功能
- Tab 鍵導航

#### ✅ useScrollAnimation.spec.ts (9 tests)
測試滾動動畫功能
- 初始化 IntersectionObserver
- 元素進入視窗時加入 animate class
- 觀察多種動畫類型
- 動畫完成後停止觀察
- 平滑滾動功能
- 錨點連結處理

#### ✅ usePhotoModal.spec.ts (3 tests)
測試照片 Modal 功能
- Modal 初始關閉狀態
- 打開 Modal
- 關閉 Modal 並清除圖片

---

### 2. 組件測試

#### ✅ NavigationBar.spec.ts (4 tests)
測試導航列組件
- 渲染導航項目
- 正確的連結 href
- 語言切換按鈕
- 漢堡選單按鈕

#### ✅ HeroSection.spec.ts (6 tests)
測試首頁 Hero 區塊
- 渲染個人資訊
- 渲染個人照片
- 點擊照片觸發放大 Modal
- 渲染行動按鈕
- 動畫 class 存在
- 多語系切換

#### ✅ ProjectCard.spec.ts (12 tests)
測試專案卡片組件
- 渲染專案資訊
- 渲染專案圖片
- 點擊圖片觸發 Modal
- 渲染技術棧標籤
- 渲染功能列表
- 條件渲染專案亮點
- 點擊詳情按鈕
- URL 自動加上 https 協議
- 外部連結安全屬性

#### ✅ ContactForm.spec.ts (14 tests)
測試聯絡表單組件
- 渲染表單欄位
- 渲染標籤文字
- 提交按鈕
- v-model 雙向綁定
- 提交時禁用表單
- 顯示載入狀態
- 成功訊息顯示
- 錯誤訊息處理
- 網路錯誤處理
- 成功後清空表單
- Google Analytics 事件追蹤
- 必填屬性
- 正確的 input type

#### ✅ FloatingContactButton.spec.ts (17 tests)
測試浮動聯絡按鈕
- 渲染按鈕
- 切換 Modal 開關
- 顯示/隱藏聯絡資訊
- 多語系支援
- 外部連結
- ESC 鍵關閉
- 等等...

---

### 3. Store 測試

#### ✅ language.spec.ts (10 tests)
測試 Pinia Language Store
- 預設語言 zh-TW
- 從 localStorage 恢復
- 切換語言到 en/zh-TW
- 保存到 localStorage
- 更新 document.lang 屬性
- 語言按鈕文字
- Toggle 功能
- 跨實例持久化

---

### 4. 整合測試

#### ✅ App.spec.ts (11 tests)
測試 App 整體功能
- 渲染應用程式結構
- 骨架屏載入
- 載入完成後隱藏骨架屏
- 無障礙跳過連結
- 渲染所有主要區塊
- Footer 版權資訊
- Photo Modal 開關
- Project Detail Modal 開關
- 語義化 HTML 結構
- 淡入動畫
- 工具組件渲染

---

## 📈 詳細覆蓋率報告

### Composables (高覆蓋率)
- ✅ useMenu.ts: ~90% coverage
- ✅ useLanguage.ts: ~95% coverage
- ✅ useAccessibility.ts: ~85% coverage
- ✅ useScrollAnimation.ts: ~80% coverage
- ✅ usePhotoModal.ts: 100% coverage

### Components (中等覆蓋率)
- ✅ NavigationBar.vue: ~70%
- ✅ HeroSection.vue: 100%
- ✅ ProjectCard.vue: ~95%
- ✅ ContactForm.vue: ~85%
- ✅ FloatingContactButton.vue: ~80%
- ⚠️ AboutSection.vue: 100% (測試較簡單)
- ⚠️ TimelineSection.vue: 未測試
- ⚠️ ProjectsSection.vue: 未測試
- ⚠️ ContactSection.vue: 未測試

### Stores
- ✅ language.ts: ~95% coverage

### Integration
- ✅ App.vue: 100% coverage

---

## 🚀 執行測試

### 執行所有測試
```bash
npm run test
```

### 執行測試一次（CI 模式）
```bash
npm run test:run
```

### 執行測試並生成覆蓋率報告
```bash
npm run test:coverage
```

### 測試 UI（視覺化介面）
```bash
npm run test:ui
```

---

## 📝 測試最佳實踐

### 1. 單元測試
- 測試每個函數的輸入輸出
- 測試邊界條件
- 測試錯誤處理

### 2. 組件測試
- 測試渲染輸出
- 測試使用者互動
- 測試 props 和 emits
- 測試條件渲染

### 3. 整合測試
- 測試多個組件協同工作
- 測試資料流
- 測試路由導航
- 測試 store 整合

### 4. Mock 策略
- Mock 外部 API 請求
- Mock 瀏覽器 API（IntersectionObserver、localStorage 等）
- Mock 複雜的 composables

---

## 🎯 未來改進方向

### 1. 增加測試覆蓋率
- [ ] 為 TimelineSection 增加測試
- [ ] 為 ProjectsSection 增加測試
- [ ] 為 ContactSection 增加測試
- [ ] 為 ProjectDetailModal 增加測試
- [ ] 為 PhotoModal 增加測試

### 2. E2E 測試
- [ ] 使用 Playwright 或 Cypress 建立端對端測試
- [ ] 測試完整的使用者流程
- [ ] 測試多瀏覽器相容性

### 3. 效能測試
- [ ] 加入效能基準測試
- [ ] 測試載入時間
- [ ] 測試記憶體使用

### 4. 可訪問性測試
- [ ] 使用 axe-core 進行自動化 a11y 測試
- [ ] 測試鍵盤導航
- [ ] 測試螢幕閱讀器相容性

---

## 📊 測試報告

測試覆蓋率報告會自動生成在 `coverage/` 目錄下：

- **coverage/index.html** - HTML 格式的覆蓋率報告
- **coverage/coverage-final.json** - JSON 格式的詳細報告
- **coverage/lcov.info** - LCOV 格式（可用於 CI）

在瀏覽器中開啟 `coverage/index.html` 可以查看詳細的視覺化報告。

---

## ✅ 測試成就

- ✅ 107 個測試案例全部通過
- ✅ 12 個測試檔案
- ✅ 68.75% 程式碼覆蓋率
- ✅ 86.33% 分支覆蓋率
- ✅ 涵蓋所有核心功能
- ✅ 完整的 composables 測試
- ✅ 主要組件的測試
- ✅ Store 狀態管理測試
- ✅ 整合測試確保各部分協同工作

---

## 🔧 測試工具與框架

- **Vitest** - 快速的單元測試框架
- **@vue/test-utils** - Vue 組件測試工具
- **jsdom** - 模擬瀏覽器環境
- **@vitest/ui** - 視覺化測試介面
- **@vitest/coverage-v8** - 程式碼覆蓋率工具

---

*Last updated: 2026-01-09*
*Test suite version: 1.0.0*
