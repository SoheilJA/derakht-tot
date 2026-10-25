<?php

namespace App\Http\Controllers;

use App\Models\Elder;
use App\Models\Fact;
use App\Models\GalleryItem;
use App\Models\News;
use App\Models\Stat;
use App\Models\TimelineEvent;
use App\Models\Tradition;
use App\Settings\HomeSettings;

class HomeController extends Controller
{
    public function __invoke(HomeSettings $home)
    {
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
    }
}
