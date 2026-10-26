/* Charla – Speicher: Fortschritt, Einstellungen, Statistik (localStorage + native Datei) */
(function () {
  'use strict';
  const C = (window.Charla = window.Charla || {});
  const U = C.util;
  const KEY = 'charla.state.v1';
  const S = (C.store = {});
  const listeners = [];
  let timer = null;

  function defaults() {
    return {
      v: 1,
      savedAt: 0,
      profile: { onboarded: false, goal: '', dailyGoal: 80, created: Date.now() },
      settings: { rate: 0.9, voice: '', sound: true, haptics: true, theme: 'auto', autoplay: true, lang: 'auto' },
      lessons: {},
      vocab: {},
      stats: { xp: 0, days: {}, answers: 0, correct: 0, sessions: 0 }
    };
  }

  function parse(raw) {
    if (!raw) return null;
    try {
      const o = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return o && o.v === 1 ? o : null;
    } catch (e) { return null; }
  }

  function merge(base, loaded) {
    if (!loaded) return base;
    ['profile', 'settings', 'stats'].forEach(function (k) { Object.assign(base[k], loaded[k] || {}); });
    base.lessons = loaded.lessons || {};
    base.vocab = loaded.vocab || {};
    base.stats.days = (loaded.stats && loaded.stats.days) || {};
    base.savedAt = loaded.savedAt || 0;
    return base;
  }

  S.state = defaults();

  S.load = function () {
    let local = null;
    try { local = parse(window.localStorage.getItem(KEY)); } catch (e) { local = null; }
    const nativeBox = window.__CHARLA_NATIVE__;
    const nat = nativeBox ? parse(nativeBox.state) : null;
    let best = local;
    if (nat && (!local || (nat.savedAt || 0) > (local.savedAt || 0))) best = nat;
    S.state = merge(defaults(), best);
    S.applyTheme();
    return S.state;
  };

  S.subscribe = function (fn) { listeners.push(fn); return function () { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); }; };
  S.notify = function () { listeners.slice().forEach(function (fn) { try { fn(S.state); } catch (e) { console.error(e); } }); };

  S.flush = function () {
    clearTimeout(timer); timer = null;
    S.state.savedAt = Date.now();
    const json = JSON.stringify(S.state);
    try { window.localStorage.setItem(KEY, json); } catch (e) { /* privat / voll */ }
    if (C.native && C.native.available) C.native.post('saveState', { json: json });
  };
  S.save = function () {
    clearTimeout(timer);
    timer = setTimeout(S.flush, 300);
  };
  /** Zustand wurde verändert: speichern und Oberfläche informieren */
  S.touch = function () { S.save(); S.notify(); };

  S.reset = function () {
    S.state = defaults();
    S.flush();
    S.applyTheme();
    S.notify();
  };

  S.exportJSON = function () { S.state.savedAt = Date.now(); return JSON.stringify(S.state); };
  S.importJSON = function (text) {
    const o = parse(text);
    if (!o) return false;
    S.state = merge(defaults(), o);
    S.flush(); S.applyTheme(); S.notify();
    return true;
  };

  S.applyTheme = function () {
    const t = S.state.settings.theme;
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
    if (C.native && C.native.available) C.native.post('theme', { value: t === 'light' || t === 'dark' ? t : 'auto' });
  };

  // ---- XP, Tage, Serie ----
  S.addXp = function (n) {
    if (!n) return;
    const st = S.state.stats, k = U.dayKey();
    st.xp += n;
    st.days[k] = (st.days[k] || 0) + n;
  };
  S.xpOn = function (key) { return S.state.stats.days[key] || 0; };
  S.xpToday = function () { return S.xpOn(U.dayKey()); };
  S.goalProgress = function () { return U.clamp(S.xpToday() / Math.max(1, S.state.profile.dailyGoal), 0, 1); };
  S.streak = function () {
    const days = S.state.stats.days;
    let key = U.dayKey();
    if (!(days[key] > 0)) {
      key = U.addDays(key, -1);
      if (!(days[key] > 0)) return 0;
    }
    let n = 0;
    while (days[key] > 0 && n < 4000) { n++; key = U.addDays(key, -1); }
    return n;
  };
  S.activeDays = function () {
    const days = S.state.stats.days;
    return Object.keys(days).filter(function (k) { return days[k] > 0; }).length;
  };
  S.accuracy = function () {
    const st = S.state.stats;
    return st.answers ? st.correct / st.answers : 0;
  };

  // ---- Seiten-Lebenszyklus ----
  window.addEventListener('pagehide', function () { S.flush(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) S.flush(); });
})();
