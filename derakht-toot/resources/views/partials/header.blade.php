@php($items = config('navigation'))

<nav id="site-nav" class="fixed top-0 inset-x-0 z-50 transition-all duration-500" aria-label="ناوبری اصلی">
    <div
        class="nav-inner container mx-auto px-5 md:px-8 flex items-center justify-between py-4 transition-all duration-500">
        <a href="{{ url('/') }}" wire:navigate class="flex items-center gap-2.5 group"
            aria-label="{{ config('app.name') }} — صفحه اصلی">
            <x-logo :size="34" />
            <span
                class="font-display text-2xl text-cream-50 group-hover:text-gold-500 transition-colors">{{ config('app.name') }}</span>
        </a>

        <div class="hidden lg:flex items-center gap-6">
            @foreach ($items as $item)
                <a data-navlink="{{ $item['id'] }}" href="{{ url($item['href']) }}"
                    @unless (str_contains($item['href'], '#')) wire:navigate @endunless
                    class="relative py-2 px-1 text-sm text-cream-50/85 hover:text-cream-50 transition-colors">
                    {{ $item['label'] }}
                    <span
                        class="nav-leaf absolute -bottom-1 right-1/2 translate-x-1/2 text-gold-500 opacity-0 scale-0 transition-all duration-300">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 2C7 2 3 6.5 3 12c0 5 4 9.5 9 10 5-.5 9-5 9-10 0-5.5-4-10-9-10zm0 3.2c1.2 3.4 1.2 6.2 0 8.6-1.2-2.4-1.2-5.2 0-8.6z" />
                        </svg>
                    </span>
                </a>
            @endforeach
        </div>

        <button id="menu-btn"
            class="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-cream-50/25"
            aria-label="باز کردن منو" aria-expanded="false">
            <span class="menu-line block w-5 h-0.5 bg-cream-50 transition-all"></span>
            <span class="menu-line block w-5 h-0.5 bg-cream-50 transition-all"></span>
            <span class="menu-line block w-3.5 h-0.5 bg-cream-50 transition-all self-center mr-3"></span>
        </button>
    </div>
</nav>

<div id="mobile-menu" class="fixed inset-0 z-[90] bg-mulberry-900 hidden" role="dialog" aria-modal="true"
    aria-label="منوی موبایل">
    <svg class="absolute left-[-10%] bottom-0 h-[80%] opacity-[.13]" viewBox="0 0 300 600" fill="none"
        aria-hidden="true">
        <path class="mm-branch" d="M150,600 C150,470 120,420 90,370 C60,320 70,250 100,200 C130,150 120,90 150,20"
            stroke="#8BC17A" stroke-width="7" stroke-linecap="round" />
        <path class="mm-branch" d="M150,600 C160,480 190,430 230,380 C260,340 250,270 220,220" stroke="#8E2C63"
            stroke-width="5" stroke-linecap="round" />
    </svg>
    <div class="relative h-full flex flex-col items-center justify-center gap-7 px-8">
        @foreach ($items as $item)
            <a href="{{ $item['href'] }}" @unless (str_contains($item['href'], '#')) @endunless
                class="mm-link block font-display text-3xl text-cream-50 hover:text-gold-500 transition-colors"
                style="opacity:0">
                {{ $item['label'] }}
            </a>
        @endforeach
        <p class="text-cream-100/40 text-xs mt-4">روستای {{ config('app.name') }} — خراسان</p>
    </div>
</div>
