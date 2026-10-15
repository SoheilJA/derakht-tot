/* ============================================================
   js/layout.js — shared chrome (navbar / footer / preloader)
   Injected into #site-header / #site-footer on every page,
   since there is no server-side templating.
   ============================================================ */
window.VillageLayout = (function () {
    'use strict';

    var LEAF = '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7 2 3 6.5 3 12c0 5 4 9.5 9 10 5-.5 9-5 9-10 0-5.5-4-10-9-10zm0 3.2c1.2 3.4 1.2 6.2 0 8.6-1.2-2.4-1.2-5.2 0-8.6z"/></svg>';
    var LOGO = '<svg width="34" height="34" viewBox="0 0 48 48" fill="none" aria-hidden="true">' +
        '<path d="M24 4C15 4 9 10.5 9 18.5 9 24 12.5 27.5 16 29l1.5 13h13L32 29c3.5-1.5 7-5 7-10.5C39 10.5 33 4 24 4z" fill="#3E8E41"/>' +
        '<path d="M24 7c-1.5 4-1.5 7.5 0 11 1.5-3.5 1.5-7 0-11z" fill="#8BC17A"/>' +
        '<rect x="21.5" y="26" width="5" height="16" rx="2" fill="#4B3321"/>' +
        '<circle cx="16" cy="20" r="2.2" fill="#8E2C63"/><circle cx="24" cy="15" r="2.2" fill="#5A1A3F"/><circle cx="31" cy="21" r="2.2" fill="#8E2C63"/></svg>';

    var NAV = [
        { id: 'home', href: 'index.html', label: 'خانه' },
        { id: 'about', href: 'index.html#about', label: 'درباره روستا' },
        { id: 'history', href: 'index.html#history', label: 'تاریخچه' },
        { id: 'news', href: 'news.html', label: 'اخبار' },
        { id: 'elders', href: 'elders.html', label: 'بزرگان' },
        { id: 'family', href: 'family-tree.html', label: 'شجره‌نامه' },
        { id: 'contact', href: 'index.html#contact', label: 'تماس' }
    ];

    /* --- navbar markup (transparent over hero, becomes glassy on scroll via main.js) --- */
    function navbarHtml() {
        var links = NAV.map(function (l) {
            return '<a data-navlink="' + l.id + '" href="' + l.href + '" class="relative py-2 px-1 text-sm text-cream-50/85 hover:text-cream-50 transition-colors">' + l.label +
                '<span class="nav-leaf absolute -bottom-1 right-1/2 translate-x-1/2 text-gold-500 opacity-0 scale-0 transition-all duration-300">' + LEAF + '</span></a>';
        }).join('');
        var mobileLinks = NAV.map(function (l, i) {
            return '<a href="' + l.href + '" class="mm-link block font-display text-3xl text-cream-50 hover:text-gold-500 transition-colors" style="opacity:0">' + l.label + '</a>';
        }).join('');
        return '' +
            '<nav id="site-nav" class="fixed top-0 inset-x-0 z-50 transition-all duration-500" aria-label="ناوبری اصلی">' +
            '<div class="nav-inner container mx-auto px-5 md:px-8 flex items-center justify-between py-4 transition-all duration-500">' +
            '<a href="index.html" class="flex items-center gap-2.5 group" aria-label="درخت توت — صفحه اصلی">' + LOGO +
            '<span class="font-display text-2xl text-cream-50 group-hover:text-gold-500 transition-colors">درخت توت</span></a>' +
            '<div class="hidden lg:flex items-center gap-6">' + links + '</div>' +
            '<button id="menu-btn" class="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-cream-50/25" aria-label="باز کردن منو" aria-expanded="false">' +
            '<span class="menu-line block w-5 h-0.5 bg-cream-50 transition-all"></span>' +
            '<span class="menu-line block w-5 h-0.5 bg-cream-50 transition-all"></span>' +
            '<span class="menu-line block w-3.5 h-0.5 bg-cream-50 transition-all self-center mr-3"></span>' +
            '</button>' +
            '</div>' +
            '</nav>' +
            '<div id="mobile-menu" class="fixed inset-0 z-[90] bg-mulberry-900 hidden" role="dialog" aria-modal="true" aria-label="منوی موبایل">' +
            '<svg class="absolute left-[-10%] bottom-0 h-[80%] opacity-[.13]" viewBox="0 0 300 600" fill="none" aria-hidden="true">' +
            '<path class="mm-branch" d="M150,600 C150,470 120,420 90,370 C60,320 70,250 100,200 C130,150 120,90 150,20" stroke="#8BC17A" stroke-width="7" stroke-linecap="round"/>' +
            '<path class="mm-branch" d="M150,600 C160,480 190,430 230,380 C260,340 250,270 220,220" stroke="#8E2C63" stroke-width="5" stroke-linecap="round"/>' +
            '</svg>' +
            '<div class="relative h-full flex flex-col items-center justify-center gap-7 px-8">' + mobileLinks +
            '<p class="text-cream-100/40 text-xs mt-4">روستای درخت توت — خراسان</p>' +
            '</div>' +
            '</div>';
    }

    /* --- footer markup with growing roots --- */
    function footerHtml() {
        var quick = NAV.slice(0, 5).map(function (l) {
            return '<li><a href="' + l.href + '" class="hover:text-gold-500 transition-colors inline-flex items-center gap-2"><span class="text-mulberry-300 text-xs">●</span>' + l.label + '</a></li>';
        }).join('');
        return '' +
            '<footer class="relative bg-leaf-900 text-cream-100 overflow-hidden">' +
            '<div class="kilim-band"></div>' +
            '<svg class="block w-full h-24 text-bark-700" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">' +
            '<rect width="1200" height="14" fill="currentColor"/>' +
            '<g stroke="#4B3321" stroke-width="6" stroke-linecap="round" fill="none">' +
            '<path class="ft-root" d="M300,14 C290,45 265,60 240,78 M300,14 C310,50 330,62 352,80 M300,14 C296,40 300,70 296,95"/>' +
            '<path class="ft-root" d="M600,14 C590,42 570,58 548,74 M600,14 C612,48 634,60 655,79 M600,14 C600,44 606,66 600,92"/>' +
            '<path class="ft-root" d="M900,14 C890,44 868,58 845,76 M900,14 C910,48 932,60 952,78"/>' +
            '</g>' +
            '</svg>' +
            '<div class="container mx-auto px-5 md:px-8 pb-10 grid md:grid-cols-4 gap-10">' +
            '<div class="md:col-span-2">' +
            '<div class="flex items-center gap-2.5 mb-4">' + LOGO + '<span class="font-display text-2xl">درخت توت</span></div>' +
            '<p class="text-cream-100/60 text-sm leading-8 max-w-md">روستایی کوچک با مردمانی بزرگ؛ این وب‌گاه با همت اهالی ساخته شده تا خاطره، تاریخ و آدم‌های این خاک را برای نسل‌های بعد نگه دارد.</p>' +
            '<div class="flex gap-3 mt-6">' +
            socialBtn('تلگرام', 'M22 3L2 11l6 2 2 7 4-5 5 4z') +
            socialBtn('اینستاگرام', 'M4 4h16v16H4zM12 8a4 4 0 100 8 4 4 0 000-8z') +
            socialBtn('واتساپ', 'M5 13a7 7 0 0114 0c0 3.9-3.1 7-7 7H5l2-3a7 7 0 01-2-4z') +
            socialBtn('ایمیل', 'M3 6h18v12H3zM3 6l9 7 9-7') +
            '</div>' +
            '</div>' +
            '<div><h3 class="font-display text-lg text-gold-500 mb-4">دسترسی سریع</h3><ul class="space-y-3 text-sm">' + quick + '</ul></div>' +
            '<div><h3 class="font-display text-lg text-gold-500 mb-4">تماس</h3>' +
            '<ul class="space-y-3 text-sm text-cream-100/70 leading-7">' +
            '<li>خراسان رضوی، روستای درخت توت، ساختمان شورا</li>' +
            '<li dir="ltr" class="text-right">۰۵۱ - ۵۲۲۴XXXX</li>' +
            '<li>salahiat@derakhtetoot.ir</li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '<div class="border-t border-cream-100/10"><div class="container mx-auto px-5 md:px-8 py-5 flex items-center justify-center gap-1.5 text-cream-100/50 text-xs">' +
            '<span>ساخته شده با</span>' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="#8E2C63"><path d="M12 21S4 14.8 4 9.5A4.5 4.5 0 0112 6a4.5 4.5 0 018 3.5C20 14.8 12 21 12 21z"/></svg>' +
            '<span>برای اهالی درخت توت</span>' +
            '</div></div>' +
            '</footer>';
    }
    function socialBtn(label, path) {
        return '<a href="#" aria-label="' + label + '" class="w-10 h-10 rounded-full border border-cream-100/20 flex items-center justify-center hover:bg-mulberry-500 hover:border-mulberry-500 transition-all"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="' + path + '"/></svg></a>';
    }

    /* --- preloader markup (branch draws, berries ripen, counter, split reveal) --- */
    function preloaderHtml() {
        return '' +
            '<div id="preloader" class="fixed inset-0 z-[100]" role="status" aria-label="در حال بارگذاری سایت">' +
            '<div class="pre-panel absolute inset-x-0 top-0 h-1/2 bg-mulberry-900"></div>' +
            '<div class="pre-panel absolute inset-x-0 bottom-0 h-1/2 bg-mulberry-900"></div>' +
            '<div id="pre-content" class="absolute inset-0 flex flex-col items-center justify-center gap-5">' +
            '<svg width="230" height="160" viewBox="0 0 230 160" fill="none" aria-hidden="true">' +
            '<path class="pl-branch" d="M115,150 C115,110 100,96 74,84 C52,73 42,58 40,34" stroke="#7A5636" stroke-width="6" stroke-linecap="round"/>' +
            '<path class="pl-branch" d="M115,150 C117,114 130,100 156,90 C178,82 188,66 190,44" stroke="#7A5636" stroke-width="4.5" stroke-linecap="round"/>' +
            '<path class="pl-leaf" d="M74,84 q-20,-5 -26,-26 q20,5 26,26" fill="#3E8E41"/>' +
            '<path class="pl-leaf" d="M100,110 q-22,4 -32,-14 q22,-4 32,14" fill="#1F4D2B"/>' +
            '<path class="pl-leaf" d="M156,90 q20,-8 28,-28 q-22,8 -28,28" fill="#8BC17A"/>' +
            '<path class="pl-leaf" d="M132,122 q22,0 30,-20 q-22,0 -30,20" fill="#3E8E41"/>' +
            '<path class="pl-leaf" d="M115,150 q-3,-24 14,-34 q3,24 -14,34" fill="#1F4D2B"/>' +
            '<circle class="pl-berry" cx="40" cy="34" r="7" fill="#3E8E41"/>' +
            '<circle class="pl-berry" cx="56" cy="22" r="7" fill="#3E8E41"/>' +
            '<circle class="pl-berry" cx="190" cy="44" r="7" fill="#3E8E41"/>' +
            '</svg>' +
            '<div class="text-cream-100 text-xl font-medium"><span id="pl-num">۰</span><span>٪</span></div>' +
            '<div class="text-cream-100/45 text-xs tracking-widest">در حال روییدن درخت…</div>' +
            '</div>' +
            '</div>';
    }

    /** Mount shared chrome. opts: {navbar=true, footer=true, preloader=true} */
    function mount(opts) {
        opts = opts || {};
        document.body.insertAdjacentHTML('afterbegin', '<a href="#main" class="skip-link">رفتن به محتوای اصلی</a>');
        var hd = document.getElementById('site-header'), ft = document.getElementById('site-footer');
        if (opts.preloader !== false && !document.getElementById('preloader')) document.body.insertAdjacentHTML('beforeend', preloaderHtml());
        if (opts.navbar !== false && hd) hd.innerHTML = navbarHtml();
        if (opts.footer !== false && ft) ft.innerHTML = footerHtml();
    }

    return { mount: mount, NAV: NAV, LEAF: LEAF, LOGO: LOGO };
})();