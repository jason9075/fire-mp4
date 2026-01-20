// Save options to browser.storage
const saveOptions = async () => {
    const regex = document.getElementById('regex').value;
    await browser.storage.local.set({
        filterRegex: regex
    });

    const status = document.getElementById('status');
    status.style.display = 'block';
    setTimeout(() => {
        status.style.display = 'none';
    }, 2000);
};

// Restore select box and checkbox state using the preferences
// stored in browser.storage.
const restoreOptions = async () => {
    const result = await browser.storage.local.get('filterRegex');
    document.getElementById('regex').value = result.filterRegex || '';
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
