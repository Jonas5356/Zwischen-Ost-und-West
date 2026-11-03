// Vereinigte Staaten – werden immer vom Spiel gesteuert (ki.js).
// Regierungen mit Zielen und verborgenen Typen, Präsidentschaftswahlen, eigene Entscheidungen.

const brd = s => s.andere('brd');
const name = s => REGIERUNGEN[s.regime]?.kurz || 'Washington';

// ---------------------------------------------------------------- Regierungen
//
// Ziele (b_g):
//   westbindung      die Bundesrepublik fest im Westen verankern
//   wehrbeitrag      deutsche Soldaten für die Verteidigung Europas
//   eindaemmung      der Sowjetunion überall entgegentreten
//   kosten_senken    weniger Geld und Truppen für Europa („New Look“)
//   berlin_halten    die Stellung in West-Berlin halten
//   entspannung      Ausgleich mit Moskau
//   atomkontrolle    keine Atomwaffen in deutscher Hand
//   buendnis_fuehren Führung und Zusammenhalt des Bündnisses

const BASIS = { westbindung: 1.4, wehrbeitrag: 0.8, eindaemmung: 1.2, kosten_senken: 0.6, berlin_halten: 1.2, entspannung: 0.5, atomkontrolle: 1.0, buendnis_fuehren: 1.0 };
const WERTE_GEWICHT = { buendnis: 0.8, kosten: 0.4, rueckhalt: 0.6, prestige: 0.5, su: 0.15 };

