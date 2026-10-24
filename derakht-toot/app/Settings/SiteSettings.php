<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class SiteSettings extends Settings
{
    public string $site_name;

    public string $site_tagline;

    public string $default_description;

    public ?string $og_image;

    public static function group(): string
    {
        return 'site';
    }
}
