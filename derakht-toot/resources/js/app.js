import './bootstrap';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { runCleanup, mountPage } from './lib/lifecycle';
import { initPreloader } from './site/preloader';
import { initNavbar } from './site/navbar';
import { initMobileMenu } from './site/mobile-menu';

gsap.registerPlugin(ScrollTrigger);

window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

let firstLoad = true;

function boot() {
    initPreloader(firstLoad);
    firstLoad = false;

    initNavbar();
    initMobileMenu();

    mountPage(document.body.dataset.page);

    ScrollTrigger.refresh();
}

// قبل از ترک صفحه: همه‌ی شنونده‌ها و انیمیشن‌ها پاک می‌شن
document.addEventListener('livewire:navigate', () => {
    runCleanup();
    ScrollTrigger.getAll().forEach((t) => t.kill());
});

// بعد از ورود به هر صفحه (شامل بارگذاری اول)
document.addEventListener('livewire:navigated', boot);