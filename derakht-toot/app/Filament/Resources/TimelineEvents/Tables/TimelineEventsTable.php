<?php

namespace App\Filament\Resources\TimelineEvents\Tables;

use App\Support\Fa;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TimelineEventsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('year')
                    ->label('سال (شمسی)')
                    ->formatStateUsing(fn ($state) => Fa::digits($state))
                    ->sortable(),

                TextColumn::make('title')
                    ->label('عنوان')
                    ->searchable(),

                TextColumn::make('text')
                    ->label('توضیح')
                    ->limit(60),

                IconColumn::make('is_published')
                    ->label('نمایش')
                    ->boolean(),
            ])
            ->defaultSort('year')
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
