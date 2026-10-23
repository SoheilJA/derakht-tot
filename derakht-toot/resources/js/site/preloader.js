import gsap from 'gsap';
import anime from 'animejs';
import { qsa, reduced, toFa } from '../lib/utils';

function ready() {
    window.dispatchEvent(new CustomEvent('village:ready'));
}

export function initPreloader(firstLoad) {
    const pre = document.getElementById('preloader');

    if (!pre) return ready();

    // فقط بار اول (رفرش کامل) نمایش داده می‌شه، نه در جابه‌جایی بین صفحه‌ها
    if (!firstLoad) {
        pre.remove();
        return ready();
    }

    let quick = 1;
    try {
        quick = sessionStorage.getItem('villageVisited') ? 0.45 : 1;
        sessionStorage.setItem('villageVisited', '1');
    } catch (e) {
        /* storage در دسترس نیست */
    }

    const panels = pre.querySelectorAll('.pre-panel');

    const finish = () => {
        gsap.timeline()
            .to('#pre-content', { autoAlpha: 0, duration: 0.3 })
            .to(
                panels[0],
                { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'power4.inOut' },
                '>-0.05'
            )
            .to(
                panels[1],
                { clipPath: 'inset(100% 0 0 0)', duration: 0.8, ease: 'power4.inOut' },
                '<'
            )
            .add(() => {
                pre.remove();
                ready();
            });
    };

    if (reduced()) return finish();

    // رسم شاخه‌ها
    qsa('.pl-branch', pre).forEach((p) => {
        const length = p.getTotalLength();
        p.style.strokeDasharray = length;
        p.style.strokeDashoffset = length;
        gsap.to(p, {
            strokeDashoffset: 0,
            duration: 1.4 * quick,
            ease: 'power2.inOut',
        });
    });

    // ظاهر شدن برگ‌ها
    gsap.fromTo(
        '.pl-leaf',
        { scale: 0, transformOrigin: 'center' },
        {
            scale: 1,
            duration: 0.5,
            stagger: 0.13 * quick,
            ease: 'back.out(2.4)',
            delay: 0.45 * quick,
        }
    );

    // رسیدن توت‌ها: سبز، قرمز، بنفش تیره
    qsa('.pl-berry', pre).forEach((berry, i) => {
        anime({
            targets: berry,
            fill: [
                { value: '#3E8E41' },
                { value: '#C24C4C', duration: 500 },
                { value: '#5A1A3F', duration: 500 },
            ],
            easing: 'easeInOutSine',
            delay: 700 * quick + i * 250 * quick,
        });
    });

    // شمارنده‌ی درصد
    const num = document.getElementById('pl-num');
    const counter = { v: 0 };

    anime({
        targets: counter,
        v: 100,
        round: 1,
        duration: 2000 * quick,
        easing: 'easeInOutQuad',
        update: () => {
            if (num) num.textContent = toFa(counter.v);
        },
        complete: finish,
    });
}