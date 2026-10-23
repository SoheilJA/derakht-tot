<?php

namespace App\Filament\Resources\ElderCategories\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ElderCategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')
                ->label('نام')
                ->searchable(),

            TextColumn::make('slug')
                ->label('نشانی (slug)'),

            TextColumn::make('elders_count')
                ->label('تعداد بزرگان')
                ->counts('elders'),

            TextColumn::make('sort_order')
                ->label('ترتیب')
                ->sortable(),
        ])->defaultSort('sort_order')->recordActions([
            EditAction::make(),
        ])->toolbarActions([
            BulkActionGroup::make([
                DeleteBulkAction::make(),
            ]),
        ]);

    }
}
