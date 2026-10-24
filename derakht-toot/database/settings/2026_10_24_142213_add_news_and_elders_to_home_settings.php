<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration {
    public function up(): void
    {
        $this->migrator->add('home.news_kicker', 'اخبار روستا');
        $this->migrator->add('home.news_title', 'از دلِ کوچه‌ها');
        $this->migrator->add('home.news_button', 'همه اخبار');

        $this->migrator->add('home.elders_kicker', 'بزرگان روستا');
        $this->migrator->add('home.elders_title', 'سایه‌ی این توت‌ها');
        $this->migrator->add('home.elders_button', 'همه بزرگان');
    }
};
