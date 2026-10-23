<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration {
    public function up(): void
    {
        $this->migrator->add('home.hero_kicker', 'خراسانِ من، تُتِ من');
        $this->migrator->add('home.hero_title', 'درخت توت');
        $this->migrator->add('home.hero_subtitle', 'روستایی با ریشه‌هایی از تاریخ، شاخه‌هایی از مهربانی');
        $this->migrator->add('home.hero_primary_button', 'کشف روستا');
        $this->migrator->add('home.hero_secondary_button', 'شجره‌نامه سه‌بعدی');

        $this->migrator->add('home.about_kicker', 'درباره روستا');
        $this->migrator->add('home.about_title', 'روستایی که توت، اسمِ اوست');
        $this->migrator->add('home.about_paragraph_1', 'در دامنه‌ای خاکی‌رنگ، جایی که باد بوته‌های توت را نوازش می‌کند، روستای درخت توت نزدیک به چهارصد سال است نفس می‌کشد. اینجا قنات آب می‌دهد، توت سایه، و مردمِ آن صفا.');
        $this->migrator->add('home.about_paragraph_2', 'از دیرباز اهالی با کرم ابریشم و نخِ تازه‌ای که از توت بیرون می‌آید زندگی کرده‌اند؛ همان نخی که روایت‌شان را به شجره‌نامه‌ای بزرگ تبدیل کرده است.');

        $this->migrator->add('home.about_image_1', null);
        $this->migrator->add('home.about_image_1_alt', 'کوچه‌ای سنگ‌فرش‌شده در روستای درخت توت');
        $this->migrator->add('home.about_image_2', null);
        $this->migrator->add('home.about_image_2_alt', 'توتستان کهن روستا در نور صبح');
        $this->migrator->add('home.about_image_3', null);
        $this->migrator->add('home.about_image_3_alt', 'دستان یک بانوی روستایی در حال تاب دادن نخ ابریشم');
    }
};
