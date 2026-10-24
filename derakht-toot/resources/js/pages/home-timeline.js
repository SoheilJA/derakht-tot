import anime from 'animejs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { listen, onCleanup } from '../lib/lifecycle';
import { debounce, qs, qsa, reduced, toFa } from '../lib/utils';

const NS = 'http://www.w3.org/2000/svg';

export function initTimeline() {
    const root = qs('#timeline');
    if (!root) return;

    const RM = reduced();
    const cards = qsa('.tl-card', root);
    let drawTriggers = [];
    let disposed = false;

    const killDrawTriggers = () => {
        drawTriggers.forEach((t) => t.kill());
        drawTriggers = [];
    };

    // ورود کارت‌ها و شمارش سال (فقط یک‌بار، با تغییر اندازه دوباره ساخته نمی‌شه)
    if (!RM) {
        cards.forEach((card) => {
            const yearEl = card.querySelector('.tl-year');
            const target = +yearEl.dataset.year;

            gsap.set(card, { autoAlpha: 0, y: 40 });
            yearEl.textContent = toFa(0);

            ScrollTrigger.create({
                trigger: card,
                start: 'top 82%',
                once: true,
                onEnter: () => {
                    gsap.to(card, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' });

                    const o = { v: 0 };
                    anime({
                        targets: o,
                        v: target,
                        round: 1,
                        duration: 1300,
                        easing: 'easeOutExpo',
                        update: () => {
                            yearEl.textContent = toFa(o.v);
                        },
                    });
                },
            });
        });
    }

    // کشیدن تنه و شاخه‌ها (با هر تغییر اندازه از نو)
    function draw() {
        if (disposed) return;

        killDrawTriggers();
        const old = root.querySelector('svg');
        if (old) old.remove();

        const desktop = window.innerWidth >= 768;
        const W = root.clientWidth;
        const H = root.offsetHeight;
        const tx = desktop ? W / 2 : W - 16;

        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('class', 'absolute inset-0 pointer-events-none');
        svg.setAttribute('width', W);
        svg.setAttribute('height', H);
        svg.setAttribute('aria-hidden', 'true');

        // تنه
        const step = H / cards.length;
        let d = `M ${tx} 0`;
        for (let i = 0; i < cards.length; i++) {
            const off = (i % 2 ? 26 : -26) * (desktop ? 1 : 0.35);
            d += ` C ${tx + off} ${i * step + step * 0.33}, ${tx + off} ${i * step + step * 0.66}, ${tx} ${(i + 1) * step}`;
        }

        const trunk = document.createElementNS(NS, 'path');
        trunk.setAttribute('d', d);
        trunk.setAttribute('stroke', '#7A5636');
        trunk.setAttribute('stroke-width', '7');
        trunk.setAttribute('stroke-linecap', 'round');
        trunk.setAttribute('fill', 'none');
        svg.appendChild(trunk);

        // شاخه و برگ برای هر کارت (با offset* تا از انیمیشن ورود کارت‌ها تأثیر نگیره)
        cards.forEach((card) => {
            const y = card.offsetTop + 46;
            const left = card.offsetLeft;
            const right = left + card.offsetWidth;
            const edge = desktop ? (left > tx ? left : right) : right;
            const mid = (tx + edge) / 2;

            const branch = document.createElementNS(NS, 'path');
            branch.setAttribute('d', `M ${tx} ${y} C ${mid} ${y - 26}, ${mid} ${y + 26}, ${edge} ${y}`);
            branch.setAttribute('stroke', '#7A5636');
            branch.setAttribute('stroke-width', '3');
            branch.setAttribute('fill', 'none');
            branch.setAttribute('stroke-linecap', 'round');
            svg.appendChild(branch);

            const leaf = document.createElementNS(NS, 'path');
            const a = desktop ? -14 : 14;
            const b = desktop ? -10 : 10;
            const c = desktop ? 12 : -12;
            const e = desktop ? 10 : -10;
            leaf.setAttribute('d', `M${edge},${y} q${a},-10 ${b},-26 q${c},12 ${e},26`);
            leaf.setAttribute('fill', '#3E8E41');
            svg.appendChild(leaf);

            if (!RM) {
                const L = branch.getTotalLength();
                branch.style.strokeDasharray = L;
                branch.style.strokeDashoffset = L;
                gsap.set(leaf, { scale: 0, transformOrigin: 'center' });

                drawTriggers.push(
                    ScrollTrigger.create({
                        trigger: card,
                        start: 'top 75%',
                        once: true,
                        onEnter: () => {
                            gsap.to(branch, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' });
                            gsap.to(leaf, { scale: 1, duration: 0.5, delay: 0.5, ease: 'back.out(2.5)' });
                        },
                    })
                );
            }
        });

        root.appendChild(svg);

        // رشد تنه همراه اسکرول
        if (!RM) {
            const TL = trunk.getTotalLength();
            trunk.style.strokeDasharray = TL;

            const st = ScrollTrigger.create({
                trigger: '#history',
                start: 'top 75%',
                end: 'bottom 70%',
                scrub: 0.6,
                onUpdate: (self) => {
                    trunk.style.strokeDashoffset = TL * (1 - self.progress);
                },
            });

            trunk.style.strokeDashoffset = TL * (1 - st.progress);
            drawTriggers.push(st);
        }
    }

    requestAnimationFrame(draw);

    // بعد از بارگذاری فونت‌ها ارتفاع کارت‌ها ممکنه عوض بشه
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            draw();
            ScrollTrigger.refresh();
        });
    }

    listen(
        window,
        'resize',
        debounce(() => {
            draw();
            ScrollTrigger.refresh();
        }, 400)
    );

    onCleanup(() => {
        disposed = true;
        killDrawTriggers();
    });
}
