document.addEventListener("DOMContentLoaded", async () => {
    const list = document.getElementById("list");
    const emptyMsg = document.getElementById("empty-msg");
    const clearBtn = document.getElementById("clear-btn");

    // Get current active tab
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];

    if (!currentTab) return;

    // Load data from storage
    const result = await browser.storage.local.get(currentTab.id.toString());
    const urls = result[currentTab.id] || [];

    renderList(urls);

    function renderList(urls) {
        list.innerHTML = "";
        if (urls.length === 0) {
            emptyMsg.style.display = "block";
            clearBtn.style.display = "none";
        } else {
            emptyMsg.style.display = "none";
            clearBtn.style.display = "block";
            urls.forEach((url) => {
                const li = document.createElement("li");
                li.className = "item";

                const urlText = document.createElement("div");
                urlText.className = "url-text";
                urlText.textContent = url;
                li.appendChild(urlText);

                const actions = document.createElement("div");
                actions.className = "actions";

                const downloadBtn = document.createElement("button");
                downloadBtn.className = "btn-download";
                downloadBtn.textContent = "Download";
                downloadBtn.onclick = () => {
                    browser.downloads.download({
                        url: url,
                        filename: `download-${Date.now()}.mp4`
                    });
                };
                actions.appendChild(downloadBtn);

                li.appendChild(actions);
                list.appendChild(li);
            });
        }
    }

    clearBtn.onclick = async () => {
        await browser.storage.local.remove(currentTab.id.toString());
        renderList([]);
    };
});
