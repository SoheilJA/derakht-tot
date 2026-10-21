<?php

namespace App\Filament\Resources\Elders\Tables;

use App\Support\Fa;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ExportAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;


class EldersTable
{
    public static function configure(Table $table): Table
    {
        return $table->columns([
            ImageColumn::make('photo')
                ->label('عکس')
                ->disk('public')
                ->circular(),

            TextColumn::make("full_name")
                ->label('نام')
                ->searchable(['first_name', 'last_name']),

            TextColumn::make('title')
                ->label('عنوان')
                ->limit(40),

            TextColumn::make("category.name")
                ->label('دسته بندی')
                ->badge(),

            TextColumn::make('birth_year')
                ->label('سال تولد')
                ->formatStateUsing(fn($state) => $state ? Fa::digits($state) : '—'),

            TextColumn::make('death_year')
                ->label('سال وفات')
                ->formatStateUsing(fn($state) => $state ? Fa::digits($state) : '—'),

            IconColumn::make('is_published')
                ->label('نمایش')
                ->boolean(),
            TextColumn::make("sort_order")
                ->label('ترتیب')
                ->sortable(),

        ])->defaultSort('sort_order')
            ->filters([
                SelectFilter::make('elder_category_id')
                    ->label('دسته بندی')
                    ->relationship('category', 'name'),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                ]),
            ]);
    }
}
