/* ============================================================
   js/hero-fallback.js — watchdog for the hero WebGL scene.
   If the ES module (hero-scene.js) never sets window.__heroBooted
   within 3.5s (WebGL unavailable, module error, ...), hide the
   canvas and reveal the static hero image instead.
   ============================================================ */
setTimeout(function () {
  if (!window.__heroBooted) {
    var f = document.getElementById("hero-fallback");
    if (f) f.classList.remove("hidden");
    var c = document.getElementById("hero-canvas");
    if (c) c.style.display = "none";
  }
}, 3500);
