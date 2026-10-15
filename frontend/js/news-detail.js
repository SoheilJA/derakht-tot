/* ============================================================
   js/news-detail.js — single article; reads ?slug=...
   ============================================================ */
(function () {
    'use strict';
    var U = window.VUtils, D = window.VillageData;

    function notFound() {
        document.getElementById('article-body').innerHTML =
            '<section class="min-h-[60vh] flex flex-col items-center justify-center gap-5 text-center px-6 pt-32 pb-20">' +
            '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#8E2C63" stroke-width="1.4"><path d="M12 3C7 3 3 7.5 3 13c0 5 4 9.5 9 10 5-.5 9-5 9-10 0-5.5-4-10-9-10z"/><path d="M9 9l6 6M15 9l-6 6"/></svg>' +
            '<h1 class="font-display text-4xl text-bark-900">این برگ کجاست؟</h1>' +
            '<p class="text-bark-700/80 leading-8">خبری با این نشانی پیدا نشد؛ شاید باد آن را برده باشد.</p>' +
            '<a href="news.html" class="btn-primary">بازگشت به اخبار</a></section>';
    }

    async function init() {
        var slug = U.getQuery('slug');
        if (!slug) return notFound();
        var n = await D.service.getNewsBySlug(slug);
        if (!n) return notFound();
        document.title = n.title + ' | درخت توت';
        var meta = document.querySelector('meta[property="og:title"]'); if (meta) meta.setAttribute('content', n.title);
        document.getElementById('article-body').innerHTML =
            '<article>' +
            '<header class="relative h-[52vh] min-h-[380px] overflow-hidden bg-mulberry-900">' +
            '<img id="nd-cover" src="' + n.cover_image + '" alt="' + U.escapeHtml(n.title) + '" class="nd-parallax absolute inset-x-0 top-0 w-full h-[120%] object-cover opacity-75">' +
            '<div class="absolute inset-0 bg-gradient-to-t from-mulberry-900 via-mulberry-900/40 to-transparent"></div>' +
            '<div class="absolute inset-x-0 bottom-0"><div class="container mx-auto px-5 md:px-8 pb-10">' +
            '<div class="flex items-center gap-3 flex-wrap mb-4"><span class="text-xs bg-gold-500 text-mulberry-900 font-bold px-3 py-1 rounded-full">' + n.category + '</span>' +
            '<span class="text-cream-100/75 text-sm">' + U.faDate(n.published_at) + '</span><span class="text-cream-100/75 text-sm">·</span>' +
            '<span class="text-cream-100/75 text-sm">' + U.toFa(n.reading_time_min) + ' دقیقه مطالعه</span><span class="text-cream-100/75 text-sm">·</span>' +
            '<span class="text-cream-100/75 text-sm">نوشته ' + n.author + '</span></div>' +
            '<h1 class="font-display text-3xl md:text-5xl text-cream-50 leading-snug max-w-3xl">' + n.title + '</h1></div></div></header>' +
            '<div class="container mx-auto px-5 md:px-8 py-12 md:py-16 grid lg:grid-cols-3 gap-12">' +
            '<div class="lg:col-span-2 prose-village" id="nd-content">' + n.content_html +
            '<hr class="my-10 border-sand-300"><div class="flex items-center gap-3 flex-wrap">' +
            '<span class="text-sm font-bold text-bark-700">هم‌رسانی:</span>' +
            '<button id="share-copy" class="chip">رونوشت پیوند</button>' +
            '<a class="chip" target="_blank" rel="noopener" href="https://t.me/share/url?url=' + encodeURIComponent(location.href) + '&text=' + encodeURIComponent(n.title) + '">تلگرام</a>' +
            '<a class="chip" target="_blank" rel="noopener" href="https://api.whatsapp.com/send?text=' + encodeURIComponent(n.title + ' ' + location.href) + '">واتساپ</a>' +
            '<a class="chip" href="mailto:?subject=' + encodeURIComponent(n.title) + '&body=' + encodeURIComponent(location.href) + '">ایمیل</a>' +
            '</div></div>' +
            '<aside class="lg:col-span-1"><div class="lg:sticky lg:top-28 bg-cream-100 border border-sand-300 rounded-[24px] p-6">' +
            '<h3 class="font-display text-xl text-mulberry-900 mb-4">خلاصه</h3>' +
            '<p class="text-sm leading-8 text-bark-700/85">' + n.summary + '</p></div></aside>' +
            '</div>' +
            '<section id="related" class="bg-cream-100 border-t border-sand-300 py-14"><div class="container mx-auto px-5 md:px-8">' +
            '<h2 class="font-display text-3xl text-bark-900 mb-8">اخبار مرتبط</h2>' +
            '<div id="related-grid" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"></div></div></section></article>';
        // parallax cover
        if (!U.reduced()) gsap.to('#nd-cover', {
            yPercent: 16, ease: 'none',
            scrollTrigger: { trigger: '#nd-cover', start: 'top top', end: 'bottom top', scrub: true }
        });
        // reading progress
        var bar = document.getElementById('read-progress');
        window.addEventListener('scroll', function () {
            var h = document.documentElement;
            bar.style.transform = 'scaleX(' + U.clamp(h.scrollTop / (h.scrollHeight - h.clientHeight), 0, 1) + ')';
        }, { passive: true });
        // copy-link share
        document.getElementById('share-copy').addEventListener('click', function () {
            var b = this;
            (navigator.clipboard ? navigator.clipboard.writeText(location.href) : Promise.reject())
                .then(function () { b.textContent = 'رونوشت شد ✓'; })
                .catch(function () { prompt('پیوند خبر را رونوشت کنید:', location.href); })
                .finally(function () { setTimeout(function () { b.textContent = 'رونوشت پیوند'; }, 2200); });
        });
        // related news (same category)
        var all = await D.service.getNews();
        var rel = all.filter(function (x) { return x.slug !== n.slug && x.category === n.category; }).slice(0, 3);
        document.getElementById('related-grid').innerHTML = rel.map(function (r) {
            return '<a href="news-detail.html?slug=' + r.slug + '" class="group bg-cream-50 border border-sand-300 rounded-[22px] overflow-hidden" data-cursor="view">' +
                '<div class="h-36 overflow-hidden"><img src="' + r.cover_image + '" alt="' + U.escapeHtml(r.title) + '" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></div>' +
                '<div class="p-4"><span class="text-[11px] text-bark-500">' + U.faDate(r.published_at) + '</span>' +
                '<h3 class="font-display text-lg mt-1 group-hover:text-mulberry-700 transition-colors">' + r.title + '</h3></div></a>';
        }).join('') || '<p class="text-bark-700/60">خبر مرتبط دیگری نیست.</p>';
        if (!U.reduced()) gsap.from('#related-grid > *', {
            y: 30, autoAlpha: 0, stagger: .1, duration: .7,
            scrollTrigger: { trigger: '#related', start: 'top 80%' }
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();