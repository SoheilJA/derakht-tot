<?php

namespace App\Filament\Resources\TimelineEvents\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class TimelineEventForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('year')
                    ->label('سال (شمسی)')
                    ->helperText('مثل ۱۳۰۴؛ رویدادها در سایت بر اساس سال مرتب می‌شوند')
                    ->numeric()
                    ->minValue(1)
                    ->maxValue(1500)
                    ->required(),

                TextInput::make('title')
                    ->label('عنوان رویداد')
                    ->required()
                    ->maxLength(255),

                Textarea::make('text')
                    ->label('توضیح')
                    ->rows(4),

                Toggle::make('is_published')
                    ->label('نمایش در سایت')
                    ->default(true),
            ]);
    }
}
