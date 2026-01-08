# Vercel 部署指南

本專案已配置好可以同時部署到 GitHub Pages 和 Vercel。

## 🚀 快速設置

### 步驟 1: 連接 Vercel 到 GitHub

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊 "Add New..." → "Project"
3. 選擇 "Import Git Repository"
4. 找到並選擇 `RuruLand-vue` 專案

### 步驟 2: 配置專案設定

Vercel 應該會自動偵測到 Vue 專案，但請確認以下設定：

**Framework Preset**: `Other`（或 `Vite`）

**Build & Development Settings**:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

**Root Directory**: `.` (專案根目錄)

### 步驟 3: 環境變數（可選）

如果需要，可以添加以下環境變數：

```
VITE_BASE_URL=/
NODE_VERSION=20
```

### 步驟 4: Git 分支設定

**重要**: 確保 Vercel 從 `main` 分支部署，而不是 `gh-pages`

在 Vercel Project Settings → Git：
- **Production Branch**: `main`
- 取消勾選 `gh-pages` 分支的自動部署

### 步驟 5: 部署

點擊 "Deploy" 按鈕，Vercel 會自動：
1. Clone `main` 分支
2. 安裝依賴 (`npm install`)
3. 執行構建 (`npm run build`)
4. 部署 `dist` 目錄

## 📋 配置文件說明

### vercel.json

本專案包含 `vercel.json` 配置文件，提供以下功能：

#### 1. 構建設定
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

#### 2. SPA 路由支援
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
這確保所有路由都正確導向 `index.html`（Vue Router 需要）

#### 3. Service Worker 標頭
```json
{
  "source": "/sw.js",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=0, must-revalidate"
    }
  ]
}
```
確保 Service Worker 不被快取

#### 4. 安全標頭
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

#### 5. 靜態資源快取
```json
{
  "source": "/assets/(.*)",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=31536000, immutable"
    }
  ]
}
```

## 🔧 常見問題

### Q1: 部署失敗：`vite: command not found`

**原因**: Vercel 嘗試從錯誤的分支部署（如 `gh-pages`）

**解決方案**:
1. 前往 Vercel Project Settings → Git
2. 設定 Production Branch 為 `main`
3. 禁用 `gh-pages` 分支的自動部署
4. 重新部署

### Q2: 404 錯誤（刷新頁面時）

**原因**: SPA 路由未正確配置

**解決方案**: 確認 `vercel.json` 中有正確的 `rewrites` 配置（已包含在配置文件中）

### Q3: Service Worker 無法更新

**原因**: Service Worker 被快取

**解決方案**: `vercel.json` 已配置正確的 Cache-Control 標頭，應該不會有此問題

### Q4: PWA 無法安裝

**原因**: Vercel 預設提供 HTTPS，但需要確認 manifest 路徑正確

**解決方案**:
1. 檢查 `dist/manifest.webmanifest` 是否存在
2. 確認 `index.html` 中的 manifest link 正確
3. 使用 Chrome DevTools → Application → Manifest 檢查

## 🌐 自訂域名

### 添加自訂域名

1. 前往 Vercel Project Settings → Domains
2. 添加您的域名（如 `ruruland.vercel.app` 或自訂域名）
3. 配置 DNS 記錄：

**A Record**:
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME Record** (for www):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## 📊 效能優化

Vercel 自動提供：
- ✅ 全球 CDN
- ✅ 自動 HTTPS
- ✅ HTTP/2 & HTTP/3
- ✅ Edge Network
- ✅ 自動圖片優化（需額外配置）
- ✅ Gzip/Brotli 壓縮

## 🔄 CI/CD 流程

### 自動部署

每次推送到 `main` 分支時：
1. GitHub Actions 自動構建並部署到 GitHub Pages
2. Vercel 自動構建並部署到 Vercel

### Preview Deployments

每次建立 Pull Request 時：
- Vercel 會自動建立 Preview Deployment
- 可以在合併前預覽變更

## 📈 分析與監控

### Vercel Analytics

1. 前往 Vercel Project Settings → Analytics
2. 啟用 Analytics
3. 查看：
   - Page Views
   - Top Pages
   - Top Referrers
   - Devices
   - Real User Metrics (Core Web Vitals)

### Speed Insights

1. 啟用 Speed Insights
2. 監控 Core Web Vitals：
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

## 🎯 最佳實踐

### 1. 環境變數管理
- 使用 Vercel Environment Variables
- 區分 Production / Preview / Development

### 2. 分支策略
- `main`: Production 部署
- `develop`: Preview 部署
- Feature branches: 自動 Preview

### 3. 回滾機制
- Vercel 保留所有部署歷史
- 可隨時回滾到先前版本

## 📚 相關連結

- [Vercel 文檔](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Vue Router 歷史模式](https://router.vuejs.org/guide/essentials/history-mode.html)

## ⚠️ 注意事項

1. **不要部署 gh-pages 分支**: 該分支僅用於 GitHub Pages
2. **確認 Node 版本**: Vercel 預設使用 Node 18，可在 `package.json` 中指定版本
3. **PWA 考量**: Vercel 的多次部署可能導致 Service Worker 快取問題，建議使用版本管理

---

如有問題，請查看 [Vercel Support](https://vercel.com/support) 或專案的 Issues。
