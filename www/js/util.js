/* Charla – kleine Helfer (DOM, Zufall, Datum) */
(function () {
  'use strict';
  const C = (window.Charla = window.Charla || {});
  const U = (C.util = {});

  function isAttrs(x) {
    return x && typeof x === 'object' && !Array.isArray(x) && !(x instanceof Node);
  }

  function append(el, kid) {
    if (kid === null || kid === undefined || kid === false || kid === true) return;
    if (Array.isArray(kid)) { kid.forEach(function (k) { append(el, k); }); return; }
    if (kid instanceof Node) { el.appendChild(kid); return; }
    el.appendChild(document.createTextNode(String(kid)));
  }

  /** h('div.card#id', {onclick: fn, dataset: {a: 1}}, 'Text', childEl) */
  U.h = function (spec, attrs) {
    const kids = Array.prototype.slice.call(arguments, 2);
    if (!isAttrs(attrs)) {
      if (attrs !== undefined && attrs !== null) kids.unshift(attrs);
      attrs = {};
    }
    const tagMatch = /^[a-zA-Z][a-zA-Z0-9]*/.exec(spec);
    const el = document.createElement(tagMatch ? tagMatch[0] : 'div');
    const idMatch = /#([\w-]+)/.exec(spec);
    if (idMatch) el.id = idMatch[1];
    const re = /\.([\w-]+)/g;
    let m;
    while ((m = re.exec(spec))) el.classList.add(m[1]);

    Object.keys(attrs).forEach(function (k) {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class' || k === 'className') {
        String(v).split(/\s+/).forEach(function (c) { if (c) el.classList.add(c); });
      } else if (k === 'style') {
        if (typeof v === 'string') el.style.cssText = v;
        else Object.keys(v).forEach(function (sk) {
          if (sk.slice(0, 2) === '--') el.style.setProperty(sk, v[sk]); else el.style[sk] = v[sk];
        });
      } else if (k === 'dataset') {
        Object.keys(v).forEach(function (dk) { el.dataset[dk] = v[dk]; });
      } else if (k.slice(0, 2) === 'on' && typeof v === 'function') {
        el.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (v === true) {
        el.setAttribute(k, '');
      } else {
        el.setAttribute(k, v);
      }
    });
    kids.forEach(function (k) { append(el, k); });
    return el;
  };

  /** Element aus einem (eigenen, statischen) SVG/HTML-String */
  U.html = function (str, cls) {
    const span = document.createElement('span');
    if (cls) span.className = cls;
    span.innerHTML = str;
    return span;
  };

  U.clear = function (el) { while (el.firstChild) el.removeChild(el.firstChild); return el; };
  U.$ = function (sel, root) { return (root || document).querySelector(sel); };
  U.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  U.shuffle = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  U.sample = function (arr, n) { return U.shuffle(arr).slice(0, n); };
  U.pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  U.uniqBy = function (arr, fn) {
    const seen = new Set();
    return arr.filter(function (x) { const k = fn(x); if (seen.has(k)) return false; seen.add(k); return true; });
  };
  U.clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  U.sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  // ---- Datum (lokale Zeit) ----
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  U.dayKey = function (d) {
    d = d || new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  };
  U.parseDay = function (key) {
    const p = key.split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2], 12, 0, 0);
  };
  U.addDays = function (key, n) {
    const d = U.parseDay(key);
    d.setDate(d.getDate() + n);
    return U.dayKey(d);
  };
  U.WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  /** 'YYYY-MM-DD' aus Text (für Ids) */
  U.slug = function (s) {
    return String(s).toLowerCase().replace(/ñ/g, 'n~').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9~]+/g, '-').replace(/^-+|-+$/g, '');
  };

  U.plural = function (n, one, many) { return n + ' ' + (n === 1 ? one : many); };

  U.once = function (fn) {
    let called = false;
    return function () { if (called) return; called = true; return fn.apply(this, arguments); };
  };
})();
