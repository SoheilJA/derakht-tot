<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;


class TimelineEvent extends Model
{
    protected $fillable = ['year', 'title', 'text', 'is_published'];

    protected function casts(): array
    {
        return ['isPublished' => 'boolean'];
    }

    /** رویدادهای قابل نمایش، از قدیمی به جدید */
    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('is_published', true)
            ->orderBy('year')
            ->orderBy('id');
    }
}
