// Sowjetunion – wird immer vom Spiel gesteuert (ki.js).
// Regierungen mit Zielen und verborgenen Typen, Regierungswechsel, eigene Entscheidungen.
// Was eine Regierung wirklich will (ihr Typ), erfahren die gespielten Länder nur über
// ihr Handeln und über Berichte.

import { zeitIndex } from '../../engine.js';

const brd = s => s.andere('brd');
const name = s => REGIERUNGEN[s.regime]?.kurz || 'Moskau';

// ---------------------------------------------------------------- Regierungen
//
// Ziele (b_g):
//   ddr_halten            die DDR und die Teilung sichern
//   neutrales_deutschland ein bündnisfreies Gesamtdeutschland, auch um den Preis der DDR
//   westbindung_stoeren   die Westintegration der Bundesrepublik aufhalten
//   west_berlin           die Westmächte aus West-Berlin drängen
//   ostblock              Kontrolle über die Satellitenstaaten
//   koexistenz            Krieg vermeiden, Ausgleich mit Washington
//   weltmacht             strategische Gleichrangigkeit mit den USA, Prestige in der Welt

const BASIS = { ostblock: 1.2, ddr_halten: 1.0, westbindung_stoeren: 1.0, neutrales_deutschland: 0.6, west_berlin: 0.6, koexistenz: 0.6, weltmacht: 0.7 };
const WERTE_GEWICHT = { sicherheit: 1.0, kontrolle: 0.8, prestige: 0.5, wirtschaft: 0.4, usa: 0.2 };

