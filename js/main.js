/* ============================================================
   js/main.js — global init: preloader, navbar, cursor,
   trunk progress, ambient leaves, reveals, dividers, lightbox.
   Exposes window.VSite for page scripts.
   ============================================================ */
window.VSite = (function () {
    'use strict';
    var U = window.VUtils, RM = U.reduced();

    /* ================= PRELOADER ================= */
    function initPreloader() {
        var pre = document.getElementById('preloader');
        if (!pre) { dispatchReady(); return; }
        var quick = sessionStorage.getItem('villageVisited') ? 0.45 : 1;
        sessionStorage.setItem('villageVisited', '1');
        var finish = function () {
            gsap.timeline()
                .to('#pre-content', { autoAlpha: 0, duration: .3 })
                .to(pre.querySelectorAll('.pre-panel')[0], { clipPath: 'inset(0 0 100% 0)', duration: .8, ease: 'power4.inOut' }, '>-.05')
                .to(pre.querySelectorAll('.pre-panel')[1], { clipPath: 'inset(100% 0 0 0)', duration: .8, ease: 'power4.inOut' }, '<')
                .add(function () { pre.remove(); dispatchReady(); });
        };
        if (RM) { finish(); return; }
        // draw branches
        U.qsa('.pl-branch', pre).forEach(function (p) {
            var L = p.getTotalLength();
            p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
            gsap.to(p, { strokeDashoffset: 0, duration: 1.4 * quick, ease: 'power2.inOut' });
        });
        // leaves pop
        gsap.fromTo('.pl-leaf', { scale: 0, transformOrigin: 'center' },
            { scale: 1, duration: .5, stagger: .13 * quick, ease: 'back.out(2.4)', delay: .45 * quick });
        // berries ripen: green -> red -> deep purple
        U.qsa('.pl-berry', pre).forEach(function (b, i) {
            anime({
                targets: b, fill: [{ value: '#3E8E41' }, { value: '#C24C4C', duration: 500 }, { value: '#5A1A3F', duration: 500 }],
                easing: 'easeInOutSine', delay: 700 * quick + i * 250 * quick
            });
        });
        // percentage counter
        var num = document.getElementById('pl-num'), obj = { v: 0 };
        anime({
            targets: obj, v: 100, round: 1, duration: 2000 * quick, easing: 'easeInOutQuad',
            update: function () { if (num) num.textContent = U.toFa(obj.v); },
            complete: finish
        });
    }
    function dispatchReady() { window.dispatchEvent(new CustomEvent('village:ready')); }

    /* ================= NAVBAR ================= */
    function initNavbar() {
        var nav = document.getElementById('site-nav');
        if (!nav) return;
        var onScroll = function () {
            var s = window.scrollY > 40;
            nav.classList.toggle('scrolled', s);
            var inner = nav.querySelector('.nav-inner');
            inner.classList.toggle('py-4', !s); inner.classList.toggle('py-2.5', s);
            nav.classList.toggle('bg-mulberry-900/85', s);
            nav.classList.toggle('backdrop-blur-md', s);
            nav.classList.toggle('shadow-[0_10px_40px_-15px_rgba(43,10,31,.6)]', s);
        };
        onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
        // active link
        var active = document.body.dataset.nav;
        U.qsa('[data-navlink]').forEach(function (a) {
            if (a.dataset.navlink === active) a.querySelector('.nav-leaf').classList.remove('opacity-0', 'scale-0');
        });
        // section scrollspy on the homepage
        if (document.body.dataset.page === 'home') {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) {
                    if (en.isIntersecting) {
                        U.qsa('[data-navlink]').forEach(function (a) {
                            a.querySelector('.nav-leaf').classList.toggle('opacity-0', a.dataset.navlink !== en.target.dataset.navsec);
                            a.querySelector('.nav-leaf').classList.toggle('scale-0', a.dataset.navlink !== en.target.dataset.navsec);
                        });
                    }
                });
            }, { rootMargin: '-40% 0px -55% 0px' });
            U.qsa('section[data-navsec]').forEach(function (s) { io.observe(s); });
        }
    }

    /* ================= MOBILE MENU ================= */
    function initMobileMenu() {
        var btn = document.getElementById('menu-btn'), menu = document.getElementById('mobile-menu');
        if (!btn || !menu) return;
        var open = false, tl = null;
        function show() {
            open = true; menu.classList.remove('hidden'); document.body.style.overflow = 'hidden';
            btn.setAttribute('aria-expanded', 'true');
            var lines = U.qsa('.menu-line', btn);
            lines[0].style.transform = 'translateY(6px) rotate(45deg)';
            lines[1].style.transform = 'rotate(-45deg)'; lines[2].style.opacity = '0';
            tl = gsap.timeline();
            tl.fromTo(menu, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3 })
                .fromTo('.mm-branch', { strokeDasharray: function (i, el) { var L = el.getTotalLength(); el.style.strokeDashoffset = L; return L; }, strokeDashoffset: function (i, el) { return el.getTotalLength(); } },
                    { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' }, 0)
                .to('.mm-link', { opacity: 1, y: 0, duration: .5, stagger: .07, ease: 'power3.out', startAt: { y: 26 } }, .15);
            var first = menu.querySelector('.mm-link'); if (first) first.focus();
        }
        function hide() {
            open = false; document.body.style.overflow = '';
            btn.setAttribute('aria-expanded', 'false');
            var lines = U.qsa('.menu-line', btn);
            lines.forEach(function (l) { l.style.transform = ''; l.style.opacity = ''; });
            gsap.to(menu, {
                autoAlpha: 0, duration: .25, onComplete: function () {
                    menu.classList.add('hidden');
                    U.qsa('.mm-link', menu).forEach(function (a) { a.style.opacity = '0'; });
                }
            });
        }
        btn.addEventListener('click', function () { open ? hide() : show(); });
        menu.addEventListener('click', function (e) { if (e.target.closest('a')) hide(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) { hide(); btn.focus(); } });
    }

    /* ================= CUSTOM CURSOR ================= */
    function initCursor() {
        if (RM || !window.matchMedia('(pointer:fine)').matches) return;
        document.body.classList.add('has-cursor');
        var dot = document.createElement('div'); dot.id = 'cursor-dot';
        var ring = document.createElement('div'); ring.id = 'cursor-ring';
        ring.innerHTML = '<span>مشاهده</span>';
        document.body.append(dot, ring);
        var x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
        document.addEventListener('mousemove', function (e) {
            x = e.clientX; y = e.clientY;
            dot.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        });
        (function loop() {
            rx += (x - rx) * .16; ry += (y - ry) * .16;
            ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
            requestAnimationFrame(loop);
        })();
        // morph over interactive cards
        document.addEventListener('mouseover', function (e) {
            if (e.target.closest('[data-cursor="view"], a, button')) {
                var isView = e.target.closest('[data-cursor="view"]');
                ring.classList.toggle('is-view', !!isView);
                if (!isView) gsap.to(ring, { width: 52, height: 52, margin: '-26px 0 0 -26px', duration: .25 });
            }
        });
        document.addEventListener('mouseout', function (e) {
            if (e.target.closest('[data-cursor="view"], a, button')) {
                ring.classList.remove('is-view');
                gsap.to(ring, { width: 38, height: 38, margin: '-19px 0 0 -19px', duration: .25 });
            }
        });
        // magnetic buttons
        document.addEventListener('mousemove', U.debounce(function () { }, 0));
        document.addEventListener('mousemove', function (e) {
            var m = e.target.closest('[data-magnetic]');
            U.qsa('[data-magnetic]').forEach(function (b) {
                if (b !== m && b._mag) { b._mag = false; gsap.to(b, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.4)' }); }
            });
            if (m) {
                m._mag = true;
                var r = m.getBoundingClientRect();
                gsap.to(m, { x: (e.clientX - r.left - r.width / 2) * .28, y: (e.clientY - r.top - r.height / 2) * .28, duration: .35, ease: 'power2.out' });
            }
        });
    }

    /* ================= TRUNK SCROLL PROGRESS ================= */
    function initTrunk() {
        var bar = document.createElement('div');
        bar.id = 'trunk-progress';
        bar.className = 'fixed left-4 xl:left-6 top-1/2 -translate-y-1/2 z-40 h-[44vh] w-px hidden md:block';
        bar.setAttribute('aria-hidden', 'true');
        bar.innerHTML = '<div class="absolute inset-y-0 right-0 w-px bg-bark-900/15"></div>' +
            '<div id="trunk-fill" class="absolute top-0 right-0 w-[3px] h-7 -mx-px rounded-full bg-bark-500 origin-top"></div>' +
            '<div id="trunk-leaves" class="absolute inset-0"></div>';
        document.body.appendChild(bar);
        var fill = bar.querySelector('#trunk-fill'), leaves = bar.querySelector('#trunk-leaves'), markers = [];
        function build() {
            leaves.innerHTML = ''; markers = [];
            var total = document.documentElement.scrollHeight - innerHeight;
            U.qsa('main section[id], main header[id]').forEach(function (s) {
                var frac = U.clamp(s.offsetTop / (document.documentElement.scrollHeight - innerHeight + 1), 0, 1);
                var el = document.createElement('div');
                el.className = 'absolute right-[-5px] w-4 h-4 -mr-[3px] text-leaf-500';
                el.style.top = 'calc(' + (frac * 100) + '% - 8px)';
                el.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" style="transform:scale(0);transition:transform .4s cubic-bezier(.34,1.56,.64,1)"><path d="M12 2C7 2 3 6.5 3 12c0 5 4 9.5 9 10 5-.5 9-5 9-10 0-5.5-4-10-9-10z"/></svg>';
                leaves.appendChild(el); markers.push({ el: el, frac: frac });
            });
        }
        var onScroll = function () {
            var p = U.clamp(window.scrollY / (document.documentElement.scrollHeight - innerHeight + 1), 0, 1);
            fill.style.transform = 'scaleY(' + p + ')';
            markers.forEach(function (m) { m.el.firstChild.style.transform = p >= m.frac ? 'scale(1)' : 'scale(0)'; });
        };
        setTimeout(function () { build(); onScroll(); }, 600);
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', U.debounce(function () { build(); onScroll(); }, 300));
    }

    /* ================= AMBIENT FALLING LEAVES ================= */
    function initAmbient() {
        if (RM || document.body.dataset.chrome === 'minimal') return;
        var cv = document.createElement('canvas');
        cv.id = 'ambient-canvas';
        cv.className = 'fixed inset-0 z-[5] pointer-events-none';
        cv.style.mixBlendMode = 'multiply'; cv.style.opacity = '.5';
        document.body.appendChild(cv);
        var ctx = cv.getContext('2d'), W, H, leaves = [], running = true;
        var COUNT = innerWidth < 768 ? 6 : 14;
        var COLORS = ['#C26A97', '#8E2C63', '#8BC17A', '#3E8E41', '#D4A24C'];
        function size() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
        size(); window.addEventListener('resize', U.debounce(size, 250));
        for (var i = 0; i < COUNT; i++) leaves.push(seed(Math.random() * H));
        function seed(y) {
            return {
                x: Math.random() * innerWidth, y: y, s: 8 + Math.random() * 10, v: .4 + Math.random() * .8,
                ph: Math.random() * Math.PI * 2, r: Math.random() * Math.PI * 2, vr: (Math.random() - .5) * .02,
                c: COLORS[Math.floor(Math.random() * COLORS.length)]
            };
        }
        function drawLeaf(l) {
            ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.r); ctx.fillStyle = l.c;
            ctx.beginPath();
            ctx.moveTo(0, -l.s);
            ctx.quadraticCurveTo(l.s, -l.s * .3, 0, l.s);
            ctx.quadraticCurveTo(-l.s, -l.s * .3, 0, -l.s);
            ctx.fill(); ctx.restore();
        }
        (function frame(t) {
            requestAnimationFrame(frame);
            if (!running) return;
            ctx.clearRect(0, 0, W, H);
            leaves.forEach(function (l) {
                l.y += l.v; l.x += Math.sin(t / 1600 + l.ph) * .6; l.r += l.vr;
                if (l.y > H + 30) Object.assign(l, seed(-30));
                drawLeaf(l);
            });
        })(0);
        document.addEventListener('visibilitychange', function () { running = !document.hidden; });
    }

    /* ================= SECTION DIVIDERS ================= */
    var DIVIDER_SVG = '<svg viewBox="0 0 1200 90" class="w-full h-14 md:h-20" fill="none" aria-hidden="true">' +
        '<path class="dv-branch" d="M0,46 C160,26 300,66 480,44 S800,62 940,38 S1140,50 1200,42" stroke="#7A5636" stroke-width="3.5" stroke-linecap="round"/>' +
        '<path class="dv-leaf" d="M300,44 q-14,-18 -8,-38 q14,18 8,38" fill="#3E8E41"/>' +
        '<path class="dv-leaf" d="M480,44 q16,-16 12,-38 q-16,16 -12,38" fill="#8BC17A"/>' +
        '<path class="dv-leaf" d="M700,50 q-14,-20 -6,-40 q14,20 6,40" fill="#1F4D2B"/>' +
        '<path class="dv-leaf" d="M940,38 q16,-14 14,-36 q-16,14 -14,36" fill="#3E8E41"/>' +
        '<circle class="dv-leaf" cx="596" cy="36" r="5" fill="#8E2C63"/>' +
        '<circle class="dv-leaf" cx="824" cy="52" r="5" fill="#5A1A3F"/>' +
        '</svg>';
    function initDividers() {
        U.qsa('[data-divider]').forEach(function (d) {
            d.innerHTML = DIVIDER_SVG;
            var br = d.querySelector('.dv-branch');
            var L = br.getTotalLength();
            br.style.strokeDasharray = L; br.style.strokeDashoffset = RM ? 0 : L;
            if (RM) return;
            gsap.to(br, {
                strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut',
                scrollTrigger: { trigger: d, start: 'top 92%' }
            });
            gsap.fromTo(d.querySelectorAll('.dv-leaf'), { scale: 0, transformOrigin: 'center' },
                {
                    scale: 1, duration: .55, stagger: .1, ease: 'back.out(2.5)',
                    scrollTrigger: { trigger: d, start: 'top 92%' }
                });
        });
    }

    /* ================= REVEAL ON SCROLL ================= */
    function initReveals(root) {
        if (RM) return;
        U.qsa('[data-reveal]', root || document).forEach(function (el) {
            if (el._revealed) return; el._revealed = true;
            gsap.from(el, {
                y: 36, autoAlpha: 0, duration: .9, ease: 'power3.out',
                delay: parseFloat(el.dataset.reveal) || 0,
                scrollTrigger: { trigger: el, start: 'top 88%' }
            });
        });
    }

    /* ================= BUTTONS: ripple + berry burst ================= */
    function initButtons() {
        document.addEventListener('click', function (e) {
            var b = e.target.closest('.btn-primary, .btn-ghost');
            if (!b) return;
            var r = b.getBoundingClientRect(), s = document.createElement('span');
            s.className = 'ripple'; s.style.width = s.style.height = Math.max(r.width, r.height) + 'px';
            s.style.left = (e.clientX - r.left - r.width / 2) + 'px'; s.style.top = (e.clientY - r.top - r.height / 2) + 'px';
            b.appendChild(s); setTimeout(function () { s.remove(); }, 700);
        });
        if (RM) return;
        document.addEventListener('mouseenter', function (e) {
            var b = e.target.closest('.btn-primary');
            if (!b) return;
            var r = b.getBoundingClientRect();
            for (var i = 0; i < 7; i++) {
                var p = document.createElement('span');
                var isLeaf = i % 3 === 0;
                p.className = 'burst-p';
                p.style.cssText = 'left:' + (r.width / 2) + 'px;top:' + (r.height / 2) + 'px;' + (isLeaf ? 'width:10px;height:10px;' : 'width:6px;height:6px;border-radius:50%;background:' + (i % 2 ? '#8E2C63' : '#5A1A3F') + ';');
                if (isLeaf) p.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="#3E8E41"><path d="M12 2C7 2 3 6.5 3 12c0 5 4 9.5 9 10 5-.5 9-5 9-10 0-5.5-4-10-9-10z"/></svg>';
                b.appendChild(p);
                var ang = Math.random() * Math.PI * 2, dist = 40 + Math.random() * 34;
                anime({
                    targets: p, translateX: Math.cos(ang) * dist, translateY: Math.sin(ang) * dist - 18,
                    scale: [1, 0], opacity: [1, 0], duration: 700 + Math.random() * 300, easing: 'easeOutCubic',
                    complete: function () { p.remove(); }
                });
            }
        }, true);
    }

    /* ================= LIGHTBOX (shared) ================= */
    var lbState = { items: [], i: 0, el: null };
    function lightbox(items, index) {
        lbState.items = items; lbState.i = index || 0;
        if (lbState.el) lbState.el.remove();
        var lb = document.createElement('div');
        lb.id = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-label', 'نمایش تصویر');
        lb.innerHTML = '<button class="lb-btn" style="top:20px;left:20px" data-lb-close aria-label="بستن"><svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
            '<button class="lb-btn" style="top:50%;right:20px;transform:translateY(-50%)" data-lb-next aria-label="تصویر بعدی"><svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 6l-6 6 6 6"/></svg></button>' +
            '<button class="lb-btn" style="top:50%;left:20px;transform:translateY(-50%)" data-lb-prev aria-label="تصویر قبلی"><svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M9 6l6 6-6 6"/></svg></button>' +
            '<img alt=""><p class="lb-cap"></p>';
        document.body.appendChild(lb); lbState.el = lb;
        document.body.style.overflow = 'hidden';
        function show(dir) {
            lbState.i = (lbState.i + dir + lbState.items.length) % lbState.items.length;
            var it = lbState.items[lbState.i];
            var img = lb.querySelector('img'), cap = lb.querySelector('.lb-cap');
            gsap.fromTo(img, { autoAlpha: 0, scale: .92, x: 30 * dir }, { autoAlpha: 1, scale: 1, x: 0, duration: .45, ease: 'power3.out' });
            img.src = it.src; img.alt = it.alt || ''; cap.textContent = it.caption || '';
        }
        function close() { gsap.to(lb, { autoAlpha: 0, duration: .25, onComplete: function () { lb.remove(); lbState.el = null; document.body.style.overflow = ''; } }); }
        lb.querySelector('[data-lb-close]').addEventListener('click', close);
        lb.querySelector('[data-lb-next]').addEventListener('click', function () { show(-1); });
        lb.querySelector('[data-lb-prev]').addEventListener('click', function () { show(1); });
        lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
        document.addEventListener('keydown', function h(e) {
            if (!lbState.el) { document.removeEventListener('keydown', h); return; }
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') show(-1);
            if (e.key === 'ArrowRight') show(1);
        });
        gsap.fromTo(lb, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3 });
        show(0);
        lb.querySelector('[data-lb-close]').focus();
    }

    /* ================= INIT ================= */
    function init() {
        var minimal = document.body.dataset.chrome === 'minimal';
        VillageLayout.mount({ navbar: !minimal, footer: !minimal });
        gsap.registerPlugin(ScrollTrigger);
        initPreloader(); initNavbar(); initMobileMenu(); initCursor();
        if (!minimal) { initTrunk(); initAmbient(); }
        initDividers(); initButtons(); initReveals();
        // keep pin calculations honest after images load
        window.addEventListener('load', function () { ScrollTrigger.refresh(); });
        window.addEventListener('resize', U.debounce(function () { ScrollTrigger.refresh(); }, 350));
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

    return { lightbox: lightbox, reveals: initReveals, toFa: U.toFa };
})();