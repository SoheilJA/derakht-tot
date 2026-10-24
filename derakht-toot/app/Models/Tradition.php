<?php

namespace App\Models;

use App\Enums\SiteIcon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Tradition extends Model
{
    protected $fillable = ['icon', 'title', 'text', 'sort_order', 'is_published'];

    protected function casts(): array
    {
        return [
            'icon' => SiteIcon::class,
            'is_published' => 'boolean',
        ];
    }

    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('is_published', true)->orderBy('sort_order');
    }
}
