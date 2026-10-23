import gsap from 'gsap';
import { listen, onCleanup } from '../lib/lifecycle';
import { qsa } from '../lib/utils';

export function initMobileMenu() {
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    let open = false;

    const lines = () => qsa('.menu-line', btn);

    function show() {
        open = true;
        menu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        btn.setAttribute('aria-expanded', 'true');

        const l = lines();
        l[0].style.transform = 'translateY(6px) rotate(45deg)';
        l[1].style.transform = 'rotate(-45deg)';
        l[2].style.opacity = '0';

        const tl = gsap.timeline();

        tl.fromTo(menu, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });

        qsa('.mm-branch', menu).forEach((path) => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            tl.fromTo(
                path,
                { strokeDashoffset: length },
                { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' },
                0
            );
        });

        tl.fromTo(
            '.mm-link',
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out' },
            0.15
        );

        const first = menu.querySelector('.mm-link');
        if (first) first.focus();
    }

    function hide() {
        open = false;
        document.body.style.overflow = '';
        btn.setAttribute('aria-expanded', 'false');

        lines().forEach((l) => {
            l.style.transform = '';
            l.style.opacity = '';
        });

        gsap.to(menu, {
            autoAlpha: 0,
            duration: 0.25,
            onComplete: () => {
                menu.classList.add('hidden');
                qsa('.mm-link', menu).forEach((a) => {
                    a.style.opacity = '0';
                });
            },
        });
    }

    listen(btn, 'click', () => (open ? hide() : show()));

    listen(menu, 'click', (e) => {
        if (e.target.closest('a')) hide();
    });

    listen(document, 'keydown', (e) => {
        if (e.key === 'Escape' && open) {
            hide();
            btn.focus();
        }
    });

    // اگر وسط باز بودن منو به صفحه‌ی دیگری رفتیم، اسکرول قفل نمونه
    onCleanup(() => {
        document.body.style.overflow = '';
        gsap.killTweensOf(menu);
    });
}