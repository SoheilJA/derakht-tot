<?php

namespace App\Filament\Resources\News\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;


class NewsTable
{
    public static function configure(Table $table): Table
    {
        return $table->columns([
            ImageColumn::make("cover_image")
                ->label('تصویر')
                ->square(),

            TextColumn::make("title")
                ->label('عنوان')
                ->searchable()
                ->limit(50),

            TextColumn::make('category.name')
                ->label('دسته بندی')
                ->badge(),

            IconColumn::make("is_published")
                ->label('منتشر شده')
                ->boolean(),

            TextColumn::make("published_at")
                ->label('زمان انتشار')
                ->jalaliDateTime()
                ->sortable(),
        ])->defaultSort('published_at', 'desc')
            ->filters([
                SelectFilter::make('news_category_id')
                    ->label('دسته بندی')
                    ->relationship('category', 'name'),
            ])
            ->recordActions([
                EditAction::make()
            ])->toolbarActions([
                BulkActionGroup::make([DeleteBulkAction::make(),
                ]),
            ]);

    }
}
