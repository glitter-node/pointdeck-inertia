export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={`theme-btn-danger text-xs uppercase tracking-widest ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
