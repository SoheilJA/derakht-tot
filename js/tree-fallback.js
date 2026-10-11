/* ============================================================
   js/tree-fallback.js — nested-HTML fallback for the 3D tree.
   Classic script on purpose: must work even if the WebGL
   module (family-tree.js) fails to load. Exposes
   window.__showTreeFallback() and boots the watchdog timer.
   ============================================================ */
/* Fallback list renderer (classic script — works even if the module fails) */
      window.__showTreeFallback = function () {
        var wrap = document.getElementById("tree-fallback");
        if (!wrap || wrap.dataset.shown) return;
        wrap.dataset.shown = "1";
        wrap.classList.remove("hidden");
        var people = (window.VillageData && VillageData.family) || [];
        var byParent = {};
        people.forEach(function (p) {
          (byParent[p.parent_id] = byParent[p.parent_id] || []).push(p);
        });
        function node(p, depth) {
          var years = p.death_year
            ? VUtils.toFa(p.birth_year) + "–" + VUtils.toFa(p.death_year)
            : VUtils.toFa(p.birth_year);
          var html =
            "<details " +
            (depth < 2 ? "open" : "") +
            ' class="bg-mulberry-900/50 border border-mulberry-300/20 rounded-xl">' +
            '<summary class="p-3 cursor-pointer hover:bg-mulberry-700/40 transition-colors rounded-xl flex items-center gap-2">' +
            '<span class="w-2.5 h-2.5 rounded-full ' +
            (p.gender === "f" ? "bg-mulberry-300" : "bg-gold-500") +
            '"></span>' +
            "<b>" +
            p.first_name +
            " " +
            p.last_name +
            "</b>" +
            '<span class="text-xs text-cream-100/50">' +
            years +
            "</span>" +
            (p.death_year
              ? '<span class="text-[10px] border border-cream-100/30 rounded px-1">درگذشته</span>'
              : "") +
            "</summary>" +
            '<div class="px-4 pb-3 text-xs text-cream-100/60 leading-7">' +
            (p.short_bio || "") +
            (p.spouse_name ? " — همسر: " + p.spouse_name : "") +
            "</div>";
          var kids = byParent[p.id] || [];
          if (kids.length)
            html +=
              '<div class="pr-5 pb-3 space-y-2">' +
              kids
                .map(function (k) {
                  return node(k, depth + 1);
                })
                .join("") +
              "</div>";
          return html + "</details>";
        }
        var roots = people.filter(function (p) {
          return p.parent_id === null;
        });
        document.getElementById("tree-fallback-list").innerHTML = roots
          .map(function (r) {
            return node(r, 0);
          })
          .join("");
      };
      /* Watchdog: if the 3D module never boots (CDN/network failure), show the fallback */
      setTimeout(function () {
        if (!window.__treeBooted) window.__showTreeFallback();
      }, 4000);
