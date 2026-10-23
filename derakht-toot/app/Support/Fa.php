<?php

namespace App\Support;

use DateTimeInterface;
use Morilog\Jalali\Jalalian;

class Fa
{

    /** تبدیل اعداد لاتین به فارسی */
    public static function digits(string|int|null $value): string
    {
        return strtr((string)$value, [
            '0' => '۰', '1' => '۱', '2' => '۲', '3' => '۳', '4' => '۴',
            '5' => '۵', '6' => '۶', '7' => '۷', '8' => '۸', '9' => '۹',
        ]);
    }

    public static function date(?DateTimeInterface $date, string $format = 'j F Y'): ?string
    {
        if (!$date) {
            return null;
        }
        return self::digits(Jalalian::fromDateTime($date)->format($format));
    }

}
