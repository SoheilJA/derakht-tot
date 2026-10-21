<?php

namespace App\Filament\Resources\Elders;

use App\Filament\Resources\Elders\Pages\CreateElder;
use App\Filament\Resources\Elders\Pages\EditElder;
use App\Filament\Resources\Elders\Pages\ListElders;
use App\Filament\Resources\Elders\Schemas\ElderForm;
use App\Filament\Resources\Elders\Tables\EldersTable;
use App\Models\Elder;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

class ElderResource extends Resource
{
    protected static ?string $model = Elder::class;

    protected static ?string $modelLabel = 'بزرگ روستا';
    protected static ?string $pluralModelLabel = 'بزرگان روستا';
    protected static ?string $navigationLabel = "بزرگان روستا";

    protected static ?int $navigationSort = 1;

    public static function getNavigationGroup(): ?string
    {
        return 'بزرگان روستا';
    }

    public static function getRecordTitle(?Model $record): ?string
    {
        return $record->full_name;
    }

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'first_name';

    public static function form(Schema $schema): Schema
    {
        return ElderForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return EldersTable::configure($table);
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
            'index' => ListElders::route('/'),
            'create' => CreateElder::route('/create'),
            'edit' => EditElder::route('/{record}/edit'),
        ];
    }
}
