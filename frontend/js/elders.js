/* ============================================================
   js/elders.js — elders grid: live search + category filter
   ============================================================ */
(function () {
  'use strict';
  var U = window.VUtils, D = window.VillageData;
  var state = { q: '', cat: 'همه', items: [] };
  var WREATH = '';
  (function buildWreath() {
    var leaves = '';
    for (var i = 0; i < 12; i++) leaves += '<path d="M50 5 q6 -4 5 -10 q-6 4 -5 10z" fill="' + (i % 2 ? '#3E8E41' : '#8BC17A') + '" transform="rotate(' + (i * 30) + ' 50 50)"/>';
    WREATH = '<svg viewBox="0 0 100 100" fill="none">' + leaves + '</svg>';
  })();

  function cardHtml(e) {
    var years = e.death_year ? U.toFa(e.birth_year) + '–' + U.toFa(e.death_year) : 'در قید حیات (' + U.toFa(e.birth_year) + ')';
    return '<a href="elder.html?slug=' + e.slug + '" class="elder-card group block bg-cream-50 border border-sand-300 rounded-[26px] p-5 text-center transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_28px_60px_-30px_rgba(74,51,33,.5)]" data-cursor="view">' +
      '<div class="relative arch w-40 h-52 mx-auto overflow-hidden border-[3px] border-leaf-700 group-hover:border-gold-500 transition-colors duration-500">' +
      '<img src="' + e.photo + '" alt="' + U.escapeHtml(e.first_name + ' ' + e.last_name) + '" loading="lazy" class="w-full h-full object-cover">' +
      '<div class="wreath">' + WREATH + '</div></div>' +
      '<h2 class="font-display text-2xl mt-4 group-hover:text-mulberry-700 transition-colors">' + e.first_name + ' ' + e.last_name + '</h2>' +
      '<p class="text-xs text-bark-700/70 mt-1">' + e.title + '</p>' +
      '<p class="text-[11px] text-bark-500 mt-2">' + years + '</p></a>';
  }

  function render(animated) {
    var grid = document.getElementById('elders-grid');
    var q = state.q.replace(/[يى]/g, function (c) { return c === 'ي' ? 'ی' : 'ی'; });
    var list = state.items.filter(function (e) {
      var name = (e.first_name + ' ' + e.last_name);
      return (state.cat === 'همه' || e.category === state.cat) && (!q || name.indexOf(q) > -1);
    });
    grid.innerHTML = list.map(cardHtml).join('');
    document.getElementById('elders-empty').classList.toggle('hidden', list.length > 0);
    if (animated && !U.reduced()) gsap.fromTo('#elders-grid .elder-card', { y: 26, autoAlpha: 0, scale: .96 },
      { y: 0, autoAlpha: 1, scale: 1, stagger: .05, duration: .5, ease: 'power3.out' });
  }

  async function init() {
    state.items = await D.service.getElders();
    var cats = ['همه'].concat(Array.from(new Set(state.items.map(function (e) { return e.category; }))));
    document.getElementById('elder-chips').innerHTML = cats.map(function (c, i) {
      return '<button class="chip ' + (i === 0 ? 'active' : '') + '" role="tab" aria-selected="' + (i === 0) + '" data-cat="' + c + '">' + c + '<span class="chip-underline"></span></button>';
    }).join('');
    document.querySelectorAll('[data-cat]').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('[data-cat]').forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
        b.classList.add('active'); b.setAttribute('aria-selected', 'true');
        state.cat = b.dataset.cat; render(true);
      });
    });
    var search = document.getElementById('elder-search');
    search.addEventListener('input', U.debounce(function () { state.q = search.value.trim(); render(true); }, 180));
    render(false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();