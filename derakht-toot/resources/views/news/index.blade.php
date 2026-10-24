@php
    $home = app(\App\Settings\HomeSettings::class);
    $siteName = app(\App\Settings\SiteSettings::class)->site_name;
@endphp

<x-layouts.app :title="$home->news_title.' | '.$siteName" page="news" nav="news">
    <main id="main">
        <header class="relative bg-mulberry-900 text-cream-50 overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
            <div class="absolute inset-0 kilim-bg opacity-25" aria-hidden="true"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-transparent via-mulberry-900/40 to-mulberry-900"
                 aria-hidden="true"></div>
            <div class="relative container mx-auto px-5 md:px-8 text-center">
                <p class="text-gold-500 text-sm tracking-[.3em] mb-3 font-bold">{{ $home->news_kicker }}</p>
                <h1 class="font-display text-5xl md:text-7xl text-cream-50">{{ $home->news_title }}</h1>
            </div>
        </header>

        <section class="bg-cream-50 py-16 md:py-20">
            <div class="container mx-auto px-5 md:px-8">
                <livewire:news-list/>
            </div>
        </section>
    </main>
</x-layouts.app>
