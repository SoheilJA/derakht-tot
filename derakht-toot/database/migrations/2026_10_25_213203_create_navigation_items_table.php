<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('navigation_items', function (Blueprint $table) {
            $table->id();
            $table->string('key', 30)->unique();   // شناسه‌ی داخلی برای تشخیص لینک فعال
            $table->string('label');
            $table->string('href');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('show_in_header')->default(true);
            $table->boolean('show_in_footer')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('navigation_items');
    }
};