export const REGIERUNGEN = {
  truman: {
    name: 'Harry S. Truman', kurz: 'Truman', titel: 'Präsident Harry S. Truman', aussen: 'Acheson',
    lambda: 2.0, werte: WERTE_GEWICHT, ziele: { ...BASIS, kosten_senken: 0.3, entspannung: 0.3 },
    frage: 'Wie dringend will Washington deutsche Soldaten?',
    typen: {
      draengend: { p: 0.7, name: 'Drängend', kurz: 'sehr dringend – Europa soll verteidigt werden',
        beschreibung: 'Truman will Moskau überall entgegentreten; nach Korea will er die Westdeutschen so schnell wie möglich bewaffnen.', ziele: { wehrbeitrag: 1.8, eindaemmung: 1.5, westbindung: 1.5 },
        berichte: ['Im Pentagon werden bereits Pläne für zwölf deutsche Divisionen gezeichnet.', 'Acheson soll gesagt haben, ohne deutsche Soldaten sei Europa nicht zu halten.'] },
      geduldig: { p: 0.3, name: 'Geduldig', kurz: 'nicht so dringend – Rücksicht auf Paris geht vor',
        beschreibung: 'Washington sucht noch den Ausgleich mit den Verbündeten und mit Moskau; deutsche Soldaten will es nicht um den Preis eines Bruchs mit Frankreich.', ziele: { wehrbeitrag: 0.5, buendnis_fuehren: 1.4, eindaemmung: 0.8, entspannung: 0.8 },
        berichte: ['Im State Department warnt man vor einer „überstürzten“ Wiederbewaffnung, die Paris verprellt.', 'Truman soll gesagt haben, deutsche Divisionen könnten warten, bis Frankreich bereit sei.'] },
    },
  },
  dewey: {
    name: 'Thomas E. Dewey', kurz: 'Dewey', titel: 'Präsident Thomas E. Dewey (Fiktion)', aussen: 'Dulles',
    lambda: 2.0, werte: WERTE_GEWICHT, ziele: { ...BASIS, kosten_senken: 0.9, entspannung: 0.3 },
    frage: 'Wie dringend will Washington deutsche Soldaten?',
    typen: {
      draengend: { p: 0.6, name: 'Drängend', kurz: 'sehr dringend – Europa soll sich selbst verteidigen',
        beschreibung: 'Dewey will, dass die Europäer mehr für ihre Verteidigung tun – mit deutschen Soldaten.', ziele: { wehrbeitrag: 1.7, kosten_senken: 1.2 },
        berichte: ['Dulles soll gesagt haben, ohne deutsche Divisionen sei die NATO „ein Versprechen ohne Deckung“.', 'Im Kongress verlangen Deweys Republikaner, dass die Europäer die Kosten ihrer Verteidigung selbst tragen.'] },
      geduldig: { p: 0.4, name: 'Geduldig', kurz: 'nicht so dringend – Rücksicht auf Paris geht vor',
        beschreibung: 'Dewey ist ein Internationalist der Ostküste; er will das Bündnis nicht durch Druck auf Frankreich gefährden.', ziele: { wehrbeitrag: 0.5, buendnis_fuehren: 1.4 },
        berichte: ['Dewey hat Vertrauten gesagt, ein Bruch mit Paris wäre teurer als ein paar Jahre Geduld.', 'Im State Department hat man Anweisung, die deutsche Frage „nicht zu forcieren“.'] },
    },
  },
  eisenhower: {
    name: 'Dwight D. Eisenhower', kurz: 'Eisenhower', titel: 'Präsident Dwight D. Eisenhower', aussen: 'Dulles',
    lambda: 2.2, werte: WERTE_GEWICHT, ziele: { ...BASIS, kosten_senken: 1.0 },
    frage: 'Will Washington seine Truppen in Europa verringern?',
    typen: {
      new_look: { p: 0.55, name: 'New Look', kurz: 'ja – Atomwaffen statt Soldaten',
        beschreibung: 'Eisenhower will sparen: weniger Truppen in Europa, mehr atomare Abschreckung.', ziele: { kosten_senken: 1.6 },
        berichte: ['Admiral Radford, Vorsitzender der Vereinigten Stabschefs, lässt Pläne für einen drastischen Truppenabbau ausarbeiten.', 'Im Haushaltsbüro ist von 800.000 Mann weniger die Rede.'] },
      atlantiker: { p: 0.45, name: 'Atlantiker', kurz: 'nein – die Truppen bleiben',
        beschreibung: 'Eisenhower, der frühere NATO-Oberbefehlshaber, hält an der Präsenz in Europa fest.', ziele: { kosten_senken: 0.4, buendnis_fuehren: 1.4 },
        berichte: ['Eisenhower hat Vertrauten gesagt, ein Abzug aus Europa komme für ihn nicht in Frage.', 'Das Pentagon plant neue Kasernen für die 7. Armee in Süddeutschland.', 'Dulles versichert im NATO-Rat, die amerikanischen Divisionen blieben, „solange sie gebraucht werden“.'] },
    },
  },
  stevenson: {
    name: 'Adlai Stevenson', kurz: 'Stevenson', titel: 'Präsident Adlai Stevenson (Fiktion)', aussen: null,
    lambda: 1.6, werte: WERTE_GEWICHT, ziele: { ...BASIS, entspannung: 1.0 },
    frage: 'Würde Stevenson mit Moskau über ein neutrales Deutschland verhandeln?',
    typen: {
      entspannung: { p: 0.5, name: 'Entspannung', kurz: 'ja – er sucht den Ausgleich',
        beschreibung: 'Stevenson hält die Teilung Europas für überwindbar und ist zu Verhandlungen bereit.', ziele: { entspannung: 1.6, westbindung: 0.9 },
        berichte: ['Im Weißen Haus wird ein Papier über ein „entmilitarisiertes Mitteleuropa“ diskutiert.', 'Stevensons Berater sondieren über die Briten, ob Moskau zu einem Rückzug aus der DDR bereit wäre.'] },
      eindaemmung: { p: 0.5, name: 'Eindämmung', kurz: 'nein – er bleibt bei der Eindämmung',
        beschreibung: 'Stevenson spricht freundlicher, bleibt aber bei der Politik Trumans.', ziele: { entspannung: 0.6, eindaemmung: 1.4 },
        berichte: ['Der Präsident hat dem NATO-Rat versichert, die amerikanische Politik in Deutschland bleibe unverändert.', 'Im Kongress stimmen Stevensons Demokraten geschlossen für höhere Militärausgaben in Europa.'] },
    },
  },
  kennedy: {
    name: 'John F. Kennedy', kurz: 'Kennedy', titel: 'Präsident John F. Kennedy', aussen: 'Rusk',
    lambda: 1.8, werte: WERTE_GEWICHT, ziele: { ...BASIS, entspannung: 0.9 },
    frage: 'Würde Kennedy Bonner Interessen in Berlin für einen Ausgleich mit Moskau opfern?',
    typen: {
      verhandler: { p: 0.5, name: 'Verhandler', kurz: 'ja – der Ausgleich mit Moskau geht vor',
        beschreibung: 'Kennedy will die Gefahr eines Atomkriegs senken und ist bereit, über Berlin zu verhandeln – auch über die Köpfe der Deutschen hinweg.',
        ziele: { entspannung: 1.4, berlin_halten: 0.8 },
        berichte: ['Kennedys Berater sprechen offen davon, die Oder-Neiße-Grenze und die DDR „de facto“ hinzunehmen.', 'Im State Department wird an einer internationalen Zugangsbehörde für Berlin gearbeitet.'] },
      standfest: { p: 0.5, name: 'Standfest', kurz: 'nein – er bleibt in Berlin fest',
        beschreibung: 'Kennedy will vor Chruschtschow keine Schwäche zeigen; Berlin ist für ihn eine Frage der Glaubwürdigkeit.',
        ziele: { berlin_halten: 1.6, entspannung: 0.6 },
        berichte: ['Kennedy hat zusätzliche Truppen nach Europa verlegen lassen.', 'Der Präsident soll gesagt haben, wer Berlin aufgebe, gebe Europa auf.'] },
    },
  },
  nixon: {
    name: 'Richard Nixon', kurz: 'Nixon', titel: 'Präsident Richard Nixon (Fiktion)', aussen: null,
    lambda: 2.0, werte: WERTE_GEWICHT, ziele: { ...BASIS },
    frage: 'Wie hart tritt Nixon gegenüber Moskau auf?',
    typen: {
      falke: { p: 0.65, name: 'Falke', kurz: 'hart – keine Zugeständnisse', beschreibung: 'Nixon setzt auf Härte gegenüber Moskau.', ziele: { eindaemmung: 1.6, entspannung: 0.3 },
        berichte: ['Nixon hat den Kongress um eine kräftige Erhöhung des Rüstungshaushalts gebeten.', 'Nixon soll im Kabinett gesagt haben, mit Moskau verhandle man nur aus einer Position der Stärke.'] },
      pragmatiker: { p: 0.35, name: 'Pragmatiker', kurz: 'kühl berechnend – Geschäfte mit Moskau sind möglich', beschreibung: 'Hinter der harten Rhetorik sucht Nixon Verhandlungen.', ziele: { entspannung: 1.1 },
        berichte: ['Ein Vertrauter Nixons hat in Moskau sondiert, ob ein Gipfeltreffen möglich wäre.', 'Im Weißen Haus wird über Getreideverkäufe an die Sowjetunion gesprochen.'] },
    },
  },
  johnson: {
    name: 'Lyndon B. Johnson', kurz: 'Johnson', titel: 'Präsident Lyndon B. Johnson', aussen: 'Rusk',
    lambda: 1.8, werte: WERTE_GEWICHT, ziele: { ...BASIS },
    frage: 'Hat Europa für Johnson noch Vorrang?',
    typen: {
      vietnam: { p: 0.7, name: 'Vietnam zuerst', kurz: 'nein – Vietnam und die Innenpolitik gehen vor', beschreibung: 'Johnson konzentriert sich auf Vietnam und seine Reformen im Innern.', ziele: { kosten_senken: 1.2, buendnis_fuehren: 0.7 },
        berichte: ['Im Weißen Haus dreht sich alles um Vietnam und das Bürgerrechtsgesetz.', 'Johnson soll gefragt haben, warum die Europäer nicht mehr für ihre eigene Verteidigung zahlen.'] },
      europa: { p: 0.3, name: 'Europa', kurz: 'ja – Europa bleibt der Kern', beschreibung: 'Johnson setzt Kennedys Europapolitik fort.', ziele: { buendnis_fuehren: 1.4 },
        berichte: ['Johnson hat den Europäern eine enge Abstimmung in allen Fragen der NATO zugesagt.', 'Johnson will Europa-Kenner aus Kennedys Mannschaft im Amt halten.'] },
    },
  },
};

