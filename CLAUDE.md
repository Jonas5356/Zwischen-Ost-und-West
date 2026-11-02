# Zwischen Ost und West – Hinweise für die Entwicklung

Tauri-2-Programm. Oberfläche und Spiellogik in `ui/` (ES-Module, kein Build-Schritt), Geräusche in `ui/ton.js` (Web Audio, synthetisch). Rust in `src-tauri/` nur für Spielstände (`spielstand_speichern/laden/loeschen`, Dateien unter dem App-Datenordner). Alles auf Deutsch: Texte, Bezeichner, Kommentare.

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

## Prüfen

- `npm test` muss grün sein; nach Änderungen an Zahlen `npm run sim` ansehen (alle Strategien, Enden, Wahlergebnisse, nie gesehene Ereignisse).
- Reine Umbauten am Ablauf: vorher und nachher dieselben Partien aufzeichnen (gleicher Seed, gleiche Entscheidungen) und auf exakte Gleichheit vergleichen.
- Neue Ereignisse brauchen einen Weg, auf dem sie erreichbar sind (Test „Jedes Ereignis kommt vor“).
- Ereignisse, die auch im vereinigten Deutschland vorkommen, dürfen dort nicht von DDR, Mauer, Zonengrenze oder „Bundesrepublik“ sprechen: Texte als Funktion schreiben (`land(s)`, `hauptstadt(s)`) oder das Ereignis mit `geteilt` einschränken. `tests/einheit.test.mjs` prüft das.
- Vorhaben ohne Kosten sind immer wählbar, auch bei leerem Haushalt.
- Historische Angaben in `historisch` und `zeitgeschehen.js` sorgfältig prüfen; erfundene Ereignisse im Alternativstrang als Fiktion kennzeichnen.
