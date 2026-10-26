/* Charla – Oberflächen-Bausteine: Icons, Buttons, Sheets, Dialoge */
(function () {
  'use strict';
  const C = (window.Charla = window.Charla || {});
  const U = C.util;
  const h = U.h;
  const ui = (C.ui = {});

  const SVG = {
    speaker: '<path d="M11 5 6.5 9H3v6h3.5L11 19V5z" fill="currentColor"/><path d="M15 9a4.2 4.2 0 0 1 0 6M17.8 6.2a8.2 8.2 0 0 1 0 11.6"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    cross: '<path d="M6 6l12 12M18 6 6 18"/>',
    next: '<path d="M9 5l7 7-7 7"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>',
    stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="currentColor"/>',
    flame: '<path d="M12 2.5c.6 3.6 5.2 5.6 5.2 10.6a5.2 5.2 0 0 1-10.4 0c0-2 .9-3.3 2.2-4.4.1 1.8.9 2.8 1.9 3.1-.6-3.6-.2-6.6 1.1-9.3z" fill="currentColor" stroke="none"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.7 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8L12 3z" fill="currentColor" stroke="none"/>',
    book: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5v-15z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3M9 7.5h6"/>',
    review: '<path d="M19.5 11A7.5 7.5 0 0 0 6.2 6.7M4.5 3.5v4h4"/><path d="M4.5 13a7.5 7.5 0 0 0 13.3 4.3M19.5 20.5v-4h-4"/>',
    words: '<rect x="4" y="3.5" width="16" height="17" rx="3"/><path d="M8 9h8M8 13h8M8 17h4.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    heartFill: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" fill="currentColor"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    turtle: '<path d="M3.5 16.5c0-4.4 3.8-8 8.5-8s8.5 3.6 8.5 8h-17z" fill="currentColor" stroke="none"/><path d="M20.5 16.5h1.5M2 16.5h1.5M7 19.5v-3M17 19.5v-3"/>',
    trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4v1.5A3 3 0 0 0 7 10.5M17 6h3v1.5a3 3 0 0 1-3 3M12 14v4M8.5 20.5h7"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>'
  };
  ui.SVG = SVG;

  ui.icon = function (name, size, cls) {
    const s = size || 22;
    const span = document.createElement('span');
    span.className = 'ico' + (cls ? ' ' + cls : '');
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (SVG[name] || '') + '</svg>';
    return span;
  };

  /** Lautsprecher-Knopf: spricht den Text, pulsiert solange er läuft */
  ui.speakBtn = function (text, opts) {
    opts = opts || {};
    const btn = h('button.speak' + (opts.slow ? '.slow' : '') + (opts.big ? '.big' : ''), {
      type: 'button',
      'aria-label': opts.slow ? 'Langsam vorspielen' : 'Vorspielen',
      onclick: function (e) {
        e.stopPropagation();
        ui.play(text, opts, btn);
      }
    }, ui.icon(opts.slow ? 'turtle' : 'speaker', opts.size || (opts.big ? 30 : 22)));
    return btn;
  };

  ui.play = function (text, opts, btn) {
    opts = opts || {};
    if (btn) btn.classList.add('playing');
    return C.audio.speak(text, { slow: !!opts.slow, voice: opts.voice, pitch: opts.pitch }).then(function () {
      if (btn) btn.classList.remove('playing');
    });
  };

  ui.btn = function (label, opts) {
    opts = opts || {};
    return h('button.btn' + (opts.kind ? '.' + opts.kind : '.primary') + (opts.block ? '.block' : '') + (opts.big ? '.big' : ''), {
      type: 'button', disabled: !!opts.disabled, onclick: opts.onclick
    }, opts.icon ? ui.icon(opts.icon, 20) : null, label);
  };

  // ---------- Ebene für Sheets/Dialoge ----------
  function layer() { return document.getElementById('layer'); }

  /** Unteres Blatt (Sheet). Gibt {el, body, close} zurück. */
  ui.sheet = function (opts) {
    opts = opts || {};
    const root = layer();
    const body = h('div.sheet-body');
    const panel = h('div.sheet' + (opts.tall ? '.tall' : ''), { role: 'dialog', 'aria-modal': 'true' },
      h('div.grab'),
      opts.title ? h('div.sheet-title', opts.title) : null,
      body);
    const backdrop = h('div.backdrop', { onclick: function () { ctl.close(); } });
    const wrap = h('div.sheet-wrap', backdrop, panel);
    const ctl = {
      el: wrap, body: body,
      close: function () {
        if (!wrap.parentNode) return;
        wrap.classList.add('out');
        setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 220);
        if (opts.onclose) opts.onclose();
      }
    };
    if (opts.content) body.appendChild(opts.content);
    root.appendChild(wrap);
    requestAnimationFrame(function () { wrap.classList.add('in'); });
    return ctl;
  };

  /** Bestätigungsdialog → Promise<boolean> */
  ui.confirm = function (opts) {
    return new Promise(function (resolve) {
      let answered = false;
      const sh = ui.sheet({
        title: opts.title,
        onclose: function () { if (!answered) { answered = true; resolve(false); } }
      });
      if (opts.text) sh.body.appendChild(h('p.sheet-text', opts.text));
      sh.body.appendChild(h('div.sheet-actions',
        ui.btn(opts.ok || 'OK', { kind: opts.danger ? 'danger' : 'primary', block: true, onclick: function () { answered = true; resolve(true); sh.close(); } }),
        ui.btn(opts.cancel || 'Abbrechen', { kind: 'ghost', block: true, onclick: function () { sh.close(); } })));
    });
  };

  ui.toast = function (text) {
    const t = h('div.toast', text);
    layer().appendChild(t);
    requestAnimationFrame(function () { t.classList.add('in'); });
    setTimeout(function () { t.classList.remove('in'); setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 250); }, 1800);
  };

  /** Fortschrittsring mit Inhalt */
  ui.ring = function (frac, size, stroke, inner, cls) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const wrap = h('div.ring' + (cls ? '.' + cls : ''), { style: { width: size + 'px', height: size + 'px' } });
    wrap.innerHTML = '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
      '<circle class="ring-bg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke-width="' + stroke + '"/>' +
      '<circle class="ring-fg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke-width="' + stroke + '" ' +
      'stroke-linecap="round" stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + (c * (1 - U.clamp(frac, 0, 1))).toFixed(2) + '" ' +
      'transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/></svg>';
    const mid = h('div.ring-in', inner);
    wrap.appendChild(mid);
    return wrap;
  };

  /** Punkte für die Wortstärke 0..6 */
  ui.dots = function (box) {
    const wrap = h('span.dots', { title: C.srs.LABELS[box] || '' });
    for (let i = 0; i < 6; i++) wrap.appendChild(h('i' + (i < box ? '.on' : '')));
    return wrap;
  };

  ui.stars = function (n, size) {
    const wrap = h('span.stars');
    for (let i = 0; i < 3; i++) wrap.appendChild(h('span.star' + (i < n ? '.on' : ''), ui.icon('star', size || 16)));
    return wrap;
  };

  /** Absätze (\n\n) als <p> */
  ui.paras = function (text) {
    return String(text).split(/\n\s*\n/).map(function (p) { return h('p', p); });
  };
})();
