<?php

use App\Models\Fact;
use App\Models\Stat;
use App\Settings\HomeSettings;
use Illuminate\Support\Facades\Route;
use App\Models\GalleryItem;
use App\Models\TimelineEvent;

Route::get('/', function (HomeSettings $home) {
    return view('home', [
        'home' => $home,
        'facts' => Fact::visible()->get(),
        'stats' => Stat::visible()->get(),
        'galleryItems' => GalleryItem::visible()->get(),
        'timeline' => TimelineEvent::visible()->get(),
    ]);
})->name('home');
