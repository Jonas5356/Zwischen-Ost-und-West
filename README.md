# Zwischen Ost und West

Eine textbasierte Politiksimulation über Europa im Kalten Krieg, vom Januar 1946 bis zum Frühjahr 1964, Halbjahr für Halbjahr. Zu Beginn wählst du dein Land:

- **Bundesrepublik Deutschland** (ab ihrer Gründung 1949) – durch Petersberger Abkommen, Stalin-Note, Wiederbewaffnung, Römische Verträge, Mauerbau und Spiegel-Affäre.
- **Frankreich** (ab 1946) – durch die Verfassungskämpfe der Nachkriegszeit, den Bruch mit den Kommunisten, den Marshallplan, die Regierungskrisen der Vierten Republik, Indochina und Điện Biên Phủ, Schuman-Plan und EVG, Suez, Algerien, den Mai 1958, de Gaulles Fünfte Republik und den Élysée-Vertrag.

Das jeweils andere Land, Großbritannien, die USA und die Sowjetunion steuert das Spiel: Sie verfolgen eigene Ziele, die du nur vermuten kannst.

Angeregt von [Third Bloc](https://store.steampowered.com/app/5155860/Third_Bloc/), aber mit einem konkreten Land und den tatsächlichen Ereignissen statt einer erfundenen Republik.

## Installation

Unter **Releases** (oder in den **Actions** unter „Artifacts“ des letzten Laufs) liegt der Windows-Installer `Zwischen Ost und West_…_x64-setup.exe`. Herunterladen und ausführen. Das Programm ist nicht signiert; Windows SmartScreen warnt deshalb beim ersten Start („Weitere Informationen“ → „Trotzdem ausführen“).

**Updates:** Ab Version 0.3.0 sucht das Programm beim Start nach einer neuen Version und bietet sie oben im Fenster an; außerdem gibt es im Menü „Nach Updates suchen“. Die Updates sind signiert und kommen aus den Releases dieses Repositorys. Ein neues Release entsteht automatisch, sobald die Versionsnummer in `src-tauri/tauri.conf.json` erhöht und auf `main` gepusht wird (dafür braucht das Repository die Secrets `TAURI_SIGNING_PRIVATE_KEY` und `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`).

Selbst bauen: `build_windows.bat` doppelklicken (braucht Rust und Node.js, das Skript sagt, was fehlt).

## Spielprinzip

- **Runden:** Halbjahre von 1946/I bis 1964/I. Die Welt beginnt 1946; jedes Land steigt ein, wenn es entsteht – die Bundesrepublik im Herbst 1949. Wer sie spielt, beginnt dort; was bis dahin geschah, entscheiden die anderen Länder, und die erste Zeitung blickt darauf zurück. Kommt es nicht zum Weststaat (Washington bleibt bei der Viermächteverwaltung, Paris verweigert sich, Berlin wird aufgegeben), gibt es die Bundesrepublik in dieser Partie nicht. Wer die Bundesrepublik spielt, für den kommt es immer zu ihrer Gründung.
- **Länderwahl:** Bundesrepublik oder Frankreich. Wo beide betroffen sind – Schuman-Plan, europäische Armee, Saar, Suez, Römische Verträge, Colombey, Élysée –, entscheidet jedes Land selbst; Angebote gehen hin und her. Trifft dich eine Entscheidung eines anderen Landes unmittelbar (Paris lässt die EVG scheitern, Bonn lehnt das Saarstatut ab), kommt ein **Telegramm**.
- **Vorlagen:** In jedem Halbjahr landen die historischen Ereignisse als Entscheidungsvorlagen auf dem Schreibtisch, dazu Briefe von Ministern, Verbänden und Zeitgenossen (Böckler, Heuss, Heisenberg, Fritz Bauer …). Am Ende des Halbjahrs bringst du ein Regierungsvorhaben ein – Lastenausgleich, Kindergeld, Kartellgesetz, Autobahnbau.
- **Lagebild:** In jedem Land dieselben Blöcke: Regierung (Umfrage, Ansehen, Rückhalt), Wirtschaft (Wachstum, Inflation, Arbeitslose, Haushalt) und Beziehungen (wie Washington, Moskau, London, Paris oder Bonn dein Land sehen; 0–100, hoch heißt gut), dazu ein Block mit den Werten, die es nur in diesem Land gibt – in der Bundesrepublik Souveränität, Einheit, Flucht aus der DDR und Europa. Zeigst du auf einen Wert, erklärt ein Kärtchen, was er ist, was ihn hebt und senkt, was er bewirkt und was ihn zuletzt bewegt hat.
- **Entscheidungen:** Neben den Vorgängen auf dem Schreibtisch kannst du jederzeit selbst handeln: dich um Washington, Moskau, London oder den Nachbarn bemühen, ein Konjunkturprogramm auflegen, um Kredite oder Hilfe bitten. Jede Entscheidung kostet etwas und braucht eine Pause, bevor man sie wiederholt. Wer gefragt wird, antwortet nach seinen Zielen – und danach, wie er dein Land sieht.
### Bundesrepublik

- **Wahlen und Regierungswechsel:** 1953, 1957 und 1961 wird gewählt. Kann die Kanzlerpartei eine Mehrheit bilden, wählst du die Koalition. Verliert sie die Mehrheit oder zerbricht die Koalition im konstruktiven Misstrauensvotum, bildet sich eine neue Regierung – etwa unter Ollenhauer oder Brandt – und du führst sie weiter, bis die Union vielleicht zurückkehrt. Vorbei ist das Spiel nur bei Staatsbankrott, einem Krieg mit Moskau oder wenn die Westmächte das Besatzungsrecht wieder in Kraft setzen. Der Abschlussbericht nennt alle Kanzler mit ihren Amtszeiten.

### Frankreich

- **Die Nachkriegsjahre:** 1946 regiert eine Provisorische Regierung aus Kommunisten, Sozialisten und Volksrepublikanern. Du entscheidest mit über die Verfassung (auch eine Präsidialverfassung nach de Gaulles Ideen von Bayeux ist möglich, die Regierungen stützt), über Ho Chi Minh und Haiphong, die Saar, den Rauswurf der Kommunisten, den Marshallplan, die Londoner Empfehlungen für einen Weststaat und die NATO.
- **Die Vierte Republik:** Jede Regierung hängt an einer brüchigen Mehrheit. Ihr Rückhalt in der Nationalversammlung sinkt mit Kolonialkriegen, Inflation und Entscheidungen, die Koalitionsparteien verprellen; je geringer er ist, desto eher stürzt die Regierung – dann bestimmst du mit, wer die nächste bildet (Tripartisme, Dritte Kraft, rechte Mitte, Mendès France, Republikanische Front …), und führst sie weiter. Ist das Land instabil, wechseln die Regierungen etwa so oft wie in der Geschichte; wer es stabilisiert (Verfassungsreform, Zufriedenheit, Frieden in den Kolonien), regiert lange. Gewählt wird alle fünf Jahre, vorzeitig nur nach einer Auflösung, die erst nach zwei Stürzen binnen 18 Monaten erlaubt ist.
- **Kolonialkriege:** Indochina und Algerien sind ein eigener Strang mit Kriegslage, Kriegsmüdigkeit und der Loyalität der Armee. Mit Verstärkungen oder Truppenabzug bestimmst du den Einsatz: Mehr Truppen halten die Lage, kosten aber Jahr für Jahr Geld und Geduld. Eine harte Linie kann einen Krieg militärisch gewinnen (Fiktion) – oder das Land in den Staatsbankrott treiben; eine zu schwache Front bricht zusammen. Wie ein Krieg ausgegangen ist, steht in Zeitung, Lagebild und Abschlussbericht. Verliert die Republik die Armee, kommt es zum Mai 1958 – mit de Gaulle, einer Militärregierung oder einer Volksfront – oder zum Bürgerkrieg.
- **Landesspezifisch:** Indochina, Algerien, Loyalität der Armee, Atomprogramm, Europa und der Franc. Die Zeitung heißt „Le Messager“.
- **Enden:** Bürgerkrieg, Staatsbankrott oder ein Krieg der Supermächte; sonst der Abschlussbericht mit allen Regierungschefs.
- **Washington und Moskau:** Die Supermächte steuert das Spiel. Ihre Regierungen wechseln – Präsidentschaftswahlen, Stalins Tod, Machtkämpfe im Kreml – und jede verfolgt eigene Ziele. Ob Moskau die Stalin-Note schickt, Ulbricht die Mauer erlaubt oder Raketen nach Kuba bringt, ob Washington einen Wehrbeitrag verlangt oder Truppen abziehen will, entscheiden sie selbst. Auf der Viermächtekonferenz und bei den Verhandlungen über die Einheit antwortet Moskau nach seinen Absichten.
- **London:** Großbritannien steuert vorerst das Spiel. Gewählt wird nach Lage – Attlee kann 1950 klar gewinnen, Labour 1955 an der Regierung bleiben, nach Suez Butler statt Macmillan kommen. Ob London Indien entlässt, die Bombe baut, der Montanunion beitritt, Truppen auf dem Kontinent zusagt, Suez mitträgt oder in die EWG will, entscheidet die jeweilige Regierung nach ihren Zielen. Du kannst London um Abstimmung gegen Washington (Paris) oder um Rückendeckung für Berlin (Bonn) bitten; die Antwort kommt als Telegramm.
- **Verborgene Absichten:** Was eine Regierung wirklich will (war die Stalin-Note ernst gemeint? geht Chruschtschow in Berlin aufs Ganze?), siehst du nicht. Das Auswärtige Amt schätzt es nach Bayes aus ihrem Handeln und aus Berichten von Botschaften und Diensten, die sich irren können. Die Einschätzung steht im Lagebild, mit Wahrscheinlichkeiten im Dossier; der Abschlussbericht verrät die Wahrheit.
- **Geschichtstreue:** Beim neuen Spiel stellst du ein, wie nah sich die Welt an die Geschichte hält – von „historisch“ (die historischen Regierungen mit ihren überlieferten Zielen) bis „frei“ (Stevenson, Nixon, Berija oder Molotow können an die Macht kommen, die Ziele streuen).
- **Zeitung:** Zu jedem Halbjahr erscheint eine Ausgabe der „Depesche“ mit den Entscheidungen des letzten Halbjahrs, Wahlergebnissen, Wirtschaftsdaten und Meldungen aus aller Welt. Sie ist freiwillige Lektüre; ältere Ausgaben lassen sich nachblättern.
- **Geräusche:** Schreibmaschine beim Erscheinen der Texte, Stempel bei Entscheidungen, Papier beim Umblättern, Fernschreiber am Wahlabend. Alles wird im Programm erzeugt, Lautstärke und Abschalten im Menü.
- **Randvermerke:** Nach jeder Entscheidung steht in violetter Schrift, was tatsächlich geschah. Am Ende zeigt der Abschlussbericht, wie oft du wie die historische Regierung entschieden hast.

## Die Geschichte kann anders verlaufen

Die Ereignisse hängen voneinander ab. Einige Beispiele:

- Wer die **Stalin-Note** 1952 ernsthaft prüft oder annimmt, bekommt eine Viermächtekonferenz. Gelingt sie, folgen ein Vertrag über die Einheit (mit der Frage der Oder-Neiße-Grenze), eine gesamtdeutsche Wahl und ein eigener Strang für ein neutrales Deutschland: Friedensvertrag, Währungsunion, Hauptstadtfrage, Bodenreform, Umgang mit der SED, EWG-Beitritt gegen Moskaus Willen. Einen Mauerbau gibt es dann nicht. Ein zweiter Weg zur Einheit öffnet sich auf der Berliner Konferenz 1954.
- Ob die **EVG** scheitert, entscheidet die französische Nationalversammlung – je nach ihrer Zusammensetzung, nach dem, was Bonn in Brüssel zugesteht, und danach, ob Paris die Vertrauensfrage stellt. Kommt sie, gibt es keine Pariser Verträge und keinen NATO-Beitritt.
- Wer das **Saarstatut** ablehnt, riskiert, dass Frankreich die Pariser Verträge nicht ratifiziert.
- Ohne **Algerienkrieg** gibt es keinen Mai 1958 und keinen de Gaulle – und ohne de Gaulle keine Einladung nach Colombey und keinen Élysée-Vertrag.
- Wer 1958 über eine **Freie Stadt West-Berlin** verhandelt, verhindert vielleicht die Mauer – zu einem hohen Preis.
- Ob die **Mauer** gebaut wird, hängt von der Fluchtbewegung und der Berlinkrise ab.
- Kandidiert Adenauer 1959 wirklich für das **Bundespräsidentenamt**, regiert ab dann Erhard.

## Technik

Tauri-2-Programm: die Oberfläche ist HTML/JavaScript ohne Build-Schritt (`ui/`), die Rust-Seite (`src-tauri/`) speichert Spielstände und holt Updates (`tauri-plugin-updater`, Befehle `update_pruefen` und `update_installieren`, Oberfläche in `ui/update.js`).

- `ui/engine.js` – Spielablauf, unabhängig von den Ländern: Weltzustand mit mehreren Ländern, gerichtete Beziehungen (0–100, hoch = gut), Postfach für Nachrichten zwischen Ländern, Weltereignisse, gemeinsame Vorgangsliste aller Länder nach Monat, Zufall, Speicherbarkeit
- `ui/szenarien/kalter_krieg/` – die Welt 1946–1964: `index.js` (Länder, Startbeziehungen), `weltereignisse.js`, je ein Modul pro Land
- `ui/szenarien/kalter_krieg/brd/` – die Bundesrepublik: `modell.js` (Wirtschafts-, Umfrage- und Wahlmodell, Koalitionsbildung, Krisen), Ereignisse nach Zeitabschnitten, `einheit.js` (alternativer Strang), `akten.js`, `vorhaben.js`, `enden.js`, `zeitgeschehen.js`, `regierungen.js` (Ziele, wenn das Spiel Bonn steuert), `oberflaeche.js` (Bundestag, Zeitung, Wahlabend)
- `ui/szenarien/kalter_krieg/frankreich/` – Frankreich, gleich aufgebaut: `modell.js` (Nationalversammlung, Regierungsstürze, Wahlen, Kolonialkriege, Armee, Inflation und Franc), Ereignisse, `akten.js`, `vorhaben.js`, `enden.js`, `zeitgeschehen.js`, `regierungen.js`, `oberflaeche.js`
- `usa.js`, `su.js` – die Supermächte: Regierungen mit Zielen und verborgenen Typen, Regierungswechsel, eigene Entscheidungen
- `grossbritannien.js` – vorerst eine Hülle
- `ui/ki.js` – Entscheidungslogik der gesteuerten Länder (Nutzen aus Werten und Zielen, Wahl per Logit) und die Einschätzung ihrer Absichten nach Bayes
- `ui/main.js`, `ui/style.css`, `ui/ascii.js` – Oberfläche und ASCII-Szenen
- `ui/ton.js` – Geräusche, synthetisch mit Web Audio (keine Tondateien)

Wie es weitergeht (mehrere Länder, Regierungen mit Zielen, vom Spiel gesteuerte Länder), steht in [`docs/PLAN.md`](docs/PLAN.md).

Tests: `npm test` (spielt mehrere hundert Partien mit verschiedenen Strategien durch und prüft u. a., dass ein Durchlauf mit den historischen Entscheidungen ungefähr die historischen Wahlergebnisse ergibt). `npm run sim` zeigt eine Auswertung nach Strategien, `npm run welt -- 300 1` (Partien, Geschichtstreue, Strategie, gespieltes Land) was die gesteuerten Länder tun und wie gut das gespielte Land ihre Absichten erkennt.

Im Browser ausprobieren: im Ordner `ui` einen Webserver starten (`python -m http.server`) und `http://localhost:8000` öffnen.

## Lizenz

MIT. Die Schriften (Courier Prime, Barlow Semi Condensed) stehen unter der SIL Open Font License.
