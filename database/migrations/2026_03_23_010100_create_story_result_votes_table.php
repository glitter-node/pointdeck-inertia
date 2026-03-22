<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('story_result_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('story_result_id')->constrained()->cascadeOnDelete();
            $table->string('participant_name');
            $table->string('point');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('story_result_votes');
    }
};
