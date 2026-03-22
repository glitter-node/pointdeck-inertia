import { useAccessibility } from '@/theme/useAccessibility';

export default function AccessibilityToggle({ className = '' }) {
    const { contrast, toggleContrast, size, toggleSize } = useAccessibility();

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                type="button"
                onClick={toggleContrast}
                aria-pressed={contrast === 'high'}
                aria-label={`Contrast mode ${contrast}. Activate to toggle contrast.`}
                className="theme-btn-secondary gap-2 px-3 py-2 text-xs uppercase tracking-[0.2em]"
            >
                <span className="theme-badge-accent">
                    {contrast === 'high' ? 'High' : 'Normal'}
                </span>
                <span className="theme-subtle">Contrast</span>
            </button>

            <button
                type="button"
                onClick={toggleSize}
                aria-pressed={size === 'large'}
                aria-label={`Text size ${size}. Activate to toggle text size.`}
                className="theme-btn-secondary gap-2 px-3 py-2 text-xs uppercase tracking-[0.2em]"
            >
                <span className="theme-badge-accent">
                    {size === 'large' ? 'Large' : 'Normal'}
                </span>
                <span className="theme-subtle">Text Size</span>
            </button>
        </div>
    );
}
