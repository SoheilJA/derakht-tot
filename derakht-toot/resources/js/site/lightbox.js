import gsap from 'gsap';
import { onCleanup } from '../lib/lifecycle';

const state = { items: [], i: 0, el: null, onKey: null };

function destroy() {
    if (state.onKey) document.removeEventListener('keydown', state.onKey);
    state.onKey = null;

    if (state.el) {
        gsap.killTweensOf(state.el);
        state.el.remove();
        state.el = null;
    }
    document.body.style.overflow = '';
}

export function openLightbox(items, index = 0) {
    destroy();

    state.items = items;
    state.i = index;

    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-label', 'نمایش تصویر');
    lb.innerHTML =
        '<button class="lb-btn" style="top:20px;left:20px" data-lb-close aria-label="بستن"><svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '<button class="lb-btn" style="top:50%;right:20px;transform:translateY(-50%)" data-lb-next aria-label="تصویر بعدی"><svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 6l-6 6 6 6"/></svg></button>' +
        '<button class="lb-btn" style="top:50%;left:20px;transform:translateY(-50%)" data-lb-prev aria-label="تصویر قبلی"><svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M9 6l6 6-6 6"/></svg></button>' +
        '<img alt=""><p class="lb-cap"></p>';

    document.body.appendChild(lb);
    state.el = lb;
    document.body.style.overflow = 'hidden';

    const img = lb.querySelector('img');
    const cap = lb.querySelector('.lb-cap');

    function show(dir) {
        state.i = (state.i + dir + state.items.length) % state.items.length;
        const it = state.items[state.i];

        gsap.fromTo(
            img,
            { autoAlpha: 0, scale: 0.92, x: 30 * dir },
            { autoAlpha: 1, scale: 1, x: 0, duration: 0.45, ease: 'power3.out' }
        );
        img.src = it.src;
        img.alt = it.alt || '';
        cap.textContent = it.caption || '';
    }

    function close() {
        gsap.to(lb, { autoAlpha: 0, duration: 0.25, onComplete: destroy });
    }

    lb.querySelector('[data-lb-close]').addEventListener('click', close);
    lb.querySelector('[data-lb-next]').addEventListener('click', () => show(-1));
    lb.querySelector('[data-lb-prev]').addEventListener('click', () => show(1));
    lb.addEventListener('click', (e) => {
        if (e.target === lb) close();
    });

    state.onKey = (e) => {
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') show(-1);
        if (e.key === 'ArrowRight') show(1);
    };
    document.addEventListener('keydown', state.onKey);

    // اگر وسط باز بودن لایت‌باکس به صفحه‌ی دیگری رفتیم
    onCleanup(destroy);

    gsap.fromTo(lb, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
    show(0);
    lb.querySelector('[data-lb-close]').focus();
}