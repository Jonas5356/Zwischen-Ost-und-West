# Plan: Mehrere Länder mit Regierungen und Zielen

Stand: November 2026. Phase 1 ist umgesetzt (Version 0.2.0).

## Ziel

Eine gemeinsame Welt 1949–1964, später erweiterbar, mit mehreren Ländern. Jedes Land außer den USA und der Sowjetunion soll am Ende spielbar sein; die beiden Supermächte steuert immer das Spiel. Gespielt wird von einer Person (kein Hotseat).

**Grundsatz:** Jede Entscheidung funktioniert für Mensch und Spiel gleich. Spielt man Frankreich, entscheidet das Spiel für die BRD anhand derselben Vorlagen, die man als BRD-Spieler sieht. Jede Option braucht deshalb Angaben, aus denen sich ihr Nutzen berechnen lässt.

## Festgelegte Entscheidungen

- **Beziehungen:** eine Skala für alle Länder und Richtungen, 0–100, hoch = gut. Kein getrennter Spannungswert; „Spannung mit Moskau“ ist zu „Beziehung zu Moskau“ geworden (gespiegelt). Beziehungen sind gerichtet: `beziehungen[von][zu]` = wie Land `von` Land `zu` sieht.
- **Geschichtstreue wie in Hearts of Iron IV:** „historisch“ heißt, die Länder verfolgen die Ziele ihrer historischen Regierungen, nicht dass sie dasselbe tun. Ändert sich die Regierung anders als in der Geschichte (z. B. erfolgreicher Generalsputsch in Frankreich 1961), gelten die Ziele der neuen Regierung. Daneben ein Modus „zufällig“; vorgesehen ist ein Regler, der beides mischt.
- **Kein Bonus für historische Optionen;** Geschichtstreue entsteht allein über Ziele und Regierungswechsel.
- **Zeitraum:** vorerst 1949–1964, mit dem Ziel späterer Erweiterung.
- **Spielstände:** Beim Umbau dürfen alte Spielstände ungültig werden.
- **Länderreihenfolge** nach Frankreich: entscheidet Jonas später.
- **Offen:** Ziele der anderen Länder offen anzeigen (wie HOI4) oder nur vermutet (über Botschaftsberichte, verborgene Typen, z. B. ob die Stalin-Note ernst gemeint ist)?

## Aufbau

### Weltzustand (umgesetzt)

```
welt = {
  version: 2, szenario, seed, rng, zeit, runde,
  spieler: ['brd'],
  laender: { brd: { w, f, kanzler, regierung, sitze, wahlplan, geplant, erledigt, chronik, verlauf, … }, usa: {…}, … },
  beziehungen: { usa: { brd: 55 }, su: { brd: 50 }, … },
  postfach: [ { nr, von, an, art, daten, zeit, offen } ],
  weltflags: { koreakrieg, stalin_tot, … }, weltErledigt,
  queue: [ { land, id } ], pos, phase, ergebnis, ende,
}
```

- Inhalte eines Landes sehen eine **Landsicht** (`E.sicht(W, welt, land)`), die sich wie der frühere Spielstand eines Landes verhält. Werte mit `beziehung: 'usa'` in der Wertedefinition werden in die Beziehungstabelle umgeleitet („wie die USA mich sehen“), sodass Wirkungen wie `{ usa: +5, moskau: -8 }` unverändert funktionieren.
- **Postfach:** `a.sende(an, art, daten)`; ein Ereignis mit `ausloeser: 'art'` kommt nur, wenn eine offene Nachricht dieser Art vorliegt, und beantwortet sie.
- **Weltereignisse** (`weltereignisse.js`) laufen ohne Entscheidung zu Beginn eines Halbjahrs und setzen Weltflags.
- **Gemeinsame Vorgangsliste:** Die Vorgänge aller Länder werden pro Halbjahr nach Monat sortiert. Vorgänge von Ländern, die nicht gespielt werden, entscheidet das Spiel sofort (vorerst Platzhalter: historische, sonst erste Option; über `W.ki` austauschbar). Nach jeder Entscheidung wird für alle Länder geprüft, was im selben Halbjahr neu möglich ist. So kann ein Angebot im März noch im September beantwortet werden.

### Regierungen und Ziele (Phase 2)

Pro Land `regierungen.js`, z. B. Frankreich: Vierte Republik (Mitte) → de Gaulle (Mai 1958, wenn Algerienkrieg und Instabilität) → Militärjunta (Generalsputsch 1961, wenn de Gaulle geschwächt); dazu nicht-historische Alternativen (z. B. Volksfront mit der PCF). Jede Regierung hat:

