/* ============================================================
   js/home.js — homepage logic (reads data ONLY via data-service)
   ============================================================ */
(function () {
    'use strict';
    var U = window.VUtils, D = window.VillageData, RM = U.reduced();
    var ICONS = {
        water: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z"/></svg>',
        silk: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 4h10M7 20h10M8 4c0 5 8 5 8 10s-8 5-8 10M16 4c0 5-8 5-8 10s8 5 8 10"/></svg>',
        mulberry: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="9" cy="9" r="2.4"/><circle cx="15" cy="9" r="2.4"/><circle cx="12" cy="14" r="2.4"/><path d="M12 21v-4"/></svg>',
        mountain: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 20L9 8l4 7 3-4 5 9H3z"/></svg>',
        dried: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="9" r="3"/><circle cx="15" cy="9" r="3"/><circle cx="12" cy="15" r="3"/></svg>',
        craft: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 8h16M4 16h16M8 8v8M12 8v8M16 8v8M4 8l2-3h12l2 3M4 16l2 3h12l2-3"/></svg>',
        ritual: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3c2 3 5 5 5 9a5 5 0 01-10 0c0-4 3-6 5-9z"/><path d="M12 21v-3"/></svg>'
    };

    /* ---------- hero text reveal (after preloader) ---------- */
    var heroPlayed = false;
    function playHero() {
        if (heroPlayed) return; heroPlayed = true;
        var chars = U.splitText(U.qs('#hero-title'));
        if (RM) return;
        gsap.timeline()
            .to({}, { duration: .1 })
            .from(chars, { yPercent: 110, rotate: 6, opacity: 0, duration: .9, stagger: .045, ease: 'back.out(1.8)' })
            .to('[data-hero-el="kicker"]', { opacity: 1, duration: .7 }, '-=.5')
            .to('[data-hero-el="sub"]', { opacity: 1, y: 0, duration: .8, startAt: { y: 18 } }, '-=.4')
            .to('[data-hero-el="cta"]', { opacity: 1, y: 0, duration: .7, startAt: { y: 16 } }, '-=.4');
    }
    window.addEventListener('village:ready', playHero);
    setTimeout(playHero, 3500); // safety if the event was missed

    /* ---------- about: parallax + tilt + facts + counters ---------- */
    function initAbout(v) {
        // facts
        var facts = U.qs('#facts');
        facts.innerHTML = v.facts.map(function (f, i) {
            return '<li class="flex items-start gap-3" data-reveal="' + (i * 0.08) + '"><span class="shrink-0 w-10 h-10 rounded-full bg-leaf-900 text-leaf-300 flex items-center justify-center">' + ICONS[f.icon] + '</span>' +
                '<div><b class="block text-bark-900">' + f.title + '</b><span class="text-sm text-bark-700/85 leading-7">' + f.text + '</span></div></li>';
        }).join('');
        // counters
        var row = U.qs('#stats-row');
        row.innerHTML = v.stats.map(function (s) {
            return '<div class="stat-card bg-cream-100 border border-sand-300 rounded-3xl px-4 py-6 text-center" data-reveal>' +
                '<div class="font-display text-3xl md:text-4xl text-mulberry-700"><span class="stat-num" data-target="' + s.value + '">۰</span><span class="text-lg text-mulberry-300 font-body"> ' + s.suffix + '</span></div>' +
                '<div class="text-xs md:text-sm text-bark-700/70 mt-1">' + s.label + '</div></div>';
        }).join('');
        ScrollTrigger.create({
            trigger: row, start: 'top 85%', once: true,
            onEnter: function () {
                U.qsa('.stat-num', row).forEach(function (el) {
                    var o = { v: 0 };
                    anime({
                        targets: o, v: +el.dataset.target, round: 1, duration: 1800, easing: 'easeOutExpo',
                        update: function () { el.textContent = U.toFa(o.v); }
                    });
                });
            }
        });
        if (RM) return;
        // collage parallax
        U.qsa('#about-collage [data-parallax]').forEach(function (el) {
            gsap.to(el, {
                yPercent: +el.dataset.parallax, ease: 'none',
                scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 1 }
            });
        });
        // hover tilt
        if (window.matchMedia('(pointer:fine)').matches) {
            U.qsa('.tilt').forEach(function (el) {
                el.addEventListener('mousemove', function (e) {
                    var r = el.getBoundingClientRect();
                    gsap.to(el, {
                        rotateY: ((e.clientX - r.left) / r.width - .5) * 14, rotateX: -((e.clientY - r.top) / r.height - .5) * 14,
                        transformPerspective: 700, duration: .4, ease: 'power2.out'
                    });
                });
                el.addEventListener('mouseleave', function () { gsap.to(el, { rotateX: 0, rotateY: 0, duration: .7, ease: 'elastic.out(1,.45)' }); });
            });
        }
    }

    /* ---------- horizontal pinned gallery (RTL-correct) ---------- */
    function initGallery(gallery) {
        var track = U.qs('#gallery-track');
        var items = gallery.map(function (g, i) {
            return { src: g.url, caption: g.title + ' — ' + g.desc, alt: g.alt };
        });
        track.innerHTML = gallery.map(function (g, i) {
            return '<figure class="g-card group relative shrink-0 w-[78vw] sm:w-[420px] rounded-[26px] overflow-hidden shadow-2xl cursor-pointer" data-cursor="view" data-gi="' + i + '" tabindex="0" role="button" aria-label="بزرگ‌نمایی ' + g.title + '">' +
                '<div class="h-[56vh] overflow-hidden"><img src="' + g.url + '" alt="' + U.escapeHtml(g.alt) + '" loading="lazy" class="g-img w-full h-full object-cover scale-110 transition-transform duration-[900ms] group-hover:scale-125"></div>' +
                '<figcaption class="absolute inset-x-0 bottom-0 p-5 pt-14 bg-gradient-to-t from-black/75 to-transparent text-cream-50">' +
                '<h3 class="font-display text-2xl">' + g.title + '</h3><p class="text-sm text-cream-100/75">' + g.desc + '</p></figcaption></figure>';
        }).join('');
        function openLb(i) { VSite.lightbox(items, i); }
        track.addEventListener('click', function (e) { var c = e.target.closest('.g-card'); if (c) openLb(+c.dataset.gi); });
        track.addEventListener('keydown', function (e) { var c = e.target.closest('.g-card'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openLb(+c.dataset.gi); } });
        if (RM) return;
        // inner-image parallax + pinned horizontal scroll on desktop only
        var mm = gsap.matchMedia();
        mm.add('(min-width: 768px)', function () {
            var dist = function () { return Math.max(0, track.scrollWidth - track.parentElement.clientWidth); };
            var tween = gsap.to(track, {
                x: function () { return dist(); }, ease: 'none',
                scrollTrigger: {
                    trigger: '#gallery', start: 'top top', end: function () { return '+=' + dist(); },
                    pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
                }
            });
            U.qsa('.g-img', track).forEach(function (img) {
                gsap.fromTo(img, { x: -46 }, {
                    x: 46, ease: 'none',
                    scrollTrigger: { trigger: img.closest('.g-card'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true }
                });
            });
            return function () { };
        });
        U.qsa('.g-img', track).forEach(function (img) { img.addEventListener('load', U.debounce(function () { ScrollTrigger.refresh(); }, 200)); });
    }

    /* ---------- history: growing trunk timeline ---------- */
    var tlTriggers = [];
    function buildTimeline(events, desktop) {
        var root = U.qs('#timeline');
        root.innerHTML = '';
        tlTriggers.forEach(function (t) { t.kill(); }); tlTriggers = [];
        var rows = events.map(function (ev, i) {
            var row = document.createElement('div');
            row.className = 'tl-row flex ' + (desktop ? (i % 2 ? 'justify-start' : 'justify-end') : 'justify-start');
            var card = document.createElement('article');
            card.className = 'tl-card relative z-10 w-full md:w-[44%] mb-10 md:mb-16 bg-cream-50 border border-sand-300 rounded-[26px] p-6 shadow-[0_20px_50px_-30px_rgba(74,51,33,.5)]' + (desktop ? '' : ' mr-12');
            card.innerHTML = '<div class="flex items-baseline gap-3 mb-1"><span class="tl-year font-display text-4xl text-mulberry-500" data-year="' + ev.year + '">' + U.toFa(0) + '</span><span class="text-xs text-bark-500">میلادی</span></div>' +
                '<h3 class="font-display text-2xl text-bark-900 mb-2">' + ev.title + '</h3>' +
                '<p class="text-bark-700/90 leading-8 text-sm md:text-base">' + ev.text + '</p>';
            row.appendChild(card); root.appendChild(row);
            return { card: card, ev: ev };
        });
        requestAnimationFrame(function () { draw(events, rows, root, desktop); });
        if (!RM) rows.forEach(function (r, i) {
            tlTriggers.push(ScrollTrigger.create({
                trigger: r.card, start: 'top 82%', once: true,
                onEnter: function () {
                    gsap.from(r.card, { y: 40, autoAlpha: 0, duration: .8, ease: 'power3.out' });
                    var y = r.card.querySelector('.tl-year'), o = { v: 0 };
                    anime({
                        targets: o, v: r.ev.year, round: 1, duration: 1300, easing: 'easeOutExpo',
                        update: function () { y.textContent = U.toFa(o.v); }
                    });
                }
            }));
        });
    }
    function draw(events, rows, root, desktop) {
        var old = root.querySelector('svg'); if (old) old.remove();
        var W = root.clientWidth, H = root.offsetHeight;
        var tx = desktop ? W / 2 : W - 16;
        var NS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('class', 'absolute inset-0 pointer-events-none');
        svg.setAttribute('width', W); svg.setAttribute('height', H);
        var trunkD = 'M ' + tx + ' 0';
        var step = H / events.length;
        for (var i = 0; i < events.length; i++) {
            var off = (i % 2 ? 26 : -26) * (desktop ? 1 : .35);
            trunkD += ' C ' + (tx + off) + ' ' + (i * step + step * .33) + ', ' + (tx + off) + ' ' + (i * step + step * .66) + ', ' + tx + ' ' + ((i + 1) * step);
        }
        var trunk = document.createElementNS(NS, 'path');
        trunk.setAttribute('d', trunkD); trunk.setAttribute('stroke', '#7A5636'); trunk.setAttribute('stroke-width', '7');
        trunk.setAttribute('stroke-linecap', 'round'); trunk.setAttribute('fill', 'none');
        svg.appendChild(trunk);
        // branch + leaf to each card
        rows.forEach(function (r) {
            var rr = root.getBoundingClientRect(), cr = r.card.getBoundingClientRect();
            var y = cr.top - rr.top + 46;
            var edge = desktop ? (cr.left - rr.left > tx ? cr.left - rr.left : cr.right - rr.left) : cr.right - rr.left;
            var b = document.createElementNS(NS, 'path');
            var mid = (tx + edge) / 2;
            b.setAttribute('d', 'M ' + tx + ' ' + y + ' C ' + mid + ' ' + (y - 26) + ', ' + mid + ' ' + (y + 26) + ', ' + edge + ' ' + y);
            b.setAttribute('stroke', '#7A5636'); b.setAttribute('stroke-width', '3'); b.setAttribute('fill', 'none');
            b.setAttribute('stroke-linecap', 'round'); svg.appendChild(b);
            var leaf = document.createElementNS(NS, 'path');
            leaf.setAttribute('d', 'M' + edge + ',' + y + ' q' + (desktop ? -14 : 14) + ',-10 ' + (desktop ? -10 : 10) + ',-26 q' + (desktop ? 12 : -12) + ',12 ' + (desktop ? 10 : -10) + ',26');
            leaf.setAttribute('fill', '#3E8E41'); leaf.classList.add('dv-leaf'); svg.appendChild(leaf);
            if (!RM) {
                var L = b.getTotalLength();
                b.style.strokeDasharray = L; b.style.strokeDashoffset = L;
                gsap.set(leaf, { scale: 0 });
                tlTriggers.push(ScrollTrigger.create({
                    trigger: r.card, start: 'top 75%', once: true,
                    onEnter: function () {
                        gsap.to(b, { strokeDashoffset: 0, duration: .8, ease: 'power2.out' });
                        gsap.to(leaf, { scale: 1, duration: .5, delay: .5, ease: 'back.out(2.5)' });
                    }
                }));
            }
        });
        root.appendChild(svg);
        if (!RM) { // trunk scrub — the tree "grows" with the scroll
            var TL = trunk.getTotalLength();
            trunk.style.strokeDasharray = TL; trunk.style.strokeDashoffset = TL;
            tlTriggers.push(ScrollTrigger.create({
                trigger: '#history', start: 'top 75%', end: 'bottom 70%', scrub: .6,
                onUpdate: function (st) { trunk.style.strokeDashoffset = TL * (1 - st.progress); }
            }));
        }
    }

    /* ---------- traditions ---------- */
    function initTraditions(tr) {
        var grid = U.qs('#traditions-grid');
        grid.innerHTML = tr.map(function (t, i) {
            return '<article class="trad-card group bg-leaf-900/60 backdrop-blur-sm border border-leaf-700/60 rounded-[26px] p-6 text-center" data-reveal="' + (i * .08) + '">' +
                '<div class="trad-icon w-16 h-16 mx-auto rounded-full bg-mulberry-900 border border-gold-500/30 text-gold-500 flex items-center justify-center mb-4 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">' + ICONS[t.icon] + '</div>' +
                '<h3 class="font-display text-2xl text-cream-50 mb-2">' + t.title + '</h3>' +
                '<p class="text-sm text-cream-100/65 leading-7">' + t.text + '</p></article>';
        }).join('');
        if (RM) return;
        // silk thread draw
        var sp = U.qs('#silk-path');
        if (sp) {
            var L = sp.getTotalLength();
            sp.style.strokeDasharray = L; sp.style.strokeDashoffset = L;
            gsap.to(sp, {
                strokeDashoffset: 0, ease: 'none',
                scrollTrigger: { trigger: '#traditions', start: 'top 80%', end: 'bottom 60%', scrub: 1 }
            });
        }
        // 3D tilt on cards
        if (window.matchMedia('(pointer:fine)').matches) {
            U.qsa('.trad-card').forEach(function (el) {
                el.addEventListener('mousemove', function (e) {
                    var r = el.getBoundingClientRect();
                    gsap.to(el, { rotateY: ((e.clientX - r.left) / r.width - .5) * 10, rotateX: -((e.clientY - r.top) / r.height - .5) * 10, y: -6, transformPerspective: 800, duration: .4 });
                });
                el.addEventListener('mouseleave', function () { gsap.to(el, { rotateX: 0, rotateY: 0, y: 0, duration: .7, ease: 'power3.out' }); });
            });
        }
    }

    /* ---------- news preview (bento) ---------- */
    function initNewsPreview(news) {
        var grid = U.qs('#home-news-grid');
        var latest = news.slice(0, 4);
        grid.innerHTML = latest.map(function (n, i) {
            var big = i === 0;
            return '<a href="news-detail.html?slug=' + n.slug + '" class="news-card group ' + (big ? 'md:col-span-2 md:row-span-2' : '') + ' relative rounded-[26px] overflow-hidden bg-mulberry-900 shadow-xl" data-cursor="view" data-reveal="' + (i * .07) + '">' +
                '<img src="' + n.cover_image + '" alt="' + U.escapeHtml(n.title) + '" loading="lazy" class="w-full h-full ' + (big ? 'min-h-[340px]' : 'h-52 md:h-full min-h-[200px]') + ' object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700">' +
                '<div class="absolute inset-0 bg-gradient-to-t from-mulberry-900/90 via-mulberry-900/20 to-transparent"></div>' +
                '<div class="absolute inset-x-0 bottom-0 p-5 md:p-6 text-cream-50">' +
                '<div class="flex items-center gap-2 mb-2"><span class="text-[11px] bg-gold-500 text-mulberry-900 font-bold px-2.5 py-0.5 rounded-full">' + n.category + '</span>' +
                '<span class="text-[11px] text-cream-100/70">' + U.faDate(n.published_at) + '</span></div>' +
                '<h3 class="font-display ' + (big ? 'text-2xl md:text-3xl' : 'text-xl') + ' leading-snug">' + n.title + '</h3>' +
                (big ? '<p class="text-sm text-cream-100/75 mt-2 leading-7 hidden md:block">' + n.summary + '</p>' : '') +
                '<span class="leaf-read inline-flex items-center gap-1.5 mt-3 text-xs text-gold-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7 2 3 6.5 3 12c0 5 4 9.5 9 10 5-.5 9-5 9-10 0-5.5-4-10-9-10z"/></svg>ادامه خبر</span></div></a>';
        }).join('');
    }

    /* ---------- elders preview slider ---------- */
    var WREATH = '';
    function buildWreath() {
        var leaves = '';
        for (var i = 0; i < 10; i++) leaves += '<path d="M50 6 q6 -4 5 -10 q-6 4 -5 10z" fill="#3E8E41" transform="rotate(' + (i * 36) + ' 50 50)"/>';
        WREATH = '<svg viewBox="0 0 100 100" fill="none">' + leaves + '<circle cx="50" cy="50" r="47" stroke="#D4A24C" stroke-width="1" stroke-dasharray="4 5"/></svg>';
    }
    function initEldersPreview(elders) {
        buildWreath();
        var slider = U.qs('#elders-slider');
        slider.innerHTML = elders.slice(0, 6).map(function (e) {
            return '<a href="elder.html?slug=' + e.slug + '" class="group shrink-0 w-[210px] md:w-[240px] snap-center text-center" data-cursor="view">' +
                '<div class="relative arch w-[170px] h-[220px] mx-auto overflow-hidden border-[3px] border-leaf-700 shadow-lg group-hover:border-gold-500 transition-colors duration-500">' +
                '<img src="' + e.photo + '" alt="' + U.escapeHtml(e.first_name + ' ' + e.last_name) + '" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">' +
                '<div class="wreath">' + WREATH + '</div></div>' +
                '<h3 class="font-display text-xl mt-4 text-bark-900 group-hover:text-mulberry-700 transition-colors">' + e.first_name + ' ' + e.last_name + '</h3>' +
                '<p class="text-xs text-bark-700/70 mt-1">' + e.title + '</p></a>';
        }).join('');
        // arrows (RTL: "بعدی" moves to the left = negative scrollLeft)
        U.qs('#slider-next').addEventListener('click', function () { slider.scrollBy({ left: -280, behavior: 'smooth' }); });
        U.qs('#slider-prev').addEventListener('click', function () { slider.scrollBy({ left: 280, behavior: 'smooth' }); });
        // pointer drag
        var down = false, sx = 0, sl = 0;
        slider.addEventListener('pointerdown', function (e) { down = true; sx = e.clientX; sl = slider.scrollLeft; slider.classList.add('dragging'); });
        window.addEventListener('pointermove', function (e) { if (down) slider.scrollLeft = sl + (e.clientX - sx); });
        window.addEventListener('pointerup', function () { down = false; slider.classList.remove('dragging'); });
        slider.addEventListener('click', function (e) { if (slider.classList.contains('dragging')) e.preventDefault(); }, true);
    }

    /* ---------- contact ---------- */
    function initContact(c) {
        U.qs('#contact-info').innerHTML =
            '<div class="flex items-start gap-3 bg-cream-100 border border-sand-300 rounded-2xl p-4"><svg class="text-mulberry-500 shrink-0 mt-1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-6.1-7-11a7 7 0 1114 0c0 4.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg><div><b class="text-sm">نشانی</b><p class="text-sm text-bark-700/80 leading-7">' + c.address + '</p></div></div>' +
            '<div class="flex items-start gap-3 bg-cream-100 border border-sand-300 rounded-2xl p-4"><svg class="text-mulberry-500 shrink-0 mt-1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg><div><b class="text-sm">تلفن</b><p class="text-sm text-bark-700/80" dir="ltr" style="text-align:right">' + c.phone + '</p></div></div>' +
            '<div class="flex items-start gap-3 bg-cream-100 border border-sand-300 rounded-2xl p-4"><svg class="text-mulberry-500 shrink-0 mt-1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg><div><b class="text-sm">ساعت پاسخگویی</b><p class="text-sm text-bark-700/80">' + c.hours + '</p></div></div>';
        // form validation (front-end only)
        var form = U.qs('#contact-form');
        function setErr(id, msg) {
            var p = U.qs('.field-error[data-for="' + id + '"]', form);
            var input = document.getElementById(id);
            p.textContent = msg || ''; p.classList.toggle('show', !!msg);
            input.classList.toggle('border-[#A3233B]', !!msg);
            return !msg;
        }
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            /* ============================================================
               FRONT-END ONLY FORM — hook your real submit handler here:
               replace the success-animation block below with e.g.
               fetch('/api/contact', {method:'POST', body: new FormData(form)})
               ============================================================ */
            var name = document.getElementById('f-name').value.trim();
            var phone = U.toEnDigits(document.getElementById('f-phone').value).replace(/[\s-]/g, '');
            var msg = document.getElementById('f-msg').value.trim();
            var ok = true;
            ok = setErr('f-name', name.length >= 3 ? '' : 'نام باید حداقل ۳ نویسه باشد') && ok;
            ok = setErr('f-phone', /^(\+98|0098|0)?9\d{9}$/.test(phone) ? '' : 'شماره موبایل معتبر وارد کنید (مانند ۰۹۱۵…‌)') && ok;
            ok = setErr('f-msg', msg.length >= 10 ? '' : 'پیام باید حداقل ۱۰ نویسه باشد') && ok;
            if (!ok) return;
            // berries-fly success animation
            var btn = form.querySelector('button[type="submit"]'), r = btn.getBoundingClientRect();
            for (var i = 0; i < 16; i++) {
                var p = document.createElement('span');
                var isLeaf = i % 4 === 0;
                p.style.cssText = 'position:fixed;z-index:60;left:' + (r.left + r.width / 2) + 'px;top:' + (r.top + r.height / 2) + 'px;width:' + (isLeaf ? 12 : 7) + 'px;height:' + (isLeaf ? 12 : 7) + 'px;' + (isLeaf ? '' : 'border-radius:50%;background:' + (i % 2 ? '#8E2C63' : '#5A1A3F') + ';');
                if (isLeaf) p.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="#3E8E41"><path d="M12 2C7 2 3 6.5 3 12c0 5 4 9.5 9 10 5-.5 9-5 9-10 0-5.5-4-10-9-10z"/></svg>';
                document.body.appendChild(p);
                var ang = Math.random() * Math.PI * 2, d = 70 + Math.random() * 90;
                anime({
                    targets: p, translateX: Math.cos(ang) * d, translateY: [0, Math.sin(ang) * d - 40, Math.sin(ang) * d + 30],
                    scale: [1, 0], opacity: [1, 1, 0], duration: 1200, easing: 'easeOutCubic', complete: function () { p.remove(); }
                });
            }
            var box = U.qs('#form-success', form);
            box.innerHTML = '<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#3E8E41" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg>' +
                '<h3 class="font-display text-2xl text-bark-900">پیام شما رسید</h3><p class="text-sm text-bark-700/80 leading-7">سپاس از نوشتن‌تان؛ اهالی درخت توت به‌زودی پاسخ می‌دهند.</p>';
            box.classList.remove('hidden'); box.classList.add('flex');
            gsap.from(box.children, { y: 20, autoAlpha: 0, stagger: .15, duration: .6, ease: 'power3.out' });
            form.reset();
            setTimeout(function () { box.classList.add('hidden'); box.classList.remove('flex'); }, 6000);
        });
    }

    /* ---------- boot ---------- */
    async function init() {
        var v = await D.service.getVillageInfo();
        initAbout(v); initGallery(v.gallery); buildTimeline(v.timeline, window.innerWidth >= 768);
        initTraditions(v.traditions);
        var news = await D.service.getNews();
        initNewsPreview(news);
        var elders = await D.service.getElders();
        initEldersPreview(elders);
        initContact(v.contact);
        // rebuild the timeline trunk responsively
        window.addEventListener('resize', U.debounce(function () {
            buildTimeline(v.timeline, window.innerWidth >= 768);
            ScrollTrigger.refresh();
        }, 400));
        if (!RM) U.qsa('[data-navsec]').length || ['#about', '#history', '#contact'].forEach(function (id) {
            var s = document.querySelector(id); if (s) s.dataset.navsec = id.slice(1);
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();