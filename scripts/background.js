chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['scripts/contentScript.js']
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'colorSelected') {
        const data = message.data;
        const url = chrome.runtime.getURL('../popup/popup.html') +
            `?hexColor=${encodeURIComponent(data.hexColor)}` +
            `&rgbColor=${encodeURIComponent(JSON.stringify(data.rgbColor))}` +
            `&hslColor=${encodeURIComponent(JSON.stringify(data.hslColor))}` +
            `&cmykColor=${encodeURIComponent(JSON.stringify(data.cmykColor))}`;

        chrome.windows.create({
            url: url,
            type: 'popup',
            width: 400,
            height: 600
        });
    }
});
