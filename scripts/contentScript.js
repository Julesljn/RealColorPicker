if (!window.realColorPickerActive) {
    window.realColorPickerActive = true;

    if ('EyeDropper' in window) {
        const eyeDropper = new EyeDropper();
        eyeDropper.open()
            .then(result => {
                const hexColor = result.sRGBHex;
                const rgbColor = hexToRgb(hexColor);
                const hslColor = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);

                chrome.storage.local.set({
                    hexColor,
                    rgbColor,
                    hslColor
                }, () => {
                    chrome.runtime.sendMessage({ action: 'colorDataReady' });
                });

                window.realColorPickerActive = false;
            })
            .catch(err => {
                console.error(err);
                window.realColorPickerActive = false;
            });
    }
}

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return { r, g, b };
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0));
                break;
            case g:
                h = ((b - r) / d + 2);
                break;
            case b:
                h = ((r - g) / d + 4);
                break;
        }
        h /= 6;
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}
