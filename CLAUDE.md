# Zwischen Ost und West – Hinweise für die Entwicklung

Tauri-2-Programm. Oberfläche und Spiellogik in `ui/` (ES-Module, kein Build-Schritt), Rust in `src-tauri/` nur für Spielstände (`spielstand_speichern/laden/loeschen`, Dateien unter dem App-Datenordner). Alles auf Deutsch: Texte, Bezeichner, Kommentare.

## Aufbau

- `ui/engine.js`: szenariounabhängig. Spielstand ist ein reines JSON-Objekt (`s.w` Werte, `s.f` Flags, `s.queue` Vorgänge des Halbjahrs, `s.geplant`, `s.wahlplan`, `s.chronik`, `s.verlauf`). Zeit als `1952.1`/`1952.2`; rechnen nur über `zeitIndex`/`zeitPlus`.
- Ereignis: `{ id, titel, datum, ab, bis, ordnung (Monat), wenn, nurGeplant, art: 'akte', absender, ascii, text, optionen, historisch }`. Texte und Optionen dürfen Funktionen von `s` sein.
- Option: `{ text, hist, richtung: 'west'|'ost', wenn, w: {wert: delta} | s => {...}, setze, loesche, plane: [{id, in}], aktion(s, api), ergebnis, zufall: [{ p, ...wirkung }, { ...sonst }] }`.
- Nach jeder Entscheidung werden Ereignisse desselben Halbjahrs mit späterer `ordnung` neu geprüft (`aktualisiereQueue`): Ein Ereignis, dessen Bedingung erst durch eine Entscheidung erfüllt wird, kommt noch im selben Halbjahr.
- Dynamische Ereignisse (`dyn:regierungsbildung`, `dyn:koalitionskrise`, `dyn:kriegsgefahr`, `dyn:haushaltsnotstand`, `dyn:fraktionsrevolte`) werden in `modell.js` aus dem Zustand gebaut.
- `szenarien/brd1949/modell.js`: Wachstum, Arbeitslosigkeit, Haushalt, Umfragen, Wahlen (Sperrklausel, Sitzverteilung), Koalitionsbereitschaft. Kalibriert so, dass die Strategie `historisch` ungefähr 45/50/45 % für die Union 1953/57/61 ergibt (Test in `tests/spiel.test.mjs`).

## Prüfen

- `npm test` muss grün sein; nach Änderungen an Zahlen `npm run sim` ansehen (alle Strategien, Enden, Wahlergebnisse, nie gesehene Ereignisse).
- Neue Ereignisse brauchen einen Weg, auf dem sie erreichbar sind (Test „Jedes Ereignis kommt vor“).
- Historische Angaben in `historisch` und `zeitgeschehen.js` sorgfältig prüfen; erfundene Ereignisse im Alternativstrang als Fiktion kennzeichnen.
