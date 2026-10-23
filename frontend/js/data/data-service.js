/* ============================================================
   js/data/data-service.js — the ONLY data access point.
   All UI code must call VillageData.service.* — never the raw arrays.

   ------------------------------------------------------------------
   DATA CONTRACT (implement these shapes on your back-end):
   ------------------------------------------------------------------
   news item: {
     id: number, slug: string, title: string, summary: string,
     content_html: string (sanitized HTML of the article body),
     cover_image: url, category: string,
     published_at: ISO-8601 date string, author: string,
     reading_time_min: number
   }
   elder: {
     id, slug, first_name, last_name, title,
     birth_year: number, death_year: number|null,
     birthplace, profession, category, photo: url,
     bio_html: string, achievements: [{title, description}],
     quotes: [string], gallery: [url],
     relatives: [{person_id:number|null, name, relation}]
   }
   family person: {
     id: number, first_name, last_name, gender: "m"|"f",
     birth_year: number, death_year: number|null,
     photo: url|null, short_bio: string,
     parent_id: number|null, spouse_name: string|null,
     elder_slug: string|null
   }
   village info: {
     name, tagline,
     stats: [{label, value:number, suffix}],
     facts: [{icon, title, text}],
     gallery: [{url, title, desc, alt}],
     timeline: [{year:number, title, text, image?:url}],
     traditions: [{icon, title, text}],
     contact: {address, phone, email, hours}
   }
   ------------------------------------------------------------------
   Replace the body of these functions with fetch() calls to your
   own back-end later; nothing else in the project should need
   to change.  e.g.  return fetch('/api/news').then(r => r.json());
   ------------------------------------------------------------------ */
window.VillageData = window.VillageData || {};
window.VillageData.service = (function () {
  'use strict';
  var D = window.VillageData;
  function copy(v) { return JSON.parse(JSON.stringify(v)); } // never leak mutable mock arrays

  /** All news items, newest first. */
  function getNews() {
    return Promise.resolve(copy(D.news).sort(function (a, b) { return new Date(b.published_at) - new Date(a.published_at); }));
  }
  /** Single news by slug, or null. */
  function getNewsBySlug(slug) {
    return Promise.resolve(copy(D.news.find(function (n) { return n.slug === slug; }) || null));
  }
  /** All elders. */
  function getElders() {
    return Promise.resolve(copy(D.elders));
  }
  /** Single elder by slug, or null. */
  function getElderBySlug(slug) {
    return Promise.resolve(copy(D.elders.find(function (e) { return e.slug === slug; }) || null));
  }
  /** Flat family-tree people list. */
  function getFamilyPeople() {
    return Promise.resolve(copy(D.family));
  }
  /** Village-level info (stats, gallery, timeline, traditions, contact...). */
  function getVillageInfo() {
    return Promise.resolve(copy(D.village));
  }
  return { getNews: getNews, getNewsBySlug: getNewsBySlug, getElders: getElders,
           getElderBySlug: getElderBySlug, getFamilyPeople: getFamilyPeople,
           getVillageInfo: getVillageInfo };
})();