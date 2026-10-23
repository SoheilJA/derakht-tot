<?php

namespace App\Filament\Resources\Elders\Pages;

use App\Filament\Resources\Elders\ElderResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListElders extends ListRecords
{
    protected static string $resource = ElderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
