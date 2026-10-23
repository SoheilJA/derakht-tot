<?php

namespace App\Filament\Resources\ContactMessages\Pages;

use App\Filament\Resources\ContactMessages\ContactMessageResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use App\Enums\ContactMessageStatus;
use App\Models\ContactMessage;

class EditContactMessage extends EditRecord
{
    protected static string $resource = ContactMessageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    public function mount(int|string $record): void
    {
        ContactMessage::whereKey($record)
            ->where('status', ContactMessageStatus::New->value)
            ->update(['status' => ContactMessageStatus::Read->value]);

        parent::mount($record);
    }
}
