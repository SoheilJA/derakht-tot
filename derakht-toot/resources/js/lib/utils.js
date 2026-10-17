const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toFa(v) {
    return String(v).replace(/\d/g, (d) => FA_DIGITS[+d]);
}

export function toEnDigits(v) {
    return String(v)
        .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
        .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

export function faDate(iso) {
    try {
        return new Intl.DateTimeFormat('fa-IR-u-ca-persian', { dateStyle: 'long' }).format(new Date(iso));
    } catch (e) {
        return toFa(iso || '');
    }
}

export function reduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function debounce(fn, ms) {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), ms);
    };
}

export function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

export function qs(sel, ctx = document) {
    return ctx.querySelector(sel);
}

export function qsa(sel, ctx = document) {
    return Array.from(ctx.querySelectorAll(sel));
}

export function escapeHtml(s) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => map[c]);
}

export function splitText(el) {
    if (!el) return [];
    if (el.dataset.splitDone) return qsa('.split-char', el);

    const words = el.textContent.trim().split(/\s+/);
    const frag = document.createDocumentFragment();

    words.forEach((w, wi) => {
        const word = document.createElement('span');
        word.style.display = 'inline-block';
        word.style.whiteSpace = 'nowrap';

        w.split('').forEach((ch) => {
            const s = document.createElement('span');
            s.className = 'split-char';
            s.textContent = ch;
            word.appendChild(s);
        });

        frag.appendChild(word);
        if (wi < words.length - 1) frag.appendChild(document.createTextNode(' '));
    });

    el.textContent = '';
    el.appendChild(frag);
    el.dataset.splitDone = '1';
    return qsa('.split-char', el);
}

export function getQuery(key) {
    return new URLSearchParams(location.search).get(key);
}