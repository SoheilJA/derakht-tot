/* ============================================================
   js/news.js — news list: chips filter + pagination (6/page)
   ============================================================ */
(function () {
    'use strict';
    var U = window.VUtils, D = window.VillageData;
    var PER_PAGE = 6, state = { cat: 'همه', page: 1, items: [] };

    function cardHtml(n) {
        return '<a href="news-detail.html?slug=' + n.slug + '" class="news-card group flex flex-col bg-cream-50 border border-sand-300 rounded-[24px] overflow-hidden hover:shadow-[0_24px_50px_-25px_rgba(74,51,33,.45)] transition-shadow duration-500" data-cursor="view" href="#">' +
            '<div class="relative h-48 overflow-hidden"><img src="' + n.cover_image + '" alt="' + U.escapeHtml(n.title) + '" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">' +
            '<span class="absolute top-3 right-3 text-[11px] bg-gold-500 text-mulberry-900 font-bold px-2.5 py-0.5 rounded-full">' + n.category + '</span></div>' +
            '<div class="p-5 flex flex-col flex-1">' +
            '<div class="flex items-center gap-2 text-[11px] text-bark-500 mb-2"><span>' + U.faDate(n.published_at) + '</span><span>·</span><span>' + U.toFa(n.reading_time_min) + ' دقیقه مطالعه</span></div>' +
            '<h2 class="font-display text-xl leading-snug group-hover:text-mulberry-700 transition-colors">' + n.title + '</h2>' +
            '<p class="text-sm text-bark-700/75 leading-7 mt-2 flex-1">' + n.summary + '</p>' +
            '<span class="mt-4 text-xs text-mulberry-500 font-bold inline-flex items-center gap-1">ادامه خبر <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg></span></div></a>';
    }

    function render() {
        var grid = document.getElementById('news-grid');
        var list = state.items.filter(function (n) { return state.cat === 'همه' || n.category === state.cat; });
        var pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
        state.page = U.clamp(state.page, 1, pages);
        var slice = list.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);
        grid.innerHTML = slice.map(cardHtml).join('') ||
            '<p class="col-span-full text-center text-bark-700/60 py-14">خبری در این دسته یافت نشد.</p>';
        if (!U.reduced()) gsap.fromTo('#news-grid .news-card', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: .07, duration: .6, ease: 'power3.out' });
        // pagination
        var nav = document.getElementById('news-pagination');
        var html = '<button class="pg-btn" data-pg="' + (state.page - 1) + '" ' + (state.page === 1 ? 'disabled' : '') + ' aria-label="صفحه قبل">قبلی</button>';
        for (var i = 1; i <= pages; i++) html += '<button class="pg-btn ' + (i === state.page ? 'active' : '') + '" data-pg="' + i + '">' + U.toFa(i) + '</button>';
        html += '<button class="pg-btn" data-pg="' + (state.page + 1) + '" ' + (state.page === pages ? 'disabled' : '') + ' aria-label="صفحه بعد">بعدی</button>';
        nav.innerHTML = html;
        nav.querySelectorAll('[data-pg]').forEach(function (b) {
            b.addEventListener('click', function () { state.page = +b.dataset.pg; render(); window.scrollTo({ top: grid.offsetTop - 120, behavior: 'smooth' }); });
        });
        VSite.reveals(grid);
    }

    async function init() {
        state.items = await D.service.getNews();
        var cats = ['همه'].concat(Array.from(new Set(state.items.map(function (n) { return n.category; }))));
        document.getElementById('news-chips').innerHTML = cats.map(function (c, i) {
            return '<button class="chip ' + (i === 0 ? 'active' : '') + '" role="tab" aria-selected="' + (i === 0) + '" data-cat="' + c + '">' + c + '<span class="chip-underline"></span></button>';
        }).join('');
        document.querySelectorAll('[data-cat]').forEach(function (b) {
            b.addEventListener('click', function () {
                document.querySelectorAll('[data-cat]').forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
                b.classList.add('active'); b.setAttribute('aria-selected', 'true');
                // animated filter switch
                var grid = document.getElementById('news-grid');
                var done = function () { state.cat = b.dataset.cat; state.page = 1; render(); };
                if (U.reduced()) done();
                else gsap.to(grid.children, { y: -14, autoAlpha: 0, stagger: .03, duration: .25, onComplete: done });
            });
        });
        render();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();