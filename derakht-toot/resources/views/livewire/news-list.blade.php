<div>
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div class="flex flex-wrap gap-2">
            <button type="button" wire:click="setCategory('')"
                @class([
                    'px-4 py-1.5 rounded-full border text-sm transition-colors',
                    'bg-mulberry-700 text-cream-50 border-mulberry-700' => $category === '',
                    'bg-cream-100 text-bark-700 border-sand-300 hover:border-mulberry-500' => $category !== '',
                ])>
                همه
            </button>

            @foreach ($categories as $cat)
                <button type="button" wire:key="cat-{{ $cat->id }}" wire:click="setCategory('{{ $cat->slug }}')"
                    @class([
                        'px-4 py-1.5 rounded-full border text-sm transition-colors',
                        'bg-mulberry-700 text-cream-50 border-mulberry-700' => $category === $cat->slug,
                        'bg-cream-100 text-bark-700 border-sand-300 hover:border-mulberry-500' => $category !== $cat->slug,
                    ])>
                    {{ $cat->name }}
                </button>
            @endforeach
        </div>

        <input type="search" wire:model.live.debounce.400ms="search" placeholder="جستجو در اخبار…"
               aria-label="جستجو در اخبار" class="form-input md:max-w-xs">
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" wire:loading.class="opacity-60"
         wire:target="search,setCategory">
        @forelse ($items as $item)
            <a wire:key="news-{{ $item->id }}" href="{{ url('/news/'.$item->slug) }}" wire:navigate
               class="news-card group relative rounded-[26px] overflow-hidden bg-mulberry-900 shadow-xl"
               data-cursor="view">
                <img src="{{ \App\Support\Media::url($item->cover_image) }}" alt="{{ $item->title }}"
                     loading="lazy"
                     class="w-full h-72 object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-mulberry-900/90 via-mulberry-900/20 to-transparent">
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
                    <h3 class="font-display text-xl leading-snug">{{ $item->title }}</h3>
                    @if ($item->summary)
                        <p class="text-sm text-cream-100/75 mt-2 leading-7 line-clamp-2">{{ $item->summary }}</p>
                    @endif
                </div>
            </a>
        @empty
            <p class="col-span-full text-center text-bark-700/70 py-16">خبری با این مشخصات پیدا نشد.</p>
        @endforelse
    </div>

    @if ($hasMore)
        <div class="text-center mt-12">
            <button type="button" wire:click="loadMore" wire:loading.attr="disabled" wire:target="loadMore"
                    class="btn-ghost">
                <span wire:loading.remove wire:target="loadMore">نمایش خبرهای بیشتر</span>
                <span wire:loading wire:target="loadMore">در حال بارگذاری…</span>
            </button>
        </div>
    @endif
</div>
