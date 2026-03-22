import ControlButton from '@/Components/ControlButton';
import { themeLabels } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

function ThemeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3v3" />
            <path d="M12 18v3" />
            <path d="m5.64 5.64 2.12 2.12" />
            <path d="m16.24 16.24 2.12 2.12" />
            <path d="M3 12h3" />
            <path d="M18 12h3" />
            <path d="m5.64 18.36 2.12-2.12" />
            <path d="m16.24 7.76 2.12-2.12" />
            <circle cx="12" cy="12" r="3.5" />
        </svg>
    );
}

export default function ThemeToggle({ className = '' }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <ControlButton
            type="button"
            onClick={toggleTheme}
            aria-label={`Current theme: ${themeLabels[theme]}. Activate to cycle theme.`}
            className={className}
            icon={<ThemeIcon />}
            label="Theme"
            badge={themeLabels[theme]}
        />
    );
}
