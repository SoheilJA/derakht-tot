<?php

namespace App\Livewire;

use App\Models\News;
use App\Models\NewsCategory;
use Livewire\Attributes\Url;
use Livewire\Component;

class NewsList extends Component
{
    private const PAGE_SIZE = 9;

    #[Url(as: 'category', except: '')]
    public string $category = '';

    #[Url(as: 'q', except: '')]
    public string $search = '';

    public int $perPage = self::PAGE_SIZE;

    public function setCategory(string $slug): void
    {
        $this->category = $slug;
        $this->perPage = self::PAGE_SIZE;
    }

    public function updatedSearch(): void
    {
        $this->perPage = self::PAGE_SIZE;
    }

    public function loadMore(): void
    {
        $this->perPage += self::PAGE_SIZE;
    }

    public function render()
    {
        $term = trim($this->search);

        // یکی بیشتر می‌خوانیم تا بفهمیم دکمه‌ی «بیشتر» لازم است یا نه
        $items = News::published()
            ->with('category')
            ->when($this->category !== '', fn($q) => $q->whereHas(
                'category',
                fn($c) => $c->where('slug', $this->category)
            ))
            ->when($term !== '', fn($q) => $q->where(
                fn($w) => $w->where('title', 'like', "%{$term}%")
                    ->orWhere('summary', 'like', "%{$term}%")
            ))
            ->latest('published_at')
            ->take($this->perPage + 1)
            ->get();

        return view('livewire.news-list', [
            'items' => $items->take($this->perPage),
            'hasMore' => $items->count() > $this->perPage,
            'categories' => NewsCategory::whereHas('news', fn($q) => $q->published())
                ->orderBy('sort_order')
                ->get(),
        ]);
    }
}
