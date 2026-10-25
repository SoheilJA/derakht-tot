<?php

namespace App\Filament\Pages;

use App\Settings\SiteSettings;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Pages\SettingsPage;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ManageSite extends SettingsPage
{
    protected static string $settings = SiteSettings::class;

    protected static ?string $navigationLabel = 'مشخصات و سئوی سایت';

    protected static ?string $title = 'مشخصات و سئوی سایت';

    protected static ?int $navigationSort = 0;

    public static function getNavigationGroup(): ?string
    {
        return 'محتوای سایت';
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('مشخصات سایت')
                    ->columns(2)
                    ->schema([
                        TextInput::make('site_name')
                            ->label('نام سایت')
                            ->required(),

                        TextInput::make('site_tagline')
                            ->label('شعار')
                            ->required(),

                        Textarea::make('default_description')
                            ->label('توضیح پیش‌فرض سایت')
                            ->helperText('برای صفحه‌هایی که توضیح اختصاصی ندارند؛ در نتایج جستجو و پیش‌نمایش لینک‌ها دیده می‌شود (حدود ۱۵۰ نویسه)')
                            ->rows(3)
                            ->required()
                            ->columnSpanFull(),

                        FileUpload::make('og_image')
                            ->label('تصویر پیش‌نمایش لینک')
                            ->helperText('وقتی لینک سایت در پیام‌رسان‌ها و شبکه‌های اجتماعی ارسال می‌شود نمایش داده می‌شود؛ اندازه‌ی مناسب ۱۲۰۰×۶۳۰ پیکسل')
                            ->image()
                            ->disk('public')
                            ->directory('site')
                            ->visibility('public')
                            ->columnSpanFull(),

                        Section::make('فوتر')
                            ->schema([
                                Textarea::make('footer_about')
                                    ->label('متن معرفی در فوتر')
                                    ->rows(3)
                                    ->required(),

                                TextInput::make('footer_credit')
                                    ->label('جمله‌ی پایین فوتر')
                                    ->required(),
                            ]),

                        Section::make('شبکه‌های اجتماعی')
                            ->description('هر کدام را که خالی بگذارید، آیکونش در فوتر نمایش داده نمی‌شود. آیکون ایمیل از اطلاعات تماس صفحه‌ی اصلی ساخته می‌شود.')
                            ->columns(3)
                            ->schema([
                                TextInput::make('telegram_url')
                                    ->label('تلگرام')
                                    ->url(),

                                TextInput::make('instagram_url')
                                    ->label('اینستاگرام')
                                    ->url(),

                                TextInput::make('whatsapp_url')
                                    ->label('واتساپ')
                                    ->url(),
                            ]),
                    ]),
            ]);
    }
}
