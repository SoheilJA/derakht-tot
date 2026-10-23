import { listen, onCleanup } from '../lib/lifecycle';
import { clamp, debounce, qsa } from '../lib/utils';

export function initTrunk() {
    const bar = document.createElement('div');
    bar.id = 'trunk-progress';
    bar.className =
        'fixed left-4 xl:left-6 top-1/2 -translate-y-1/2 z-40 h-[44vh] w-px hidden md:block';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML =
        '<div class="absolute inset-y-0 right-0 w-px bg-bark-900/15"></div>' +
        '<div id="trunk-fill" class="absolute top-0 right-0 w-[3px] h-7 -mx-px rounded-full bg-bark-500 origin-top"></div>' +
        '<div id="trunk-leaves" class="absolute inset-0"></div>';
    document.body.appendChild(bar);

    const fill = bar.querySelector('#trunk-fill');
    const leaves = bar.querySelector('#trunk-leaves');
    let markers = [];

    const maxScroll = () => document.documentElement.scrollHeight - innerHeight + 1;

    function build() {
        leaves.innerHTML = '';
        markers = [];

        qsa('main section[id], main header[id]').forEach((s) => {
            const frac = clamp(s.offsetTop / maxScroll(), 0, 1);

            const el = document.createElement('div');
            el.className = 'absolute right-[-5px] w-4 h-4 -mr-[3px] text-leaf-500';
            el.style.top = `calc(${frac * 100}% - 8px)`;
            el.innerHTML =
                '<svg viewBox="0 0 24 24" fill="currentColor" style="transform:scale(0);transition:transform .4s cubic-bezier(.34,1.56,.64,1)"><path d="M12 2C7 2 3 6.5 3 12c0 5 4 9.5 9 10 5-.5 9-5 9-10 0-5.5-4-10-9-10z"/></svg>';

            leaves.appendChild(el);
            markers.push({ el, frac });
        });
    }

    const onScroll = () => {
        const p = clamp(window.scrollY / maxScroll(), 0, 1);
        fill.style.transform = `scaleY(${p})`;
        markers.forEach((m) => {
            m.el.firstChild.style.transform = p >= m.frac ? 'scale(1)' : 'scale(0)';
        });
    };

    // صبر می‌کنیم تا چیدمان صفحه نهایی بشه
    const timer = setTimeout(() => {
        build();
        onScroll();
    }, 600);

    listen(window, 'scroll', onScroll, { passive: true });
    listen(
        window,
        'resize',
        debounce(() => {
            build();
            onScroll();
        }, 300)
    );

    onCleanup(() => {
        clearTimeout(timer);
        bar.remove();
    });
}