export const REGIERUNGEN = {
  stalin: {
    name: 'Josef Stalin', kurz: 'Stalin', titel: 'Generalsekretär Josef Stalin', aussen: 'Wyschinski',
    lambda: 2.2, werte: WERTE_GEWICHT, ziele: { ...BASIS, westbindung_stoeren: 1.2, koexistenz: 0.3 },
    frage: 'Würde Stalin die DDR für ein neutrales Deutschland aufgeben?',
    typen: {
      stoermanoever: { p: 0.75, name: 'Störmanöver', kurz: 'nein – die Deutschlandpolitik ist ein Störmanöver',
        beschreibung: 'Die Angebote sollen vor allem die Westverträge aufhalten. Die DDR gibt Stalin nicht her.',
        ziele: { neutrales_deutschland: 0.2, ddr_halten: 1.6, west_berlin: 1.0, ostblock: 1.5 },
        berichte: [
          'Nach Erkenntnissen aus Ost-Berlin hat Stalin der SED-Führung versichert, Moskau werde die DDR unter keinen Umständen aufgeben.',
          'In Karlshorst wird der Aufbau einer kasernierten Volkspolizei beschleunigt – kein Zeichen für einen baldigen Abzug.',
        ] },
      ernst: { p: 0.25, name: 'Ernst gemeint', kurz: 'ja – ein neutrales Deutschland ist ihm wichtiger',
        beschreibung: 'Ein bündnisfreies Gesamtdeutschland wäre Stalin den Preis der DDR wert.',
        ziele: { neutrales_deutschland: 2.0, ddr_halten: 0.4, koexistenz: 1.0, ostblock: 0.9 },
        berichte: [
          'Ein Gesprächspartner aus dem sowjetischen Außenministerium deutet an, Moskau könne die SED für ein neutrales Deutschland fallen lassen.',
          'Ulbricht soll in Moskau zu hören bekommen haben, die DDR sei „kein Selbstzweck“.',
        ] },
    },
  },
  kollektiv: {
    name: 'Malenkow, Berija und Chruschtschow', kurz: 'Malenkow', titel: 'Kollektive Führung (Malenkow, Berija, Chruschtschow)', aussen: 'Molotow',
    lambda: 1.0, werte: WERTE_GEWICHT, ziele: { ...BASIS, koexistenz: 0.9 },
    frage: 'Ist die neue Führung bereit, die DDR aufzugeben?',
    typen: {
      harte_linie: { p: 0.65, name: 'Harte Linie', kurz: 'nein – sie hält an der DDR fest',
        beschreibung: 'Die Mehrheit im Präsidium will den Status quo sichern, auch mit Gewalt.',
        ziele: { ddr_halten: 1.3, neutrales_deutschland: 0.6 },
        berichte: ['Molotow soll im Präsidium jede Preisgabe der DDR als „Kapitulation“ bezeichnet haben.', 'Die sowjetischen Truppen in der DDR werden verstärkt.'] },
      berija_linie: { p: 0.35, name: 'Berija-Linie', kurz: 'ja – die DDR gilt als verhandelbar',
        beschreibung: 'Berija und Malenkow halten die DDR für eine Belastung und würden sie gegen ein neutrales Deutschland eintauschen.',
        ziele: { neutrales_deutschland: 1.8, ddr_halten: 0.3, koexistenz: 1.2 },
        berichte: ['Aus dem Umfeld Berijas heißt es, die DDR sei „nicht einmal ein richtiger Staat“.', 'Moskau hat die SED angewiesen, den „Aufbau des Sozialismus“ zu verlangsamen.'] },
    },
  },
  malenkow: {
    name: 'Georgi Malenkow', kurz: 'Malenkow', titel: 'Ministerpräsident Georgi Malenkow', aussen: 'Molotow',
    lambda: 1.5, werte: { ...WERTE_GEWICHT, wirtschaft: 0.8 }, ziele: { ...BASIS, koexistenz: 1.0 },
    frage: 'Sucht Malenkow ernsthaft den Ausgleich mit dem Westen?',
    typen: {
      entspannung: { p: 0.5, name: 'Entspannung', kurz: 'ja – er will den Ausgleich',
        beschreibung: 'Malenkow will Konsumgüter statt Rüstung und ist zu Zugeständnissen in Deutschland bereit.',
        ziele: { koexistenz: 1.6, neutrales_deutschland: 0.9, ddr_halten: 0.8 },
        berichte: ['Malenkow spricht öffentlich davon, ein Atomkrieg bedeute den „Untergang der Weltzivilisation“.', 'Die sowjetische Rüstungsproduktion wird zugunsten von Konsumgütern gedrosselt.'] },
      vorsicht: { p: 0.5, name: 'Vorsicht', kurz: 'nein – nur ein freundlicherer Ton',
        beschreibung: 'Der neue Ton ändert nichts an den Zielen: Die DDR bleibt.',
        ziele: { koexistenz: 0.7, ddr_halten: 1.4, neutrales_deutschland: 0.3 },
        berichte: ['In Ost-Berlin sind neue sowjetische Kredite für die Volkspolizei eingetroffen.', 'Das Präsidium soll beschlossen haben, die Westintegration „mit allen Mitteln, außer Krieg“ zu bekämpfen.'] },
    },
  },
  berija: {
    name: 'Lawrenti Berija', kurz: 'Berija', titel: 'Lawrenti Berija (Fiktion)', aussen: 'Molotow',
    lambda: 1.3, werte: { ...WERTE_GEWICHT, wirtschaft: 0.8 }, ziele: { ...BASIS, koexistenz: 1.0 },
    frage: 'Würde Berija die DDR verkaufen?',
    typen: {
      ausverkauf: { p: 0.6, name: 'Ausverkauf', kurz: 'ja – gegen Neutralität und Geld',
        beschreibung: 'Berija würde die DDR gegen ein neutrales Deutschland und Wirtschaftshilfe preisgeben.',
        ziele: { neutrales_deutschland: 2.2, ddr_halten: 0.2 },
        berichte: ['Berijas Vertraute sondieren in Wien, was der Westen für ein neutrales Deutschland zahlen würde.', 'Berija soll die SED-Führung als „Gauleiter von Moskaus Gnaden“ verspottet haben.'] },
      taktik: { p: 0.4, name: 'Taktik', kurz: 'nein – er nutzt das Angebot nur zur Machtsicherung',
        beschreibung: 'Die Angebote dienen Berija vor allem im Machtkampf. Die DDR bleibt ein Faustpfand.',
        ziele: { ddr_halten: 1.2, neutrales_deutschland: 0.6 },
        berichte: ['Berija soll der SED-Führung neue Sicherheitsgarantien gegeben haben.', 'Berijas Ministerium baut die Staatssicherheit der DDR weiter aus.'] },
    },
  },
  chruschtschow: {
    name: 'Nikita Chruschtschow', kurz: 'Chruschtschow', titel: 'Parteichef Nikita Chruschtschow', aussen: 'Gromyko',
    lambda: 1.3, werte: WERTE_GEWICHT, ziele: { ...BASIS },
    frage: 'Wie weit geht Chruschtschow, um West-Berlin zu bekommen und den Status quo zu erzwingen?',
    typen: {
      hasardeur: { p: 0.6, name: 'Hasardeur', kurz: 'weit – er geht hohe Risiken ein',
        beschreibung: 'Chruschtschow setzt auf Drohungen und Überraschungen und nimmt Krisen in Kauf.',
        ziele: { west_berlin: 1.4, weltmacht: 1.4, koexistenz: 0.4 },
        berichte: ['Chruschtschow soll gesagt haben, Berlin sei „die Hoden des Westens: Wenn ich will, dass der Westen schreit, drücke ich auf Berlin“.', 'Der KGB meldet eine auffällige Geheimhaltung um Schiffsladungen nach Übersee.'] },
      vorsichtig: { p: 0.4, name: 'Vorsichtig', kurz: 'nicht weit – er droht, aber scheut das Risiko',
        beschreibung: 'Chruschtschow droht laut, schreckt aber vor dem Krieg zurück und sucht die Koexistenz.',
        ziele: { west_berlin: 0.6, weltmacht: 0.7, koexistenz: 1.3 },
        berichte: ['Chruschtschow hat gegenüber Diplomaten betont, wegen Berlin werde niemand einen Krieg beginnen.', 'Moskau kürzt die Truppenstärke um mehr als eine Million Mann.'] },
    },
  },
  molotow: {
    name: 'Wjatscheslaw Molotow', kurz: 'Molotow', titel: 'Wjatscheslaw Molotow (Fiktion)', aussen: 'Schepilow',
    lambda: 2.0, werte: { ...WERTE_GEWICHT, kontrolle: 1.2 }, ziele: { ...BASIS, ostblock: 1.6, koexistenz: 0.4 },
    frage: 'Ist Molotow zu Kompromissen fähig?',
    typen: {
      hardliner: { p: 0.8, name: 'Hardliner', kurz: 'nein – er kennt nur Härte',
        beschreibung: 'Molotow sieht in jedem Zugeständnis Schwäche.', ziele: { ddr_halten: 1.5, west_berlin: 1.0, koexistenz: 0.2 },
        berichte: ['Molotow soll im Präsidium die „Entstalinisierung“ für einen Fehler erklärt haben.', 'Die sowjetischen Truppen in Ungarn und der DDR erhalten neue Panzer.'] },
      pragmatiker: { p: 0.2, name: 'Pragmatiker', kurz: 'ja – hart im Ton, aber verhandlungsbereit',
        beschreibung: 'Hinter der harten Fassade rechnet Molotow kühl und ist zu Geschäften bereit.', ziele: { koexistenz: 1.1, neutrales_deutschland: 0.8 },
        berichte: ['Molotow hat westlichen Diplomaten ungewöhnlich offen eine „Verhandlungslösung für Deutschland“ in Aussicht gestellt.', 'Moskau hat seine Handelsdelegationen in Westeuropa aufgestockt.'] },
    },
  },
};

