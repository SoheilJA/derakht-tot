<?php

namespace App\Support;

class Media
{
    /** آدرس تصویر آپلودشده، یا تصویر جایگزین لوکال وقتی تصویری نیست */
    public static function url(?string $path): string
    {
        return $path
            ? asset('storage/'.ltrim($path, '/'))
            : asset('images/placeholder.svg');
    }
}
