/* Charla – Kursdaten: Registrierung und Aufbereitung
 *
 * Eine Einheit (Unit) wird in js/content/*.js so registriert:
 *
 *   Charla.addUnit({
 *     id: 'u1', title: '…', sub: '…', level: 'A1', emoji: '👋', color: '#0E7C86',
 *     lessons: [{
 *       title: '…', sub: '…', emoji: '👋',
 *       tip: ['Tipp-Titel', 'Text (\n\n = neuer Absatz)'],
 *       items: [ [spanisch, deutsch, emoji, beispielEs, beispielDe, [alternativ-Schreibweisen]], … ],
 *       dialogue: ['Titel', [[Sprecher, spanisch, deutsch], …]]
 *     }]
 *   });
 */
(function () {
  'use strict';
  const C = (window.Charla = window.Charla || {});
  const U = C.util;
  const T = C.text;

  const K = (C.content = {
    units: [], lessons: [], lessonById: {}, items: {}, allItems: [], proper: new Set(), built: false
  });

  const EXTRA_PROPER = ['Ana', 'Lucas', 'Sofía', 'Carlos', 'María', 'Pablo', 'Laura', 'Javier', 'Lucía', 'Alemania',
    'España', 'Austria', 'Suiza', 'México', 'Madrid', 'Barcelona', 'Berlín', 'Hamburgo', 'Múnich', 'Europa', 'Argentina',
    'Colombia', 'Francia', 'Italia', 'Inglaterra', 'Sevilla', 'Valencia', 'Viena', 'Zúrich', 'Colonia', 'Diego', 'Elena',
    'Miguel', 'Marta', 'Jorge', 'Paula', 'Álex', 'Tomás', 'Julia', 'Hugo', 'Alicia', 'Marcos', 'Luis', 'Sara'];

  C.addUnit = function (u) { K.units.push(u); };

  /** Setzt Titel, Übersetzungen, Tipps und Dialog-Übersetzungen auf die gewählte Sprache (Spanisch bleibt unverändert) */
  K.localize = function () {
    const I = C.i18n;
    const pack = I && I.current !== 'de' ? I.content[I.current] : null;
    if (!pack) return;
    K.units.forEach(function (u) {
      const ov = pack[u.id];
      if (!ov) return;
      if (ov.title) u.title = ov.title;
      if (ov.sub) u.sub = ov.sub;
      u.lessons.forEach(function (l, li) {
        const lo = (ov.lessons || [])[li];
        if (!lo) return;
        if (lo.title) l.title = lo.title;
        if (lo.sub) l.sub = lo.sub;
        if (lo.tip && l.tip) l.tip = lo.tip;
        if (lo.items) {
          l.items = l.items.map(function (raw, i) {
            const t = lo.items[i];
            if (!t) return raw;
            const c = raw.slice();
            c[1] = t[0];
            if (raw[3]) c[4] = t[1] || raw[4];
            return c;
          });
        }
        if (lo.dialogue && l.dialogue) {
          l.dialogue = [lo.dialogue[0], l.dialogue[1].map(function (r, i) {
            return [r[0], r[1], lo.dialogue[1][i] || r[2]];
          })];
        }
      });
    });
  };

  K.build = function () {
    if (K.built) return K;
    K.built = true;
    EXTRA_PROPER.forEach(function (p) { K.proper.add(p); });
    K.localize();

    K.units.forEach(function (u, ui) {
      u.index = ui;
      u.lessons.forEach(function (l, li) {
        l.unit = u;
        l.index = li;
        l.id = u.id + '-' + (li + 1);
        l.title = l.title || 'Lektion ' + (li + 1);
        const used = {};
        l.items = (l.items || []).map(function (raw, i) {
          let id = l.id + ':' + U.slug(raw[0]);
          if (used[id]) id += '-' + i;
          used[id] = true;
          let emoji = raw[2] || '';
          const pic = emoji.charAt(0) === '!'; // '!☕' = eindeutiges Bild, auch für Bildauswahl geeignet
          if (pic) emoji = emoji.slice(1);
          const it = {
            id: id, es: raw[0], de: raw[1], emoji: emoji, emojiPic: pic, exEs: raw[3] || '', exDe: raw[4] || '',
            alt: raw[5] || [], lessonId: l.id, unitId: u.id, lessonIndex: li
          };
          it.kind = T.wordCount(it.es) >= 3 ? 'sentence' : 'word';
          K.items[id] = it;
          K.allItems.push(it);
          return it;
        });
        if (l.dialogue) {
          const speakers = [];
          const lines = l.dialogue[1].map(function (r) {
            let side = speakers.indexOf(r[0]);
            if (side < 0) { speakers.push(r[0]); side = speakers.length - 1; }
            return { who: r[0], es: r[1], de: r[2], side: side % 2 };
          });
          l.dialogue = { title: l.dialogue[0], lines: lines };
        }
        if (l.tip) l.tip = { title: l.tip[0], text: l.tip[1] };
        K.lessons.push(l);
        K.lessonById[l.id] = l;
      });
    });

    // Eigennamen: großgeschriebene Wörter, die nicht am Satzanfang stehen
    function scan(es) {
      T.tokens(es).forEach(function (tok, i) {
        if (i > 0 && /^\p{Lu}/u.test(tok)) K.proper.add(tok);
      });
    }
    K.allItems.forEach(function (it) { scan(it.es); scan(it.exEs); });
    K.lessons.forEach(function (l) {
      if (l.dialogue) l.dialogue.lines.forEach(function (ln) { scan(ln.es); });
    });
    return K;
  };

  /** Sätze einer Lektion (für Satzbau-, Lücken- und Sprechübungen), mindestens `minWords` Wörter */
  K.sentences = function (lesson, minWords) {
    minWords = minWords || 3;
    const out = [];
    const seen = new Set();
    function add(es, de, itemId) {
      const k = T.fold(es || '');
      const n = T.wordCount(es || '');
      if (!es || !de || n < minWords || n > 9 || seen.has(k)) return;
      seen.add(k);
      out.push({ es: es, de: de, itemId: itemId || null });
    }
    lesson.items.forEach(function (it) { add(it.es, it.de, it.id); });
    lesson.items.forEach(function (it) { add(it.exEs, it.exDe, null); });
    if (lesson.dialogue) lesson.dialogue.lines.forEach(function (ln) { add(ln.es, ln.de, null); });
    return out;
  };

  K.nextLesson = function (state) {
    for (let i = 0; i < K.lessons.length; i++) {
      const l = K.lessons[i];
      if (!(state.lessons[l.id] && state.lessons[l.id].done)) return l;
    }
    return null;
  };

  K.unitProgress = function (unit, state) {
    const done = unit.lessons.filter(function (l) { return state.lessons[l.id] && state.lessons[l.id].done; }).length;
    return { done: done, total: unit.lessons.length };
  };
})();