/** Außenminister zum Zeitpunkt (für Texte) */
export function aussenminister(z, regime) {
  if (regime === 'molotow') return 'Schepilow';
  if (zeitIndex(z) < zeitIndex(1949.1)) return 'Molotow';
  if (zeitIndex(z) < zeitIndex(1953.1)) return 'Wyschinski';
  if (zeitIndex(z) < zeitIndex(1956.2)) return 'Molotow';
  return 'Gromyko';
}

// ---------------------------------------------------------------- Regierungswechsel

const WECHSEL = [
  { id: 'stalins_tod', zeit: 1953.1, von: ['stalin'], titel: 'Stalins Tod',
    ausgaenge: [{ regime: 'kollektiv', hist: 1, frei: 1, meldung: 'Josef Stalin ist am 5. März gestorben. Malenkow, Berija und Chruschtschow teilen sich die Macht.' }] },
  { id: 'machtkampf1953', zeit: 1953.2, von: ['kollektiv'], titel: 'Machtkampf im Kreml',
    ausgaenge: [
      { regime: 'malenkow', hist: 1, frei: 0.5, meldung: 'Lawrenti Berija ist im Juni verhaftet worden. Ministerpräsident Malenkow und Parteichef Chruschtschow führen die Sowjetunion.' },
      // Läuft die Einheit schon, hat Berija im Präsidium ein Argument
      { regime: 'berija', hist: s => (brd(s).f.neutral || s.weltflags.juni17_zugestaendnisse ? 0.4 : 0), frei: 0.35,
        meldung: 'Im Kreml hat sich Lawrenti Berija durchgesetzt; Malenkow ist nur noch Aushängeschild. (Fiktion)' },
      { regime: 'chruschtschow', hist: 0, frei: 0.15, meldung: 'Parteichef Chruschtschow hat Berija verhaften lassen und Malenkow entmachtet. (Fiktion: früher als in der Geschichte)' },
    ] },
  { id: 'malenkow_sturz', zeit: 1955.1, von: ['malenkow'], titel: 'Malenkows Sturz',
    ausgaenge: [
      { regime: 'chruschtschow', hist: 1, frei: 0.6, meldung: 'Malenkow muss als Ministerpräsident zurücktreten; Nachfolger wird Bulganin. Die Macht liegt bei Parteichef Chruschtschow.' },
      { regime: 'malenkow', hist: 0, frei: 0.4, meldung: 'Malenkow behauptet sich gegen Chruschtschow und bleibt an der Spitze. (Fiktion)' },
    ] },
  { id: 'berija_sturz', zeit: 1955.1, von: ['berija'], titel: 'Machtkampf um Berija',
    ausgaenge: [
      { regime: 'berija', hist: 0.5, frei: 0.5, meldung: 'Berija hat seine Gegner im Präsidium ausgeschaltet. (Fiktion)' },
      { regime: 'chruschtschow', hist: 0.5, frei: 0.5, meldung: 'Partei und Armee haben Berija gestürzt; Chruschtschow übernimmt die Führung. (Fiktion)' },
    ] },
  { id: 'antipartei', zeit: 1957.2, von: ['chruschtschow'], titel: 'Die „Antiparteigruppe“',
    ausgaenge: [
      { regime: 'chruschtschow', hist: 1, frei: 0.65, meldung: 'Chruschtschow hat die „Antiparteigruppe“ um Molotow, Malenkow und Kaganowitsch entmachtet.' },
      { regime: 'molotow', hist: 0, frei: 0.35, meldung: 'Im Präsidium ist Chruschtschow gestürzt worden. Die „Antiparteigruppe“ um Molotow übernimmt die Macht. (Fiktion)' },
    ] },
];

