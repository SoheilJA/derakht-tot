import gsap from 'gsap';
import { listen } from '../lib/lifecycle';
import { qs, qsa, reduced } from '../lib/utils';

export function initTraditions() {
    if (reduced()) return;

    // رشته‌ی ابریشمی که با اسکرول کشیده می‌شود
    const silk = qs('#silk-path');
    if (silk) {
        const length = silk.getTotalLength();
        silk.style.strokeDasharray = length;
        silk.style.strokeDashoffset = length;

        gsap.to(silk, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: { trigger: '#traditions', start: 'top 80%', end: 'bottom 60%', scrub: 1 },
        });
    }

    // چرخش سه‌بعدی کارت‌ها با حرکت موس (فقط دستگاه‌های با موس)
    if (!window.matchMedia('(pointer:fine)').matches) return;

    qsa('.trad-card').forEach((el) => {
        listen(el, 'mousemove', (e) => {
            const r = el.getBoundingClientRect();
            gsap.to(el, {
                rotateY: ((e.clientX - r.left) / r.width - 0.5) * 10,
                rotateX: -((e.clientY - r.top) / r.height - 0.5) * 10,
                y: -6,
                transformPerspective: 800,
                duration: 0.4,
            });
        });

        listen(el, 'mouseleave', () => {
            gsap.to(el, { rotateX: 0, rotateY: 0, y: 0, duration: 0.7, ease: 'power3.out' });
        });
    });
}
