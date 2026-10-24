<x-layouts.app title="صفحه پیدا نشد" page="404" bodyClass="bg-mulberry-900 text-cream-50">
    @push('head')
        <meta name="robots" content="noindex">
    @endpush

    <main id="main" class="min-h-screen flex items-center justify-center px-6 py-32 relative overflow-hidden">
        <div class="absolute inset-0 kilim-bg opacity-20" aria-hidden="true"></div>

        <div class="relative text-center max-w-lg">
            <svg class="w-28 h-28 mx-auto mb-8 leaf-indicator" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <path
                    d="M24 4C15 4 9 10.5 9 18.5 9 24 12.5 27.5 16 29l1.5 13h13L32 29c3.5-1.5 7-5 7-10.5C39 10.5 33 4 24 4z"
                    fill="#3E8E41" />
                <path d="M26 6l16 16M30 2l16 16M22 10l16 16" stroke="#D4A24C" stroke-width="2"
                      stroke-linecap="round" />
                <rect x="21.5" y="26" width="5" height="16" rx="2" fill="#4B3321" />
            </svg>

            <p class="font-display text-8xl md:text-9xl text-gold-500 leading-none">۴۰۴</p>
            <h1 class="font-display text-3xl md:text-4xl mt-4">این شاخه را باد برده است</h1>
            <p class="mt-4 text-cream-100/70 leading-9">
                صفحه‌ای که دنبالش بودید در این درخت نیامد؛ اما ریشه‌ها هنوز سرِ جایشان هستند.
            </p>

            <div class="mt-8 flex flex-wrap justify-center gap-4">
                <a href="{{ url('/') }}" class="btn-primary" data-magnetic>بازگشت به خانه</a>
                <a href="{{ url('/news') }}" class="btn-ghost on-dark" data-magnetic>اخبار روستا</a>
                <a href="{{ url('/family-tree') }}" class="btn-ghost on-dark" data-magnetic>شجره‌نامه</a>
            </div>
        </div>
    </main>
</x-layouts.app>
