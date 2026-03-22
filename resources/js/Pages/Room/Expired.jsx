import AccessibilityToggle from '@/Components/AccessibilityToggle';
import FontToggle from '@/Components/FontToggle';
import ThemeToggle from '@/Components/ThemeToggle';
import { Head, Link, router } from '@inertiajs/react';

export default function Expired({
    message = 'Session expired or participant removed',
}) {
    return (
        <>
            <Head title="Session Expired">
                <meta
                    name="description"
                    content="Your planning poker session expired or you were removed from the room."
                />
                <meta
                    property="og:title"
                    content="Session Expired"
                />
                <meta
                    property="og:description"
                    content="Your planning poker session expired or you were removed from the room."
                />
            </Head>

            <div className="theme-page px-6 py-12">
                <a href="#main-content" className="skip-link">
                    Skip to content
                </a>

                <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8">
                    <header>
                        <nav
                            aria-label="Primary navigation"
                            className="flex flex-wrap items-center justify-between gap-4"
                        >
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

                    <main id="main-content" className="theme-card p-8 text-center">
                        <p className="theme-badge-danger">Session expired</p>
                        <h1 className="theme-heading mt-4 text-3xl font-bold">
                            Your session has expired or you were removed from the room
                        </h1>
                        <p className="theme-subtle mt-4 text-base">
                            {message}
                        </p>

                        <div className="mt-8 flex justify-center">
                            <button
                                className="theme-btn-primary"
                                onClick={() => router.visit('/home')}
                                type="button"
                            >
                                Return to Home
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
