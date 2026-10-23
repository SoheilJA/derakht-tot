import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { listen, onCleanup } from '../lib/lifecycle';
import { debounce, qs, qsa, reduced } from '../lib/utils';
import { openLightbox } from '../site/lightbox';

export function initGallery() {
    const track = qs('#gallery-track');
    if (!track) return;

    const cards = qsa('.g-card', track);

    // لایت‌باکس
    const items = cards.map((card) => {
        const img = card.querySelector('img');
        return { src: img.src, caption: card.dataset.caption || '', alt: img.alt };
    });

    const open = (card) => openLightbox(items, +card.dataset.gi);

    listen(track, 'click', (e) => {
        const card = e.target.closest('.g-card');
        if (card) open(card);
    });

    listen(track, 'keydown', (e) => {
        const card = e.target.closest('.g-card');
        if (card && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            open(card);
        }
    });

    if (reduced()) return;

    // اسکرول افقی پین‌شده (فقط دسکتاپ؛ در موبایل خود کاربر اسکرول می‌کنه)
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
        const dist = () => Math.max(0, track.scrollWidth - track.parentElement.clientWidth);

        const tween = gsap.to(track, {
            x: () => dist(),
            ease: 'none',
            scrollTrigger: {
                trigger: '#gallery',
                start: 'top top',
                end: () => '+=' + dist(),
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1,
            },
        });

        qsa('.g-img', track).forEach((img) => {
            gsap.fromTo(
                img,
                { x: -46 },
                {
                    x: 46,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: img.closest('.g-card'),
                        containerAnimation: tween,
                        start: 'left right',
                        end: 'right left',
                        scrub: true,
                    },
                }
            );
        });
    });

    // بعد از لود تصاویر، محاسبه‌ی طول مسیر دوباره انجام بشه
    qsa('.g-img', track).forEach((img) => {
        listen(img, 'load', debounce(() => ScrollTrigger.refresh(), 200));
    });

    onCleanup(() => mm.revert());
}
