(function () {
  "use strict";

  var root = document.documentElement;

  /* ---- Theme ---------------------------------------------------------- */

  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  var themeButtons = document.querySelectorAll("[data-theme-toggle]");

  function currentTheme() {
    return root.getAttribute("data-theme") || (darkQuery.matches ? "dark" : "light");
  }

  function syncThemeButtons() {
    var label = currentTheme() === "dark" ? "Switch to light mode" : "Switch to dark mode";
    themeButtons.forEach(function (btn) { btn.setAttribute("aria-label", label); });
  }

  themeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
      syncThemeButtons();
    });
  });
  syncThemeButtons();
  if (darkQuery.addEventListener) darkQuery.addEventListener("change", syncThemeButtons);

  /* ---- Mobile menu ---------------------------------------------------- */

  var header = document.querySelector("[data-header]");
  var menuToggle = document.querySelector("[data-menu-toggle]");
  if (header && menuToggle) {
    menuToggle.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---- Archive search ------------------------------------------------- */

  var search = document.querySelector("[data-search-input]");
  if (search) {
    var rows = Array.prototype.slice.call(document.querySelectorAll("[data-post]"));
    var groups = Array.prototype.slice.call(document.querySelectorAll("[data-group]"));
    var empty = document.querySelector("[data-empty]");

    search.addEventListener("input", function () {
      var terms = search.value.toLowerCase().split(/\s+/).filter(Boolean);
      var shown = 0;
      rows.forEach(function (row) {
        var text = row.getAttribute("data-search") || "";
        var match = terms.every(function (term) { return text.indexOf(term) !== -1; });
        row.hidden = !match;
        if (match) shown++;
      });
      groups.forEach(function (group) {
        group.hidden = !group.querySelector("[data-post]:not([hidden])");
      });
      if (empty) empty.hidden = shown > 0;
    });

    document.addEventListener("keydown", function (event) {
      var target = event.target;
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      event.preventDefault();
      search.focus();
    });
  }

  /* ---- Reading progress ----------------------------------------------- */

  var bar = document.querySelector("[data-progress]");
  var article = document.querySelector("[data-article]");
  if (bar && article) {
    var ticking = false;
    var update = function () {
      var rect = article.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 1;
      bar.style.transform = "scaleX(" + progress + ")";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }
})();
