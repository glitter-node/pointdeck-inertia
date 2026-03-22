<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['story_result_id', 'participant_name', 'point'])]
class StoryResultVote extends Model
{
    use HasFactory;

    public $timestamps = false;

    public function storyResult(): BelongsTo
    {
        return $this->belongsTo(StoryResult::class);
    }
}
