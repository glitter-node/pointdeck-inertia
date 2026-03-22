export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={`theme-checkbox ${className}`}
        />
    );
}
