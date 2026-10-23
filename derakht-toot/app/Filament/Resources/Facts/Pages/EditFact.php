<?php

namespace App\Filament\Resources\Facts\Pages;

use App\Filament\Resources\Facts\FactResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFact extends EditRecord
{
    protected static string $resource = FactResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
