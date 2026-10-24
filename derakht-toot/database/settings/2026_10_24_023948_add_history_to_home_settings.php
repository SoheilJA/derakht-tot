<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration {
    public function up(): void
    {
        $this->migrator->add('home.history_kicker', 'تاریخچه');
        $this->migrator->add('home.history_title', 'تنه‌ی زمان، سال‌به‌سال');
        $this->migrator->add('home.history_description', 'با هر حلقه از تنه‌ی این درخت، رویدادی از زندگی روستا؛ از دو برادری که نخستین نهال را کاشتند تا امروز.');
    }
};
