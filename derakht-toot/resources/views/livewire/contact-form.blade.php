<form wire:submit="submit" id="contact-form" novalidate
      class="bg-cream-100 border border-sand-300 rounded-3xl p-6 md:p-10 relative overflow-hidden">
    <div class="space-y-6">
        <div>
            <label for="f-name" class="form-label">نام و نام خانوادگی</label>
            <input id="f-name" type="text" wire:model="name" autocomplete="name"
                   class="form-input @error('name') border-[#A3233B] @enderror">
            @error('name')
            <p class="field-error show">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="f-phone" class="form-label">شماره تماس</label>
            <input id="f-phone" type="tel" dir="ltr" wire:model="phone" autocomplete="tel"
                   class="form-input text-right @error('phone') border-[#A3233B] @enderror">
            @error('phone')
            <p class="field-error show">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="f-msg" class="form-label">پیام شما</label>
            <textarea id="f-msg" rows="4" wire:model="message"
                      class="form-input resize-none @error('message') border-[#A3233B] @enderror"></textarea>
            @error('message')
            <p class="field-error show">{{ $message }}</p>
            @enderror
        </div>

        {{-- فیلد مخفی ضد اسپم --}}
        <div class="absolute -left-[9999px]" aria-hidden="true">
            <label for="f-website">وب‌سایت</label>
            <input id="f-website" type="text" wire:model="website" tabindex="-1" autocomplete="off">
        </div>

        <button type="submit" class="btn-primary w-full justify-center" data-magnetic wire:loading.attr="disabled">
            <span wire:loading.remove>{{ $home->contact_button }}</span>
            <span wire:loading>در حال ارسال…</span>
        </button>
    </div>

    @if ($sentCount > 0)
        <div wire:key="sent-{{ $sentCount }}" x-data="{ open: true }" x-init="setTimeout(() => open = false, 6000)"
             x-show="open" x-transition.opacity
             class="absolute inset-0 bg-cream-50/95 flex flex-col items-center justify-center text-center gap-4 p-8">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#3E8E41" stroke-width="2"
                 aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 12.5l2.5 2.5L16 9.5"/>
            </svg>
            <h3 class="font-display text-2xl text-bark-900">{{ $home->contact_success_title }}</h3>
            <p class="text-sm text-bark-700/80 leading-7">{{ $home->contact_success_text }}</p>
        </div>
    @endif
</form>
