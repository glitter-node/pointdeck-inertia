import AccessibilityToggle from '@/Components/AccessibilityToggle';
import ControlGroup from '@/Components/ControlGroup';
import FontToggle from '@/Components/FontToggle';
import TextSizeToggle from '@/Components/TextSizeToggle';
import ThemeToggle from '@/Components/ThemeToggle';

export default function PreferenceControls({ className = '', ...props }) {
    return (
        <ControlGroup
            {...props}
            className={className}
            label="Display and accessibility controls"
        >
            <AccessibilityToggle />
            <TextSizeToggle />
            <FontToggle />
            <ThemeToggle />
        </ControlGroup>
    );
}
