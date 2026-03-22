export default function ControlGroup({
    as: Component = 'div',
    className = '',
    label = 'Interface controls',
    children,
    ...props
}) {
    return (
        <Component
            {...props}
            className={`theme-control-group ${className}`.trim()}
            role="group"
            aria-label={label}
        >
            {children}
        </Component>
    );
}
