/* Charla – Bildschirme: Lernen, Wiederholen, Wortschatz, Profil, Lektions-Blatt */
(function () {
  'use strict';
  const C = (window.Charla = window.Charla || {});
  const U = C.util;
  const h = U.h;
  const S = C.store;
  const K = C.content;
  const R = C.srs;
  const ui = C.ui;
  const A = C.audio;
  const T = C.text;
  const SC = (C.screens = {});

  const DAY = 24 * 3600 * 1000;

  function pageTitle(text, right) {
    return h('div.page-head', h('h1', text), right || null);
  }

  function streakChip() {
    const n = S.streak();
    return h('div.chip.streak' + (n > 0 ? '.on' : ''), ui.icon('flame', 18), String(n));
  }

  function dueText(ms) {
    const d = ms - Date.now();
    if (d <= 0) return 'jetzt';
    const min = Math.round(d / 60000);
    if (min < 60) return 'in ' + Math.max(1, min) + ' Min.';
    const hr = Math.round(d / 3600000);
    if (hr < 24) return 'in ' + hr + ' Std.';
    const days = Math.round(d / DAY);
    return days === 1 ? 'morgen' : 'in ' + days + ' Tagen';
  }

  // =====================================================================
  //  Lernen
  // =====================================================================
  SC.learn = function (view) {
    const prof = S.state.profile;
    const frac = S.goalProgress();
    const next = K.nextLesson(S.state);
    const due = R.dueCount();

    view.appendChild(h('div.page-head.home',
      h('div', h('div.hello', '¡Hola!'), h('h1', 'Weiter geht’s')),
      streakChip()));

    view.appendChild(h('div.card.goal',
      ui.ring(frac, 56, 7, h('span.goal-ico', frac >= 1 ? '🎯' : '⭐'), frac >= 1 ? 'done' : ''),
      h('div.goal-text',
        h('div.goal-title', frac >= 1 ? 'Tagesziel erreicht!' : 'Tagesziel'),
        h('div.goal-sub', Math.min(S.xpToday(), prof.dailyGoal) + ' / ' + prof.dailyGoal + ' XP heute'))));

    if (next) {
      view.appendChild(h('div.hero', { onclick: function () { SC.lessonSheet(next); }, role: 'button', tabindex: '0' },
        h('div.hero-text',
          h('div.hero-badge', next.index === 0 && !S.state.lessons[next.id] && next.unit.index === 0 ? 'Los geht’s' : 'Weiter lernen'),
          h('div.hero-title', next.title),
          h('div.hero-sub', next.unit.title + ' · ' + next.sub),
          h('button.btn.light', { type: 'button', onclick: function (e) { e.stopPropagation(); C.session.startLesson(next); } }, ui.icon('play', 18), 'Starten')),
        h('div.hero-emoji', next.emoji)));
    } else {
      view.appendChild(h('div.card.center', h('div.big-emoji', '🏆'), h('div.card-title', 'Alle Lektionen geschafft!'),
        h('div.muted', 'Wiederhole deine Wörter, damit sie sitzen. Neue Lektionen lassen sich leicht ergänzen.')));
    }

    if (due > 0) {
      view.appendChild(h('div.card.due', { onclick: function () { C.app.go('review'); } },
        h('div.due-num', String(due)),
        h('div.due-text', h('div.card-title', U.plural(due, 'Wort wartet', 'Wörter warten')), h('div.muted', 'auf deine Wiederholung')),
        ui.icon('next', 22, 'chev')));
    }

    K.units.forEach(function (u) {
      const p = K.unitProgress(u, S.state);
      const sec = h('section.unit', { style: { '--uc': u.color || 'var(--primary)' } },
        h('div.unit-head',
          h('div.unit-ico', u.emoji),
          h('div.unit-t', h('div.unit-title', u.title), h('div.muted', u.sub)),
          h('div.unit-meta', h('span.pill', u.level), h('span.unit-prog', p.done + '/' + p.total))));
      const list = h('div.lcards');
      u.lessons.forEach(function (l) {
        const rec = S.state.lessons[l.id];
        const isNext = next && next.id === l.id;
        list.appendChild(h('button.lcard' + (rec && rec.done ? '.done' : '') + (isNext ? '.next' : ''), {
          type: 'button', onclick: function () { SC.lessonSheet(l); }
        },
          h('div.l-ico', l.emoji),
          h('div.l-t', h('div.l-title', l.title), h('div.l-sub', l.sub)),
          rec && rec.done ? ui.stars(rec.stars || 1, 14) : ui.icon('next', 20, 'chev')));
      });
      sec.appendChild(list);
      view.appendChild(sec);
    });
    view.appendChild(h('div.footer-space'));
  };

  SC.lessonSheet = function (lesson) {
    const rec = S.state.lessons[lesson.id];
    const list = h('div.vlist');
    lesson.items.forEach(function (it) {
      list.appendChild(h('div.vrow',
        h('div.v-emoji', it.emoji || ''),
        h('div.v-t', h('div.v-es', { lang: 'es' }, it.es), h('div.v-de', it.de)),
        ui.speakBtn(it.es, { size: 20 })));
    });
    const sh = ui.sheet({ tall: true });
    sh.body.appendChild(h('div.ls-head',
      h('div.ls-emoji', lesson.emoji),
      h('div.ls-t', h('div.ls-title', lesson.title), h('div.muted', lesson.sub)),
      rec && rec.done ? ui.stars(rec.stars || 1, 18) : null));
    sh.body.appendChild(h('div.ls-meta',
      h('span.pill', U.plural(lesson.items.length, 'Wort', 'Wörter')),
      lesson.dialogue ? h('span.pill', 'Dialog') : null,
      lesson.tip ? h('span.pill', 'Tipp') : null,
      h('span.pill', '≈ ' + Math.max(5, Math.round(lesson.items.length * 0.8)) + ' Min.')));
    sh.body.appendChild(h('div.sheet-sub', 'Was dich erwartet'));
    sh.body.appendChild(list);
    sh.body.appendChild(h('div.sheet-actions.sticky',
      ui.btn(rec && rec.done ? 'Nochmal üben' : 'Lektion starten', {
        block: true, big: true, onclick: function () { sh.close(); setTimeout(function () { C.session.startLesson(lesson); }, 120); }
      })));
  };

  // =====================================================================
  //  Wiederholen
  // =====================================================================
  function learnedIds() { return Object.keys(S.state.vocab).filter(function (id) { return K.items[id]; }); }

  SC.review = function (view) {
    const ids = learnedIds();
    const due = R.dueIds().filter(function (id) { return K.items[id]; });
    view.appendChild(pageTitle('Wiederholen', streakChip()));

    if (!ids.length) {
      view.appendChild(h('div.card.center.empty', h('div.big-emoji', '🌱'),
        h('div.card-title', 'Noch nichts zu wiederholen'),
        h('div.muted', 'Schließe eine Lektion ab – danach landen die Wörter hier und werden genau dann abgefragt, wenn du sie zu vergessen drohst.'),
        ui.btn('Zur ersten Lektion', { onclick: function () { C.app.go('learn'); } })));
      return;
    }

    const upcoming = ids.map(function (id) { return S.state.vocab[id].due; }).filter(function (t) { return t > Date.now(); }).sort(function (a, b) { return a - b; });
    view.appendChild(h('div.card.review-hero' + (due.length ? '.has' : ''),
      h('div.rh-num', String(due.length)),
      h('div.rh-t', h('div.card-title', due.length ? U.plural(due.length, 'Wort ist fällig', 'Wörter sind fällig') : 'Alles im Griff!'),
        h('div.muted', due.length ? 'Kurze Runden von bis zu 15 Wörtern.' : (upcoming.length ? 'Nächste Wiederholung ' + dueText(upcoming[0]) : 'Nichts mehr offen.'))),
      ui.btn(due.length ? 'Jetzt wiederholen' : 'Trotzdem üben', {
        block: true, big: true,
        onclick: function () {
          const pick = due.length ? due.slice(0, 15) : U.sample(ids, Math.min(12, ids.length));
          C.session.startReview(pick, { title: 'Wiederholen' });
        }
      })));

    // Vorschau
    const fc = R.forecast(7);
    const max = Math.max.apply(null, fc.concat([1]));
    const bars = h('div.fc-bars');
    const today = new Date();
    fc.forEach(function (n, i) {
      const d = new Date(today.getTime() + i * DAY);
      bars.appendChild(h('div.fc-col',
        h('div.fc-n', n ? String(n) : ''),
        h('div.fc-bar', h('i', { style: { height: Math.max(n ? 8 : 3, Math.round((n / max) * 64)) + 'px' } })),
        h('div.fc-d', i === 0 ? 'Heute' : i === 1 ? 'Morgen' : U.WEEKDAYS[d.getDay()])));
    });
    view.appendChild(h('div.card', h('div.card-title', 'Vorschau'), h('div.muted', 'Fällige Wörter in den nächsten Tagen'), bars));

    // Wortstärke
    const levels = [0, 0, 0, 0, 0, 0, 0];
    ids.forEach(function (id) { levels[S.state.vocab[id].box]++; });
    const strength = h('div.strength');
    const groups = [
      { label: 'Neu', n: levels[0] + levels[1], cls: 'l1' },
      { label: 'Lernend', n: levels[2] + levels[3], cls: 'l2' },
      { label: 'Sicher', n: levels[4] + levels[5] + levels[6], cls: 'l3' }
    ];
    const total = ids.length;
    const bar = h('div.sbar');
    groups.forEach(function (g) { if (g.n) bar.appendChild(h('i.' + g.cls, { style: { flex: String(g.n) } })); });
    strength.appendChild(bar);
    strength.appendChild(h('div.slegend', groups.map(function (g) { return h('span', h('i.dot.' + g.cls), g.label + ' ' + g.n); })));
    view.appendChild(h('div.card', h('div.card-title', U.plural(total, 'Wort', 'Wörter') + ' gelernt'), strength));

    // Freies Üben
    const hard = ids.filter(function (id) { const r = S.state.vocab[id]; return r.bad > r.ok || r.box <= 1; });
    const favs = ids.filter(function (id) { return S.state.vocab[id].fav; });
    function row(emoji, title, sub, list, take) {
      return h('button.prow', { type: 'button', disabled: list.length === 0, onclick: function () {
        C.session.startReview(U.sample(list, Math.min(take, list.length)), { title: title });
      } }, h('div.p-ico', emoji), h('div.p-t', h('div.p-title', title), h('div.muted', sub)), ui.icon('next', 20, 'chev'));
    }
    view.appendChild(h('div.card.tight', h('div.card-title.pad', 'Freies Üben'),
      row('🎲', 'Zufällige Auswahl', U.plural(Math.min(15, ids.length), 'Wort', 'Wörter'), ids, 15),
      row('💪', 'Schwierige Wörter', U.plural(hard.length, 'Wort', 'Wörter'), hard, 15),
      row('⭐', 'Favoriten', U.plural(favs.length, 'Wort', 'Wörter'), favs, 15)));
    view.appendChild(h('div.footer-space'));
  };

  // =====================================================================
  //  Wortschatz
  // =====================================================================
  let vocabState = { seg: 'words', q: '', filter: 'all', showAll: false };

  SC.wordSheet = function (it) {
    const r = S.state.vocab[it.id];
    const sh = ui.sheet({});
    const fav = h('button.icon-btn.fav' + (r && r.fav ? '.on' : ''), { type: 'button', 'aria-label': 'Favorit', onclick: function () {
      if (!R.isLearned(it.id)) { ui.toast('Erst nach der Lektion verfügbar'); return; }
      const on = R.toggleFav(it.id);
      fav.classList.toggle('on', on);
      U.clear(fav); fav.appendChild(ui.icon(on ? 'heartFill' : 'heart', 24));
    } }, ui.icon(r && r.fav ? 'heartFill' : 'heart', 24));
    sh.body.appendChild(h('div.ws',
      h('div.ws-top', h('div.ws-emoji', it.emoji || '💬'), fav),
      h('div.ws-es', { lang: 'es' }, it.es),
      h('div.ws-de', it.de),
      h('div.q-say', ui.speakBtn(it.es, { big: true }), ui.speakBtn(it.es, { slow: true, big: true })),
      it.exEs ? h('div.example', h('div.ex-es', { lang: 'es' }, it.exEs, ui.speakBtn(it.exEs, { size: 18 })), h('div.ex-de', it.exDe)) : null,
      h('div.ws-meta',
        h('div', h('div.muted', 'Lektion'), h('div', K.lessonById[it.lessonId].title)),
        r ? h('div', h('div.muted', 'Stärke'), h('div', ui.dots(r.box), ' ', R.LABELS[r.box])) : h('div', h('div.muted', 'Status'), h('div', 'Noch nicht gelernt')),
        r ? h('div', h('div.muted', 'Nächste Abfrage'), h('div', dueText(r.due))) : null,
        r ? h('div', h('div.muted', 'Richtig / Falsch'), h('div', r.ok + ' / ' + r.bad)) : null)));
  };

  SC.vocab = function (view) {
    view.appendChild(pageTitle('Wortschatz'));
    const seg = h('div.seg');
    [['words', 'Wörter'], ['grammar', 'Grammatik']].forEach(function (s) {
      seg.appendChild(h('button' + (vocabState.seg === s[0] ? '.on' : ''), { type: 'button', onclick: function () { vocabState.seg = s[0]; C.app.refresh(); } }, s[1]));
    });
    view.appendChild(seg);

    if (vocabState.seg === 'grammar') {
      const list = h('div.card.tight');
      let n = 0;
      K.lessons.forEach(function (l) {
        if (!l.tip) return;
        n++;
        list.appendChild(h('button.prow', { type: 'button', onclick: function () {
          const sh = ui.sheet({ tall: true });
          sh.body.appendChild(h('div.tip-card', h('div.tip-ico', '💡'), h('div.tip-title', l.tip.title), h('div.tip-text', ui.paras(l.tip.text)),
            h('div.muted', 'aus: ' + l.title)));
        } }, h('div.p-ico', '💡'), h('div.p-t', h('div.p-title', l.tip.title), h('div.muted', l.title)), ui.icon('next', 20, 'chev')));
      });
      view.appendChild(n ? list : h('div.card.center', h('div.muted', 'Noch keine Tipps.')));
      view.appendChild(h('div.footer-space'));
      return;
    }

    const search = h('input.search', { type: 'search', placeholder: 'Suchen …', value: vocabState.q, autocapitalize: 'none', autocorrect: 'off', 'aria-label': 'Suchen' });
    const listBox = h('div.vgroups');
    search.addEventListener('input', function () { vocabState.q = search.value; draw(); });
    view.appendChild(h('div.searchbox', ui.icon('search', 20), search));

    const chips = h('div.chips');
    [['all', 'Alle'], ['fav', 'Favoriten'], ['weak', 'Schwach']].forEach(function (f) {
      chips.appendChild(h('button.fchip' + (vocabState.filter === f[0] ? '.on' : ''), { type: 'button', onclick: function () { vocabState.filter = f[0]; C.app.refresh(); } }, f[1]));
    });
    chips.appendChild(h('button.fchip' + (vocabState.showAll ? '.on' : ''), { type: 'button', onclick: function () { vocabState.showAll = !vocabState.showAll; C.app.refresh(); } }, 'Auch ungelernte'));
    view.appendChild(chips);
    view.appendChild(listBox);
    view.appendChild(h('div.footer-space'));

    function draw() {
      U.clear(listBox);
      const q = T.fold(vocabState.q);
      let shown = 0;
      K.lessons.forEach(function (l) {
        const rows = l.items.filter(function (it) {
          const r = S.state.vocab[it.id];
          if (!r && !vocabState.showAll) return false;
          if (vocabState.filter === 'fav' && !(r && r.fav)) return false;
          if (vocabState.filter === 'weak' && !(r && (r.box <= 2))) return false;
          if (q && T.fold(it.es).indexOf(q) < 0 && T.fold(it.de).indexOf(q) < 0) return false;
          return true;
        });
        if (!rows.length) return;
        shown += rows.length;
        const g = h('div.vgroup', h('div.vg-title', l.emoji + ' ' + l.title));
        const card = h('div.card.tight');
        rows.forEach(function (it) {
          const r = S.state.vocab[it.id];
          card.appendChild(h('div.vrow.click' + (r ? '' : '.unseen'), { onclick: function () { SC.wordSheet(it); }, role: 'button', tabindex: '0' },
            h('div.v-emoji', it.emoji || ''),
            h('div.v-t', h('div.v-es', { lang: 'es' }, it.es), h('div.v-de', it.de)),
            r ? ui.dots(r.box) : null,
            ui.speakBtn(it.es, { size: 20 })));
        });
        g.appendChild(card);
        listBox.appendChild(g);
      });
      if (!shown) {
        listBox.appendChild(h('div.card.center.empty', h('div.big-emoji', vocabState.showAll ? '🔍' : '📖'),
          h('div.muted', vocabState.showAll || vocabState.q ? 'Nichts gefunden.' : 'Hier erscheinen die Wörter, sobald du Lektionen abgeschlossen hast. Mit „Auch ungelernte“ kannst du schon vorab stöbern.')));
      }
    }
    draw();
  };

  // =====================================================================
  //  Profil
  // =====================================================================
  function toggle(label, sub, key, onchange) {
    const on = !!S.state.settings[key];
    const sw = h('button.switch' + (on ? '.on' : ''), { type: 'button', role: 'switch', 'aria-checked': String(on), 'aria-label': label, onclick: function () {
      S.state.settings[key] = !S.state.settings[key];
      sw.classList.toggle('on', S.state.settings[key]);
      sw.setAttribute('aria-checked', String(S.state.settings[key]));
      if (onchange) onchange(S.state.settings[key]);
      S.save();
    } }, h('i'));
    return h('div.setrow', h('div.set-t', h('div.set-title', label), sub ? h('div.muted', sub) : null), sw);
  }

  function segmented(options, current, onpick) {
    const seg = h('div.seg.small');
    options.forEach(function (o) {
      const b = h('button' + (o[0] === current ? '.on' : ''), { type: 'button', onclick: function () {
        U.$$('button', seg).forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        onpick(o[0]);
      } }, o[1]);
      seg.appendChild(b);
    });
    return seg;
  }

  function voiceSheet() {
    const sh = ui.sheet({ title: 'Stimme wählen', tall: true });
    const list = h('div.vlist', h('div.muted.pad', 'Lade Stimmen …'));
    sh.body.appendChild(list);
    A.voices().then(function (vs) {
      U.clear(list);
      const cur = S.state.settings.voice;
      function item(id, name, sub) {
        const row = h('button.prow' + ((cur || '') === id ? '.sel' : ''), { type: 'button', onclick: function () {
          S.state.settings.voice = id; S.touch();
          A.speak('Hola, me llamo Lucía. ¿Cómo estás?', { voice: id });
          U.$$('.prow', list).forEach(function (r) { r.classList.remove('sel'); });
          row.classList.add('sel');
        } }, h('div.p-t', h('div.p-title', name), sub ? h('div.muted', sub) : null), ui.icon('check', 20, 'chev'));
        return row;
      }
      list.appendChild(item('', 'Automatisch', 'Beste verfügbare spanische Stimme'));
      vs.sort(function (a, b) { return (b.quality || 0) - (a.quality || 0) || a.name.localeCompare(b.name); });
      vs.forEach(function (v) { list.appendChild(item(v.id, v.name, v.lang + (v.quality >= 2 ? ' · hohe Qualität' : ''))); });
      if (!vs.length) list.appendChild(h('div.muted.pad', 'Keine spanischen Stimmen gefunden. In iOS: Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Spanisch.'));
    });
  }

  function backupSheet() {
    const sh = ui.sheet({ title: 'Fortschritt sichern', tall: true });
    const ta = h('textarea.backup', { rows: '8', spellcheck: 'false', 'aria-label': 'Sicherung' });
    ta.value = S.exportJSON();
    sh.body.appendChild(h('p.sheet-text', 'Kopiere den Text und bewahre ihn z. B. in einer Notiz auf. Zum Wiederherstellen fügst du ihn hier ein und tippst auf „Laden“.'));
    sh.body.appendChild(ta);
    sh.body.appendChild(h('div.sheet-actions',
      ui.btn('Kopieren', { block: true, onclick: function () {
        ta.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        if (!ok && navigator.clipboard) { navigator.clipboard.writeText(ta.value).then(function () { ui.toast('Kopiert'); }); return; }
        ui.toast(ok ? 'Kopiert' : 'Bitte Text manuell kopieren');
      } }),
      ui.btn('Laden', { block: true, kind: 'ghost', onclick: function () {
        if (S.importJSON(ta.value)) { ui.toast('Fortschritt geladen'); sh.close(); C.app.refresh(); }
        else ui.toast('Das sieht nicht nach einer Sicherung aus');
      } })));
  }

  SC.profile = function (view) {
    const st = S.state;
    const learned = learnedIds().length;
    const lessonsDone = K.lessons.filter(function (l) { return st.lessons[l.id] && st.lessons[l.id].done; }).length;
    view.appendChild(pageTitle('Profil'));

    view.appendChild(h('div.card.stat-grid',
      stat('🔥', String(S.streak()), 'Tage in Folge'),
      stat('⚡', String(st.stats.xp), 'XP gesamt'),
      stat('📚', String(learned), 'Wörter gelernt'),
      stat('✅', lessonsDone + '/' + K.lessons.length, 'Lektionen'),
      stat('🎯', st.stats.answers ? Math.round(S.accuracy() * 100) + '%' : '–', 'Trefferquote'),
      stat('📅', String(S.activeDays()), 'Lerntage')));

    // Woche
    const week = h('div.week');
    const goal = st.profile.dailyGoal;
    const keys = [];
    for (let i = 6; i >= 0; i--) keys.push(U.addDays(U.dayKey(), -i));
    const maxXp = Math.max.apply(null, keys.map(function (k) { return S.xpOn(k); }).concat([goal]));
    keys.forEach(function (k) {
      const xp = S.xpOn(k);
      const d = U.parseDay(k);
      week.appendChild(h('div.wk',
        h('div.wk-bar', h('i' + (xp >= goal ? '.hit' : ''), { style: { height: Math.max(xp ? 8 : 3, Math.round(xp / maxXp * 70)) + 'px' } })),
        h('div.wk-d' + (k === U.dayKey() ? '.today' : ''), U.WEEKDAYS[d.getDay()])));
    });
    view.appendChild(h('div.card', h('div.card-title', 'Diese Woche'), h('div.muted', 'XP pro Tag · Ziel ' + goal), week));

    // Einstellungen
    const rate = h('input.range', { type: 'range', min: '0.55', max: '1.15', step: '0.05', value: String(st.settings.rate), 'aria-label': 'Sprechtempo' });
    const rateVal = h('span.muted', Math.round(st.settings.rate * 100) + ' %');
    rate.addEventListener('input', function () { st.settings.rate = parseFloat(rate.value); rateVal.textContent = Math.round(st.settings.rate * 100) + ' %'; });
    rate.addEventListener('change', function () { S.save(); A.speak('Buenos días, ¿cómo estás?'); });

    view.appendChild(h('div.card',
      h('div.card-title', 'Lernen'),
      h('div.setrow.col', h('div.set-t', h('div.set-title', 'Tagesziel'), h('div.muted', 'Wie viele XP willst du pro Tag sammeln?')),
        segmented([[40, 'Locker'], [80, 'Normal'], [150, 'Ehrgeizig']], st.profile.dailyGoal, function (v) { st.profile.dailyGoal = v; S.touch(); })),
      toggle('Wörter automatisch vorlesen', 'Neue Wörter und Dialoge starten mit Ton', 'autoplay'),
      h('div.setrow.col', h('div.set-t', h('div.set-title', 'Sprechtempo ', rateVal)), rate),
      h('button.setrow.btnrow', { type: 'button', onclick: voiceSheet }, h('div.set-t', h('div.set-title', 'Stimme'),
        h('div.muted', st.settings.voice ? 'Eigene Auswahl' : 'Automatisch')), ui.icon('next', 20, 'chev'))));

    view.appendChild(h('div.card',
      h('div.card-title', 'App'),
      h('div.setrow.col', h('div.set-t', h('div.set-title', 'Erscheinungsbild')),
        segmented([['auto', 'Automatisch'], ['light', 'Hell'], ['dark', 'Dunkel']], st.settings.theme, function (v) { st.settings.theme = v; S.applyTheme(); S.save(); })),
      toggle('Töne', 'Kurze Signale bei richtig / falsch', 'sound'),
      toggle('Haptik', 'Leichtes Vibrieren bei Antworten', 'haptics')));

    view.appendChild(h('div.card.tight',
      h('button.prow', { type: 'button', onclick: backupSheet }, h('div.p-ico', '💾'), h('div.p-t', h('div.p-title', 'Fortschritt sichern / laden'), h('div.muted', 'Als Text kopieren')), ui.icon('next', 20, 'chev')),
      h('button.prow.danger', { type: 'button', onclick: function () {
        ui.confirm({ title: 'Alles zurücksetzen?', text: 'Fortschritt, Wortschatz und Statistik werden gelöscht. Das lässt sich nicht rückgängig machen.', ok: 'Zurücksetzen', danger: true })
          .then(function (yes) { if (yes) { S.reset(); S.state.profile.onboarded = true; S.flush(); C.app.go('learn'); ui.toast('Zurückgesetzt'); } });
      } }, h('div.p-ico', '🗑️'), h('div.p-t', h('div.p-title', 'Zurücksetzen'), h('div.muted', 'Von vorn anfangen')), ui.icon('next', 20, 'chev'))));

    view.appendChild(h('div.about', h('div', 'Charla 1.0'), h('div.muted', 'Private Lern-App ohne kommerzielle Nutzung. Alle Lerninhalte sind eigens erstellt.')));
    view.appendChild(h('div.footer-space'));

    function stat(emoji, value, lab) {
      return h('div.stat', h('div.stat-ico', emoji), h('div.stat-num', value), h('div.stat-lab', lab));
    }
  };

  // =====================================================================
  //  Onboarding
  // =====================================================================
  SC.onboarding = function (done) {
    const layer = document.getElementById('layer');
    const data = { goal: '', dailyGoal: 80 };
    const root = h('div.onb');
    layer.appendChild(root);
    let step = 0;
    const total = 4;

    function dots() {
      const d = h('div.onb-dots');
      for (let i = 0; i < total; i++) d.appendChild(h('i' + (i === step ? '.on' : '')));
      return d;
    }
    function shell(content, btnLabel, onNext, canNext) {
      U.clear(root);
      root.appendChild(dots());
      root.appendChild(h('div.onb-body', content));
      root.appendChild(h('div.onb-foot', ui.btn(btnLabel, { block: true, big: true, disabled: canNext === false, onclick: onNext })));
    }
    function choiceList(options, current, onpick) {
      const list = h('div.onb-opts');
      options.forEach(function (o) {
        const b = h('button.onb-opt' + (o[0] === current ? '.sel' : ''), { type: 'button', onclick: function () {
          onpick(o[0]);
        } }, h('span.o-emoji', o[1]), h('span.o-t', h('span.o-title', o[2]), o[3] ? h('span.muted', o[3]) : null));
        list.appendChild(b);
      });
      return list;
    }

    function s0() {
      shell(h('div.onb-center', h('div.onb-logo', '🗣️'), h('h1.onb-h', '¡Hola!'),
        h('p.onb-p', 'Willkommen bei Charla. Du lernst Spanisch mit kurzen Lektionen, echten Dialogen, Hör- und Sprechübungen – und einem Wiederholungstrainer, der dich genau dann abfragt, wenn du etwas zu vergessen drohst.')),
      'Los geht’s', function () { step = 1; s1(); });
    }
    function s1() {
      shell(h('div', h('h1.onb-h.left', 'Warum lernst du Spanisch?'), h('p.onb-p.left', 'Das hilft dir, dranzubleiben.'),
        choiceList([['travel', '✈️', 'Reisen'], ['work', '💼', 'Beruf'], ['people', '❤️', 'Familie & Freunde'], ['fun', '🧠', 'Neugier & Spaß'], ['school', '🎓', 'Schule / Studium']],
          data.goal, function (v) { data.goal = v; s1(); })),
      'Weiter', function () { step = 2; s2(); }, !!data.goal);
    }
    function s2() {
      shell(h('div', h('h1.onb-h.left', 'Dein Tagesziel'), h('p.onb-p.left', 'Du sammelst XP für richtige Antworten. Das Ziel kannst du jederzeit ändern.'),
        choiceList([[40, '😌', 'Locker', '40 XP · ca. 5 Minuten'], [80, '🙂', 'Normal', '80 XP · ca. 10 Minuten'], [150, '💪', 'Ehrgeizig', '150 XP · ca. 20 Minuten']],
          data.dailyGoal, function (v) { data.dailyGoal = v; s2(); })),
      'Weiter', function () { step = 3; s3(); });
    }
    function s3() {
      const playBtn = ui.speakBtn('Hola, buenos días. ¡Bienvenido!', { big: true });
      shell(h('div.onb-center', h('h1.onb-h', 'Ton-Check'), h('p.onb-p', 'Tippe auf den Lautsprecher. Hörst du eine Stimme?'),
        h('div.onb-play', playBtn),
        h('p.onb-p.small', 'Kein Ton? Prüfe Lautstärke und den Stumm-Schalter am iPhone. Tipp für bessere Stimmen: Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Spanisch (erweitert) laden.')),
      'Alles klar, starten', function () {
        S.state.profile.goal = data.goal;
        S.state.profile.dailyGoal = data.dailyGoal;
        S.state.profile.onboarded = true;
        S.touch();
        root.classList.add('out');
        setTimeout(function () { if (root.parentNode) root.parentNode.removeChild(root); }, 250);
        done();
      });
    }
    s0();
  };
})();
