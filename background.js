// Keep track of MP4 URLs per tab
const mp4Urls = {};

// Listener for network requests
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = details.url;
    // Check if it looks like an MP4
    if (url.toLowerCase().includes('.mp4')) {
        const tabId = details.tabId;
        
        // Ignore requests not associated with a specific tab (-1)
        if (tabId === -1) return;

        if (!mp4Urls[tabId]) {
            mp4Urls[tabId] = new Set();
        }
        
        // Add URL to the set for this tab
        mp4Urls[tabId].add(url);

        // Update storage
        browser.storage.local.set({ [tabId]: Array.from(mp4Urls[tabId]) });
        
        console.log(`Detected MP4 in tab ${tabId}: ${url}`);
    }
  },
  { urls: ["<all_urls>"] }
);

// Clean up when a tab is closed
browser.tabs.onRemoved.addListener((tabId) => {
  if (mp4Urls[tabId]) {
    delete mp4Urls[tabId];
    browser.storage.local.remove(tabId.toString());
    console.log(`Cleared data for detected closed tab ${tabId}`);
  }
});

// Also clean up when a tab is updated (e.g. navigated to a new page) -> maybe optional?
// For now, let's keep the history until the tab is closed or the user manually clears it,
// but usually navigation means new context. Let's clear on main frame navigation.
browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (details.type === "main_frame") {
             const tabId = details.tabId;
             if (mp4Urls[tabId]) {
                 delete mp4Urls[tabId];
                 browser.storage.local.remove(tabId.toString());
                 console.log(`Cleared data for navigated tab ${tabId}`);
             }
        }
    },
    { urls: ["<all_urls>"] }
);
