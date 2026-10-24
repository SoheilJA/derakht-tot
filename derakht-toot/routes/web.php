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
        'latestNews' => News::published()->with('category')
            ->latest('published_at')
            ->take(4)
            ->get(),
        'elders' => Elder::visible()->take(6)->get(),
    ]);
})->name('home');

Route::view('/news', 'news.index')->name('news.index');

Route::get('/news/{news:slug}', function (News $news) {
    abort_unless($news->is_published && $news->published_at?->isPast(), 404);

    return view('news.show', [
        'news' => $news->load('category'),
        'related' => News::published()
            ->whereKeyNot($news->getKey())
            ->latest('published_at')
            ->take(3)
            ->get(),
    ]);
})->name('news.show');


Route::view('/elders', 'elders.index')->name('elders.index');

Route::get('/elders/{elder:slug}', function (Elder $elder) {
    abort_unless($elder->is_published, 404);

    return view('elders.show', [
        'elder' => $elder->load([
            'category',
            'person.father',
            'person.mother',
            'person.childrenByFather',
            'person.childrenByMother',
        ]),
    ]);
})->name('elders.show');
