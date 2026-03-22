export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={`theme-btn-primary text-xs uppercase tracking-widest ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
