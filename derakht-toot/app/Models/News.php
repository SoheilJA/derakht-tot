<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

use App\Support\Fa;

class News extends Model
{
    protected $fillable = [
        'news_category_id',
        'slug',
        'title',
        'summary',
        'cover_image',
        'body',
        'is_published',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(NewsCategory::class, 'news_category_id');
    }

    /** فقط خبرهای منتشرشده‌ای که زمان انتشارشان رسیده */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)
            ->where('published_at', '<=', now());
    }

    protected function publishedAtJalali(): Attribute
    {
        return Attribute::get(fn() => Fa::date($this->published_at));
    }
}
