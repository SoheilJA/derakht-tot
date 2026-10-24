import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

import {initHeroScene, initTeaserScene} from './three/village-scene';
import {playHero} from './pages/home-hero';
import {initAbout} from "./pages/home-about.js";
import {runCleanup, mountPage, listen} from './lib/lifecycle';
import {debounce} from './lib/utils';
import {initPreloader} from './site/preloader';
import {initNavbar} from './site/navbar';
import {initMobileMenu} from './site/mobile-menu';
import {initCursor} from './site/cursor';
import {initTrunk} from './site/trunk';
import {initAmbient} from './site/ambient';
import {initDividers} from './site/dividers';
import {initButtons} from './site/buttons';
import {initReveals} from './site/reveals';
import { initGallery } from './pages/home-gallery';
import { initTimeline } from './pages/home-timeline';
import { initTraditions } from './pages/home-traditions';
import { initEldersSlider } from './pages/home-elders';

gsap.registerPlugin(ScrollTrigger);

window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

let firstLoad = true;

function boot() {
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

    if (document.body.dataset.page === 'home') {
        initHeroScene();
        initTeaserScene();
        playHero();
        initAbout();
        initGallery();
        initTimeline();
        initTraditions();
        initEldersSlider();
    }
    mountPage(document.body.dataset.page);

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
