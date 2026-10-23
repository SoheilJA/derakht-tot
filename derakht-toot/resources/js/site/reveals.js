import gsap from 'gsap';
import { qsa, reduced } from '../lib/utils';

export function initReveals(root = document) {
    if (reduced()) return;

    qsa('[data-reveal]', root).forEach((el) => {
        if (el._revealed) return;
        el._revealed = true;

        gsap.from(el, {
            y: 36,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'power3.out',
            delay: parseFloat(el.dataset.reveal) || 0,
            scrollTrigger: { trigger: el, start: 'top 88%' },
        });
    });
}