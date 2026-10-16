import { listen } from '../lib/lifecycle';
import { qsa } from '../lib/utils';

export function initNavbar() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    const inner = nav.querySelector('.nav-inner');

    const onScroll = () => {
        const scrolled = window.scrollY > 40;

        nav.classList.toggle('scrolled', scrolled);
        inner.classList.toggle('py-4', !scrolled);
        inner.classList.toggle('py-2.5', scrolled);
        nav.classList.toggle('bg-mulberry-900/85', scrolled);
        nav.classList.toggle('backdrop-blur-md', scrolled);
        nav.classList.toggle('shadow-[0_10px_40px_-15px_rgba(43,10,31,.6)]', scrolled);
    };

    onScroll();
    listen(window, 'scroll', onScroll, { passive: true });

    // لینک فعال
    const active = document.body.dataset.nav;

    qsa('[data-navlink]').forEach((a) => {
        const leaf = a.querySelector('.nav-leaf');
        if (!leaf) return;

        const isActive = a.dataset.navlink === active;
        leaf.classList.toggle('opacity-0', !isActive);
        leaf.classList.toggle('scale-0', !isActive);
    });
}