<?php

namespace App\Filament\Resources\Stats\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class StatForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('value')
                    ->label('عدد')
                    ->helperText('فقط عدد صحیح؛ در سایت با انیمیشن شمارش نمایش داده می‌شود')
                    ->numeric()
                    ->minValue(0)
                    ->required(),

                TextInput::make('suffix')
                    ->label('پسوند')
                    ->helperText('مثل «سال»، «نفر» یا «+»')
                    ->maxLength(30),

                TextInput::make('label')
                    ->label('عنوان')
                    ->required()
                    ->maxLength(255),

                TextInput::make('sort_order')
                    ->label('ترتیب نمایش')
                    ->numeric()
                    ->default(0)
                    ->required(),

                Toggle::make('is_published')
                    ->label('نمایش در سایت')
                    ->default(true),
            ]);
    }
}