// ---------------------------------------------------------------- Präsidentschaftswahlen

const WECHSEL = [
  { id: 'wahl1948', zeit: 1949.1, von: ['truman'], titel: 'Präsidentschaftswahl 1948',
    ausgaenge: [
      { regime: 'truman', hist: 1, frei: 0.5, meldung: '„Dewey defeats Truman“, titelte die Chicago Tribune – zu früh: Harry S. Truman hat die Präsidentschaftswahl gewonnen. Neuer Außenminister wird Dean Acheson.' },
      { regime: 'dewey', hist: 0, frei: 0.5, meldung: 'Der Republikaner Thomas E. Dewey hat die Präsidentschaftswahl gegen Harry S. Truman gewonnen; Außenminister wird John Foster Dulles. (Fiktion)' },
    ] },
  { id: 'wahl1952', zeit: 1953.1, von: ['truman'], titel: 'Präsidentschaftswahl 1952',
    ausgaenge: [
      { regime: 'eisenhower', hist: 1, frei: 0.6, meldung: 'Dwight D. Eisenhower ist als Präsident der Vereinigten Staaten vereidigt worden. Außenminister wird John Foster Dulles.' },
      { regime: 'stevenson', hist: 0, frei: 0.4, meldung: 'Der Demokrat Adlai Stevenson hat die Präsidentschaftswahl gegen Eisenhower gewonnen. (Fiktion)' },
    ] },
  { id: 'wahl1952d', zeit: 1953.1, von: ['dewey'], titel: 'Präsidentschaftswahl 1952',
    ausgaenge: [
      { regime: 'dewey', hist: 0.5, frei: 0.5, meldung: 'Präsident Dewey ist wiedergewählt worden. (Fiktion)' },
      { regime: 'stevenson', hist: 0.5, frei: 0.5, meldung: 'Der Demokrat Adlai Stevenson hat Präsident Dewey geschlagen. (Fiktion)' },
    ] },
  { id: 'wahl1956d', zeit: 1957.1, von: ['dewey'], titel: 'Präsidentschaftswahl 1956',
    ausgaenge: [
      { regime: 'eisenhower', hist: 0.6, frei: 0.6, meldung: 'Dewey durfte nicht noch einmal antreten. General Eisenhower hat die Wahl für die Republikaner gewonnen. (Fiktion)' },
      { regime: 'stevenson', hist: 0.4, frei: 0.4, meldung: 'Nach acht Jahren Dewey hat der Demokrat Adlai Stevenson die Präsidentschaftswahl gewonnen. (Fiktion)' },
    ] },
  { id: 'wahl1956', zeit: 1957.1, von: ['eisenhower'], titel: 'Präsidentschaftswahl 1956',
    ausgaenge: [
      { regime: 'eisenhower', hist: 1, frei: 0.6, meldung: 'Eisenhower ist mit großer Mehrheit wiedergewählt worden.' },
      { regime: 'stevenson', hist: 0, frei: 0.4, meldung: 'Adlai Stevenson hat Eisenhower im zweiten Anlauf geschlagen. (Fiktion)' },
    ] },
  { id: 'wahl1956s', zeit: 1957.1, von: ['stevenson'], titel: 'Präsidentschaftswahl 1956',
    ausgaenge: [
      { regime: 'stevenson', hist: 0.5, frei: 0.5, meldung: 'Präsident Stevenson ist wiedergewählt worden. (Fiktion)' },
      { regime: 'eisenhower', hist: 0.5, frei: 0.5, meldung: 'Dwight D. Eisenhower löst Stevenson im Weißen Haus ab. (Fiktion)' },
    ] },
  { id: 'wahl1960', zeit: 1961.1, titel: 'Präsidentschaftswahl 1960',
    ausgaenge: [
      { regime: 'kennedy', hist: 1, frei: 0.5, meldung: 'John F. Kennedy ist als 35. Präsident der Vereinigten Staaten vereidigt worden: „Frage nicht, was dein Land für dich tun kann …“' },
      { regime: 'nixon', hist: 0, frei: 0.5, meldung: 'Richard Nixon hat die Präsidentschaftswahl knapp gegen John F. Kennedy gewonnen. (Fiktion)' },
    ] },
  { id: 'dallas', zeit: 1964.1, von: ['kennedy'], titel: 'Dallas',
    ausgaenge: [
      { regime: 'johnson', hist: 1, frei: 0.5, meldung: 'Präsident Kennedy ist am 22. November in Dallas ermordet worden. Lyndon B. Johnson ist sein Nachfolger.' },
      { regime: 'kennedy', hist: 0, frei: 0.5, meldung: 'Präsident Kennedy bereitet seinen Wahlkampf für 1964 vor. (Fiktion: In der Geschichte wurde er im November 1963 ermordet.)' },
    ] },
];

