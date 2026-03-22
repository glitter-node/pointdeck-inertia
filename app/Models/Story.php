<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['room_id', 'title', 'description', 'status', 'order'])]
class Story extends Model
{
    use HasFactory;

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function scopeVoting(Builder $query): Builder
    {
        return $query->where('status', 'voting');
    }
}