// ---------------------------------------------------------------- Entscheidungen

const flucht = s => brd(s).w.flucht ?? 30;

const ereignisse = [
  // ------------------------------------------------------------ 1946–1949
  {
    id: 'su_iran', titel: 'Die Truppen im Iran', ab: 1946.1, bis: 1946.1, ordnung: 4,
    optionen: [
      { text: 'Die Truppen gegen eine Ölkonzession abziehen.', hist: true, dient: { koexistenz: 1.1, weltmacht: -0.1 }, w: { usa: 5, prestige: -2, wirtschaft: 2 },
        ergebnis: s => `${name(s)} lässt die Rote Armee aus dem Nordiran abziehen; Teheran sagt eine sowjetisch-iranische Ölgesellschaft zu.` },
      { text: 'Bleiben und die Republiken in Aserbaidschan und Kurdistan schützen.', dient: { weltmacht: 0.6, ostblock: 0.3, koexistenz: -1.2 }, w: s => ({ usa: s.weltflags.iran_druck ? -12 : -6, sicherheit: -6, prestige: 2 }),
        ergebnis: 'Die Rote Armee bleibt im Nordiran. Der Streit vor den Vereinten Nationen wird zur ersten Krise zwischen den Siegermächten. (Fiktion)',
        aktion: (s, a) => a.weltflag('iran_besetzt') },
    ],
  },
  {
    id: 'su_marshall', titel: 'Der Marshallplan', ab: 1947.1, bis: 1947.1, ordnung: 6.5,
    wenn: s => !!s.weltflags.marshall_angebot,
    optionen: [
      { text: 'Ablehnen und den Volksdemokratien die Teilnahme verbieten.', hist: true, dient: { ostblock: 0.6, westbindung_stoeren: 0.3 }, w: { kontrolle: 5, usa: -6, wirtschaft: -2 },
        ergebnis: 'Molotow verlässt die Pariser Konferenz. Polen und die Tschechoslowakei müssen ihre Zusage zurückziehen.',
        aktion: (s, a) => a.weltflag('marshall_ost', 'nein') },
      { text: 'Mitmachen und amerikanische Hilfe annehmen.', dient: { koexistenz: 0.9, ostblock: -0.3 }, w: { wirtschaft: 8, kontrolle: -4, usa: 6 },
        ergebnis: 'Die Sowjetunion erklärt sich bereit, am europäischen Wiederaufbauprogramm teilzunehmen. In Washington ist man überrascht – und uneins. (Fiktion)',
        aktion: (s, a) => a.weltflag('marshall_ost', 'ja') },
    ],
  },
  {
    id: 'su_kominform', titel: 'Zwei Lager', ab: 1947.2, bis: 1947.2, ordnung: 9,
    optionen: [
      { text: 'Das Kominform gründen: Die Kommunisten Europas sollen gegen den Marshallplan kämpfen.', hist: true, dient: { ostblock: 0.6, westbindung_stoeren: 0.4, koexistenz: -0.2 }, w: { kontrolle: 4, usa: -5 },
        ergebnis: 'In Polen gründen die kommunistischen Parteien das Kominform. Schdanow verkündet, die Welt sei in zwei Lager geteilt; die Parteien Frankreichs und Italiens sollen den Kampf aufnehmen.',
        aktion: (s, a) => a.weltflag('kominform') },
      { text: 'Den westlichen Kommunisten freie Hand lassen.', dient: { koexistenz: 1, ostblock: -0.1 }, w: { kontrolle: -2 },
        ergebnis: 'Moskau verzichtet auf eine neue Internationale. Die westlichen Kommunisten bleiben bei ihrem parlamentarischen Kurs. (Fiktion)' },
    ],
  },
  {
    id: 'su_prag', rueckblick: true, titel: 'Die Krise in Prag', ab: 1948.1, bis: 1948.1, ordnung: 2,
    optionen: [
      { text: 'Gottwald bei der Machtübernahme unterstützen.', hist: true, dient: { ostblock: 0.7, koexistenz: -0.2 }, w: { kontrolle: 5, usa: -8, prestige: -2 },
        ergebnis: 'In Prag übernehmen die Kommunisten unter Gottwald die Macht. Präsident Beneš gibt nach; Außenminister Jan Masaryk stirbt wenige Tage später.',
        aktion: (s, a) => a.weltflag('prag_putsch') },
      { text: 'Die Koalitionsregierung in Prag bestehen lassen.', dient: { koexistenz: 1, ostblock: -0.2 }, w: { kontrolle: -3, usa: 4 },
        ergebnis: 'Moskau hält Gottwald zurück. Die Tschechoslowakei bleibt eine Demokratie mit kommunistischem Regierungschef. (Fiktion)' },
    ],
  },
  {
    id: 'su_tito', titel: 'Der Streit mit Tito', ab: 1948.1, bis: 1948.1, ordnung: 6,
    optionen: [
      { text: 'Jugoslawien aus dem Kominform ausschließen.', hist: true, dient: { ostblock: 0.9 }, w: { kontrolle: -2, prestige: -2 },
        ergebnis: 'Das Kominform schließt die jugoslawischen Kommunisten aus. Tito geht seinen eigenen Weg.',
        aktion: (s, a) => a.weltflag('tito_bruch') },
      { text: 'Einen Ausgleich mit Tito suchen.', dient: { ostblock: -0.3, koexistenz: 0.3 }, w: { kontrolle: -3 },
        ergebnis: 'Moskau und Belgrad legen ihren Streit bei – vorerst. (Fiktion)' },
    ],
  },
  {
    id: 'su_blockade', rueckblick: true, titel: 'Der Weststaat und Berlin', ab: 1948.2, bis: 1948.2, ordnung: 1,
    wenn: s => (s.weltflags.weststaat_usa === 'ja' || s.weltflags.weststaat_paris === 'ja') && !s.weltflags.blockade,
    optionen: [
      { text: 'Alle Land- und Wasserwege nach West-Berlin sperren.', hist: true, dient: { west_berlin: 0.8, westbindung_stoeren: 0.5, koexistenz: -0.2 }, w: { usa: -12, prestige: 2 },
        ergebnis: 'Nach der Währungsreform in den Westzonen sperrt die Sowjetunion alle Land- und Wasserwege nach West-Berlin.',
        aktion: (s, a) => a.weltflag('blockade') },
      { text: 'Bei Protesten bleiben.', dient: { koexistenz: 1, west_berlin: -0.1 }, w: { prestige: -3 },
        ergebnis: 'Moskau protestiert gegen die Pläne für einen westdeutschen Staat, lässt die Zugänge nach Berlin aber offen. (Fiktion)' },
    ],
  },
  {
    id: 'su_blockade_ende', rueckblick: true, titel: 'Die Blockade beenden?', ab: 1949.1, bis: 1949.1, ordnung: 4.5,
    wenn: s => !!s.weltflags.blockade && !s.weltflags.blockade_ende && !s.weltflags.berlin_aufgegeben,
    optionen: [
      { text: 'Die Blockade aufheben.', hist: true, dient: { koexistenz: 1.4, west_berlin: -0.2 }, w: { usa: 6, prestige: -2 },
        ergebnis: 'Im Mai hebt die Sowjetunion die Blockade West-Berlins auf. Die Luftbrücke hat sie gebrochen.',
        aktion: (s, a) => a.weltflag('blockade_ende') },
      { text: 'Die Blockade fortsetzen.', dient: { west_berlin: 0.4, koexistenz: -1 }, w: { usa: -6, prestige: -5, wirtschaft: -3 },
        ergebnis: 'Die Blockade geht weiter. Die Luftbrücke auch.' },
    ],
  },
  {
    id: 'su_stalin_note', braucht: ['brd'], titel: 'Eine Note zur deutschen Frage', ab: 1952.1, ordnung: 2.5,
    wenn: s => !brd(s).f.neutral && !brd(s).f.vereinigt && !brd(s).f.westvertraege,
    optionen: [
      { text: 'Den Westmächten einen Friedensvertrag für ein neutrales Deutschland anbieten.', hist: true,
        dient: { westbindung_stoeren: 1, neutrales_deutschland: 0.6 }, w: { prestige: 2 },
        ergebnis: 'Die Sowjetregierung bietet den Westmächten in einer Note einen Friedensvertrag für ein wiedervereinigtes, neutrales Deutschland an.',
        aktion: (s, a) => a.sende('brd', 'stalin_note') },
      { text: 'Keine Initiative.', still: true, dient: { ddr_halten: 0.4 } },
    ],
  },
  // Rückfragen der BRD auf der Viermächtekonferenz und bei den Einheitsverhandlungen
  {
    id: 'su_viermaechte_wahlen', titel: 'Freie Wahlen in ganz Deutschland?', nurRueckfrage: true, wiederholbar: true,
    optionen: [
      { text: 'Freie Wahlen unter internationaler Aufsicht annehmen.', antwort: 'ja',
        dient: s => ({ neutrales_deutschland: 1, ddr_halten: -1, westbindung_stoeren: brd(s).f.stalin_angenommen ? 1 : 0.5 }), w: { prestige: -2 },
        ergebnis: s => `${aussenminister(s.zeit, s.regime)} akzeptiert freie, international überwachte Wahlen in ganz Deutschland.` },
      { text: 'Freie Wahlen ablehnen.', antwort: 'nein', hist: true, dient: { ddr_halten: 1 },
        ergebnis: s => `${aussenminister(s.zeit, s.regime)} lehnt freie Wahlen unter internationaler Aufsicht ab.` },
    ],
  },
  {
    id: 'su_viermaechte_rat', titel: 'Ein Gesamtdeutscher Rat?', nurRueckfrage: true, wiederholbar: true,
    optionen: [
      { text: 'Den paritätischen Gesamtdeutschen Rat einberufen.', antwort: 'ja',
        dient: { neutrales_deutschland: 1, westbindung_stoeren: 1, ddr_halten: 0.3 },
        ergebnis: 'Moskau stimmt einem paritätischen Gesamtdeutschen Rat zu.' },
      { text: 'Die Verhandlungen in die Länge ziehen.', antwort: 'nein', dient: { ddr_halten: 1, westbindung_stoeren: 0.6 },
        ergebnis: 'Moskau zieht die Verhandlungen über einen Gesamtdeutschen Rat in die Länge.' },
    ],
  },
  {
    id: 'su_abkommen', titel: 'Den Vertrag über die Einheit unterzeichnen?', nurRueckfrage: true, wiederholbar: true,
    optionen: [
      { text: 'Unterzeichnen.', antwort: 'ja', dient: s => ({ neutrales_deutschland: 1.5, ddr_halten: -1 }),
        w: s => ({ sicherheit: s.anfrage?.grenze ? 8 : -4 }),
        ergebnis: 'Moskau unterzeichnet den Vertrag über die Einheit Deutschlands.' },
      { text: 'Die Verhandlungen abbrechen.', antwort: 'nein', dient: { ddr_halten: 1 },
        ergebnis: 'Moskau bricht die Verhandlungen über die deutsche Einheit ab.' },
    ],
  },
  {
    id: 'su_berliner_konferenz', titel: 'Ein Wahlgesetz für Deutschland?', nurRueckfrage: true, wiederholbar: true,
    optionen: [
      { text: 'Auf das Bonner Signal eingehen und über ein Wahlgesetz verhandeln.', antwort: 'ja', w: { prestige: -2 },
        dient: { neutrales_deutschland: 1, ddr_halten: -0.8, westbindung_stoeren: 0.8 },
        ergebnis: 'Molotow erklärt in Berlin, Moskau sei bereit, über ein gesamtdeutsches Wahlgesetz zu sprechen.' },
      { text: 'Auf einer paritätischen Regierung bestehen.', antwort: 'nein', hist: true, dient: { ddr_halten: 1, westbindung_stoeren: 0.3 },
        ergebnis: 'Molotow beharrt in Berlin auf einer paritätischen Regierung beider deutscher Staaten.' },
    ],
  },
  {
    id: 'su_juni17', braucht: ['brd'], titel: 'Aufstand in der DDR', ab: 1953.1, ordnung: 5.5,
    wenn: s => !brd(s).f.vereinigt && !brd(s).f.neutral,
    optionen: [
      { text: 'Den Aufstand mit Panzern niederschlagen.', hist: true, dient: { ostblock: 1, ddr_halten: 1 }, w: { kontrolle: 10, prestige: -4, usa: -3 },
        ergebnis: 'Sowjetische Panzer schlagen den Aufstand in der DDR nieder.',
        aktion: (s, a) => { a.weltflag('juni17_panzer'); a.sende('brd', 'juni17'); } },
      { text: 'Zugeständnisse machen und Ulbricht fallen lassen.', dient: { ostblock: -0.6, ddr_halten: -0.4, neutrales_deutschland: 0.8, koexistenz: 0.5 },
        w: { kontrolle: -10, prestige: 2, usa: 3 },
        ergebnis: 'Moskau lässt die Normerhöhungen zurücknehmen und Ulbricht fallen; die Panzer bleiben in den Kasernen.',
        aktion: (s, a) => { a.weltflag('juni17_zugestaendnisse'); a.sende('brd', 'juni17'); } },
    ],
  },
  {
    id: 'su_einladung', braucht: ['brd'], titel: 'Diplomatische Beziehungen mit Bonn?', ab: 1955.2, ordnung: 8.5,
    wenn: s => !brd(s).f.vereinigt && !brd(s).f.moskau_beziehungen,
    optionen: [
      { text: 'Den Bundeskanzler zu Gesprächen über diplomatische Beziehungen einladen.', hist: true,
        dient: { koexistenz: 0.6, westbindung_stoeren: 0.5, ddr_halten: 0.3 }, w: { prestige: 2 },
        ergebnis: 'Moskau lädt den Bundeskanzler zu Gesprächen über diplomatische Beziehungen ein.',
        aktion: (s, a) => a.sende('brd', 'einladung_moskau') },
      { text: 'Bonn weiter links liegen lassen.', still: true, dient: { ostblock: 0.3 } },
    ],
  },
  {
    id: 'su_gefangene', titel: 'Die Kriegsgefangenen', nurRueckfrage: true, wiederholbar: true,
    optionen: [
      { text: 'Die Gefangenen gegen diplomatische Beziehungen freilassen.', antwort: 'ja', hist: true,
        dient: { koexistenz: 0.6, ddr_halten: 0.3, westbindung_stoeren: 0.3 }, w: { prestige: -1 },
        ergebnis: 'Moskau sagt die Freilassung der letzten deutschen Kriegsgefangenen zu.' },
      { text: 'Keine Gefangenen als Gegenleistung.', antwort: 'nein', w: { prestige: 1 }, dient: { ostblock: 0.2 },
        ergebnis: 'Moskau lehnt jede Verknüpfung mit den Kriegsgefangenen ab.' },
    ],
  },
  {
    id: 'su_einheit_verhandeln', titel: 'Über die Einheit verhandeln?', nurRueckfrage: true, wiederholbar: true,
    optionen: [
      { text: 'Gespräche über die deutsche Einheit zusagen.', antwort: 'ja', dient: { neutrales_deutschland: 1, ddr_halten: -1, koexistenz: 0.4 },
        ergebnis: 'Moskau sagt Gespräche über die deutsche Einheit zu.' },
      { text: 'Jede Verknüpfung ablehnen.', antwort: 'nein', hist: true, dient: { ddr_halten: 1 },
        ergebnis: 'Moskau lehnt es ab, über die deutsche Einheit zu sprechen: Es gebe zwei deutsche Staaten.' },
    ],
  },
  {
    id: 'su_ungarn', titel: 'Aufstand in Ungarn', ab: 1956.2, ordnung: 9.5,
    optionen: [
      { text: 'Einmarschieren.', hist: true, dient: { ostblock: 1.2 }, w: { kontrolle: 10, prestige: -5, usa: -6 },
        ergebnis: 'Sowjetische Truppen schlagen den Aufstand in Ungarn nieder.',
        aktion: (s, a) => { a.weltflag('ungarn_einmarsch'); a.sende('brd', 'ungarn'); } },
      { text: 'Ungarn ziehen lassen: Neutralität nach österreichischem Vorbild.', dient: { ostblock: -0.8, koexistenz: 1.5 }, w: { kontrolle: -10, prestige: -4, usa: 8 },
        ergebnis: 'Moskau lässt Ungarn ziehen. Das Land tritt aus dem Warschauer Pakt aus und wird neutral.',
        aktion: (s, a) => { a.weltflag('ungarn_neutral'); a.sende('brd', 'ungarn'); } },
    ],
  },
  {
    id: 'su_berlin_ultimatum', braucht: ['brd'], titel: 'Ein Ultimatum für Berlin?', ab: 1958.2, ordnung: 10.5,
    wenn: s => !brd(s).f.vereinigt && !brd(s).f.freistadt_vereinbart,
    optionen: [
      { text: 'Den Westmächten ein Ultimatum stellen: West-Berlin soll Freie Stadt werden.', hist: true,
        dient: s => ({ west_berlin: 1, ddr_halten: 0.5 * flucht(s) / 30, koexistenz: -0.5 }), w: { prestige: 3, usa: -5 },
        ergebnis: s => `${name(s)} verlangt in einer Note an die Westmächte, West-Berlin binnen sechs Monaten in eine „entmilitarisierte Freie Stadt“ umzuwandeln.`,
        aktion: (s, a) => a.sende('brd', 'berlin_ultimatum') },
      { text: 'Abwarten.', still: true, dient: { koexistenz: 0.3 } },
    ],
  },
  {
    id: 'su_mauer', braucht: ['brd'], titel: 'Ulbricht will die Grenze schließen', ab: 1961.2, ordnung: 7.5,
    wenn: s => !brd(s).f.vereinigt && !brd(s).f.freistadt_vereinbart,
    optionen: [
      { text: 'Ulbricht die Abriegelung der Sektorengrenze erlauben.', hist: true,
        dient: s => ({ ddr_halten: flucht(s) / 25 + (brd(s).f.berlinkrise ? 0.4 : 0), ostblock: 0.4, west_berlin: -0.3 }),
        w: s => ({ prestige: -6, usa: -3, sicherheit: s.weltflags.essentials === 'ganz_berlin' ? -10 : 0 }),
        ergebnis: 'Moskau gibt Ulbricht freie Hand, die Sektorengrenze in Berlin abzuriegeln.',
        aktion: (s, a) => a.weltflag('mauer_genehmigt') },
      { text: 'Ablehnen und der DDR Wirtschaftshilfe zusagen.', dient: s => ({ ddr_halten: 0.6 - flucht(s) / 60, koexistenz: 0.3 }), w: { wirtschaft: -6 },
        ergebnis: 'Moskau lehnt eine Abriegelung Berlins ab und sagt der DDR umfangreiche Wirtschaftshilfe zu.',
        aktion: (s, a) => a.weltflag('mauer_abgelehnt') },
    ],
  },
  {
    id: 'su_kuba', titel: 'Raketen für Kuba?', ab: 1962.2, ordnung: 8.5,
    optionen: [
      { text: 'Mittelstreckenraketen auf Kuba stationieren.', hist: true, dient: { weltmacht: 1.2, west_berlin: 0.3, koexistenz: -0.6 }, w: { sicherheit: 5, prestige: 3 },
        ergebnis: 'Amerikanische Aufklärer entdecken sowjetische Mittelstreckenraketen auf Kuba.',
        aktion: (s, a) => a.weltflag('raketen_kuba') },
      { text: 'Keine Raketen.', still: true, dient: { koexistenz: 0.3 } },
    ],
  },
  {
    id: 'su_kuba_antwort', titel: 'Die Seeblockade', nurRueckfrage: true, wiederholbar: true,
    optionen: [
      { text: 'Die Raketen gegen eine Nichtangriffszusage für Kuba abziehen.', antwort: 'abzug', hist: true,
        dient: { koexistenz: 1, weltmacht: -0.5 }, w: { prestige: -6, usa: 5, sicherheit: 5 },
        ergebnis: s => `Nach dreizehn Tagen lenkt ${name(s)} ein: Die Raketen werden abgezogen, Washington verzichtet auf eine Invasion Kubas.`,
        aktion: (s, a) => a.weltflag('kuba_ausgang', 'abzug') },
      { text: 'Gegendruck in Berlin: die Zugangswege sperren.', antwort: 'berlin', dient: { west_berlin: 0.8, weltmacht: 0.6, koexistenz: -1.5 }, w: { usa: -10, sicherheit: -15 },
        ergebnis: 'Moskau antwortet auf die Blockade Kubas mit einer Blockade West-Berlins.',
        aktion: (s, a) => a.weltflag('kuba_ausgang', 'berlin') },
    ],
  },
  {
    id: 'su_kuba_angriff', titel: 'Der Luftangriff auf Kuba', nurRueckfrage: true, wiederholbar: true,
    optionen: [
      { text: 'Zurückweichen.', antwort: 'abzug', dient: { koexistenz: 1.4, weltmacht: -1 }, w: { prestige: -12 },
        ergebnis: 'Moskau protestiert scharf, weicht aber zurück. Die verbliebenen Raketen werden abgezogen.',
        aktion: (s, a) => a.weltflag('kuba_ausgang', 'abzug') },
      { text: 'Vergeltung in Berlin.', antwort: 'berlin', dient: { weltmacht: 1, west_berlin: 0.6, koexistenz: -1.6 }, w: { usa: -20, sicherheit: -25 },
        ergebnis: 'Sowjetische Truppen riegeln West-Berlin ab. Die Welt steht am Rand des Atomkriegs.',
        aktion: (s, a) => a.weltflag('kuba_ausgang', 'berlin'),
        zufall: [
          { p: 0.25, aktion: (s, a) => { a.weltflag('atomkrieg'); a.ende('krieg'); } },
          {},
        ] },
    ],
  },
];

