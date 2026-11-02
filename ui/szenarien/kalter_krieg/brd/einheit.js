// Der alternative Strang: ein neutrales, wiedervereinigtes Deutschland.
// Er öffnet sich über die Stalin-Note 1952 oder die Berliner Konferenz 1954.
import { vereinigt, Land, land, hauptstadt, spdRegiert } from './hilfen.js';
import { zeitPlus, zeitIndex, jahrVon, zeitText } from '../../../engine.js';

const folgeEreignisse = [
  ['n_friedensvertrag', 1], ['n_waehrung', 1], ['n_hauptstadt', 2], ['n_bodenreform', 2],
  ['n_sed', 3], ['n_montan', 3], ['n_streitkraefte', 4],
];

function vereinigen(s) {
  s.f.vereinigt = s.zeit;
  s.f.neutral = true;
  s.w.einheit = 100;
  // Der Kanzler der Einheit
  s.w.ansehen = Math.min(30, s.w.ansehen + 2);
  s.w.kanzlerbonus = Math.min(10, s.w.kanzlerbonus + 2);
  s.f['wk_' + s.zeit] = true;
  // Wahl in dieser Runde sicherstellen, folgende Wahlen im Vierjahrestakt
  if (!s.wahlplan.some(z => zeitIndex(z) === zeitIndex(s.zeit))) {
    const plan = [s.zeit];
    let z = s.zeit;
    for (;;) { z = zeitPlus(z, 8); if (z > 1964.15) break; plan.push(z); }
    s.wahlplan = s.wahlplan.filter(x => zeitIndex(x) < zeitIndex(s.zeit)).concat(plan);
  }
  for (const [id, n] of folgeEreignisse) s.geplant.push({ id, zeit: zeitPlus(s.zeit, n) });
}

function scheitern(s) {
  delete s.f.neutral;
  s.f.chance_vertan = true;
  // Wurde in der Zwischenzeit die EVG blockiert, beginnt der Westkurs mit London neu
  if (s.f.westvertraege && !s.f.evg && s.zeit >= 1954.2) s.f.evg_gescheitert = true;
}

