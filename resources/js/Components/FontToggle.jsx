import ControlButton from '@/Components/ControlButton';
import { fonts } from '@/theme/fonts';
import { useFont } from '@/theme/useFont';

function FontIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 18 10.5 6h3L18 18" />
            <path d="M8 14h8" />
        </svg>
    );
}

export default function FontToggle({ className = '' }) {
    const { font, toggleFont } = useFont();

    return (
        <ControlButton
            type="button"
            onClick={toggleFont}
            aria-label={`Current font: ${fonts[font].label}. Activate to cycle font.`}
            className={className}
            icon={<FontIcon />}
            label="Font"
            badge={fonts[font].label}
        />
    );
}
