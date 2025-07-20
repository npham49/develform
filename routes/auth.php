<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\SocialiteController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    // GitHub OAuth routes
    Route::get('auth/github', [SocialiteController::class, 'redirectToGithub'])
        ->name('auth.github');
    
    Route::get('auth/github/callback', [SocialiteController::class, 'handleGithubCallback'])
        ->name('auth.github.callback');

    // Login page (now shows GitHub login)
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    // Keep register route for redirect compatibility, but it will show GitHub login
    Route::get('register', [AuthenticatedSessionController::class, 'create'])
        ->name('register');
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
