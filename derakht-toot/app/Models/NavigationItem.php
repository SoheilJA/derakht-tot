<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class NavigationItem extends Model
{
    protected $fillable = ['key', 'label', 'href', 'sort_order', 'show_in_header', 'show_in_footer'];

    protected function casts(): array
    {
        return [
            'show_in_header' => 'boolean',
            'show_in_footer' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('navigation'));
        static::deleted(fn () => Cache::forget('navigation'));
    }

    /** منوی سایت، کش‌شده تا با تغییر در پنل خودکار تازه شود */
    public static function menu(): Collection
    {
        $rows = Cache::rememberForever('navigation', fn () => static::query()
            ->orderBy('sort_order')
            ->get()
            ->map(fn (self $item) => $item->only(['key', 'label', 'href', 'show_in_header', 'show_in_footer']))
            ->all());

        return collect($rows);
    }
}