export default [
  {
    id: 'n_viermaechte',
    titel: 'Die Viermächtekonferenz über Deutschland',
    datum: 'Herbst 1952',
    nurGeplant: true, ordnung: 8,
    absender: 'Beobachterdelegation in Wien',
    ascii: 'note',
    text: s => `Auf deinen Druck hin haben sich die Außenminister der vier Mächte in Wien versammelt. ${s.f.stalin_angenommen ? 'Da Bonn die Neutralität bereits akzeptiert hat, verhandelt Molotow ungewohnt konziliant.' : 'Die Westmächte sind nur widerwillig gekommen.'}

Der Kern des Streits ist die Reihenfolge. Der Westen verlangt zuerst freie, international überwachte Wahlen in ganz Deutschland. Moskau will zuerst einen „Gesamtdeutschen Rat“, in dem Bundesrepublik und DDR gleich viele Vertreter stellen und der die Wahlen vorbereitet – mit der SED als gleichberechtigter Partnerin.`,
    optionen: [
      { text: 'Freie Wahlen unter internationaler Aufsicht zur Bedingung machen.',
        zufall: [
          { p: s => 0.2 + (s.f.stalin_angenommen ? 0.15 : 0) + (s.w.einheit - 30) / 200 + (s.w.moskau - 50) / 200,
            ergebnis: 'Nach wochenlangem Ringen gibt Molotow nach: Eine Viermächtekommission soll die Wahlen überwachen. Ein Vertrag über die Einheit wird ausgehandelt.',
            w: { einheit: 15, usa: 3, moskau: 5 }, setze: ['neutral'], plane: [{ id: 'n_abkommen', in: 1 }] },
          { ergebnis: 'Molotow bleibt hart, die Konferenz scheitert. Die Westmächte drängen Bonn, die Westverträge nun doch zu unterzeichnen.',
            w: { einheit: -8, moskau: -3 }, aktion: s => scheitern(s) },
        ] },
      { text: 'Den sowjetischen Weg akzeptieren: einen paritätischen Gesamtdeutschen Rat.', richtung: 'ost',
        w: { usa: -10, koalition: -14, ansehen: -3 },
        zufall: [
          { p: 0.65,
            ergebnis: 'Der Gesamtdeutsche Rat tritt zusammen. Ost-CDU, LDPD und SED sitzen neben Union, SPD und FDP. Ein Vertrag über die Einheit wird ausgehandelt.',
            w: { einheit: 18, moskau: 10 }, setze: ['neutral', 'paritaet'], plane: [{ id: 'n_abkommen', in: 1 }] },
          { ergebnis: 'Trotz des Bonner Entgegenkommens zieht Moskau die Verhandlungen in die Länge. Der Westen verliert die Geduld; die Konferenz zerfällt.',
            w: { einheit: -5 }, aktion: s => scheitern(s) },
        ] },
      { text: 'Die Konferenz für gescheitert erklären und zu den Westverträgen zurückkehren.', richtung: 'west',
        ergebnis: 'Washington atmet auf. Die Verträge können unterzeichnet werden.',
        w: { usa: 5, einheit: -6 }, aktion: s => scheitern(s) },
    ],
    historisch: 'Diese Konferenz hat nie stattgefunden. Die Westmächte und Adenauer lehnten 1952 Viermächteverhandlungen ohne vorherige Zusage freier Wahlen ab.',
  },
  {
    id: 'n_abkommen',
    titel: 'Der Vertrag über die deutsche Einheit',
    datum: s => (s.zeit < 1954 ? 'Frühjahr 1953' : 'Herbst 1954'),
    nurGeplant: true, ordnung: 2,
    absender: 'Verhandlungsdelegation, Wien',
    text: s => `${s.zeit < 1954 ? 'Am 5. März ist Stalin gestorben. In Moskau soll Innenminister Berija angedeutet haben, die DDR sei für die Sowjetunion entbehrlich, wenn ein neutrales Deutschland herauskomme. ' : ''}Der Vertragsentwurf liegt vor: gesamtdeutsche Wahlen binnen sechs Monaten, Abzug aller Besatzungstruppen innerhalb eines Jahres, Neutralität nach dem Vorbild der Schweiz, garantiert von den vier Mächten.

Offen ist ein Punkt, der alles entscheidet: die Grenze im Osten. Moskau verlangt die endgültige Anerkennung der Oder-Neiße-Linie. Für Millionen Vertriebene hieße das, dass Schlesien, Pommern und Ostpreußen für immer verloren sind. Der BHE droht mit dem Sturz der Regierung.`,
    optionen: [
      { text: 'Die Oder-Neiße-Grenze anerkennen. Die Einheit hat ihren Preis.',
        w: { ansehen: -8, koalition: -15, einheit: 15 },
        zufall: [
          { p: s => 0.8 - Math.max(0, 50 - s.w.moskau) / 100,
            ergebnis: 'Der Vertrag wird unterzeichnet. In Vertriebenenversammlungen werden Bilder des Kanzlers verbrannt. Aber Deutschland wird eins sein.',
            setze: ['grenze_anerkannt'], plane: [{ id: 'n_wahlkampf', in: 1 }] },
          { ergebnis: 'Selbst dieses Zugeständnis reicht nicht. Im Kreml hat sich die Linie geändert, die DDR soll bleiben. Die Verhandlungen brechen ab.',
            w: { einheit: -20 }, aktion: s => scheitern(s) },
        ] },
      { text: 'Die Grenzfrage einem späteren Friedensvertrag vorbehalten.',
        zufall: [
          { p: s => 0.3 + (s.w.einheit - 40) / 200 - Math.max(0, 50 - s.w.moskau) / 150,
            ergebnis: 'Molotow willigt nach langem Zögern ein: Die Grenze bleibt bis zum Friedensvertrag offen. Ein diplomatisches Meisterstück.',
            w: { ansehen: 4, einheit: 15 }, plane: [{ id: 'n_wahlkampf', in: 1 }] },
          { ergebnis: 'Moskau lässt die Verhandlungen platzen. Die Chance ist vertan.',
            w: { einheit: -15, moskau: -4 }, aktion: s => scheitern(s) },
        ] },
      { text: 'Abbrechen. Der Preis ist zu hoch.', richtung: 'west',
        ergebnis: 'Die Westmächte sind erleichtert. Die Teilung bleibt.',
        w: { usa: 6, einheit: -15, ansehen: 1 }, aktion: s => scheitern(s) },
    ],
    historisch: 'Fiktion. Tatsächlich vertrat die Bundesrepublik bis 1970 den Rechtsstandpunkt, die Grenzen von 1937 bestünden bis zu einem Friedensvertrag fort. Die Oder-Neiße-Grenze wurde erst mit dem Zwei-plus-Vier-Vertrag 1990 endgültig anerkannt.',
  },
  {
    id: 'n_wahlkampf',
    titel: 'Die erste gesamtdeutsche Wahl',
    datum: s => `${zeitText(s.zeit)}`,
    nurGeplant: true, ordnung: 7,
    absender: s => (spdRegiert(s) ? 'Parteivorstand der SPD' : 'Bundesgeschäftsstelle der CDU'),
    ascii: 'urne',
    text: s => spdRegiert(s) ? `Zum ersten Mal seit 1933 wählen alle Deutschen frei – von Aachen bis Frankfurt an der Oder. In den neuen Ländern hofft deine Partei auf ihre alten Hochburgen: Sachsen und Thüringen waren Kernland der Sozialdemokratie, bis die SPD dort 1946 in die SED gezwungen wurde. Die Union setzt auf die Ost-CDU, die durch Jahre der Zusammenarbeit mit der SED belastet ist. Die SED rechnet sich zweistellige Ergebnisse aus.

Die SPD steht in Umfragen bei ${String(s.w.zustimmung).replace('.', ',')} Prozent. Wie soll sie den Wahlkampf führen?` : `Zum ersten Mal seit 1933 wählen alle Deutschen frei – von Aachen bis Frankfurt an der Oder. In den neuen Ländern ist die Union schwach: Sachsen und Thüringen waren Hochburgen der Sozialdemokratie, und die Ost-CDU ist durch Jahre der Zusammenarbeit mit der SED belastet. Die SPD hofft auf eine Mehrheit. Die SED tritt als Sozialistische Einheitspartei an und rechnet sich zweistellige Ergebnisse aus.

Die Union steht in Umfragen bei ${String(s.w.zustimmung).replace('.', ',')} Prozent. Wie soll sie den Wahlkampf führen?`,
    optionen: s => (spdRegiert(s) ? [
      { text: 'Die Sozialdemokratie im Osten neu gründen – gegen die Zwangsvereinigung von 1946.',
        ergebnis: 'In Leipzig, Dresden und Erfurt füllen sich die Säle. Viele frühere Sozialdemokraten verlassen die SED.',
        w: { ansehen: 4, moskau: -3 } },
      { text: 'Die Bilanz der Einheit: Frieden, Freiheit, Arbeit.',
        ergebnis: 'Die Menschen im Osten wollen die D-Mark und volle Schaufenster.',
        w: s => ({ ansehen: Math.max(1, Math.round(s.w.wachstum - 4)) }) },
      { text: 'Ein Wahlkampf gegen die SED und gegen jeden, der mit ihr gemeinsame Sache macht.',
        ergebnis: 'Polarisierend, aber mobilisierend. Moskau beschwert sich über „Hetze“.',
        w: { ansehen: 3, moskau: -6 } },
    ] : [
      { text: 'Mit der Ost-CDU fusionieren und auf Jakob Kaiser setzen, den Gründer der Berliner CDU.',
        ergebnis: 'Kaiser zieht durch die Städte Sachsens und Thüringens. Die Union fasst im Osten Fuß.',
        w: { ansehen: 4, koalition: -2 }, setze: ['ost_cdu'] },
      { text: '„Wohlstand für alle Deutschen“ – Erhard und das Wirtschaftswunder.',
        ergebnis: 'Die Menschen im Osten wollen die D-Mark und volle Schaufenster.',
        w: s => ({ ansehen: Math.max(1, Math.round(s.w.wachstum - 4)) }) },
      { text: 'Ein Wahlkampf gegen die SED und gegen jeden, der mit ihr gemeinsame Sache macht.',
        ergebnis: 'Polarisierend, aber mobilisierend. Moskau beschwert sich über „Hetze“.',
        w: { ansehen: 3, moskau: -6 } },
    ]).map(o => ({ ...o, aktion: s => vereinigen(s) })),
    historisch: 'Fiktion. Die erste freie gesamtdeutsche Wahl seit 1932 fand am 2. Dezember 1990 statt.',
  },
  {
    id: 'n_friedensvertrag',
    titel: 'Der Friedensvertrag',
    datum: s => zeitText(s.zeit),
    nurGeplant: true, ordnung: 3,
    wenn: vereinigt,
    absender: 'Auswärtiges Amt',
    ascii: 'flagge',
    text: `Die vier Mächte haben einen Friedensvertrag ausgehandelt. Die letzten deutschen Kriegsgefangenen kehren aus der Sowjetunion heim, die Saar wird ohne Abstimmung zurückgegeben, die Besatzungstruppen ziehen ab. Deutschland ist souverän – und dauerhaft neutral.

Umstritten ist die Formulierung der Neutralität. Moskau will ein Verbot jeder „politischen, wirtschaftlichen oder militärischen Vereinigung, die sich gegen einen der Unterzeichnerstaaten richtet“ – was auch die Montanunion treffen könnte.`,
    optionen: [
      { text: 'Die Formulierung akzeptieren – Hauptsache, die Truppen gehen.',
        ergebnis: 'Der Vertrag wird in Wien unterzeichnet. In Friedland treffen die ersten Heimkehrer ein.',
        w: { souveraenitaet: 80, moskau: 10, usa: -3, ansehen: 6 }, setze: ['friedensvertrag', 'heimkehrer', 'saar_zurueck', 'neutralitaet_streng'] },
      { text: 'Auf einer engen, nur militärischen Neutralität bestehen.',
        zufall: [
          { p: s => 0.55 + (s.w.usa - 40) / 200,
            ergebnis: 'Mit Rückendeckung aus Washington setzt sich Bonn durch. Die Neutralität ist militärisch, nicht wirtschaftlich.',
            w: { souveraenitaet: 80, moskau: 4, usa: 3, ansehen: 6 }, setze: ['friedensvertrag', 'heimkehrer', 'saar_zurueck'] },
          { ergebnis: 'Moskau gibt nicht nach. Der Vertrag kommt mit einem halben Jahr Verspätung zustande, zu Moskaus Bedingungen.',
            w: { souveraenitaet: 70, moskau: 6, ansehen: 3 }, setze: ['friedensvertrag', 'heimkehrer', 'saar_zurueck', 'neutralitaet_streng'] },
        ] },
    ],
    historisch: 'Fiktion. Einen Friedensvertrag mit Deutschland hat es nie gegeben; der Zwei-plus-Vier-Vertrag von 1990 trat an seine Stelle.',
  },
  {
    id: 'n_waehrung',
    titel: 'Die Währungsunion',
    datum: s => zeitText(s.zeit),
    nurGeplant: true, ordnung: 4,
    wenn: vereinigt,
    absender: 'Bank deutscher Länder',
    text: `Die Ostmark soll durch die D-Mark ersetzt werden. Der Kurs ist die entscheidende Frage. Auf dem Schwarzmarkt bekommt man für eine D-Mark vier bis fünf Ostmark. Ein Umtausch zu 1:1 wäre ein Geschenk an die Menschen im Osten – und ein Schock für die Betriebe, deren Löhne über Nacht in harter Währung bezahlt werden müssten. Die Bank deutscher Länder warnt vor Inflation und Massenarbeitslosigkeit.`,
    optionen: [
      { text: 'Löhne und Ersparnisse 1:1 umstellen.',
        ergebnis: 'Jubel in Leipzig und Dresden. Viele volkseigene Betriebe können die Löhne nicht mehr erwirtschaften.',
        w: { ansehen: 5, haushalt: -10, arbeitslosigkeit: 2.5, impuls: 1 } },
      { text: 'Löhne 1:1, Ersparnisse 1:2.',
        ergebnis: 'Ein Kompromiss, mit dem beide Seiten leben können.',
        w: { ansehen: 2, haushalt: -5, arbeitslosigkeit: 1.2, impuls: 0.5 } },
      { text: 'Zum Marktkurs umstellen: 1:4.',
        ergebnis: 'Die Ökonomen applaudieren. In den neuen Ländern fühlt man sich betrogen.',
        w: { ansehen: -6, haushalt: -2, arbeitslosigkeit: 0.3 } },
    ],
    historisch: 'Fiktion – aber 1990 stand die Bundesregierung vor genau dieser Frage. Die Währungsunion vom 1. Juli 1990 stellte Löhne und Renten 1:1, Ersparnisse gestaffelt um.',
  },
  {
    id: 'n_hauptstadt',
    titel: 'Bonn oder Berlin?',
    datum: s => zeitText(s.zeit),
    nurGeplant: true, ordnung: 5,
    wenn: vereinigt,
    absender: 'Präsident des Bundestages',
    text: `Der Bundestag muss über die Hauptstadt entscheiden. Berlin ist die alte Hauptstadt, das Symbol der Einheit, aber auch der preußischen und nationalsozialistischen Vergangenheit, und liegt nahe der neuen Ostgrenze. Bonn ist bescheiden, rheinisch, westlich – und du wohnst in Rhöndorf.`,
    optionen: [
      { text: 'Berlin.',
        ergebnis: 'Die Regierung zieht in die zerstörte Mitte Berlins. Der Wiederaufbau verschlingt Milliarden.',
        w: { ansehen: 3, haushalt: -5, frankreich: -3, impuls: 0.5 }, setze: ['hauptstadt_berlin'] },
      { text: 'Bonn bleibt Regierungssitz, Berlin wird Hauptstadt dem Namen nach.',
        ergebnis: 'Ein rheinischer Kompromiss.',
        w: { ansehen: 1, haushalt: -1 } },
      { text: 'Bonn.',
        ergebnis: 'Im Osten fragt man, ob man nur angeschlossen worden sei.',
        w: { ansehen: -3, frankreich: 2 } },
    ],
  },
  {
    id: 'n_bodenreform',
    titel: 'Boden und Betriebe',
    datum: s => zeitText(s.zeit),
    nurGeplant: true, ordnung: 6,
    wenn: vereinigt,
    absender: 'Bundesministerium für gesamtdeutsche Fragen',
    text: `In der früheren Sowjetzone wurden nach 1945 alle Güter über 100 Hektar enteignet und an Neubauern verteilt, Fabriken wurden „volkseigen“. Die enteigneten Besitzer – viele leben heute im Westen – verlangen ihr Eigentum zurück. Die Neubauern und Arbeiter fürchten, alles wieder zu verlieren.`,
    optionen: [
      { text: 'Rückgabe vor Entschädigung.',
        ergebnis: 'Die Alteigentümer jubeln. In den Dörfern Mecklenburgs herrscht Angst.',
        w: { ansehen: -4, koalition: 4, impuls: -0.5 } },
      { text: 'Die Bodenreform bestätigen, Betriebe gegen Entschädigung privatisieren.',
        ergebnis: 'Ein Lastenausgleich für die Enteigneten wird beschlossen. Teuer, aber befriedend.',
        w: { ansehen: 3, haushalt: -5, impuls: 0.5 } },
      { text: 'Alles bleibt, wie es ist.',
        ergebnis: 'Die Alteigentümer ziehen vor Gericht. Die Wirtschaft im Osten bleibt staatlich geprägt.',
        w: { ansehen: 1, koalition: -6, impuls: -0.8 } },
    ],
  },
  {
    id: 'n_sed',
    titel: 'Was wird aus der SED?',
    datum: s => zeitText(s.zeit),
    nurGeplant: true, ordnung: 5,
    wenn: vereinigt,
    absender: 'Bundesministerium der Justiz',
    text: `Walter Ulbricht und andere Spitzenfunktionäre sitzen im Bundestag, andere sind nach Moskau gegangen. Die Akten des Ministeriums für Staatssicherheit sind zum Teil gesichert. Opfer der Speziallager und der Zwangskollektivierung verlangen Gerechtigkeit. Moskau lässt wissen, dass es Prozesse gegen seine Verbündeten als Verletzung des Geistes des Friedensvertrags betrachten würde.`,
    optionen: [
      { text: 'Strafverfolgung der Verantwortlichen und Öffnung der Akten.',
        ergebnis: 'Die Prozesse erschüttern das Land. Moskau protestiert scharf.',
        w: { ansehen: 3, moskau: -10 } },
      { text: 'Eine Amnestie für alle außer den schwersten Verbrechen.',
        ergebnis: 'Ein Schlussstrich, der vielen Opfern bitter aufstößt.',
        w: { ansehen: -3, moskau: 5 } },
      { text: 'Belastete aus dem öffentlichen Dienst entfernen, ohne Prozesse.',
        ergebnis: 'Ein Mittelweg, wie man ihn schon nach 1945 versucht hat.',
        w: { ansehen: 1, moskau: -2 } },
    ],
  },
  {
    id: 'n_montan',
    titel: 'Die Montanunion und die Neutralität',
    datum: s => zeitText(s.zeit),
    nurGeplant: true, ordnung: 6,
    wenn: s => vereinigt(s) && !!s.f.montanunion,
    absender: 'Sowjetische Botschaft',
    text: s => `Moskau erklärt, die Mitgliedschaft Deutschlands in der Montanunion verstoße gegen ${s.f.neutralitaet_streng ? 'den Wortlaut' : 'den Geist'} des Friedensvertrags. Die Hohe Behörde in Luxemburg sei ein Werkzeug der NATO-Staaten. Paris lässt wissen, ein Austritt wäre das Ende der deutsch-französischen Aussöhnung.`,
    optionen: [
      { text: 'Mitglied bleiben.',
        ergebnis: 'Moskau protestiert, Paris dankt.',
        w: s => ({ moskau: s.f.neutralitaet_streng ? -15 : -8, frankreich: 6, europa: 3 }) },
      { text: 'Austreten.',
        ergebnis: 'Die Montanunion besteht nur noch aus fünf Staaten. Schuman spricht von einem schwarzen Tag.',
        w: { moskau: 6, frankreich: -14, europa: -12, impuls: -0.6 }, loesche: ['montanunion'] },
      { text: 'Ein Sonderstatus als assoziiertes Mitglied.',
        ergebnis: 'Ein kompliziertes Gebilde, das niemanden ganz zufriedenstellt.',
        w: { moskau: -3, frankreich: -3, europa: -4 } },
    ],
  },
  {
    id: 'n_streitkraefte',
    titel: 'Ein neues deutsches Heer?',
    datum: s => zeitText(s.zeit),
    nurGeplant: true, ordnung: 5,
    wenn: vereinigt,
    absender: 'Amt für Landesverteidigung',
    text: s => `Der Friedensvertrag erlaubt Deutschland nationale Streitkräfte zur Verteidigung. Frühere Wehrmachtsoffiziere legen Pläne für ein Heer von 300.000 Mann vor. ${spdRegiert(s) ? 'Deine Partei' : 'Die SPD'} und die Kirchen wollen höchstens einen Grenzschutz. Die Nachbarn – im Osten wie im Westen – sind beunruhigt.`,
    optionen: [
      { text: 'Ein kleines Verteidigungsheer nach Schweizer Vorbild.',
        ergebnis: 'Ein Milizsystem mit kurzer Wehrpflicht. Die Nachbarn sind beruhigt.',
        w: { haushalt: -3, moskau: -2, bundeswehr: 1, ansehen: 1 } },
      { text: 'Keine Armee – nur ein Bundesgrenzschutz.',
        ergebnis: 'Deutschland verlässt sich auf die Garantie der vier Mächte.',
        w: { moskau: 4, usa: -2, ansehen: 1 } },
      { text: 'Ein starkes Heer mit allgemeiner Wehrpflicht.',
        ergebnis: 'In Paris, Warschau und Moskau werden alte Erinnerungen wach.',
        w: { haushalt: -6, moskau: -14, frankreich: -8, grossbritannien: -4, bundeswehr: 2 } },
    ],
  },
  {
    id: 'n_ungarn',
    titel: 'Ungarn – und das neutrale Deutschland',
    datum: 'November 1956',
    ab: 1956.2, ordnung: 10,
    wenn: vereinigt,
    absender: 'Gesandtschaft in Wien',
    ascii: 'aufstand',
    text: s => `In Budapest hat Imre Nagy den Austritt aus dem Warschauer Pakt und die Neutralität Ungarns erklärt – nach dem Vorbild Österreichs und Deutschlands. Sowjetische Panzer walzen den Aufstand nieder. Zehntausende fliehen.

Für viele Ungarn war das neutrale Deutschland ein Versprechen. Nun richten sich alle Blicke auf ${hauptstadt(s)}.`,
    optionen: [
      { text: 'Flüchtlinge aufnehmen und bei den Vereinten Nationen protestieren.',
        ergebnis: 'Deutschland nimmt Zehntausende auf. Moskau warnt vor „Einmischung“.',
        w: { ansehen: 3, moskau: -5, haushalt: -1 } },
      { text: 'Als Neutraler eine Vermittlung anbieten.',
        ergebnis: 'Chruschtschow lehnt ab. Aber man hat bemerkt, dass Deutschland eine eigene Rolle sucht.',
        w: { moskau: 2, usa: -2, ansehen: -1 } },
      { text: 'Den Grenzschutz an der tschechoslowakischen Grenze verstärken.',
        ergebnis: 'Ein Signal, das in Moskau als Provokation verstanden wird.',
        w: { moskau: -14, ansehen: 1 } },
    ],
  },
  {
    id: 'n_ewg',
    titel: 'Die Sechs und das neutrale Deutschland',
    datum: 'März 1957',
    ab: 1957.1, ordnung: 3,
    wenn: vereinigt,
    absender: 'Walter Hallstein',
    text: s => `Frankreich, Italien und die Benelux-Staaten wollen in Rom eine Europäische Wirtschaftsgemeinschaft gründen. Sie laden Deutschland ein. Ohne Deutschland, sagt Paul-Henri Spaak, sei der Gemeinsame Markt ein Torso. Moskau erklärt, ein Beitritt sei ${s.f.neutralitaet_streng ? 'ein klarer Bruch' : 'unvereinbar mit dem Geist'} des Friedensvertrags.`,
    optionen: [
      { text: 'Beitreten.',
        ergebnis: 'Deutschland ist Gründungsmitglied der EWG. Moskau spricht von Vertragsbruch.',
        w: s => ({ europa: 15, frankreich: 8, usa: 3, moskau: s.f.neutralitaet_streng ? -18 : -10, impuls: 0.6 }), setze: ['ewg'] },
      { text: 'Ein Freihandelsabkommen mit der EWG schließen.',
        ergebnis: 'Ein Weg, wie ihn auch Österreich gehen wird.',
        w: { europa: 6, frankreich: -2, moskau: -3, impuls: 0.2 } },
      { text: 'Draußen bleiben.',
        ergebnis: 'Die Sechs werden fünf. Die deutsche Industrie fürchtet um ihre Märkte.',
        w: { europa: -6, frankreich: -6, moskau: 4, impuls: -0.6 } },
    ],
  },
  {
    id: 'n_atom',
    titel: 'Die Bombe für das neutrale Deutschland?',
    datum: 'Frühjahr 1958',
    ab: 1958.1, ordnung: 3,
    wenn: vereinigt,
    absender: 'Bundesministerium für Atomfragen',
    text: `Seit dem Sputnik-Schock fragen manche Politiker und Militärs: Kann sich ein neutrales Land zwischen zwei Atommächten ohne eigene Bombe behaupten? Schweden und die Schweiz denken über eigene Kernwaffen nach. In Karlsruhe und Jülich entstehen Forschungsreaktoren.`,
    optionen: [
      { text: 'Feierlich auf Kernwaffen verzichten.',
        ergebnis: 'Ein Akt, der in der ganzen Welt Beachtung findet.',
        w: { moskau: 6, usa: 2, frankreich: 2, ansehen: 2 }, setze: ['abc_verzicht'] },
      { text: 'Nur zivile Forschung – aber keine Festlegung.',
        ergebnis: 'Die Unklarheit beunruhigt die Nachbarn.',
        w: { moskau: -4, frankreich: -2 } },
      { text: 'Die Option offenhalten und eine Anreicherungsanlage bauen.',
        ergebnis: 'Ein Sturm der Entrüstung in Ost und West.',
        w: { moskau: -22, usa: -10, frankreich: -8, haushalt: -4 }, setze: ['nationale_atomoption'] },
    ],
  },
  {
    id: 'n_chruschtschow',
    titel: 'Chruschtschow am Rhein',
    datum: 'Herbst 1959',
    ab: 1959.2, ordnung: 8,
    wenn: vereinigt,
    absender: 'Protokoll des Auswärtigen Amtes',
    ascii: 'kreml',
    text: s => `Der sowjetische Partei- und Regierungschef kommt zum Staatsbesuch nach ${s.f.hauptstadt_berlin ? 'Berlin' : 'Bonn'}. Er bringt ein Angebot mit: einen Freundschafts- und Handelsvertrag, langfristige Lieferungen von Erdöl und Erdgas gegen deutsche Röhren und Maschinen.`,
    optionen: [
      { text: 'Einen großen Handelsvertrag schließen.',
        ergebnis: 'Die Schwerindustrie an der Ruhr jubelt. Washington ist besorgt.',
        w: { moskau: 8, usa: -4, impuls: 0.6 } },
      { text: 'Einen Freundschaftsvertrag unterzeichnen.',
        ergebnis: 'Ein Rapallo der fünfziger Jahre, schreiben die westlichen Zeitungen.',
        w: { moskau: 15, usa: -12, frankreich: -6, grossbritannien: -6 } },
      { text: 'Höflich bleiben und nichts unterschreiben.',
        ergebnis: 'Chruschtschow reist verstimmt ab.',
        w: { moskau: -4 } },
    ],
  },
  {
    id: 'n_vertriebene',
    titel: 'Der Osten lässt nicht los',
    datum: 'Frühjahr 1960',
    ab: 1960.1, ordnung: 4,
    wenn: vereinigt,
    absender: 'Bund der Vertriebenen',
    text: s => (s.f.grenze_anerkannt
      ? 'Die Vertriebenenverbände fordern, die Anerkennung der Oder-Neiße-Grenze rückgängig zu machen. Auf dem Schlesiertreffen in Hannover sprechen Redner von „Verrat“. Warschau beobachtet jedes Wort aus Bonn.'
      : 'Polen verlangt, dass Deutschland die Oder-Neiße-Grenze endlich anerkennt. Moskau unterstützt die Forderung mit Nachdruck. Die Vertriebenenverbände drohen mit Massenprotesten.'),
    optionen: s => (s.f.grenze_anerkannt ? [
      { text: 'Klarstellen: Die Grenze ist endgültig.', ergebnis: 'Die Verbände toben, die Nachbarn sind beruhigt.', w: { ansehen: -3, moskau: 4 } },
      { text: 'Verständnis für die Vertriebenen zeigen.', ergebnis: 'Warschau und Moskau horchen auf.', w: { ansehen: 2, moskau: -8 } },
    ] : [
      { text: 'Die Grenze jetzt anerkennen.', ergebnis: 'Ein schmerzhafter Schritt, den viele dem Kanzler nie verzeihen werden.', w: { ansehen: -5, moskau: 10, koalition: -6 }, setze: ['grenze_anerkannt'] },
      { text: 'Am Rechtsstandpunkt festhalten.', ergebnis: 'Moskau erhöht den Druck.', w: { ansehen: 2, moskau: -8 } },
    ]),
  },
  {
    id: 'n_washington',
    titel: 'Ein Angebot aus Washington',
    datum: 'Herbst 1961',
    ab: 1961.2, ordnung: 9,
    wenn: vereinigt,
    absender: 'Persönlicher Gesandter des Präsidenten',
    text: `Ein Vertrauter Kennedys überbringt ein vertrauliches Angebot: Die USA würden Deutschland im Falle eines sowjetischen Angriffs beistehen, wenn deutsche und amerikanische Generalstäbe ihre Planungen heimlich abstimmen. Ein offener Verstoß gegen die Neutralität wäre es nicht – solange niemand davon erfährt.`,
    optionen: [
      { text: 'Zustimmen.',
        zufall: [
          { p: 0.3, ergebnis: 'Die Absprachen fliegen auf. Moskau spricht vom Bruch des Friedensvertrags.', w: { usa: 6, moskau: -25 } },
          { ergebnis: 'Die Generalstäbe sprechen miteinander. Niemand erfährt davon.', w: { usa: 8, moskau: -2 } },
        ] },
      { text: 'Ablehnen.', ergebnis: 'Die Neutralität bleibt rein. Washington ist enttäuscht.', w: { usa: -4 } },
    ],
  },
  {
    id: 'wahlkampf_allgemein',
    titel: s => `Wahlkampf ${jahrVon(s.zeit)}`,
    datum: s => zeitText(s.zeit),
    ab: 1953.1, bis: 1964.1, ordnung: 8,
    wenn: s => s.wahlplan.some(z => zeitIndex(z) === zeitIndex(s.zeit))
      && ![1953.2, 1957.2, 1961.2].includes(s.zeit) && !s.f['wk_' + s.zeit],
    absender: s => (spdRegiert(s) ? 'Parteivorstand der SPD' : 'Bundesgeschäftsstelle der CDU'),
    ascii: 'plakat',
    text: s => `Der nächste Bundestag wird gewählt. Die ${spdRegiert(s) ? 'SPD' : 'Union'} steht bei ${String(s.w.zustimmung).replace('.', ',')} Prozent, die Wirtschaft wächst mit ${String(s.w.wachstum).replace('.', ',')} Prozent, die Arbeitslosigkeit liegt bei ${String(s.w.arbeitslosigkeit).replace('.', ',')} Prozent.`,
    optionen: s => [
      { text: 'Auf den Kanzler setzen.', ergebnis: 'Ein Wahlkampf, ganz auf die Person zugeschnitten.', w: { ansehen: 3 } },
      { text: 'Auf die Wirtschaft setzen.', ergebnis: spdRegiert(s) ? 'Die Minister ziehen mit der Bilanz der Regierung durchs Land.' : 'Erhard zieht durchs Land.', w: { ansehen: Math.max(1, Math.round(s.w.wachstum - 3)) } },
      { text: 'Auf Sicherheit setzen.', ergebnis: 'Die Angst vor Moskau ist ein verlässlicher Wahlhelfer.', w: { ansehen: s.w.moskau <= 45 ? 5 : 2, moskau: -2 } },
    ].map(o => ({ ...o, setze: ['wk_' + s.zeit] })),
  },
];
