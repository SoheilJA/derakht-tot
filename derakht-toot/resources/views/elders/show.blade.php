@php
    use App\Support\Fa;
    use App\Support\Media;

    $siteName = app(\App\Settings\SiteSettings::class)->site_name;
    $person = $elder->person;

    $years = null;
    if ($elder->birth_year) {
        $years = $elder->death_year
            ? Fa::digits($elder->birth_year).' – '.Fa::digits($elder->death_year)
            : 'متولد '.Fa::digits($elder->birth_year);
    }

    $children = $person ? $person->children : collect();
    $hasFamily = $person && ($person->father || $person->mother || $person->spouse_name || $children->isNotEmpty());
@endphp

<x-layouts.app :title="$elder->full_name.' | '.$siteName" :description="$elder->summary"
               :ogImage="$elder->photo ? Media::url($elder->photo) : null" ogType="profile" page="elder" nav="elders">
    <main id="main">

        {{-- سربرگ --}}
        <header class="relative bg-leaf-900 text-cream-50 overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24">
            <div class="absolute inset-0 kilim-bg opacity-15" aria-hidden="true"></div>
            <div
                class="relative container mx-auto px-5 md:px-8 max-w-4xl grid md:grid-cols-[auto_1fr] gap-10 items-center">
                <div
                    class="relative arch w-48 h-64 md:w-56 md:h-72 mx-auto overflow-hidden border-[3px] border-gold-500 shadow-2xl">
                    <img src="{{ Media::url($elder->photo) }}" alt="{{ $elder->full_name }}"
                         class="w-full h-full object-cover">
                    @include('partials.wreath')
                </div>

                <div class="text-center md:text-right">
                    @if ($elder->category)
                        <span
                            class="inline-block text-xs bg-gold-500 text-mulberry-900 font-bold px-3 py-1 rounded-full mb-4">{{ $elder->category->name }}</span>
                    @endif
                    <h1 class="font-display text-4xl md:text-6xl leading-tight">{{ $elder->full_name }}</h1>
                    <p class="text-gold-500 mt-3 text-lg">{{ $elder->title }}</p>

                    <div class="mt-6 flex flex-wrap gap-2.5 justify-center md:justify-start text-sm">
                        @if ($years)
                            <span class="px-3.5 py-1 rounded-full border border-cream-100/30">{{ $years }} (شمسی)</span>
                        @endif
                        @if ($elder->birthplace)
                            <span class="px-3.5 py-1 rounded-full border border-cream-100/30">زادگاه: {{ $elder->birthplace }}</span>
                        @endif
                        @if ($elder->profession)
                            <span class="px-3.5 py-1 rounded-full border border-cream-100/30">{{ $elder->profession }}</span>
                        @endif
                    </div>
                </div>
            </div>
        </header>

        {{-- زندگی‌نامه --}}
        @if ($elder->summary || $elder->bio)
            <section class="bg-cream-50 py-14 md:py-20">
                <div class="container mx-auto px-5 md:px-8 max-w-3xl">
                    @if ($elder->summary)
                        <p class="text-xl leading-10 text-mulberry-900 font-display mb-8">{{ $elder->summary }}</p>
                    @endif

                    {{-- متن از ادمین (کاربر مورد اعتماد) می‌آید --}}
                    @if ($elder->bio)
                        <div class="article-body text-bark-700">{!! $elder->bio !!}</div>
                    @endif
                </div>
            </section>
        @endif

        {{-- دستاوردها --}}
        @if (! empty($elder->achievements))
            <section class="bg-cream-100 py-14 md:py-20">
                <div class="container mx-auto px-5 md:px-8 max-w-5xl">
                    <h2 class="font-display text-3xl md:text-4xl text-bark-900 mb-10 text-center">دستاوردها</h2>
                    <div class="grid md:grid-cols-3 gap-6">
                        @foreach ($elder->achievements as $item)
                            <article class="bg-cream-50 border border-sand-300 rounded-[26px] p-6">
                                <span class="font-display text-4xl text-gold-500">{{ Fa::digits($loop->iteration) }}</span>
                                <h3 class="font-display text-xl text-bark-900 mt-2 mb-2">{{ $item['title'] ?? '' }}</h3>
                                <p class="text-sm text-bark-700/90 leading-8">{{ $item['description'] ?? '' }}</p>
                            </article>
                        @endforeach
                    </div>
                </div>
            </section>
        @endif

        {{-- نقل‌قول‌ها --}}
        @if (! empty($elder->quotes))
            <section class="bg-mulberry-900 text-cream-50 py-14 md:py-20 relative overflow-hidden">
                <div class="absolute inset-0 kilim-bg opacity-10" aria-hidden="true"></div>
                <div class="relative container mx-auto px-5 md:px-8 max-w-4xl">
                    <h2 class="font-display text-3xl md:text-4xl mb-10 text-center">از زبان ایشان</h2>
                    <div class="space-y-6">
                        @foreach ($elder->quotes as $quote)
                            <blockquote
                                class="border-r-4 border-gold-500 pr-6 py-1 text-xl md:text-2xl leading-10 font-display text-cream-100">
                                «{{ is_array($quote) ? implode(' ', $quote) : $quote }}»
                            </blockquote>
                        @endforeach
                    </div>
                </div>
            </section>
        @endif

        {{-- گالری --}}
        @if (! empty($elder->gallery))
            <section class="bg-cream-50 py-14 md:py-20">
                <div class="container mx-auto px-5 md:px-8 max-w-5xl">
                    <h2 class="font-display text-3xl md:text-4xl text-bark-900 mb-10 text-center">تصاویر</h2>
                    <div data-elder-gallery class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        @foreach ($elder->gallery as $path)
                            <button type="button" data-gi="{{ $loop->index }}"
                                    data-caption="{{ $elder->full_name }}" data-cursor="view"
                                    class="group block rounded-2xl overflow-hidden shadow-lg"
                                    aria-label="بزرگ‌نمایی تصویر {{ $loop->iteration }}">
                                <img src="{{ Media::url($path) }}" alt="{{ $elder->full_name }}" loading="lazy"
                                     class="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-700">
                            </button>
                        @endforeach
                    </div>
                </div>
            </section>
        @endif

        {{-- خانواده (از شجره‌نامه) --}}
        @if ($hasFamily)
            <section class="bg-cream-100 py-14 md:py-20">
                <div class="container mx-auto px-5 md:px-8 max-w-3xl">
                    <h2 class="font-display text-3xl md:text-4xl text-bark-900 mb-8 text-center">خانواده</h2>

                    <dl class="space-y-5 text-sm">
                        @foreach ([['پدر', $person->father], ['مادر', $person->mother]] as [$label, $relative])
                            @if ($relative)
                                <div class="flex items-center gap-3">
                                    <dt class="w-20 shrink-0 text-bark-700/70">{{ $label }}</dt>
                                    <dd>
                                        <a href="{{ url('/family-tree?person='.$relative->id) }}"
                                           class="inline-block px-4 py-1.5 rounded-full bg-cream-50 border border-sand-300 hover:border-mulberry-500 transition-colors">{{ $relative->full_name }}</a>
                                    </dd>
                                </div>
                            @endif
                        @endforeach

                        @if ($person->spouse_name)
                            <div class="flex items-center gap-3">
                                <dt class="w-20 shrink-0 text-bark-700/70">همسر</dt>
                                <dd>{{ $person->spouse_name }}</dd>
                            </div>
                        @endif

                        @if ($children->isNotEmpty())
                            <div class="flex items-start gap-3">
                                <dt class="w-20 shrink-0 text-bark-700/70 pt-1.5">فرزندان</dt>
                                <dd class="flex flex-wrap gap-2">
                                    @foreach ($children as $child)
                                        <a href="{{ url('/family-tree?person='.$child->id) }}"
                                           class="inline-block px-4 py-1.5 rounded-full bg-cream-50 border border-sand-300 hover:border-mulberry-500 transition-colors">{{ $child->full_name }}</a>
                                    @endforeach
                                </dd>
                            </div>
                        @endif
                    </dl>

                    <div class="text-center mt-10">
                        <a href="{{ url('/family-tree?person='.$person->id) }}" class="btn-primary">مشاهده در شجره‌نامه</a>
                    </div>
                </div>
            </section>
        @endif

        <section class="bg-cream-50 py-12 text-center">
            <a href="{{ url('/elders') }}" wire:navigate class="btn-ghost">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
                بازگشت به همه بزرگان
            </a>
        </section>
    </main>
</x-layouts.app>
