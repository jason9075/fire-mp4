// Keep track of MP4 URLs per tab
// Structure: { tabId: Map<url, { url: string, size: string | null }> }
const mp4Data = {};

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return 'Unknown size';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Listener for network requests
browser.webRequest.onBeforeRequest.addListener(
  async (details) => {
    const url = details.url;
    // Check if it looks like an MP4
    if (url.toLowerCase().includes('.mp4')) {
      const tabId = details.tabId;

      // Ignore requests not associated with a specific tab
      if (tabId === -1) return;

      // Check Regex Filter
      const settings = await browser.storage.local.get('filterRegex');
      if (settings.filterRegex) {
        try {
          const regex = new RegExp(settings.filterRegex);
          if (!regex.test(url)) return;
        } catch (e) {
          console.error("Invalid Regex:", e);
        }
      }

      if (!mp4Data[tabId]) {
        mp4Data[tabId] = new Map();
      }

      // Avoid re-fetching size if we already have this URL
      if (!mp4Data[tabId].has(url)) {
        // Initialize with unknown size
        mp4Data[tabId].set(url, { url: url, size: null });

        // Update storage immediately so UI sees it
        updateStorage(tabId);

        // Fetch size asynchronously
        fetchSize(url, tabId);
      }
    }
  },
  { urls: ["<all_urls>"] }
);

async function fetchSize(url, tabId) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (response.ok) {
      const length = response.headers.get('Content-Length');
      if (length && mp4Data[tabId] && mp4Data[tabId].has(url)) {
        const item = mp4Data[tabId].get(url);
        item.size = formatBytes(length);
        mp4Data[tabId].set(url, item);
        updateStorage(tabId);
      }
    }
  } catch (error) {
    console.error("Failed to fetch size for", url, error);
  }
}

function updateStorage(tabId) {
  if (mp4Data[tabId]) {
    // Convert Map values to Array
    const dataList = Array.from(mp4Data[tabId].values());
    browser.storage.local.set({ [tabId]: dataList });
  }
}

// Clean up when a tab is closed
browser.tabs.onRemoved.addListener((tabId) => {
  if (mp4Data[tabId]) {
    delete mp4Data[tabId];
    browser.storage.local.remove(tabId.toString());
    console.log(`Cleared data for detected closed tab ${tabId}`);
  }
});

// Clear on navigation
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.type === "main_frame") {
      const tabId = details.tabId;
      if (mp4Data[tabId]) {
        delete mp4Data[tabId];
        browser.storage.local.remove(tabId.toString());
        console.log(`Cleared data for navigated tab ${tabId}`);
      }
    }
  },
  { urls: ["<all_urls>"] }
);
