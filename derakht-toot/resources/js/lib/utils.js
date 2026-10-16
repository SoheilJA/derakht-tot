const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export const toFa = (v) => String(v).replace(/\d/g, (d) => FA_DIGITS[+d]);

export const reduced = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function debounce(fn, ms) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
    };
}

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export const qs = (sel, ctx = document) => ctx.querySelector(sel);

export const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

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