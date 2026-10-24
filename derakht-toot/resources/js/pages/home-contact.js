import anime from 'animejs';
import { listen } from '../lib/lifecycle';
import { qs, reduced } from '../lib/utils';

const LEAF =
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="#3E8E41"><path d="M12 2C7 2 3 6.5 3 12c0 5 4 9.5 9 10 5-.5 9-5 9-10 0-5.5-4-10-9-10z"/></svg>';

export function initContact() {
    if (reduced()) return;

    // کامپوننت Livewire بعد از ذخیره‌ی پیام این رویداد را می‌فرستد
    listen(window, 'contact-sent', () => {
        const btn = qs('#contact-form button[type="submit"]');
        if (!btn) return;

        const r = btn.getBoundingClientRect();

        for (let i = 0; i < 16; i++) {
            const isLeaf = i % 4 === 0;
            const p = document.createElement('span');
            p.setAttribute('aria-hidden', 'true');
            p.style.cssText =
                `position:fixed;z-index:60;pointer-events:none;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;` +
                `width:${isLeaf ? 12 : 7}px;height:${isLeaf ? 12 : 7}px;` +
                (isLeaf ? '' : `border-radius:50%;background:${i % 2 ? '#8E2C63' : '#5A1A3F'};`);

            if (isLeaf) p.innerHTML = LEAF;
            document.body.appendChild(p);

            const ang = Math.random() * Math.PI * 2;
            const d = 70 + Math.random() * 90;

            anime({
                targets: p,
                translateX: Math.cos(ang) * d,
                translateY: [0, Math.sin(ang) * d - 40, Math.sin(ang) * d + 30],
                scale: [1, 0],
                opacity: [1, 1, 0],
                duration: 1200,
                easing: 'easeOutCubic',
                complete: () => p.remove(),
            });
        }
    });
}
