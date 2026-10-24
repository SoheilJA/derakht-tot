<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration {
    public function up(): void
    {
        $this->migrator->add('home.tree_kicker', 'شجره‌نامه روستا');
        $this->migrator->add('home.tree_title', "درختِ خانواده‌ها،\nشبانه و روشن");
        $this->migrator->add('home.tree_description', 'پنج نسل، دو خانواده، یک ریشه. در نمای سه‌بعدی شجره‌نامه بچرخید، افراد را پیدا کنید و مسیر تبارشان را روشن ببینید.');
        $this->migrator->add('home.tree_button', 'ورود به شجره‌نامه سه‌بعدی');

        $this->migrator->add('home.contact_kicker', 'تماس');
        $this->migrator->add('home.contact_title', 'هر که آمد، مهمان است');
        $this->migrator->add('home.contact_description', 'برای پیشنهاد، خاطره یا خبرِ تازه، پیام بگذارید؛ اهالی می‌شنوند.');
        $this->migrator->add('home.contact_address', 'خراسان رضوی، شهرستان تربت حیدریه، روستای درخت توت، ساختمان شورای روستا');
        $this->migrator->add('home.contact_phone', '۰۵۱-۵۲۲۴XXXX');
        $this->migrator->add('home.contact_email', 'salam@derakhtetoot.ir');
        $this->migrator->add('home.contact_hours', 'شنبه تا پنجشنبه، ۸ صبح تا ۲ بعدازظهر');
        $this->migrator->add('home.contact_map_image', null);
        $this->migrator->add('home.contact_button', 'فرستادن پیام');
        $this->migrator->add('home.contact_success_title', 'پیام شما رسید');
        $this->migrator->add('home.contact_success_text', 'سپاس از نوشتن‌تان؛ اهالی درخت توت به‌زودی پاسخ می‌دهند.');
    }
};
