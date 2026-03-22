<?php

use App\Http\Controllers\RoomController;
use App\Http\Controllers\StoryController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;

Route::get('/', [RoomController::class, 'landing']);
Route::get('/home', [RoomController::class, 'index']);
Route::post('/rooms', [RoomController::class, 'store']);
Route::get('/rooms/{code}', [RoomController::class, 'show']);
Route::get('/rooms/{code}/export', [RoomController::class, 'export']);
Route::post('/rooms/{code}/join', [RoomController::class, 'join']);
Route::post('/rooms/{code}/leave', [RoomController::class, 'leave']);
Route::post('/rooms/{code}/stories', [StoryController::class, 'store']);
Route::put('/rooms/{code}/stories/{story}', [StoryController::class, 'update']);
Route::delete('/rooms/{code}/stories/{story}', [StoryController::class, 'destroy']);
Route::post('/rooms/{code}/stories/{story}/start', [StoryController::class, 'startVoting']);
Route::post('/stories/{story}/vote', [VoteController::class, 'store']);
Route::post('/rooms/{code}/stories/{story}/reveal', [StoryController::class, 'reveal']);
Route::post('/rooms/{code}/stories/{story}/reset', [StoryController::class, 'reset']);
