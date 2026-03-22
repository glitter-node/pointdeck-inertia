export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={`theme-label ${className}`}
        >
            {value ? value : children}
        </label>
    );
}
