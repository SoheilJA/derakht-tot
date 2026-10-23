<?php

namespace App\Filament\Resources\ContactMessages\Tables;

use App\Enums\ContactMessageStatus;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ContactMessagesTable
{
    public static function configure(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')
                ->label('نام')
                ->searchable(),

            TextColumn::make('phone')
                ->label('شماره تماس')
                ->searchable(),

            TextColumn::make('message')
                ->label('پیام')
                ->limit(60),

            TextColumn::make("status")
                ->label('وضعیت')
                ->badge(),

            TextColumn::make("created_at")
                ->label('زمان ارسال')
                ->jalaliDateTime()
                ->sortable(),
        ])->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->label('وضعیت')
                    ->options(ContactMessageStatus::class),
            ])->recordActions([
                EditAction::make()
                    ->label('مشاهده')
            ])->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                ])
            ]);
    }
}
