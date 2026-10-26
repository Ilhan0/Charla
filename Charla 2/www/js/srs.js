/* Charla – Wiederholungssystem (Leitner-Boxen mit wachsenden Abständen) */
(function () {
  'use strict';
  const C = (window.Charla = window.Charla || {});
  const S = C.store;
  const R = (C.srs = {});

  const DAY = 24 * 3600 * 1000;
  /** Abstand bis zur nächsten Wiederholung je Box (0 = in 10 Minuten) */
  R.INTERVALS = [10 * 60 * 1000, 1 * DAY, 3 * DAY, 7 * DAY, 16 * DAY, 35 * DAY, 90 * DAY];
  R.MAX = R.INTERVALS.length - 1;
  R.LABELS = ['Neu', 'Frisch', 'Lernend', 'Bekannt', 'Gefestigt', 'Sicher', 'Meister'];

  R.get = function (id) { return S.state.vocab[id] || null; };

  R.isLearned = function (id) { return !!S.state.vocab[id]; };

  R.isDue = function (id, now) {
    const r = S.state.vocab[id];
    return !!r && r.due <= (now || Date.now());
  };

  R.dueIds = function (now) {
    now = now || Date.now();
    const v = S.state.vocab;
    return Object.keys(v).filter(function (id) { return v[id].due <= now; })
      .sort(function (a, b) { return v[a].due - v[b].due; });
  };

  R.dueCount = function () { return R.dueIds().length; };

  /** Fälligkeiten der nächsten Tage (heute inkl. überfällig, morgen, …) */
  R.forecast = function (days) {
    const out = [];
    const v = S.state.vocab;
    const ids = Object.keys(v);
    for (let d = 0; d < days; d++) {
      const start = new Date(); start.setHours(0, 0, 0, 0);
      const from = d === 0 ? -Infinity : start.getTime() + d * DAY;
      const to = start.getTime() + (d + 1) * DAY;
      out.push(ids.filter(function (id) { return v[id].due >= from && v[id].due < to; }).length);
    }
    return out;
  };

  function ensure(id) {
    if (!S.state.vocab[id]) {
      S.state.vocab[id] = { box: 0, due: Date.now(), seen: Date.now(), ok: 0, bad: 0, fav: false };
    }
    return S.state.vocab[id];
  }

  /**
   * Nach einer Lektion: acc = Trefferquote (0..1) für dieses Wort.
   * Neue Wörter landen in Box 1 (morgen) oder Box 0 (gleich noch einmal).
   */
  R.learn = function (id, acc, now) {
    now = now || Date.now();
    const isNew = !S.state.vocab[id];
    const r = ensure(id);
    if (isNew) {
      r.box = acc >= 0.75 ? 1 : 0;
      r.due = now + R.INTERVALS[r.box];
    } else if (r.due <= now) {
      R.review(id, acc >= 0.75, now);
    } else if (acc < 0.5) {
      r.box = Math.max(0, r.box - 1);
      r.due = Math.min(r.due, now + R.INTERVALS[r.box]);
    }
  };

  /** Ergebnis einer Abfrage – nur fällige Wörter steigen auf, falsche fallen immer zurück */
  R.review = function (id, ok, now) {
    now = now || Date.now();
    const r = ensure(id);
    if (ok) {
      r.ok++;
      if (r.due <= now) {
        r.box = Math.min(R.MAX, r.box + 1);
        r.due = now + R.INTERVALS[r.box];
      }
    } else {
      r.bad++;
      r.box = Math.max(0, r.box - 2);
      r.due = now + R.INTERVALS[0];
    }
  };

  R.toggleFav = function (id) {
    const r = ensure(id);
    r.fav = !r.fav;
    S.touch();
    return r.fav;
  };

  /** Welche Übung passt zur Box? (Erkennen → Hören → Schreiben → Sprechen) */
  R.stageFor = function (id) {
    const r = S.state.vocab[id];
    const box = r ? r.box : 0;
    if (box <= 0) return 'recognize';
    if (box === 1) return 'listen';
    if (box === 2) return 'produce-choice';
    if (box === 3) return 'type';
    if (box === 4) return 'dictation';
    return Math.random() < 0.5 ? 'type' : 'dictation';
  };
})();
