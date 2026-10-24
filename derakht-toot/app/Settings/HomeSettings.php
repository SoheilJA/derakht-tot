<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class HomeSettings extends Settings
{
    // هیرو
    public string $hero_kicker;
    public string $hero_title;
    public string $hero_subtitle;
    public string $hero_primary_button;
    public string $hero_secondary_button;

    // درباره روستا
    public string $about_kicker;
    public string $about_title;
    public string $about_paragraph_1;
    public string $about_paragraph_2;
    public ?string $about_image_1;
    public string $about_image_1_alt;
    public ?string $about_image_2;
    public string $about_image_2_alt;
    public ?string $about_image_3;
    public string $about_image_3_alt;

    // گالری
    public string $gallery_kicker;
    public string $gallery_title;
    public string $gallery_description;

    // تاریخچه
    public string $history_kicker;
    public string $history_title;
    public string $history_description;

    // سنت‌ها و محصولات
    public string $traditions_kicker;
    public string $traditions_title;
    public string $traditions_description;

    // پیش‌نمایش اخبار
    public string $news_kicker;
    public string $news_title;
    public string $news_button;

    // پیش‌نمایش بزرگان
    public string $elders_kicker;
    public string $elders_title;
    public string $elders_button;

    // نمونه‌ی شجره‌نامه
    public string $tree_kicker;
    public string $tree_title;
    public string $tree_description;
    public string $tree_button;

    // تماس
    public string $contact_kicker;
    public string $contact_title;
    public string $contact_description;
    public string $contact_address;
    public string $contact_phone;
    public ?string $contact_email;
    public string $contact_hours;
    public ?string $contact_map_image;
    public string $contact_button;
    public string $contact_success_title;
    public string $contact_success_text;

    // سئو
    public string $meta_title;
    public string $meta_description;

    public static function group(): string
    {
        return 'home';
    }
}
