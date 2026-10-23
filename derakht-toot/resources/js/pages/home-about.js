import anime from 'animejs';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {listen} from '../lib/lifecycle';
import {qs, qsa, reduced, toFa} from '../lib/utils';

function initStats() {
    const row = qs('#stats-row');
    if (!row) return;

    ScrollTrigger.create({
        trigger: row,
        start: 'top 85%',
        once: true,
        onEnter: () => {
            qsa('.stat-num', row).forEach((el) => {
                const o = {v: 0};
                anime({
                    targets: o,
                    v: +el.dataset.target,
                    round: 1,
                    duration: 1800,
                    easing: 'easeOutExpo',
                    update: () => {
                        el.textContent = toFa(o.v);
                    },
                });
            });
        },
    });
}

export function initAbout() {
    if (reduced()) return;

    initStats();

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
