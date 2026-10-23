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

    public static function group(): string
    {
        return 'home';
    }
}
