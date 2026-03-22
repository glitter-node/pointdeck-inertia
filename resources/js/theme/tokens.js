import { getAccessibleColor, hexToRgb, rgbToCss } from './colorUtils';
import { generateTheme } from './generateTokens';

const lightBase = {
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#111827',
    muted: '#6b7280',
    border: '#d1d5db',
};

const darkBase = {
    background: '#0b1220',
    surface: '#111827',
    text: '#e5e7eb',
    muted: '#9ca3af',
    border: '#374151',
};

const themeBases = {
    light: {
        ...lightBase,
        accent: '#2563eb',
        accentContrast: '#ffffff',
        success: '#15803d',
        danger: '#b91c1c',
        overlay: '#020617',
    },
    dark: {
        ...darkBase,
        accent: '#60a5fa',
        accentContrast: '#0b1220',
        success: '#4ade80',
        danger: '#f87171',
        overlay: '#020617',
    },
};

export const themes = {
    light: generateTheme(lightBase),
    dark: generateTheme(darkBase),
};

export const themeOrder = ['light', 'dark'];

export const themeLabels = {
    light: 'Light',
    dark: 'Dark',
};

function createThemeTokens(base, target = 4.5) {
    const generated = generateTheme(base);
    const isHighContrast = target >= 7;
    const secondarySource = isHighContrast ? base.text : base.muted;
    const borderSource = isHighContrast ? base.text : base.border;
    const accentContrastTarget = isHighContrast ? 7 : 4.5;

    return {
        ...generated,
        '--theme-text-primary-rgb': rgbToCss(getAccessibleColor(base.text, base.background, target)),
        '--theme-text-secondary-rgb': rgbToCss(getAccessibleColor(secondarySource, base.background, target)),
        '--theme-border-rgb': rgbToCss(getAccessibleColor(borderSource, base.surface, target)),
        '--theme-accent-rgb': rgbToCss(hexToRgb(base.accent)),
        '--theme-accent-contrast-rgb': rgbToCss(getAccessibleColor(base.accentContrast, base.accent, accentContrastTarget)),
        '--theme-success-rgb': rgbToCss(hexToRgb(base.success)),
        '--theme-danger-rgb': rgbToCss(hexToRgb(base.danger)),
        '--theme-overlay-rgb': rgbToCss(hexToRgb(base.overlay)),
    };
}

export function resolveThemeTokens(themeName, contrastMode = 'normal') {
    const normalizedTheme = themeOrder.includes(themeName) ? themeName : 'light';
    const target = contrastMode === 'high' ? 7 : 4.5;

    return createThemeTokens(themeBases[normalizedTheme], target);
}
