/* Charla – Lern-Sitzung: spielt eine Folge von Aufgaben ab, bewertet, wiederholt Fehler, zeigt Ergebnis */
(function () {
  'use strict';
  const C = (window.Charla = window.Charla || {});
  const tr = C.i18n.t;
  const U = C.util;
  const h = U.h;
  const S = C.store;
  const R = C.srs;
  const E = C.engine;
  const X = C.ex;
  const A = C.audio;
  const ui = C.ui;
  const Sess = (C.session = { run: null, inst: null, ex: null });

  const GRADED_TYPES = { mc: 1, pic: 1, listen: 1, match: 1, type: 1, dictation: 1, order: 1, gap: 1, reply: 1, speak: 1 };
  const CHEERS = [tr('Richtig!'), tr('Super!'), tr('Genau!'), tr('Perfekt!'), '¡Muy bien!', tr('Stark!'), '¡Bien hecho!'];
  const OOPS = [tr('Nicht ganz.'), tr('Leider falsch.'), tr('Schade!'), tr('Fast – merk es dir.')];

  function newRun(opts) {
    return {
      kind: opts.kind, title: opts.title, lesson: opts.lesson || null,
      queue: opts.steps.slice(), index: 0, total: opts.steps.length,
      first: { total: 0, correct: 0 }, itemStats: {}, reviewed: {}, xp: 0, startedAt: Date.now(),
      goalBefore: S.xpToday(), correctRun: 0
    };
  }

  Sess.startLesson = function (lesson) {
    const steps = E.buildLesson(lesson);
    if (!steps.length) return;
    open(newRun({ kind: 'lesson', title: lesson.title, lesson: lesson, steps: steps }));
  };

  Sess.startReview = function (ids, opts) {
    opts = opts || {};
    const steps = E.buildReview(ids);
    if (!steps.length) return;
    open(newRun({ kind: 'review', title: opts.title || tr('Wiederholen'), steps: steps }));
  };

  function open(run) {
    Sess.run = run;
    A.stop();
    const layer = document.getElementById('layer');
    const bar = h('div.pbar-fill');
    const closeBtn = h('button.icon-btn', { type: 'button', 'aria-label': tr('Beenden'), onclick: askClose }, ui.icon('close', 24));
    const header = h('div.s-head', closeBtn, h('div.pbar', bar));
    const stage = h('div.stage');
    const foot = h('div.foot');
    const overlay = h('div.session', header, stage, foot);
    layer.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('in'); });

    let inst = null;
    let done = false;
    let ready = false;
    let btn = null;
    let summary = false;

    function onKey(e) {
      if (e.key === 'Enter' && done && btn && !e.target.closest('input')) { e.preventDefault(); next(); }
    }
    document.addEventListener('keydown', onKey);

    function teardown() {
      document.removeEventListener('keydown', onKey);
      if (inst && inst.destroy) { try { inst.destroy(); } catch (e) { /* ignorieren */ } }
      A.stop();
      overlay.classList.remove('in');
      setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 220);
      Sess.run = null; Sess.inst = null; Sess.ex = null;
      S.touch();
    }

    function askClose() {
      if (summary) { teardown(); return; }
      ui.confirm({
        title: run.kind === 'lesson' ? tr('Lektion beenden?') : tr('Wiederholung beenden?'),
        text: run.kind === 'lesson'
          ? tr('Der Fortschritt dieser Lektion geht verloren. Gesammelte XP bleiben erhalten.')
          : tr('Bereits beantwortete Wörter sind gespeichert.'),
        ok: tr('Beenden'), cancel: tr('Weiterlernen'), danger: true
      }).then(function (yes) { if (yes) teardown(); });
    }

    function setProgress() {
      const frac = run.total ? run.index / run.total : 0;
      bar.style.width = Math.round(U.clamp(frac, 0, 1) * 100) + '%';
    }

    function showStep() {
      if (inst && inst.destroy) { try { inst.destroy(); } catch (e) { /* ignorieren */ } }
      inst = null; done = false; ready = false;
      if (run.index >= run.queue.length) { showSummary(); return; }
      const ex = run.queue[run.index];
      Sess.ex = ex;
      setProgress();
      U.clear(stage); U.clear(foot);
      stage.scrollTop = 0;
      foot.className = 'foot';

      const ctx = {
        autoplay: S.state.settings.autoplay,
        say: function (text, o) { return A.speak(text, o); },
        setReady: function (on) { ready = !!on; if (btn && inst && inst.mode === 'check' && !done) btn.disabled = !ready; },
        requestCheck: function () { if (inst && inst.mode === 'check' && ready && !done) inst.check(); },
        setFooterLabel: function (t) { if (btn && !done) btn.textContent = t; },
        finish: function (res) { handleResult(ex, res); }
      };

      try {
        inst = X.render(ex, ctx);
      } catch (e) {
        console.error(e);
        run.index++;
        showStep();
        return;
      }
      Sess.inst = inst;
      stage.appendChild(inst.el);
      stage.classList.remove('enter'); void stage.offsetWidth; stage.classList.add('enter');

      if (inst.mode === 'check') {
        btn = ui.btn(inst.footerLabel || tr('Prüfen'), { block: true, big: true, disabled: true, onclick: function () { if (ready && !done) inst.check(); } });
        foot.appendChild(btn);
      } else if (inst.mode === 'continue') {
        btn = ui.btn(inst.footerLabel || tr('Weiter'), {
          block: true, big: true, kind: inst.footerGhost ? 'ghost' : 'primary',
          onclick: function () { handleResult(ex, { kind: 'neutral', correct: null, graded: false, silent: true }); }
        });
        foot.appendChild(btn);
      } else {
        btn = null;
        foot.classList.add('idle');
      }
      if (inst.mount) setTimeout(function () { if (Sess.inst === inst) inst.mount(); }, 60);
    }

    function itemAttrib(ex, res) {
      if (res.itemResults) return res.itemResults;
      if (ex.itemId && res.correct !== null && res.correct !== undefined) {
        const o = {}; o[ex.itemId] = !!res.correct; return o;
      }
      return {};
    }

    function handleResult(ex, res) {
      if (done) return;
      done = true;
      const graded = !!GRADED_TYPES[ex.type] && res.graded !== false && res.kind !== 'neutral';
      const ok = res.correct === true;

      if (graded) {
        const attrib = itemAttrib(ex, res);
        const ids = Object.keys(attrib);
        const n = ids.length || 1;
        const nOk = ids.length ? ids.filter(function (id) { return attrib[id]; }).length : (ok ? 1 : 0);
        S.state.stats.answers += n;
        S.state.stats.correct += nOk;
        if (!ex.retry) { run.first.total += n; run.first.correct += nOk; }
        ids.forEach(function (id) {
          const st = run.itemStats[id] || (run.itemStats[id] = { ok: 0, bad: 0 });
          if (attrib[id]) st.ok++; else st.bad++;
          if (run.kind === 'review' && !run.reviewed[id] && !ex.retry) { run.reviewed[id] = true; R.review(id, attrib[id]); }
        });
        if (ok) run.correctRun++;
      }

      let xp = 0;
      if (typeof res.xp === 'number') xp = res.xp;
      else if (graded && ok) xp = ex.retry ? 1 : 2;
      if (xp) { S.addXp(xp); run.xp += xp; }

      if (graded && res.correct === false && !ex.retry && !res.noRetry) {
        run.queue.push(E.retryOf(ex));
        run.total++;
      }

      S.save();

      if (res.kind === 'neutral' || (res.silent && res.kind === 'neutral')) { next(); return; }
      showFeedback(ex, res, xp);
    }

    function showFeedback(ex, res, xp) {
      const kind = res.kind === 'ok' ? 'ok' : res.kind === 'almost' ? 'almost' : 'bad';
      A.sfx(kind);
      A.haptic(kind === 'bad' ? 'error' : 'success');
      const title = res.title || (kind === 'bad' ? U.pick(OOPS) : kind === 'almost' ? tr('Fast richtig!') : U.pick(CHEERS));
      const fb = h('div.feedback.' + kind,
        h('div.fb-head',
          h('div.fb-badge', ui.icon(kind === 'bad' ? 'cross' : 'check', 22)),
          h('div.fb-title', title),
          xp > 0 ? h('div.fb-xp', '+' + xp + ' XP') : null),
        res.solution ? h('div.fb-solution', { lang: 'es' },
          kind === 'bad' ? h('span.fb-label', tr('Richtig:') + ' ') : null, res.solution) : null,
        res.detail ? h('div.fb-detail', res.detail) : null,
        res.note ? h('div.fb-note', res.note) : null);
      btn = ui.btn(tr('Weiter'), { block: true, big: true, kind: kind === 'bad' ? 'danger' : 'primary', onclick: next });
      U.clear(foot);
      foot.className = 'foot has-fb ' + kind;
      foot.appendChild(fb);
      foot.appendChild(btn);
      if (res.say && !res.silent) setTimeout(function () { if (done && Sess.inst === inst) A.speak(res.say); }, 380);
    }

    function next() {
      if (!done) return;
      run.index++;
      showStep();
    }

    // ---------- Ergebnis ----------
    function showSummary() {
      summary = true;
      done = true;
      setProgress();
      bar.style.width = '100%';
      const seconds = Math.round((Date.now() - run.startedAt) / 1000);
      const acc = run.first.total ? run.first.correct / run.first.total : 1;
      let stars = 0;
      let bonus = 0;
      let newWords = 0;
      let nextLesson = null;

      if (run.kind === 'lesson') {
        const l = run.lesson;
        const prev = S.state.lessons[l.id] || { plays: 0, stars: 0, best: 0 };
        stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
        bonus = prev.done ? 8 : 15;
        S.state.lessons[l.id] = { done: true, stars: Math.max(prev.stars || 0, stars), best: Math.max(prev.best || 0, acc),
          plays: (prev.plays || 0) + 1, last: Date.now() };
        l.items.forEach(function (it) {
          const st = run.itemStats[it.id];
          const a = st && (st.ok + st.bad) ? st.ok / (st.ok + st.bad) : 1;
          if (!R.isLearned(it.id)) newWords++;
          R.learn(it.id, a);
        });
        const idx = C.content.lessons.indexOf(l);
        nextLesson = C.content.lessons[idx + 1] || null;
      } else {
        bonus = run.correctRun > 0 ? 5 : 0;
      }
      if (bonus) { S.addXp(bonus); run.xp += bonus; }
      S.state.stats.sessions++;
      S.touch();

      const goal = S.state.profile.dailyGoal;
      const reached = run.goalBefore < goal && S.xpToday() >= goal;
      A.sfx('done');
      A.haptic('success');

      const stats = h('div.sum-stats',
        h('div.sum-stat', h('div.sum-num.xp', '+' + run.xp), h('div.sum-lab', 'XP')),
        h('div.sum-stat', h('div.sum-num', Math.round(acc * 100) + '%'), h('div.sum-lab', tr('Treffer'))),
        h('div.sum-stat', h('div.sum-num', Math.floor(seconds / 60) + ':' + ('0' + (seconds % 60)).slice(-2)), h('div.sum-lab', tr('Zeit'))));

      const wordsList = run.kind === 'lesson'
        ? h('div.sum-words', h('div.sum-sub', tr('Das hast du gelernt')),
          run.lesson.items.map(function (it) {
            return h('div.sum-word', h('span.sw-es', { lang: 'es' }, it.es), h('span.sw-de', it.de));
          }))
        : null;

      const goalLine = h('div.sum-goal' + (reached ? '.hit' : ''),
        reached ? tr('🎯 Tagesziel erreicht!') : tr('Tagesziel: {a} / {b} XP', { a: Math.min(S.xpToday(), goal), b: goal }),
        h('span.sum-streak', ui.icon('flame', 18), U.plural(S.streak(), 'Tag', 'Tage')));

      U.clear(stage);
      stage.scrollTop = 0;
      stage.appendChild(h('div.summary',
        h('div.sum-hero', run.kind === 'lesson' ? '🎉' : '✅'),
        h('h2.sum-title', run.kind === 'lesson' ? tr('Lektion geschafft!') : tr('Wiederholung fertig!')),
        run.kind === 'lesson' ? h('div.sum-lesson', run.lesson.title) : null,
        run.kind === 'lesson' ? h('div.sum-stars', ui.stars(stars, 38)) : null,
        stats, goalLine,
        run.kind === 'lesson' && newWords ? h('div.sum-note', tr('{n} im Wiederholungstrainer', { n: U.plural(newWords, 'neues Wort', 'neue Wörter') })) : null,
        wordsList));

      U.clear(foot);
      foot.className = 'foot';
      if (nextLesson) {
        foot.appendChild(ui.btn(tr('Nächste Lektion'), { block: true, big: true, onclick: function () {
          teardown();
          setTimeout(function () { Sess.startLesson(nextLesson); }, 260);
        } }));
        foot.appendChild(ui.btn(tr('Zur Übersicht'), { block: true, kind: 'ghost', onclick: teardown }));
      } else {
        foot.appendChild(ui.btn(tr('Fertig'), { block: true, big: true, onclick: teardown }));
      }
    }

    showStep();
  }
})();
