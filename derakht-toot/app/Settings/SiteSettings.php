<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class SiteSettings extends Settings
{
    public string $site_name;

    public string $site_tagline;

    public string $default_description;

    public ?string $og_image;

    public string $footer_about;

    public string $footer_credit;

    public ?string $telegram_url;

    public ?string $instagram_url;

    public ?string $whatsapp_url;

    public static function group(): string
    {
        return 'site';
    }
}
