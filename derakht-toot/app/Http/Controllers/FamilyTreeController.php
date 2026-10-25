<?php

namespace App\Http\Controllers;

use App\Models\Person;

class FamilyTreeController extends Controller
{
    public function __invoke()
    {
        $people = Person::with('elder:id,person_id,slug,is_published')
            ->orderBy('id')
            ->get()
            ->map(fn (Person $p) => [
                'id' => $p->id,
                'first_name' => $p->first_name,
                'last_name' => $p->last_name,
                'gender' => $p->gender,
                'father_id' => $p->father_id,
                'mother_id' => $p->mother_id,
                // شاخه‌ی درخت از سمت پدر کشیده می‌شود، و اگر پدر نبود از سمت مادر
                'parent_id' => $p->father_id ?? $p->mother_id,
                'birth_year' => $p->birth_year,
                'death_year' => $p->death_year,
                'spouse_name' => $p->spouse_name,
                'short_bio' => $p->short_bio,
                'photo' => $p->photo ? asset('storage/'.ltrim($p->photo, '/')) : null,
                'elder_slug' => $p->elder?->is_published ? $p->elder->slug : null,
            ])
            ->values();

        return view('family-tree', ['people' => $people]);
    }
}
