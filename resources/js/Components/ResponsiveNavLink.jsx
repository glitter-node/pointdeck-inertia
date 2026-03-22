import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-theme-accent bg-theme-accent/10 text-theme-accent focus:border-theme-accent focus:bg-theme-accent/15 focus:text-theme-accent'
                    : 'border-transparent text-theme-secondary hover:border-theme-border hover:bg-theme-border/10 hover:text-theme-primary focus:border-theme-border focus:bg-theme-border/10 focus:text-theme-primary'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
