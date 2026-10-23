<?php

namespace App\Filament\Resources\ElderCategories;

use App\Filament\Resources\ElderCategories\Pages\CreateElderCategory;
use App\Filament\Resources\ElderCategories\Pages\EditElderCategory;
use App\Filament\Resources\ElderCategories\Pages\ListElderCategories;
use App\Filament\Resources\ElderCategories\Schemas\ElderCategoryForm;
use App\Filament\Resources\ElderCategories\Tables\ElderCategoriesTable;
use App\Models\ElderCategory;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ElderCategoryResource extends Resource
{
    protected static ?string $model = ElderCategory::class;

    protected static ?string $modelLabel = 'دسته بندی بزرگان';
    protected static ?string $pluralModelLabel = 'دسته بندی های بزرگان';
    protected static ?string $navigationLabel = 'دسته بندی بزرگان';

    protected static ?int $navigationSort = 2;

    public static function getNavigationGroup(): ?string
    {
        return 'بزرگان روستا';
    }

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return ElderCategoryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ElderCategoriesTable::configure($table);
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
            'index' => ListElderCategories::route('/'),
            'create' => CreateElderCategory::route('/create'),
            'edit' => EditElderCategory::route('/{record}/edit'),
        ];
    }
}
