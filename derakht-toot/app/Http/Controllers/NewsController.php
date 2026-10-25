<?php

namespace App\Http\Controllers;

use App\Models\News;

class NewsController extends Controller
{
    public function show(News $news)
    {
        abort_unless($news->is_published && $news->published_at?->isPast(), 404);

        return view('news.show', [
            'news' => $news->load('category'),
            'related' => News::published()
                ->whereKeyNot($news->getKey())
                ->latest('published_at')
                ->take(3)
                ->get(),
        ]);
    }
}
