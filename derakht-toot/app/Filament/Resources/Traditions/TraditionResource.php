<?php

namespace App\Filament\Resources\Traditions;

use App\Filament\Resources\Traditions\Pages\CreateTradition;
use App\Filament\Resources\Traditions\Pages\EditTradition;
use App\Filament\Resources\Traditions\Pages\ListTraditions;
use App\Filament\Resources\Traditions\Schemas\TraditionForm;
use App\Filament\Resources\Traditions\Tables\TraditionsTable;
use App\Models\Tradition;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class TraditionResource extends Resource
{
    protected static ?string $model = Tradition::class;
    protected static ?string $modelLabel = 'سنت یا محصول';

    protected static ?string $pluralModelLabel = 'سنت‌ها و محصولات';

    protected static ?string $navigationLabel = 'سنت‌ها و محصولات';

    protected static ?int $navigationSort = 6;

    public static function getNavigationGroup(): ?string
    {
        return 'محتوای سایت';
    }

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return TraditionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TraditionsTable::configure($table);
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
            'index' => ListTraditions::route('/'),
            'create' => CreateTradition::route('/create'),
            'edit' => EditTradition::route('/{record}/edit'),
        ];
    }
}