// ---------------------------------------------------------------- Entscheidungen

const ereignisse = [
  // ------------------------------------------------------------ 1946–1949
  {
    id: 'usa_iran', titel: 'Sowjetische Truppen im Iran', ab: 1946.1, bis: 1946.1, ordnung: 3,
    optionen: [
      { text: 'Den Sicherheitsrat anrufen und Moskau scharf zum Abzug auffordern.', hist: true, dient: { eindaemmung: 0.6, buendnis_fuehren: 0.2 }, w: { su: -5, prestige: 3 },
        ergebnis: 'Washington bringt die Besetzung Nordirans vor den Sicherheitsrat der Vereinten Nationen und verlangt den Abzug der Roten Armee.',
        aktion: (s, a) => a.weltflag('iran_druck') },
      { text: 'Die Sache den Briten und den Iranern überlassen.', dient: { entspannung: 0.8, eindaemmung: -0.2 }, w: { su: 3, prestige: -2 },
        ergebnis: 'Washington hält sich im Streit um den Iran zurück.' },
    ],
  },
  {
    id: 'usa_stuttgart', titel: 'Eine Rede in Stuttgart', ab: 1946.2, bis: 1946.2, ordnung: 9,
    optionen: [
      { text: 'Den Deutschen eine Zukunft versprechen und die britische und die amerikanische Zone zusammenlegen.', hist: true, dient: { westbindung: 0.6, eindaemmung: 0.2 }, w: { su: -4, kosten: 3 },
        ergebnis: 'In Stuttgart kündigt Außenminister Byrnes an, die Amerikaner würden bleiben, und verspricht den Deutschen den Wiederaufbau. Die britische und die amerikanische Zone werden zur „Bizone“ verschmolzen.',
        aktion: (s, a) => a.weltflag('bizone') },
      { text: 'An der gemeinsamen Verwaltung durch die vier Mächte festhalten.', dient: { entspannung: 1, westbindung: -0.1 }, w: { kosten: -3 },
        ergebnis: 'Washington hält an der Viermächteverwaltung Deutschlands fest. Die Zonen bleiben getrennt verwaltet.' },
    ],
  },
  {
    id: 'usa_truman_doktrin', rueckblick: true, titel: 'Griechenland und die Türkei', ab: 1947.1, bis: 1947.1, ordnung: 3,
    optionen: [
      { text: 'Freien Völkern beistehen, die sich gegen Unterwerfung wehren: Hilfe für Griechenland und die Türkei.', hist: true, dient: { eindaemmung: 0.7, buendnis_fuehren: 0.2 }, w: { su: -8, kosten: -4, prestige: 4 },
        ergebnis: 'Vor dem Kongress verkündet der Präsident, die Vereinigten Staaten würden „freien Völkern“ beistehen. Griechenland und die Türkei bekommen 400 Millionen Dollar.',
        aktion: (s, a) => a.weltflag('truman_doktrin') },
      { text: 'Die Briten mit Griechenland allein lassen.', dient: { kosten_senken: 1, eindaemmung: -0.1 }, w: { prestige: -4, kosten: 3 },
        ergebnis: 'Washington lehnt es ab, die britischen Verpflichtungen in Griechenland zu übernehmen.' },
    ],
  },
  {
    id: 'usa_marshall', rueckblick: true, titel: 'Hilfe für Europa?', ab: 1947.1, bis: 1947.1, ordnung: 6,
    optionen: [
      { text: 'Ganz Europa ein großes Wiederaufbauprogramm anbieten – auch dem Osten.', hist: true, dient: { eindaemmung: 0.7, buendnis_fuehren: 0.3, kosten_senken: -0.3 }, w: { kosten: -6, buendnis: 3, prestige: 3 },
        ergebnis: 'In Harvard bietet Außenminister Marshall ganz Europa amerikanische Hilfe für den Wiederaufbau an, wenn die Europäer gemeinsam einen Plan vorlegen.',
        aktion: (s, a) => a.weltflag('marshall_angebot') },
      { text: 'Nur einzelne Kredite an Verbündete.', dient: { kosten_senken: 1.4, eindaemmung: -0.1 }, w: { kosten: 7, buendnis: -2 },
        ergebnis: 'Washington lehnt ein großes Hilfsprogramm für Europa ab und vergibt nur einzelne Kredite.' },
    ],
  },
  {
    id: 'usa_weststaat', rueckblick: true, titel: 'Ein Staat aus den Westzonen?', ab: 1948.1, bis: 1948.1, ordnung: 2,
    optionen: [
      { text: 'Einen westdeutschen Staat gründen – notfalls ohne die französische Zone.', hist: true, dient: { westbindung: 0.9, eindaemmung: 0.4 }, w: { su: -8, buendnis: -2 },
        ergebnis: 'Auf der Londoner Konferenz drängt Washington auf die Gründung eines westdeutschen Staates.',
        aktion: (s, a) => a.weltflag('weststaat_usa', 'ja') },
      { text: 'Einen westdeutschen Staat nur gemeinsam mit Paris gründen.', dient: { buendnis_fuehren: 0.5, westbindung: 0.1 }, w: { su: -6, buendnis: 2 },
        ergebnis: 'Washington schlägt in London einen westdeutschen Staat vor, macht ihn aber von der Zustimmung Frankreichs abhängig.',
        aktion: (s, a) => a.weltflag('weststaat_usa', 'nur_mit_paris') },
      { text: 'Bei der Viermächteverwaltung bleiben – kein deutscher Staat.', gegenGruendung: 'brd', dient: { entspannung: 1, westbindung: -0.35 }, w: { su: 4, kosten: -5 },
        ergebnis: 'Washington verzichtet auf einen westdeutschen Staat. Deutschland bleibt unter der Verwaltung der vier Mächte. (Fiktion)',
        aktion: (s, a) => a.weltflag('weststaat_usa', 'vier') },
    ],
  },
  {
    id: 'usa_berlin', rueckblick: true, titel: 'Die Blockade Berlins', ab: 1948.2, bis: 1948.2, ordnung: 3,
    wenn: s => !!s.weltflags.blockade,
    optionen: [
      { text: 'West-Berlin aus der Luft versorgen.', hist: true, dient: { berlin_halten: 1, entspannung: 0.2 }, w: { kosten: -6, prestige: 6, buendnis: 4 },
        ergebnis: 'Die Amerikaner und Briten beginnen eine Luftbrücke: Rosinenbomber fliegen Tag und Nacht Lebensmittel und Kohle nach West-Berlin.',
        aktion: (s, a) => a.weltflag('berlin_massnahme', 'luftbruecke') },
      { text: 'Mit einem bewaffneten Konvoi durchbrechen.', dient: { berlin_halten: 0.8, eindaemmung: 0.3, entspannung: -0.6 }, w: { su: -15, buendnis: -4 },
        ergebnis: 'Ein amerikanischer Panzerkonvoi rollt auf der Autobahn nach Berlin.',
        aktion: (s, a) => a.weltflag('berlin_massnahme', 'konvoi'),
        zufall: [
          { p: 0.35, ergebnis: 'Die Sowjets weichen zurück und öffnen die Zufahrtswege. Die Blockade ist gebrochen. (Fiktion)', w: { prestige: 8 },
            aktion: (s, a) => a.weltflag('blockade_ende') },
          { ergebnis: 'Sowjetische Truppen sperren die Autobahn bei Helmstedt. Der Konvoi kehrt um; die Welt hat einen Tag lang den Atem angehalten. Nun beginnt doch eine Luftbrücke. (Fiktion)', w: { prestige: -4, su: -5 } },
        ] },
      { text: 'Die Stadt räumen.', gegenGruendung: 'brd', dient: { berlin_halten: -0.4, entspannung: 1, kosten_senken: 1.3 }, w: { prestige: -4, buendnis: -3, su: 6 },
        ergebnis: 'Die Westmächte ziehen ihre Truppen aus Berlin ab. Ganz Berlin steht unter sowjetischer Kontrolle; in Westeuropa wächst die Angst. (Fiktion)',
        aktion: (s, a) => a.weltflag('berlin_aufgegeben') },
    ],
  },
  {
    id: 'usa_nato', rueckblick: true, titel: 'Ein atlantisches Bündnis?', ab: 1949.1, bis: 1949.1, ordnung: 2,
    optionen: [
      { text: 'Einen Beistandspakt mit Westeuropa schließen: Ein Angriff auf einen gilt als Angriff auf alle.', hist: true, dient: { eindaemmung: 0.4, buendnis_fuehren: 0.5, kosten_senken: -0.2 }, w: { buendnis: 4, su: -6, kosten: -3 },
        ergebnis: 'Washington lädt zur Unterzeichnung des Nordatlantikvertrags ein. Zum ersten Mal binden sich die Vereinigten Staaten in Friedenszeiten an ein Bündnis.',
        aktion: (s, a) => a.weltflag('nato_angebot', 'fest') },
      { text: 'Nur Konsultationen und Waffenhilfe zusagen.', dient: { kosten_senken: 1.2, buendnis_fuehren: -0.1 }, w: { buendnis: -2, kosten: 3 },
        ergebnis: 'Washington bietet den Westeuropäern ein Bündnis mit Konsultationspflicht an, aber ohne automatischen Beistand. (Fiktion)',
        aktion: (s, a) => a.weltflag('nato_angebot', 'lose') },
    ],
  },
  {
    id: 'usa_wehrbeitrag', braucht: ['brd'], titel: 'Deutsche Soldaten?', ab: 1950.2, ordnung: 7.5,
    wenn: s => !brd(s).f.neutral && !brd(s).f.vereinigt,
    optionen: [
      { text: 'Einen deutschen Wehrbeitrag verlangen.', hist: true, dient: { wehrbeitrag: 1, eindaemmung: 0.5, westbindung: 0.3 }, w: { buendnis: -3 },
        ergebnis: s => `${REGIERUNGEN[s.regime].aussen || 'Der amerikanische Außenminister'} verlangt auf der New Yorker Außenministerkonferenz deutsche Truppen für die Verteidigung Europas.`,
        aktion: (s, a) => a.weltflag('usa_will_wehrbeitrag') },
      { text: 'Abwarten.', still: true, dient: { buendnis_fuehren: 0.4 } },
    ],
  },
  {
    id: 'usa_konferenz', titel: 'Eine Viermächtekonferenz über Deutschland?', nurRueckfrage: true, wiederholbar: true,
    optionen: [
      { text: 'Einer Viermächtekonferenz zustimmen.', antwort: 'ja', dient: { buendnis_fuehren: 1.2, westbindung: -0.4, entspannung: 0.3 },
        ergebnis: 'Auf Drängen Bonns erklären sich die Westmächte zu einer Viermächtekonferenz über Deutschland bereit.' },
      { text: 'Nur mit einer Note antworten.', antwort: 'nein', hist: true, dient: { westbindung: 0.8, buendnis_fuehren: -0.5 },
        ergebnis: 'Die Westmächte antworten Moskau mit der Forderung nach freien Wahlen unter UN-Aufsicht; zu einer Konferenz sind sie nicht bereit.' },
    ],
  },
  {
    id: 'usa_evg_druck', braucht: ['brd'], titel: 'Druck auf Paris?', ab: 1953.2, ordnung: 11.5,
    wenn: s => !!brd(s).f.westvertraege && !brd(s).f.evg && !brd(s).f.evg_gescheitert && !brd(s).f.neutral,
    optionen: [
      { text: 'Paris mit einer „schmerzlichen Überprüfung“ der Europapolitik drohen.', hist: true, dient: { westbindung: 1, wehrbeitrag: 0.5 }, w: { buendnis: -4 },
        ergebnis: s => `${REGIERUNGEN[s.regime].aussen || 'Washington'} droht Frankreich mit einer „schmerzlichen Überprüfung“ der amerikanischen Europapolitik, falls die EVG scheitert.`,
        aktion: (s, a) => a.weltflag('evg_druck') },
      { text: 'Paris Zeit lassen.', dient: { buendnis_fuehren: 0.6 },
        ergebnis: 'Washington verzichtet darauf, Frankreich in der EVG-Frage unter Druck zu setzen.' },
    ],
  },
  // Antworten auf Anfragen anderer Länder (Entscheidungen); `gunst`: Wer Washington nahesteht, bekommt eher ja
  {
    id: 'usa_hilfe_indochina', titel: 'Hilfe für Indochina?', nurRueckfrage: true, wiederholbar: true,
    optionen: [
      { text: 'Frankreich in Indochina mit Geld und Waffen unterstützen.', antwort: 'ja', hist: true, gunst: 0.6,
        dient: { eindaemmung: 0.9, kosten_senken: -0.4 }, w: { kosten: -4 },
        ergebnis: 'Washington übernimmt einen Teil der Kosten des französischen Kriegs in Indochina.' },
      { text: 'Ablehnen – ein Kolonialkrieg ist nicht Amerikas Sache.', antwort: 'nein', dient: { kosten_senken: 0.6, entspannung: 0.2 },
        ergebnis: 'Washington lehnt Hilfe für den französischen Krieg in Indochina ab.' },
    ],
  },
  {
    id: 'usa_hilfe_algerien', titel: 'Hilfe für Algerien?', nurRueckfrage: true, wiederholbar: true,
    optionen: [
      { text: 'Frankreich in Algerien unterstützen.', antwort: 'ja', gunst: 0.4, dient: { buendnis_fuehren: 0.3 }, w: { prestige: -5 },
        ergebnis: 'Washington liefert Frankreich Ausrüstung für den Krieg in Algerien.' },
      { text: 'Ablehnen – Washington will es sich mit der arabischen Welt nicht verderben.', antwort: 'nein', hist: true, dient: { entspannung: 0.4, kosten_senken: 0.4 }, w: { prestige: 1 },
        ergebnis: 'Washington lehnt Hilfe für den französischen Krieg in Algerien ab.' },
    ],
  },
  {
    id: 'usa_kredit_brd', titel: 'Kredite für Bonn?', nurRueckfrage: true, wiederholbar: true,
    optionen: [
      { text: 'Der Bundesrepublik weitere Kredite gewähren.', antwort: 'ja', hist: true, gunst: 0.6, dient: { westbindung: 0.8, kosten_senken: -0.3 }, w: { kosten: -3 },
        ergebnis: 'Washington gewährt der Bundesrepublik weitere Kredite.' },
      { text: 'Ablehnen – Westdeutschland muss selbst zurechtkommen.', antwort: 'nein', dient: { kosten_senken: 0.7 },
        ergebnis: 'Washington lehnt weitere Kredite für die Bundesrepublik ab.' },
    ],
  },
  {
    id: 'usa_vautour', titel: 'Luftangriffe für Điện Biên Phủ?', nurRueckfrage: true, wiederholbar: true,
    optionen: [
      { text: 'Die Viet Minh vor Điện Biên Phủ aus der Luft angreifen.', antwort: 'ja', dient: { eindaemmung: 1.2, entspannung: -0.8, buendnis_fuehren: 0.4 }, w: { rueckhalt: -6, su: -6 },
        ergebnis: 'Amerikanische Bomber von Flugzeugträgern greifen die Stellungen der Viet Minh um Điện Biên Phủ an.' },
      { text: 'Ablehnen – ohne London und den Kongress kein Krieg in Asien.', antwort: 'nein', hist: true, dient: { kosten_senken: 0.6, entspannung: 0.4, buendnis_fuehren: -0.3 },
        ergebnis: 'Washington lehnt Luftangriffe ab. Ohne Großbritannien und ohne den Kongress will der Präsident nicht eingreifen.' },
    ],
  },
  {
    id: 'usa_radford', braucht: ['brd'], titel: 'Weniger Truppen in Europa?', ab: 1956.2, ordnung: 6,
    wenn: s => !!(brd(s).f.nato || brd(s).f.evg),
    optionen: [
      { text: 'Die Truppen in Europa drastisch verringern und auf Atomwaffen setzen.', dient: { kosten_senken: 1.2, buendnis_fuehren: -1, eindaemmung: -0.3 }, w: { kosten: 8, buendnis: -8 },
        ergebnis: 'Die „New York Times“ berichtet: Admiral Radford will die amerikanischen Truppen in Europa drastisch verringern und auf Atomwaffen setzen. Die Regierung dementiert nicht.',
        aktion: (s, a) => { a.weltflag('radford'); a.sende('brd', 'radford'); } },
      { text: 'Bei der bisherigen Truppenstärke bleiben.', hist: true, still: true, dient: { buendnis_fuehren: 0.3 } },
    ],
  },
  {
    id: 'usa_suez', titel: 'Suez', ab: 1956.2, ordnung: 10.2,
    wenn: s => !!s.weltflags.suez_angriff,
    optionen: [
      { text: 'London und Paris mit finanziellem Druck zum Rückzug zwingen.', hist: true, dient: { buendnis_fuehren: 0.8, eindaemmung: 0.5, entspannung: 0.3 }, w: { buendnis: -6, prestige: 3 },
        ergebnis: s => `${name(s)} zwingt London und Paris mit finanziellem Druck, den Angriff auf Ägypten abzubrechen.`,
        aktion: (s, a) => a.weltflag('suez_druck') },
      { text: 'Die Verbündeten gewähren lassen.', dient: { buendnis_fuehren: -0.3, eindaemmung: -0.5 }, w: { prestige: -4, su: -5 },
        ergebnis: 'Washington hält still. Britische und französische Truppen besetzen die Kanalzone, Moskau droht mit Raketen.',
        aktion: (s, a) => a.weltflag('suez_gewaehren') },
    ],
  },
  {
    id: 'usa_teilhabe', braucht: ['brd'], titel: 'Atomwaffen für die Bundeswehr?', ab: 1957.2, ordnung: 11,
    wenn: s => !!(brd(s).f.nato || brd(s).f.evg) && !brd(s).f.atomverzicht_bundeswehr,
    optionen: [
      { text: 'Der Bundeswehr atomwaffenfähige Träger anbieten; die Sprengköpfe bleiben in amerikanischer Hand.', hist: true,
        dient: { eindaemmung: 0.8, kosten_senken: 0.6, atomkontrolle: -0.3, buendnis_fuehren: 0.4 },
        ergebnis: 'Die NATO beschließt, auch die Bundeswehr mit atomwaffenfähigen Trägersystemen auszurüsten. Die Sprengköpfe bleiben unter amerikanischer Kontrolle.',
        aktion: (s, a) => a.sende('brd', 'teilhabe') },
      { text: 'Keine Atomwaffenträger für die Deutschen.', dient: { atomkontrolle: 0.7, entspannung: 0.4 },
        ergebnis: 'Washington lehnt atomwaffenfähige Waffen für die Bundeswehr ab.' },
    ],
  },
  {
    id: 'usa_essentials', braucht: ['brd'], titel: 'Was ist in Berlin unverzichtbar?', ab: 1961.1, ordnung: 5.8,
    wenn: s => !brd(s).f.vereinigt && !brd(s).f.freistadt_vereinbart,
    optionen: [
      { text: 'Drei „Essentials“ nennen: Präsenz, Zugang und Freiheit West-Berlins.', hist: true, dient: { berlin_halten: 0.8, entspannung: 0.6 },
        ergebnis: s => `${name(s)} nennt drei unverzichtbare Punkte für West-Berlin: die Präsenz der Westmächte, den freien Zugang und die Freiheit der West-Berliner. Vom Ostsektor ist keine Rede.`,
        aktion: (s, a) => a.weltflag('essentials', 'westberlin') },
      { text: 'Eine Garantie für ganz Berlin abgeben.', dient: { berlin_halten: 1.2, entspannung: -1 }, w: { su: -6 },
        ergebnis: s => `${name(s)} erklärt, die Vereinigten Staaten würden jede Änderung des Status von ganz Berlin als Angriff betrachten.`,
        aktion: (s, a) => a.weltflag('essentials', 'ganz_berlin') },
      { text: 'Moskau eine Verhandlungslösung für Berlin anbieten.', dient: { entspannung: 1.2, berlin_halten: -0.6, buendnis_fuehren: -0.5 }, w: { su: 5 },
        ergebnis: 'Washington bietet Moskau Verhandlungen über einen neuen Status für Berlin an.',
        aktion: (s, a) => a.weltflag('essentials', 'verhandlung') },
    ],
  },
  {
    id: 'usa_kuba', titel: 'Raketen auf Kuba', ab: 1962.2, ordnung: 9.5,
    wenn: s => !!s.weltflags.raketen_kuba,
    optionen: [
      { text: 'Eine Seeblockade verhängen.', hist: true, dient: { eindaemmung: 1, berlin_halten: 0.3 }, w: { prestige: 3 },
        ergebnis: s => `${name(s)} verhängt eine Seeblockade über Kuba und verlangt den Abzug der Raketen.`,
        aktion: (s, a) => a.weltflag('kuba_massnahme', 'blockade'),
        rueckfrage: { land: 'su', id: 'su_kuba_antwort' },
        antworten: { abzug: { w: { prestige: 6 } }, berlin: { w: { prestige: -3, su: -10 } } } },
      { text: 'Die Raketenstellungen bombardieren.', dient: { eindaemmung: 1.2, entspannung: -1.5 }, w: { prestige: 4 },
        ergebnis: 'Amerikanische Bomber greifen die Raketenstellungen auf Kuba an.',
        aktion: (s, a) => a.weltflag('kuba_massnahme', 'angriff'),
        rueckfrage: { land: 'su', id: 'su_kuba_angriff' },
        antworten: { abzug: { w: { prestige: 6 } }, berlin: { w: { su: -20 } } } },
      { text: 'Verhandeln: den Abzug der Jupiter-Raketen aus der Türkei anbieten.', dient: { entspannung: 1, buendnis_fuehren: -0.8, eindaemmung: -0.5 }, w: { buendnis: -6, prestige: -4, su: 8 },
        ergebnis: 'Washington bietet Moskau an, seine Raketen aus der Türkei abzuziehen, wenn die Sowjets Kuba räumen. Moskau stimmt zu.',
        aktion: (s, a) => { a.weltflag('kuba_massnahme', 'tausch'); a.weltflag('kuba_ausgang', 'abzug'); } },
    ],
  },
  {
    id: 'usa_mlf', braucht: ['brd'], titel: 'Eine Atomflotte der NATO?', ab: 1964.1, ordnung: 2.5,
    wenn: s => !!brd(s).f.nato,
    optionen: [
      { text: 'Eine multilaterale Atomstreitmacht der NATO anbieten.', hist: true, dient: { buendnis_fuehren: 1, atomkontrolle: 0.5, kosten_senken: -0.3 },
        ergebnis: 'Washington wirbt für eine „Multilateral Force“: Schiffe mit Polaris-Raketen und gemischten Besatzungen.',
        aktion: (s, a) => a.sende('brd', 'mlf') },
      { text: 'Das Projekt fallen lassen.', still: true, dient: { entspannung: 0.4, kosten_senken: 0.3 } },
    ],
  },
];

