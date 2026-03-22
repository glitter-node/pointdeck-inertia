import { hexToRgb, rgbToCss, getAccessibleColor } from './colorUtils';

export function generateTheme(base) {
    const bg = hexToRgb(base.background);
    const surface = hexToRgb(base.surface);

    const textPrimary = getAccessibleColor(base.text, base.background);
    const textSecondary = getAccessibleColor(base.muted, base.background);

    const border = getAccessibleColor(base.border, base.surface);

    return {
        '--theme-bg-rgb': rgbToCss(bg),
        '--theme-surface-rgb': rgbToCss(surface),
        '--theme-text-primary-rgb': rgbToCss(textPrimary),
        '--theme-text-secondary-rgb': rgbToCss(textSecondary),
        '--theme-border-rgb': rgbToCss(border),
    };
}
