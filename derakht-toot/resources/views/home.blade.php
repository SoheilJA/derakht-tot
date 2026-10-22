<x-layouts.app title="درخت توت | روستایی با ریشه‌هایی از تاریخ"
               description="معرفی روستای درخت توت؛ تاریخچه، بزرگان، طبیعت، شجره‌نامه سه‌بعدی و اخبار روستایی در دل خراسان."
               page="home" nav="home">
    <main id="main">

        {{-- ============ A) هیرو ============ --}}
        <header id="hero"
                class="relative min-h-screen flex items-center justify-center overflow-hidden bg-mulberry-900">
            <canvas id="hero-canvas" class="absolute inset-0 w-full h-full" aria-hidden="true"></canvas>

            <div id="hero-fallback" class="hidden absolute inset-0"
                 style="background: linear-gradient(to bottom, #2B0A1F 0%, #5A1A3F 40%, #8E2C63 75%, #D4A24C 100%);"
                 aria-hidden="true"></div>

            <div class="absolute inset-0 bg-mulberry-900/20" aria-hidden="true"></div>

            <div class="relative z-10 text-center px-6 pt-24 pb-16">
                <p class="text-gold-500 tracking-[.4em] text-xs md:text-sm mb-6 opacity-0" data-hero-el="kicker">
                    {{ $home->hero_kicker }}
                </p>

                <h1 id="hero-title"
                    class="font-display text-[22vw] md:text-[10rem] leading-[1.05] text-cream-50 drop-shadow-[0_10px_30px_rgba(0,0,0,.35)]">
                    {{ $home->hero_title }}
                </h1>

                <p class="mt-6 text-cream-100/90 text-base md:text-2xl font-light max-w-xl mx-auto leading-9 opacity-0"
                   data-hero-el="sub">
                    {{ $home->hero_subtitle }}
                </p>

                <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0"
                     data-hero-el="cta">
                    <a href="#about" class="btn-primary" data-magnetic>
                        {{ $home->hero_primary_button }}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                            <path d="M12 5v14M6 11l6-6 6 6"/>
                        </svg>
                    </a>
                    <a href="/family-tree" class="btn-ghost" data-magnetic>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                            <circle cx="12" cy="4" r="2"/>
                            <circle cx="5" cy="12" r="2"/>
                            <circle cx="19" cy="12" r="2"/>
                            <circle cx="8" cy="20" r="2"/>
                            <circle cx="16" cy="20" r="2"/>
                            <path d="M12 6l-5.5 4M12 6l5.5 4M7 14l1 4M17 14l-1 4"/>
                        </svg>
                        {{ $home->hero_secondary_button }}
                    </a>
                </div>
            </div>

            <a href="#about"
               class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-cream-100/70 hover:text-cream-50 transition-colors"
               aria-label="اسکرول به پایین">
                <svg class="leaf-indicator w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c-5 0-9 4-9 10 0 5 4 9 9 10 5-1 9-5 9-10 0-6-4-10-9-10zm0 3c1 3 1 5 0 7-1-2-1-4 0-7z"
                          opacity=".85"/>
                </svg>
                <span class="block text-[10px] tracking-widest mt-1">ورق بزنید</span>
            </a>
        </header>

        <div class="branch-divider py-4 bg-cream-50" data-divider aria-hidden="true"></div>

        {{-- ============ B) درباره روستا ============ --}}
        <section id="about" class="relative bg-cream-50 py-20 md:py-28 overflow-hidden">
            <div class="container mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-14 items-center">

                {{-- کلاژ تصاویر --}}
                <div class="relative h-[420px] md:h-[520px]" id="about-collage">
                    <figure
                        class="absolute top-0 right-0 w-[62%] md:w-[58%] blob-a overflow-hidden shadow-2xl tilt"
                        data-parallax="18">
                        <img src="{{ \App\Support\Media::url($home->about_image_1) }}"
                             alt="{{ $home->about_image_1_alt }}" loading="lazy"
                             class="w-full h-[300px] md:h-[380px] object-cover">
                    </figure>

                    <figure
                        class="absolute bottom-0 left-0 w-[52%] md:w-[48%] blob-b overflow-hidden shadow-2xl tilt"
                        data-parallax="-26">
                        <img src="{{ \App\Support\Media::url($home->about_image_2) }}"
                             alt="{{ $home->about_image_2_alt }}" loading="lazy"
                             class="w-full h-[220px] md:h-[280px] object-cover">
                    </figure>

                    <figure
                        class="absolute bottom-24 left-[38%] w-[34%] hidden md:block leaf-mask overflow-hidden shadow-xl tilt"
                        data-parallax="34">
                        <img src="{{ \App\Support\Media::url($home->about_image_3) }}"
                             alt="{{ $home->about_image_3_alt }}" loading="lazy"
                             class="w-full h-[190px] object-cover">
                    </figure>
                </div>

                <div>
                    <p class="text-leaf-700 text-sm tracking-[.3em] mb-3 font-bold" data-reveal>
                        {{ $home->about_kicker }}
                    </p>
                    <h2 class="font-display text-4xl md:text-5xl text-mulberry-900 leading-tight mb-6" data-reveal>
                        {{ $home->about_title }}
                    </h2>
                    <p class="leading-9 text-bark-700 mb-4" data-reveal>{{ $home->about_paragraph_1 }}</p>
                    <p class="leading-9 text-bark-700" data-reveal>{{ $home->about_paragraph_2 }}</p>

                    {{-- لیست ویژگی‌ها: مرحله‌ی بعد --}}
                </div>
            </div>

            {{-- ردیف آمار: مرحله‌ی بعد --}}
        </section>

        <div class="branch-divider py-4 bg-cream-50" data-divider aria-hidden="true"></div>

    </main>
</x-layouts.app>
