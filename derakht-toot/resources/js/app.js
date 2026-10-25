import './bootstrap';

import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

import {listen, mountPage, onCleanup, runCleanup} from './lib/lifecycle';
import {debounce} from './lib/utils';

import {initAmbient} from './site/ambient';
import {initButtons} from './site/buttons';
import {initCursor} from './site/cursor';
import {initDividers} from './site/dividers';
import {initMobileMenu} from './site/mobile-menu';
import {initNavbar} from './site/navbar';
import {initPreloader} from './site/preloader';
import {initReveals} from './site/reveals';
import {initTrunk} from './site/trunk';

import {initElderDetail} from './pages/elder-detail';
import {initAbout} from './pages/home-about';
import {initContact} from './pages/home-contact';
import {initEldersSlider} from './pages/home-elders';
import {initGallery} from './pages/home-gallery';
import {playHero} from './pages/home-hero';
import {initTimeline} from './pages/home-timeline';
import {initTraditions} from './pages/home-traditions';

gsap.registerPlugin(ScrollTrigger);

window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

let firstLoad = true;

/**
 * کدهای سنگین (three.js) فقط روی صفحه‌هایی که لازم‌اند بارگذاری می‌شوند.
 * اگر کاربر قبل از پایان بارگذاری به صفحه‌ی دیگری برود، اجرا نمی‌شود.
 */
function lazyPage(importer, run) {
    let alive = true;
    onCleanup(() => {
        alive = false;
    });

    importer()
        .then((module) => {
            if (alive) run(module);
        })
        .catch((error) => console.error('[lazy-load]', error));
}

function boot() {
    const page = document.body.dataset.page;
    const minimal = document.body.dataset.chrome === 'minimal';

    initPreloader(firstLoad);
    firstLoad = false;

    initNavbar();
    initMobileMenu();
    initCursor();

    if (!minimal) {
        initTrunk();
        initAmbient();
    }

    initDividers();
    initButtons();
    initReveals();

    if (page === 'home') {
        playHero();
        initAbout();
        initGallery();
        initTimeline();
        initTraditions();
        initEldersSlider();
        initContact();

        lazyPage(
            () => import('./three/village-scene'),
            (m) => {
                m.initHeroScene();
                m.initTeaserScene();
            }
        );
    }

    if (page === 'elder') {
        initElderDetail();
    }

    if (page === 'family') {
        lazyPage(
            () => import('./pages/family-tree'),
            (m) => m.initFamilyTree()
        );
    }

    mountPage(page);

    listen(window, 'resize', debounce(() => ScrollTrigger.refresh(), 350));
    ScrollTrigger.refresh();
}

// قبل از ترک صفحه: همه‌ی شنونده‌ها و انیمیشن‌ها پاک می‌شن
document.addEventListener('livewire:navigate', () => {
    runCleanup();
    ScrollTrigger.getAll().forEach((t) => t.kill());
});

// بعد از ورود به هر صفحه (شامل بارگذاری اول)
document.addEventListener('livewire:navigated', boot);

// بعد از لود کامل تصاویر، محاسبات ScrollTrigger دقیق بشن
window.addEventListener('load', () => ScrollTrigger.refresh());
