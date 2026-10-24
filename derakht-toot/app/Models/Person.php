<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Person extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'gender',
        'father_id',
        'mother_id',
        'birth_year',
        'death_year',
        'spouse_name',
        'short_bio',
        'photo',
    ];

    public function father(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'father_id');
    }

    public function mother(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'mother_id');
    }

    public function childrenByFather(): HasMany
    {
        return $this->hasMany(Person::class, 'father_id');
    }

    public function childrenByMother(): HasMany
    {
        return $this->hasMany(Person::class, 'mother_id');
    }

    public function elder(): HasOne
    {
        return $this->hasOne(Elder::class);
    }

    protected function fullName(): Attribute
    {
        return Attribute::get(fn() => trim("{$this->first_name} {$this->last_name}"));
    }

    /** فرزندان؛ بر اساس جنسیت، از سمت پدر یا مادر */
    protected function children(): Attribute
    {
        return Attribute::get(
            fn() => $this->gender === 'f' ? $this->childrenByMother : $this->childrenByFather
        );
    }
}
