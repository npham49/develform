<?php

use App\Http\Controllers\FormController;
use App\Http\Controllers\SubmissionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('forms', FormController::class);
    Route::get('forms/{form}/manage', [FormController::class, 'show'])->name('forms.manage');
    Route::get('forms/{form}/manage/schema', [FormController::class, 'schema'])->name('forms.schema');
    Route::patch('forms/{form}/manage/schema', [FormController::class, 'update'])->name('forms.schema.update');
    Route::get('forms/{form}/manage/preview', [FormController::class, 'preview'])->name('forms.preview');
});

Route::get('forms/{form}/submit', [FormController::class, 'get_schema'])->name('submit');
Route::post('forms/{form}/submit', [SubmissionController::class, 'store'])->name('submit.store');
Route::get('forms/{form}/submit/success/{submission}', [SubmissionController::class, 'success'])->name('submit.success');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
