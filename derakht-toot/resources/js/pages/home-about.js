import gsap from 'gsap';
import {listen} from '../lib/lifecycle';
import {qsa, reduced} from '../lib/utils';

export function initAbout() {
    if (reduced()) return;

    // پارالکس کلاژ تصاویر
    qsa('#about-collage [data-parallax]').forEach((el) => {
        gsap.to(el, {
            yPercent: +el.dataset.parallax,
            ease: 'none',
            scrollTrigger: {trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 1},
        });
    });

    // چرخش سه‌بعدی با حرکت موس (فقط دستگاه‌های با موس)
    if (!window.matchMedia('(pointer:fine)').matches) return;

    qsa('.tilt').forEach((el) => {
        listen(el, 'mousemove', (e) => {
            const r = el.getBoundingClientRect();
            gsap.to(el, {
                rotateY: ((e.clientX - r.left) / r.width - 0.5) * 14,
                rotateX: -((e.clientY - r.top) / r.height - 0.5) * 14,
                transformPerspective: 700,
                duration: 0.4,
                ease: 'power2.out',
            });
        });

        listen(el, 'mouseleave', () => {
            gsap.to(el, {rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1,.45)'});
        });
    });
}
