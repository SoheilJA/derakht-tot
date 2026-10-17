import gsap from 'gsap';
import { listen, onCleanup } from '../lib/lifecycle';
import { qsa, reduced } from '../lib/utils';

export function initCursor() {
    if (reduced() || !window.matchMedia('(pointer:fine)').matches) return;

    document.body.classList.add('has-cursor');

    const dot = document.createElement('div');
    dot.id = 'cursor-dot';

    const ring = document.createElement('div');
    ring.id = 'cursor-ring';
    ring.innerHTML = '<span>مشاهده</span>';

    document.body.append(dot, ring);

    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const loop = () => {
        rx += (x - rx) * 0.16;
        ry += (y - ry) * 0.16;
        ring.style.transform = `translate(${rx}px,${ry}px)`;
        raf = requestAnimationFrame(loop);
    };
    loop();

    listen(document, 'mousemove', (e) => {
        x = e.clientX;
        y = e.clientY;
        dot.style.transform = `translate(${x}px,${y}px)`;
    });

    // تغییر شکل روی کارت‌ها و لینک‌ها
    listen(document, 'mouseover', (e) => {
        if (!e.target.closest('[data-cursor="view"], a, button')) return;

        const isView = e.target.closest('[data-cursor="view"]');
        ring.classList.toggle('is-view', !!isView);

        if (!isView) {
            gsap.to(ring, { width: 52, height: 52, margin: '-26px 0 0 -26px', duration: 0.25 });
        }
    });

    listen(document, 'mouseout', (e) => {
        if (!e.target.closest('[data-cursor="view"], a, button')) return;

        ring.classList.remove('is-view');
        gsap.to(ring, { width: 38, height: 38, margin: '-19px 0 0 -19px', duration: 0.25 });
    });

    // دکمه‌های مگنتی
    listen(document, 'mousemove', (e) => {
        const m = e.target.closest('[data-magnetic]');

        qsa('[data-magnetic]').forEach((b) => {
            if (b !== m && b._mag) {
                b._mag = false;
                gsap.to(b, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,.4)' });
            }
        });

        if (m) {
            m._mag = true;
            const r = m.getBoundingClientRect();
            gsap.to(m, {
                x: (e.clientX - r.left - r.width / 2) * 0.28,
                y: (e.clientY - r.top - r.height / 2) * 0.28,
                duration: 0.35,
                ease: 'power2.out',
            });
        }
    });

    onCleanup(() => {
        cancelAnimationFrame(raf);
        dot.remove();
        ring.remove();
        document.body.classList.remove('has-cursor');
    });
}