import AccessibilityToggle from '@/Components/AccessibilityToggle';
import FontToggle from '@/Components/FontToggle';
import ThemeToggle from '@/Components/ThemeToggle';
import { Head, Link } from '@inertiajs/react';

function FeatureCard({ title, description }) {
    return (
        <article className="theme-card p-6">
            <h3 className="theme-heading text-lg font-semibold">{title}</h3>
            <p className="theme-subtle mt-3 text-sm leading-6">{description}</p>
        </article>
    );
}

export default function Landing() {
    return (
        <>
            <Head title="Sprint Planning Poker">
                <meta
                    name="description"
                    content="Real-time estimation for agile teams with instant room creation, voting, reveal, and reset workflows."
                />
                <meta
                    property="og:title"
                    content="Sprint Planning Poker"
                />
                <meta
                    property="og:description"
                    content="Real-time estimation for agile teams."
                />
            </Head>

            <div className="theme-page px-6 py-12">
                <a href="#main-content" className="skip-link">
                    Skip to content
                </a>

                <div className="mx-auto flex max-w-6xl flex-col gap-8">
                    <header className="flex flex-col gap-8">
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

                            <div className="flex flex-wrap gap-3">
                                <AccessibilityToggle />
                                <FontToggle />
                                <ThemeToggle />
                            </div>
                        </nav>

                        <section className="theme-card p-8 md:p-12">
                            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
                                <div className="transition-opacity duration-300">
                                    <p className="theme-badge-accent">Sprint Planning Poker</p>
                                    <h1 className="theme-heading mt-5 text-4xl font-bold tracking-tight md:text-5xl">
                                        Sprint Planning Poker
                                    </h1>
                                    <p className="theme-subtle mt-4 max-w-2xl text-base leading-7 md:text-lg">
                                        Real-time estimation for agile teams. Create a room in
                                        seconds, vote together, reveal results, and keep the flow
                                        moving without logins or extra setup.
                                    </p>

                                    <div className="mt-8 flex flex-wrap gap-3">
                                        <Link href="/home" className="theme-btn-primary">
                                            Create Room
                                        </Link>
                                        <Link href="/home" className="theme-btn-secondary">
                                            Join Room
                                        </Link>
                                    </div>
                                </div>

                                <aside className="theme-card-muted p-6">
                                    <h2 className="theme-heading text-lg font-semibold">
                                        Built for fast estimation
                                    </h2>
                                    <ul className="mt-4 space-y-3 text-sm">
                                        <li className="theme-subtle">Real-time room updates</li>
                                        <li className="theme-subtle">Session-based entry</li>
                                        <li className="theme-subtle">Host-controlled reveal flow</li>
                                        <li className="theme-subtle">Exportable result history</li>
                                    </ul>
                                </aside>
                            </div>
                        </section>
                    </header>

                    <main id="main-content" className="flex flex-col gap-8">
                        <section aria-labelledby="features-heading">
                            <div className="mb-4">
                                <h2
                                    id="features-heading"
                                    className="theme-heading text-2xl font-semibold"
                                >
                                    Features
                                </h2>
                                <p className="theme-subtle mt-2 max-w-2xl text-sm">
                                    Everything needed for a lightweight planning poker workflow,
                                    without introducing account management or extra coordination
                                    overhead.
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <FeatureCard
                                    title="Real-time voting"
                                    description="Votes, story state changes, and participant presence update through WebSocket broadcasts."
                                />
                                <FeatureCard
                                    title="No login required"
                                    description="Participants join with a nickname and a room code, which keeps onboarding friction low."
                                />
                                <FeatureCard
                                    title="Instant room creation"
                                    description="Hosts can spin up a room immediately and share a generated code with the team."
                                />
                                <FeatureCard
                                    title="Reveal and reset workflow"
                                    description="Hosts control the estimation lifecycle from pending to voting, reveal, reset, and export."
                                />
                            </div>
                        </section>

                        <section aria-labelledby="how-it-works-heading" className="theme-card p-8">
                            <h2
                                id="how-it-works-heading"
                                className="theme-heading text-2xl font-semibold"
                            >
                                How it works
                            </h2>

                            <ol className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <li className="theme-card-muted p-5">
                                    <p className="theme-pill">Step 1</p>
                                    <h3 className="theme-heading mt-4 text-lg font-semibold">
                                        Create or join a room
                                    </h3>
                                    <p className="theme-subtle mt-3 text-sm leading-6">
                                        Hosts create a room and participants join with a shared
                                        room code and nickname.
                                    </p>
                                </li>
                                <li className="theme-card-muted p-5">
                                    <p className="theme-pill">Step 2</p>
                                    <h3 className="theme-heading mt-4 text-lg font-semibold">
                                        Add stories
                                    </h3>
                                    <p className="theme-subtle mt-3 text-sm leading-6">
                                        The host adds estimation items and decides which one is
                                        active for voting.
                                    </p>
                                </li>
                                <li className="theme-card-muted p-5">
                                    <p className="theme-pill">Step 3</p>
                                    <h3 className="theme-heading mt-4 text-lg font-semibold">
                                        Vote
                                    </h3>
                                    <p className="theme-subtle mt-3 text-sm leading-6">
                                        Participants submit points while votes remain hidden until
                                        the host reveals them.
                                    </p>
                                </li>
                                <li className="theme-card-muted p-5">
                                    <p className="theme-pill">Step 4</p>
                                    <h3 className="theme-heading mt-4 text-lg font-semibold">
                                        Reveal results
                                    </h3>
                                    <p className="theme-subtle mt-3 text-sm leading-6">
                                        The host reveals results, reviews average and median, then
                                        resets or exports history.
                                    </p>
                                </li>
                            </ol>
                        </section>

                        <section className="theme-card p-8 text-center">
                            <p className="theme-badge-accent">Start Planning Now</p>
                            <h2 className="theme-heading mt-4 text-3xl font-bold">
                                Ready to estimate with your team?
                            </h2>
                            <p className="theme-subtle mx-auto mt-4 max-w-2xl text-base leading-7">
                                Jump straight into the room workflow and start a planning session
                                without accounts, setup, or polling.
                            </p>

                            <div className="mt-8 flex justify-center">
                                <Link href="/home" className="theme-btn-primary">
                                    Start Planning Now
                                </Link>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
