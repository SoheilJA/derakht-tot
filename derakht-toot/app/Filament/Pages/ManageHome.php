<?php

namespace App\Filament\Pages;

use App\Settings\HomeSettings;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Pages\SettingsPage;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ManageHome extends SettingsPage
{
    protected static string $settings = HomeSettings::class;

    protected static ?string $navigationLabel = 'صفحه اصلی';

    protected static ?string $title = 'محتوای صفحه اصلی';

    protected static ?int $navigationSort = 1;

    public static function getNavigationGroup(): ?string
    {
        return 'محتوای سایت';
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('بخش اصلی (هیرو)')
                    ->columns(2)
                    ->schema([
                        TextInput::make('hero_kicker')
                            ->label('متن کوچک بالای عنوان')
                            ->required(),

                        TextInput::make('hero_title')
                            ->label('عنوان اصلی')
                            ->required(),

                        TextInput::make('hero_subtitle')
                            ->label('زیرعنوان')
                            ->required()
                            ->columnSpanFull(),

                        TextInput::make('hero_primary_button')
                            ->label('متن دکمه‌ی اصلی')
                            ->required(),

                        TextInput::make('hero_secondary_button')
                            ->label('متن دکمه‌ی دوم')
                            ->required(),
                    ]),

                Section::make('درباره روستا')
                    ->columns(2)
                    ->schema([
                        TextInput::make('about_kicker')
                            ->label('متن کوچک بالای عنوان')
                            ->required(),

                        TextInput::make('about_title')
                            ->label('عنوان')
                            ->required(),

                        Textarea::make('about_paragraph_1')
                            ->label('پاراگراف اول')
                            ->rows(4)
                            ->required()
                            ->columnSpanFull(),

                        Textarea::make('about_paragraph_2')
                            ->label('پاراگراف دوم')
                            ->rows(4)
                            ->required()
                            ->columnSpanFull(),
                    ]),

                Section::make('تصاویر بخش درباره روستا')
                    ->columns(2)
                    ->schema([
                        FileUpload::make('about_image_1')
                            ->label('تصویر اول')
                            ->image()
                            ->disk('public')
                            ->directory('home')
                            ->visibility('public'),

                        TextInput::make('about_image_1_alt')
                            ->label('توضیح تصویر اول (برای نابینایان و سئو)')
                            ->required(),

                        FileUpload::make('about_image_2')
                            ->label('تصویر دوم')
                            ->image()
                            ->disk('public')
                            ->directory('home')
                            ->visibility('public'),

                        TextInput::make('about_image_2_alt')
                            ->label('توضیح تصویر دوم')
                            ->required(),

                        FileUpload::make('about_image_3')
                            ->label('تصویر سوم')
                            ->image()
                            ->disk('public')
                            ->directory('home')
                            ->visibility('public'),

                        TextInput::make('about_image_3_alt')
                            ->label('توضیح تصویر سوم')
                            ->required(),
                    ]),

                Section::make('بخش گالری')
                    ->schema([
                        TextInput::make('gallery_kicker')
                            ->label('متن کوچک بالای عنوان')
                            ->required(),

                        TextInput::make('gallery_title')
                            ->label('عنوان')
                            ->required(),

                        Textarea::make('gallery_description')
                            ->label('توضیح کوتاه')
                            ->rows(3)
                            ->required(),
                    ]),

                Section::make('بخش تاریخچه')
                    ->schema([
                        TextInput::make('history_kicker')
                            ->label('متن کوچک بالای عنوان')
                            ->required(),

                        TextInput::make('history_title')
                            ->label('عنوان')
                            ->required(),

                        Textarea::make('history_description')
                            ->label('توضیح کوتاه')
                            ->rows(3)
                            ->required(),
                    ]),

                Section::make('بخش سنت‌ ها و محصولات')
                    ->schema([
                        TextInput::make('traditions_kicker')
                            ->label('متن کوچک بالای عنوان')
                            ->required(),

                        TextInput::make('traditions_title')
                            ->label('عنوان')
                            ->required(),

                        Textarea::make('traditions_description')
                            ->label('توضیح کوتاه')
                            ->rows(3)
                            ->required(),
                    ]),

                Section::make('پیش‌ نمایش اخبار')
                    ->columns(3)
                    ->schema([
                        TextInput::make('news_kicker')
                            ->label('متن کوچک بالای عنوان')
                            ->required(),

                        TextInput::make('news_title')
                            ->label('عنوان')
                            ->required(),

                        TextInput::make('news_button')
                            ->label('متن دکمه‌ی همه اخبار')
                            ->required(),
                    ]),

                Section::make('پیش‌ نمایش بزرگان')
                    ->columns(3)
                    ->schema([
                        TextInput::make('elders_kicker')
                            ->label('متن کوچک بالای عنوان')
                            ->required(),

                        TextInput::make('elders_title')
                            ->label('عنوان')
                            ->required(),

                        TextInput::make('elders_button')
                            ->label('متن دکمه‌ی همه بزرگان')
                            ->required(),
                    ]),

                Section::make('نمونه‌ی شجره‌نامه')
                    ->columns(2)
                    ->schema([
                        TextInput::make('tree_kicker')
                            ->label('متن کوچک بالای عنوان')
                            ->required(),

                        TextInput::make('tree_button')
                            ->label('متن دکمه')
                            ->required(),

                        Textarea::make('tree_title')
                            ->label('عنوان')
                            ->helperText('برای رفتن به خط بعد، Enter بزنید')
                            ->rows(2)
                            ->required()
                            ->columnSpanFull(),

                        Textarea::make('tree_description')
                            ->label('توضیح')
                            ->rows(3)
                            ->required()
                            ->columnSpanFull(),
                    ]),

                Section::make('تماس')
                    ->columns(2)
                    ->schema([
                        TextInput::make('contact_kicker')
                            ->label('متن کوچک بالای عنوان')
                            ->required(),

                        TextInput::make('contact_title')
                            ->label('عنوان')
                            ->required(),

                        Textarea::make('contact_description')
                            ->label('توضیح')
                            ->rows(2)
                            ->required()
                            ->columnSpanFull(),

                        Textarea::make('contact_address')
                            ->label('نشانی')
                            ->rows(2)
                            ->required()
                            ->columnSpanFull(),

                        TextInput::make('contact_phone')
                            ->label('تلفن')
                            ->required(),

                        TextInput::make('contact_email')
                            ->label('ایمیل (اختیاری)')
                            ->email(),

                        TextInput::make('contact_hours')
                            ->label('ساعت پاسخگویی')
                            ->required()
                            ->columnSpanFull(),

                        FileUpload::make('contact_map_image')
                            ->label('تصویر نقشه‌ی روستا (اختیاری)')
                            ->helperText('تصویر ثابت نقشه؛ بدون اینترنت هم نمایش داده می‌شود')
                            ->image()
                            ->disk('public')
                            ->directory('home')
                            ->visibility('public')
                            ->columnSpanFull(),

                        TextInput::make('contact_button')
                            ->label('متن دکمه‌ی ارسال')
                            ->required(),

                        TextInput::make('contact_success_title')
                            ->label('عنوان پیام موفقیت')
                            ->required(),

                        Textarea::make('contact_success_text')
                            ->label('متن پیام موفقیت')
                            ->rows(2)
                            ->required()
                            ->columnSpanFull(),
                    ]),

                Section::make('سئوی صفحه اصلی')
                    ->schema([
                        TextInput::make('meta_title')
                            ->label('عنوان صفحه (نمایش در تب مرورگر و نتایج جستجو)')
                            ->required(),

                        Textarea::make('meta_description')
                            ->label('توضیح صفحه')
                            ->helperText('حدود ۱۵۰ نویسه')
                            ->rows(3)
                            ->required(),
                    ]),
            ]);
    }
}
