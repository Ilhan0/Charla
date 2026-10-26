// End-to-End-Test im Handy-Format: Onboarding, Lernpfad, komplette Lektion, Wiederholung, Profil.
// Aufruf: node tests/e2e.js [outDir]
const path = require('path');
const { chromium } = require('playwright');

const OUT = process.argv[2] || path.join(__dirname, 'shots');
const URL = 'file://' + path.join(__dirname, '..', 'www', 'index.html');
const log = (...a) => console.log(...a);
const errors = [];

async function shot(page, name) { await page.screenshot({ path: path.join(OUT, name + '.png') }); }

async function stepInfo(page) {
  return page.evaluate(() => {
    const s = Charla.session;
    return s.ex ? JSON.parse(JSON.stringify(s.ex)) : null;
  });
}

async function clickFoot(page) {
  await page.locator('.foot .btn').first().click();
}

async function answerChoice(page, ex, wrong) {
  const idx = await page.evaluate(([answer, wrong]) => {
    const opts = Array.from(document.querySelectorAll('.opt'));
    const texts = opts.map(o => o.textContent.trim());
    if (wrong) return texts.findIndex(t => t !== answer);
    return texts.findIndex(t => t === answer);
  }, [ex.answer, wrong]);
  if (idx < 0) throw new Error('Option nicht gefunden für ' + ex.type + ' ' + ex.answer);
  await page.locator('.opt').nth(idx).click();
}

