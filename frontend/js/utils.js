/* ============================================================
   js/utils.js — shared helpers (classic script, global: VUtils)
   ============================================================ */
window.VUtils = (function () {
    'use strict';
    var FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    /** Convert any number (or latin-digit string) to Persian digits. */
    function toFa(v) {
        return String(v).replace(/\d/g, function (d) { return FA_DIGITS[+d]; });
    }
    /** Convert Persian/Arabic digits back to latin (for validation). */
    function toEnDigits(v) {
        return String(v)
            .replace(/[۰-۹]/g, function (d) { return String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)); })
            .replace(/[٠-٩]/g, function (d) { return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)); });
    }
    /** Format an ISO date as a long Jalali-style Persian date. */
    function faDate(iso) {
        try {
            return new Intl.DateTimeFormat('fa-IR-u-ca-persian', { dateStyle: 'long' }).format(new Date(iso));
        } catch (e) { return toFa(iso || ''); }
    }
    function reduced() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    function debounce(fn, ms) {
        var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); };
    }
    function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
    function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
    function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    /** Lightweight split-text: wraps each character of a word-aware span structure. */
    function splitText(el) {
        if (!el || el.dataset.splitDone) return qsa('.split-char', el);
        var words = el.textContent.trim().split(/\s+/), frag = document.createDocumentFragment();
        words.forEach(function (w, wi) {
            var word = document.createElement('span');
            word.style.display = 'inline-block'; word.style.whiteSpace = 'nowrap';
            w.split('').forEach(function (ch) {
                var s = document.createElement('span');
                s.className = 'split-char'; s.textContent = ch; word.appendChild(s);
            });
            frag.appendChild(word);
            if (wi < words.length - 1) frag.appendChild(document.createTextNode(' '));
        });
        el.textContent = ''; el.appendChild(frag); el.dataset.splitDone = '1';
        return qsa('.split-char', el);
    }
    /** Simple URL query reader. */
    function getQuery(key) { return new URLSearchParams(location.search).get(key); }
    return {
        toFa: toFa, toEnDigits: toEnDigits, faDate: faDate, reduced: reduced,
        debounce: debounce, clamp: clamp, qs: qs, qsa: qsa, splitText: splitText, escapeHtml: escapeHtml, getQuery: getQuery
    };
})();