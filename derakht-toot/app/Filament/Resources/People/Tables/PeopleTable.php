<?php

namespace App\Filament\Resources\People\Tables;

use App\Support\Fa;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PeopleTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('photo')
                    ->label('عکس')
                    ->disk('public')
                    ->circular(),

                TextColumn::make('full_name')
                    ->label('نام')
                    ->searchable(['first_name', 'last_name'])
                    ->sortable(['last_name', 'first_name']),

                TextColumn::make('gender')
                    ->label('جنسیت')
                    ->badge()
                    ->formatStateUsing(fn(string $state) => $state === 'f' ? 'زن' : 'مرد')
                    ->color(fn(string $state) => $state === 'f' ? 'danger' : 'info'),

                TextColumn::make('father.full_name')
                    ->label('پدر'),

                TextColumn::make('mother.full_name')
                    ->label('مادر'),

                TextColumn::make('birth_year')
                    ->label('سال تولد')
                    ->formatStateUsing(fn($state) => $state ? Fa::digits($state) : '—')
                    ->sortable(),

                TextColumn::make('death_year')
                    ->label('سال وفات')
                    ->formatStateUsing(fn($state) => $state ? Fa::digits($state) : '—'),
            ])
            ->defaultSort('last_name')
            ->filters([
                SelectFilter::make('gender')
                    ->label('جنسیت')
                    ->options(['m' => 'مرد', 'f' => 'زن']),
            ])
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
