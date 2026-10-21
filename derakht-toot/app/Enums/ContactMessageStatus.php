<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum ContactMessageStatus: string implements HasColor, HasLabel
{
    case New = 'new';
    case Read = 'read';
    case Replied = 'replyed';
    case Archived = 'archived';

    public function getLabel(): string
    {
        return match ($this) {
            self::New => 'جدید',
            self::Read => 'خوانده‌شده',
            self::Replied => 'پاسخ داده‌شده',
            self::Archived => 'بایگانی',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::New => 'danger',
            self::Read => 'info',
            self::Replied => 'success',
            self::Archived => 'gray',
        };
    }

    public function label(): string
    {
        return $this->getLabel();
    }
}
