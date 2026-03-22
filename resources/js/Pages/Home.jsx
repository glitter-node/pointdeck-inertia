import PreferenceControls from '@/Components/PreferenceControls';
import { Head, Link, router, useForm } from '@inertiajs/react';

function FieldError({ message, ...props }) {
    if (!message) {
        return null;
    }

    return (
        <p {...props} className="mt-2 text-sm text-theme-danger">
            {message}
        </p>
    );
}

export default function Home() {
    const createRoomForm = useForm({
        name: '',
        nickname: '',
    });

    const joinRoomForm = useForm({
        code: '',
        nickname: '',
    });

    const submitCreateRoom = (event) => {
        event.preventDefault();

        createRoomForm.clearErrors();

        router.post('/rooms', createRoomForm.data, {
            onStart: () => createRoomForm.setProcessing(true),
            onError: (errors) => createRoomForm.setError(errors),
            onFinish: () => createRoomForm.setProcessing(false),
        });
    };

    const submitJoinRoom = (event) => {
        event.preventDefault();

        joinRoomForm.clearErrors();

        router.post(
            `/rooms/${joinRoomForm.data.code}/join`,
            {
                nickname: joinRoomForm.data.nickname,
            },
            {
                onStart: () => joinRoomForm.setProcessing(true),
                onError: (errors) => joinRoomForm.setError(errors),
                onFinish: () => joinRoomForm.setProcessing(false),
            },
        );
    };

    return (
        <>
            <Head title="Planning Poker Home">
                <meta
                    name="description"
                    content="Create or join a real-time planning poker room for your agile team."
                />
                <meta
                    property="og:title"
                    content="Planning Poker Home"
                />
                <meta
                    property="og:description"
                    content="Create or join a real-time planning poker room for your agile team."
                />
            </Head>

            <div className="theme-page px-6 py-12">
                <a href="#main-content" className="skip-link">
                    Skip to content
                </a>

                <header className="mx-auto flex w-full max-w-5xl flex-col gap-10">
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

                        <PreferenceControls />
                    </nav>

                    <div className="mx-auto max-w-2xl text-center">
                        <p className="theme-badge-accent">Sprint Planning Poker</p>
                        <h1 className="theme-heading mt-4 text-4xl font-bold tracking-tight">
                            Create a room or join one already in progress
                        </h1>
                        <p className="theme-subtle mt-3 text-base">
                            The room flow stays session-based. Pick a nickname, start a room,
                            or enter a six-character code to join your team.
                        </p>
                    </div>
                </header>

                <main id="main-content" className="mx-auto mt-10 w-full max-w-5xl">
                    <div className="grid gap-6 md:grid-cols-2">
                        <form className="theme-card p-8" onSubmit={submitCreateRoom}>
                            <h2 className="theme-heading text-xl font-semibold">
                                Create Room
                            </h2>
                            <p className="theme-subtle mt-2 text-sm" id="create-room-help">
                                Start a new estimation session and become the host.
                            </p>

                            <div className="mt-6 space-y-5">
                                <div>
                                    <label className="theme-label" htmlFor="create-name">
                                        Room name
                                    </label>
                                    <input
                                        id="create-name"
                                        className="theme-input mt-2"
                                        aria-describedby="create-room-name-help create-room-name-error"
                                        placeholder="Sprint planning"
                                        value={createRoomForm.data.name}
                                        onChange={(event) =>
                                            createRoomForm.setData('name', event.target.value)
                                        }
                                    />
                                    <p
                                        id="create-room-name-help"
                                        className="theme-subtle mt-2 text-sm"
                                    >
                                        Name your planning session so participants can recognize it.
                                    </p>
                                    <FieldError
                                        message={createRoomForm.errors.name}
                                        id="create-room-name-error"
                                    />
                                </div>

                                <div>
                                    <label className="theme-label" htmlFor="create-nickname">
                                        Your nickname
                                    </label>
                                    <input
                                        id="create-nickname"
                                        className="theme-input mt-2"
                                        aria-describedby="create-room-nickname-help create-room-nickname-error"
                                        placeholder="Alice"
                                        value={createRoomForm.data.nickname}
                                        onChange={(event) =>
                                            createRoomForm.setData('nickname', event.target.value)
                                        }
                                    />
                                    <p
                                        id="create-room-nickname-help"
                                        className="theme-subtle mt-2 text-sm"
                                    >
                                        This nickname identifies you in the room.
                                    </p>
                                    <FieldError
                                        message={createRoomForm.errors.nickname}
                                        id="create-room-nickname-error"
                                    />
                                </div>
                            </div>

                            <button
                                className="theme-btn-primary mt-6 w-full"
                                disabled={createRoomForm.processing}
                                type="submit"
                            >
                                Create room
                            </button>
                        </form>

                        <form className="theme-card p-8" onSubmit={submitJoinRoom}>
                            <h2 className="theme-heading text-xl font-semibold">
                                Join Room
                            </h2>
                            <p className="theme-subtle mt-2 text-sm" id="join-room-help">
                                Enter a room code and join as a participant.
                            </p>

                            <div className="mt-6 space-y-5">
                                <div>
                                    <label className="theme-label" htmlFor="join-code">
                                        Room code
                                    </label>
                                    <input
                                        id="join-code"
                                        className="theme-input mt-2 uppercase tracking-[0.3em]"
                                        aria-describedby="join-room-code-help"
                                        maxLength={6}
                                        placeholder="ABC123"
                                        value={joinRoomForm.data.code}
                                        onChange={(event) =>
                                            joinRoomForm.setData(
                                                'code',
                                                event.target.value.toUpperCase(),
                                            )
                                        }
                                    />
                                    <p
                                        id="join-room-code-help"
                                        className="theme-subtle mt-2 text-sm"
                                    >
                                        Use the six-character code shared by the host.
                                    </p>
                                </div>

                                <div>
                                    <label className="theme-label" htmlFor="join-nickname">
                                        Your nickname
                                    </label>
                                    <input
                                        id="join-nickname"
                                        className="theme-input mt-2"
                                        aria-describedby="join-room-nickname-help join-room-nickname-error"
                                        placeholder="Bob"
                                        value={joinRoomForm.data.nickname}
                                        onChange={(event) =>
                                            joinRoomForm.setData('nickname', event.target.value)
                                        }
                                    />
                                    <p
                                        id="join-room-nickname-help"
                                        className="theme-subtle mt-2 text-sm"
                                    >
                                        Choose the name other participants will see.
                                    </p>
                                    <FieldError
                                        message={joinRoomForm.errors.nickname}
                                        id="join-room-nickname-error"
                                    />
                                </div>
                            </div>

                            <button
                                className="theme-btn-primary mt-6 w-full"
                                disabled={joinRoomForm.processing}
                                type="submit"
                            >
                                Join room
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}
