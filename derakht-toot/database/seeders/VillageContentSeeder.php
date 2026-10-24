<?php

namespace Database\Seeders;

use App\Models\Fact;
use App\Models\Stat;
use Illuminate\Database\Seeder;
use App\Models\GalleryItem;
use App\Models\TimelineEvent;
use App\Models\Tradition;
use App\Models\Elder;
use App\Models\ElderCategory;

class VillageContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedFacts();
        $this->seedStats();
        $this->seedGallery();
        $this->seedTimeline();
        $this->seedTraditions();
        $this->seedElders();
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

    private function seedGallery(): void
    {
        if (GalleryItem::exists()) {
            return;
        }

        $items = [
            ['title' => 'توتستان سپیده‌دم', 'description' => 'نخستین نور روی برگ‌های توت', 'alt' => 'توتستان روستا در نور صبح'],
            ['title' => 'کوچه‌های سنگی', 'description' => 'پس‌کوچه‌هایی که بوی نان دارند', 'alt' => 'کوچه سنگ‌فرش روستا'],
            ['title' => 'سرِ قنات', 'description' => 'آبی که از دل کوه می‌آید', 'alt' => 'دهانه قنات قدیمی روستا'],
            ['title' => 'روز برداشت', 'description' => 'دست‌های رنگ‌گرفته از توت', 'alt' => 'برداشت توت در روستا'],
            ['title' => 'سرای ابریشم', 'description' => 'کارگاه خانگی ریسندگی', 'alt' => 'کارگاه ابریشم‌کشی روستا'],
            ['title' => 'مدرسه کهن', 'description' => 'کلاسی که چند نسل در آن نشستند', 'alt' => 'ساختمان قدیمی مدرسه روستا'],
            ['title' => 'غروب از بلندی', 'description' => 'روستا زیر نور طلایی', 'alt' => 'چشم‌انداز روستا هنگام غروب'],
            ['title' => 'دارِ قالی', 'description' => 'نقش توت، نقش خانه‌ها', 'alt' => 'دار قالی‌بافی در روستا'],
        ];

        foreach ($items as $index => $item) {
            GalleryItem::create($item + ['sort_order' => $index + 1]);
        }
    }

    private function seedTimeline(): void
    {
        if (TimelineEvent::exists()) {
            return;
        }

        $events = [
            ['year' => 1039, 'title' => 'نهادن نخستین نهال', 'text' => 'دو برادر از کاروانِ ابریشم راه، در حاشیه چشمه این دامنه ماندند و نخستین نهال توت را کاشتند؛ روستا نام خود را از همان درخت گرفت.'],
            ['year' => 1168, 'title' => 'کندن قنات', 'text' => 'با دست و بیل و صبرِ نسل‌ها، قنات پنج‌کیلومتری از دل کوه بیرون آمد و روستا برای همیشه از تشنگی رهایی یافت.'],
            ['year' => 1304, 'title' => 'ساختن مسجد کهن', 'text' => 'اهالی با خشت و کاه و کمرِ خمیده، مسجد محله را ساختند؛ گنبد کوچکی که هنوز هم صدای اذانش دل روستا است.'],
            ['year' => 1327, 'title' => 'دختران و پسران به مکتب رفتند', 'text' => 'نخستین کلاس سوادآموزی در خانه یکی از بزرگان گشایش یافت و نسلی که فقط به توتستان می‌رفت، با الفبا آشنا شد.'],
            ['year' => 1345, 'title' => 'جاده و برق', 'text' => 'جاده خاکی به آسفالت بدل شد و لامپ‌های نخستین در کوچه‌ها روشن شدند؛ شب‌ها دیگر همان شب‌های قبل نبود.'],
            ['year' => 1369, 'title' => 'تعاونی ابریشم', 'text' => 'زنان روستا دور یک دار جمع شدند و تعاونی ریسندگی و قالی‌بافی را بنیاد نهادند؛ نخِ توت، نانِ خانه‌ها شد.'],
            ['year' => 1389, 'title' => 'احداث مدرسه جدید', 'text' => 'مدرسه دوطبقه با کمک خیرین و دست اهالی ساخته شد و کلاس‌های چندکلاسه به یادگار ماند.'],
            ['year' => 1402, 'title' => 'روستای هوشمند', 'text' => 'اینترنت پرسرعت به درخت توت رسید و فروشگاه اینترنتی محصولات روستا، توت خشک و ابریشم را به شهرهای دور رساند.'],
        ];

        foreach ($events as $event) {
            TimelineEvent::create($event);
        }
    }

    private function seedTraditions(): void
    {
        if (Tradition::exists()) {
            return;
        }

        $items = [
            ['icon' => 'dried', 'title' => 'توت‌های خشک', 'text' => 'هر تیرماه، حیاط‌ها رونق می‌گیرد؛ توت‌ها را پهن می‌کنند و خشکِ شیرینِ آن، سوغات همه‌فصل روستاست.'],
            ['icon' => 'silk', 'title' => 'ابریشم', 'text' => 'از برگ توت تا نخ ابریشم؛ هنری که مادران به دختران سپرده‌اند و هنوز در کارگاه خانگی نفس می‌کشد.'],
            ['icon' => 'craft', 'title' => 'صنایع دستی', 'text' => 'قالی با نقش توت، حصیر با بافت مرداب، و سفالِ خام؛ دست‌های روستا همیشه چیزی برای گفتن دارد.'],
            ['icon' => 'ritual', 'title' => 'آیین‌ها', 'text' => 'نوروزخوانی در اسفند، سفره‌ی هفت‌سین جمعی و «جشن شربت توت» در تیر؛ تقویمی که با شادی گره خورده است.'],
        ];

        foreach ($items as $index => $item) {
            Tradition::create($item + ['sort_order' => $index + 1]);
        }
    }

    private function seedElders(): void
    {
        if (Elder::exists()) {
            return;
        }

        // دسته‌ها: اگر قبلاً با همین نام ساخته شده باشند، دوباره ساخته نمی‌شوند
        $categories = [];
        foreach ([
                     ['name' => 'کدخدا', 'slug' => 'kadkhoda'],
                     ['name' => 'هنرمند', 'slug' => 'honarmand'],
                     ['name' => 'معلم', 'slug' => 'moalem'],
                     ['name' => 'کشاورز', 'slug' => 'keshavarz'],
                     ['name' => 'روحانی', 'slug' => 'rohani'],
                 ] as $index => $category) {
            $categories[$category['name']] = ElderCategory::firstOrCreate(
                ['name' => $category['name']],
                ['slug' => $category['slug'], 'sort_order' => $index + 1],
            );
        }

        $elders = [
            ['slug' => 'haj-reza-sadeghi', 'first_name' => 'حاج رضا', 'last_name' => 'صادقی', 'title' => 'کدخدای پیشین روستا', 'birth_year' => 1299, 'death_year' => 1374, 'profession' => 'کشاورز و کدخدا', 'category' => 'کدخدا'],
            ['slug' => 'gohar-taj-sadeghi', 'first_name' => 'گوهر تاج', 'last_name' => 'صادقی', 'title' => 'مادرِ قالی‌بافی روستا', 'birth_year' => 1304, 'death_year' => 1391, 'profession' => 'قالی‌باف', 'category' => 'هنرمند'],
            ['slug' => 'zahra-sadeghi', 'first_name' => 'زهرا', 'last_name' => 'صادقی', 'title' => 'بانوی نخ و نقش', 'birth_year' => 1330, 'death_year' => null, 'profession' => 'قالی‌باف و مدرس بافی', 'category' => 'هنرمند'],
            ['slug' => 'hossein-sadeghi', 'first_name' => 'حسین', 'last_name' => 'صادقی', 'title' => 'معلم بازنشسته و خاطره‌نویس', 'birth_year' => 1334, 'death_year' => 1397, 'profession' => 'معلم ابتدایی', 'category' => 'معلم'],
            ['slug' => 'ali-sadeghi', 'first_name' => 'علی', 'last_name' => 'صادقی', 'title' => 'پاسدارِ توتستان‌ها', 'birth_year' => 1351, 'death_year' => null, 'profession' => 'مهندس کشاورزی', 'category' => 'کشاورز'],
            ['slug' => 'ghorban-rostami', 'first_name' => 'قربان', 'last_name' => 'رستمی', 'title' => 'پیرِ باغبان', 'birth_year' => 1319, 'death_year' => null, 'profession' => 'باغبان', 'category' => 'کشاورز'],
            ['slug' => 'asadollah-moradi', 'first_name' => 'حاج اسداله', 'last_name' => 'مرادی', 'title' => 'امام جماعت پیشین روستا', 'birth_year' => 1307, 'death_year' => 1387, 'profession' => 'روحانی', 'category' => 'روحانی'],
            ['slug' => 'ahmad-moradi', 'first_name' => 'احمد', 'last_name' => 'مرادی', 'title' => 'معلم قرآن و ادبیات', 'birth_year' => 1332, 'death_year' => null, 'profession' => 'معلم', 'category' => 'معلم'],
            ['slug' => 'mahboobeh-moradi', 'first_name' => 'محبوبه', 'last_name' => 'مرادی', 'title' => 'قلم‌زن و نگارگر', 'birth_year' => 1336, 'death_year' => null, 'profession' => 'نگارگر و قلم‌زن', 'category' => 'هنرمند'],
            ['slug' => 'ziba-farhamand', 'first_name' => 'زیبا', 'last_name' => 'فرهمند', 'title' => 'سفال‌گرِ جوان', 'birth_year' => 1364, 'death_year' => null, 'profession' => 'سفال‌گر', 'category' => 'هنرمند'],
        ];

        foreach ($elders as $index => $elder) {
            $category = $categories[$elder['category']];
            unset($elder['category']);

            Elder::create($elder + [
                    'elder_category_id' => $category->id,
                    'birthplace' => 'درخت توت',
                    'sort_order' => $index + 1,
                    'is_published' => true,
                ]);
        }
    }
}
