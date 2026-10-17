<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('elders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('elder_category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('person_id')->nullable()->constrained('people')->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('title');                     // مثل «کدخدای قدیم»
            $table->string('photo')->nullable();
            $table->text('summary')->nullable();
            $table->longText('bio')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('elders');
    }
};
