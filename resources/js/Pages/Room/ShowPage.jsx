import PreferenceControls from '@/Components/PreferenceControls';
import useConnection from '@/hooks/useConnection';
import Expired from '@/Pages/Room/Expired';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const voteOptions = ['1', '2', '3', '5', '8', '13', '21', '?', '☕'];
const numericVoteOptions = new Set(['1', '2', '3', '5', '8', '13', '21']);

function calculateAverage(values) {
    if (values.length === 0) {
        return null;
    }

    const average = values.reduce((sum, value) => sum + value, 0) / values.length;

    return Number.isInteger(average) ? average : average.toFixed(2);
}

function calculateMedian(values) {
    if (values.length === 0) {
        return null;
    }

    const sorted = [...values].sort((left, right) => left - right);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        const median = (sorted[middle - 1] + sorted[middle]) / 2;

        return Number.isInteger(median) ? median : median.toFixed(2);
    }

    return sorted[middle];
}

function StoryActionButton({ isCurrentStory, children, className = '', ...props }) {
    const baseClassName = isCurrentStory
        ? 'border border-theme-border bg-theme-surface text-theme-primary hover:bg-theme-surface/80'
        : 'theme-btn-secondary';

    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition ${baseClassName} ${className}`}
        >
            {children}
        </button>
    );
}

function mergeOnlineUsers(users) {
    return users.reduce((uniqueUsers, user) => {
        if (!uniqueUsers.some((existingUser) => existingUser.id === user.id)) {
            uniqueUsers.push(user);
        }

        return uniqueUsers;
    }, []);
}

export default function ShowPage({
    room,
    participants,
    stories,
    storyResults = [],
    currentStory,
    currentParticipant,
}) {
    const { connected, disconnected, reconnecting, reconnectVersion } = useConnection();
    const csrfToken =
        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [editingStoryId, setEditingStoryId] = useState(null);

    if (!currentParticipant) {
        return <Expired message="Session expired or participant removed" />;
    }

    const sortedStories = [...stories].sort((left, right) => left.order - right.order);
    const isRevealed = currentStory?.status === 'revealed';
    const isVoting = currentStory?.status === 'voting';
    const canVote = Boolean(currentStory) && isVoting && connected;
    const onlineUserIds = new Set(onlineUsers.map((user) => user.id));
    const addStoryForm = useForm({
        title: '',
        description: '',
    });
    const editStoryForm = useForm({
        title: '',
        description: '',
    });
    const currentVote = currentStory?.votes?.find(
        (vote) => vote.participant_id === currentParticipant.id,
    );
    const votedParticipantIds = new Set(
        (currentStory?.votes ?? []).map((vote) => vote.participant_id),
    );
    const revealedResults = participants.map((participant) => {
        const vote = currentStory?.votes?.find(
            (storyVote) => storyVote.participant_id === participant.id,
        );

        return {
            id: participant.id,
            nickname: participant.nickname,
            point: vote?.point ?? '-',
        };
    });
    const numericVotes = (currentStory?.votes ?? [])
        .map((vote) => vote.point)
        .filter((point) => numericVoteOptions.has(point))
        .map((point) => Number(point));
    const average = calculateAverage(numericVotes);
    const median = calculateMedian(numericVotes);

    const submitVote = (point) => {
        if (!canVote) {
            return;
        }

        router.post(`/stories/${currentStory.id}/vote`, { point }, {
            preserveScroll: true,
        });
    };

    const revealStory = (story = currentStory) => {
        if (story?.status === 'voting') {
            router.post(`/rooms/${room.code}/stories/${story.id}/reveal`, {}, {
                preserveScroll: true,
            });
        }
    };

    const resetStory = (story = currentStory) => {
        if (story?.status === 'revealed') {
            router.post(`/rooms/${room.code}/stories/${story.id}/reset`, {}, {
                preserveScroll: true,
            });
        }
    };

    const createStory = (event) => {
        event.preventDefault();

        addStoryForm.post(`/rooms/${room.code}/stories`, {
            preserveScroll: true,
            onSuccess: () => addStoryForm.reset(),
        });
    };

    const beginEditStory = (story) => {
        setEditingStoryId(story.id);
        editStoryForm.setData({
            title: story.title,
            description: story.description ?? '',
        });
        editStoryForm.clearErrors();
    };

    const cancelEditStory = () => {
        setEditingStoryId(null);
        editStoryForm.reset();
        editStoryForm.clearErrors();
    };

    const updateStory = (event, storyId) => {
        event.preventDefault();

        editStoryForm.put(`/rooms/${room.code}/stories/${storyId}`, {
            preserveScroll: true,
            onSuccess: () => cancelEditStory(),
        });
    };

    const startStory = (storyId) => {
        router.post(`/rooms/${room.code}/stories/${storyId}/start`, {}, {
            preserveScroll: true,
        });
    };

    const deleteStory = (storyId) => {
        if (editingStoryId === storyId) {
            cancelEditStory();
        }

        router.delete(`/rooms/${room.code}/stories/${storyId}`, {
            preserveScroll: true,
        });
    };

    const leaveRoom = () => {
        router.post(`/rooms/${room.code}/leave`);
    };

    useEffect(() => {
        if (!window.Echo) {
            return undefined;
        }

        const channelName = `room.${room.code}`;
        const channel = window.Echo.join(channelName);
        const reloadRoom = () => {
            router.reload({
                only: ['participants', 'stories', 'storyResults', 'currentStory', 'currentParticipant'],
                preserveScroll: true,
            });
        };

        channel.stopListening('.VoteUpdated');
        channel.stopListening('.StoryStateChanged');
        channel
            .here((users) => {
                setOnlineUsers(mergeOnlineUsers(users));
            })
            .joining((user) => {
                setOnlineUsers((currentUsers) =>
                    mergeOnlineUsers([...currentUsers, user]),
                );
            })
            .leaving((user) => {
                setOnlineUsers((currentUsers) =>
                    currentUsers.filter((currentUser) => currentUser.id !== user.id),
                );
            })
            .listen('.StoryStateChanged', reloadRoom)
            .listen('.VoteUpdated', reloadRoom);

        return () => {
            channel.stopListening('.VoteUpdated');
            channel.stopListening('.StoryStateChanged');
            setOnlineUsers([]);
            window.Echo.leave(channelName);
        };
    }, [room.code, reconnectVersion]);

    useEffect(() => {
        if (reconnectVersion === 0) {
            return;
        }

        router.reload({
            only: ['participants', 'stories', 'storyResults', 'currentStory', 'currentParticipant'],
            preserveScroll: true,
        });
    }, [reconnectVersion]);

    useEffect(() => {
        const handler = () => {
            const data = new FormData();
            data.append('_token', csrfToken);

            navigator.sendBeacon(`/rooms/${room.code}/leave`, data);
        };

        window.addEventListener('beforeunload', handler);

        return () => {
            window.removeEventListener('beforeunload', handler);
        };
    }, [csrfToken, room.code]);

    return (
        <>
            <Head title={`Room ${room.name}`}>
                <meta
                    name="description"
                    content={`Planning session for ${room.name} (${room.code}).`}
                />
                <meta
                    property="og:title"
                    content={`Room ${room.name}`}
                />
                <meta
                    property="og:description"
                    content={`Planning session for ${room.name} (${room.code}).`}
                />
            </Head>

            <div className="theme-page px-6 py-10">
                <a href="#main-content" className="skip-link">
                    Skip to content
                </a>

                <div className="mx-auto flex max-w-6xl flex-col gap-6">
                    {(disconnected || reconnecting) && (
                        <section
                            className="theme-card border-theme-danger/30 bg-theme-danger/10 px-4 py-3 text-sm text-theme-danger"
                            aria-live="polite"
                        >
                            Reconnecting...
                        </section>
                    )}

                    <header className="theme-card p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <p className="theme-pill">Room code</p>
                                <h1 className="theme-heading mt-4 text-3xl font-bold">
                                    {room.name}
                                </h1>
                                <p className="mt-2 text-lg font-semibold tracking-[0.3em] text-theme-secondary">
                                    {room.code}
                                </p>
                            </div>

                            <div className="flex flex-col items-start gap-3 lg:items-end">
                                <PreferenceControls as="nav" aria-label="Primary navigation" />

                                <div className="theme-card-muted rounded-xl px-4 py-3 text-sm">
                                    <div>
                                        You are{' '}
                                        <span className="font-semibold text-theme-primary">
                                            {currentParticipant.nickname}
                                        </span>
                                    </div>
                                    <div className="theme-subtle mt-1">
                                        Role: {currentParticipant.is_host ? 'Host' : 'Participant'}
                                    </div>
                                </div>

                                <button
                                    className="theme-btn-secondary"
                                    onClick={leaveRoom}
                                    type="button"
                                >
                                    Leave Room
                                </button>

                                {currentParticipant.is_host ? (
                                    <a
                                        className="theme-btn-secondary"
                                        href={`/rooms/${room.code}/export`}
                                    >
                                        Export CSV
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    </header>

                    <main id="main-content" className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
                        <section className="theme-card p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="theme-heading text-lg font-semibold">Stories</h2>
                                <span className="theme-pill">{sortedStories.length}</span>
                            </div>

                            {currentParticipant.is_host ? (
                                <form className="mt-4 space-y-3" onSubmit={createStory}>
                                    <label className="theme-label" htmlFor="story-title">
                                        Story title
                                    </label>
                                    <input
                                        id="story-title"
                                        className="theme-input"
                                        aria-describedby="story-title-help"
                                        placeholder="Add a story title"
                                        value={addStoryForm.data.title}
                                        onChange={(event) =>
                                            addStoryForm.setData('title', event.target.value)
                                        }
                                    />
                                    <p id="story-title-help" className="theme-subtle text-sm">
                                        Add the next story the team should estimate.
                                    </p>
                                    <label className="theme-label" htmlFor="story-description">
                                        Description
                                    </label>
                                    <textarea
                                        id="story-description"
                                        className="theme-input min-h-24 resize-y"
                                        placeholder="Optional story details"
                                        value={addStoryForm.data.description}
                                        onChange={(event) =>
                                            addStoryForm.setData('description', event.target.value)
                                        }
                                    />
                                    <button className="theme-btn-primary w-full" type="submit">
                                        Add Story
                                    </button>
                                </form>
                            ) : null}

                            <div className="mt-4 space-y-3">
                                {sortedStories.length === 0 ? (
                                    <div className="theme-card-muted rounded-xl border-dashed px-4 py-6 text-center text-sm text-theme-secondary">
                                        No stories yet.
                                    </div>
                                ) : null}

                                {sortedStories.map((story) => {
                                    const isCurrentStory = currentStory?.id === story.id;
                                    const canManageStory =
                                        currentParticipant.is_host && story.status !== 'revealed';
                                    const isEditing = editingStoryId === story.id;

                                    return (
                                        <div
                                            key={story.id}
                                            className={`rounded-xl border px-4 py-4 text-sm transition ${
                                                isCurrentStory
                                                    ? 'border-theme-accent bg-theme-accent/10 text-theme-primary'
                                                    : 'border-theme-border bg-theme-bg/50 text-theme-primary'
                                            }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <div className="font-semibold">{story.title}</div>
                                                        <div className="mt-1 text-xs uppercase tracking-wide text-theme-secondary">
                                                            {story.status}
                                                        </div>
                                                    </div>

                                                <span className="theme-pill">#{story.order}</span>
                                            </div>

                                            {story.description ? (
                                                <p className="theme-subtle mt-3 text-sm">
                                                    {story.description}
                                                </p>
                                            ) : null}

                                            {canManageStory ? (
                                                <>
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {story.status === 'pending' ? (
                                                            <StoryActionButton
                                                                isCurrentStory={isCurrentStory}
                                                                onClick={() => startStory(story.id)}
                                                                type="button"
                                                            >
                                                                Start Voting
                                                            </StoryActionButton>
                                                        ) : null}
                                                        {story.status === 'voting' ? (
                                                            <StoryActionButton
                                                                isCurrentStory={isCurrentStory}
                                                                onClick={() => revealStory(story)}
                                                                type="button"
                                                            >
                                                                Reveal
                                                            </StoryActionButton>
                                                        ) : null}
                                                        {story.status === 'revealed' ? (
                                                            <StoryActionButton
                                                                isCurrentStory={isCurrentStory}
                                                                onClick={() => resetStory(story)}
                                                                type="button"
                                                            >
                                                                Reset
                                                            </StoryActionButton>
                                                        ) : null}
                                                        <StoryActionButton
                                                            isCurrentStory={isCurrentStory}
                                                            onClick={() => beginEditStory(story)}
                                                            type="button"
                                                        >
                                                            Edit
                                                        </StoryActionButton>
                                                        <button
                                                            className="theme-btn-danger rounded-lg px-3 py-2 text-xs"
                                                            onClick={() => deleteStory(story.id)}
                                                            type="button"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>

                                                    {isEditing ? (
                                                        <form
                                                            className="mt-4 space-y-3"
                                                            onSubmit={(event) => updateStory(event, story.id)}
                                                        >
                                                            <div>
                                                                <label
                                                                    className="theme-label"
                                                                    htmlFor={`edit-story-title-${story.id}`}
                                                                >
                                                                    Title
                                                                </label>
                                                                <input
                                                                    id={`edit-story-title-${story.id}`}
                                                                    className="theme-input mt-2"
                                                                    value={editStoryForm.data.title}
                                                                    onChange={(event) =>
                                                                        editStoryForm.setData(
                                                                            'title',
                                                                            event.target.value,
                                                                        )
                                                                    }
                                                                />
                                                            </div>

                                                            <div>
                                                                <label
                                                                    className="theme-label"
                                                                    htmlFor={`edit-story-description-${story.id}`}
                                                                >
                                                                    Description
                                                                </label>
                                                                <textarea
                                                                    id={`edit-story-description-${story.id}`}
                                                                    className="theme-input mt-2 min-h-24 resize-y"
                                                                    value={editStoryForm.data.description}
                                                                    onChange={(event) =>
                                                                        editStoryForm.setData(
                                                                            'description',
                                                                            event.target.value,
                                                                        )
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="flex flex-wrap gap-2">
                                                                <button
                                                                    className="theme-btn-primary"
                                                                    type="submit"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    className="theme-btn-secondary"
                                                                    onClick={cancelEditStory}
                                                                    type="button"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </form>
                                                    ) : null}
                                                </>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <div className="flex flex-col gap-6">
                            <section className="theme-card p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="theme-heading text-lg font-semibold">
                                        Participants
                                    </h2>
                                    <span className="theme-pill">{participants.length}</span>
                                </div>

                                <p className="sr-only" aria-live="polite">
                                    {onlineUsers.length} participants online. Voting updates appear automatically.
                                </p>

                                <ul className="mt-4 grid gap-3 md:grid-cols-2">
                                    {participants.map((participant) => {
                                        const isCurrent =
                                            participant.id === currentParticipant.id;
                                        const hasVoted = votedParticipantIds.has(participant.id);
                                        const isOnline = onlineUserIds.has(participant.id);

                                        return (
                                            <li
                                                key={participant.id}
                                                className={`rounded-xl border px-4 py-3 text-sm transition ${
                                                    isCurrent
                                                        ? 'border-theme-accent bg-theme-accent/10 text-theme-primary'
                                                        : 'border-theme-border bg-theme-bg/50 text-theme-primary'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className={`inline-block h-2.5 w-2.5 rounded-full ${
                                                                isOnline
                                                                    ? 'bg-theme-success'
                                                                    : 'bg-theme-border'
                                                            }`}
                                                        />
                                                        <span className="font-medium">
                                                            {participant.nickname}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={
                                                                isOnline
                                                                    ? 'theme-badge-success'
                                                                    : 'theme-pill'
                                                            }
                                                        >
                                                            {isOnline ? 'Online' : 'Offline'}
                                                        </span>
                                                        {hasVoted ? (
                                                            <span className="theme-badge-success">
                                                                Voted
                                                            </span>
                                                        ) : null}
                                                        {participant.is_host ? (
                                                            <span className="theme-badge-accent">
                                                                Host
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>

                            <section className="theme-card p-6">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="theme-heading text-lg font-semibold">Story</h2>

                                    {currentParticipant.is_host ? (
                                        <div className="flex items-center gap-2">
                                            {currentStory && isVoting ? (
                                                <button
                                                    className="theme-btn-primary"
                                                    onClick={revealStory}
                                                    type="button"
                                                >
                                                    Reveal
                                                </button>
                                            ) : null}
                                            {currentStory && currentStory.status === 'pending' ? (
                                                <button
                                                    className="theme-btn-secondary"
                                                    onClick={() => startStory(currentStory.id)}
                                                    type="button"
                                                >
                                                    Start Voting
                                                </button>
                                            ) : null}
                                            {currentStory && isRevealed ? (
                                                <button
                                                    className="theme-btn-secondary"
                                                    onClick={resetStory}
                                                    type="button"
                                                >
                                                    Reset
                                                </button>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </div>

                                {!currentStory ? (
                                    <div className="theme-card-muted mt-6 rounded-xl border-dashed px-5 py-10 text-center text-theme-secondary">
                                        No story yet
                                    </div>
                                ) : (
                                    <div className="theme-card-muted mt-6 p-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <h3 className="theme-heading text-xl font-semibold">
                                                {currentStory.title}
                                            </h3>
                                            <span className="theme-pill">
                                                {currentStory.status}
                                            </span>
                                        </div>

                                        <p className="theme-subtle mt-3 text-sm leading-6">
                                            {currentStory.description || 'No description provided.'}
                                        </p>
                                    </div>
                                )}
                            </section>

                            <section className="theme-card p-6">
                                <h2 className="theme-heading text-lg font-semibold">Vote</h2>
                                <p className="theme-subtle mt-2 text-sm" aria-live="polite">
                                    {!connected
                                        ? 'Voting is temporarily unavailable while the connection recovers.'
                                        : isVoting
                                        ? 'Pick a card to submit or update your vote.'
                                        : 'Voting is closed until the host resets the story.'}
                                </p>

                                <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
                                    {voteOptions.map((option) => {
                                        const isSelected = currentVote?.point === option;

                                        return (
                                            <button
                                                key={option}
                                                className={`aspect-[4/5] rounded-2xl border text-xl font-bold transition ${
                                                    !canVote
                                                        ? 'cursor-not-allowed border-theme-border bg-theme-bg/50 text-theme-secondary'
                                                        : isSelected
                                                          ? 'border-theme-accent bg-theme-accent text-theme-contrast shadow-lg'
                                                          : 'border-theme-border bg-theme-surface text-theme-primary hover:border-theme-accent hover:bg-theme-accent/10'
                                                }`}
                                                disabled={!canVote}
                                                onClick={() => submitVote(option)}
                                                type="button"
                                                aria-pressed={isSelected}
                                            >
                                                {option}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="theme-subtle mt-4 text-sm">
                                    Selected vote:{' '}
                                    <span className="font-semibold text-theme-primary">
                                        {currentVote?.point ?? 'None'}
                                    </span>
                                </div>
                            </section>

                            <section className="theme-card p-6">
                                <h2 className="theme-heading text-lg font-semibold">Results</h2>

                                {!currentStory ? (
                                    <p className="theme-subtle mt-4 text-sm">No active story.</p>
                                ) : !isRevealed ? (
                                    <div className="mt-4 space-y-3">
                                        {participants.map((participant) => {
                                            const vote = currentStory.votes?.find(
                                                (storyVote) =>
                                                    storyVote.participant_id === participant.id,
                                            );
                                            const isCurrent =
                                                participant.id === currentParticipant.id;

                                            return (
                                                <div
                                                    key={participant.id}
                                                    className="theme-card-muted flex items-center justify-between rounded-xl px-4 py-3 text-sm"
                                                >
                                                    <span className="font-medium text-theme-primary">
                                                        {participant.nickname}
                                                    </span>
                                                    <span className="font-semibold text-theme-secondary">
                                                        {isCurrent
                                                            ? currentVote?.point ?? 'Not voted'
                                                            : vote
                                                              ? 'Voted'
                                                              : 'Waiting'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <>
                                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                            <div className="theme-card-muted px-4 py-4">
                                                <div className="theme-subtle text-sm">Average</div>
                                                <div className="theme-heading mt-1 text-2xl font-bold">
                                                    {average ?? '-'}
                                                </div>
                                            </div>
                                            <div className="theme-card-muted px-4 py-4">
                                                <div className="theme-subtle text-sm">Median</div>
                                                <div className="theme-heading mt-1 text-2xl font-bold">
                                                    {median ?? '-'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-3">
                                            {revealedResults.map((result) => (
                                                <div
                                                    key={result.id}
                                                    className="theme-card-muted flex items-center justify-between rounded-xl px-4 py-3 text-sm"
                                                >
                                                    <span className="font-medium text-theme-primary">
                                                        {result.nickname}
                                                    </span>
                                                    <span className="theme-pill rounded-lg">
                                                        {result.point}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </section>

                            <section className="theme-card p-6">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="theme-heading text-lg font-semibold">
                                        History
                                    </h2>
                                    <span className="theme-pill">{storyResults.length}</span>
                                </div>

                                {storyResults.length === 0 ? (
                                    <p className="theme-subtle mt-4 text-sm">
                                        No revealed story snapshots yet.
                                    </p>
                                ) : (
                                    <div className="mt-4 space-y-3">
                                        {storyResults.map((storyResult) => (
                                            <div
                                                key={storyResult.id}
                                                className="theme-card-muted rounded-xl px-4 py-4 text-sm"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="font-semibold text-theme-primary">
                                                        {storyResult.title}
                                                    </div>
                                                    <span className="theme-pill">
                                                        {new Date(storyResult.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                                    <div>
                                                        <div className="theme-subtle text-xs uppercase tracking-wide">
                                                            Average
                                                        </div>
                                                        <div className="mt-1 font-semibold text-theme-primary">
                                                            {storyResult.average ?? '-'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="theme-subtle text-xs uppercase tracking-wide">
                                                            Median
                                                        </div>
                                                        <div className="mt-1 font-semibold text-theme-primary">
                                                            {storyResult.median ?? '-'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
