<?php

namespace Database\Seeders;

use App\Models\Fact;
use App\Models\Stat;
use Illuminate\Database\Seeder;

class VillageContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedFacts();
        $this->seedStats();
    }

    private function seedFacts(): void
    {
        if (Fact::exists()) {
            return;
        }

        $facts = [
            [
                'icon' => 'water',
                'title' => 'قنات زنده',
                'text' => 'قنات پنج‌کیلومتری روستا پس از قرن‌ها هنوز آب می‌دهد و ۱۲ رشته‌کاری از آن سیراب می‌شوند.',
            ],
            [
                'icon' => 'silk',
                'title' => 'خاستگاه ابریشم',
                'text' => 'تا سال ۱۳۷۰ هر خانه یک سبد کرم ابریشم داشت؛ هنوز کارگاه‌های خانگی فعال است.',
            ],
            [
                'icon' => 'mulberry',
                'title' => 'توتِ مقدس',
                'text' => 'بزرگ‌ترین توت روستا، «توتِ حاج رضا»، حدود دویست سال قدمت دارد و سایه‌بان محله است.',
            ],
            [
                'icon' => 'mountain',
                'title' => 'اقلیم چهارفصل',
                'text' => 'بهارِ خنک، تابستانِ معتدل در دامنه، پاییزِ زرین و زمینِ سفید؛ هر فصل یک رنگ.',
            ],
        ];

        foreach ($facts as $index => $fact) {
            Fact::create($fact + ['sort_order' => $index + 1]);
        }
    }

    private function seedStats(): void
    {
        if (Stat::exists()) {
            return;
        }

        $stats = [
            ['label' => 'جمعیت', 'value' => 1268, 'suffix' => 'نفر'],
            ['label' => 'خانوار', 'value' => 294, 'suffix' => null],
            ['label' => 'ارتفاع از دریا', 'value' => 1420, 'suffix' => 'متر'],
            ['label' => 'قدمت تاریخی', 'value' => 400, 'suffix' => 'سال'],
            ['label' => 'درخت توت کهن', 'value' => 120, 'suffix' => 'اصله'],
        ];

        foreach ($stats as $index => $stat) {
            Stat::create($stat + ['sort_order' => $index + 1]);
        }
    }
}
