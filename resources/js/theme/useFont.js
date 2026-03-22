import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';
import { fontOrder } from './fonts';

const STORAGE_KEY = 'font';
const DEFAULT_FONT = 'mono';
const FontContext = createContext(null);

function normalizeFont(value) {
    return fontOrder.includes(value) ? value : DEFAULT_FONT;
}

function applyFont(font) {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.dataset.font = normalizeFont(font);
}

export function initializeFont() {
    if (typeof window === 'undefined') {
        return DEFAULT_FONT;
    }

    const font = normalizeFont(window.localStorage.getItem(STORAGE_KEY));
    applyFont(font);

    return font;
}

export function FontProvider({ children }) {
    const [font, setFontState] = useState(() => {
        if (typeof document !== 'undefined' && document.documentElement.dataset.font) {
            return normalizeFont(document.documentElement.dataset.font);
        }

        if (typeof window !== 'undefined') {
            return normalizeFont(window.localStorage.getItem(STORAGE_KEY));
        }

        return DEFAULT_FONT;
    });

    useEffect(() => {
        applyFont(font);

        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, font);
        }
    }, [font]);

    const value = useMemo(() => ({
        font,
        setFont: (nextFont) => setFontState(normalizeFont(nextFont)),
        toggleFont: () => {
            setFontState((currentFont) => {
                const currentIndex = fontOrder.indexOf(currentFont);
                const nextIndex = (currentIndex + 1) % fontOrder.length;

                return fontOrder[nextIndex];
            });
        },
    }), [font]);

    return createElement(FontContext.Provider, { value }, children);
}

export function useFont() {
    const context = useContext(FontContext);

    if (!context) {
        throw new Error('useFont must be used within a FontProvider.');
    }

    return context;
}
