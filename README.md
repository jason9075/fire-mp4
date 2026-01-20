# 🔥 Fire-MP4

一個極簡、高效的 Firefox 瀏覽器擴充套件，專注於偵測並抓取網頁中的 MP4 影片資源。

## 🚀 特點

- **輕量化**：零依賴，純原生 WebExtension API 打造。
- **精準攔截**：透過 `webRequest` API 核心層監聽，無論是靜態標籤還是動態 `fetch/xhr` 載入的 MP4 資源皆能捕捉。
- **隱私優先**：所有數據僅儲存於本地記憶體（Local Storage），關閉分頁即自動清除。
- **開發者友善**：專為 NixOS 與 Neovim 使用者優化的開發環境。

## 🛠 開發環境 (NixOS)

本專案使用 `flake.nix` 管理開發環境。

### 1. 進入環境
```bash
nix develop
```
這將會進入包含 `web-ext` 工具的 Shell 環境。

### 2. 啟動測試
```bash
web-ext run
```
這將自動開啟一個全新的 Firefox 實例並載入此擴充套件。

### 3. 手動載入 (現有 Firefox)
如果您想在現有的 Firefox 中測試：

1. 在網址列輸入 `about:debugging#/runtime/this-firefox` 並前往。
2. 點擊「載入暫用附加元件... (Load Temporary Add-on...)」。
3. 瀏覽並選擇本專案目錄下的 `manifest.json` 檔案。

擴充套件將會立即生效，直到您關閉 Firefox 為止。

## 📂 專案結構

```plaintext
fire-mp4/
├── manifest.json    # 擴充套件設定檔 (權限、入口點)
├── background.js    # 核心背景腳本 (負責監聽網路請求)
├── flake.nix        # Nix Flake 開發環境定義
├── icons/           # 圖示資源
└── popup/           # 使用者介面
    ├── popup.html   # 彈出視窗結構
    └── popup.js     # 介面互動邏輯
```

## ⚖️ 授權

MIT License
