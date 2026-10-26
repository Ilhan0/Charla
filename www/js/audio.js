/* Charla – Ton: Sprachausgabe, Spracherkennung, Effekte, Haptik
 * In der iOS-App läuft alles nativ (AVSpeechSynthesizer / SFSpeechRecognizer) über die Brücke
 * window.webkit.messageHandlers.charla. Im Browser werden die Web-Speech-APIs verwendet.
 */
(function () {
  'use strict';
  const C = (window.Charla = window.Charla || {});
  const U = C.util;
  const S = C.store;

  // ---------- Brücke zur nativen App ----------
  const hasNative = !!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.charla);
  const N = (C.native = { available: hasNative, handlers: {} });
  N.post = function (type, data) {
    if (!hasNative) return false;
    try {
      window.webkit.messageHandlers.charla.postMessage(Object.assign({ type: type }, data || {}));
      return true;
    } catch (e) { return false; }
  };
  N.on = function (type, fn) { N.handlers[type] = fn; };
  window.CharlaNative = {
    onEvent: function (ev) {
      const fn = ev && N.handlers[ev.type];
      if (fn) fn(ev);
    }
  };

  const A = (C.audio = {});
  const synth = window.speechSynthesis || null;
  const speaking = new Map(); // id -> finish()
  let seq = 0;

  N.on('speakEnd', function (ev) {
    const f = speaking.get(ev.id);
    if (f) f();
  });

  function webVoice(prefer) {
    if (!synth) return null;
    const vs = (synth.getVoices() || []).filter(function (v) { return /^es/i.test(v.lang); });
    if (!vs.length) return null;
    if (prefer) {
      const f = vs.find(function (v) { return v.voiceURI === prefer || v.name === prefer; });
      if (f) return f;
    }
    function rank(v) {
      let r = /es[-_]ES/i.test(v.lang) ? 0 : /es[-_](MX|US|419)/i.test(v.lang) ? 1 : 2;
      if (/enhanced|premium|siri|natural/i.test(v.name)) r -= 1;
      return r;
    }
    return vs.slice().sort(function (a, b) { return rank(a) - rank(b); })[0];
  }

  /** Spanischen Text vorlesen. Löst auf, sobald fertig (oder nach einem Sicherheits-Timeout). */
  A.speak = function (text, opts) {
    opts = opts || {};
    A.stop();
    const st = S.state.settings;
    const rate = U.clamp((opts.rate || st.rate) * (opts.slow ? 0.65 : 1), 0.3, 1.4);
    const id = ++seq;
    return new Promise(function (resolve) {
      let guard = null;
      const finish = U.once(function () {
        clearTimeout(guard);
        speaking.delete(id);
        resolve();
      });
      speaking.set(id, finish);
      guard = setTimeout(finish, Math.max(2500, (text.length * 150 + 1500) / rate));
      if (hasNative) {
        N.post('speak', { id: id, text: text, rate: rate, pitch: opts.pitch || 1, voice: opts.voice || st.voice || '' });
      } else if (synth) {
        try {
          const u = new SpeechSynthesisUtterance(text);
          u.lang = 'es-ES';
          const v = webVoice(opts.voice || st.voice);
          if (v) { u.voice = v; u.lang = v.lang; }
          u.rate = rate;
          u.pitch = opts.pitch || 1;
          u.onend = finish;
          u.onerror = finish;
          synth.speak(u);
        } catch (e) { finish(); }
      } else {
        finish();
      }
    });
  };

  A.stop = function () {
    if (hasNative) N.post('stopSpeak');
    else if (synth) { try { synth.cancel(); } catch (e) { /* ignorieren */ } }
    speaking.forEach(function (f) { f(); });
  };

  /** Verfügbare spanische Stimmen: [{id, name, lang, quality}] */
  A.voices = function () {
    if (hasNative) {
      return new Promise(function (resolve) {
        const t = setTimeout(function () { resolve([]); }, 1500);
        N.on('voices', function (ev) { clearTimeout(t); resolve(ev.voices || []); });
        N.post('voices');
      });
    }
    return new Promise(function (resolve) {
      function collect() {
        return (synth ? synth.getVoices() : []).filter(function (v) { return /^es/i.test(v.lang); })
          .map(function (v) { return { id: v.voiceURI, name: v.name, lang: v.lang, quality: 1 }; });
      }
      const now = collect();
      if (now.length || !synth) { resolve(now); return; }
      const t = setTimeout(function () { resolve(collect()); }, 800);
      synth.onvoiceschanged = function () { clearTimeout(t); resolve(collect()); };
    });
  };

  // ---------- Spracherkennung ----------
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  A.canListen = function () { return hasNative || !!SR; };

  let activeListen = null;
  N.on('listen', function (ev) {
    const a = activeListen;
    if (!a || a.id !== ev.id) return;
    if (ev.phase === 'partial') {
      if (a.onPartial) a.onPartial(ev.text || '');
    } else if (ev.phase === 'final') {
      activeListen = null;
      a.resolve({ text: ev.text || '' });
    } else if (ev.phase === 'error') {
      activeListen = null;
      a.reject(new Error(ev.code || 'error'));
    }
  });

  /** Startet eine Aufnahme. Gibt {promise, stop} zurück; promise → {text}. */
  A.listen = function (opts) {
    opts = opts || {};
    A.stop();
    const id = ++seq;
    let stop = function () {};
    const promise = new Promise(function (resolve, reject) {
      if (hasNative) {
        activeListen = { id: id, onPartial: opts.onPartial, resolve: resolve, reject: reject };
        N.post('listen', { id: id, hint: opts.hint || '' });
        stop = function () { N.post('stopListen', { id: id }); };
      } else if (SR) {
        const rec = new SR();
        let last = '';
        let failed = false;
        rec.lang = 'es-ES';
        rec.interimResults = true;
        rec.maxAlternatives = 1;
        rec.onresult = function (e) {
          let t = '';
          for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript + ' ';
          last = t.trim();
          if (opts.onPartial) opts.onPartial(last);
        };
        rec.onerror = function (e) { failed = true; reject(new Error(e.error || 'error')); };
        rec.onend = function () { if (!failed) resolve({ text: last }); };
        try { rec.start(); } catch (e) { reject(e); }
        stop = function () { try { rec.stop(); } catch (e) { /* ignorieren */ } };
      } else {
        reject(new Error('unsupported'));
      }
    });
    return { promise: promise, stop: function () { stop(); } };
  };

  // ---------- Effekte ----------
  let ctx = null;
  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ctx = new AC(); } catch (e) { return null; }
    }
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) { /* ignorieren */ } }
    return ctx;
  }
  function tone(a, freq, t0, dur, type, vol) {
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.16, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(a.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  A.sfx = function (kind) {
    if (!S.state.settings.sound) return;
    const a = ac();
    if (!a) return;
    const t = a.currentTime;
    if (kind === 'ok') { tone(a, 659.25, t, 0.14, 'sine', 0.16); tone(a, 987.77, t + 0.09, 0.22, 'sine', 0.16); }
    else if (kind === 'almost') { tone(a, 523.25, t, 0.14, 'triangle', 0.14); tone(a, 659.25, t + 0.1, 0.18, 'triangle', 0.14); }
    else if (kind === 'bad') { tone(a, 220, t, 0.22, 'triangle', 0.18); tone(a, 164.81, t + 0.12, 0.3, 'triangle', 0.18); }
    else if (kind === 'done') {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(a, f, t + i * 0.11, 0.3, 'sine', 0.15); });
    } else if (kind === 'tap') { tone(a, 440, t, 0.05, 'sine', 0.06); }
  };

  A.haptic = function (kind) {
    if (!S.state.settings.haptics) return;
    if (hasNative) N.post('haptic', { style: kind || 'light' });
    else if (navigator.vibrate) { try { navigator.vibrate(kind === 'error' ? [30, 40, 30] : 12); } catch (e) { /* ignorieren */ } }
  };

  /** Warm-up: erste Berührung schaltet WebAudio frei */
  document.addEventListener('pointerdown', function () { ac(); }, { once: true, passive: true });
})();
