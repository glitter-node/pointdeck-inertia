<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable(['code', 'name', 'created_by', 'status'])]
class Room extends Model
{
    use HasFactory;

    public function participants(): HasMany
    {
        return $this->hasMany(Participant::class);
    }

    public function stories(): HasMany
    {
        return $this->hasMany(Story::class);
    }

    public function storyResults(): HasMany
    {
        return $this->hasMany(StoryResult::class);
    }

    public static function generateUniqueCode(): string
    {
        do {
            $code = Str::upper(Str::random(6));
        } while (static::query()->where('code', $code)->exists());

        return $code;
    }
}
