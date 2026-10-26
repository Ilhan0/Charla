/* Charla – Start und Tab-Navigation */
(function () {
  'use strict';
  const C = (window.Charla = window.Charla || {});
  const tr = C.i18n.t;
  const U = C.util;
  const h = U.h;
  const S = C.store;
  const R = C.srs;
  const ui = C.ui;
  const App = (C.app = { tab: 'learn' });

  const TABS = [
    { id: 'learn', label: tr('Lernen'), icon: 'book' },
    { id: 'review', label: tr('Wiederholen'), icon: 'review' },
    { id: 'vocab', label: tr('Wortschatz'), icon: 'words' },
    { id: 'profile', label: tr('Profil'), icon: 'user' }
  ];

  let view = null;
  let tabbar = null;

  function buildTabbar() {
    U.clear(tabbar);
    const due = R.dueCount();
    TABS.forEach(function (t) {
      tabbar.appendChild(h('button.tab' + (App.tab === t.id ? '.on' : ''), {
        type: 'button', 'aria-label': t.label, 'aria-current': App.tab === t.id ? 'page' : null,
        onclick: function () { if (App.tab === t.id) { view.scrollTo({ top: 0, behavior: 'smooth' }); return; } App.go(t.id); }
      }, h('span.tab-ico', ui.icon(t.icon, 26), t.id === 'review' && due > 0 ? h('span.badge', due > 99 ? '99+' : String(due)) : null),
      h('span.tab-label', t.label)));
    });
  }

  function renderView(keepScroll) {
    const top = keepScroll ? view.scrollTop : 0;
    U.clear(view);
    const fn = C.screens[App.tab];
    const page = h('div.page');
    view.appendChild(page);
    fn(page);
    view.scrollTop = top;
    buildTabbar();
  }

  App.go = function (tab) {
    App.tab = tab;
    renderView(false);
  };

  App.refresh = function () {
    if (!view || C.session.run) return;
    renderView(true);
  };

  App.boot = function () {
    S.load();
    C.content.build();
    document.title = tr('Charla – Spanisch lernen');
    view = document.getElementById('view');
    tabbar = document.getElementById('tabbar');
    tabbar.setAttribute('aria-label', tr('Hauptmenü'));
    S.subscribe(function () { App.refresh(); });
    if (S.state.profile.onboarded) {
      // Nach einem Sprachwechsel lädt die Seite neu und kehrt zum Profil zurück
      const wanted = String(window.location.hash || '').replace('#', '');
      App.go(['learn', 'review', 'vocab', 'profile'].indexOf(wanted) >= 0 ? wanted : 'learn');
    } else {
      App.go('learn');
      C.screens.onboarding(function () { App.go('learn'); });
    }
    // Stimmen vorladen
    C.audio.voices();
  };

  window.addEventListener('DOMContentLoaded', function () { App.boot(); });
})();
