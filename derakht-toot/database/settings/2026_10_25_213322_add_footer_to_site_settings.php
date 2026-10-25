<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('site.footer_about', 'روستایی کوچک با مردمانی بزرگ؛ این وب‌گاه با همت اهالی ساخته شده تا خاطره، تاریخ و آدم‌های این خاک را برای نسل‌های بعد نگه دارد.');
        $this->migrator->add('site.footer_credit', 'ساخته شده با مهر برای اهالی درخت توت');
        $this->migrator->add('site.telegram_url', null);
        $this->migrator->add('site.instagram_url', null);
        $this->migrator->add('site.whatsapp_url', null);
    }
};
