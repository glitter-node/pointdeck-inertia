export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={`theme-btn-secondary text-xs uppercase tracking-widest ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
