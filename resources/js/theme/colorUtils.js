export function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

export function rgbToCss({ r, g, b }) {
    return `${r}, ${g}, ${b}`;
}

function channelToLinear(c) {
    c = c / 255;
    return c <= 0.03928
        ? c / 12.92
        : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function luminance({ r, g, b }) {
    const R = channelToLinear(r);
    const G = channelToLinear(g);
    const B = channelToLinear(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(color1, color2) {
    const L1 = luminance(color1);
    const L2 = luminance(color2);

    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);

    return (lighter + 0.05) / (darker + 0.05);
}

function adjustChannel(value, amount) {
    return Math.min(255, Math.max(0, value + amount));
}

export function adjustColor(color, amount) {
    return {
        r: adjustChannel(color.r, amount),
        g: adjustChannel(color.g, amount),
        b: adjustChannel(color.b, amount),
    };
}

export function getAccessibleColor(foregroundHex, backgroundHex, target = 4.5) {
    let fg = hexToRgb(foregroundHex);
    const bg = hexToRgb(backgroundHex);

    let ratio = contrastRatio(fg, bg);
    let step = 10;
    let attempts = 0;

    const isBgDark = luminance(bg) < 0.5;

    while (ratio < target && attempts < 50) {
        fg = adjustColor(fg, isBgDark ? 10 : -10);
        ratio = contrastRatio(fg, bg);
        attempts++;
    }

    return fg;
}
