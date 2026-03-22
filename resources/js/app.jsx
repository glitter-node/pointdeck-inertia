import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { AccessibilityProvider, initializeAccessibility } from './theme/useAccessibility';
import { FontProvider, initializeFont } from './theme/useFont';
import { resolveThemeTokens } from './theme/tokens';
import { initializeTheme, ThemeProvider } from './theme/useTheme';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const progressColor = `rgb(${resolveThemeTokens('light')['--theme-accent-rgb']})`;

initializeTheme();
initializeFont();
initializeAccessibility();

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider>
                <FontProvider>
                    <AccessibilityProvider>
                        <App {...props} />
                    </AccessibilityProvider>
                </FontProvider>
            </ThemeProvider>,
        );
    },
    progress: {
        color: progressColor,
    },
});
