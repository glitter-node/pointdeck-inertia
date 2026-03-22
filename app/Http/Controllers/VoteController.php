<?php

namespace App\Http\Controllers;

use App\Events\VoteUpdated;
use App\Models\Participant;
use App\Models\Story;
use App\Models\Vote;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    public function store(Request $request, Story $story): RedirectResponse
    {
        $participantId = $request->session()->get('participant_id');
        $participant = Participant::query()->find($participantId);

        if (! $participant || $participant->room_id !== $story->room_id) {
            return redirect('/');
        }

        if ($story->status !== 'voting') {
            return redirect()->back()->withErrors([
                'story' => 'Voting is closed for this story.',
            ]);
        }

        $validated = $request->validate([
            'point' => ['required', 'string'],
        ]);

        Vote::query()->updateOrCreate(
            [
                'story_id' => $story->id,
                'participant_id' => $participant->id,
            ],
            [
                'point' => $validated['point'],
            ],
        );

        event(new VoteUpdated($story->room->code, $story->id));

        return redirect("/rooms/{$story->room->code}");
    }
}
