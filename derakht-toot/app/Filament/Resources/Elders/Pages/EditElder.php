<?php

namespace App\Filament\Resources\Elders\Pages;

use App\Filament\Resources\Elders\ElderResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditElder extends EditRecord
{
    protected static string $resource = ElderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