// ---------------------------------------------------------------- Modell

function rundenende(s) {
  const w = s.w;
  for (const [k, ziel] of [['sicherheit', 50], ['kontrolle', 65], ['prestige', 50], ['wirtschaft', 45], ['usa', 30]]) {
    w[k] += (ziel - w[k]) * 0.1;
    w[k] = Math.round(w[k] * 10) / 10;
  }
}

export default {
  id: 'su',
  name: 'Sowjetunion',
  kurz: 'UdSSR',
  hauptstadt: 'Moskau',
  spielbar: false,
  werte: {
    sicherheit: { name: 'Sicherheit', min: 0, max: 100 },
    kontrolle: { name: 'Kontrolle über den Ostblock', min: 0, max: 100 },
    prestige: { name: 'Prestige', min: 0, max: 100 },
    wirtschaft: { name: 'Wirtschaft', min: 0, max: 100 },
    usa: { name: 'Ansehen in Washington', min: 0, max: 100, beziehung: 'usa' },
  },
  startzustand: () => ({ w: { sicherheit: 45, kontrolle: 70, prestige: 50, wirtschaft: 40 }, f: {} }),
  startRegime: 'stalin',
  regierungen: REGIERUNGEN,
  wechsel: WECHSEL,
  ereignisse,
  modell: { rundenende },
};