- **Grundhaltungen** als Gewichte a_k auf Werte (Sicherheit, Wirtschaft, Unabhängigkeit, Prestige, Westbindung …),
- **konkrete Ziele** mit Gewicht b_g (z. B. „Algerien halten“), optional mit Aufgabe-Bedingung (pragmatische Regierungen geben ein Ziel auf, wenn die Kosten eine Schwelle überschreiten),
- **Berechenbarkeit** λ.

Übergänge zwischen Regierungen sind Ereignisse mit Bedingung und Wahrscheinlichkeit. Im Modus „historisch“ tritt der historische Übergang ein, wenn die Bedingungen ähnlich sind wie damals; im Modus „zufällig“ wird unter plausiblen Übergängen gelost und die Gewichte streuen (etwa ±30 %).

### Entscheidungslogik (Phase 2)

Nutzen einer Option o:

U(o) = Σ_k a_k · E[Δw_k(o)] + Σ_g b_g · d_g(o)

- E[Δw_k(o)]: erwartete Veränderung von Wert k; Zufallsausgänge werden mit ihren (zustandsabhängigen) Wahrscheinlichkeiten gewichtet.
- d_g(o) ∈ {−1, 0, +1}: schadet/dient die Option Ziel g; neues Feld `dient: ['atomstreitmacht', '-europa']`.

Wahl per Logit: P(o) = exp(λ·U(o)) / Σ_o' exp(λ·U(o')). λ = 0 heißt zufällig, großes λ heißt fast immer die beste Option.

### Länder

- **USA und Sowjetunion:** immer gesteuert, mit Regierungen (Truman, Eisenhower/Dulles, Kennedy, Johnson; Stalin, kollektive Führung 1953–55 mit Berija-Variante, Chruschtschow).
- **Alle anderen:** zuerst Nebenrolle (Regierungen, Ziele, die 15–30 Entscheidungen, die andere betreffen), dann spielbar (Innenpolitik, Akten, Vorhaben, Enden, Lagebild).
- **Innenpolitik-Typen** zum Wiederverwenden: parlamentarisch (Wahlen, Koalitionen), präsidial, autoritär (Machtbasis aus Armee/Partei/Straße; Ende durch Putsch oder Aufstand). Die BRD behält ihr eigenes Modell.

### Oberfläche

Startbildschirm mit Länderwahl und Reglern (Geschichtstreue, Berechenbarkeit); Karte „Die Welt“ im Lagebild (Regierung, Ziele, Beziehung je wichtigem Land); Entscheidungen anderer Länder als Meldungen im Lagebericht; Angebote anderer Länder als Akten.

## Prüfen

- Rückwärtsprüfung: BRD mit historischen Entscheidungen in einer Welt im Modus „historisch“ ≈ 45 / 50 / 45 % für die Union 1953/57/61.
- Weltsimulation: alle Länder gesteuert, viele Partien im Modus „historisch“; die großen Wendepunkte (EVG scheitert, de Gaulle 1958, Suez, Mauerbau, Élysée) sollen grob in 60–80 % der Partien eintreten, im Modus „zufällig“ deutlich seltener. Damit werden Gewichte und λ kalibriert.
- Pro Land: jedes Ereignis erreichbar; Texte passen zur Regierung (Verallgemeinerung von `tests/einheit.test.mjs`).

## Phasen

| Phase | Inhalt | Stand |
|---|---|---|
| 1 | Weltzustand, BRD als Landesmodul, Postfach, Weltereignisse, gerichtete Beziehungen mit einheitlicher Skala, gemeinsame Vorgangsliste, Hüllen für USA/SU/Frankreich/Großbritannien | **erledigt (0.2.0)**: 600 Referenzpartien vor und nach dem Umbau identisch |
| 2 | Entscheidungslogik, Regierungen, Geschichtstreue-Regler; USA und SU mit Regierungen und Zielen; Frankreich als Nebenrolle; gemeinsame Ereignisse BRD–Frankreich/Moskau zweiseitig (Schuman-Plan, EVG, Saar, Colombey, Élysée, Stalin-Note, Berlin); `dient`-Angaben an allen BRD-Optionen; Karte „Die Welt“ | offen |
| 3 | Frankreich spielbar (Indochina, Algerien, EVG und Suez aus Pariser Sicht, Force de frappe, Mai 1958, Generalsputsch) | offen |
| 4 ff. | weitere Länder, jeweils erst Nebenrolle, dann spielbar | offen |
