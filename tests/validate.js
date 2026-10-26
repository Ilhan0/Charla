// Prüft Kursinhalte und Übungsgenerator im Browser-Kontext (viele Durchläufe mit Zufall).
const path = require('path');
const { chromium } = require('playwright');
const URL = 'file://' + path.join(__dirname, '..', 'www', 'index.html');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(URL);
  await page.waitForFunction(() => window.Charla && Charla.content && Charla.content.built);
  const report = await page.evaluate(() => {
    const C = Charla, K = C.content, T = C.text, E = C.engine, U = C.util;
    const problems = [], info = {};
    const add = (m) => { if (problems.length < 200) problems.push(m); };

    // 1. Struktur
    K.lessons.forEach(l => {
      if (!l.items.length) add(l.id + ': keine Items');
      if (l.items.length < 8 || l.items.length > 13) add(l.id + ': ' + l.items.length + ' Items (empfohlen 8-13)');
      if (!l.dialogue) add(l.id + ': kein Dialog');
      if (!l.tip) add(l.id + ': kein Tipp');
      l.items.forEach(it => {
        if (!it.es || !it.de) add(it.id + ': es/de fehlt');
        if (/\s{2,}/.test(it.es + it.de)) add(it.id + ': doppelte Leerzeichen');
        if (it.exEs && !it.exDe || !it.exEs && it.exDe) add(it.id + ': Beispiel unvollständig');
        if (/[a-z]\.[A-Z]/.test(it.es)) add(it.id + ': Satzzeichen?');
      });
    });
    // 2. Doppelte Spanisch/Deutsch-Einträge
    const byEs = {}, byDe = {};
    K.allItems.forEach(it => {
      (byEs[T.fold(it.es)] = byEs[T.fold(it.es)] || []).push(it.id);
      (byDe[T.fold(it.de)] = byDe[T.fold(it.de)] || []).push(it.id);
    });
    Object.keys(byEs).forEach(k => { if (byEs[k].length > 1) add('doppelt (es): ' + k + ' -> ' + byEs[k].join(', ')); });
    Object.keys(byDe).forEach(k => { if (byDe[k].length > 1) add('doppelt (de): ' + k + ' -> ' + byDe[k].join(', ')); });

    // 3. Generator: viele Durchläufe
    let total = 0; const types = {};
    for (let run = 0; run < 25; run++) {
      K.lessons.forEach(l => {
        let steps;
        try { steps = E.buildLesson(l); } catch (e) { add(l.id + ': buildLesson Fehler ' + e.message); return; }
        total += steps.length;
        info[l.id] = steps.length;
        steps.forEach(ex => {
          types[ex.type] = (types[ex.type] || 0) + 1;
          if (ex.options) {
            const f = ex.options.map(o => ex.type === 'pic' ? o : T.fold(o));
            if (new Set(f).size !== f.length) add(l.id + ' ' + ex.type + ': doppelte Optionen ' + JSON.stringify(ex.options));
            if (ex.options.indexOf(ex.answer) < 0) add(l.id + ' ' + ex.type + ': Antwort fehlt in Optionen');
            if (ex.options.length < 3) add(l.id + ' ' + ex.type + ': nur ' + ex.options.length + ' Optionen');
          }
          if (ex.type === 'order') {
            const need = T.tokens(ex.es).map(t => T.normalize(t));
            const have = ex.tiles.map(t => T.normalize(t.text));
            need.forEach(n => { if (have.indexOf(n) < 0) add(l.id + ' order: Kachel fehlt ' + n + ' in ' + ex.es); });
          }
          if (ex.type === 'gap') {
            if (ex.options.indexOf(ex.answer) < 0) add(l.id + ' gap: Antwort fehlt');
            const sentence = ex.parts.map((p, i) => i === ex.blankIndex ? ex.lead + ex.answer + ex.trail : p).join(' ');
            if (T.normalize(sentence) !== T.normalize(ex.es)) add(l.id + ' gap: Satz stimmt nicht: ' + sentence + ' / ' + ex.es);
            // Mehrdeutigkeit: Ablenker, der im Satz ebenfalls passen würde, lässt sich nicht automatisch prüfen
          }
          if (ex.type === 'pic' && new Set(ex.options).size !== ex.options.length) add(l.id + ' pic: doppelte Emojis');
        });
      });
      // Wiederholung für alle Wörter in allen Stufen
      K.allItems.forEach(it => {
        [0, 1, 2, 3, 4, 5].forEach(box => {
          C.store.state.vocab[it.id] = { box: box, due: 0, ok: 0, bad: 0, fav: false, seen: 0 };
          let r;
          try { r = E.buildReview([it.id]); } catch (e) { add('review ' + it.id + ' box ' + box + ': ' + e.message); return; }
          if (r.length !== 1) add('review ' + it.id + ' box ' + box + ': ' + r.length + ' Aufgaben');
        });
      });
      C.store.state.vocab = {};
    }
    return { problems: problems, info: info, types: types, total: total, items: K.allItems.length, lessons: K.lessons.length };
  });
  console.log('Lektionen:', report.lessons, 'Wörter:', report.items, 'Aufgaben (25 Durchläufe):', report.total);
  console.log('Schritte je Lektion (letzter Durchlauf):', JSON.stringify(report.info));
  console.log('Typen:', JSON.stringify(report.types));
  const uniq = [...new Set(report.problems)];
  console.log('Probleme:', uniq.length ? '\n - ' + uniq.join('\n - ') : 'keine');
  if (errs.length) console.log('Seitenfehler:', errs);
  await browser.close();
  process.exit(uniq.length || errs.length ? 1 : 0);
})();
