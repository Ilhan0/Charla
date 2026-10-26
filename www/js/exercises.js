/* Charla – Übungstypen (Darstellung und Bedienung)
 *
 * Jede Funktion bekommt (ex, ctx) und gibt {el, mode, footerLabel?, check?, mount?, destroy?} zurück.
 *   mode 'immediate' → Antwort per Tipp, danach sofort Rückmeldung
 *   mode 'check'     → Knopf „Prüfen“ (ctx.setReady schaltet ihn frei), check() wertet aus
 *   mode 'continue'  → reine Anzeige, Knopf „Weiter“
 * ctx.finish({correct, kind, solution, detail, note, say, title, graded, itemResults, noRetry, xp})
 */
(function () {
  'use strict';
  const C = (window.Charla = window.Charla || {});
  const tr = C.i18n.t;
  const U = C.util;
  const h = U.h;
  const T = C.text;
  const ui = C.ui;
  const A = C.audio;
  const X = (C.ex = {});
  const R = {};

  X.render = function (ex, ctx) {
    const fn = R[ex.type];
    if (!fn) throw new Error('Unbekannter Aufgabentyp: ' + ex.type);
    const inst = fn(ex, ctx);
    inst.el.classList.add('ex', 'ex-' + ex.type);
    return inst;
  };

  function label(text) { return h('div.q-label', text); }
  function emoji(e) { return e ? h('div.q-emoji', e) : null; }

  // ---------- Neues Wort ----------
  R.intro = function (ex, ctx) {
    const el = h('div',
      h('div.badge-new', tr('Neues Wort')),
      emoji(ex.emoji),
      h('div.q-es', { lang: 'es' }, ex.es),
      h('div.q-de', ex.de),
      h('div.q-say', ui.speakBtn(ex.es, { big: true }), ui.speakBtn(ex.es, { slow: true, big: true })),
      ex.exEs ? h('div.example',
        h('div.ex-es', { lang: 'es' }, ex.exEs, ui.speakBtn(ex.exEs, { size: 18 })),
        h('div.ex-de', ex.exDe)) : null);
    return {
      el: el, mode: 'continue', footerLabel: tr('Weiter'),
      mount: function () { if (ctx.autoplay) ctx.say(ex.es); }
    };
  };

  // ---------- Auswahl-Aufgaben ----------
  function choice(ex, ctx, cfg) {
    const list = h('div.opts' + (cfg.grid ? '.grid' : ''));
    const entries = [];
    let locked = false;

    function pick(opt, btn) {
      if (locked) return;
      locked = true;
      const ok = opt === ex.answer;
      btn.classList.add(ok ? 'right' : 'wrong');
      entries.forEach(function (en) {
        if (en.opt === ex.answer) en.btn.classList.add('right');
        else if (en.btn !== btn) en.btn.classList.add('dim');
      });
      if (cfg.onPick) cfg.onPick(ok, opt);
      ctx.finish(Object.assign({ correct: ok, kind: ok ? 'ok' : 'bad', chosen: opt }, cfg.result(ok, opt)));
    }

    ex.options.forEach(function (opt) {
      const btn = h('button.opt', { type: 'button', onclick: function () { pick(opt, btn); } }, cfg.node(opt));
      entries.push({ opt: opt, btn: btn });
      list.appendChild(btn);
    });

    return {
      el: h('div', cfg.head, list), mode: 'immediate',
      mount: function () { if (cfg.autoSay && (cfg.force || ctx.autoplay)) ctx.say(cfg.autoSay); }
    };
  }

  R.mc = function (ex, ctx) {
    const es2de = ex.dir === 'es-de';
    const head = es2de
      ? [label(ex.prompt), emoji(ex.emoji), h('div.q-es.row', { lang: 'es' }, ex.es, ui.speakBtn(ex.es))]
      : [label(ex.prompt), emoji(ex.emoji), h('div.q-de', ex.de)];
    return choice(ex, ctx, {
      head: head,
      node: function (o) { return h('span', es2de ? {} : { lang: 'es' }, o); },
      autoSay: es2de ? ex.es : null,
      result: function () { return { solution: ex.es, detail: ex.de, say: es2de ? null : ex.es }; }
    });
  };

  R.pic = function (ex, ctx) {
    return choice(ex, ctx, {
      grid: true,
      head: [label(ex.prompt), h('div.q-es.row', { lang: 'es' }, ex.es, ui.speakBtn(ex.es))],
      node: function (o) { return h('span.pic', o); },
      autoSay: ex.es,
      result: function () { return { solution: ex.es + ' ' + ex.answer, detail: ex.de }; }
    });
  };

  R.listen = function (ex, ctx) {
    const es = ex.mode === 'es';
    return choice(ex, ctx, {
      force: true,
      head: [label(ex.prompt),
        h('div.q-say', ui.speakBtn(ex.audio, { big: true }), ui.speakBtn(ex.audio, { slow: true, big: true }))],
      node: function (o) { return h('span', es ? { lang: 'es' } : {}, o); },
      autoSay: ex.audio,
      result: function () { return { solution: ex.es, detail: ex.de }; }
    });
  };

  R.reply = function (ex, ctx) {
    const thread = h('div.thread');
    ex.context.forEach(function (ln) {
      thread.appendChild(bubble(ln, { side: ln.side, showDe: true }));
    });
    const blank = h('div.bubble.side' + ex.answerLine.side + '.blank', h('div.who', ex.answerLine.who), h('div.b-es', '…'));
    thread.appendChild(blank);
    return choice(ex, ctx, {
      head: [label(ex.prompt), thread],
      node: function (o) { return h('span', { lang: 'es' }, o); },
      onPick: function (ok) {
        blank.classList.remove('blank');
        blank.classList.add(ok ? 'right' : 'wrong');
        blank.querySelector('.b-es').textContent = ex.answerLine.es;
      },
      result: function () { return { solution: ex.answerLine.es, detail: ex.answerLine.de, say: ex.answerLine.es }; }
    });
  };

  R.gap = function (ex, ctx) {
    const slot = h('span.slot', ' ');
    const line = h('div.gap-line', { lang: 'es' });
    ex.parts.forEach(function (p, i) {
      if (i === ex.blankIndex) line.appendChild(h('span.gap-word', ex.lead, slot, ex.trail));
      else line.appendChild(h('span.gap-word', p));
    });
    return choice(ex, ctx, {
      head: [label(ex.prompt), h('div.gap-card', line, h('div.q-de.small', ex.de))],
      node: function (o) { return h('span', { lang: 'es' }, o); },
      onPick: function (ok) {
        slot.textContent = ex.answer;
        slot.classList.add(ok ? 'right' : 'wrong');
      },
      result: function () { return { solution: ex.es, detail: ex.de, say: ex.es }; }
    });
  };

  // ---------- Tippen ----------
  const KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'];

  function typedExercise(ex, ctx, head) {
    const input = h('input.field', {
      type: 'text', lang: 'es', autocapitalize: 'none', autocorrect: 'off', spellcheck: 'false',
      autocomplete: 'off', enterkeyhint: 'done', placeholder: tr('Auf Spanisch schreiben …'), 'aria-label': tr('Antwort')
    });
    input.addEventListener('input', function () { ctx.setReady(input.value.trim().length > 0); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); ctx.requestCheck(); }
    });
    const keys = h('div.keys');
    KEYS.forEach(function (k) {
      keys.appendChild(h('button.key', {
        type: 'button',
        onpointerdown: function (e) { e.preventDefault(); },
        onclick: function () {
          const s = input.selectionStart == null ? input.value.length : input.selectionStart;
          const e2 = input.selectionEnd == null ? s : input.selectionEnd;
          input.setRangeText(k, s, e2, 'end');
          input.dispatchEvent(new Event('input'));
          input.focus();
        }
      }, k));
    });
    return {
      el: h('div', head, input, keys), mode: 'check', footerLabel: tr('Prüfen'),
      mount: function () { setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); } }, 120); },
      check: function () {
        const v = input.value;
        const cmp = T.compare(v, ex.answer, ex.alts);
        input.disabled = true;
        input.classList.add(cmp.ok ? 'right' : 'wrong');
        const res = { correct: cmp.ok, kind: cmp.kind, solution: ex.answer, detail: ex.de, say: ex.say === null ? ex.answer : ex.say || ex.answer };
        if (cmp.kind === 'almost' && cmp.reason === 'accent') res.note = tr('Achte auf die Akzente.');
        if (cmp.kind === 'almost' && cmp.reason === 'typo') res.note = tr('Kleiner Tippfehler.');
        if (!cmp.ok && v.trim()) res.note = tr('Deine Antwort: {a}', { a: v.trim() });
        if (cmp.match && cmp.match !== ex.answer) res.solution = cmp.match;
        ctx.finish(res);
      }
    };
  }

  R.type = function (ex, ctx) {
    return typedExercise(ex, ctx, [label(ex.prompt), emoji(ex.emoji), h('div.q-de', ex.de)]);
  };

  R.dictation = function (ex, ctx) {
    const inst = typedExercise(ex, ctx, [label(ex.prompt),
      h('div.q-say', ui.speakBtn(ex.audio, { big: true }), ui.speakBtn(ex.audio, { slow: true, big: true }))]);
    const mount = inst.mount;
    inst.mount = function () { ctx.say(ex.audio); mount(); };
    return inst;
  };

  // ---------- Satz bauen ----------
  R.order = function (ex, ctx) {
    const byId = {};
    ex.tiles.forEach(function (t) { byId[t.id] = t; });
    const placed = [];
    const slots = h('div.slots');
    const bank = h('div.bank');
    const bankBtns = {};
    let locked = false;

    function draw() {
      U.clear(slots);
      placed.forEach(function (id) {
        slots.appendChild(h('button.tile.placed', { type: 'button', lang: 'es', onclick: function () { remove(id); } }, byId[id].text));
      });
      Object.keys(bankBtns).forEach(function (id) { bankBtns[id].classList.toggle('used', placed.indexOf(id) >= 0); });
      ctx.setReady(placed.length > 0);
    }
    function add(id) { if (locked || placed.indexOf(id) >= 0) return; placed.push(id); A.sfx('tap'); draw(); }
    function remove(id) { if (locked) return; placed.splice(placed.indexOf(id), 1); draw(); }

    ex.tiles.forEach(function (t) {
      const b = h('button.tile', { type: 'button', lang: 'es', onclick: function () { add(t.id); } }, t.text);
      bankBtns[t.id] = b;
      bank.appendChild(b);
    });

    return {
      el: h('div', label(ex.prompt), h('div.q-de', ex.de), slots, bank),
      mode: 'check', footerLabel: tr('Prüfen'),
      mount: draw,
      check: function () {
        locked = true;
        const given = T.normalize(placed.map(function (id) { return byId[id].text; }).join(' '));
        const ok = given === ex.expected;
        slots.classList.add(ok ? 'right' : 'wrong');
        ctx.finish({ correct: ok, kind: ok ? 'ok' : 'bad', solution: ex.es, detail: ex.de, say: ex.es,
          note: ok ? '' : tr('Deine Antwort: {a}', { a: placed.map(function (id) { return byId[id].text; }).join(' ') }) });
      }
    };
  };

  // ---------- Paare zuordnen ----------
  R.match = function (ex, ctx) {
    const left = U.shuffle(ex.pairs);
    const right = U.shuffle(ex.pairs);
    const wrongIds = new Set();
    let selL = null, selR = null, matched = 0, mistakes = 0, busy = false;
    const colL = h('div.mcol');
    const colR = h('div.mcol');

    function tile(p, side) {
      const b = h('button.mtile', { type: 'button', lang: side === 'l' ? 'es' : C.i18n.current, onclick: function () { click(p, side, b); } }, side === 'l' ? p.es : p.de);
      b._p = p;
      return b;
    }
    function click(p, side, b) {
      if (busy || b.classList.contains('done')) return;
      if (side === 'l') {
        if (selL) selL.b.classList.remove('sel');
        selL = { p: p, b: b };
        ctx.say(p.es);
      } else {
        if (selR) selR.b.classList.remove('sel');
        selR = { p: p, b: b };
      }
      b.classList.add('sel');
      if (selL && selR) resolve();
    }
    function resolve() {
      const l = selL, r = selR;
      selL = selR = null;
      if (l.p.id === r.p.id) {
        [l.b, r.b].forEach(function (b) { b.classList.remove('sel'); b.classList.add('done'); b.disabled = true; });
        A.sfx('ok');
        matched++;
        if (matched === ex.pairs.length) {
          const ok = mistakes === 0;
          const results = {};
          ex.pairs.forEach(function (p) { results[p.id] = !wrongIds.has(p.id); });
          setTimeout(function () {
            ctx.finish({ correct: ok, kind: ok ? 'ok' : 'almost', title: ok ? tr('Alle Paare gefunden!') : tr('Geschafft!'),
              solution: '', note: ok ? '' : U.plural(mistakes, 'Fehlversuch', 'Fehlversuche'), itemResults: results, noRetry: true, silent: true });
          }, 350);
        }
      } else {
        busy = true;
        mistakes++;
        wrongIds.add(l.p.id);
        wrongIds.add(r.p.id);
        [l.b, r.b].forEach(function (b) { b.classList.add('wrong'); });
        A.sfx('bad');
        A.haptic('error');
        setTimeout(function () {
          [l.b, r.b].forEach(function (b) { b.classList.remove('wrong', 'sel'); });
          busy = false;
        }, 520);
      }
    }
    left.forEach(function (p) { colL.appendChild(tile(p, 'l')); });
    right.forEach(function (p) { colR.appendChild(tile(p, 'r')); });
    return { el: h('div', label(ex.prompt), h('div.match', colL, colR)), mode: 'immediate' };
  };

  // ---------- Sprechen ----------
  R.speak = function (ex, ctx) {
    const canListen = A.canListen();
    let attempts = 0;
    let rec = null;
    let finished = false;
    const words = h('div.heard-words', { lang: 'es' }, ex.es);
    const status = h('div.status', canListen ? tr('Tippe auf das Mikrofon und sprich den Satz.') : tr('Sprich den Satz laut nach.'));
    const heard = h('div.heard');
    const mic = h('button.mic', { type: 'button', 'aria-label': tr('Aufnehmen'), onclick: toggle }, ui.icon('mic', 36));
    if (!canListen) mic.style.display = 'none';

    function showWords(sim) {
      U.clear(words);
      sim.words.forEach(function (w, i) {
        words.appendChild(h('span.hw' + (sim.matched[i] ? '.ok' : '.miss'), w));
        words.appendChild(document.createTextNode(' '));
      });
    }
    function toggle() {
      if (finished) return;
      if (rec) { rec.stop(); return; }
      start();
    }
    function start() {
      heard.textContent = '';
      mic.classList.add('rec');
      status.textContent = tr('Ich höre zu … tippe noch einmal zum Beenden.');
      let timer = null;
      rec = A.listen({ hint: ex.es, onPartial: function (t) { heard.textContent = t; } });
      timer = setTimeout(function () { if (rec) rec.stop(); }, 9000);
      rec.promise.then(function (res) {
        clearTimeout(timer); rec = null; mic.classList.remove('rec'); evaluate(res.text || '');
      }).catch(function (err) {
        clearTimeout(timer); rec = null; mic.classList.remove('rec'); fail(err);
      });
    }
    function evaluate(text) {
      if (finished) return;
      heard.textContent = text;
      if (!text.trim()) { status.textContent = tr('Ich habe nichts gehört – versuch es noch einmal.'); return; }
      attempts++;
      const sim = T.similarity(text, ex.es);
      showWords(sim);
      if (sim.score >= 0.75) {
        finished = true;
        ctx.finish({ correct: true, kind: 'ok', graded: false, xp: 3, title: tr('Gut gesprochen!'), solution: ex.es, detail: ex.de });
      } else if (attempts >= 2) {
        status.textContent = tr('Das üben wir später noch einmal. Hör dir den Satz an und geh weiter.');
        ctx.setFooterLabel(tr('Weiter'));
      } else {
        status.textContent = tr('Fast! Grün war gut, rot noch einmal üben. Versuch es noch einmal.');
      }
    }
    function fail(err) {
      const code = err && err.message;
      if (code === 'not-allowed' || code === 'not-authorized' || code === 'service-not-allowed') {
        status.textContent = tr('Kein Zugriff auf Mikrofon oder Spracherkennung. Du kannst das in den iOS-Einstellungen erlauben.');
      } else if (code === 'no-speech') {
        status.textContent = tr('Ich habe nichts gehört – versuch es noch einmal.');
        return;
      } else {
        status.textContent = tr('Die Spracherkennung ist gerade nicht verfügbar. Sprich den Satz einfach laut nach.');
      }
      mic.style.display = 'none';
      ctx.setFooterLabel(tr('Ich habe es gesprochen'));
    }

    return {
      el: h('div', label(ex.prompt),
        h('div.q-es.row', { lang: 'es' }, words, ui.speakBtn(ex.es)),
        h('div.q-de.small', ex.de),
        h('div.mic-box', mic, status, heard)),
      mode: 'continue', footerLabel: canListen ? tr('Überspringen') : tr('Ich habe es gesprochen'), footerGhost: canListen,
      mount: function () { if (ctx.autoplay) ctx.say(ex.es); },
      destroy: function () { if (rec) { try { rec.stop(); } catch (e) { /* ignorieren */ } } }
    };
  };

  // ---------- Dialog ----------
  function bubble(line, o) {
    o = o || {};
    const b = h('div.bubble.side' + line.side,
      h('div.who', line.who),
      h('div.b-es', { lang: 'es' }, line.es),
      o.showDe === false ? null : h('div.b-de', line.de));
    return b;
  }

  function pickVoices(list) {
    const es = (list || []).filter(function (v) { return /^es[-_]ES/i.test(v.lang); });
    const pool = es.length >= 2 ? es : (list || []);
    pool.sort(function (a, b) { return (b.quality || 0) - (a.quality || 0); });
    if (pool.length >= 2) return [{ voice: pool[0].id, pitch: 1 }, { voice: pool[1].id, pitch: 1 }];
    return [{ voice: '', pitch: 1 }, { voice: '', pitch: 1.22 }];
  }

  R.dialogue = function (ex, ctx) {
    let token = 0;
    let voices = [{ voice: '', pitch: 1 }, { voice: '', pitch: 1.22 }];
    A.voices().then(function (l) { voices = pickVoices(l); });
    const thread = h('div.thread.full');
    const nodes = ex.lines.map(function (ln, i) {
      const b = bubble(ln, { showDe: true });
      b.addEventListener('click', function () {
        token++;
        const v = voices[ln.side];
        highlight(i);
        A.speak(ln.es, { voice: v.voice, pitch: v.pitch }).then(function () { highlight(-1); });
      });
      thread.appendChild(b);
      return b;
    });
    function highlight(i) { nodes.forEach(function (n, k) { n.classList.toggle('now', k === i); }); }

    const playBtn = h('button.btn.soft', { type: 'button', onclick: function () { toggle(); } }, ui.icon('play', 18), tr('Alles abspielen'));
    const trBtn = h('button.btn.ghost.small', { type: 'button', onclick: function () {
      thread.classList.toggle('hide-de');
      trBtn.textContent = thread.classList.contains('hide-de') ? tr('Übersetzung zeigen') : tr('Übersetzung verbergen');
    } }, tr('Übersetzung verbergen'));

    function toggle() {
      if (playBtn.classList.contains('active')) { token++; A.stop(); highlight(-1); setPlaying(false); return; }
      playAll();
    }
    function setPlaying(on) {
      playBtn.classList.toggle('active', on);
      U.clear(playBtn);
      playBtn.appendChild(ui.icon(on ? 'stop' : 'play', 18));
      playBtn.appendChild(document.createTextNode(on ? tr('Stopp') : tr('Alles abspielen')));
    }
    async function playAll() {
      const my = ++token;
      setPlaying(true);
      for (let i = 0; i < ex.lines.length; i++) {
        if (my !== token) return;
        highlight(i);
        const v = voices[ex.lines[i].side];
        await A.speak(ex.lines[i].es, { voice: v.voice, pitch: v.pitch });
        if (my !== token) return;
        await U.sleep(280);
      }
      if (my === token) { highlight(-1); setPlaying(false); }
    }

    return {
      el: h('div', label(tr('Dialog')), h('div.dlg-title', ex.title),
        h('div.dlg-tools', playBtn, trBtn), thread),
      mode: 'continue', footerLabel: tr('Weiter'),
      mount: function () { setTimeout(function () { if (ctx.autoplay) playAll(); }, 250); },
      destroy: function () { token++; A.stop(); }
    };
  };

  // ---------- Tipp ----------
  R.tip = function (ex) {
    return {
      el: h('div', h('div.tip-card', h('div.tip-ico', '💡'), h('div.tip-title', ex.title), h('div.tip-text', ui.paras(ex.text)))),
      mode: 'continue', footerLabel: tr('Verstanden')
    };
  };

  X.bubble = bubble;
})();
