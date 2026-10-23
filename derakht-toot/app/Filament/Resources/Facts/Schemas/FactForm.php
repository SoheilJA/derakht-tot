<?php

namespace App\Filament\Resources\Facts\Schemas;

use App\Enums\SiteIcon;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class FactForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('icon')
                ->label('آیکون')
                ->options([SiteIcon::class])
                ->default(SiteIcon::Mulberry)
                ->required()
                ->native(false),

            TextInput::make('title')
                ->label('عنوان')
                ->required()
                ->maxLength(255),

            Textarea::make('text')
                ->label('متن')
                ->rows(3),

            TextInput::make('sort_order')
                ->label('ترتیب نمایش')
                ->numeric()
                ->default(0)
                ->required(),

            Toggle::make('is_published')
                ->label('نمایش در سایت')
                ->default(true)
        ]);
    }
}
