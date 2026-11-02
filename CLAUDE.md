# Zwischen Ost und West – Hinweise für die Entwicklung

Tauri-2-Programm. Oberfläche und Spiellogik in `ui/` (ES-Module, kein Build-Schritt), Geräusche in `ui/ton.js` (Web Audio, synthetisch). Rust in `src-tauri/` nur für Spielstände (`spielstand_speichern/laden/loeschen`, Dateien unter dem App-Datenordner) und Updates (`update_pruefen`, `update_installieren`; `ui/update.js`). Alles auf Deutsch: Texte, Bezeichner, Kommentare.

Releases: Der Workflow `.github/workflows/build.yml` legt bei jedem Push auf `main` ein signiertes Release `v<Version>` mit `latest.json` an, wenn es diese Version noch nicht gibt (Secrets `TAURI_SIGNING_PRIVATE_KEY`/`_PASSWORD`, derselbe Schlüssel wie beim PDF-Tutor). Für eine neue Version also die Versionsnummer in `package.json`, `src-tauri/Cargo.toml` und `src-tauri/tauri.conf.json` erhöhen. Tags werden nicht von Hand gepusht.

Der Ausbauplan (mehrere Länder, Regierungen mit Zielen, vom Spiel gesteuerte Länder) steht in `docs/PLAN.md`. Dort festgelegte Entscheidungen gelten.

## Aufbau

- `ui/engine.js`: unabhängig von den Ländern. Der Spielstand ist die **Welt** (reines JSON): `welt.laender[id]` (Werte `w`, Flags `f`, `geplant`, `erledigt`, `wahlplan`, `chronik`, `verlauf` …), `welt.beziehungen[von][zu]` (0–100, hoch = gut, gerichtet), `welt.postfach`, `welt.weltflags`, `welt.queue` (Vorgänge aller Länder `{ land, id }`, nach Monat), `welt.spieler`. Zeit als `1952.1`/`1952.2`; rechnen nur über `zeitIndex`/`zeitPlus`.
- Engine-Funktionen nehmen `(W, welt, …)`; `W` ist das Welt-Szenario (`ui/szenarien/kalter_krieg/index.js`) mit `W.laender[id]` = Landesmodul.
- Inhalte eines Landes bekommen eine **Landsicht** `E.sicht(W, welt, land)`: verhält sich wie der Zustand eines Landes (`s.w`, `s.f`, `s.zeit`, `s.weltflags`). Werte mit `beziehung: 'usa'` in `werte` werden auf `welt.beziehungen.usa[land]` umgeleitet. Keine Spannungswerte: Beziehungen sind immer „hoch = gut“ (Moskau heißt `moskau`).
- Ereignis: `{ id, titel, datum, ab, bis, ordnung (Monat), wenn, nurGeplant, ausloeser, wiederholbar, art: 'akte', absender, ascii, text, optionen, historisch }`. Texte und Optionen dürfen Funktionen von `s` sein.
- Option: `{ text, hist, richtung: 'west'|'ost', wenn, nurWenn, w: {wert: delta} | s => {...}, setze, loesche, plane: [{id, in}], aktion(s, api), ergebnis, zufall: [{ p, ...wirkung }, { ...sonst }] }`. `api` bietet `zufall`, `normal`, `wende`, `plane`, `ende`, `sende(an, art, daten)`, `weltflag`.
- Postfach: `a.sende('brd', 'angebot')`; ein Ereignis mit `ausloeser: 'angebot'` kommt nur bei offener Nachricht und beantwortet sie.
- Vorgänge nicht gespielter Länder entscheidet die Engine sofort (Platzhalter bis Phase 2: historische, sonst erste Option; `W.ki` ersetzt das). Nach jeder Entscheidung prüft `aktualisiereQueue` für alle Länder, was im selben Halbjahr neu möglich ist.
- Dynamische Ereignisse (`dyn:regierungsbildung`, `dyn:koalitionskrise`, `dyn:kriegsgefahr`, `dyn:haushaltsnotstand`, `dyn:fraktionsrevolte`) baut `brd/modell.js` aus dem Zustand; Krisen meldet ein Land über `s.einschub`.
- `szenarien/kalter_krieg/brd/modell.js`: Wachstum, Arbeitslosigkeit, Haushalt, Umfragen, Wahlen, Koalitionsbereitschaft. Kalibriert so, dass die Strategie `historisch` ungefähr 45/50/45 % für die Union 1953/57/61 ergibt (Test in `tests/spiel.test.mjs`).
- **Gespielt wird die Bundesregierung, nicht eine Partei.** `s.kanzlerpartei` ('Union' | 'SPD', fehlt = Union), `s.kanzlerliste` (für den Abschlussbericht). Kann die Kanzlerpartei nach einer Wahl regieren, wählt der Spieler die Koalition; sonst bildet `bildeRegierung` die neue Regierung (andere Partei allein → mit FDP → Große Koalition unter der stärkeren → Minderheitsregierung), ebenso beim konstruktiven Misstrauensvotum. Wechsel immer über `wechsleRegierung`. Umfrage (`zustimmung`) gilt der Kanzlerpartei; für die Union sind alle Formeln unverändert. Es gibt kein Ende „Wahlniederlage“ mehr.

## Prüfen

- `npm test` muss grün sein; nach Änderungen an Zahlen `npm run sim` ansehen (alle Strategien, Enden, Wahlergebnisse, nie gesehene Ereignisse).
- Reine Umbauten am Ablauf: vorher und nachher dieselben Partien aufzeichnen (gleicher Seed, gleiche Entscheidungen) und auf exakte Gleichheit vergleichen.
- Neue Ereignisse brauchen einen Weg, auf dem sie erreichbar sind (Test „Jedes Ereignis kommt vor“).
- Ereignisse, die auch im vereinigten Deutschland vorkommen, dürfen dort nicht von DDR, Mauer, Zonengrenze oder „Bundesrepublik“ sprechen: Texte als Funktion schreiben (`land(s)`, `hauptstadt(s)`) oder das Ereignis mit `geteilt` einschränken. `tests/einheit.test.mjs` prüft das.
- Texte müssen auch unter einer SPD-geführten Regierung stimmen: Unionsminister (Schäffer, Erhard als Minister, Strauß, Brentano …) nur nennen, wenn `unionRegiert(s)`; die SPD nicht als Opposition darstellen, wenn `spdRegiert(s)` (Helfer in `hilfen.js`, Wahlkampf der SPD: `SPD_WAHLKAMPF`). Rein unionsinterne Vorgänge (Spiegel-Affäre, FIG, Atlantiker, Volksaktie …) mit `wenn: unionRegiert` einschränken. `tests/regierung.test.mjs` prüft das, indem es in vielen Partien zu einem zufälligen Zeitpunkt die SPD an die Regierung bringt.
- Vorhaben ohne Kosten sind immer wählbar, auch bei leerem Haushalt.
- Vorlagen (Ereignistexte, Optionen) sprechen den Spieler mit „du“ an; Ergebnistexte (`ergebnis`) stehen in der dritten Person („der Kanzler“, „Bonn“), weil sie im Vermerk und in der Zeitung erscheinen. `tests/spieler.mjs` prüft das.
- Das Halbjahr beginnt ohne Lagebericht direkt mit dem ersten Vorgang. Zeitgeschehen und Rückblick stehen in der Zeitung (`main.js`, `ausgabe()`); die Meldungen jedes Halbjahrs liegen in `L.ausgaben`.
- Historische Angaben in `historisch` und `zeitgeschehen.js` sorgfältig prüfen; erfundene Ereignisse im Alternativstrang als Fiktion kennzeichnen.
