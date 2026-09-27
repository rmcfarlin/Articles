(function () {
  "use strict";

  var root = document.documentElement;
  var store = {
    get: function (key) {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
    }
  };

  /* ---- Theme ---------------------------------------------------------- */

  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  var themeLabel = document.querySelector("[data-theme-label]");

  function currentTheme() {
    return root.getAttribute("data-theme") || (darkQuery.matches ? "dark" : "light");
  }

  function syncThemeLabel() {
    if (themeLabel) themeLabel.textContent = currentTheme() === "dark" ? "Light mode" : "Dark mode";
  }

  function toggleTheme() {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    store.set("theme", next);
    syncThemeLabel();
  }

  syncThemeLabel();
  if (darkQuery.addEventListener) darkQuery.addEventListener("change", syncThemeLabel);
  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", toggleTheme);
  });

  /* ---- Mobile menu ---------------------------------------------------- */

  var sidebar = document.querySelector("[data-sidebar]");
  var menuToggle = document.querySelector("[data-menu-toggle]");
  if (sidebar && menuToggle) {
    menuToggle.addEventListener("click", function () {
      var open = sidebar.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---- Cards: "new" dot and read ticks -------------------------------- */

  var NEW_DAYS = 30;
  var readList = [];
  try { readList = JSON.parse(store.get("read-articles") || "[]"); } catch (e) { readList = []; }

  var article = document.querySelector("[data-article]");
  if (article) {
    var url = article.getAttribute("data-article");
    if (readList.indexOf(url) === -1) {
      readList.push(url);
      store.set("read-articles", JSON.stringify(readList));
    }
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
  var now = Date.now();
  cards.forEach(function (card) {
    var published = Date.parse(card.getAttribute("data-date"));
    var age = (now - published) / 864e5;
    var dot = card.querySelector("[data-new]");
    if (dot && age >= 0 && age <= NEW_DAYS) dot.hidden = false;
    if (readList.indexOf(card.getAttribute("data-url")) !== -1) card.classList.add("is-read");
  });

  /* ---- Search and topic filter (home) --------------------------------- */

  var search = document.querySelector("[data-search-input]");
  var filters = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var countEl = document.querySelector("[data-count]");
  var emptyEl = document.querySelector("[data-empty]");
  var activeTag = "";

  function applyFilter() {
    var terms = (search ? search.value : "").toLowerCase().split(/\s+/).filter(Boolean)
      .map(function (term) { return term.replace(/^#/, ""); });
    var shown = 0;
    cards.forEach(function (card) {
      var tags = " " + card.getAttribute("data-tags") + " ";
      var text = card.getAttribute("data-search") || "";
      var match = (!activeTag || tags.indexOf(" " + activeTag + " ") !== -1) &&
        terms.every(function (term) { return text.indexOf(term) !== -1; });
      card.hidden = !match;
      if (match) shown++;
    });
    if (countEl) countEl.textContent = shown;
    if (emptyEl) emptyEl.hidden = shown > 0 || cards.length === 0;
  }

  if (search) search.addEventListener("input", applyFilter);
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeTag = btn.getAttribute("data-filter");
      filters.forEach(function (other) { other.setAttribute("aria-pressed", String(other === btn)); });
      applyFilter();
    });
  });

  /* ---- Keyboard shortcuts --------------------------------------------- */

  document.addEventListener("keydown", function (event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    var target = event.target;
    if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) {
      if (event.key === "Escape" && target === search) {
        search.value = "";
        applyFilter();
        search.blur();
      }
      return;
    }
    if (event.key === "/" && search) {
      event.preventDefault();
      search.focus();
    } else if (event.key === "t" || event.key === "T") {
      toggleTheme();
    } else {
      var link = document.querySelector('.nav a[data-key="' + event.key + '"]');
      if (link) window.location.href = link.href;
    }
  });

  /* ---- Reading progress ----------------------------------------------- */

  var bar = document.querySelector("[data-progress]");
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
