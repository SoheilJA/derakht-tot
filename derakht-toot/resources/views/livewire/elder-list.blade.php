<div>
    <div class="flex flex-col md:flex-row items-center gap-5 mb-10">
        <div class="relative w-full md:w-80">
            <svg class="absolute right-4 top-1/2 -translate-y-1/2 text-bark-500" width="17" height="17"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
            </svg>
            <input type="search" wire:model.live.debounce.400ms="search" class="form-input pr-11"
                   placeholder="جست‌وجوی نام بزرگ روستا…" aria-label="جست‌وجوی بزرگان">
        </div>

        <div class="flex flex-wrap gap-2.5 justify-center">
            <button type="button" wire:click="setCategory('')"
                @class([
                    'px-4 py-1.5 rounded-full border text-sm transition-colors',
                    'bg-leaf-700 text-cream-50 border-leaf-700' => $category === '',
                    'bg-cream-100 text-bark-700 border-sand-300 hover:border-leaf-500' => $category !== '',
                ])>
                همه
            </button>

            @foreach ($categories as $cat)
                <button type="button" wire:key="cat-{{ $cat->id }}" wire:click="setCategory('{{ $cat->slug }}')"
                    @class([
                        'px-4 py-1.5 rounded-full border text-sm transition-colors',
                        'bg-leaf-700 text-cream-50 border-leaf-700' => $category === $cat->slug,
                        'bg-cream-100 text-bark-700 border-sand-300 hover:border-leaf-500' => $category !== $cat->slug,
                    ])>
                    {{ $cat->name }}
                </button>
            @endforeach
        </div>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" wire:loading.class="opacity-60"
         wire:target="search,setCategory">
        @forelse ($elders as $elder)
            <a wire:key="elder-{{ $elder->id }}" href="{{ url('/elders/'.$elder->slug) }}" wire:navigate
               class="group text-center" data-cursor="view">
                <div
                    class="relative arch w-[170px] h-[220px] mx-auto overflow-hidden border-[3px] border-leaf-700 shadow-lg group-hover:border-gold-500 transition-colors duration-500">
                    <img src="{{ \App\Support\Media::url($elder->photo) }}" alt="{{ $elder->full_name }}"
                         loading="lazy"
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                    @include('partials.wreath')
                </div>
                <h3 class="font-display text-xl mt-4 text-bark-900 group-hover:text-mulberry-700 transition-colors">
                    {{ $elder->full_name }}</h3>
                <p class="text-xs text-bark-700/70 mt-1">{{ $elder->title }}</p>
                @if ($elder->category)
                    <span
                        class="inline-block mt-2 text-[11px] px-2.5 py-0.5 rounded-full border border-leaf-700/40 text-leaf-700">{{ $elder->category->name }}</span>
                @endif
            </a>
        @empty
            <p class="col-span-full text-center text-bark-700/60 py-14">کسی با این نام در سایه‌ی توت‌ها نبود.</p>
        @endforelse
    </div>
</div>
