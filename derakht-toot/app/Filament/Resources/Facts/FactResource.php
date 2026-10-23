<?php

namespace App\Filament\Resources\Facts;

use App\Filament\Resources\Facts\Pages\CreateFact;
use App\Filament\Resources\Facts\Pages\EditFact;
use App\Filament\Resources\Facts\Pages\ListFacts;
use App\Filament\Resources\Facts\Schemas\FactForm;
use App\Filament\Resources\Facts\Tables\FactsTable;
use App\Models\Fact;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class FactResource extends Resource
{
    protected static ?string $model = Fact::class;
    protected static ?string $modelLabel = 'ویژگی';
    protected static ?string $pluralModelLabel = 'ویژگی های روستا';
    protected static ?string $navigationLabel = 'ویژگی های روستا';

    protected static ?int $navigationSort = 2;

    public static function getNavigationGroup(): ?string
    {
        return 'محتوای سایت';
    }

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return FactForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FactsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFacts::route('/'),
            'create' => CreateFact::route('/create'),
            'edit' => EditFact::route('/{record}/edit'),
        ];
    }
}
