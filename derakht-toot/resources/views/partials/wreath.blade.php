<div class="wreath">
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
        @for ($i = 0; $i < 10; $i++)
            <path d="M50 6 q6 -4 5 -10 q-6 4 -5 10z" fill="#3E8E41" transform="rotate({{ $i * 36 }} 50 50)" />
        @endfor
        <circle cx="50" cy="50" r="47" stroke="#D4A24C" stroke-width="1" stroke-dasharray="4 5" />
    </svg>
</div>
