<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('room.{code}', function ($user, $code) {
    $participant = session('participant');

    if (! $participant || $participant['room_code'] !== $code) {
        return false;
    }

    return [
        'id' => $participant['id'],
        'nickname' => $participant['nickname'] ?? 'Guest',
    ];
});
