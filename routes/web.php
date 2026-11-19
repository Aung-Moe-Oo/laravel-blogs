<?php

use App\Http\Controllers\Api\SwaggerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PostWebController;
use Illuminate\Support\Facades\Route;

// Swagger Documentation
Route::get('/api/documentation', [SwaggerController::class, 'index'])->name('swagger.ui');
Route::get('/swagger', fn () => redirect()->route('swagger.ui'));

// Public Web Pages
Route::inertia('/', 'welcome')->name('home');
Route::get('/posts', [PostWebController::class, 'index'])->name('posts.index');
Route::get('/posts/{post}', [PostWebController::class, 'show'])->name('posts.show');

// Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function (): void {
    // Dashboard & API Tokens
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/dashboard/tokens', [DashboardController::class, 'createApiToken'])->name('dashboard.tokens.create');
    Route::delete('/dashboard/tokens/{token}', [DashboardController::class, 'deleteApiToken'])->name('dashboard.tokens.destroy');

    // Web Post Management
    Route::post('/posts', [PostWebController::class, 'store'])->name('posts.store');
    Route::match(['put', 'patch'], '/posts/{post}', [PostWebController::class, 'update'])->name('posts.update');
    Route::delete('/posts/{post}', [PostWebController::class, 'destroy'])->name('posts.destroy');

    // Web Comment Management
    Route::post('/posts/{post}/comments', [PostWebController::class, 'storeComment'])->name('posts.comments.store');
    Route::delete('/comments/{comment}', [PostWebController::class, 'destroyComment'])->name('comments.destroy');
});

require __DIR__.'/settings.php';
