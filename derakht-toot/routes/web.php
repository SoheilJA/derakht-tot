<?php

use App\Settings\HomeSettings;
use Illuminate\Support\Facades\Route;

Route::get('/', function (HomeSettings $home) {
    return view('home', ['home' => $home]);
})->name('home');
