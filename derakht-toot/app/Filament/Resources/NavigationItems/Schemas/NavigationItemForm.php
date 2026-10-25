<?php

namespace App\Filament\Resources\NavigationItems\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class NavigationItemForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('label')
                    ->label('عنوان در منو')
                    ->required()
                    ->maxLength(60),

                TextInput::make('href')
                    ->label('آدرس')
                    ->helperText('مثل /news یا /#about')
                    ->required()
                    ->maxLength(255),

                TextInput::make('key')
                    ->label('شناسه‌ی داخلی')
                    ->helperText('برای مشخص‌کردن لینک فعال استفاده می‌شود و بعد از ساخت قابل تغییر نیست')
                    ->required()
                    ->alphaDash()
                    ->unique(ignoreRecord: true)
                    ->maxLength(30)
                    ->disabledOn('edit'),

                TextInput::make('sort_order')
                    ->label('ترتیب نمایش')
                    ->numeric()
                    ->default(0)
                    ->required(),

                Toggle::make('show_in_header')
                    ->label('نمایش در هدر')
                    ->default(true),

                Toggle::make('show_in_footer')
                    ->label('نمایش در فوتر (دسترسی سریع)')
                    ->default(false),
            ]);
    }
}
