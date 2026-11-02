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
        beschreibung: 'Nach Korea will Truman die Bundesrepublik so schnell wie möglich bewaffnen.', ziele: { wehrbeitrag: 1.8 },
        berichte: ['Im Pentagon werden bereits Pläne für zwölf deutsche Divisionen gezeichnet.', 'Acheson soll gesagt haben, ohne deutsche Soldaten sei Europa nicht zu halten.'] },
      geduldig: { p: 0.3, name: 'Geduldig', kurz: 'nicht so dringend – Rücksicht auf Paris geht vor',
        beschreibung: 'Washington will deutsche Soldaten, aber nicht um den Preis eines Bruchs mit Frankreich.', ziele: { wehrbeitrag: 0.5, buendnis_fuehren: 1.4 },
        berichte: ['Im State Department warnt man vor einer „überstürzten“ Wiederbewaffnung, die Paris verprellt.', 'Truman soll gesagt haben, deutsche Divisionen könnten warten, bis Frankreich bereit sei.'] },
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
        beschreibung: 'Kennedy will die Gefahr eines Atomkriegs senken und ist bereit, über Berlin zu verhandeln – auch über Bonns Kopf hinweg.',
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
        berichte: ['Johnson hat Bonn eine enge Abstimmung in allen Fragen der NATO zugesagt.', 'Johnson will Europa-Kenner aus Kennedys Mannschaft im Amt halten.'] },
    },
  },
};

// ---------------------------------------------------------------- Präsidentschaftswahlen

const WECHSEL = [
  { id: 'wahl1952', zeit: 1953.1, von: ['truman'], titel: 'Präsidentschaftswahl 1952',
    ausgaenge: [
      { regime: 'eisenhower', hist: 1, frei: 0.6, meldung: 'Dwight D. Eisenhower ist als Präsident der Vereinigten Staaten vereidigt worden. Außenminister wird John Foster Dulles.' },
      { regime: 'stevenson', hist: 0, frei: 0.4, meldung: 'Der Demokrat Adlai Stevenson hat die Präsidentschaftswahl gegen Eisenhower gewonnen. (Fiktion)' },
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
  {
    id: 'usa_wehrbeitrag', titel: 'Deutsche Soldaten?', ab: 1950.2, ordnung: 7.5,
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
    id: 'usa_evg_druck', titel: 'Druck auf Paris?', ab: 1953.2, ordnung: 11.5,
    wenn: s => !!brd(s).f.westvertraege && !brd(s).f.evg && !brd(s).f.evg_gescheitert && !brd(s).f.neutral,
    optionen: [
      { text: 'Paris mit einer „schmerzlichen Überprüfung“ der Europapolitik drohen.', hist: true, dient: { westbindung: 1, wehrbeitrag: 0.5 }, w: { buendnis: -4 },
        ergebnis: s => `${REGIERUNGEN[s.regime].aussen || 'Washington'} droht Frankreich mit einer „schmerzlichen Überprüfung“ der amerikanischen Europapolitik, falls die EVG scheitert.`,
        aktion: (s, a) => a.weltflag('evg_druck') },
      { text: 'Paris Zeit lassen.', dient: { buendnis_fuehren: 0.6 },
        ergebnis: 'Washington verzichtet darauf, Frankreich in der EVG-Frage unter Druck zu setzen.' },
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
    id: 'usa_radford', titel: 'Weniger Truppen in Europa?', ab: 1956.2, ordnung: 6,
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
    id: 'usa_teilhabe', titel: 'Atomwaffen für die Bundeswehr?', ab: 1957.2, ordnung: 11,
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
    id: 'usa_essentials', titel: 'Was ist in Berlin unverzichtbar?', ab: 1961.1, ordnung: 5.8,
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
    id: 'usa_mlf', titel: 'Eine Atomflotte der NATO?', ab: 1964.1, ordnung: 2.5,
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
