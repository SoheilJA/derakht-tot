<?php

namespace App\Http\Controllers;

use App\Models\Elder;

class ElderController extends Controller
{
    public function show(Elder $elder)
    {
        abort_unless($elder->is_published, 404);

        return view('elders.show', [
            'elder' => $elder->load([
                'category',
                'person.father',
                'person.mother',
                'person.childrenByFather',
                'person.childrenByMother',
            ]),
        ]);
    }
}
