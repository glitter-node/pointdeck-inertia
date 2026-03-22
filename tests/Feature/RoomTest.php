<?php

namespace Tests\Feature;

use App\Models\Participant;
use App\Models\Room;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoomTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_loads(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_room_can_be_created(): void
    {
        $response = $this->post('/rooms', [
            'name' => 'Sprint Planning',
            'nickname' => 'Alice',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('rooms', [
            'name' => 'Sprint Planning',
            'created_by' => 'Alice',
        ]);
        $this->assertDatabaseHas('participants', [
            'nickname' => 'Alice',
            'is_host' => true,
        ]);
    }

    public function test_participant_can_join_room(): void
    {
        $room = Room::create([
            'code' => 'ABC123',
            'name' => 'Sprint Planning',
            'created_by' => 'Host',
            'status' => 'active',
        ]);

        $response = $this->post("/rooms/{$room->code}/join", [
            'nickname' => 'Bob',
        ]);

        $response->assertRedirect("/rooms/{$room->code}");
        $this->assertDatabaseHas('participants', [
            'room_id' => $room->id,
            'nickname' => 'Bob',
            'is_host' => false,
        ]);
    }

    public function test_room_page_can_be_accessed_with_session_participant(): void
    {
        $room = Room::create([
            'code' => 'ROOM42',
            'name' => 'Sprint Planning',
            'created_by' => 'Host',
            'status' => 'active',
        ]);

        $participant = Participant::create([
            'room_id' => $room->id,
            'nickname' => 'Host',
            'is_host' => true,
            'joined_at' => now(),
        ]);

        $response = $this
            ->withSession(['participant_id' => $participant->id])
            ->get("/rooms/{$room->code}");

        $response->assertStatus(200);
    }
}
