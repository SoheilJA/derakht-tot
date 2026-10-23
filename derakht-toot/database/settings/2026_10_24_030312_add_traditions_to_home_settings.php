<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('home.traditions_kicker', 'سنت‌ها و محصولات');
        $this->migrator->add('home.traditions_title', 'هرچه از توت برمی‌آید');
        $this->migrator->add('home.traditions_description', 'نخی که به ابریشم می‌رسد، توتی که به شربت بدل می‌شود، و آیینی که هر سال روستا را جوان می‌کند.');
    }
};
