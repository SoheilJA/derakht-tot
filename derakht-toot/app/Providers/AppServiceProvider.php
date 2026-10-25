<?php

namespace App\Providers;

use Filament\Forms\Components\FileUpload;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        FileUpload::configureUsing(function (FileUpload $upload): void {
            $upload
                ->imageResizeMode('contain')
                ->imageResizeTargetWidth('1800')
                ->imageResizeTargetHeight('1800')
                ->imageResizeUpscale(false)
                ->maxSize(8192);
        });
    }
}
