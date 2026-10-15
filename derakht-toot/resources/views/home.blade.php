<x-layouts.app title="درخت توت | روستایی با ریشه‌هایی از تاریخ"
    description="معرفی روستای درخت توت؛ تاریخچه، بزرگان، طبیعت، شجره‌نامه سه‌بعدی و اخبار روستایی در دل خراسان."
    page="home" nav="home">
    <main id="main">
        <section class="relative min-h-screen flex items-center justify-center bg-mulberry-900 text-cream-50 kilim-bg">
            <div class="text-center px-6">
                <h1 class="font-display text-7xl">{{ config('app.name') }}</h1>
                <p class="mt-4 text-gold-500">تست layout اصلی</p>
                <div class="mt-8 flex justify-center gap-4">
                    <a href="#" class="btn-primary">دکمه اصلی</a>
                    <a href="#" class="btn-ghost on-dark">دکمه دوم</a>
                </div>
            </div>
        </section>
    </main>
</x-layouts.app>
