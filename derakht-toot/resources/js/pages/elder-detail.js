import { listen } from '../lib/lifecycle';
import { qsa } from '../lib/utils';
import { openLightbox } from '../site/lightbox';

export function initElderDetail() {
    const buttons = qsa('[data-elder-gallery] [data-gi]');
    if (!buttons.length) return;

    const items = buttons.map((b) => {
        const img = b.querySelector('img');
        return { src: img.src, alt: img.alt, caption: b.dataset.caption || '' };
    });

    buttons.forEach((b) => {
        listen(b, 'click', () => openLightbox(items, +b.dataset.gi));
    });
}
