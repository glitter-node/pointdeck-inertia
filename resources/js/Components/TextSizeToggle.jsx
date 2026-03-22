import ControlButton from '@/Components/ControlButton';
import { useAccessibility } from '@/theme/useAccessibility';

function TextSizeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 19 9 7h1l4 12" />
            <path d="M6.5 15h5" />
            <path d="M14 17V9" />
            <path d="M11 9h6" />
        </svg>
    );
}

export default function TextSizeToggle({ className = '' }) {
    const { size, toggleSize } = useAccessibility();

    return (
        <ControlButton
            type="button"
            onClick={toggleSize}
            aria-pressed={size === 'large'}
            aria-label={`Text size ${size}. Activate to toggle text size.`}
            className={className}
            icon={<TextSizeIcon />}
            label="Text Size"
            badge={size === 'large' ? 'Large' : 'Normal'}
        />
    );
}
