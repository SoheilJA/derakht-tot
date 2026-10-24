<?php

namespace App\Livewire;

use App\Models\Elder;
use App\Models\ElderCategory;
use Livewire\Attributes\Url;
use Livewire\Component;

class ElderList extends Component
{
    #[Url(as: 'category', except: '')]
    public string $category = '';

    #[Url(as: 'q', except: '')]
    public string $search = '';

    public function setCategory(string $slug): void
    {
        $this->category = $slug;
    }

    public function render()
    {
        // یکسان‌سازی «ی» و «ک» عربی با فارسی
        $term = trim(str_replace(['ي', 'ك'], ['ی', 'ک'], $this->search));

        $elders = Elder::visible()
            ->with('category')
            ->when($this->category !== '', fn ($q) => $q->whereHas(
                'category',
                fn ($c) => $c->where('slug', $this->category)
            ))
            ->when($term !== '', fn ($q) => $q->where(
                fn ($w) => $w->where('first_name', 'like', "%{$term}%")
                    ->orWhere('last_name', 'like', "%{$term}%")
                    ->orWhere('title', 'like', "%{$term}%")
            ))
            ->get();

        return view('livewire.elder-list', [
            'elders' => $elders,
            'categories' => ElderCategory::whereHas('elders', fn ($q) => $q->where('is_published', true))
                ->orderBy('sort_order')
                ->get(),
        ]);
    }
}
