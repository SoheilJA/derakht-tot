<?php

namespace App\Filament\Resources\Elders\Schemas;

use App\Models\Person;
use App\Support\Fa;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ElderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('مشخصات')
                    ->columns(2)
                    ->schema([
                        TextInput::make('first_name')
                            ->label('نام')
                            ->required()
                            ->maxLength(255),

                        TextInput::make('last_name')
                            ->label('نام خانوادگی')
                            ->required()
                            ->maxLength(255),

                        TextInput::make('title')
                            ->label('عنوان یا لقب')
                            ->helperText('مثل «کدخدای پیشین روستا»')
                            ->required()
                            ->maxLength(255),

                        TextInput::make('slug')
                            ->label('نشانی (slug)')
                            ->helperText('به انگلیسی و با خط تیره، مثل haj-reza-sadeghi')
                            ->required()
                            ->alphaDash()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),

                        Select::make('elder_category_id')
                            ->label('دسته‌بندی')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload(),

                        Select::make('person_id')
                            ->label('فرد در شجره‌نامه (اختیاری)')
                            ->helperText('اگر این بزرگ در شجره‌نامه ثبت شده، انتخاب کنید')
                            ->relationship('person', 'first_name')
                            ->getOptionLabelFromRecordUsing(fn(Person $person) => self::personLabel($person))
                            ->searchable(['first_name', 'last_name'])
                            ->preload()
                            ->unique(ignoreRecord: true),

                        TextInput::make('birth_year')
                            ->label('سال تولد (شمسی)')
                            ->numeric()
                            ->minValue(1100)
                            ->maxValue(1500),

                        TextInput::make('death_year')
                            ->label('سال وفات (شمسی)')
                            ->helperText('اگر در قید حیات است خالی بگذارید')
                            ->numeric()
                            ->minValue(1100)
                            ->maxValue(1500)
                            ->gte('birth_year'),

                        TextInput::make('birthplace')
                            ->label('محل تولد')
                            ->maxLength(255),

                        TextInput::make('profession')
                            ->label('شغل')
                            ->maxLength(255),
                    ]),

                Section::make('تصویر و زندگی‌نامه')
                    ->schema([
                        FileUpload::make('photo')
                            ->label('عکس')
                            ->image()
                            ->disk('public')
                            ->directory('elders')
                            ->visibility('public'),

                        Textarea::make('summary')
                            ->label('خلاصه')
                            ->rows(3),

                        RichEditor::make('bio')
                            ->label('زندگی‌نامه')
                            ->fileAttachmentsDisk('public')
                            ->fileAttachmentsDirectory('elders/attachments'),
                    ]),

                Section::make('دستاوردها')
                    ->schema([
                        Repeater::make('achievements')
                            ->label('دستاوردها')
                            ->schema([
                                TextInput::make('title')
                                    ->label('عنوان')
                                    ->required(),

                                Textarea::make('description')
                                    ->label('توضیح')
                                    ->rows(3),
                            ])
                            ->itemLabel(fn(array $state): ?string => $state['title'] ?? null)
                            ->addActionLabel('افزودن دستاورد')
                            ->collapsible()
                            ->reorderable()
                            ->defaultItems(0),
                    ]),

                Section::make('نقل‌قول‌ها')
                    ->schema([
                        Repeater::make('quotes')
                            ->label('نقل‌قول‌ها')
                            ->simple(
                                TextInput::make('quote')
                                    ->label('نقل‌قول')
                                    ->required(),
                            )
                            ->addActionLabel('افزودن نقل‌قول')
                            ->reorderable()
                            ->defaultItems(0),
                    ]),

                Section::make('گالری تصاویر')
                    ->schema([
                        FileUpload::make('gallery')
                            ->label('تصاویر')
                            ->image()
                            ->multiple()
                            ->reorderable()
                            ->maxFiles(12)
                            ->disk('public')
                            ->directory('elders/gallery')
                            ->visibility('public'),
                    ]),

                Section::make('نمایش')
                    ->columns(2)
                    ->schema([
                        TextInput::make('sort_order')
                            ->label('ترتیب نمایش')
                            ->numeric()
                            ->default(0)
                            ->required(),

                        Toggle::make('is_published')
                            ->label('نمایش در سایت')
                            ->default(true),
                    ]),
            ]);
    }

    private static function personLabel(Person $person): string
    {
        return $person->birth_year
            ? $person->full_name . ' (' . Fa::digits($person->birth_year) . ')'
            : $person->full_name;
    }
}
