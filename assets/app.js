// the WHYKINGS — language toggle, animated counters, FAQ accordion,
// nav scroll state, reveal-on-scroll. No dependencies.
(function () {
  "use strict";

  var CONTENT = window.WK_CONTENT;
  var lang = "de";
  try { lang = localStorage.getItem("wk_lang") || "de"; } catch (e) {}
  if (!CONTENT[lang]) lang = "de";

  /* ---------- language ---------- */

  function resolve(dict, path) {
    return path.split(".").reduce(function (obj, key) {
      return obj == null ? obj : obj[key];
    }, dict);
  }

  function formatNum(n) {
    return n.toLocaleString(lang === "de" ? "de-DE" : "en-US");
  }

  function renderCounter(el) {
    var val = el.__val != null ? el.__val : Number(el.getAttribute("data-counter"));
    el.textContent = formatNum(val);
  }

  function applyLang(next) {
    if (!CONTENT[next]) return;
    lang = next;
    try { localStorage.setItem("wk_lang", next); } catch (e) {}
    document.documentElement.lang = next;
    var dict = CONTENT[next];
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var val = resolve(dict, el.getAttribute("data-i18n"));
      if (typeof val === "string") el.textContent = val;
    });
    document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
      btn.classList.toggle("on", btn.getAttribute("data-lang") === next);
    });
    // re-render counters with locale-appropriate number grouping
    document.querySelectorAll("[data-counter]").forEach(renderCounter);
  }

  document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLang(btn.getAttribute("data-lang"));
    });
  });

  /* ---------- nav scroll state ---------- */

  var nav = document.querySelector(".nav");
  function onScroll() {
    nav.classList.toggle("nav--scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- FAQ accordion ---------- */

  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.closest(".faq-item").classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---------- animated stat counters ---------- */

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-counter]").forEach(function (el) {
    var target = Number(el.getAttribute("data-counter"));
    el.__val = target;
    if (reducedMotion) { renderCounter(el); return; }
    el.__val = 0;
    renderCounter(el);
    var obs = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      var start = performance.now();
      var dur = 1400;
      function tick(now) {
        var p = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.__val = Math.round(target * eased);
        renderCounter(el);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    obs.observe(el);
  });

  /* ---------- apply stored language ---------- */

  if (lang !== "de") applyLang(lang);

  /* ---------- reveal-on-scroll ---------- */

  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reducedMotion) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        el.classList.add("in");
      } else {
        revealObs.observe(el);
      }
    });
  }
})();
