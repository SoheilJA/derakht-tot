import gsap from 'gsap';
import { listen, onCleanup } from '../lib/lifecycle';
import { qs, reduced, splitText } from '../lib/utils';

export function playHero() {
    const title = qs('#hero-title');
    if (!title) return;

    const chars = splitText(title);
    let played = false;
    let timer = null;
    let tl = null;

    const run = () => {
        if (played) return;
        played = true;

        if (reduced()) {
            gsap.set('[data-hero-el]', { opacity: 1, y: 0 });
            return;
        }

        tl = gsap
            .timeline()
            .from(chars, { yPercent: 110, rotate: 6, opacity: 0, duration: 0.9, stagger: 0.045, ease: 'back.out(1.8)' })
            .to('[data-hero-el="kicker"]', { opacity: 1, duration: 0.7 }, '-=.5')
            .to('[data-hero-el="sub"]', { opacity: 1, y: 0, duration: 0.8, startAt: { y: 18 } }, '-=.4')
            .to('[data-hero-el="cta"]', { opacity: 1, y: 0, duration: 0.7, startAt: { y: 16 } }, '-=.4');
    };

    // ناوبری داخلی: پریلودر وجود نداره، بلافاصله اجرا کن
    if (!document.getElementById('preloader')) {
        run();
    } else {
        listen(window, 'village:ready', run);
        timer = setTimeout(run, 3500); // اگر رویداد از دست رفت
    }

    onCleanup(() => {
        clearTimeout(timer);
        if (tl) tl.kill();
    });
}