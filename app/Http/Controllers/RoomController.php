<?php

namespace App\Http\Controllers;

use App\Events\VoteUpdated;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    public function landing(): Response
    {
        return Inertia::render('Landing');
    }

    public function index(): Response
    {
        return Inertia::render('Home');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nickname' => ['required', 'string', 'max:255'],
        ]);

        $room = Room::create([
            'code' => Room::generateUniqueCode(),
            'name' => $validated['name'],
            'created_by' => $validated['nickname'],
            'status' => 'active',
        ]);

        $participant = $room->participants()->create([
            'nickname' => $validated['nickname'],
            'is_host' => true,
            'joined_at' => now(),
        ]);

        $request->session()->put('participant_id', $participant->id);
        $request->session()->put('participant', [
            'id' => $participant->id,
            'nickname' => $participant->nickname,
            'room_code' => $room->code,
        ]);

        return redirect("/rooms/{$room->code}");
    }

    public function join(Request $request, string $code): RedirectResponse
    {
        $validated = $request->validate([
            'nickname' => ['required', 'string', 'max:255'],
        ]);

        $room = Room::query()->where('code', $code)->firstOrFail();

        $duplicateNickname = $room->participants()
            ->where('nickname', $validated['nickname'])
            ->exists();

        if ($duplicateNickname) {
            return back()->withErrors([
                'nickname' => 'This nickname is already taken in the room.',
            ]);
        }

        $participant = $room->participants()->create([
            'nickname' => $validated['nickname'],
            'is_host' => false,
            'joined_at' => now(),
        ]);

        $request->session()->put('participant_id', $participant->id);
        $request->session()->put('participant', [
            'id' => $participant->id,
            'nickname' => $participant->nickname,
            'room_code' => $room->code,
        ]);

        return redirect("/rooms/{$room->code}");
    }

    public function show(Request $request, string $code): Response
    {
        $room = Room::query()
            ->where('code', $code)
            ->with([
                'participants',
                'stories' => fn ($query) => $query->orderBy('order'),
                'stories.votes',
                'storyResults' => fn ($query) => $query->latest('created_at'),
                'storyResults.votes',
            ])
            ->firstOrFail();

        $participantId = $request->session()->get('participant_id');

        $currentParticipant = $room->participants
            ->firstWhere('id', $participantId);

        if (! $currentParticipant) {
            return Inertia::render('Room/Expired', [
                'message' => 'Session expired or participant removed',
            ]);
        }

        $request->session()->put('participant', [
            'id' => $currentParticipant->id,
            'nickname' => $currentParticipant->nickname,
            'room_code' => $room->code,
        ]);

        $currentStory = $room->stories->firstWhere('status', 'voting')
            ?? $room->stories
                ->where('status', 'pending')
                ->sortByDesc('order')
                ->first();

        return Inertia::render('Room/Show', [
            'room' => $room,
            'participants' => $room->participants->values(),
            'stories' => $room->stories->values(),
            'storyResults' => $room->storyResults->values(),
            'currentStory' => $currentStory,
            'currentParticipant' => $currentParticipant,
        ]);
    }

    public function export(Request $request, string $code): StreamedResponse
    {
        $room = Room::query()
            ->where('code', $code)
            ->with([
                'participants',
                'storyResults' => fn ($query) => $query->latest('created_at'),
                'storyResults.votes',
            ])
            ->firstOrFail();

        $participantId = $request->session()->get('participant_id');
        $participant = $room->participants->firstWhere('id', $participantId);

        abort_unless($participant?->is_host, 403);

        return response()->streamDownload(function () use ($room) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, ['Story Title', 'Average', 'Median', 'Participant', 'Vote']);

            foreach ($room->storyResults as $storyResult) {
                foreach ($storyResult->votes as $vote) {
                    fputcsv($handle, [
                        $storyResult->title,
                        $storyResult->average,
                        $storyResult->median,
                        $vote->participant_name,
                        $vote->point,
                    ]);
                }
            }

            fclose($handle);
        }, "room-{$room->code}-results.csv", [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function leave(Request $request, string $code): RedirectResponse
    {
        $participantId = $request->session()->get('participant_id');

        if (! $participantId) {
            return redirect('/');
        }

        $room = Room::query()->where('code', $code)->firstOrFail();
        $participant = $room->participants()
            ->where('id', $participantId)
            ->first();

        if (! $participant) {
            $request->session()->forget(['participant', 'participant_id']);

            return redirect('/');
        }

        $wasHost = $participant->is_host;
        $participant->delete();

        if ($wasHost) {
            $newHost = $room->participants()->orderBy('id')->first();

            if ($newHost) {
                $newHost->update([
                    'is_host' => true,
                ]);
            } else {
                $room->delete();
            }
        }

        if ($room->exists) {
            $storyId = $room->stories()->orderBy('order')->value('id') ?? 0;
            event(new VoteUpdated($room->code, $storyId));
        }

        $request->session()->forget(['participant', 'participant_id']);

        return redirect('/');
    }
}
