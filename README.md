# Charla – Spanisch lernen (iOS)

Charla ist eine private Lern-App für Spanisch (Niveau A1) mit deutscher Oberfläche. Sie arbeitet nach dem gleichen Prinzip wie klassische Sprachkurs-Apps:

- **Lektionen** mit Vokabeln, einem Dialog und einem Grammatik-Tipp (5 Einheiten, 20 Lektionen, rund 220 Wörter und Sätze)
- **Viele Übungsarten:** Wort kennenlernen, Auswahl (Spanisch ↔ Deutsch), Bildauswahl, Hören, Zuordnen, Tippen, Diktat, Satz bauen, Lückentext, Sprechen, Dialog, passende Antwort
- **Wiederholen** mit Intervall-Training (Leitner-System, 7 Stufen von 10 Minuten bis 90 Tage). Die Übungsart wird mit der Stufe schwerer.
- **Wortschatz-Liste** mit Suche und Favoriten
- **Tagesziel, Serie, Erfahrungspunkte (XP) und Sterne**
- **Sprachausgabe und Spracherkennung** über die iOS-Funktionen (Stimme und Tempo einstellbar)
- Dunkelmodus, Haptik, Töne, Export und Import des Lernstands

Die App ist ein eigenes Werk. Sie nutzt weder Inhalte noch Name oder Gestaltung eines anderen Anbieters und ist nur für den privaten Gebrauch gedacht.

## Aufbau

```
www/            Die komplette App (HTML, CSS, JavaScript) – läuft auch direkt im Browser
Charla/         Die iOS-Hülle in Swift (WebView, Sprachausgabe, Spracherkennung, Speicherung)
project.yml     Beschreibung des Xcode-Projekts (für XcodeGen)
build_ipa.sh    Baut die .ipa auf einem Mac
.github/        Workflow, der die .ipa kostenlos bei GitHub baut
tests/          Automatische Tests (Node.js + Playwright)
```

Die App braucht kein Internet und keine fremden Bibliotheken. Alle Inhalte stecken in `www/js/content/`.

## Weg 1: .ipa mit GitHub bauen (ohne Mac)

Eine .ipa-Datei lässt sich nur mit Apples Werkzeugen bauen. GitHub stellt dafür kostenlos Mac-Rechner bereit.

1. Lege bei GitHub ein neues, **privates** Repository an und lade den gesamten Inhalt dieses Ordners hoch (auch den versteckten Ordner `.github`).
2. Öffne im Repository den Reiter **Actions** und starte den Workflow **IPA bauen** (Schaltfläche „Run workflow“). Nach dem ersten Hochladen startet er auch von selbst.
3. Nach etwa 5 bis 10 Minuten findest du unten auf der Seite des Durchlaufs den Download **Charla-ipa**. Darin liegt `Charla.ipa`.
4. Falls der Durchlauf rot ist, lade das Protokoll **build-log** herunter und schicke es mir. Ich habe die Swift-Dateien hier nicht kompilieren können, ein kleiner Fehler wäre dort schnell behoben.

## Weg 2: .ipa auf dem eigenen Mac bauen

```bash
brew install xcodegen
./build_ipa.sh
```

Das Skript erzeugt `Charla.ipa`. Alternativ kannst du mit `xcodegen generate` das Projekt `Charla.xcodeproj` erzeugen, es in Xcode öffnen, unter „Signing & Capabilities“ deine Apple-ID als Team wählen und die App direkt auf dein iPhone starten.

## Auf das iPhone bringen

Die gebaute .ipa ist **nicht signiert**. Du musst sie einmal mit deiner Apple-ID signieren:

- **Sideloadly** (Windows und Mac): iPhone per Kabel anschließen, `Charla.ipa` in das Fenster ziehen, Apple-ID eintragen, „Start“ drücken.
- **AltStore:** Charla.ipa in der AltStore-App unter „My Apps“ mit dem Plus-Zeichen hinzufügen.

Danach auf dem iPhone unter *Einstellungen → Allgemein → VPN & Geräteverwaltung* dem eigenen Entwickler-Profil vertrauen. Bei Bedarf muss unter *Einstellungen → Datenschutz & Sicherheit* der **Entwicklermodus** eingeschaltet werden.

Mit einer kostenlosen Apple-ID läuft die App **7 Tage**. Dann musst du sie mit demselben Programm erneut signieren (AltStore kann das automatisch im WLAN). Dein Lernstand bleibt dabei erhalten, solange du die App nicht vorher löschst. Zur Sicherheit liegt er als Datei `charla-lernstand.json` im App-Ordner, den du in der Dateien-App unter „Auf meinem iPhone → Charla“ siehst. In *Profil* gibt es außerdem Export und Import.

## Weg 3: Im Browser testen

`www/index.html` im Browser öffnen, am besten in der Handy-Ansicht. Sprachausgabe und Spracherkennung funktionieren dort je nach Browser (Safari und Chrome unterstützen beides in unterschiedlichem Umfang). Auf dem iPhone kannst du die Seite in Safari über „Teilen → Zum Home-Bildschirm“ als App ablegen. Dann gibt es aber keine native Spracherkennung und der Lernstand liegt nur im Browser.

## Tests

```bash
node tests/validate.js   # prüft alle Inhalte und erzeugt zufällig viele Übungen
node tests/e2e.js        # spielt Lektion und Wiederholung in einem Handy-Browser durch (Playwright)
```

## Eigene Inhalte ergänzen

Neue Lektionen kommen in eine der Dateien `www/js/content/u1.js` bis `u5.js` oder in eine neue Datei `u6.js` (dann in `www/index.html` einbinden). Jede Lektion hat diese Teile:

```js
{
  title: 'En el café', sub: 'Im Café bestellen', emoji: '☕',
  tip: ['Titel des Tipps', 'Text des Tipps'],
  items: [
    // [Spanisch, Deutsch, Emoji, Beispielsatz, Übersetzung, [weitere richtige Antworten]]
    ['un café', 'ein Kaffee', '!☕', 'Un café, por favor.', 'Einen Kaffee, bitte.']
  ],
  dialogue: ['Im Café', [ ['Camarero', 'Hola.', 'Hallo.'] ]]
}
```

Ein `!` vor dem Emoji macht daraus eine Bildauswahl-Aufgabe. Ein leerer Beispielsatz bedeutet, dass das Wort nur als Vokabel geübt wird. Danach `node tests/validate.js` ausführen.

## Hinweise

- Die Stimmen kommen von iOS. Für bessere Qualität lädst du in *Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Spanisch* eine „Erweitert“- oder „Premium“-Stimme herunter. In Charla wählst du sie dann unter *Profil → Stimme*.
- Die Spracherkennung braucht in der Regel eine Internetverbindung (Apple-Dienst) und beim ersten Mal deine Erlaubnis für Mikrofon und Spracherkennung.
- Die Inhalte sind ein Einsteigerkurs. Die Spanisch-Texte wurden sorgfältig geprüft, ein Muttersprachler oder eine Lehrkraft sollte aber bei Zweifeln darüberschauen.
