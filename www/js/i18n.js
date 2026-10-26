/* Charla – Sprachschicht: Oberflächentexte (Deutsch/Englisch) und übersetzte Lerninhalte
 *
 * Deutsch ist die Ausgangssprache: t('Deutscher Text') liefert in der Sprache „en“ die Übersetzung aus
 * js/i18n/en.js (oder den deutschen Text, falls keine vorhanden ist). Platzhalter: t('{n} Wörter', {n: 3}).
 * Die Sprache steht beim Laden fest. Ein Wechsel speichert die Einstellung und lädt die Seite neu.
 */
(function () {
  'use strict';
  const C = (window.Charla = window.Charla || {});
  const I = (C.i18n = { dict: {}, content: {}, missing: [], languages: ['de', 'en'] });

  function readState() {
    let best = null;
    try {
      const raw = window.localStorage.getItem('charla.state.v1');
      if (raw) best = JSON.parse(raw);
    } catch (e) { best = null; }
    try {
      const box = window.__CHARLA_NATIVE__;
      if (box && box.state) {
        const n = typeof box.state === 'string' ? JSON.parse(box.state) : box.state;
        if (n && (!best || (n.savedAt || 0) > (best.savedAt || 0))) best = n;
      }
    } catch (e) { /* ignorieren */ }
    return best;
  }

  /** Sprache des Geräts: Deutsch, sonst Englisch */
  I.detect = function () {
    const n = (navigator.languages && navigator.languages[0]) || navigator.language || 'de';
    return /^de/i.test(n) ? 'de' : 'en';
  };

  /** Gewählte Einstellung: 'auto' | 'de' | 'en' */
  I.setting = function () {
    const st = readState();
    const v = st && st.settings && st.settings.lang;
    return v === 'de' || v === 'en' ? v : 'auto';
  };

  const chosen = I.setting();
  I.current = chosen === 'auto' ? I.detect() : chosen;
  document.documentElement.setAttribute('lang', I.current);

  I.add = function (lang, map) {
    I.dict[lang] = Object.assign(I.dict[lang] || {}, map);
  };

  I.t = function (key, params) {
    let s = key;
    if (I.current !== 'de') {
      const d = I.dict[I.current];
      if (d && Object.prototype.hasOwnProperty.call(d, key)) s = d[key];
      else if (I.missing.indexOf(key) < 0) I.missing.push(key);
    }
    if (params) {
      s = s.replace(/\{(\w+)\}/g, function (m, k) { return params[k] !== undefined ? String(params[k]) : m; });
    }
    return s;
  };

  /** Lerninhalte in einer anderen Sprache: Charla.i18n.addContent('en', 'u1', {title, sub, lessons: [...]}) */
  I.addContent = function (lang, unitId, data) {
    (I.content[lang] = I.content[lang] || {})[unitId] = data;
  };

  C.util.WEEKDAYS = I.current === 'de'
    ? ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  C.util.plural = function (n, one, many) { return n + ' ' + I.t(n === 1 ? one : many); };
})();
