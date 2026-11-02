# Zwischen Ost und West

Eine textbasierte Politiksimulation über die Anfangsjahre der Bundesrepublik. Du führst die Union als Kanzlerpartei vom Herbst 1949 bis zum Frühjahr 1964, Halbjahr für Halbjahr – durch Petersberger Abkommen, Stalin-Note, Wiederbewaffnung, Römische Verträge, Mauerbau und Spiegel-Affäre.

Angeregt von [Third Bloc](https://store.steampowered.com/app/5155860/Third_Bloc/), aber mit einem konkreten Land und den tatsächlichen Ereignissen statt einer erfundenen Republik.

## Installation

Unter **Releases** (oder in den **Actions** unter „Artifacts“ des letzten Laufs) liegt der Windows-Installer `Zwischen Ost und West_…_x64-setup.exe`. Herunterladen und ausführen. Das Programm ist nicht signiert; Windows SmartScreen warnt deshalb beim ersten Start („Weitere Informationen“ → „Trotzdem ausführen“).

Selbst bauen: `build_windows.bat` doppelklicken (braucht Rust und Node.js, das Skript sagt, was fehlt).

## Spielprinzip

- **Runden:** 30 Halbjahre, von 1949/II bis 1964/I.
- **Vorlagen:** In jedem Halbjahr landen die historischen Ereignisse als Entscheidungsvorlagen auf dem Schreibtisch, dazu Briefe von Ministern, Verbänden und Zeitgenossen (Böckler, Heuss, Heisenberg, Fritz Bauer …). Am Ende des Halbjahrs bringst du ein Regierungsvorhaben ein – Lastenausgleich, Kindergeld, Kartellgesetz, Autobahnbau.
- **Lagebild:** Vertrauen in Washington, Paris und London, Spannung mit Moskau, Souveränität, Aussicht auf Einheit, europäische Integration, Umfragewerte, Ansehen des Kanzlers, Koalitionsklima, Wachstum, Arbeitslosigkeit, Haushalt, Fluchtbewegung aus der DDR.
- **An der Macht bleiben:** 1953, 1957 und 1961 wird gewählt. Verliert die Union die Mehrheit oder findet sie keinen Partner, ist das Spiel vorbei. Koalitionsbruch, Staatsbankrott, eine Eskalation mit Moskau oder der Bruch mit den Westmächten können es ebenfalls beenden. Ein Kanzlerwechsel innerhalb der Union (Erhard, Schröder …) beendet es nicht.
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

Tauri-2-Programm: die Oberfläche ist HTML/JavaScript ohne Build-Schritt (`ui/`), die Rust-Seite (`src-tauri/`) speichert nur Spielstände.

- `ui/engine.js` – Spielablauf, unabhängig vom Land (Halbjahre, Ereigniswarteschlange, Wirkungen, Zufall, Speicherbarkeit)
- `ui/szenarien/brd1949/` – das Szenario: `modell.js` (Wirtschafts-, Umfrage- und Wahlmodell, Koalitionsbildung, Krisen), Ereignisse nach Zeitabschnitten, `einheit.js` (alternativer Strang), `akten.js`, `vorhaben.js`, `enden.js`, `zeitgeschehen.js`
- `ui/main.js`, `ui/style.css`, `ui/ascii.js` – Oberfläche und ASCII-Szenen
- `ui/ton.js` – Geräusche, synthetisch mit Web Audio (keine Tondateien)

Ein weiteres Land kommt als neuer Ordner unter `ui/szenarien/` hinzu, mit eigenem Modell und eigenen Ereignissen.

Tests: `npm test` (spielt mehrere hundert Partien mit verschiedenen Strategien durch und prüft u. a., dass ein Durchlauf mit den historischen Entscheidungen ungefähr die historischen Wahlergebnisse ergibt). `npm run sim` zeigt eine Auswertung nach Strategien.

Im Browser ausprobieren: im Ordner `ui` einen Webserver starten (`python -m http.server`) und `http://localhost:8000` öffnen.

## Lizenz

MIT. Die Schriften (Courier Prime, Barlow Semi Condensed) stehen unter der SIL Open Font License.
