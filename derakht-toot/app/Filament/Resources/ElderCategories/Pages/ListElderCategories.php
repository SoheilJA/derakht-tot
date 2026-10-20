<?php

namespace App\Filament\Resources\ElderCategories\Pages;

use App\Filament\Resources\ElderCategories\ElderCategoryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListElderCategories extends ListRecords
{
    protected static string $resource = ElderCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
