# Mitmachen bei Charla

Danke für dein Interesse! Charla ist ein kleines, mit KI entwickeltes Projekt (siehe README). Beiträge von Menschen sind besonders willkommen, vor allem beim Spanisch.

## Am hilfreichsten

1. **Inhalte prüfen:** Stimmt ein spanischer Satz, eine Übersetzung oder ein Grammatik-Tipp nicht? Eröffne ein Issue mit der Vorlage „Fehler im Lerninhalt“.
2. **Neue Lektionen** für A1 oder höhere Niveaus.
3. **Fehler und Ideen** zur App selbst.

## Ablauf für Änderungen

1. Fork erstellen und einen Branch anlegen.
2. Änderung vornehmen. Für Lerninhalte siehe „Eigene Lektionen schreiben“ in der README.
3. `node tests/validate.js` ausführen. Der Test muss ohne Probleme laufen.
4. Bei Änderungen an der Oberfläche zusätzlich `node tests/e2e.js` ausführen und einen Screenshot anhängen.
5. Pull Request öffnen und die Checkliste ausfüllen.

## Regeln für Lerninhalte

- Kurze, alltagsnahe Sätze. Keine Inhalte aus Lehrbüchern oder anderen Apps übernehmen.
- Spanisch mit korrekten Akzenten sowie ¿ und ¡.
- Deutsche Übersetzungen sollen natürlich klingen, nicht wörtlich.
- Nutzt du KI-Hilfe für einen Beitrag, sag es kurz im Pull Request. Prüfe die Texte trotzdem selbst.

## Code

- Die Web-App kommt ohne Bibliotheken und ohne Build-Schritt aus. Bitte so lassen.
- Kein ES-Modul-Import: Die Skripte werden klassisch geladen, weil WKWebView bei `file://` keine Module erlaubt.
- Die Swift-Hülle bleibt klein. Neue Funktionen gehören möglichst in `www/`.

## Verhalten

Sei freundlich und respektvoll. Aus Kritik am Text wird keine Kritik an Menschen.
