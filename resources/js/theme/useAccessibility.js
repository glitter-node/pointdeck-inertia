import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';
import { contrastModes, sizeModes } from './accessibility';
import { syncThemeTokens } from './useTheme';

const ContrastContext = createContext(null);
const STORAGE_KEYS = {
    contrast: 'contrast',
    size: 'size',
};

function normalizeContrast(value) {
    return contrastModes.includes(value) ? value : 'normal';
}

function normalizeSize(value) {
    return sizeModes.includes(value) ? value : 'normal';
}

function applyAccessibility(contrast, size) {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.dataset.contrast = normalizeContrast(contrast);
    document.documentElement.dataset.size = normalizeSize(size);

    const currentTheme = document.documentElement.dataset.theme ?? 'light';
    syncThemeTokens(currentTheme, normalizeContrast(contrast));
}

export function initializeAccessibility() {
    if (typeof window === 'undefined') {
        return {
            contrast: 'normal',
            size: 'normal',
        };
    }

    const contrast = normalizeContrast(window.localStorage.getItem(STORAGE_KEYS.contrast));
    const size = normalizeSize(window.localStorage.getItem(STORAGE_KEYS.size));

    applyAccessibility(contrast, size);

    return { contrast, size };
}

export function AccessibilityProvider({ children }) {
    const [contrast, setContrastState] = useState(() => {
        if (typeof document !== 'undefined' && document.documentElement.dataset.contrast) {
            return normalizeContrast(document.documentElement.dataset.contrast);
        }

        if (typeof window !== 'undefined') {
            return normalizeContrast(window.localStorage.getItem(STORAGE_KEYS.contrast));
        }

        return 'normal';
    });
    const [size, setSizeState] = useState(() => {
        if (typeof document !== 'undefined' && document.documentElement.dataset.size) {
            return normalizeSize(document.documentElement.dataset.size);
        }

        if (typeof window !== 'undefined') {
            return normalizeSize(window.localStorage.getItem(STORAGE_KEYS.size));
        }

        return 'normal';
    });

    useEffect(() => {
        applyAccessibility(contrast, size);

        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEYS.contrast, contrast);
            window.localStorage.setItem(STORAGE_KEYS.size, size);
        }
    }, [contrast, size]);

    const value = useMemo(() => ({
        contrast,
        toggleContrast: () => {
            setContrastState((currentContrast) =>
                currentContrast === 'normal' ? 'high' : 'normal',
            );
        },
        size,
        toggleSize: () => {
            setSizeState((currentSize) =>
                currentSize === 'normal' ? 'large' : 'normal',
            );
        },
    }), [contrast, size]);

    return createElement(ContrastContext.Provider, { value }, children);
}

export function useAccessibility() {
    const context = useContext(ContrastContext);

    if (!context) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider.');
    }

    return context;
}
