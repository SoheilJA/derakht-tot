<?php

namespace Database\Seeders;

use App\Models\Person;
use Illuminate\Database\Seeder;

/** داده‌ی نمونه فقط برای آزمایش شجره‌نامه؛ بعد از تست از پنل پاکش کن */
class FamilyDemoSeeder extends Seeder
{
    private const MARK = 'داده‌ی نمونه برای آزمایش شجره‌نامه';

    public function run(): void
    {
        if (Person::where('short_bio', self::MARK)->exists()) {
            return;
        }

        $make = fn (array $a) => Person::create($a + ['short_bio' => self::MARK]);

        // خانواده‌ی اول
        $hasan = $make(['first_name' => 'حسن', 'last_name' => 'توتی', 'gender' => 'm', 'birth_year' => 1290, 'death_year' => 1365]);
        $fatemeh = $make(['first_name' => 'فاطمه', 'last_name' => 'احمدی', 'gender' => 'f', 'birth_year' => 1295, 'death_year' => 1370]);

        $ali = $make(['first_name' => 'علی', 'last_name' => 'توتی', 'gender' => 'm', 'birth_year' => 1318, 'father_id' => $hasan->id, 'mother_id' => $fatemeh->id]);
        $maryam = $make(['first_name' => 'مریم', 'last_name' => 'توتی', 'gender' => 'f', 'birth_year' => 1322, 'father_id' => $hasan->id, 'mother_id' => $fatemeh->id]);
        $zahra = $make(['first_name' => 'زهرا', 'last_name' => 'کریمی', 'gender' => 'f', 'birth_year' => 1325]);

        $reza = $make(['first_name' => 'رضا', 'last_name' => 'توتی', 'gender' => 'm', 'birth_year' => 1348, 'father_id' => $ali->id, 'mother_id' => $zahra->id]);
        $sara = $make(['first_name' => 'سارا', 'last_name' => 'توتی', 'gender' => 'f', 'birth_year' => 1352, 'father_id' => $ali->id, 'mother_id' => $zahra->id]);
        $make(['first_name' => 'امیر', 'last_name' => 'توتی', 'gender' => 'm', 'birth_year' => 1378, 'father_id' => $reza->id]);
        $make(['first_name' => 'نگار', 'last_name' => 'توتی', 'gender' => 'f', 'birth_year' => 1382, 'father_id' => $reza->id]);

        // خانواده‌ی دوم
        $akbar = $make(['first_name' => 'اکبر', 'last_name' => 'رضایی', 'gender' => 'm', 'birth_year' => 1315, 'death_year' => 1390]);
        $narges = $make(['first_name' => 'نرگس', 'last_name' => 'رضایی', 'gender' => 'f', 'birth_year' => 1345, 'father_id' => $akbar->id, 'mother_id' => $maryam->id]);
        $make(['first_name' => 'پویا', 'last_name' => 'رضایی', 'gender' => 'm', 'birth_year' => 1348, 'father_id' => $akbar->id, 'mother_id' => $maryam->id]);
        $make(['first_name' => 'آرین', 'last_name' => 'رضایی', 'gender' => 'm', 'birth_year' => 1375, 'mother_id' => $narges->id]);
    }
}
