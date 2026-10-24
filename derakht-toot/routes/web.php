<?php

use App\Models\Fact;
use App\Models\Stat;
use App\Settings\HomeSettings;
use Illuminate\Support\Facades\Route;
use App\Models\GalleryItem;
use App\Models\TimelineEvent;
use App\Models\Tradition;
use App\Models\Elder;
use App\Models\News;

Route::get('/', function (HomeSettings $home) {
    return view('home', [
        'home' => $home,
        'facts' => Fact::visible()->get(),
        'stats' => Stat::visible()->get(),
        'galleryItems' => GalleryItem::visible()->get(),
        'timeline' => TimelineEvent::visible()->get(),
        'traditions' => Tradition::visible()->get(),
        'latestNews' => News::published()->with('category')->latest('published_at')->take(4)->get(),
        'elders' => Elder::visible()->take(6)->get(),
    ]);
})->name('home');
