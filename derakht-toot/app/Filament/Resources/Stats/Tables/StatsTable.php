<?php

namespace App\Filament\Resources\Stats\Tables;

use App\Support\Fa;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class StatsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('label')
                    ->label('عنوان')
                    ->searchable(),

                TextColumn::make('value')
                    ->label('عدد')
                    ->formatStateUsing(fn ($state) => Fa::digits($state)),

                TextColumn::make('suffix')
                    ->label('پسوند'),

                IconColumn::make('is_published')
                    ->label('نمایش')
                    ->boolean(),

                TextColumn::make('sort_order')
                    ->label('ترتیب')
                    ->sortable(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
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
