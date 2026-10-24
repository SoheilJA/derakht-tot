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

    /** تبدیل ارقام فارسی و عربی به لاتین (برای اعتبارسنجی شماره موبایل) */
    public static function latinDigits(string|int|null $value): string
    {
        return strtr((string)$value, [
            '۰' => '0', '۱' => '1', '۲' => '2', '۳' => '3', '۴' => '4',
            '۵' => '5', '۶' => '6', '۷' => '7', '۸' => '8', '۹' => '9',
            '٠' => '0', '١' => '1', '٢' => '2', '٣' => '3', '٤' => '4',
            '٥' => '5', '٦' => '6', '٧' => '7', '٨' => '8', '٩' => '9',
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
