/* ============================================================
   js/elder-detail.js — full elder profile; reads ?slug=...
   Sticky scroll-spy nav, quote carousel, gallery lightbox,
   relatives row, related elders. "Not found" for bad slugs.
   ============================================================ */
(function () {
  'use strict';
  var U = window.VUtils, D = window.VillageData;

  function notFound() {
    document.getElementById('elder-body').innerHTML =
      '<section class="min-h-[60vh] flex flex-col items-center justify-center gap-5 text-center px-6 pt-32 pb-20">' +
      '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#8E2C63" stroke-width="1.4"><path d="M12 3C7 3 3 7.5 3 13c0 5 4 9.5 9 10 5-.5 9-5 9-10 0-5.5-4-10-9-10z"/><path d="M9 9l6 6M15 9l-6 6"/></svg>' +
      '<h1 class="font-display text-4xl">این شاخه در درخت نیست</h1>' +
      '<p class="text-bark-700/80 leading-8">بزرگی با این نشانی پیدا نشد.</p>' +
      '<a href="elders.html" class="btn-primary">همه بزرگان</a></section>';
  }

  async function init() {
    var slug = U.getQuery('slug');
    if (!slug) return notFound();
    var e = await D.service.getElderBySlug(slug);
    if (!e) return notFound();
    document.title = e.first_name + ' ' + e.last_name + ' | درخت توت';
    var full = e.first_name + ' ' + e.last_name;
    var years = e.death_year ? U.toFa(e.birth_year) + ' – ' + U.toFa(e.death_year) : 'در قید حیات، زاده‌ی ' + U.toFa(e.birth_year);
    // lifespan bar geometry (on a 1900–2030 axis)
    var span = 2030 - 1900;
    var x0 = (e.birth_year - 1900) / span * 100, x1 = ((e.death_year || new Date().getFullYear()) - 1900) / span * 100;

    document.getElementById('elder-body').innerHTML =
    '<article>' +
    /* ---- hero ---- */
    '<header class="relative bg-mulberry-900 pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">' +
      '<div class="absolute inset-0 kilim-bg opacity-20" aria-hidden="true"></div>' +
      '<div class="relative container mx-auto px-5 md:px-8 grid md:grid-cols-12 gap-10 items-center">' +
        '<div class="md:col-span-4 order-1">' +
          '<div id="elder-photo-wrap" class="arch w-56 md:w-full max-w-[290px] mx-auto aspect-[3/4] overflow-hidden border-[4px] border-gold-500/70 shadow-[0_30px_70px_-25px_rgba(0,0,0,.6)]">' +
          '<img id="elder-photo" src="' + e.photo + '" alt="' + U.escapeHtml(full) + '" class="w-full h-full object-cover"></div></div>' +
        '<div class="md:col-span-8 text-center md:text-right">' +
          '<span class="text-xs bg-gold-500 text-mulberry-900 font-bold px-3 py-1 rounded-full">' + e.category + '</span>' +
          '<h1 class="font-display text-4xl md:text-6xl text-cream-50 mt-4 leading-tight">' + full + '</h1>' +
          '<p class="text-gold-500 text-lg mt-2">' + e.title + '</p>' +
          '<div class="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start mt-5 text-cream-100/75 text-sm">' +
            '<span>' + years + '</span><span>·</span><span>زاده‌ی ' + e.birthplace + '</span><span>·</span><span>' + e.profession + '</span></div>' +
          '<div class="mt-8 max-w-xl mx-auto md:mx-0">' +
            '<div class="flex justify-between text-[11px] text-cream-100/50 mb-2"><span>' + U.toFa(1900) + '</span><span>خط زندگی</span><span>' + U.toFa(2030) + '</span></div>' +
            '<div class="lifebar relative"><div id="lifebar-fill" style="margin-right:' + x0 + '%;width:' + (x1 - x0) + '%"></div>' +
            '<span class="absolute -top-1.5 w-3.5 h-3.5 rounded-full bg-gold-500 border-2 border-mulberry-900" style="right:' + x0 + '%"></span>' +
            '<span class="absolute -top-1.5 w-3.5 h-3.5 rounded-full bg-mulberry-300 border-2 border-mulberry-900" style="right:' + x1 + '%"></span></div></div>' +
        '</div></div></header>' +
    /* ---- body grid with sticky scrollspy ---- */
    '<div class="container mx-auto px-5 md:px-8 py-12 md:py-16 grid lg:grid-cols-4 gap-10">' +
      '<nav class="hidden lg:block" aria-label="بخش‌های صفحه"><div class="sticky top-28 space-y-1">' +
        ['بیوگرافی', 'خدمات', 'جملات', 'گالری', 'خویشاوندان'].map(function (s, i) {
          var ids = ['bio', 'ach', 'quotes', 'gallery', 'relatives'];
          return '<a href="#' + ids[i] + '" data-spy="' + ids[i] + '" class="spy-link block px-4 py-2.5 rounded-xl text-sm text-bark-700/70 hover:text-mulberry-700 hover:bg-cream-100 transition-colors">' + s + '</a>';
        }).join('') + '</div></nav>' +
      '<div class="lg:col-span-3 space-y-16">' +
        '<section id="bio"><h2 class="sec-h">بیوگرافی کامل</h2><div class="prose-village">' + e.bio_html + '</div></section>' +
        '<section id="ach"><h2 class="sec-h">خدمات و دستاوردها</h2><div class="grid md:grid-cols-2 gap-5">' +
          e.achievements.map(function (a) {
            return '<div class="ach-card bg-cream-100 border border-sand-300 rounded-[22px] p-6"><div class="w-10 h-10 rounded-full bg-leaf-900 text-leaf-300 flex items-center justify-center mb-3"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg></div>' +
            '<h3 class="font-display text-xl text-mulberry-900 mb-2">' + a.title + '</h3><p class="text-sm leading-8 text-bark-700/85">' + a.description + '</p></div>';
          }).join('') + '</div></section>' +
        '<section id="quotes"><h2 class="sec-h">خاطرات و جملات ماندگار</h2>' +
          '<div id="quote-carousel" class="relative min-h-[190px]">' +
            '<div class="quote-card"><p id="quote-text" class="text-lg leading-10 text-bark-900"></p></div>' +
            '<div class="flex items-center justify-between mt-5"><span id="quote-count" class="text-xs text-bark-500"></span>' +
            '<div class="flex gap-2"><button id="q-prev" class="slider-arrow !w-10 !h-10" aria-label="جمله قبلی"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></button>' +
            '<button id="q-next" class="slider-arrow !w-10 !h-10" aria-label="جمله بعدی"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg></button></div></div></div></section>' +
        '<section id="gallery"><h2 class="sec-h">گالری تصاویر</h2><div class="grid grid-cols-2 md:grid-cols-3 gap-4">' +
          e.gallery.map(function (g, i) {
            return '<button class="gal-thumb group relative rounded-2xl overflow-hidden aspect-[4/3]" data-gi="' + i + '" data-cursor="view" aria-label="بزرگ‌نمایی تصویر ' + U.toFa(i + 1) + '">' +
              '<img src="' + g + '" alt="تصویری از ' + U.escapeHtml(full) + '" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></button>';
          }).join('') + '</div></section>' +
        '<section id="relatives"><h2 class="sec-h">خویشاوندان</h2>' +
          (e.relatives.length ?
            '<div class="flex flex-wrap gap-3">' + e.relatives.map(function (r) {
              var isSelf = r.relation === 'خودِ صفحه';
              if (isSelf) return '';
              var link = r.person_id ? 'family-tree.html?person=' + r.person_id : null;
              return (link ? '<a href="' + link + '" class="flex items-center gap-3 bg-cream-100 border border-sand-300 rounded-full py-2 pl-5 pr-2 hover:border-mulberry-300 transition-colors" data-cursor="view">' :
                             '<div class="flex items-center gap-3 bg-cream-100 border border-sand-300 rounded-full py-2 pl-5 pr-2">') +
                '<span class="w-10 h-10 rounded-full bg-leaf-900 text-leaf-300 text-sm font-bold flex items-center justify-center">' + r.name.charAt(0) + '</span>' +
                '<span><b class="block text-sm">' + r.name + '</b><span class="text-[11px] text-bark-500">' + r.relation + '</span></span>' +
                (link ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8E2C63" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>' : '') +
                (link ? '</a>' : '</div>');
            }).join('') + '</div>' : '<p class="text-bark-700/70 leading-8">اطلاعات خویشاوندان این بزرگ در شجره‌نامه ثبت نشده است.</p>') + '</section>' +
        '<section><h2 class="sec-h">بزرگان دیگر</h2><div id="related-elders" class="grid grid-cols-2 md:grid-cols-4 gap-5"></div></section>' +
      '</div></div></article>';

    /* ---- animations ---- */
    if (!U.reduced()) {
      gsap.from('#elder-photo-wrap', { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'power4.out', delay: .1 });
      gsap.from('header h1, header .text-gold-500, header .flex', { y: 34, autoAlpha: 0, stagger: .12, duration: .8, ease: 'power3.out', delay: .3 });
      gsap.to('#lifebar-fill > div', { scaleX: 1, duration: 1.6, ease: 'power3.out', delay: .8,
        scrollTrigger: { trigger: '.lifebar', start: 'top 90%', once: true } });
      gsap.utils.toArray('#elder-body .ach-card').forEach(function (c) {
        gsap.from(c, { y: 40, autoAlpha: 0, duration: .7, ease: 'power3.out',
          scrollTrigger: { trigger: c, start: 'top 88%', once: true } });
      });
    } else { document.querySelector('#lifebar-fill > div').style.transform = 'scaleX(1)'; }
    // section headings reveal
    U.qsa('.sec-h', document.getElementById('elder-body')).forEach(function (h) {
      if (U.reduced()) return;
      gsap.from(h, { x: 30, autoAlpha: 0, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
    });

    /* ---- scroll-spy ---- */
    var spyLinks = U.qsa('.spy-link');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) spyLinks.forEach(function (l) {
          var on = l.dataset.spy === en.target.id;
          l.classList.toggle('bg-mulberry-700', on); l.classList.toggle('text-cream-50', on); l.classList.toggle('text-bark-700/70', !on);
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    ['bio', 'ach', 'quotes', 'gallery', 'relatives'].forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });

    /* ---- quote carousel ---- */
    var qi = 0, qTimer = null;
    function showQuote(i) {
      qi = (i + e.quotes.length) % e.quotes.length;
      var t = document.getElementById('quote-text');
      t.textContent = '«' + e.quotes[qi] + '»';
      document.getElementById('quote-count').textContent = 'جمله ' + U.toFa(qi + 1) + ' از ' + U.toFa(e.quotes.length);
      if (!U.reduced()) gsap.fromTo(t, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power2.out' });
    }
    showQuote(0);
    document.getElementById('q-next').addEventListener('click', function () { showQuote(qi - 1); resetAuto(); });
    document.getElementById('q-prev').addEventListener('click', function () { showQuote(qi + 1); resetAuto(); });
    function auto() { qTimer = setInterval(function () { showQuote(qi - 1); }, 6000); }
    function resetAuto() { clearInterval(qTimer); auto(); }
    if (!U.reduced()) auto();

    /* ---- gallery lightbox ---- */
    var galBtns = U.qsa('.gal-thumb');
    galBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        VSite.lightbox(e.gallery.map(function (g) { return { src: g, caption: full, alt: 'تصویری از ' + full }; }), +b.dataset.gi);
      });
    });

    /* ---- related elders ---- */
    var all = await D.service.getElders();
    var rel = all.filter(function (x) { return x.slug !== e.slug && x.category === e.category; }).slice(0, 4);
    if (rel.length < 4) rel = rel.concat(all.filter(function (x) { return x.slug !== e.slug && rel.indexOf(x) < 0; })).slice(0, 4);
    document.getElementById('related-elders').innerHTML = rel.map(function (r) {
      return '<a href="elder.html?slug=' + r.slug + '" class="group text-center" data-cursor="view">' +
        '<div class="arch w-28 h-36 mx-auto overflow-hidden border-2 border-sand-300 group-hover:border-gold-500 transition-colors">' +
        '<img src="' + r.photo + '" alt="' + U.escapeHtml(r.first_name + ' ' + r.last_name) + '" loading="lazy" class="w-full h-full object-cover"></div>' +
        '<p class="font-display text-lg mt-2 group-hover:text-mulberry-700 transition-colors">' + r.first_name + ' ' + r.last_name + '</p></a>';
    }).join('');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();