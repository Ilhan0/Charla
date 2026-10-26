# Contributing to Charla / Mitmachen bei Charla

*English first, Deutsch weiter unten.*

Thanks for your interest! Charla is a small project developed with AI (see the README). Contributions from people are especially welcome, above all for the Spanish.

## Most helpful

1. **Check the content:** is a Spanish sentence, a translation or a grammar tip wrong? Open an issue with the “Content error” template.
2. **New lessons** for A1 or higher levels.
3. **Translations** into other languages (see “Languages” in the README).
4. **Bugs and ideas** about the app itself.

## Workflow

1. Fork the repository and create a branch.
2. Make your change. For lessons see “Writing your own lessons” in the README.
3. Run `node tests/validate.js`. It must finish without problems.
4. For interface changes also run `node tests/e2e.js` (and `LANGUAGE=en node tests/e2e.js`) and attach a screenshot.
5. Open a pull request and fill in the checklist.

## Rules for lesson content

- Short, everyday sentences. Do not copy content from textbooks or other apps.
- Spanish with correct accents and ¿ and ¡.
- Translations should sound natural, not word for word.
- If you used AI for a contribution, say so briefly in the pull request, and still check the text yourself.

## Code

- The web app needs no libraries and no build step. Please keep it that way.
- No ES module imports: scripts are loaded classically because WKWebView blocks modules on `file://`.
- Interface text goes through `tr('German text')` and needs an English entry in `www/js/i18n/en.js`. The end-to-end test fails on missing entries.
- The Swift shell stays small. New features belong in `www/` whenever possible.

## Conduct

Be friendly and respectful. Criticise the text, not the people.

---

## Deutsch

Danke für dein Interesse! Charla ist ein kleines, mit KI entwickeltes Projekt (siehe README). Beiträge von Menschen sind besonders willkommen, vor allem beim Spanisch.

- **Am hilfreichsten:** Inhalte prüfen (Issue-Vorlage „Content error“), neue Lektionen, Übersetzungen, Fehlerberichte und Ideen.
- **Ablauf:** Fork, Branch, Änderung, `node tests/validate.js` (muss ohne Probleme laufen), bei Änderungen an der Oberfläche zusätzlich `node tests/e2e.js` mit Screenshot, dann Pull Request mit Checkliste.
- **Inhalte:** kurze, alltagsnahe Sätze, keine Inhalte aus Lehrbüchern oder anderen Apps, korrekte Akzente, natürliche Übersetzungen. KI-Hilfe bitte im Pull Request nennen.
- **Code:** keine Bibliotheken, kein Build-Schritt, keine ES-Module. Oberflächentexte laufen über `tr('Deutscher Text')` und brauchen einen englischen Eintrag in `www/js/i18n/en.js`. Die Swift-Hülle bleibt klein.
- **Verhalten:** freundlich und respektvoll.
