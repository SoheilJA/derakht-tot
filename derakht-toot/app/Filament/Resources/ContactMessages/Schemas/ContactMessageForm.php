<?php

namespace App\Filament\Resources\ContactMessages\Schemas;

use App\Enums\ContactMessageStatus;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ContactMessageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('پیام کاربر')
                ->columns(2)
                ->schema([
                    TextInput::make('name')
                        ->label('نام')
                        ->disabled(),

                    TextInput::make('phone')
                        ->label('شماره تماس')
                        ->disabled(),

                    TextEntry::make('created_at')
                        ->label('زمان ارسال')
                        ->jalaliDateTime(),

                    Textarea::make('message')
                        ->label('متن پیام')
                        ->rows(6)
                        ->disabled()
                        ->columnSpanFull(),
                ]),
            Section::make('پیگیری')
                ->schema([
                    Select::make('status')
                        ->label('وضعیت')
                        ->options(ContactMessageStatus::class)
                        ->required()
                        ->native(false),

                    Textarea::make('admin_note')
                        ->label('یادداشت ادمین')
                        ->helperText('فقط برای شما نمایش داده میشه')
                        ->rows(4)
                ]),
        ]);
    }
}
