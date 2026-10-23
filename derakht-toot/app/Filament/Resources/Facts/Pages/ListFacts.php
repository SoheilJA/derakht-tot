<?php

namespace App\Filament\Resources\Facts\Pages;

use App\Filament\Resources\Facts\FactResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFacts extends ListRecords
{
    protected static string $resource = FactResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
