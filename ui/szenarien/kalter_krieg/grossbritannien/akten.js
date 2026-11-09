// Großbritannien: Briefe und kleinere Vorlagen, die zufällig auf dem Schreibtisch landen
const akte = a => ({ art: 'akte', ...a });

export default [
  // ------------------------------------------------------------------ 1946–1950
  akte({
    id: 'ga_fulton', titel: 'Ein eiserner Vorhang', ab: 1946.1, bis: 1946.1, ordnung: 3,
    absender: 'Foreign Office, Pressestelle',
    text: 'Winston Churchill, Führer der Opposition, hat in Fulton im amerikanischen Missouri gesprochen, Präsident Truman neben sich: Von Stettin bis Triest sei ein „eiserner Vorhang“ über den Kontinent niedergegangen. Moskau tobt, die Labour-Linke auch. Die Presse fragt, ob die Regierung Churchills Worte teilt.',
    optionen: [
      { text: 'Sich nicht festlegen: Churchill spricht für sich selbst.', hist: true, ergebnis: 'Die Regierung erklärt, Churchill habe als Privatmann gesprochen. Insgeheim teilt das Foreign Office seine Sicht.', w: {} },
      { text: 'Churchills Rede öffentlich unterstützen.', ergebnis: 'Die Regierung stellt sich hinter Churchills Rede. Moskau protestiert, der linke Flügel von Labour ist empört. (Fiktion)', w: { moskau: -4, usa: 2, rueckhalt: -3 } },
    ],
    historisch: 'Churchill hielt seine Rede vom „eisernen Vorhang“ am 5. März 1946 in Fulton; Attlee distanzierte sich öffentlich.',
  }),
  akte({
    id: 'ga_olympia', titel: 'Die Spiele der Sparsamkeit', ab: 1947.2, bis: 1948.1, ordnung: 4,
    absender: 'Britisches Olympisches Komitee',
    text: 'London soll 1948 die ersten Olympischen Spiele seit dem Krieg ausrichten. Das Komitee will kein neues Stadion bauen, sondern Wembley nutzen und die Sportler in Kasernen und Schulen unterbringen. Etwas mehr Geld würde den Spielen gut tun – und dem Ansehen des Landes.',
    optionen: [
      { text: 'Spiele der Sparsamkeit: Wembley, Kasernen, eigene Handtücher.', hist: true, ergebnis: 'Die Spiele finden im Juli in Wembley statt; die Sportler bringen ihre Handtücher selbst mit. Die Welt ist trotzdem begeistert.', w: { ansehen: 2 } },
      { text: 'Etwas Glanz: ein olympisches Dorf und ein neues Schwimmbad.', ergebnis: 'Die Regierung gibt Geld für ein olympisches Dorf. Die Spiele werden ein Fest – und teurer. (Fiktion)', w: { ansehen: 3, haushalt: -2 } },
    ],
    historisch: 'Die „Austerity Games“ fanden vom 29. Juli bis 14. August 1948 in London statt.',
  }),
  akte({
    id: 'ga_dockerstreik', titel: 'Streik in den Docks', ab: 1949.1, bis: 1949.2, ordnung: 6,
    absender: 'Arbeitsministerium',
    text: 'In den Londoner Docks streiken die Hafenarbeiter, weil sie die Ladung zweier kanadischer Schiffe nicht löschen wollen, deren Seeleute in Kanada streiken. Die Gewerkschaftsführung ist gegen den Streik, die Kommunisten dafür. Lebensmittel verfaulen in den Laderäumen.',
    optionen: [
      { text: 'Den Notstand ausrufen und Soldaten die Schiffe entladen lassen.', hist: true, richtung: 'sparen', ergebnis: 'Die Regierung ruft den Notstand aus; Soldaten entladen die Schiffe. Nach drei Wochen kehren die Docker zurück.', w: { gewerkschaften: -4, ansehen: 1 } },
      { text: 'Vermitteln und abwarten.', richtung: 'gewerkschaft', ergebnis: 'Die Regierung vermittelt. Der Streik zieht sich hin, die Lebensmittel verderben. (Fiktion)', w: { gewerkschaften: 3, impuls: -0.3, ansehen: -1 } },
    ],
    historisch: 'Im Juli 1949 setzte die Labour-Regierung beim Hafenstreik Soldaten ein und rief den Notstand aus.',
  }),

  // ------------------------------------------------------------------ 1951–1958
  akte({
    id: 'ga_smog', titel: 'Der große Smog', ab: 1952.2, bis: 1953.1, ordnung: 12,
    absender: 'Gesundheitsministerium',
    text: 'Fünf Tage lang lag ein gelber, giftiger Nebel über London; die Busse fuhren nicht, man sah die eigenen Füße nicht mehr. Die Leichenhallen sind überfüllt, es sollen Tausende gestorben sein. Ärzte verlangen sofortige Maßnahmen gegen den Kohlenrauch. Der Wohnungsbauminister rät zur Vorsicht: Kohle ist der Brennstoff des kleinen Mannes.',
    optionen: [
      { text: 'Einen Ausschuss einsetzen.', hist: true, ergebnis: 'Ein Ausschuss soll die Ursachen untersuchen. Es dauert vier Jahre bis zu einem Gesetz.', w: {} },
      { text: 'Sofort rauchfreie Zonen in London anordnen.', ergebnis: 'In London werden rauchfreie Zonen angeordnet. Die Bergleute und die Hausbesitzer murren. (Fiktion)', w: { ansehen: 2, gewerkschaften: -2 }, setze: ['saubere_luft'] },
    ],
    historisch: 'Der Smog vom 5. bis 9. Dezember 1952 forderte nach heutigen Schätzungen bis zu 12.000 Tote.',
  }),
  akte({
    id: 'ga_kroenung', titel: 'Die Krönung im Fernsehen?', ab: 1952.2, bis: 1953.1, ordnung: 1,
    wenn: s => s.zeit >= 1952.1,
    absender: 'Earl Marshal',
    text: 'Die Krönung der jungen Königin soll im Juni in der Westminster Abbey stattfinden. Die BBC möchte die Zeremonie live übertragen. Der Erzbischof von Canterbury und das Kabinett sind dagegen: Die heiligsten Augenblicke gehörten nicht in die Wohnzimmer. Die Königin selbst soll anderer Meinung sein.',
    optionen: [
      { text: 'Die Übertragung erlauben.', hist: true, ergebnis: 'Die Krönung wird im Fernsehen übertragen. Zwanzig Millionen Menschen sehen zu; Hunderttausende kaufen dafür ihr erstes Fernsehgerät.', w: { ansehen: 3, impuls: 0.2 } },
      { text: 'Nur Wochenschauen, kein Fernsehen.', ergebnis: 'Die Krönung bleibt den Gästen in der Abbey vorbehalten. Die Presse ist enttäuscht. (Fiktion)', w: { ansehen: -1 } },
    ],
    historisch: 'Die Krönung Elisabeths II. am 2. Juni 1953 wurde trotz anfänglicher Bedenken des Kabinetts live übertragen.',
  }),
  akte({
    id: 'ga_comet', titel: 'Die Comet', ab: 1954.1, bis: 1954.1, ordnung: 4,
    absender: 'Ministerium für Zivilluftfahrt',
    text: 'Die de Havilland Comet ist das erste Düsenverkehrsflugzeug der Welt, der Stolz der britischen Industrie. Jetzt sind binnen drei Monaten zwei Maschinen über dem Mittelmeer zerbrochen. Die Ursache ist unbekannt. Ein Flugverbot würde den amerikanischen Konkurrenten den Markt überlassen.',
    optionen: [
      { text: 'Alle Comets am Boden lassen, bis die Ursache gefunden ist.', hist: true, ergebnis: 'Die Comet erhält Flugverbot. In Farnborough wird ein Rumpf in einem Wassertank getestet, bis er bricht: Metallermüdung an den Fensterecken.', w: { ansehen: 1, impuls: -0.2 } },
      { text: 'Die Flüge mit Auflagen weiterlaufen lassen.', zufall: [
        { p: 0.6, ergebnis: 'Die Comets fliegen weiter, die Ursache wird gefunden, bevor etwas geschieht. (Fiktion)', w: { impuls: 0.2 } },
        { ergebnis: 'Eine dritte Comet stürzt ab. Der Ruf der britischen Luftfahrt ist ruiniert. (Fiktion)', w: { ansehen: -5, impuls: -0.5 } },
      ] },
    ],
    historisch: 'Nach den Abstürzen im Januar und April 1954 erhielt die Comet Flugverbot; Ursache war Metallermüdung.',
  }),
  akte({
    id: 'ga_crichel', titel: 'Crichel Down', ab: 1954.1, bis: 1954.1, ordnung: 6,
    absender: 'Landwirtschaftsministerium',
    text: 'Eine Untersuchung hat ergeben, dass Beamte des Landwirtschaftsministeriums Land, das im Krieg für einen Bombenabwurfplatz enteignet worden war, nicht den Erben zurückgegeben, sondern verpachtet haben – und die Erben getäuscht. Der Minister wusste nichts davon. Muss er trotzdem zurücktreten?',
    optionen: [
      { text: 'Der Minister übernimmt die Verantwortung und tritt zurück.', hist: true, ergebnis: 'Der Landwirtschaftsminister tritt zurück. Seither gilt: Ein Minister steht für die Fehler seines Hauses ein.', w: { ansehen: 2, rueckhalt: -2 } },
      { text: 'Die Beamten versetzen, der Minister bleibt.', ergebnis: 'Die Beamten werden versetzt; der Minister bleibt. Die Presse spricht von Feigheit. (Fiktion)', w: { ansehen: -2 } },
    ],
    historisch: 'Landwirtschaftsminister Thomas Dugdale trat im Juli 1954 wegen der Crichel-Down-Affäre zurück.',
  }),
  akte({
    id: 'ga_lokfuehrer', titel: 'Die Lokführer streiken', ab: 1955.1, bis: 1955.1, ordnung: 5,
    absender: 'Arbeitsministerium',
    text: 'Die Gewerkschaft der Lokführer ist in den Streik getreten; seit Tagen fahren kaum Züge. Sie verlangt einen höheren Lohnabstand zu den anderen Eisenbahnern. Die Bahn sagt, sie habe kein Geld.',
    optionen: [
      { text: 'Den Notstand ausrufen und hart bleiben.', hist: true, richtung: 'sparen', ergebnis: 'Die Regierung ruft den Notstand aus. Nach siebzehn Tagen geben die Lokführer auf; die Bahn hat Kunden verloren, die nie zurückkehren.', w: { gewerkschaften: -4, impuls: -0.3 } },
      { text: 'Der Bahn das Geld für die Lohnerhöhung geben.', richtung: 'gewerkschaft', ergebnis: 'Die Regierung gibt der Bahn das Geld. Die Lokführer kehren zurück, andere Gewerkschaften melden Forderungen an. (Fiktion)', w: { gewerkschaften: 4, haushalt: -2, preisdruck: 0.5 } },
    ],
    historisch: 'Der Streik der ASLEF dauerte vom 28. Mai bis 14. Juni 1955; die Regierung rief den Notstand aus.',
  }),
  akte({
    id: 'ga_bbc_suez', titel: 'Die BBC und Suez', ab: 1956.2, bis: 1956.2, ordnung: 10.5,
    wenn: s => s.weltflags.suez_london === 'ja',
    absender: 'Büro des Premierministers',
    text: 'Die BBC lässt den Oppositionsführer nach der Ansprache des Premierministers antworten, und ihr Auslandsdienst berichtet über die Kritik in der britischen Presse. In Downing Street ist man außer sich; ein Minister schlägt vor, die BBC unter Regierungsaufsicht zu stellen, solange die Krise dauert.',
    optionen: [
      { text: 'Die BBC gewähren lassen.', hist: true, ergebnis: 'Die Regierung lässt die BBC gewähren. Ihr Ruf als unabhängiger Sender wächst in aller Welt.', w: { ansehen: 1 } },
      { text: 'Dem Auslandsdienst die Mittel kürzen.', ergebnis: 'Die Regierung kürzt dem Auslandsdienst die Mittel. Die Presse spricht von Zensur. (Fiktion)', w: { ansehen: -3 } },
    ],
    historisch: 'Eden erwog während der Suezkrise, die BBC unter Regierungskontrolle zu stellen; Pläne zur Kürzung des Auslandsdienstes wurden nicht umgesetzt.',
  }),
  akte({
    id: 'ga_wolfenden', titel: 'Der Wolfenden-Bericht', ab: 1957.2, bis: 1957.2, ordnung: 9,
    absender: 'Innenministerium',
    text: 'Ein Ausschuss unter Sir John Wolfenden empfiehlt, homosexuelle Handlungen zwischen Erwachsenen im privaten Raum nicht mehr zu bestrafen. Hunderte Männer stehen jedes Jahr deswegen vor Gericht; Erpressungen sind an der Tagesordnung. Der Innenminister fürchtet die öffentliche Meinung.',
    optionen: [
      { text: 'Den Bericht annehmen, aber nichts ändern – die Zeit sei nicht reif.', hist: true, ergebnis: 'Die Regierung lehnt es ab, das Gesetz zu ändern. Die Verfolgung geht weiter.', w: {} },
      { text: 'Ein Gesetz nach den Empfehlungen vorlegen.', ergebnis: 'Die Regierung legt ein Gesetz nach den Empfehlungen des Berichts vor – zehn Jahre früher als in der Geschichte. (Fiktion)', w: { ansehen: -1, rueckhalt: -3 } },
    ],
    historisch: 'Der Wolfenden-Bericht erschien im September 1957; umgesetzt wurde er erst mit dem Sexual Offences Act von 1967.',
  }),

  // ------------------------------------------------------------------ 1959–1964
  akte({
    id: 'ga_chatterley', titel: 'Lady Chatterley', ab: 1960.2, bis: 1960.2, ordnung: 10,
    absender: 'Generalstaatsanwalt',
    text: 'Penguin will D. H. Lawrences Roman „Lady Chatterley’s Lover“ ungekürzt als Taschenbuch herausbringen. Der Staatsanwalt will den Verlag nach dem neuen Gesetz gegen obszöne Schriften anklagen. Dutzende Schriftsteller und ein Bischof wollen für das Buch aussagen.',
    optionen: [
      { text: 'Die Anklage laufen lassen.', hist: true, ergebnis: 'Penguin wird angeklagt – und freigesprochen. Das Buch verkauft sich drei Millionen Mal.', w: {} },
      { text: 'Auf eine Anklage verzichten.', ergebnis: 'Es gibt keine Anklage. Das Buch erscheint ohne großes Aufsehen. (Fiktion)', w: {} },
    ],
    historisch: 'Der Prozess gegen Penguin Books endete am 2. November 1960 mit einem Freispruch.',
  }),
  akte({
    id: 'ga_blake', titel: 'Der Fall Blake', ab: 1961.1, bis: 1961.1, ordnung: 5,
    absender: 'Secret Intelligence Service',
    text: 'George Blake, ein Offizier des Geheimdienstes, hat gestanden, jahrelang für Moskau gearbeitet zu haben; er hat Hunderte Agenten verraten, von denen viele hingerichtet wurden. Washington ist entsetzt. Das Gericht wird ihn verurteilen; die Frage ist, wie viel die Öffentlichkeit erfährt.',
    optionen: [
      { text: 'Den Prozess größtenteils hinter verschlossenen Türen führen.', hist: true, ergebnis: 'Blake wird in einem weitgehend geheimen Prozess zu 42 Jahren Haft verurteilt.', w: { usa: -1 } },
      { text: 'Offen verhandeln und eine Reform des Geheimdienstes ankündigen.', ergebnis: 'Der Prozess wird öffentlich; die Regierung kündigt eine Reform des Geheimdienstes an. (Fiktion)', w: { usa: 2, ansehen: -2 } },
    ],
    historisch: 'Blake wurde im Mai 1961 zu 42 Jahren verurteilt und floh 1966 aus dem Gefängnis nach Moskau.',
  }),
  akte({
    id: 'ga_vassall', titel: 'Der Fall Vassall', ab: 1962.2, bis: 1962.2, ordnung: 9,
    absender: 'MI5',
    text: 'John Vassall, ein Angestellter der Admiralität, hat jahrelang Geheimnisse an Moskau verkauft, nachdem der KGB ihn in Moskau erpresst hatte. Die Presse behauptet, ein Staatssekretär der Admiralität habe ihn gedeckt; Beweise gibt es nicht. Der Staatssekretär bietet den Rücktritt an.',
    optionen: [
      { text: 'Den Rücktritt annehmen und eine Untersuchung einsetzen.', hist: true, ergebnis: 'Der Staatssekretär tritt zurück; eine Untersuchung entlastet ihn später vollständig. Zwei Journalisten müssen ins Gefängnis, weil sie ihre Quellen nicht nennen.', w: { ansehen: -1, rueckhalt: -2 } },
      { text: 'Den Rücktritt ablehnen.', ergebnis: 'Der Staatssekretär bleibt. Die Presse setzt ihre Kampagne fort. (Fiktion)', w: { ansehen: -2 } },
    ],
    historisch: 'Vassall wurde im Oktober 1962 zu 18 Jahren verurteilt; Staatssekretär Thomas Galbraith trat zurück und wurde später entlastet.',
  }),
];
