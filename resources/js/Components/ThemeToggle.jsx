import { themeLabels } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function ThemeToggle({ className = '' }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Current theme: ${themeLabels[theme]}. Activate to cycle theme.`}
            className={`theme-btn-secondary gap-2 px-3 py-2 text-xs uppercase tracking-[0.2em] ${className}`}
        >
            <span className="theme-badge-accent">{themeLabels[theme]}</span>
            <span className="theme-subtle">Cycle Theme</span>
        </button>
    );
}
