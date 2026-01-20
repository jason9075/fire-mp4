document.addEventListener("DOMContentLoaded", async () => {
    const list = document.getElementById("list");
    const emptyMsg = document.getElementById("empty-msg");
    const clearBtn = document.getElementById("clear-btn");
    const downloadAllBtn = document.getElementById("download-all-btn");
    const tabTitle = document.getElementById("tab-title");
    const settingsBtn = document.getElementById("settings-btn");

    // Open options page
    settingsBtn.onclick = () => {
        browser.runtime.openOptionsPage();
    };

    // Get current active tab
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];

    if (!currentTab) return;

    // Set tab title
    tabTitle.textContent = currentTab.title || currentTab.url;

    // Load data from storage
    const result = await browser.storage.local.get(currentTab.id.toString());
    const items = result[currentTab.id] || [];

    renderList(items);

    function renderList(items) {
        list.innerHTML = "";
        if (items.length === 0) {
            emptyMsg.style.display = "block";
            clearBtn.style.display = "none";
            downloadAllBtn.style.display = "none";
        } else {
            emptyMsg.style.display = "none";
            clearBtn.style.display = "block";
            downloadAllBtn.style.display = "block";

            items.forEach((item) => {
                // Handle both old format (string) and new format (object)
                const url = typeof item === 'string' ? item : item.url;
                const size = (typeof item === 'object' && item.size) ? item.size : 'Size unknown';

                const li = document.createElement("li");
                li.className = "item";

                const urlText = document.createElement("div");
                urlText.className = "url-text";
                urlText.textContent = url;
                li.appendChild(urlText);

                const metaInfo = document.createElement("div");
                metaInfo.className = "meta-info";
                metaInfo.textContent = size;
                li.appendChild(metaInfo);

                const actions = document.createElement("div");
                actions.className = "actions";

                const downloadBtn = document.createElement("button");
                downloadBtn.className = "btn-download";
                downloadBtn.textContent = "Download";
                downloadBtn.onclick = () => {
                    downloadFile(url);
                };
                actions.appendChild(downloadBtn);

                li.appendChild(actions);
                list.appendChild(li);
            });
        }
    }

    function downloadFile(url) {
        browser.downloads.download({
            url: url,
            filename: `fire-mp4/${Date.now()}.mp4`
        });
    }

    downloadAllBtn.onclick = () => {
        // Re-fetch latest from storage to be safe, or just use current items
        // Since renderList is static, we can use 'items' captured in closure if we refresh
        // But let's iterate over visual list or stored data. Stored data is better.
        items.forEach(item => {
            const url = typeof item === 'string' ? item : item.url;
            downloadFile(url);
        });
    };

    clearBtn.onclick = async () => {
        await browser.storage.local.remove(currentTab.id.toString());
        renderList([]);
    };
});
