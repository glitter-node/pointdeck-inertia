import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                theme: {
                    bg: 'rgb(var(--theme-bg-rgb) / <alpha-value>)',
                    surface: 'rgb(var(--theme-surface-rgb) / <alpha-value>)',
                    primary: 'rgb(var(--theme-text-primary-rgb) / <alpha-value>)',
                    secondary: 'rgb(var(--theme-text-secondary-rgb) / <alpha-value>)',
                    border: 'rgb(var(--theme-border-rgb) / <alpha-value>)',
                    accent: 'rgb(var(--theme-accent-rgb) / <alpha-value>)',
                    contrast: 'rgb(var(--theme-accent-contrast-rgb) / <alpha-value>)',
                    success: 'rgb(var(--theme-success-rgb) / <alpha-value>)',
                    danger: 'rgb(var(--theme-danger-rgb) / <alpha-value>)',
                    overlay: 'rgb(var(--theme-overlay-rgb) / <alpha-value>)',
                },
            },
            fontFamily: {
                base: ['var(--font-family)'],
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
