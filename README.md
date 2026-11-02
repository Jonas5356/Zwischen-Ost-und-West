# Zwischen Ost und West

Eine textbasierte Politiksimulation über die Anfangsjahre der Bundesrepublik. Du führst die Bundesregierung vom Herbst 1949 bis zum Frühjahr 1964, Halbjahr für Halbjahr – durch Petersberger Abkommen, Stalin-Note, Wiederbewaffnung, Römische Verträge, Mauerbau und Spiegel-Affäre.

Angeregt von [Third Bloc](https://store.steampowered.com/app/5155860/Third_Bloc/), aber mit einem konkreten Land und den tatsächlichen Ereignissen statt einer erfundenen Republik.

## Installation

Unter **Releases** (oder in den **Actions** unter „Artifacts“ des letzten Laufs) liegt der Windows-Installer `Zwischen Ost und West_…_x64-setup.exe`. Herunterladen und ausführen. Das Programm ist nicht signiert; Windows SmartScreen warnt deshalb beim ersten Start („Weitere Informationen“ → „Trotzdem ausführen“).

**Updates:** Ab Version 0.3.0 sucht das Programm beim Start nach einer neuen Version und bietet sie oben im Fenster an; außerdem gibt es im Menü „Nach Updates suchen“. Die Updates sind signiert und kommen aus den Releases dieses Repositorys. Ein neues Release entsteht automatisch, sobald die Versionsnummer in `src-tauri/tauri.conf.json` erhöht und auf `main` gepusht wird (dafür braucht das Repository die Secrets `TAURI_SIGNING_PRIVATE_KEY` und `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`).

Selbst bauen: `build_windows.bat` doppelklicken (braucht Rust und Node.js, das Skript sagt, was fehlt).

## Spielprinzip

- **Runden:** 30 Halbjahre, von 1949/II bis 1964/I.
- **Vorlagen:** In jedem Halbjahr landen die historischen Ereignisse als Entscheidungsvorlagen auf dem Schreibtisch, dazu Briefe von Ministern, Verbänden und Zeitgenossen (Böckler, Heuss, Heisenberg, Fritz Bauer …). Am Ende des Halbjahrs bringst du ein Regierungsvorhaben ein – Lastenausgleich, Kindergeld, Kartellgesetz, Autobahnbau.
- **Lagebild:** Beziehungen zu Washington, Paris, London und Moskau (0–100, hoch heißt gut), Souveränität, Aussicht auf Einheit, europäische Integration, Umfragewerte der Kanzlerpartei, Ansehen des Kanzlers, Koalitionsklima, Wachstum, Arbeitslosigkeit, Haushalt, Fluchtbewegung aus der DDR.
- **Wahlen und Regierungswechsel:** 1953, 1957 und 1961 wird gewählt. Kann die Kanzlerpartei eine Mehrheit bilden, wählst du die Koalition. Verliert sie die Mehrheit oder zerbricht die Koalition im konstruktiven Misstrauensvotum, bildet sich eine neue Regierung – etwa unter Ollenhauer oder Brandt – und du führst sie weiter, bis die Union vielleicht zurückkehrt. Vorbei ist das Spiel nur bei Staatsbankrott, einem Krieg mit Moskau oder wenn die Westmächte das Besatzungsrecht wieder in Kraft setzen. Der Abschlussbericht nennt alle Kanzler mit ihren Amtszeiten.
- **Washington und Moskau:** Die Supermächte steuert das Spiel. Ihre Regierungen wechseln – Präsidentschaftswahlen, Stalins Tod, Machtkämpfe im Kreml – und jede verfolgt eigene Ziele. Ob Moskau die Stalin-Note schickt, Ulbricht die Mauer erlaubt oder Raketen nach Kuba bringt, ob Washington einen Wehrbeitrag verlangt oder Truppen abziehen will, entscheiden sie selbst. Auf der Viermächtekonferenz und bei den Verhandlungen über die Einheit antwortet Moskau nach seinen Absichten.
- **Verborgene Absichten:** Was eine Regierung wirklich will (war die Stalin-Note ernst gemeint? geht Chruschtschow in Berlin aufs Ganze?), siehst du nicht. Das Auswärtige Amt schätzt es nach Bayes aus ihrem Handeln und aus Berichten von Botschaften und Diensten, die sich irren können. Die Einschätzung steht im Lagebild, mit Wahrscheinlichkeiten im Dossier; der Abschlussbericht verrät die Wahrheit.
- **Geschichtstreue:** Beim neuen Spiel stellst du ein, wie nah sich die Welt an die Geschichte hält – von „historisch“ (die historischen Regierungen mit ihren überlieferten Zielen) bis „frei“ (Stevenson, Nixon, Berija oder Molotow können an die Macht kommen, die Ziele streuen).
- **Zeitung:** Zu jedem Halbjahr erscheint eine Ausgabe der „Depesche“ mit den Entscheidungen des letzten Halbjahrs, Wahlergebnissen, Wirtschaftsdaten und Meldungen aus aller Welt. Sie ist freiwillige Lektüre; ältere Ausgaben lassen sich nachblättern.
- **Geräusche:** Schreibmaschine beim Erscheinen der Texte, Stempel bei Entscheidungen, Papier beim Umblättern, Fernschreiber am Wahlabend. Alles wird im Programm erzeugt, Lautstärke und Abschalten im Menü.
- **Randvermerke:** Nach jeder Entscheidung steht in violetter Schrift, was tatsächlich geschah. Am Ende zeigt der Abschlussbericht, wie oft du wie die historische Regierung entschieden hast.

## Die Geschichte kann anders verlaufen

Die Ereignisse hängen voneinander ab. Einige Beispiele:

- Wer die **Stalin-Note** 1952 ernsthaft prüft oder annimmt, bekommt eine Viermächtekonferenz. Gelingt sie, folgen ein Vertrag über die Einheit (mit der Frage der Oder-Neiße-Grenze), eine gesamtdeutsche Wahl und ein eigener Strang für ein neutrales Deutschland: Friedensvertrag, Währungsunion, Hauptstadtfrage, Bodenreform, Umgang mit der SED, EWG-Beitritt gegen Moskaus Willen. Einen Mauerbau gibt es dann nicht. Ein zweiter Weg zur Einheit öffnet sich auf der Berliner Konferenz 1954.
- Ob die **EVG** in Paris scheitert, hängt vom Verhältnis zu Frankreich ab. Kommt sie, gibt es keine Pariser Verträge und keinen NATO-Beitritt.
- Wer das **Saarstatut** ablehnt, riskiert, dass Frankreich die Westverträge nicht ratifiziert.
- Wer 1958 über eine **Freie Stadt West-Berlin** verhandelt, verhindert vielleicht die Mauer – zu einem hohen Preis.
- Ob die **Mauer** gebaut wird, hängt von der Fluchtbewegung und der Berlinkrise ab.
- Kandidiert Adenauer 1959 wirklich für das **Bundespräsidentenamt**, regiert ab dann Erhard.

## Technik

Tauri-2-Programm: die Oberfläche ist HTML/JavaScript ohne Build-Schritt (`ui/`), die Rust-Seite (`src-tauri/`) speichert Spielstände und holt Updates (`tauri-plugin-updater`, Befehle `update_pruefen` und `update_installieren`, Oberfläche in `ui/update.js`).

- `ui/engine.js` – Spielablauf, unabhängig von den Ländern: Weltzustand mit mehreren Ländern, gerichtete Beziehungen (0–100, hoch = gut), Postfach für Nachrichten zwischen Ländern, Weltereignisse, gemeinsame Vorgangsliste aller Länder nach Monat, Zufall, Speicherbarkeit
- `ui/szenarien/kalter_krieg/` – die Welt 1949–1964: `index.js` (Länder, Startbeziehungen), `weltereignisse.js`, je ein Modul pro Land
- `ui/szenarien/kalter_krieg/brd/` – die Bundesrepublik: `modell.js` (Wirtschafts-, Umfrage- und Wahlmodell, Koalitionsbildung, Krisen), Ereignisse nach Zeitabschnitten, `einheit.js` (alternativer Strang), `akten.js`, `vorhaben.js`, `enden.js`, `zeitgeschehen.js`
- `usa.js`, `su.js` – die Supermächte: Regierungen mit Zielen und verborgenen Typen, Regierungswechsel, eigene Entscheidungen
- `frankreich.js`, `grossbritannien.js` – vorerst Hüllen, die in den nächsten Ausbaustufen Regierungen und Ziele bekommen
- `ui/ki.js` – Entscheidungslogik der gesteuerten Länder (Nutzen aus Werten und Zielen, Wahl per Logit) und die Einschätzung ihrer Absichten nach Bayes
- `ui/main.js`, `ui/style.css`, `ui/ascii.js` – Oberfläche und ASCII-Szenen
- `ui/ton.js` – Geräusche, synthetisch mit Web Audio (keine Tondateien)

Wie es weitergeht (mehrere Länder, Regierungen mit Zielen, vom Spiel gesteuerte Länder), steht in [`docs/PLAN.md`](docs/PLAN.md).

Tests: `npm test` (spielt mehrere hundert Partien mit verschiedenen Strategien durch und prüft u. a., dass ein Durchlauf mit den historischen Entscheidungen ungefähr die historischen Wahlergebnisse ergibt). `npm run sim` zeigt eine Auswertung nach Strategien, `npm run welt -- 300 1` (Partien, Geschichtstreue) was die Supermächte tun und wie gut Bonn ihre Absichten erkennt.

Im Browser ausprobieren: im Ordner `ui` einen Webserver starten (`python -m http.server`) und `http://localhost:8000` öffnen.

## Lizenz

MIT. Die Schriften (Courier Prime, Barlow Semi Condensed) stehen unter der SIL Open Font License.
