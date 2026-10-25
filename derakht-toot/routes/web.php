<?php

use App\Http\Controllers\ElderController;
use App\Http\Controllers\FamilyTreeController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

/* ---------- اخبار ---------- */
Route::view('/news', 'news.index')->name('news.index');
Route::get('/news/{news:slug}', [NewsController::class, 'show'])->name('news.show');

/* ---------- بزرگان ---------- */
Route::view('/elders', 'elders.index')->name('elders.index');
Route::get('/elders/{elder:slug}', [ElderController::class, 'show'])->name('elders.show');

/* ---------- شجره‌نامه ---------- */
Route::get('/family-tree', FamilyTreeController::class)->name('family-tree');
