<?php

use App\Models\Elder;
use App\Models\Fact;
use App\Models\GalleryItem;
use App\Models\News;
use App\Models\Stat;
use App\Models\TimelineEvent;
use App\Models\Tradition;
use App\Settings\HomeSettings;
use Illuminate\Support\Facades\Route;
use App\Models\Person;

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

/* ---------- اخبار ---------- */
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

/* ---------- بزرگان ---------- */
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

/* ---------- شجره‌نامه ---------- */
Route::get('/family-tree', function () {
    $people = Person::with('elder:id,person_id,slug,is_published')
        ->orderBy('id')
        ->get()
        ->map(fn(Person $p) => [
            'id' => $p->id,
            'first_name' => $p->first_name,
            'last_name' => $p->last_name,
            'gender' => $p->gender,
            'father_id' => $p->father_id,
            'mother_id' => $p->mother_id,
            // شاخه‌ی درخت از سمت پدر کشیده می‌شود، و اگر پدر نبود از سمت مادر
            'parent_id' => $p->father_id ?? $p->mother_id,
            'birth_year' => $p->birth_year,
            'death_year' => $p->death_year,
            'spouse_name' => $p->spouse_name,
            'short_bio' => $p->short_bio,
            'photo' => $p->photo ? asset('storage/' . ltrim($p->photo, '/')) : null,
            'elder_slug' => $p->elder?->is_published ? $p->elder->slug : null,
        ])
        ->values();

    return view('family-tree', ['people' => $people]);
})->name('family-tree');
