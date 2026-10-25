<?php

namespace Database\Seeders;

use App\Models\NavigationItem;
use Illuminate\Database\Seeder;

class NavigationSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['key' => 'home', 'label' => 'خانه', 'href' => '/', 'footer' => true],
            ['key' => 'about', 'label' => 'درباره روستا', 'href' => '/#about', 'footer' => true],
            ['key' => 'history', 'label' => 'تاریخچه', 'href' => '/#history', 'footer' => true],
            ['key' => 'news', 'label' => 'اخبار', 'href' => '/news', 'footer' => true],
            ['key' => 'elders', 'label' => 'بزرگان', 'href' => '/elders', 'footer' => true],
            ['key' => 'family', 'label' => 'شجره‌نامه', 'href' => '/family-tree', 'footer' => false],
            ['key' => 'contact', 'label' => 'تماس', 'href' => '/#contact', 'footer' => false],
        ];

        foreach ($items as $index => $item) {
            NavigationItem::firstOrCreate(
                ['key' => $item['key']],
                [
                    'label' => $item['label'],
                    'href' => $item['href'],
                    'sort_order' => $index + 1,
                    'show_in_header' => true,
                    'show_in_footer' => $item['footer'],
                ]
            );
        }
    }
}
