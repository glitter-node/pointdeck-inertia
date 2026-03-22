import AccessibilityToggle from '@/Components/AccessibilityToggle';
import ApplicationLogo from '@/Components/ApplicationLogo';
import FontToggle from '@/Components/FontToggle';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="theme-page flex min-h-screen flex-col items-center px-6 pt-6 sm:justify-center sm:pt-0">
            <a href="#main-content" className="skip-link">
                Skip to content
            </a>

            <header className="mb-6 flex w-full max-w-md flex-wrap justify-end gap-3">
                <nav aria-label="Primary navigation" className="flex w-full flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                        <Link href="/" className="theme-btn-secondary">
                            Landing
                        </Link>
                        <Link href="/home" className="theme-btn-secondary">
                            Home
                        </Link>
                    </div>

                    <div className="flex flex-wrap justify-end gap-3">
                        <AccessibilityToggle />
                        <FontToggle />
                        <ThemeToggle />
                    </div>
                </nav>
            </header>

            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-theme-accent" />
                </Link>
            </div>

            <main
                id="main-content"
                className="theme-card mt-6 w-full overflow-hidden px-6 py-4 sm:max-w-md"
            >
                {children}
            </main>
        </div>
    );
}
