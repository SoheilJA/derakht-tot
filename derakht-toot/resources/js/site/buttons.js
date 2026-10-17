import anime from 'animejs';
import { listen } from '../lib/lifecycle';
import { reduced } from '../lib/utils';

const LEAF_SVG =
    '<svg width="10" height="10" viewBox="0 0 24 24" fill="#3E8E41"><path d="M12 2C7 2 3 6.5 3 12c0 5 4 9.5 9 10 5-.5 9-5 9-10 0-5.5-4-10-9-10z"/></svg>';

export function initButtons() {
    // موج هنگام کلیک
    listen(document, 'click', (e) => {
        const b = e.target.closest('.btn-primary, .btn-ghost');
        if (!b) return;

        const r = b.getBoundingClientRect();
        const s = document.createElement('span');
        s.className = 'ripple';
        s.style.width = s.style.height = Math.max(r.width, r.height) + 'px';
        s.style.left = e.clientX - r.left - r.width / 2 + 'px';
        s.style.top = e.clientY - r.top - r.height / 2 + 'px';

        b.appendChild(s);
        setTimeout(() => s.remove(), 700);
    });

    if (reduced()) return;

    // پخش توت و برگ هنگام hover روی دکمه‌ی اصلی
    listen(
        document,
        'mouseenter',
        (e) => {
            const b = e.target.closest?.('.btn-primary');
            if (!b) return;

            const r = b.getBoundingClientRect();

            for (let i = 0; i < 7; i++) {
                const p = document.createElement('span');
                const isLeaf = i % 3 === 0;

                p.className = 'burst-p';
                p.style.cssText =
                    `left:${r.width / 2}px;top:${r.height / 2}px;` +
                    (isLeaf
                        ? 'width:10px;height:10px;'
                        : `width:6px;height:6px;border-radius:50%;background:${i % 2 ? '#8E2C63' : '#5A1A3F'};`);

                if (isLeaf) p.innerHTML = LEAF_SVG;
                b.appendChild(p);

                const ang = Math.random() * Math.PI * 2;
                const dist = 40 + Math.random() * 34;

                anime({
                    targets: p,
                    translateX: Math.cos(ang) * dist,
                    translateY: Math.sin(ang) * dist - 18,
                    scale: [1, 0],
                    opacity: [1, 0],
                    duration: 700 + Math.random() * 300,
                    easing: 'easeOutCubic',
                    complete: () => p.remove(),
                });
            }
        },
        true
    );
}