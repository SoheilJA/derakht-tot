<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('elders', function (Blueprint $table) {
            $table->smallInteger('birth_year')->nullable();   // سال شمسی
            $table->smallInteger('death_year')->nullable();   // سال شمسی
            $table->string('birthplace')->nullable();
            $table->string('profession')->nullable();
            $table->json('achievements')->nullable();         // [{title, description}]
            $table->json('quotes')->nullable();
            $table->json('gallery')->nullable();              // مسیر تصاویر
        });
    }

    public function down(): void
    {
        Schema::table('elders', function (Blueprint $table) {
            $table->dropColumn([
                'birth_year', 'death_year', 'birthplace', 'profession',
                'achievements', 'quotes', 'gallery',
            ]);
        });
    }
};
