<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('home.gallery_kicker', 'طبیعت و زندگی');
        $this->migrator->add('home.gallery_title', 'روستا را با چشمِ اهلش ببینید');
        $this->migrator->add('home.gallery_description', 'اسکرول کنید تا روستا آرام‌آرام ورق بخورد؛ از توتستان‌ها تا سرای ابریشم.');
    }
};
