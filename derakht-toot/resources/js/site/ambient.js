import { listen, onCleanup } from '../lib/lifecycle';
import { debounce, reduced } from '../lib/utils';

const COLORS = ['#C26A97', '#8E2C63', '#8BC17A', '#3E8E41', '#D4A24C'];

export function initAmbient() {
    if (reduced() || document.body.dataset.chrome === 'minimal') return;

    const cv = document.createElement('canvas');
    cv.id = 'ambient-canvas';
    cv.className = 'fixed inset-0 z-[5] pointer-events-none';
    cv.style.mixBlendMode = 'multiply';
    cv.style.opacity = '.5';
    document.body.appendChild(cv);

    const ctx = cv.getContext('2d');
    const COUNT = innerWidth < 768 ? 6 : 14;
    let W = 0;
    let H = 0;
    let running = true;
    let raf = 0;

    const size = () => {
        W = cv.width = innerWidth;
        H = cv.height = innerHeight;
    };
    size();
    listen(window, 'resize', debounce(size, 250));

    const seed = (y) => ({
        x: Math.random() * innerWidth,
        y,
        s: 8 + Math.random() * 10,
        v: 0.4 + Math.random() * 0.8,
        ph: Math.random() * Math.PI * 2,
        r: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.02,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
    });

    const leaves = Array.from({ length: COUNT }, () => seed(Math.random() * H));

    function drawLeaf(l) {
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.r);
        ctx.fillStyle = l.c;
        ctx.beginPath();
        ctx.moveTo(0, -l.s);
        ctx.quadraticCurveTo(l.s, -l.s * 0.3, 0, l.s);
        ctx.quadraticCurveTo(-l.s, -l.s * 0.3, 0, -l.s);
        ctx.fill();
        ctx.restore();
    }

    function frame(t) {
        raf = requestAnimationFrame(frame);
        if (!running) return;

        ctx.clearRect(0, 0, W, H);
        leaves.forEach((l) => {
            l.y += l.v;
            l.x += Math.sin(t / 1600 + l.ph) * 0.6;
            l.r += l.vr;
            if (l.y > H + 30) Object.assign(l, seed(-30));
            drawLeaf(l);
        });
    }
    raf = requestAnimationFrame(frame);

    listen(document, 'visibilitychange', () => {
        running = !document.hidden;
    });

    onCleanup(() => {
        cancelAnimationFrame(raf);
        cv.remove();
    });
}