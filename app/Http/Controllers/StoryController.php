<?php

namespace App\Http\Controllers;

use App\Events\StoryStateChanged;
use App\Events\VoteUpdated;
use App\Models\Participant;
use App\Models\Room;
use App\Models\Story;
use App\Models\StoryResult;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StoryController extends Controller
{
    public function store(Request $request, string $code): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $room = Room::query()->where('code', $code)->firstOrFail();
        $participant = $this->resolveParticipantForRoom($request, $room);

        abort_unless($participant?->is_host, 403);

        $story = $room->stories()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'status' => 'pending',
            'order' => ((int) $room->stories()->max('order')) + 1,
        ]);

        event(new VoteUpdated($room->code, $story->id));

        return redirect()->back();
    }

    public function update(Request $request, string $code, Story $story): RedirectResponse
    {
        $room = Room::query()->where('code', $code)->firstOrFail();
        abort_if($story->room_id !== $room->id, 404);

        $participant = $this->resolveParticipantForRoom($request, $room);

        abort_unless($participant?->is_host, 403);
        abort_if($story->status === 'revealed', 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $story->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        event(new VoteUpdated($room->code, $story->id));

        return redirect()->back();
    }

    public function destroy(Request $request, string $code, Story $story): RedirectResponse
    {
        $room = Room::query()->where('code', $code)->firstOrFail();
        abort_if($story->room_id !== $room->id, 404);

        $participant = $this->resolveParticipantForRoom($request, $room);

        abort_unless($participant?->is_host, 403);
        abort_if($story->status === 'revealed', 403);

        $storyId = $story->id;

        $story->delete();
        $this->reorderStories($room);

        event(new VoteUpdated($room->code, $storyId));

        return redirect()->back();
    }

    public function startVoting(Request $request, string $code, Story $story): RedirectResponse
    {
        $room = Room::query()->where('code', $code)->firstOrFail();
        abort_if($story->room_id !== $room->id, 404);

        $participant = $this->resolveParticipantForRoom($request, $room);

        abort_unless($participant?->is_host, 403);
        abort_if($story->status === 'revealed', 403);

        $room->stories()->update(['status' => 'pending']);

        $story->votes()->delete();
        $story->update([
            'status' => 'voting',
        ]);

        event(new StoryStateChanged($room->code, $story->id));
        event(new VoteUpdated($room->code, $story->id));

        return redirect()->back();
    }

    public function reveal(Request $request, string $code, Story $story): RedirectResponse
    {
        $room = Room::query()->where('code', $code)->firstOrFail();
        abort_if($story->room_id !== $room->id, 404);

        $participant = $this->resolveParticipantForRoom($request, $room);

        abort_unless($participant?->is_host, 403);
        abort_if($story->status !== 'voting', 403);
        if (! $story->votes()->exists()) {
            return redirect()->back()->withErrors([
                'story' => 'At least one vote is required before reveal.',
            ]);
        }

        $story->update([
            'status' => 'revealed',
        ]);

        $votes = $story->votes()->get();
        $numericValues = $votes
            ->pluck('point')
            ->filter(fn ($point) => in_array($point, ['1', '2', '3', '5', '8', '13', '21'], true))
            ->map(fn ($point) => (int) $point)
            ->sort()
            ->values();

        $average = null;
        $median = null;

        if ($numericValues->isNotEmpty()) {
            $average = round($numericValues->avg(), 2);

            $middle = intdiv($numericValues->count(), 2);
            $median = $numericValues->count() % 2 === 0
                ? ($numericValues[$middle - 1] + $numericValues[$middle]) / 2
                : $numericValues[$middle];
        }

        $storyResult = StoryResult::query()->create([
            'story_id' => $story->id,
            'room_id' => $room->id,
            'title' => $story->title,
            'average' => $average,
            'median' => $median,
            'created_at' => now(),
        ]);

        $storyResult->votes()->createMany(
            $votes->map(fn ($vote) => [
                'participant_name' => $vote->participant->nickname,
                'point' => $vote->point,
            ])->all(),
        );

        event(new StoryStateChanged($room->code, $story->id));
        event(new VoteUpdated($room->code, $story->id));

        return redirect()->back()
            ->with('result', [
                'story_id' => $story->id,
                'average' => $average,
                'median' => $median,
            ]);
    }

    public function reset(Request $request, string $code, Story $story): RedirectResponse
    {
        $room = Room::query()->where('code', $code)->firstOrFail();
        abort_if($story->room_id !== $room->id, 404);

        $participant = $this->resolveParticipantForRoom($request, $room);

        abort_unless($participant?->is_host, 403);

        $room->stories()
            ->whereKeyNot($story->id)
            ->where('status', 'voting')
            ->update(['status' => 'pending']);

        $story->votes()->delete();
        $story->update([
            'status' => 'voting',
        ]);

        event(new StoryStateChanged($room->code, $story->id));
        event(new VoteUpdated($room->code, $story->id));

        return redirect()->back();
    }

    private function resolveParticipantForRoom(Request $request, Room $room): ?Participant
    {
        $participantId = $request->session()->get('participant_id');
        $participant = Participant::query()->find($participantId);

        if (! $participant || $participant->room_id !== $room->id) {
            return null;
        }

        return $participant;
    }

    private function reorderStories(Room $room): void
    {
        $room->stories()
            ->orderBy('order')
            ->get()
            ->values()
            ->each(function (Story $story, int $index) {
                $story->update([
                    'order' => $index + 1,
                ]);
            });
    }
}
