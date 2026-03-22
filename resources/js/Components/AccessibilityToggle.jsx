import ControlButton from '@/Components/ControlButton';
import { useAccessibility } from '@/theme/useAccessibility';

function ContrastIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3a9 9 0 1 0 0 18V3Z" />
            <path d="M12 3a9 9 0 0 1 0 18" />
        </svg>
    );
}

export default function AccessibilityToggle({ className = '' }) {
    const { contrast, toggleContrast } = useAccessibility();

    return (
        <ControlButton
            type="button"
            onClick={toggleContrast}
            aria-pressed={contrast === 'high'}
            aria-label={`Contrast mode ${contrast}. Activate to toggle contrast.`}
            className={className}
            icon={<ContrastIcon />}
            label="Accessibility"
            badge={contrast === 'high' ? 'High' : 'Normal'}
        />
    );
}