// ---------------------------------------------------------------- Modell

function rundenende(s) {
  const w = s.w;
  for (const [k, ziel] of [['buendnis', 60], ['kosten', 50], ['rueckhalt', 55], ['prestige', 55], ['su', 30]]) {
    w[k] += (ziel - w[k]) * 0.1;
    w[k] = Math.round(w[k] * 10) / 10;
  }
}

export default {
  id: 'usa',
  name: 'Vereinigte Staaten',
  kurz: 'USA',
  hauptstadt: 'Washington',
  spielbar: false,
  werte: {
    buendnis: { name: 'Zusammenhalt des Bündnisses', min: 0, max: 100 },
    kosten: { name: 'Spielraum im Haushalt', min: 0, max: 100 },
    rueckhalt: { name: 'Rückhalt im Inland', min: 0, max: 100 },
    prestige: { name: 'Prestige', min: 0, max: 100 },
    su: { name: 'Ansehen in Moskau', min: 0, max: 100, beziehung: 'su' },
  },
  startzustand: () => ({ w: { buendnis: 60, kosten: 50, rueckhalt: 55, prestige: 60 }, f: {} }),
  startRegime: 'truman',
  regierungen: REGIERUNGEN,
  wechsel: WECHSEL,
  ereignisse,
  modell: { rundenende },
};
