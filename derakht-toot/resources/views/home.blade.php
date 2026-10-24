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

                    {{-- لیست ویژگی‌ها --}}
                    @if ($facts->isNotEmpty())
                        <ul class="mt-8 space-y-4" id="facts">
                            @foreach ($facts as $fact)
                                <li class="flex items-start gap-3" data-reveal="{{ $loop->index * 0.08 }}">
                                    <span
                                        class="shrink-0 w-10 h-10 rounded-full bg-leaf-900 text-leaf-300 flex items-center justify-center">
                                        {!! $fact->icon->svg(22, 1.7) !!}
                                    </span>
                                    <div>
                                        <b class="block text-bark-900">{{ $fact->title }}</b>
                                        <span class="text-sm text-bark-700/85 leading-7">{{ $fact->text }}</span>
                                    </div>
                                </li>
                            @endforeach
                        </ul>
                    @endif

                </div>
            </div>

            {{-- ردیف آمار --}}
            @if ($stats->isNotEmpty())
                <div class="container mx-auto px-5 md:px-8 mt-16">
                    <div id="stats-row" class="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                        @foreach ($stats as $stat)
                            <div class="stat-card bg-cream-100 border border-sand-300 rounded-3xl px-4 py-6 text-center"
                                 data-reveal>
                                <div class="font-display text-3xl md:text-4xl text-mulberry-700">
                                    <span class="stat-num"
                                          data-target="{{ $stat->value }}">{{ \App\Support\Fa::digits($stat->value) }}</span>@if ($stat->suffix)
                                        <span
                                            class="text-lg text-mulberry-300 font-body"> {{ $stat->suffix }}</span>
                                    @endif
                                </div>
                                <div class="text-xs md:text-sm text-bark-700/70 mt-1">{{ $stat->label }}</div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif
        </section>
        <div class="branch-divider py-4 bg-cream-50" data-divider aria-hidden="true"></div>

        {{-- ============ C) گالری (اسکرول افقی پین‌شده) ============ --}}
        @if ($galleryItems->isNotEmpty())
            <section id="gallery" class="bg-mulberry-900 py-20 md:py-24 overflow-hidden">
                <div
                    class="container mx-auto px-5 md:px-8 mb-10 flex items-end justify-between flex-wrap gap-4">
                    <div>
                        <p class="text-gold-500 text-sm tracking-[.3em] mb-3 font-bold" data-reveal>
                            {{ $home->gallery_kicker }}
                        </p>
                        <h2 class="font-display text-4xl md:text-5xl text-cream-50" data-reveal>
                            {{ $home->gallery_title }}
                        </h2>
                    </div>
                    <p class="text-cream-100/60 text-sm max-w-xs leading-7" data-reveal>
                        {{ $home->gallery_description }}
                    </p>
                </div>

                <div id="gallery-pin" class="overflow-hidden max-md:overflow-x-auto max-md:snap-x">
                    <div id="gallery-track" class="flex gap-5 md:gap-8 px-5 md:px-16 w-max max-md:pb-4">
                        @foreach ($galleryItems as $item)
                            <figure
                                class="g-card group relative shrink-0 w-[78vw] sm:w-[420px] rounded-[26px] overflow-hidden shadow-2xl cursor-pointer max-md:snap-center"
                                data-cursor="view" data-gi="{{ $loop->index }}"
                                data-caption="{{ $item->title }}{{ $item->description ? ' — '.$item->description : '' }}"
                                tabindex="0" role="button" aria-label="بزرگ‌نمایی {{ $item->title }}">
                                <div class="h-[56vh] overflow-hidden">
                                    <img src="{{ $item->image_url }}" alt="{{ $item->alt ?: $item->title }}"
                                         loading="lazy"
                                         class="g-img w-full h-full object-cover scale-110 transition-transform duration-[900ms] group-hover:scale-125">
                                </div>
                                <figcaption
                                    class="absolute inset-x-0 bottom-0 p-5 pt-14 bg-gradient-to-t from-black/75 to-transparent text-cream-50">
                                    <h3 class="font-display text-2xl">{{ $item->title }}</h3>
                                    @if ($item->description)
                                        <p class="text-sm text-cream-100/75">{{ $item->description }}</p>
                                    @endif
                                </figcaption>
                            </figure>
                        @endforeach
                    </div>
                </div>
            </section>

            <div class="branch-divider py-4 bg-cream-50" data-divider aria-hidden="true"></div>
        @endif

        {{-- ============ D) تاریخچه (تنه‌ی در حال رشد) ============ --}}
        @if ($timeline->isNotEmpty())
            <section id="history" class="bg-cream-50 py-20 md:py-28">
                <div class="container mx-auto px-5 md:px-8">
                    <div class="text-center max-w-2xl mx-auto mb-16">
                        <p class="text-mulberry-500 text-sm tracking-[.3em] mb-3 font-bold" data-reveal>
                            {{ $home->history_kicker }}
                        </p>
                        <h2 class="font-display text-4xl md:text-5xl text-bark-900 mb-5" data-reveal>
                            {{ $home->history_title }}
                        </h2>
                        <p class="leading-9 text-bark-700" data-reveal>{{ $home->history_description }}</p>
                    </div>

                    <div id="timeline" class="relative">
                        @foreach ($timeline as $event)
                            <div
                                class="tl-row flex {{ $loop->even ? 'justify-start' : 'justify-start md:justify-end' }}">
                                <article
                                    class="tl-card relative z-10 w-full md:w-[44%] mb-10 md:mb-16 mr-12 md:mr-0 bg-cream-50 border border-sand-300 rounded-[26px] p-6 shadow-[0_20px_50px_-30px_rgba(74,51,33,.5)]">
                                    <div class="flex items-baseline gap-3 mb-1">
                                        <span class="tl-year font-display text-4xl text-mulberry-500"
                                              data-year="{{ $event->year }}">{{ \App\Support\Fa::digits($event->year) }}</span>
                                        <span class="text-xs text-bark-500">شمسی</span>
                                    </div>
                                    <h3 class="font-display text-2xl text-bark-900 mb-2">{{ $event->title }}</h3>
                                    <p class="text-bark-700/90 leading-8 text-sm md:text-base">{{ $event->text }}</p>
                                </article>
                            </div>
                        @endforeach
                    </div>
                </div>
            </section>

            <div class="branch-divider py-4 bg-cream-50" data-divider aria-hidden="true"></div>
        @endif

        {{-- ============ E) سنت‌ها و محصولات ============ --}}
        @if ($traditions->isNotEmpty())
            <section id="traditions" class="relative bg-leaf-900 py-20 md:py-28 overflow-hidden">
                <div class="container mx-auto px-5 md:px-8 relative">
                    {{-- رشته‌ی ابریشمی که با اسکرول کشیده می‌شود --}}
                    <svg class="absolute hidden md:block inset-0 w-full h-full pointer-events-none"
                         viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden="true">
                        <path id="silk-path" d="M40,90 C220,180 280,40 500,120 S760,200 960,80" fill="none"
                              stroke="#D4A24C" stroke-width="1.5" stroke-dasharray="7 7" opacity=".8"/>
                    </svg>

                    <div class="relative text-center mb-14">
                        <p class="text-leaf-300 text-sm tracking-[.3em] mb-3 font-bold" data-reveal>
                            {{ $home->traditions_kicker }}
                        </p>
                        <h2 class="font-display text-4xl md:text-5xl text-cream-50 mb-5" data-reveal>
                            {{ $home->traditions_title }}
                        </h2>
                        <p class="leading-9 text-cream-100/70 max-w-xl mx-auto" data-reveal>
                            {{ $home->traditions_description }}
                        </p>
                    </div>

                    <div id="traditions-grid" class="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        @foreach ($traditions as $tradition)
                            <article
                                class="trad-card group bg-leaf-900/60 backdrop-blur-sm border border-leaf-700/60 rounded-[26px] p-6 text-center"
                                data-reveal="{{ $loop->index * 0.08 }}">
                                <div
                                    class="trad-icon w-16 h-16 mx-auto rounded-full bg-mulberry-900 border border-gold-500/30 text-gold-500 flex items-center justify-center mb-4 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                                    {!! $tradition->icon->svg(30, 1.6) !!}
                                </div>
                                <h3 class="font-display text-2xl text-cream-50 mb-2">{{ $tradition->title }}</h3>
                                <p class="text-sm text-cream-100/65 leading-7">{{ $tradition->text }}</p>
                            </article>
                        @endforeach
                    </div>
                </div>
            </section>
        @endif

        {{-- ============ F) پیش‌نمایش اخبار ============ --}}
        @if ($latestNews->isNotEmpty())
            <section id="news-preview" class="bg-cream-50 py-20 md:py-28">
                <div class="container mx-auto px-5 md:px-8">
                    <div class="flex items-end justify-between flex-wrap gap-4 mb-10">
                        <div>
                            <p class="text-mulberry-500 text-sm tracking-[.3em] mb-3 font-bold" data-reveal>
                                {{ $home->news_kicker }}
                            </p>
                            <h2 class="font-display text-4xl md:text-5xl text-bark-900" data-reveal>
                                {{ $home->news_title }}
                            </h2>
                        </div>
                        <a href="{{ url('/news') }}" wire:navigate class="btn-ghost" data-magnetic data-reveal>
                            {{ $home->news_button }}
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 stroke-width="2">
                                <path d="M19 12H5M11 18l-6-6 6-6"/>
                            </svg>
                        </a>
                    </div>

                    <div id="home-news-grid" class="grid md:grid-cols-3 gap-6">
                        @foreach ($latestNews as $item)
                            @php $big = $loop->first; @endphp
                            <a href="{{ url('/news/'.$item->slug) }}" wire:navigate
                               class="news-card group {{ $big ? 'md:col-span-2 md:row-span-2' : '' }} relative rounded-[26px] overflow-hidden bg-mulberry-900 shadow-xl"
                               data-cursor="view" data-reveal="{{ $loop->index * 0.07 }}">
                                <img src="{{ \App\Support\Media::url($item->cover_image) }}"
                                     alt="{{ $item->title }}" loading="lazy"
                                     class="w-full h-full {{ $big ? 'min-h-[340px]' : 'h-52 md:h-full min-h-[200px]' }} object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700">
                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-mulberry-900/90 via-mulberry-900/20 to-transparent">
                                </div>
                                <div class="absolute inset-x-0 bottom-0 p-5 md:p-6 text-cream-50">
                                    <div class="flex items-center gap-2 mb-2">
                                        @if ($item->category)
                                            <span
                                                class="text-[11px] bg-gold-500 text-mulberry-900 font-bold px-2.5 py-0.5 rounded-full">{{ $item->category->name }}</span>
                                        @endif
                                        <span
                                            class="text-[11px] text-cream-100/70">{{ \App\Support\Fa::date($item->published_at) }}</span>
                                    </div>
                                    <h3
                                        class="font-display {{ $big ? 'text-2xl md:text-3xl' : 'text-xl' }} leading-snug">
                                        {{ $item->title }}</h3>
                                    @if ($big && $item->summary)
                                        <p class="text-sm text-cream-100/75 mt-2 leading-7 hidden md:block">
                                            {{ $item->summary }}</p>
                                    @endif
                                    <span class="leaf-read inline-flex items-center gap-1.5 mt-3 text-xs text-gold-500">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path
                                                d="M12 2C7 2 3 6.5 3 12c0 5 4 9.5 9 10 5-.5 9-5 9-10 0-5.5-4-10-9-10z"/>
                                        </svg>
                                        ادامه خبر
                                    </span>
                                </div>
                            </a>
                        @endforeach
                    </div>
                </div>
            </section>
        @endif

        {{-- ============ G) پیش‌نمایش بزرگان ============ --}}
        @if ($elders->isNotEmpty())
            <section id="elders-preview" class="bg-cream-100 py-20 md:py-28 overflow-hidden">
                <div
                    class="container mx-auto px-5 md:px-8 mb-10 flex items-end justify-between flex-wrap gap-4">
                    <div>
                        <p class="text-leaf-700 text-sm tracking-[.3em] mb-3 font-bold" data-reveal>
                            {{ $home->elders_kicker }}
                        </p>
                        <h2 class="font-display text-4xl md:text-5xl text-bark-900" data-reveal>
                            {{ $home->elders_title }}
                        </h2>
                    </div>
                    <a href="{{ url('/elders') }}" wire:navigate class="btn-ghost" data-magnetic data-reveal>
                        {{ $home->elders_button }}
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                            <path d="M19 12H5M11 18l-6-6 6-6"/>
                        </svg>
                    </a>
                </div>

                <div class="relative">
                    <div id="elders-slider"
                         class="slider-scroll flex gap-6 overflow-x-auto snap-x snap-mandatory px-5 md:px-8 pb-6">
                        @foreach ($elders as $elder)
                            <a href="{{ url('/elders/'.$elder->slug) }}" wire:navigate
                               class="group shrink-0 w-[210px] md:w-[240px] snap-center text-center"
                               data-cursor="view">
                                <div
                                    class="relative arch w-[170px] h-[220px] mx-auto overflow-hidden border-[3px] border-leaf-700 shadow-lg group-hover:border-gold-500 transition-colors duration-500">
                                    <img src="{{ \App\Support\Media::url($elder->photo) }}"
                                         alt="{{ $elder->full_name }}" loading="lazy"
                                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                                    <div class="wreath">
                                        <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
                                            @for ($i = 0; $i < 10; $i++)
                                                <path d="M50 6 q6 -4 5 -10 q-6 4 -5 10z" fill="#3E8E41"
                                                      transform="rotate({{ $i * 36 }} 50 50)"/>
                                            @endfor
                                            <circle cx="50" cy="50" r="47" stroke="#D4A24C" stroke-width="1"
                                                    stroke-dasharray="4 5"/>
                                        </svg>
                                    </div>
                                </div>
                                <h3
                                    class="font-display text-xl mt-4 text-bark-900 group-hover:text-mulberry-700 transition-colors">
                                    {{ $elder->full_name }}</h3>
                                <p class="text-xs text-bark-700/70 mt-1">{{ $elder->title }}</p>
                            </a>
                        @endforeach
                    </div>

                    <div class="flex gap-3 justify-center mt-2">
                        <button id="slider-next" class="slider-arrow" aria-label="بعدی">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 stroke-width="2">
                                <path d="M9 6l6 6-6 6"/>
                            </svg>
                        </button>
                        <button id="slider-prev" class="slider-arrow" aria-label="قبلی">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 stroke-width="2">
                                <path d="M15 6l-6 6 6 6"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </section>
        @endif

        {{-- ============ H) نمونه‌ی شجره‌نامه ============ --}}
        <section id="tree-teaser" class="relative bg-mulberry-900 overflow-hidden">
            <canvas id="teaser-canvas" class="absolute inset-0 w-full h-full" aria-hidden="true"></canvas>
            <div class="absolute inset-0 bg-mulberry-900/40" aria-hidden="true"></div>

            <div class="relative container mx-auto px-5 md:px-8 py-28 md:py-40 text-center">
                <p class="text-gold-500 text-sm tracking-[.3em] mb-4 font-bold" data-reveal>
                    {{ $home->tree_kicker }}
                </p>
                <h2 class="font-display text-4xl md:text-6xl text-cream-50 leading-tight mb-6" data-reveal>
                    {!! nl2br(e($home->tree_title)) !!}
                </h2>
                <p class="leading-9 text-cream-100/80 max-w-xl mx-auto mb-10" data-reveal>
                    {{ $home->tree_description }}
                </p>
                <a href="{{ url('/family-tree') }}" class="btn-primary text-base" data-magnetic data-reveal>
                    {{ $home->tree_button }}
                </a>
            </div>
        </section>

        {{-- ============ I) تماس ============ --}}
        <section id="contact" class="bg-cream-50 py-20 md:py-28">
            <div class="container mx-auto px-5 md:px-8">
                <div class="text-center max-w-2xl mx-auto mb-14">
                    <p class="text-mulberry-500 text-sm tracking-[.3em] mb-3 font-bold" data-reveal>
                        {{ $home->contact_kicker }}
                    </p>
                    <h2 class="font-display text-4xl md:text-5xl text-bark-900 mb-5" data-reveal>
                        {{ $home->contact_title }}
                    </h2>
                    <p class="leading-9 text-bark-700" data-reveal>{{ $home->contact_description }}</p>
                </div>

                <div class="grid lg:grid-cols-5 gap-10">
                    <div class="lg:col-span-2 space-y-6">
                        <div class="space-y-4">
                            <div class="flex items-start gap-3 bg-cream-100 border border-sand-300 rounded-2xl p-4">
                                <svg class="text-mulberry-500 shrink-0 mt-1" width="18" height="18"
                                     viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                    <path d="M12 21s-7-6.1-7-11a7 7 0 1114 0c0 4.9-7 11-7 11z"/>
                                    <circle cx="12" cy="10" r="2.5"/>
                                </svg>
                                <div>
                                    <b class="text-sm">نشانی</b>
                                    <p class="text-sm text-bark-700/80 leading-7">{{ $home->contact_address }}</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-3 bg-cream-100 border border-sand-300 rounded-2xl p-4">
                                <svg class="text-mulberry-500 shrink-0 mt-1" width="18" height="18"
                                     viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                    <path
                                        d="M5 4h4l2 5-2.5 1.5a12 12 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>
                                </svg>
                                <div>
                                    <b class="text-sm">تلفن</b>
                                    <p class="text-sm text-bark-700/80 text-right"
                                       dir="ltr">{{ $home->contact_phone }}</p>
                                </div>
                            </div>

                            @if ($home->contact_email)
                                <div class="flex items-start gap-3 bg-cream-100 border border-sand-300 rounded-2xl p-4">
                                    <svg class="text-mulberry-500 shrink-0 mt-1" width="18" height="18"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                        <path d="M3 6h18v12H3z"/>
                                        <path d="M3 7l9 6 9-6"/>
                                    </svg>
                                    <div>
                                        <b class="text-sm">ایمیل</b>
                                        <p class="text-sm text-bark-700/80 text-right"
                                           dir="ltr">{{ $home->contact_email }}</p>
                                    </div>
                                </div>
                            @endif

                            <div class="flex items-start gap-3 bg-cream-100 border border-sand-300 rounded-2xl p-4">
                                <svg class="text-mulberry-500 shrink-0 mt-1" width="18" height="18"
                                     viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                    <circle cx="12" cy="12" r="9"/>
                                    <path d="M12 7v5l3 3"/>
                                </svg>
                                <div>
                                    <b class="text-sm">ساعت پاسخگویی</b>
                                    <p class="text-sm text-bark-700/80">{{ $home->contact_hours }}</p>
                                </div>
                            </div>
                        </div>

                        {{-- نقشه: تصویر ثابت، بدون وابستگی به اینترنت --}}
                        <div
                            class="relative rounded-3xl overflow-hidden h-56 bg-cream-100 border border-sand-300 kilim-bg">
                            @if ($home->contact_map_image)
                                <img src="{{ \App\Support\Media::url($home->contact_map_image) }}"
                                     alt="نقشه‌ی روستای درخت توت" loading="lazy"
                                     class="absolute inset-0 w-full h-full object-cover">
                            @else
                                <div
                                    class="absolute inset-0 flex flex-col items-center justify-center text-bark-700/70 gap-2">
                                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" stroke-width="1.6">
                                        <path d="M12 21s-7-6.1-7-11a7 7 0 1114 0c0 4.9-7 11-7 11z"/>
                                        <circle cx="12" cy="10" r="2.5"/>
                                    </svg>
                                    <p class="text-sm">جای نقشه‌ی روستا</p>
                                </div>
                            @endif
                        </div>
                    </div>

                    <div class="lg:col-span-3" data-reveal>
                        <livewire:contact-form/>
                    </div>
                </div>
            </div>
        </section>
    </main>
</x-layouts.app>
