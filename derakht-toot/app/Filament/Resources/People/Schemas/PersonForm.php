<?php

namespace App\Filament\Resources\People\Schemas;

use App\Models\Person;
use App\Support\Fa;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Illuminate\Database\Eloquent\Builder;

class PersonForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextInput::make('first_name')
                    ->label('نام')
                    ->required()
                    ->maxLength(255),

                TextInput::make('last_name')
                    ->label('نام خانوادگی')
                    ->required()
                    ->maxLength(255),

                Radio::make('gender')
                    ->label('جنسیت')
                    ->options(['m' => 'مرد', 'f' => 'زن'])
                    ->default('m')
                    ->required()
                    ->inline(),

                TextInput::make('spouse_name')
                    ->label('نام همسر')
                    ->maxLength(255),

                Select::make('father_id')
                    ->label('پدر')
                    ->relationship(
                        'father',
                        'first_name',
                        modifyQueryUsing: fn(Builder $query, $record = null) => $query
                            ->where('gender', 'm')
                            ->when($record, fn(Builder $q) => $q->whereKeyNot($record->getKey())),
                    )
                    ->getOptionLabelFromRecordUsing(fn(Person $person) => self::optionLabel($person))
                    ->searchable(['first_name', 'last_name'])
                    ->preload(),

                Select::make('mother_id')
                    ->label('مادر')
                    ->relationship(
                        'mother',
                        'first_name',
                        modifyQueryUsing: fn(Builder $query, $record = null) => $query
                            ->where('gender', 'f')
                            ->when($record, fn(Builder $q) => $q->whereKeyNot($record->getKey())),
                    )
                    ->getOptionLabelFromRecordUsing(fn(Person $person) => self::optionLabel($person))
                    ->searchable(['first_name', 'last_name'])
                    ->preload(),

                TextInput::make('birth_year')
                    ->label('سال تولد')
                    ->numeric()
                    ->minValue(1100)
                    ->maxValue(1500),

                TextInput::make('death_year')
                    ->label('سال وفات')
                    ->helperText('اگر در قید حیات است خالی بگذارید')
                    ->numeric()
                    ->minValue(1100)
                    ->maxValue(1500)
                    ->gte('birth_year'),

                FileUpload::make('photo')
                    ->label('عکس')
                    ->image()
                    ->avatar()
                    ->disk('public')
                    ->directory('people')
                    ->visibility('public'),

                Textarea::make('short_bio')
                    ->label('توضیح کوتاه')
                    ->rows(4)
                    ->columnSpanFull(),
            ]);
    }

    private static function optionLabel(Person $person): string
    {
        return $person->birth_year
            ? $person->full_name . ' (' . Fa::digits($person->birth_year) . ')'
            : $person->full_name;
    }
}
