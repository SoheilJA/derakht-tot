<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Elder extends Model
{
    protected $fillable = [
        'elder_category_id',
        'person_id',
        'slug',
        'first_name',
        'last_name',
        'title',
        'photo',
        'summary',
        'bio',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return ['is_published' => 'boolean'];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ElderCategory::class, 'elder_category_id');
    }

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }

    protected function fullName(): Attribute
    {
        return Attribute::get(fn() => trim("{$this->first_name} {$this->last_name}"));
    }
}
