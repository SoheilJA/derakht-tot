@php
    $site = app(\App\Settings\SiteSettings::class);
    $home = app(\App\Settings\HomeSettings::class);
    $quick = \App\Models\NavigationItem::menu()->where('show_in_footer', true);

    $socials = collect([
        ['label' => 'تلگرام', 'url' => $site->telegram_url, 'path' => 'M22 3L2 11l6 2 2 7 4-5 5 4z'],
        ['label' => 'اینستاگرام', 'url' => $site->instagram_url, 'path' => 'M4 4h16v16H4zM12 8a4 4 0 100 8 4 4 0 000-8z'],
        ['label' => 'واتساپ', 'url' => $site->whatsapp_url, 'path' => 'M5 13a7 7 0 0114 0c0 3.9-3.1 7-7 7H5l2-3a7 7 0 01-2-4z'],
        ['label' => 'ایمیل', 'url' => $home->contact_email ? 'mailto:'.$home->contact_email : null, 'path' => 'M3 6h18v12H3zM3 6l9 7 9-7'],
    ])->filter(fn ($s) => filled($s['url']));
@endphp

<footer class="relative bg-leaf-900 text-cream-100 overflow-hidden">
    <div class="kilim-band"></div>
    <svg class="block w-full h-24 text-bark-700" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">
        <rect width="1200" height="14" fill="currentColor" />
        <g stroke="#4B3321" stroke-width="6" stroke-linecap="round" fill="none">
            <path class="ft-root"
                  d="M300,14 C290,45 265,60 240,78 M300,14 C310,50 330,62 352,80 M300,14 C296,40 300,70 296,95" />
            <path class="ft-root"
                  d="M600,14 C590,42 570,58 548,74 M600,14 C612,48 634,60 655,79 M600,14 C600,44 606,66 600,92" />
            <path class="ft-root" d="M900,14 C890,44 868,58 845,76 M900,14 C910,48 932,60 952,78" />
        </g>
    </svg>

    <div class="container mx-auto px-5 md:px-8 pb-10 grid md:grid-cols-4 gap-10">
        <div class="md:col-span-2">
            <div class="flex items-center gap-2.5 mb-4">
                <x-logo :size="34" />
                <span class="font-display text-2xl">{{ $site->site_name }}</span>
            </div>
            <p class="text-cream-100/60 text-sm leading-8 max-w-md">{{ $site->footer_about }}</p>

            @if ($socials->isNotEmpty())
                <div class="flex gap-3 mt-6">
                    @foreach ($socials as $social)
                        <a href="{{ $social['url'] }}" aria-label="{{ $social['label'] }}"
                           @unless (str_starts_with($social['url'], 'mailto:')) target="_blank" rel="noopener noreferrer" @endunless
                           class="w-10 h-10 rounded-full border border-cream-100/20 flex items-center justify-center hover:bg-mulberry-500 hover:border-mulberry-500 transition-all">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 stroke-width="1.7" stroke-linejoin="round" aria-hidden="true">
                                <path d="{{ $social['path'] }}" />
                            </svg>
                        </a>
                    @endforeach
                </div>
            @endif
        </div>

        <div>
            <h3 class="font-display text-lg text-gold-500 mb-4">دسترسی سریع</h3>
            <ul class="space-y-3 text-sm">
                @foreach ($quick as $item)
                    <li>
                        <a href="{{ url($item['href']) }}"
                           @unless (str_contains($item['href'], '#')) wire:navigate @endunless
                           class="hover:text-gold-500 transition-colors inline-flex items-center gap-2">
                            <span class="text-mulberry-300 text-xs">●</span>{{ $item['label'] }}
                        </a>
                    </li>
                @endforeach
            </ul>
        </div>

        <div>
            <h3 class="font-display text-lg text-gold-500 mb-4">تماس</h3>
            <ul class="space-y-3 text-sm text-cream-100/70 leading-7">
                <li>{{ $home->contact_address }}</li>
                <li dir="ltr" class="text-right">{{ $home->contact_phone }}</li>
                @if ($home->contact_email)
                    <li dir="ltr" class="text-right">{{ $home->contact_email }}</li>
                @endif
            </ul>
        </div>
    </div>

    <div class="border-t border-cream-100/10">
        <div
            class="container mx-auto px-5 md:px-8 py-5 flex items-center justify-center gap-1.5 text-cream-100/50 text-xs">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#8E2C63" aria-hidden="true">
                <path d="M12 21S4 14.8 4 9.5A4.5 4.5 0 0112 6a4.5 4.5 0 018 3.5C20 14.8 12 21 12 21z" />
            </svg>
            <span>{{ $site->footer_credit }}</span>
        </div>
    </div>
</footer>
