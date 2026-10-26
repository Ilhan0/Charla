/* Charla – Textvergleich: Akzente, Tippfehler, Wörter */
(function () {
  'use strict';
  const C = (window.Charla = window.Charla || {});
  const T = (C.text = {});

  /** klein, ohne Satzzeichen, einzelne Leerzeichen – Akzente bleiben erhalten */
  T.normalize = function (s) {
    return String(s == null ? '' : s)
      .normalize('NFC')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  /** á→a, é→e … aber ñ bleibt ñ (año ≠ ano) */
  T.stripAccents = function (s) {
    return String(s)
      .replace(/ñ/g, '\u0001').replace(/Ñ/g, '\u0002')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\u0001/g, 'ñ').replace(/\u0002/g, 'Ñ');
  };

  T.fold = function (s) { return T.stripAccents(T.normalize(s)); };

  T.lev = function (a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let prev = [];
    for (let j = 0; j <= b.length; j++) prev[j] = j;
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) {
        const cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      }
      prev = cur;
    }
    return prev[b.length];
  };

  /**
   * Vergleicht eine getippte Antwort mit der Lösung.
   * ok:true  kind 'ok'     → exakt (Groß-/Kleinschreibung und Satzzeichen egal)
   * ok:true  kind 'almost' → Akzent fehlt oder kleiner Tippfehler (mit Hinweis)
   * ok:false kind 'bad'
   */
  T.compare = function (user, expected, alts) {
    const cands = [expected].concat(alts || []);
    const u = T.normalize(user);
    if (!u) return { ok: false, kind: 'bad' };
    let i, c;
    for (i = 0; i < cands.length; i++) {
      if (u === T.normalize(cands[i])) return { ok: true, kind: 'ok', match: cands[i] };
    }
    const uf = T.stripAccents(u);
    for (i = 0; i < cands.length; i++) {
      if (uf === T.fold(cands[i])) return { ok: true, kind: 'almost', reason: 'accent', match: cands[i] };
    }
    for (i = 0; i < cands.length; i++) {
      c = T.fold(cands[i]);
      const lim = c.length >= 12 ? 2 : c.length >= 6 ? 1 : 0;
      if (lim && T.lev(uf, c) <= lim) return { ok: true, kind: 'almost', reason: 'typo', match: cands[i] };
    }
    return { ok: false, kind: 'bad' };
  };

  /** Wörter eines Satzes mit Originalschreibweise, ohne umgebende Satzzeichen */
  T.tokens = function (s) {
    return String(s).trim().split(/\s+/).map(function (t) {
      return t.replace(/^[¿¡"“„«(‘']+/, '').replace(/[?!.,;:"”»)…’']+$/, '');
    }).filter(Boolean);
  };

  T.wordCount = function (s) { return T.tokens(s).length; };

  /** Anteil der erwarteten Wörter, die in `heard` vorkommen (für Sprechübungen) */
  T.similarity = function (heard, expected) {
    const exp = T.fold(expected).split(' ').filter(Boolean);
    const got = T.fold(heard).split(' ').filter(Boolean);
    const used = got.map(function () { return false; });
    const matched = exp.map(function (w) {
      for (let i = 0; i < got.length; i++) {
        if (used[i]) continue;
        const lim = w.length >= 5 ? 1 : 0;
        if (got[i] === w || (lim && T.lev(got[i], w) <= lim)) { used[i] = true; return true; }
      }
      return false;
    });
    const hit = matched.filter(Boolean).length;
    return { score: exp.length ? hit / exp.length : 0, matched: matched, words: T.tokens(expected) };
  };
})();
