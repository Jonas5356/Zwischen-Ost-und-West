# Plan: Mehrere Länder mit Regierungen und Zielen

Stand: November 2026. Phase 1 ist umgesetzt (Version 0.2.0). Seit 0.3.0 kann in der BRD auch die SPD regieren, ohne dass das Spiel endet – Voraussetzung dafür, dass die BRD später vom Spiel gesteuert werden kann. Seit 0.4.0 handeln USA und Sowjetunion mit eigenen Regierungen und Zielen (erster Teil von Phase 2). Seit 0.5.0 ist Frankreich spielbar; wer Frankreich spielt, dem steht eine vom Spiel gesteuerte Bundesrepublik gegenüber (und umgekehrt). Seit 0.6.0 beginnt die Welt 1946; Länder steigen ein, wenn sie entstehen (Bundesrepublik 1949).

## Ziel

Eine gemeinsame Welt 1946–1964, später erweiterbar, mit mehreren Ländern. Jedes Land außer den USA und der Sowjetunion soll am Ende spielbar sein; die beiden Supermächte steuert immer das Spiel. Gespielt wird von einer Person (kein Hotseat).

**Grundsatz:** Jede Entscheidung funktioniert für Mensch und Spiel gleich. Spielt man Frankreich, entscheidet das Spiel für die BRD anhand derselben Vorlagen, die man als BRD-Spieler sieht. Jede Option braucht deshalb Angaben, aus denen sich ihr Nutzen berechnen lässt.

## Festgelegte Entscheidungen

- **Beziehungen:** eine Skala für alle Länder und Richtungen, 0–100, hoch = gut. Kein getrennter Spannungswert; „Spannung mit Moskau“ ist zu „Beziehung zu Moskau“ geworden (gespiegelt). Beziehungen sind gerichtet: `beziehungen[von][zu]` = wie Land `von` Land `zu` sieht.
- **Geschichtstreue wie in Hearts of Iron IV:** „historisch“ heißt, die Länder verfolgen die Ziele ihrer historischen Regierungen, nicht dass sie dasselbe tun. Ändert sich die Regierung anders als in der Geschichte (z. B. erfolgreicher Generalsputsch in Frankreich 1961), gelten die Ziele der neuen Regierung. Daneben ein Modus „zufällig“; vorgesehen ist ein Regler, der beides mischt.
- **Kein Bonus für historische Optionen;** Geschichtstreue entsteht allein über Ziele und Regierungswechsel.
- **Zeitraum:** seit 0.6.0 1946–1964 (Beginn des Kalten Kriegs), mit dem Ziel späterer Erweiterung.
- **Einstiege (0.6.0):** Die Welt beginnt für alle 1946/I. Ein Land, das es noch nicht gibt, steigt ein, wenn es entsteht (Bundesrepublik 1949/II; später Indien, Israel, Südkorea …). Länder können im Lauf einer Partie nicht gewechselt werden. Entsteht ein Land wegen der Entscheidungen der anderen nicht, gibt es es in dieser Partie nicht – in einer anderen kann man es wählen. Wird es gespielt, entsteht es immer: Optionen, die seine Gründung verhindern würden (`gegenGruendung`), sind dann gesperrt. Ohne Weststaat bleibt Deutschland vorerst einfach besetzt; später sollen die Kosten einer langen Besatzung steigen und einen Anreiz schaffen, Deutschland (in welcher Form auch immer) entstehen zu lassen.
- **Präsidialverfassung 1946 (Fiktion):** schlank – stützt den Rückhalt der Regierungen und erlaubt die Auflösung schon nach einem Sturz.
- **Spielstände:** Beim Umbau dürfen alte Spielstände ungültig werden.
- **Länderreihenfolge** nach Frankreich: entscheidet Jonas später.
- **Gespielt wird ein Staat, nicht eine Partei:** Regierungswechsel beenden das Spiel nicht; der Spieler führt die neue Regierung weiter (umgesetzt für die BRD in 0.3.0: Union oder SPD als Kanzlerpartei, Koalitionswahl nur, wenn die Kanzlerpartei regieren kann). Für die BRD-Regierungen in Phase 2 heißt das: Union- und SPD-Regierungen bekommen eigene Ziele.
- **Ziele nur vermutet:** Die Regierungen der anderen Länder sind öffentlich, ihre Absichten nicht. Verborgene Typen (z. B. ob die Stalin-Note ernst gemeint ist) werden beim Amtsantritt ausgelost; der Spieler schätzt sie nach Bayes aus Handlungen und Berichten (Treffsicherheit abhängig von BND und Botschaft in Moskau). Im Lagebild in Worten, im Dossier mit Wahrscheinlichkeiten; der Abschlussbericht verrät die Wahrheit.
- **Ein Regler „Geschichtstreue“** beim neuen Spiel; die Berechenbarkeit λ ist pro Regierung fest.
- **Ereignislisten der Supermächte** (umgesetzt in 0.4.0) müssen angepasst werden, wenn weitere Länder spielbar werden.
- **Frankreich** (0.5.0): Kolonialkriege (Indochina, Algerien) sind ein eigener Strang mit Kriegslage und Loyalität der Armee. Regierungsstürze ergeben sich aus der Lage: Ist die Republik instabil, stürzen Regierungen ungefähr so oft wie in der Geschichte; wer sie stabilisiert (Verfassungsreform, Zufriedenheit, Frieden in den Kolonien, breite Mehrheit), regiert lange. Gewählt wird regulär alle fünf Jahre; vorgezogen nur nach einer Auflösung, die (wie Art. 51 der Verfassung von 1946) erst nach zwei Stürzen binnen 18 Monaten möglich ist, oder nach einem Verfassungswechsel. Kein Zwischenrelease: Frankreich als gesteuertes und als spielbares Land kam zusammen.
- **Wechselwirkung zwischen spielbaren Ländern** läuft über das Postfach (Angebot → Antwort, auch im selben Halbjahr), Weltflags und die Wirkung `bei` an Optionen; trifft eine Entscheidung eines gesteuerten Landes den Spieler unmittelbar, bekommt er ein Telegramm. Sofortige Rückfragen gehen nur an Länder, die nie gespielt werden (USA, SU).

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
| 2a | Entscheidungslogik (`ki.js`), Regierungen mit verborgenen Typen, Einschätzung nach Bayes, Geschichtstreue-Regler; USA und SU mit Regierungen, Zielen und eigenen Entscheidungen (Stalin-Note, 17. Juni, Moskau 1955, Ungarn, Berlin-Ultimatum, Mauer, Kuba; Wehrbeitrag, Viermächtekonferenz, EVG-Druck, Radford, Suez, Teilhabe, Essentials, MLF); Rückfragen; Karte „Die Welt“ und Dossier | **erledigt (0.4.0)** |
| 2b | Frankreich als Nebenrolle; Ereignisse BRD–Frankreich zweiseitig (Schuman-Plan, Pleven-Plan, EVG, Saar, Suez, Römische Verträge, FIG, Colombey, Élysée); BRD als gesteuertes Land (Regierungen aus dem eigenen Modell, Ziele aus Richtung und `dient`) | **erledigt (0.5.0)** |
| 3 | Frankreich spielbar (Vierte Republik mit Regierungsstürzen, Indochina, Algerien, EVG und Suez aus Pariser Sicht, Force de frappe, Mai 1958, Fünfte Republik, Generalsputsch, Évian), Länderwahl beim Spielstart | **erledigt (0.5.0)** |
| 4 ff. | weitere Länder, jeweils erst Nebenrolle, dann spielbar | offen |
