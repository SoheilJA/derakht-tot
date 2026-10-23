<?php

namespace App\Filament\Resources\GalleryItems\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class GalleryItemForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                FileUpload::make('image')
                    ->label('تصویر')
                    ->helperText('ترجیحاً عمودی یا مربع، با عرض حداقل ۹۰۰ پیکسل')
                    ->image()
                    ->disk('public')
                    ->directory('gallery')
                    ->visibility('public')
                    ->columnSpanFull(),

                TextInput::make('title')
                    ->label('عنوان')
                    ->required()
                    ->maxLength(255),

                TextInput::make('description')
                    ->label('توضیح کوتاه')
                    ->maxLength(500),

                TextInput::make('alt')
                    ->label('توضیح تصویر (برای نابینایان و سئو)')
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
