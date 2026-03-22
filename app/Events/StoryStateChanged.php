<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StoryStateChanged implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public string $room_code,
        public int $story_id,
    ) {
    }

    public function broadcastOn(): Channel
    {
        return new Channel("room.{$this->room_code}");
    }

    public function broadcastAs(): string
    {
        return 'StoryStateChanged';
    }
}
