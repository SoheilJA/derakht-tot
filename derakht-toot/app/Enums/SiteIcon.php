<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum SiteIcon: string implements HasLabel
{
    case Water = 'water';
    case Silk = 'silk';
    case Mulberry = 'mulberry';
    case Mountain = 'mountain';
    case Dried = 'dried';
    case Craft = 'craft';
    case Ritual = 'ritual';

    public function getLabel(): string
    {
        return match ($this) {
            self::Water => 'قطره آب',
            self::Silk => 'ابریشم',
            self::Mulberry => 'توت',
            self::Mountain => 'کوه',
            self::Dried => 'توت خشک',
            self::Craft => 'صنایع دستی',
            self::Ritual => 'آیین (شعله)',
        };
    }

    /** SVG آماده‌ی نمایش؛ محتوا ثابت و از خود کد است، نه از کاربر */
    public function svg(int $size = 22, float $stroke = 1.7): string
    {
        return '<svg width="' . $size . '" height="' . $size . '" viewBox="0 0 24 24" fill="none" '
            . 'stroke="currentColor" stroke-width="' . $stroke . '" aria-hidden="true">'
            . $this->paths() . '</svg>';
    }

    private function paths(): string
    {
        return match ($this) {
            self::Water => '<path d="M12 3s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z"/>',
            self::Silk => '<path d="M7 4h10M7 20h10M8 4c0 5 8 5 8 10s-8 5-8 10M16 4c0 5-8 5-8 10s8 5 8 10"/>',
            self::Mulberry => '<circle cx="9" cy="9" r="2.4"/><circle cx="15" cy="9" r="2.4"/><circle cx="12" cy="14" r="2.4"/><path d="M12 21v-4"/>',
            self::Mountain => '<path d="M3 20L9 8l4 7 3-4 5 9H3z"/>',
            self::Dried => '<circle cx="9" cy="9" r="3"/><circle cx="15" cy="9" r="3"/><circle cx="12" cy="15" r="3"/>',
            self::Craft => '<path d="M4 8h16M4 16h16M8 8v8M12 8v8M16 8v8M4 8l2-3h12l2 3M4 16l2 3h12l2-3"/>',
            self::Ritual => '<path d="M12 3c2 3 5 5 5 9a5 5 0 01-10 0c0-4 3-6 5-9z"/><path d="M12 21v-3"/>',
        };
    }
}
