import { fonts } from '@/theme/fonts';
import { useFont } from '@/theme/useFont';

export default function FontToggle({ className = '' }) {
    const { font, toggleFont } = useFont();

    return (
        <button
            type="button"
            onClick={toggleFont}
            aria-label={`Current font: ${fonts[font].label}. Activate to cycle font.`}
            className={`theme-btn-secondary gap-2 px-3 py-2 text-xs uppercase tracking-[0.2em] ${className}`}
        >
            <span className="theme-badge-accent">{fonts[font].label}</span>
            <span className="theme-subtle">Cycle Font</span>
        </button>
    );
}
