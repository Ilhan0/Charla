/* Charla – Übungsgenerator: baut aus Lektionen und Wiederholungen die Abfolge der Aufgaben */
(function () {
  'use strict';
  const C = (window.Charla = window.Charla || {});
  const tr = C.i18n.t;
  const U = C.util;
  const T = C.text;
  const K = C.content;
  const R = C.srs;
  const E = (C.engine = {});

  const STOP = new Set(['que', 'de', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'en', 'a', 'me', 'te', 'se',
    'es', 'no', 'por', 'con', 'mi', 'tu', 'su', 'al', 'del', 'lo', 'le', 'yo', 'tu', 'el', 'son', 'hay', 'muy']);

  function lcfirst(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
  function tileText(tok) { return K.proper.has(tok) ? tok : lcfirst(tok); }
  function lenOK(a, b) { return Math.abs(a.length - b.length) <= Math.max(5, b.length * 0.6); }
  function isPic(it) { return !!it.emoji && it.emojiPic; }

  /** Falsche Antworten, die zum richtigen Wort passen (gleiche Art, ähnliche Länge) */
  E.distractors = function (item, field, n) {
    const lesson = K.lessonById[item.lessonId];
    const correct = item[field];
    const sameUnit = [];
    lesson.unit.lessons.forEach(function (l) { if (l !== lesson) l.items.forEach(function (i) { sameUnit.push(i); }); });
    const pool = []
      .concat(U.shuffle(lesson.items))
      .concat(U.shuffle(sameUnit))
      .concat(U.shuffle(K.allItems.filter(function (i) { return i.unitId !== item.unitId; })));
    const out = [];
    const seen = new Set([T.fold(correct)]);
    function take(strict) {
      for (let i = 0; i < pool.length && out.length < n; i++) {
        const c = pool[i];
        if (c.id === item.id) continue;
        const txt = c[field];
        const key = T.fold(txt);
        if (seen.has(key)) continue;
        if (T.fold(c.es) === T.fold(item.es) || T.fold(c.de) === T.fold(item.de)) continue;
        if (strict && (c.kind !== item.kind || !lenOK(txt, correct))) continue;
        seen.add(key);
        out.push(txt);
      }
    }
    take(true);
    take(false);
    return out;
  };

  // ---------- einzelne Aufgaben ----------
  E.intro = function (item) {
    return { type: 'intro', itemId: item.id, prompt: tr('Neu'), es: item.es, de: item.de, emoji: item.emoji, exEs: item.exEs, exDe: item.exDe };
  };

  E.mc = function (item, dir) {
    dir = dir || 'es-de';
    if (dir === 'es-de') {
      const answer = item.de;
      return { type: 'mc', dir: dir, itemId: item.id, prompt: tr('Was bedeutet das?'), es: item.es, de: item.de, emoji: item.emoji,
        options: U.shuffle([answer].concat(E.distractors(item, 'de', 3))), answer: answer, say: item.es, autoSay: true };
    }
    return { type: 'mc', dir: dir, itemId: item.id, prompt: tr('Wie sagt man das auf Spanisch?'), es: item.es, de: item.de, emoji: item.emoji,
      options: U.shuffle([item.es].concat(E.distractors(item, 'es', 3))), answer: item.es, say: item.es };
  };

  E.pic = function (item) {
    if (!isPic(item)) return null;
    const cands = K.allItems.filter(function (i) { return isPic(i) && i.emoji !== item.emoji && i.id !== item.id; });
    const same = U.shuffle(cands.filter(function (i) { return i.lessonId === item.lessonId; }));
    const rest = U.shuffle(cands.filter(function (i) { return i.lessonId !== item.lessonId; }));
    const picks = U.uniqBy(same.concat(rest), function (i) { return i.emoji; }).slice(0, 3);
    if (picks.length < 3) return null;
    return { type: 'pic', itemId: item.id, prompt: tr('Welches Bild passt?'), es: item.es, de: item.de,
      options: U.shuffle([item.emoji].concat(picks.map(function (p) { return p.emoji; }))), answer: item.emoji, say: item.es, autoSay: true };
  };

  E.listen = function (item, mode) {
    mode = mode || (Math.random() < 0.5 ? 'es' : 'de');
    const field = mode === 'es' ? 'es' : 'de';
    return { type: 'listen', mode: mode, itemId: item.id, prompt: mode === 'es' ? tr('Was hörst du?') : tr('Was bedeutet das?'),
      audio: item.es, es: item.es, de: item.de, emoji: item.emoji,
      options: U.shuffle([item[field]].concat(E.distractors(item, field, 3))), answer: item[field] };
  };

  E.match = function (items) {
    return { type: 'match', prompt: tr('Ordne die Paare zu'),
      pairs: items.slice(0, 5).map(function (i) { return { id: i.id, es: i.es, de: i.de }; }) };
  };

  E.type = function (item) {
    return { type: 'type', itemId: item.id, prompt: tr('Übersetze ins Spanische'), de: item.de, emoji: item.emoji,
      answer: item.es, alts: item.alt || [], say: item.es };
  };

  E.dictation = function (item) {
    return { type: 'dictation', itemId: item.id, prompt: tr('Schreibe, was du hörst'), audio: item.es, de: item.de,
      answer: item.es, alts: item.alt || [], say: null };
  };

  E.order = function (src, lesson) {
    const toks = T.tokens(src.es);
    if (toks.length < 2 || toks.length > 9) return null;
    const tiles = toks.map(function (t, i) { return { id: 't' + i, text: tileText(t) }; });
    const extra = [];
    if (toks.length >= 4) {
      const have = new Set(toks.map(function (t) { return T.fold(t); }));
      const pool = [];
      K.sentences(lesson).forEach(function (s) {
        if (s.es !== src.es) T.tokens(s.es).forEach(function (t) { pool.push(t); });
      });
      U.shuffle(pool).forEach(function (t) {
        const f = T.fold(t);
        if (extra.length < 2 && f.length > 1 && !have.has(f)) {
          have.add(f);
          extra.push({ id: 'x' + extra.length, text: tileText(t) });
        }
      });
    }
    let shuffled = U.shuffle(tiles.concat(extra));
    for (let k = 0; k < 6; k++) {
      const same = shuffled.slice(0, tiles.length).every(function (t, i) { return extra.length ? false : t.id === tiles[i].id; });
      if (!same) break;
      shuffled = U.shuffle(shuffled);
    }
    return { type: 'order', itemId: src.itemId, prompt: tr('Bilde den Satz auf Spanisch'), de: src.de, es: src.es,
      tiles: shuffled, expected: T.normalize(src.es), say: src.es };
  };

  E.gap = function (src, lesson) {
    const parts = src.es.trim().split(/\s+/);
    const lessonWords = new Set();
    lesson.items.forEach(function (it) { T.tokens(it.es).forEach(function (t) { lessonWords.add(T.fold(t)); }); });
    const cands = [];
    parts.forEach(function (p, i) {
      const m = /^([¿¡"“«(]*)(.*?)([?!.,;:"”»)…]*)$/.exec(p);
      const core = m[2];
      const f = T.fold(core);
      if (core.length < 3 || STOP.has(f) || K.proper.has(core) || /\d/.test(core)) return;
      let score = Math.random();
      if (lessonWords.has(f)) score += 2;
      if (core.length >= 5) score += 1;
      cands.push({ i: i, lead: m[1], core: core, trail: m[3], score: score });
    });
    if (!cands.length) return null;
    cands.sort(function (a, b) { return b.score - a.score; });
    const c = cands[0];
    const answer = K.proper.has(c.core) ? c.core : lcfirst(c.core);

    const inSentence = new Set(parts.map(function (p) { return T.fold(p); }));
    const seen = new Set([T.fold(answer)]);
    const wrong = [];
    function offer(tok) {
      const f = T.fold(tok);
      if (wrong.length >= 3 || f.length < 3 || seen.has(f) || STOP.has(f) || K.proper.has(tok) || /\d/.test(tok) || inSentence.has(f)) return;
      seen.add(f);
      wrong.push(lcfirst(tok));
    }
    const pool = [];
    lesson.items.forEach(function (it) { T.tokens(it.es).forEach(function (t) { pool.push(t); }); });
    K.sentences(lesson).forEach(function (s) { T.tokens(s.es).forEach(function (t) { pool.push(t); }); });
    U.shuffle(pool).forEach(offer);
    if (wrong.length < 3) {
      const unitWords = [];
      lesson.unit.lessons.forEach(function (l) { l.items.forEach(function (it) { T.tokens(it.es).forEach(function (t) { unitWords.push(t); }); }); });
      U.shuffle(unitWords).forEach(offer);
    }
    if (wrong.length < 2) return null;

    const display = parts.map(function (p, i) { return i === c.i ? null : p; });
    return { type: 'gap', itemId: src.itemId, prompt: tr('Welches Wort fehlt?'), parts: display, blankIndex: c.i, lead: c.lead, trail: c.trail,
      es: src.es, de: src.de, options: U.shuffle([answer].concat(wrong)), answer: answer, say: src.es };
  };

  E.speak = function (src) {
    return { type: 'speak', itemId: src.itemId, prompt: tr('Sprich nach'), es: src.es, de: src.de };
  };

  E.dialogue = function (lesson) {
    return { type: 'dialogue', lessonId: lesson.id, prompt: tr('Dialog'), title: lesson.dialogue.title, lines: lesson.dialogue.lines };
  };

  E.reply = function (lesson, usedIdx) {
    const d = lesson.dialogue;
    if (!d || d.lines.length < 3) return null;
    const idxs = [];
    d.lines.forEach(function (ln, j) {
      const n = T.wordCount(ln.es);
      if (j >= 1 && n >= 2 && n <= 9 && (!usedIdx || usedIdx.indexOf(j) < 0)) idxs.push(j);
    });
    if (!idxs.length) return null;
    const j = U.pick(idxs);
    const ans = d.lines[j];
    const own = d.lines.filter(function (ln, k) { return k !== j && T.fold(ln.es) !== T.fold(ans.es); });
    const others = [];
    lesson.unit.lessons.forEach(function (l) {
      if (l !== lesson && l.dialogue) l.dialogue.lines.forEach(function (ln) { others.push(ln); });
    });
    const wrong = [];
    const seen = new Set([T.fold(ans.es)]);
    U.shuffle(others).concat(U.shuffle(own)).forEach(function (ln) {
      const f = T.fold(ln.es);
      if (wrong.length < 3 && !seen.has(f) && T.wordCount(ln.es) <= 10) { seen.add(f); wrong.push(ln.es); }
    });
    if (wrong.length < 2) return null;
    return { type: 'reply', prompt: tr('Was passt als Antwort?'), lineIndex: j, context: d.lines.slice(Math.max(0, j - 2), j),
      answerLine: ans, options: U.shuffle([ans.es].concat(wrong)), answer: ans.es, say: ans.es };
  };

  E.tip = function (lesson) {
    return { type: 'tip', prompt: tr('Gut zu wissen'), title: lesson.tip.title, text: lesson.tip.text };
  };

  // ---------- Abläufe ----------
  function chunk(arr) {
    const n = arr.length;
    const groups = n <= 5 ? 1 : n <= 9 ? 2 : 3;
    const size = Math.ceil(n / groups);
    const out = [];
    for (let i = 0; i < n; i += size) out.push(arr.slice(i, i + size));
    return out;
  }

  function interleave(lists) {
    const out = [];
    let left = true;
    while (left) {
      left = false;
      lists.forEach(function (l) { if (l.length) { out.push(l.shift()); left = true; } });
    }
    return out;
  }

  function compact(list) { return list.filter(Boolean); }

  /** Ablauf einer Lektion: neue Wörter → Dialog → Anwenden */
  E.buildLesson = function (lesson) {
    const steps = [];
    const items = lesson.items;
    chunk(items).forEach(function (g, gi) {
      g.forEach(function (it) { steps.push(E.intro(it)); });
      U.shuffle(g).forEach(function (it) { steps.push(E.mc(it, 'es-de')); });
      const pics = compact(U.shuffle(g).filter(isPic).slice(0, 1).map(E.pic));
      pics.forEach(function (p) { steps.push(p); });
      U.sample(g, g.length >= 5 ? 2 : 1).forEach(function (it) { steps.push(E.listen(it)); });
      if (g.length >= 3) steps.push(E.match(g));
      if (gi === 0 && lesson.tip) steps.push(E.tip(lesson));
    });

    if (lesson.dialogue) {
      steps.push(E.dialogue(lesson));
      const used = [];
      for (let k = 0; k < 2; k++) {
        const r = E.reply(lesson, used);
        if (r) { used.push(r.lineIndex); steps.push(r); }
      }
    }

    let sentences = K.sentences(lesson, 3);
    if (sentences.length < 3) sentences = K.sentences(lesson, 2);
    const typeList = U.sample(items, Math.min(3, items.length)).map(E.type);
    const orderList = compact(U.sample(sentences, Math.min(3, sentences.length)).map(function (s) { return E.order(s, lesson); })).slice(0, 2);
    const gapList = compact(U.sample(sentences, Math.min(4, sentences.length)).map(function (s) { return E.gap(s, lesson); })).slice(0, 2);
    const dictList = U.sample(items, Math.min(1, items.length)).map(E.dictation);
    const multi = items.filter(function (i) { return T.wordCount(i.es) >= 2; });
    const speakSrc = multi.length >= 2 ? multi : sentences.length ? sentences : items;
    const speakList = U.sample(speakSrc, 2).map(function (s) { return E.speak({ es: s.es, de: s.de, itemId: s.itemId || s.id || null }); });
    return steps.concat(interleave([typeList, orderList, gapList, dictList, speakList]));
  };

  /** Ablauf einer Wiederholung: je Wort eine Aufgabe passend zur Box */
  E.buildReview = function (ids) {
    return compact(ids.map(function (id) {
      const item = K.items[id];
      if (!item) return null;
      const lesson = K.lessonById[item.lessonId];
      const stage = R.stageFor(id);
      let ex = null;
      if (stage === 'recognize') ex = Math.random() < 0.4 && isPic(item) ? E.pic(item) : E.mc(item, 'es-de');
      else if (stage === 'listen') ex = E.listen(item);
      else if (stage === 'produce-choice' || stage === 'type') {
        if (item.kind === 'sentence' && Math.random() < 0.5) ex = E.order({ es: item.es, de: item.de, itemId: item.id }, lesson);
        if (!ex) ex = stage === 'type' ? E.type(item) : E.mc(item, 'de-es');
      } else if (stage === 'dictation') ex = E.dictation(item);
      if (!ex) ex = E.mc(item, 'es-de');
      ex.review = true;
      return ex;
    }));
  };

  /** Für den erneuten Versuch: gleiche Aufgabe, Reihenfolge der Antworten neu gemischt */
  E.retryOf = function (ex) {
    const c = Object.assign({}, ex, { retry: true });
    if (c.options) c.options = U.shuffle(c.options);
    if (c.tiles) c.tiles = U.shuffle(c.tiles);
    return c;
  };
})();
