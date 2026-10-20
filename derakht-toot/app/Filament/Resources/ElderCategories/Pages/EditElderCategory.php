<?php

namespace App\Filament\Resources\ElderCategories\Pages;

use App\Filament\Resources\ElderCategories\ElderCategoryResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditElderCategory extends EditRecord
{
    protected static string $resource = ElderCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
