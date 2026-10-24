<x-layouts.app :title="$news->title.' | '.app(\App\Settings\SiteSettings::class)->site_name"
               :description="$news->summary"
               :ogImage="$news->cover_image ? \App\Support\Media::url($news->cover_image) : null"
               ogType="article" page="news-detail" nav="news">
    <main id="main">
        <header class="bg-mulberry-900 text-cream-50 pt-36 pb-14 kilim-bg">
            <div class="container mx-auto px-5 md:px-8 max-w-3xl text-center">
                <div class="flex items-center justify-center gap-3 mb-5">
                    @if ($news->category)
                        <span
                            class="text-xs bg-gold-500 text-mulberry-900 font-bold px-3 py-1 rounded-full">{{ $news->category->name }}</span>
                    @endif
                    <span class="text-sm text-cream-100/70">{{ \App\Support\Fa::date($news->published_at) }}</span>
                </div>
                <h1 class="font-display text-4xl md:text-5xl leading-snug">{{ $news->title }}</h1>
                @if ($news->summary)
                    <p class="mt-6 text-cream-100/80 leading-9">{{ $news->summary }}</p>
                @endif
            </div>
        </header>

        <article class="bg-cream-50 py-14 md:py-20">
            <div class="container mx-auto px-5 md:px-8 max-w-3xl">
                @if ($news->cover_image)
                    <img src="{{ \App\Support\Media::url($news->cover_image) }}" alt="{{ $news->title }}"
                         class="w-full rounded-[26px] shadow-2xl -mt-24 mb-12 relative z-10">
                @endif

                {{-- متن از ادمین (کاربر مورد اعتماد) می‌آید --}}
                <div class="article-body text-bark-700">{!! $news->body !!}</div>

                <div class="mt-14 pt-8 border-t border-sand-300">
                    <a href="{{ url('/news') }}" wire:navigate class="btn-ghost">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             stroke-width="2">
                            <path d="M5 12h14M13 6l6 6-6 6"/>
                        </svg>
                        بازگشت به همه اخبار
                    </a>
                </div>
            </div>
        </article>

        @if ($related->isNotEmpty())
            <section class="bg-cream-100 py-16 md:py-20">
                <div class="container mx-auto px-5 md:px-8">
                    <h2 class="font-display text-3xl text-bark-900 mb-8">خبرهای دیگر</h2>
                    <div class="grid md:grid-cols-3 gap-6">
                        @foreach ($related as $item)
                            <a href="{{ url('/news/'.$item->slug) }}" wire:navigate
                               class="news-card group relative rounded-[26px] overflow-hidden bg-mulberry-900 shadow-xl"
                               data-cursor="view">
                                <img src="{{ \App\Support\Media::url($item->cover_image) }}"
                                     alt="{{ $item->title }}" loading="lazy"
                                     class="w-full h-56 object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700">
                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-mulberry-900/90 to-transparent"></div>
                                <div class="absolute inset-x-0 bottom-0 p-5 text-cream-50">
                                    <span
                                        class="text-[11px] text-cream-100/70">{{ \App\Support\Fa::date($item->published_at) }}</span>
                                    <h3 class="font-display text-lg leading-snug mt-1">{{ $item->title }}</h3>
                                </div>
                            </a>
                        @endforeach
                    </div>
                </div>
            </section>
        @endif
    </main>
</x-layouts.app>
