import {listen} from '../lib/lifecycle';
import {qs} from '../lib/utils';

export function initEldersSlider() {
    const slider = qs('#elders-slider');
    if (!slider) return;

    // راست‌به‌چپ: «بعدی» یعنی حرکت به چپ، که در scrollLeft مقدار منفی است
    const next = qs('#slider-next');
    const prev = qs('#slider-prev');

    if (next) listen(next, 'click', () => slider.scrollBy({left: -280, behavior: 'smooth'}));
    if (prev) listen(prev, 'click', () => slider.scrollBy({left: 280, behavior: 'smooth'}));

    // کشیدن با موس (در لمسی، اسکرول خود مرورگر کار می‌کند)
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;

    listen(slider, 'pointerdown', (e) => {
        if (e.pointerType !== 'mouse') return;
        down = true;
        moved = false;
        startX = e.clientX;
        startLeft = slider.scrollLeft;
    });

    listen(window, 'pointermove', (e) => {
        if (!down) return;

        const dx = e.clientX - startX;
        if (Math.abs(dx) > 5) {
            moved = true;
            slider.classList.add('dragging');
        }
        if (moved) slider.scrollLeft = startLeft + dx;
    });

    listen(window, 'pointerup', () => {
        down = false;
        slider.classList.remove('dragging');
    });

    // بعد از کشیدن، روی لینک کلیک نشه
    listen(
        slider,
        'click',
        (e) => {
            if (moved) {
                e.preventDefault();
                e.stopPropagation();
                moved = false;
            }
        },
        true
    );

    // جلوگیری از کشیدن تصویر به‌عنوان فایل
    listen(slider, 'dragstart', (e) => e.preventDefault());
}
