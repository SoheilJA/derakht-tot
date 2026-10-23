<?php

use App\Models\Fact;
use App\Models\Stat;
use App\Settings\HomeSettings;
use Illuminate\Support\Facades\Route;

Route::get('/', function (HomeSettings $home) {
    return view('home', [
        'home' => $home,
        'facts' => Fact::visible()->get(),
        'stats' => Stat::visible()->get(),
    ]);
})->name('home');
