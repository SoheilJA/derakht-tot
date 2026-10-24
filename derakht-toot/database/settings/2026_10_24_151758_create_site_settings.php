<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('site.site_name', 'درخت توت');
        $this->migrator->add('site.site_tagline', 'روستایی با ریشه‌هایی از تاریخ و شاخه‌هایی از مهربانی');
        $this->migrator->add('site.default_description', 'معرفی روستای درخت توت؛ تاریخچه، بزرگان، طبیعت، شجره‌نامه سه‌بعدی و اخبار روستایی در دل خراسان.');
        $this->migrator->add('site.og_image', null);
    }
};
