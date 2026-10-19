<?php

namespace App\Models;

use App\Enums\ContactMessageStatus;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'message',
        'status',
        'admin_note',
        'ip_address',
    ];

    protected $attributes = [
        'status' => 'new',
    ];

    protected function casts(): array
    {
        return ['status' => ContactMessageStatus::class];

    }
}
