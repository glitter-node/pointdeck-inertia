import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';
import { resolveThemeTokens, themeOrder } from './tokens';

const STORAGE_KEY = 'pointdeck-theme';
const DEFAULT_THEME = 'light';
const ThemeContext = createContext(null);

function normalizeTheme(value) {
    return themeOrder.includes(value) ? value : DEFAULT_THEME;
}

function currentContrastMode() {
    if (typeof document !== 'undefined' && document.documentElement.dataset.contrast) {
        return document.documentElement.dataset.contrast;
    }

    if (typeof window !== 'undefined') {
        return window.localStorage.getItem('contrast') ?? 'normal';
    }

    return 'normal';
}

export function syncThemeTokens(theme, contrast = currentContrastMode()) {
    if (typeof document === 'undefined') {
        return;
    }

    const normalizedTheme = normalizeTheme(theme);
    const tokens = resolveThemeTokens(normalizedTheme, contrast);

    document.documentElement.dataset.theme = normalizedTheme;

    Object.entries(tokens).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
    });
}

export function initializeTheme() {
    if (typeof window === 'undefined') {
        return DEFAULT_THEME;
    }

    const theme = normalizeTheme(window.localStorage.getItem(STORAGE_KEY));
    syncThemeTokens(theme);

    return theme;
}

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(() => {
        if (typeof document !== 'undefined' && document.documentElement.dataset.theme) {
            return normalizeTheme(document.documentElement.dataset.theme);
        }

        if (typeof window !== 'undefined') {
            return normalizeTheme(window.localStorage.getItem(STORAGE_KEY));
        }

        return DEFAULT_THEME;
    });

    useEffect(() => {
        syncThemeTokens(theme);

        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, theme);
        }
    }, [theme]);

    const value = useMemo(() => ({
        theme,
        setTheme: (nextTheme) => setThemeState(normalizeTheme(nextTheme)),
        toggleTheme: () => {
            setThemeState((currentTheme) => {
                const currentIndex = themeOrder.indexOf(currentTheme);
                const nextIndex = (currentIndex + 1) % themeOrder.length;

                return themeOrder[nextIndex];
            });
        },
    }), [theme]);

    return createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider.');
    }

    return context;
}
