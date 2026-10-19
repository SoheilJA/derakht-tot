<?php

namespace App\Filament\Resources\News\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class NewsForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('عنوان')
                    ->required()
                    ->maxLength(255)
                    ->columnSpanFull(),

                TextInput::make('slug')
                    ->label('نشانی (slug)')
                    ->helperText('به انگلیسی و با خط تیره، مثل spring-festival')
                    ->required()
                    ->alphaDash()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255),

                Select::make('news_category_id')
                    ->label('دسته‌بندی')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload(),

                Textarea::make('summary')
                    ->label('خلاصه')
                    ->rows(3)
                    ->columnSpanFull(),

                FileUpload::make('cover_image')
                    ->label('تصویر کاور')
                    ->image()
                    ->disk('public')
                    ->directory('news')
                    ->visibility('public')
                    ->columnSpanFull(),

                RichEditor::make('body')
                    ->label('متن خبر')
                    ->fileAttachmentsDisk('public')
                    ->fileAttachmentsDirectory('news/attachments')
                    ->columnSpanFull(),

                Toggle::make('is_published')
                    ->label('منتشر شود')
                    ->default(false),

                DateTimePicker::make('published_at')
                    ->label('زمان انتشار')
                    ->helperText('خبر تا رسیدن این زمان در سایت نمایش داده نمی‌شود')
                    ->jalali()
                    ->seconds(false)
                    ->default(now()),
            ]);
    }
}
