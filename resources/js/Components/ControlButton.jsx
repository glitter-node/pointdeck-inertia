export default function ControlButton({
    type = 'button',
    className = '',
    icon = null,
    label,
    badge = null,
    children,
    ...props
}) {
    const content = children ?? (
        <>
            {icon ? <span className="theme-control-icon" aria-hidden="true">{icon}</span> : null}
            <span className="theme-control-label">{label}</span>
            {badge ? <span className="theme-control-badge">{badge}</span> : null}
        </>
    );

    return (
        <button
            {...props}
            type={type}
            className={`theme-btn-secondary theme-control-button ${className}`.trim()}
        >
            {content}
        </button>
    );
}
