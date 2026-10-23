<?php

namespace App\Filament\Resources\Facts\Pages;

use App\Filament\Resources\Facts\FactResource;
use Filament\Resources\Pages\CreateRecord;

class CreateFact extends CreateRecord
{
    protected static string $resource = FactResource::class;
}
