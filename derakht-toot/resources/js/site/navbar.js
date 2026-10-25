import {listen, onCleanup} from '../lib/lifecycle';
import {qsa} from '../lib/utils';

// شناسه‌ی هر بخش صفحه‌ی اصلی ← شناسه‌ی لینک منو
const SECTION_TO_NAV = {
    hero: 'home',
    about: 'about',
    history: 'history',
    'news-preview': 'news',
    'elders-preview': 'elders',
    'tree-teaser': 'family',
    contact: 'contact',
};

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
    listen(window, 'scroll', onScroll, {passive: true});

    // برگِ کنار لینک فعال
    const setActive = (key) => {
        qsa('[data-navlink]').forEach((a) => {
            const leaf = a.querySelector('.nav-leaf');
            if (!leaf) return;

            const on = a.dataset.navlink === key;
            leaf.classList.toggle('opacity-0', !on);
            leaf.classList.toggle('scale-0', !on);
        });
    };

    setActive(document.body.dataset.nav);

    // صفحه‌ی اصلی: با اسکرول، لینک بخش جاری فعال می‌شود
    if (document.body.dataset.page === 'home') {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((en) => {
                    if (en.isIntersecting && SECTION_TO_NAV[en.target.id]) {
                        setActive(SECTION_TO_NAV[en.target.id]);
                    }
                });
            },
            {rootMargin: '-40% 0px -55% 0px'}
        );

        Object.keys(SECTION_TO_NAV).forEach((id) => {
            const el = document.getElementById(id);
            if (el) io.observe(el);
        });

        onCleanup(() => io.disconnect());
    }
}
