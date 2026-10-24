@php
    $home = app(\App\Settings\HomeSettings::class);
    $siteName = app(\App\Settings\SiteSettings::class)->site_name;
@endphp

<x-layouts.app :title="$home->elders_title.' | '.$siteName" page="elders" nav="elders">
    <main id="main">
        <section class="relative bg-leaf-900 overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
            <div class="absolute inset-0 kilim-bg opacity-15" aria-hidden="true"></div>
            <div class="relative container mx-auto px-5 md:px-8 text-center">
                <p class="text-leaf-300 text-sm tracking-[.3em] mb-3 font-bold">{{ $home->elders_kicker }}</p>
                <h1 class="font-display text-5xl md:text-7xl text-cream-50">{{ $home->elders_title }}</h1>
            </div>
        </section>

        <section class="bg-cream-50 py-14 md:py-20 min-h-[60vh]">
            <div class="container mx-auto px-5 md:px-8">
                <livewire:elder-list />
            </div>
        </section>
    </main>
</x-layouts.app>
