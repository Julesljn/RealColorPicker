document.addEventListener('DOMContentLoaded', () => {
    const selectColorButton = document.getElementById('selectColorButton');
    const colorDisplay = document.getElementById('colorDisplay');
    const colorSwatch = document.getElementById('colorSwatch');
    const colorInfo = document.getElementById('colorInfo');

    selectColorButton.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['scripts/contentScript.js']
            });
        });
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'colorDataReady') {
            updateColorData();
        }
    });

    updateColorData();
});

function updateColorData() {
    chrome.storage.local.get(['hexColor', 'rgbColor', 'hslColor'], (data) => {
        const { hexColor, rgbColor, hslColor } = data;
        if (hexColor) {
            document.getElementById('selectColorButton').style.display = 'none';
            document.getElementById('colorDisplay').style.display = 'block';

            const colorSwatch = document.getElementById('colorSwatch');
            colorSwatch.style.backgroundColor = hexColor;

            const colorInfo = document.getElementById('colorInfo');
            colorInfo.innerHTML = `
          <li><strong>Hexadécimal :</strong> <span id="hexColor">${hexColor}</span>
            <button class="copy-button" data-copy="hexColor">Copy</button>
          </li>
          <li><strong>RGB :</strong> <span id="rgbColor">(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})</span>
            <button class="copy-button" data-copy="rgbColor">Copy</button>
          </li>
          <li><strong>HSL :</strong> <span id="hslColor">(${hslColor.h}°, ${hslColor.s}%, ${hslColor.l}%)</span>
            <button class="copy-button" data-copy="hslColor">Copy</button>
          </li>
        `;

            document.querySelectorAll('.copy-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const dataType = e.target.getAttribute('data-copy');
                    let textToCopy = '';

                    if (dataType === 'hexColor') {
                        textToCopy = hexColor;
                    } else if (dataType === 'rgbColor') {
                        textToCopy = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
                    } else if (dataType === 'hslColor') {
                        textToCopy = `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`;
                    }

                    navigator.clipboard.writeText(textToCopy);
                });
            });

            chrome.storage.local.remove(['hexColor', 'rgbColor', 'hslColor']);
        }
    });
}
