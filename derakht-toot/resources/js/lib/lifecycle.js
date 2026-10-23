const disposers = [];
const pages = {};

/** ثبت یک کار پاکسازی که قبل از رفتن به صفحه‌ی بعد اجرا می‌شه */
export function onCleanup(fn) {
    disposers.push(fn);
}

/** addEventListener که خودش پاکسازی هم ثبت می‌کنه */
export function listen(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    onCleanup(() => target.removeEventListener(type, handler, options));
}

export function runCleanup() {
    while (disposers.length) {
        try {
            disposers.pop()();
        } catch (e) {
            console.error(e);
        }
    }
}

/** اسکریپت هر صفحه با نام data-page ثبت می‌شه؛ می‌تونه تابع پاکسازی برگردونه */
export function registerPage(name, init) {
    pages[name] = init;
}

export function mountPage(name) {
    const init = pages[name];
    if (!init) return;
    const cleanup = init();
    if (typeof cleanup === 'function') onCleanup(cleanup);
}