async function solveOne(page, ex, wrong) {
  const t = ex.type;
  if (t === 'intro' || t === 'tip' || t === 'dialogue' || t === 'speak') { await clickFoot(page); return 'neutral'; }
  if (['mc', 'pic', 'listen', 'reply', 'gap'].includes(t)) {
    await answerChoice(page, ex, wrong);
    await page.waitForSelector('.feedback');
    return wrong ? 'bad' : 'ok';
  }
  if (t === 'type' || t === 'dictation') {
    await page.locator('.field').fill(wrong ? 'xxxx' : ex.answer);
    await clickFoot(page);
    await page.waitForSelector('.feedback');
    return wrong ? 'bad' : 'ok';
  }
  if (t === 'order') {
    const order = await page.evaluate((ex) => {
      const toks = Charla.text.tokens(ex.es);
      const bank = Array.from(document.querySelectorAll('.bank .tile')).map(b => b.textContent.trim());
      const used = new Set();
      return toks.map(tok => {
        const norm = Charla.text.normalize(tok);
        const i = bank.findIndex((b, k) => !used.has(k) && Charla.text.normalize(b) === norm);
        used.add(i);
        return i;
      });
    }, ex);
    const seq = wrong ? order.slice().reverse() : order;
    for (const i of seq) await page.locator('.bank .tile').nth(i).click();
    await clickFoot(page);
    await page.waitForSelector('.feedback');
    return wrong && order.length > 1 ? 'bad' : 'ok';
  }
  if (t === 'match') {
    for (const p of ex.pairs) {
      await page.locator('.mcol').nth(0).locator('.mtile', { hasText: new RegExp('^' + p.es.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') }).click();
      await page.locator('.mcol').nth(1).locator('.mtile', { hasText: new RegExp('^' + p.de.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') }).click();
    }
    await page.waitForSelector('.feedback');
    return 'ok';
  }
  throw new Error('unbekannter Typ ' + t);
}

async function playSession(page, label, opts) {
  opts = opts || {};
  const seen = {};
  let n = 0;
  const shotTypes = opts.shotTypes || true;
  while (true) {
    await page.waitForTimeout(40);
    if (await page.locator('.summary').count()) break;
    const ex = await stepInfo(page);
    if (!ex) { await page.waitForTimeout(100); continue; }
    n++;
    const first = !seen[ex.type];
    seen[ex.type] = (seen[ex.type] || 0) + 1;
    const wrong = opts.wrongEvery ? (n % opts.wrongEvery === 0) && ['mc', 'type', 'gap', 'order'].includes(ex.type) : false;
    if (first && shotTypes) { await page.waitForTimeout(250); await shot(page, label + '-' + ex.type); }
    const res = await solveOne(page, ex, wrong);
    if (res !== 'neutral' && (first || wrong) && shotTypes) { await page.waitForTimeout(250); await shot(page, label + '-' + ex.type + (wrong ? '-bad' : '-ok')); }
    if (res !== 'neutral') await clickFoot(page);
    if (n > 200) throw new Error('Sitzung läuft zu lange');
  }
  log(label, 'Schritte:', n, JSON.stringify(seen));
  await page.waitForTimeout(500);
  await shot(page, label + '-summary');
  return { n, seen };
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true,
    colorScheme: process.env.DARK ? 'dark' : 'light', locale: 'de-DE'
  });
  const page = await ctx.newPage();
  page.on('pageerror', e => { errors.push('pageerror: ' + e.message); });
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto(URL);
  await page.waitForSelector('.onb');
  await shot(page, '01-onb-welcome');

  // Onboarding
  await page.locator('.onb-foot .btn').click();
  await page.waitForTimeout(100);
  await shot(page, '02-onb-goal');
  await page.locator('.onb-opt').first().click();
  await page.locator('.onb-foot .btn').click();
  await page.waitForTimeout(100);
  await shot(page, '03-onb-daily');
  await page.locator('.onb-foot .btn').click();
  await page.waitForTimeout(100);
  await shot(page, '04-onb-sound');
  await page.locator('.onb-foot .btn').click();
  await page.waitForSelector('.onb', { state: 'detached' });

  await page.waitForTimeout(300);
  await shot(page, '05-home');
  await page.evaluate(() => document.getElementById('view').scrollTo(0, 700));
  await page.waitForTimeout(200);
  await shot(page, '06-home-scrolled');
  await page.evaluate(() => document.getElementById('view').scrollTo(0, 0));

  // Lektionsblatt
  await page.locator('.lcard').first().click();
  await page.waitForTimeout(400);
  await shot(page, '07-lesson-sheet');
  await page.locator('.sheet .btn').last().click();
  await page.waitForSelector('.session');
  await page.waitForTimeout(500);

  const r1 = await playSession(page, 'L1', { wrongEvery: 5 });
  await page.locator('.foot .btn').last().click();
  await page.waitForSelector('.session', { state: 'detached' });
  await page.waitForTimeout(400);
  await shot(page, '08-home-after');

  // Wiederholen
  await page.locator('.tab').nth(1).click();
  await page.waitForTimeout(300);
  await shot(page, '09-review');
  // Wortschatz
  await page.locator('.tab').nth(2).click();
  await page.waitForTimeout(300);
  await shot(page, '10-vocab');
  await page.locator('.vrow.click').first().click();
  await page.waitForTimeout(400);
  await shot(page, '11-word-sheet');
  await page.locator('.backdrop').click({ position: { x: 10, y: 10 } });
  await page.waitForTimeout(300);
  await page.locator('.seg button').nth(1).click();
  await page.waitForTimeout(300);
  await shot(page, '12-grammar');
  // Profil
  await page.locator('.tab').nth(3).click();
  await page.waitForTimeout(300);
  await shot(page, '13-profile');
  await page.evaluate(() => document.getElementById('view').scrollTo(0, 900));
  await page.waitForTimeout(200);
  await shot(page, '14-profile-2');

  // fällige Wörter erzwingen und Wiederholung spielen
  await page.evaluate(() => {
    const v = Charla.store.state.vocab;
    Object.keys(v).forEach(id => { v[id].due = Date.now() - 1000; });
    Charla.store.touch();
  });
  await page.locator('.tab').nth(1).click();
  await page.waitForTimeout(300);
  await shot(page, '15-review-due');
  await page.locator('.review-hero .btn').click();
  await page.waitForSelector('.session');
  const r2 = await playSession(page, 'R1', { wrongEvery: 4 });
  await page.locator('.foot .btn').last().click();
  await page.waitForTimeout(400);

  const state = await page.evaluate(() => JSON.parse(Charla.store.exportJSON()));
  log('XP', state.stats.xp, 'Wörter', Object.keys(state.vocab).length, 'Lektionen', JSON.stringify(state.lessons));
  log('Fehler:', errors.length ? '\n' + errors.join('\n') : 'keine');
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})().catch(e => { console.error('TESTFEHLER', e); console.error(errors.join('\n')); process.exit(2); });
