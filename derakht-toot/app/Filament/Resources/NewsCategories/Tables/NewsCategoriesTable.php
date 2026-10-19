<?php

namespace App\Filament\Resources\NewsCategories\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class NewsCategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')->label('نام')->searchable(),
            TextColumn::make('slug')->label('نشانی (slug)'),

            TextColumn::make('news_count')->label('تعداد خبر')->counts('news'),

            TextColumn::make('sort_order')->label('ترتیب')->sortable(),
        ])->defaultSort('sort_order')->recordActions([EditAction::make(),])->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make(),
        ]),
        ]);

    }

}
