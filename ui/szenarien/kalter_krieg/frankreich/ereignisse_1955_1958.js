// Frankreich: Vorlagen 1955 bis 1958 (Algerienkrieg, Suez, Römische Verträge, Mai 1958)
import { vierte, fuenfte, istDeGaulle, algerienkrieg, indochinakrieg, machtUebergabeDeGaulle, notiereChef, gesamtSitze, zieheWahlVor } from './modell.js';
import { pariserAussen, brd, kanzler, bonn, bonnImWesten, bonnExistiert, deutschland } from './hilfen.js';
import { praesident } from '../brd/hilfen.js';
import { zeitIndex, zeitPlus } from '../../../engine.js';

const chef = s => s.regierungschef;
const regierung = s => (istDeGaulle(s) ? 'De Gaulle' : s.lager === 'militaer' ? 'Die Militärregierung' : `Ministerpräsident ${s.regierungschef}`);

/** Militärregierung nach einem gelungenen Putsch */
function junta(s, a, general) {
  s.lager = 'militaer';
  s.regierungschef = general;
  s.chefPartei = null;
  s.regierung = [];
  s.w.mehrheit = 50;
  s.w.ansehen = -6;
  s.w.armee = 85;
  s.f.junta_seit = s.zeit;
  s.f['gebildet_' + s.zeit] = true;
  s.wahlplan = (s.wahlplan || []).filter(z => zeitIndex(z) <= zeitIndex(s.zeit));
  notiereChef(s);
}

export default [
  // ------------------------------------------------------------------ 1955/I
  {
    id: 'fr_poujade',
    titel: 'Der Aufstand der kleinen Leute',
    datum: 'Frühjahr 1955',
    ab: 1955.1, ordnung: 3,
    wenn: vierte,
    absender: 'Ministerium für Finanzen',
    inland: true,
    text: `Ein Papierwarenhändler aus Saint-Céré, Pierre Poujade, hat die kleinen Händler und Handwerker gegen die Steuerprüfer mobilisiert. Seine „Union zur Verteidigung der Händler und Handwerker“ verhindert Betriebsprüfungen mit Menschenketten, sie füllt Säle in ganz Frankreich. Seine Reden richten sich gegen die „Technokraten“, gegen Paris und immer öfter gegen „die Juden“ wie Mendès France. Er droht, bei der nächsten Wahl eigene Listen aufzustellen.`,
    optionen: [
      { text: 'Den Händlern entgegenkommen: weniger Steuerprüfungen, ein Moratorium.', richtung: 'sparen',
        ergebnis: 'Die Regierung setzt Steuerprüfungen aus. Poujade feiert einen Sieg; die Bewegung verliert etwas an Schwung.',
        w: { haushalt: -4, ansehen: 1 }, dient: { stabilitaet: 0.4 } },
      { text: 'Hart bleiben – das Gesetz gilt für alle.', hist: true,
        ergebnis: 'Die Regierung lässt die Steuerprüfer gewähren. Poujade kündigt an, bei der nächsten Wahl anzutreten.',
        w: { haushalt: 2 }, setze: ['poujade'], dient: { modernisierung: 0.5 } },
    ],
    historisch: 'Bei der Wahl im Januar 1956 gewannen die Poujadisten 11,6 % der Stimmen und 52 Sitze. Unter ihren Abgeordneten war der 27-jährige Jean-Marie Le Pen.',
  },
  {
    id: 'fr_messina',
    titel: 'Ein neuer Anlauf für Europa',
    datum: 'Juni 1955',
    ab: 1955.1, ordnung: 6,
    wenn: s => bonnImWesten(s) && !s.weltflags.messina,
    absender: 'Paul-Henri Spaak, belgischer Außenminister',
    text: `Nach dem Scheitern der EVG schlagen die Benelux-Länder einen neuen Anlauf vor: einen gemeinsamen Markt der sechs Montanunion-Staaten und eine Gemeinschaft für die Atomenergie. Die Außenminister sollen sich in Messina treffen. Frankreichs Industrie fürchtet die deutsche Konkurrenz; die Landwirtschaft hofft auf neue Märkte. Jean Monnet drängt, die Atomgemeinschaft zuerst zu verwirklichen.`,
    optionen: [
      { text: 'Nach Messina fahren und mitverhandeln.', hist: true, richtung: 'europa',
        ergebnis: s => `${pariserAussen(s)} reist nach Messina. Die sechs Außenminister beauftragen Spaak, Verträge auszuarbeiten.`,
        w: { europa: 3, brd: 3 }, aktion: (s, a) => a.weltflag('messina'), dient: { europa: 1, deutschland_einbinden: 0.6 } },
      { text: 'Nur über die Atomgemeinschaft reden – kein gemeinsamer Markt.',
        ergebnis: 'Paris will nur über Euratom reden. Die anderen fünf sind enttäuscht, verhandeln aber weiter.',
        w: { europa: 1, brd: -2 }, aktion: (s, a) => a.weltflag('messina', 'euratom'), dient: { atom: 0.5, unabhaengigkeit: 0.4 } },
      { text: 'Fernbleiben.', richtung: 'national',
        ergebnis: 'Frankreich bleibt der Konferenz fern. Die europäische Einigung stockt.',
        w: { europa: -4, brd: -5, usa: -2 }, dient: { unabhaengigkeit: 0.6, europa: -1 } },
    ],
    historisch: 'Auf der Konferenz von Messina (1. bis 3. Juni 1955) beschlossen die sechs Außenminister, über einen gemeinsamen Markt und eine Atomgemeinschaft zu verhandeln. Daraus entstanden 1957 die Römischen Verträge.',
  },

  // ------------------------------------------------------------------ 1955/II
  {
    id: 'fr_philippeville',
    titel: 'Philippeville',
    datum: '20. August 1955',
    ab: 1955.2, ordnung: 8,
    wenn: algerienkrieg,
    absender: 'Generalgouverneur Jacques Soustelle',
    ascii: 'alarm',
    text: `Im Norden von Constantine hat die FLN Bauern und Bergleute zu einem Aufstand gegen Europäer getrieben. In Philippeville und in der Bergbausiedlung El Halia wurden 123 Menschen ermordet, darunter Frauen und Kinder. Armee, Polizei und Milizen der Siedler antworten mit Massakern in den umliegenden Dörfern; die Zahl der muslimischen Toten geht in die Tausende.

Generalgouverneur Soustelle, eigentlich ein Mann der Reformen, ist erschüttert. Er verlangt die „kollektive Verantwortung“ der Dörfer.`,
    optionen: [
      { text: 'Die kollektiven Vergeltungsmaßnahmen decken.', hist: true, richtung: 'kolonial',
        ergebnis: 'Paris deckt die Vergeltung. Zwischen Europäern und Muslimen ist von nun an ein Abgrund; viele Gemäßigte schließen sich der FLN an.',
        w: { algerien: -6, armee: 3, rang: -3 }, dient: { kolonien: 1 } },
      { text: 'Die Vergeltung stoppen lassen und die Verantwortlichen bestrafen.', richtung: 'dekolonisation',
        ergebnis: 'Paris ordnet an, die Vergeltung einzustellen. Siedler und Offiziere sprechen vom „Verrat aus Paris“.',
        w: { algerien: -2, armee: -6, rang: 2 }, dient: { frieden_kolonien: 0.8, kolonien: -0.3 } },
    ],
    historisch: 'Nach dem Aufstand von Philippeville am 20. August 1955 kamen bei der Vergeltung nach französischen Angaben 1.273, nach algerischen bis zu 12.000 Menschen ums Leben. Der Krieg wurde von da an mit äußerster Härte geführt.',
  },
  {
    id: 'fr_saar_nein',
    titel: 'Die Saarländer sagen Nein',
    datum: 'Oktober 1955',
    ausloeser: 'saar_nein', ausloeserVon: 'brd',
    ordnung: 10.5,
    absender: 'Hoher Kommissar an der Saar',
    text: s => `Die Saarländer haben das europäische Statut abgelehnt. Ministerpräsident Hoffmann ist zurückgetreten, die prodeutschen Parteien haben die Mehrheit. Damit ist klar: Die Saar will zu Deutschland.

${kanzler(s)} bietet Verhandlungen über die Rückgliederung an. Frankreich könnte Gegenleistungen verlangen – Saarkohle, die Kanalisierung der Mosel für die lothringische Stahlindustrie – oder auf seinen Rechten bestehen.`,
    optionen: [
      { text: 'Das Ergebnis annehmen und über die Rückgliederung verhandeln.', hist: true, richtung: 'europa',
        ergebnis: 'Paris erklärt sich zu Verhandlungen über die Rückgliederung der Saar bereit – gegen Kohle und die Kanalisierung der Mosel.',
        w: { brd: 10, usa: 3 },
        aktion: (s, a) => a.weltflag('saar_akzeptiert'),
        bei: { brd: { titel: 'Paris gibt die Saar frei', w: { frankreich: 4 }, ergebnis: 'Paris nimmt das Nein der Saarländer an und bietet Verhandlungen über die Rückgliederung an.' } },
        dient: { deutschland_einbinden: 1.2, stabilitaet: 0.4, saar: -0.5 } },
      { text: 'Auf dem Statut bestehen – die Abstimmung ändert nichts an den Verträgen.', richtung: 'national',
        ergebnis: 'Paris beharrt auf den Verträgen. Bonn spricht von einem Bruch des Selbstbestimmungsrechts; Washington und London drängen Paris zum Einlenken.',
        w: { brd: -16, usa: -8, grossbritannien: -6, rang: -4 },
        bei: { brd: { titel: 'Paris beharrt auf der Saar', w: { frankreich: -12 }, ergebnis: 'Paris erkennt das Nein der Saarländer nicht an und beharrt auf dem Statut.' } },
        dient: { saar: 1.5, deutschland_klein: 0.4 } },
    ],
    historisch: 'Frankreich nahm das Ergebnis an. Im Luxemburger Saarvertrag vom 27. Oktober 1956 wurde die Rückgliederung zum 1. Januar 1957 vereinbart; Frankreich erhielt Kohlelieferungen und die Kanalisierung der Mosel.',
  },
  {
    id: 'fr_maghreb',
    titel: 'Marokko und Tunesien',
    datum: 'Herbst 1955 bis März 1956',
    ab: 1955.2, bis: 1956.2, ordnung: 11,
    wenn: s => !s.f.maghreb_unabhaengig && !s.f.maghreb_krieg,
    absender: 'Ministerium für marokkanische und tunesische Angelegenheiten',
    text: s => `In Marokko herrscht Aufruhr, seit ${s.f.marokko_sultan_exil ? 'der Sultan abgesetzt wurde' : 'die Unabhängigkeitspartei Istiqlal den Generalstreik ausgerufen hat'}. In Tunesien verlangt der Néo-Destour mehr als Autonomie. Frankreich kann nicht in Algerien, Marokko und Tunesien zugleich Krieg führen. Die Generäle wollen wenigstens Algerien halten – und dafür die beiden Protektorate ziehen lassen.`,
    optionen: [
      { text: 'Marokko und Tunesien in die Unabhängigkeit entlassen.', hist: true, richtung: 'dekolonisation',
        ergebnis: s => `${s.f.marokko_sultan_exil ? 'Sultan Mohammed V. kehrt im Triumph nach Marokko zurück. ' : ''}Im März werden Marokko und Tunesien unabhängig. Frankreich konzentriert seine Kräfte auf Algerien.`,
        w: { rang: 1, armee: -2, usa: 3 }, setze: ['maghreb_unabhaengig'], dient: { frieden_kolonien: 1, kolonien: -0.2 } },
      { text: 'Die Protektorate halten – mit Gewalt, wenn nötig.', richtung: 'kolonial',
        ergebnis: 'Paris schickt Truppen nach Marokko und Tunesien. Nordafrika steht in Flammen.',
        w: { rang: -6, haushalt: -5, armee: 3, usa: -6, algerien: -6, kriegsmuede: 3 }, setze: ['maghreb_krieg'], dient: { kolonien: 1.5, frieden_kolonien: -1 } },
    ],
    historisch: 'Mohammed V. kehrte im November 1955 aus dem Exil zurück. Marokko wurde am 2. März, Tunesien am 20. März 1956 unabhängig.',
  },

  // ------------------------------------------------------------------ 1956/I
  {
    id: 'fr_tomaten',
    titel: 'Die Tomaten von Algier',
    datum: '6. Februar 1956',
    ab: 1956.1, ordnung: 2,
    wenn: s => algerienkrieg(s) && vierte(s),
    absender: 'Präfektur Algier',
    text: s => `Du bist nach Algier gereist, um den liberalen General Catroux als neuen Minister für Algerien einzuführen. Am Kriegerdenkmal empfängt dich eine wütende Menge europäischer Siedler mit Tomaten, Erdklumpen und Pfiffen. Sie halten Catroux für den Mann, der Algerien preisgeben wird.

Catroux bietet in Paris seinen Rücktritt an.`,
    optionen: [
      { text: 'Catroux’ Rücktritt annehmen und den Sozialisten Robert Lacoste schicken.', hist: true, richtung: 'kolonial',
        ergebnis: 'Catroux tritt zurück, Robert Lacoste wird Minister für Algerien. Die Siedler haben gelernt, dass Paris nachgibt, wenn man Druck macht.',
        w: { armee: 4, ansehen: -3, rang: -1 }, dient: { kolonien: 1, stabilitaet: 0.3 } },
      { text: 'An Catroux festhalten.', richtung: 'dekolonisation',
        ergebnis: 'Paris hält an Catroux fest. In Algier kommt es zu Unruhen; die Armee murrt.',
        w: { armee: -8, ansehen: 3, algerien: 2 }, dient: { frieden_kolonien: 0.8, kolonien: -0.4 } },
    ],
    historisch: 'Guy Mollet wurde am 6. Februar 1956 in Algier mit Tomaten beworfen. Noch am selben Abend nahm er den Rücktritt von General Catroux an und ernannte Robert Lacoste.',
  },
  {
    id: 'fr_sondervollmachten',
    titel: 'Sondervollmachten für Algerien',
    datum: 'März 1956',
    ab: 1956.1, bis: 1957.1, ordnung: 3,
    wenn: s => algerienkrieg(s) && !s.f.wehrpflicht_verlaengert,
    absender: 'Robert Lacoste, Minister für Algerien',
    text: `Der Minister für Algerien verlangt Sondervollmachten: Regierung und Armee sollen in Algerien per Dekret regieren dürfen, Versammlungen verbieten, Verdächtige internieren. Und er braucht Soldaten. 200.000 Mann reichen nicht; die Wehrpflichtigen sollen nach Algerien, ihre Dienstzeit verlängert werden.

Die Kommunisten wollen dafür stimmen – sie hoffen auf eine Volksfront.`,
    optionen: [
      { text: 'Sondervollmachten beschließen und Wehrpflichtige nach Algerien schicken.', hist: true, richtung: 'kolonial',
        ergebnis: 'Die Nationalversammlung beschließt die Sondervollmachten mit 455 zu 76 Stimmen, auch mit den Stimmen der Kommunisten. 400.000 Mann stehen bald in Algerien.',
        w: { algerien: 8, kriegsmuede: 4, haushalt: -4, armee: 4, ansehen: -2 }, setze: ['wehrpflicht_verlaengert', 'algerien_truppen'], dient: { kolonien: 1.3 } },
      { text: 'Nur Berufssoldaten und Fremdenlegion einsetzen.',
        ergebnis: 'Die Regierung verzichtet auf Wehrpflichtige. Die Armee ist überfordert; die FLN breitet sich aus.',
        w: { algerien: -6, armee: -4 }, dient: { frieden_kolonien: 0.5, kolonien: -0.5 } },
    ],
    historisch: 'Das Gesetz über die Sondervollmachten wurde am 12. März 1956 verabschiedet. Ab 1956 dienten Hunderttausende Wehrpflichtige in Algerien; die Dienstzeit wurde auf 27 Monate verlängert.',
  },

  // ------------------------------------------------------------------ 1956/II
  {
    id: 'fr_ben_bella',
    titel: 'Ein Flugzeug wird umgeleitet',
    datum: '22. Oktober 1956',
    ab: 1956.2, ordnung: 9.5,
    wenn: algerienkrieg,
    absender: 'Generalstab in Algier',
    text: `Ohne Wissen der Regierung hat die Armee ein marokkanisches Flugzeug zur Landung in Algier gezwungen. An Bord: Ahmed Ben Bella und vier weitere Anführer der FLN, die auf dem Weg zu einer Konferenz in Tunis waren – zu Gesprächen, bei denen auch über einen Waffenstillstand gesprochen werden sollte. Der Sultan von Marokko, dessen Gäste sie waren, ist außer sich.`,
    optionen: [
      { text: 'Die Aktion nachträglich decken.', hist: true, richtung: 'kolonial',
        ergebnis: 'Paris deckt die Armee. Ben Bella und seine Gefährten bleiben bis 1962 in Haft; alle Kontakte zur FLN sind abgerissen.',
        w: { armee: 5, rang: -4, algerien: 2 }, loesche: ['algerien_verhandlung'], dient: { kolonien: 1 } },
      { text: 'Die Gefangenen freilassen und die Verantwortlichen bestrafen.', richtung: 'dekolonisation',
        ergebnis: 'Paris lässt die FLN-Führer frei. Die Offiziere sind empört; in Tunis sind Gespräche wieder möglich.',
        w: { armee: -12, rang: 3 }, dient: { frieden_kolonien: 1, kolonien: -0.6 } },
    ],
    historisch: 'Die Regierung Mollet deckte die Entführung. Ben Bella blieb bis zum Abkommen von Évian 1962 in Haft und wurde dann erster Präsident Algeriens.',
  },
  {
    id: 'fr_suez',
    titel: 'Der Kanal',
    datum: 'Oktober 1956',
    ab: 1956.2, ordnung: 10,
    absender: 'Christian Pineau, Außenminister',
    text: s => `Im Juli hat Präsident Nasser den Suezkanal verstaatlicht. Für Paris ist Nasser mehr als ein ägyptischer Nationalist: Er liefert der FLN Waffen und gibt ihr in Kairo eine Stimme. „Nasser ist ein neuer Hitler“, heißt es im Kabinett.

In Sèvres haben französische, britische und israelische Unterhändler geheim einen Plan verabredet: Israel greift Ägypten an, Paris und London fordern beide Seiten zum Rückzug vom Kanal auf und besetzen ihn dann, „um die Schifffahrt zu schützen“. Washington weiß davon nichts – ${praesident(s)} steht kurz vor seiner Wiederwahl.`,
    optionen: [
      { text: 'Den Plan von Sèvres ausführen.', hist: true, richtung: 'kolonial',
        ergebnis: 'Israel greift an, britische und französische Fallschirmjäger landen am Suezkanal.',
        w: { usa: -3, moskau: -6, armee: 4, rang: 3 }, aktion: (s, a) => a.weltflag('suez_angriff'),
        dient: { kolonien: 1.3, unabhaengigkeit: 0.6, westbindung: -0.3 } },
      { text: 'Nur diplomatisch protestieren und den Sicherheitsrat anrufen.',
        ergebnis: 'Paris bringt die Frage vor den Sicherheitsrat. Nasser behält den Kanal.',
        w: { rang: -4, armee: -3, usa: 3, algerien: -3 }, dient: { westbindung: 0.5, frieden_kolonien: 0.3 } },
    ],
    historisch: 'Am 29. Oktober 1956 griff Israel an, am 5. November landeten britische und französische Truppen. Unter amerikanischem Druck und sowjetischen Drohungen brach London am 6. November ab; Paris musste folgen.',
  },
  {
    id: 'fr_suez_folgen',
    titel: s => (s.weltflags.suez_druck ? 'London gibt auf' : 'Am Kanal'),
    datum: '6. November 1956',
    ab: 1956.2, ordnung: 10.4,
    wenn: s => !!s.weltflags.suez_angriff,
    absender: 'Oberkommando der Suez-Operation',
    text: s => (s.weltflags.suez_druck
      ? `Washington hat London mit dem Zusammenbruch des Pfunds gedroht, Moskau mit Raketen auf Paris und London. Premierminister Eden hat ohne Absprache einem Waffenstillstand zugestimmt – die Truppen stehen erst auf halbem Weg am Kanal.${bonnExistiert(s) ? ` ${kanzler(s)} ist ausgerechnet heute in Paris zu Besuch.` : ''}`
      : 'Washington hat nicht eingegriffen. Britische und französische Truppen kontrollieren die Kanalzone; Nasser ist in Kairo eingeschlossen. Moskau droht mit Raketen, doch Washington stellt sich vor seine Verbündeten.'),
    optionen: s => (s.weltflags.suez_druck ? [
      { text: 'Mit London den Waffenstillstand annehmen.', hist: true,
        ergebnis: 'Paris muss dem Waffenstillstand zustimmen. Die Demütigung sitzt tief: Auf die Amerikaner ist kein Verlass – Frankreich braucht die Bombe und Europa.',
        w: { rang: -6, usa: -4, armee: -4, ansehen: -3 }, setze: ['suez_demuetigung'], dient: { westbindung: 0.6, stabilitaet: 0.4 } },
      { text: 'Allein weiterkämpfen.', richtung: 'national',
        zufall: [
          { p: 0.25, ergebnis: 'Französische Fallschirmjäger erreichen Ismailia. Nasser stürzt; Washington tobt.', w: { rang: 6, usa: -15, moskau: -12, armee: 6 } },
          { ergebnis: 'Ohne britische Unterstützung bricht der Vormarsch zusammen. Der Franc gerät unter Druck, die Welt verurteilt Paris.', w: { rang: -12, usa: -12, franc: -15, armee: -6 } },
        ],
        dient: { unabhaengigkeit: 0.8, kolonien: 0.5, westbindung: -1 } },
    ] : [
      { text: 'Die Kanalzone halten und Nasser zum Einlenken zwingen.', hist: false,
        ergebnis: 'Nasser muss nachgeben: Der Kanal kommt unter internationale Verwaltung. Paris hat gesiegt – und die arabische Welt gegen sich.',
        w: { rang: 6, algerien: 3, moskau: -6, armee: 5 }, dient: { kolonien: 0.8, unabhaengigkeit: 0.6 } },
      { text: 'Die Truppen bald einer UN-Truppe übergeben.',
        ergebnis: 'Paris übergibt die Kanalzone den Vereinten Nationen. Ein Sieg, der wenig einbringt.',
        w: { rang: 2, usa: 3 }, dient: { westbindung: 0.6 } },
    ]),
    historisch: 'Frankreich musste am 6. November 1956 dem Waffenstillstand folgen. Am selben Tag war Adenauer in Paris; er sagte zu Mollet: „Europa wird eure Rache sein.“',
  },
  {
    id: 'fr_rom',
    titel: 'Der gemeinsame Markt',
    datum: 'November 1956',
    ab: 1956.2, bis: 1957.1, ordnung: 11.5,
    wenn: s => !!s.weltflags.messina && bonnImWesten(s) && !s.weltflags.rom_angebot && !s.f.rom_abgelehnt,
    absender: 'Maurice Faure, Staatssekretär im Außenministerium',
    text: s => `Die Verhandlungen über einen gemeinsamen Markt und die Atomgemeinschaft Euratom sind weit gediehen. Die französische Industrie fürchtet die deutsche Konkurrenz, das Patronat warnt. Andererseits könnte Frankreich jetzt Bedingungen stellen: eine gemeinsame Agrarpolitik, die den Bauern Absatz sichert; die Einbeziehung der überseeischen Gebiete; Schutzklauseln, solange die Sozialabgaben ungleich sind.${s.f.suez_demuetigung ? '\n\nNach Suez sehen viele in Europa die einzige Antwort auf die Demütigung durch Washington.' : ''}`,
    optionen: [
      { text: 'Zustimmen – mit Bedingungen: Agrarpolitik, Überseegebiete, Euratom.', hist: true, richtung: 'europa',
        ergebnis: 'Paris stimmt dem gemeinsamen Markt zu und setzt seine Bedingungen durch: Landwirtschaft, Überseegebiete, Euratom.',
        w: { europa: 5, brd: 6 }, aktion: (s, a) => { a.weltflag('rom_angebot'); a.sende('brd', 'rom'); },
        dient: { europa: 1.3, deutschland_einbinden: 1, modernisierung: 0.5 } },
      { text: 'Nur der Atomgemeinschaft zustimmen.',
        ergebnis: 'Paris will Euratom, aber keinen gemeinsamen Markt. Die Verhandlungen stocken.',
        w: { europa: 1, brd: -4, atom: 4 }, setze: ['rom_abgelehnt'], dient: { atom: 0.6, unabhaengigkeit: 0.5, europa: -0.4 } },
      { text: 'Die Verhandlungen abbrechen.', richtung: 'national',
        ergebnis: 'Frankreich steigt aus den Verhandlungen aus. Die Fünf überlegen, ohne Paris weiterzumachen.',
        w: { europa: -6, brd: -10, usa: -3 }, setze: ['rom_abgelehnt'], dient: { unabhaengigkeit: 0.8, europa: -1.3 } },
    ],
    historisch: 'Nach dem Treffen Mollet–Adenauer am 6. November 1956 waren die letzten Hindernisse rasch ausgeräumt. Die Römischen Verträge wurden am 25. März 1957 unterzeichnet.',
  },
  {
    id: 'fr_atombombe',
    titel: 'Eine französische Bombe?',
    datum: '1956–1958',
    ab: 1956.2, bis: 1958.2, ordnung: 12,
    wenn: s => !s.f.atombombe && !s.f.atomverzicht,
    absender: 'Commissariat à l’énergie atomique',
    text: s => `Das Atomkommissariat hat in Marcoule einen Reaktor gebaut, der Plutonium erzeugt. Die Militärs drängen: Frankreich soll eine eigene Atombombe bauen. Ohne sie bleibe das Land ein Staat zweiten Ranges, abhängig von Washingtons Gnade${s.f.suez_demuetigung ? ' – das hat Suez gezeigt' : ''}. Die Kosten sind enorm, und die Sozialisten haben stets eine Bombe abgelehnt.`,
    optionen: [
      { text: 'Die Vorbereitungen für einen Atomtest anordnen.', hist: true, richtung: 'national',
        ergebnis: 'Die Regierung ordnet die Vorbereitung eines Atomtests in der Sahara an. Der Haushalt des Atomkommissariats wird verdoppelt.',
        w: { atom: 10, haushalt: -3, usa: -3, rang: 2 }, setze: ['atombombe', 'atomprogramm'], dient: { atom: 1.6, unabhaengigkeit: 0.8 } },
      { text: 'Auf eine eigene Bombe verzichten.', richtung: 'atlantisch',
        ergebnis: 'Paris verzichtet auf eine Atombombe und verlässt sich auf den amerikanischen Schutz.',
        w: { usa: 4, haushalt: 2, rang: -3 }, setze: ['atomverzicht'], dient: { westbindung: 0.8, atom: -1.5 } },
    ],
    historisch: 'Die Entscheidung fiel schrittweise: 1954 unter Mendès France geheim vorbereitet, im April 1958 ordnete Ministerpräsident Gaillard den ersten Test an. De Gaulle bestätigte sie.',
  },

  // ------------------------------------------------------------------ 1957/I
  {
    id: 'fr_schlacht_algier',
    titel: 'Die Schlacht um Algier',
    datum: 'Januar 1957',
    ab: 1957.1, ordnung: 1,
    wenn: algerienkrieg,
    absender: 'General Jacques Massu, 10. Fallschirmjäger-Division',
    ascii: 'alarm',
    text: `In Algier explodieren Bomben in Cafés und Milchbars; die FLN hat einen Generalstreik ausgerufen. Die Polizei ist machtlos. General Massu verlangt die volle Polizeigewalt für seine Fallschirmjäger, um das Netz der FLN in der Kasbah zu zerschlagen.

Jeder weiß, was das heißt: Massenverhaftungen, Verhöre unter Folter, Menschen, die „verschwinden“.`,
    optionen: [
      { text: 'Massu die volle Polizeigewalt übertragen.', hist: true, richtung: 'kolonial',
        ergebnis: 'Massus Fallschirmjäger zerschlagen das Netz der FLN in Algier. Die Methoden werden bekannt: Folter, Tausende Verschwundene. In Frankreich beginnt eine Gewissenskrise.',
        w: { algerien: 10, armee: 6, rang: -6, ansehen: -2 }, setze: ['folter'], dient: { kolonien: 1.3 } },
      { text: 'Die Polizei verstärken, Folter ausdrücklich verbieten.', richtung: 'dekolonisation',
        ergebnis: 'Die Regierung verstärkt die Polizei, verbietet aber Folter. Die Anschläge gehen weiter, die Armee spricht von „gebundenen Händen“.',
        w: { algerien: -4, armee: -6, rang: 2 }, dient: { frieden_kolonien: 0.6, kolonien: 0.2 } },
    ],
    historisch: 'Am 7. Januar 1957 übertrug der Präfekt von Algier General Massu die Polizeigewalt. Die „Schlacht um Algier“ endete im Herbst 1957 mit der Zerschlagung der FLN in der Stadt; die systematische Folter wurde zu einem der großen Skandale der Republik.',
  },

  // ------------------------------------------------------------------ 1957/II
  {
    id: 'fr_rom_ratifizierung',
    titel: 'Die Römischen Verträge vor der Nationalversammlung',
    datum: 'Juli 1957',
    ab: 1957.1, bis: 1958.1, ordnung: 7,
    wenn: s => !!brd(s).f.ewg && !s.f.rom_ratifiziert,
    absender: 'Auswärtiger Ausschuss der Nationalversammlung',
    text: `Die Römischen Verträge über die Europäische Wirtschaftsgemeinschaft und Euratom sind unterzeichnet. Nun muss die Nationalversammlung zustimmen. Gaullisten, Poujadisten und Kommunisten sind dagegen; Mendès France warnt vor einem Europa, in dem Frankreich wirtschaftlich nicht mithalten kann.`,
    optionen: [
      { text: 'Die Verträge ratifizieren lassen.', hist: true, richtung: 'europa',
        ergebnis: 'Die Nationalversammlung ratifiziert die Römischen Verträge mit 342 zu 239 Stimmen. Am 1. Januar 1958 tritt die EWG in Kraft.',
        w: { europa: 12, brd: 5, impuls: 0.8 }, setze: ['rom_ratifiziert', 'ewg'], dient: { europa: 1.3, deutschland_einbinden: 1, modernisierung: 0.6 } },
      { text: 'Die Ratifizierung scheitern lassen.', richtung: 'national',
        ergebnis: 'Die Nationalversammlung lehnt die Römischen Verträge ab. Zum zweiten Mal nach der EVG lässt Frankreich Europa scheitern.',
        w: { europa: -10, brd: -14, usa: -4 },
        bei: { brd: { titel: 'Paris lehnt die Römischen Verträge ab', w: { europa: -10, frankreich: -8 }, loesche: ['ewg'], ergebnis: 'Die französische Nationalversammlung hat die Römischen Verträge abgelehnt. Die Wirtschaftsgemeinschaft kommt nicht zustande.' } },
        dient: { unabhaengigkeit: 0.6, deutschland_klein: 0.6, europa: -1.3 } },
    ],
    historisch: 'Die Nationalversammlung stimmte am 9. Juli 1957 zu. Die EWG und Euratom nahmen am 1. Januar 1958 ihre Arbeit auf.',
  },
  {
    id: 'fr_fig',
    titel: 'Eine Bombe mit den Deutschen?',
    datum: 'November 1957',
    ab: 1957.2, bis: 1958.1, ordnung: 10.8,
    wenn: s => vierte(s) && bonnImWesten(s) && !!brd(s).f.nato && !s.f.fig_angeboten,
    absender: 'Jacques Chaban-Delmas, Verteidigungsminister',
    text: s => `Seit Sputnik zweifeln viele in Paris, ob Amerika Europa im Ernstfall verteidigen würde. Der Verteidigungsminister schlägt vor, mit der Bundesrepublik und Italien bei der Rüstung zusammenzuarbeiten – auch bei Atomwaffen. Bonn könnte sich an der Isotopentrennungsanlage in Pierrelatte finanziell beteiligen.

Für viele Franzosen ist der Gedanke, die Deutschen an der Bombe zu beteiligen, unerträglich.`,
    optionen: [
      { text: 'Bonn und Rom geheime Gespräche über eine Rüstungsgemeinschaft anbieten.', hist: true, richtung: 'europa',
        ergebnis: 'Paris bietet Bonn und Rom geheime Gespräche über eine gemeinsame Rüstung an – einschließlich der atomaren.',
        w: { brd: 6, usa: -3 }, setze: ['fig_angeboten'],
        aktion: (s, a) => a.sende('brd', 'fig'),
        dient: { atom: 0.8, deutschland_einbinden: 0.6, unabhaengigkeit: 0.6, deutschland_klein: -1.2 } },
      { text: 'Die Deutschen bleiben von Atomwaffen fern.', richtung: 'national',
        ergebnis: 'Paris lehnt jede atomare Zusammenarbeit mit Bonn ab.',
        setze: ['fig_angeboten'], dient: { deutschland_klein: 1.2 } },
    ],
    historisch: 'Die Verteidigungsminister Chaban-Delmas, Strauß und Taviani unterzeichneten im April 1958 das geheime FIG-Abkommen. De Gaulle kündigte es nach seiner Rückkehr an die Macht.',
  },
  {
    id: 'fr_algerien_wende',
    titel: 'Mit der FLN reden?',
    datum: 'Geheimsache',
    ab: 1956.2, bis: 1962.2, ordnung: 6,
    wenn: s => algerienkrieg(s) && !s.f.algerien_verhandlung && !istDeGaulle(s) && s.lager !== 'militaer' && s.w.kriegsmuede >= 8,
    absender: 'Kabinett',
    text: s => `Der Krieg in Algerien dauert ${Math.max(2, Math.round((zeitIndex(s.zeit) - zeitIndex(1954.2)) / 2))} Jahre. ${s.w.algerien >= 55 ? 'Militärisch hat die Armee die Lage im Griff, politisch nicht.' : 'Die Armee kommt nicht voran.'} In Frankreich wächst die Kriegsmüdigkeit; die Weltöffentlichkeit, die Vereinten Nationen und sogar Washington drängen auf eine politische Lösung.

Über Mittelsmänner in Tunis, Rabat und Belgrad ließe sich Kontakt zur Führung der FLN aufnehmen. Wenn das bekannt wird, droht ein Aufruhr in der Armee.`,
    optionen: [
      { text: 'Geheime Gespräche mit der FLN beginnen.', richtung: 'dekolonisation',
        ergebnis: 'Emissäre der Regierung treffen sich heimlich mit Vertretern der FLN. In Algier verbreiten sich Gerüchte über einen „Verrat“.',
        w: { armee: -10, rang: 3, usa: 3 }, setze: ['algerien_verhandlung'], aktion: st => { st.f.verhandlung_seit = st.zeit; },
        dient: { frieden_kolonien: 1.4, kolonien: -0.8 } },
      { text: 'Den Krieg weiterführen, bis die FLN militärisch geschlagen ist.', hist: true, richtung: 'kolonial',
        ergebnis: 'Die Regierung setzt weiter auf den militärischen Sieg.',
        w: { armee: 2 }, dient: { kolonien: 1.2 } },
    ],
    historisch: 'Unter Mollet gab es 1956 geheime Kontakte zur FLN in Kairo, Belgrad und Rom, die nach der Entführung Ben Bellas abbrachen. Offiziell hielt die Vierte Republik bis zuletzt an „Algérie française“ fest.',
  },
  {
    id: 'fr_indochina_rueckzug',
    titel: 'Ein zweites Điện Biên Phủ',
    datum: 'Lagebericht Saigon',
    ab: 1955.1, bis: 1964.1, ordnung: 4,
    wenn: s => indochinakrieg(s) && s.w.indochina < 22 && !s.f.genf_abgelehnt_spaet,
    absender: 'Oberkommando in Indochina',
    ascii: 'dschungel',
    text: `Die Viet Minh haben Hanoi eingeschlossen; im Süden stehen Saigon und das Mekong-Delta unter Druck. Das Expeditionskorps ist erschöpft, Washington zahlt nicht mehr. Die Generäle melden: Ohne Wehrpflichtige und ohne amerikanische Bomber ist der Krieg nicht mehr zu gewinnen.`,
    optionen: [
      { text: 'Den Rückzug aus Indochina anordnen.', richtung: 'dekolonisation',
        ergebnis: 'Frankreich zieht sich aus Indochina zurück. Ein bitteres Ende nach neun Jahren Krieg.',
        w: { rang: -10, armee: -10, kriegsmuede: -6, haushalt: 5 }, setze: ['indochina_beendet'], dient: { frieden_kolonien: 1.4, kolonien: -1 } },
      { text: 'Weiterkämpfen.', richtung: 'kolonial',
        ergebnis: 'Paris kämpft weiter. Die Verluste steigen.',
        w: { indochina: 8, haushalt: -5, kriegsmuede: 3, mehrheit: -8 }, setze: ['genf_abgelehnt_spaet'], dient: { kolonien: 1.3 } },
    ],
  },

  // ------------------------------------------------------------------ 1958/I
  {
    id: 'fr_sakiet',
    titel: 'Sakiet Sidi Youssef',
    datum: '8. Februar 1958',
    ab: 1958.1, ordnung: 2,
    wenn: s => algerienkrieg(s) && !!s.f.maghreb_unabhaengig,
    absender: 'Generalstab in Algier',
    text: `Die Luftwaffe hat das tunesische Grenzdorf Sakiet Sidi Youssef bombardiert, aus dem die FLN Stellungen in Algerien beschossen hatte. Es war Markttag; unter den mehr als 70 Toten sind Kinder einer Schule. Der Angriff war in Paris nicht genehmigt.

Tunesien ruft den Sicherheitsrat an. Washington und London bieten ihre „guten Dienste“ an – was in Paris viele als Einmischung in eine innere Angelegenheit sehen.`,
    optionen: [
      { text: 'Den Angriff decken und die anglo-amerikanische Vermittlung widerwillig annehmen.', hist: true, richtung: 'kolonial',
        ergebnis: 'Paris deckt die Armee und nimmt die Vermittlung an. Die Rechte wirft der Regierung vor, sich Washington zu beugen.',
        w: { rang: -5, usa: -2, armee: 2, mehrheit: -10 }, dient: { kolonien: 0.8, westbindung: 0.4 } },
      { text: 'Die Verantwortlichen zur Rechenschaft ziehen.', richtung: 'dekolonisation',
        ergebnis: 'Paris lässt den Angriff untersuchen und Offiziere versetzen. In der Armee brodelt es.',
        w: { rang: 2, usa: 3, armee: -10 }, dient: { frieden_kolonien: 0.8, kolonien: -0.4 } },
    ],
    historisch: 'Nach der Bombardierung von Sakiet und der Annahme der anglo-amerikanischen Vermittlung wurde die Regierung Gaillard am 15. April 1958 gestürzt. Es folgte eine wochenlange Regierungskrise.',
  },
  {
    id: 'fr_mai1958',
    titel: 'Der 13. Mai',
    datum: '13. Mai 1958',
    ab: 1958.1, bis: 1962.2, ordnung: 5,
    // Die Krise kommt, wenn der Krieg andauert und die Republik schwach ist: eine gerade gestürzte
    // Regierung oder kaum noch Rückhalt – oder später, wenn die Armee kaum noch gehorcht
    wenn: s => vierte(s) && algerienkrieg(s) && !s.f.de_gaulle && !s.f.de_gaulle_abgelehnt
      && (zeitIndex(s.zeit) - zeitIndex((s.stuerze || []).slice(-1)[0] ?? 1900.1) <= 1 || s.w.mehrheit < 30 || s.w.armee < 40),
    absender: s => `Präsident der Republik ${s.praesident}`,
    ascii: 'alarm',
    text: s => `In Algier hat eine Menge das Gebäude des Generalgouvernements gestürmt. Die Generäle Massu und Salan haben einen „Wohlfahrtsausschuss“ gebildet und verlangen eine „Regierung des öffentlichen Heils“. Am 24. Mai landen Fallschirmjäger auf Korsika und übernehmen die Insel. In Algier liegen Pläne für eine Landung in Paris bereit: „Opération Résurrection“.

Aus Colombey-les-Deux-Églises hat General de Gaulle erklärt, er sei bereit, „die Befugnisse der Republik zu übernehmen“. Die Armee würde ihm gehorchen. Die Linke ruft zur Verteidigung der Republik auf. ${s.praesident} droht mit Rücktritt, wenn die Nationalversammlung de Gaulle nicht wählt.`,
    optionen: [
      { text: 'De Gaulle die Regierung übertragen – mit Vollmachten und dem Auftrag zu einer neuen Verfassung.', hist: true, richtung: 'national',
        ergebnis: 'Die Nationalversammlung wählt Charles de Gaulle am 1. Juni zum Ministerpräsidenten und gibt ihm Vollmachten für sechs Monate. Die Vierte Republik ist am Ende.',
        w: { ansehen: 5, rang: 4, armee: 15 },
        aktion: (s, a) => machtUebergabeDeGaulle(s, a),
        dient: { stabilitaet: 1.4, kolonien: 0.4, unabhaengigkeit: 0.5 } },
      { text: 'Die Republik verteidigen: Massu und Salan absetzen, die Nationalversammlung hinter die Regierung stellen.', richtung: 'dekolonisation',
        zufall: [
          { p: s => Math.max(0.1, Math.min(0.75, 0.2 + (65 - s.w.armee) / 80)),
            ergebnis: 'Die Fallschirmjäger landen in Paris. Die Regierung wird abgesetzt; ein „Komitee der nationalen Erneuerung“ unter General Salan übernimmt die Macht. (Fiktion)',
            aktion: (s, a) => junta(s, a, 'General Raoul Salan') },
          { ergebnis: 'Die Generäle schrecken vor dem Bürgerkrieg zurück. Massu und Salan werden abberufen; die Republik hat überlebt – geschwächt. (Fiktion)',
            w: { armee: 10, mehrheit: 20, ansehen: 6, algerien: -6 }, setze: ['de_gaulle_abgelehnt'] },
        ],
        dient: { stabilitaet: 0.3, frieden_kolonien: 0.4 } },
      { text: 'Die Linke sammeln: eine Regierung der republikanischen Verteidigung mit den Kommunisten.', richtung: 'ost',
        nurWenn: s => (s.sitze.PCF || 0) + (s.sitze.SFIO || 0) + 0.5 * (s.sitze.RAD || 0) > 0.42 * gesamtSitze(s),
        zufall: [
          { p: s => Math.max(0.2, Math.min(0.85, 0.35 + (65 - s.w.armee) / 70)),
            ergebnis: 'Für die Generäle ist eine Regierung mit Kommunisten das Signal: Die Fallschirmjäger landen in Paris. Eine Militärregierung unter General Salan übernimmt die Macht. (Fiktion)',
            aktion: (s, a) => junta(s, a, 'General Raoul Salan') },
          { ergebnis: 'Generalstreik, Massendemonstrationen, Arbeitermilizen: Die Generäle wagen den Sprung nach Paris nicht. Eine Volksfrontregierung übernimmt. (Fiktion)',
            w: { armee: -10, usa: -20, moskau: 15 }, setze: ['linksbuendnis', 'de_gaulle_abgelehnt'],
            aktion: (s, a) => { s.lager = 'volksfront'; s.regierungschef = 'Daniel Mayer'; s.chefPartei = 'SFIO'; s.regierung = ['PCF', 'SFIO', 'RAD']; s.w.mehrheit = 55; s.f['gebildet_' + s.zeit] = true; notiereChef(s); } },
        ],
        dient: { sozial: 0.8, frieden_kolonien: 0.8, westbindung: -1 } },
    ],
    historisch: 'Am 29. Mai 1958 bat Präsident Coty de Gaulle, die Regierung zu bilden. Die Nationalversammlung wählte ihn am 1. Juni mit 329 zu 224 Stimmen. Der Plan einer Landung in Paris wurde nie ausgeführt.',
  },
  {
    id: 'fr_junta_zukunft',
    titel: 'Die Zukunft der Militärregierung',
    datum: 'Rundschreiben des Komitees',
    ab: 1958.1, bis: 1964.1, ordnung: 2,
    wenn: s => s.lager === 'militaer' && zeitIndex(s.zeit) - zeitIndex(s.f.junta_seit || s.zeit) >= 2,
    wiederholbar: true,
    absender: 'Komitee der nationalen Erneuerung',
    text: `Die Militärregierung ist im Amt. Paris ist ruhig, aber das Land ist es nicht: Die Gewerkschaften drohen mit Generalstreik, Washington hat seine Hilfe eingefroren, die Partner in Europa meiden jeden Kontakt. Unter den Generälen streitet man, wie es weitergehen soll.`,
    optionen: [
      { text: 'Die Macht an General de Gaulle übergeben.', richtung: 'national',
        ergebnis: 'Die Generäle übergeben die Macht an de Gaulle, der eine neue Verfassung ankündigt. (Fiktion)',
        w: { usa: 10, ansehen: 6 },
        aktion: (s, a) => { s.republik = 4; machtUebergabeDeGaulle(s, a); },
        dient: { stabilitaet: 1.4 } },
      { text: 'Wahlen zu einer neuen Nationalversammlung ausschreiben.',
        ergebnis: 'Die Junta schreibt Wahlen aus. Bis dahin regiert eine Übergangsregierung der rechten Mitte. (Fiktion)',
        w: { usa: 8 },
        aktion: s => { s.republik = 4; s.lager = 'mitte_rechts'; s.regierungschef = 'Antoine Pinay'; s.chefPartei = 'UNAB'; s.regierung = ['MRP', 'RAD', 'UNAB']; s.w.mehrheit = 45; zieheWahlVor(s, 1); notiereChef(s); },
        dient: { stabilitaet: 1, kolonien: 0.3 } },
      { text: 'An der Macht bleiben.',
        ergebnis: 'Die Generäle bleiben. Die Isolation Frankreichs wächst.',
        w: { usa: -6, rang: -4, brd: -4, ansehen: -4 }, dient: { kolonien: 0.8 } },
    ],
  },

  // ------------------------------------------------------------------ 1958/II
  {
    id: 'verfassung',
    titel: 'Eine neue Verfassung',
    datum: '28. September 1958',
    nurGeplant: true, ordnung: 7,
    wenn: s => istDeGaulle(s) && s.republik === 4,
    absender: 'Michel Debré, Justizminister',
    ascii: 'flagge',
    text: `Der Entwurf der neuen Verfassung liegt vor. Ein Präsident, gewählt von einem großen Wahlmännerkollegium, ernennt den Premierminister, kann die Nationalversammlung auflösen, in Notlagen mit besonderen Vollmachten regieren (Artikel 16) und das Volk in Referenden befragen. Die Regierung ist dem Parlament verantwortlich, aber nur eine absolute Mehrheit kann sie stürzen.

Die Kommunisten und Mendès France warnen vor einer „persönlichen Macht“. Am 28. September stimmen die Franzosen ab, auch in Algerien und in den Überseegebieten.`,
    optionen: [
      { text: 'Die Präsidialverfassung zur Abstimmung stellen.', hist: true,
        zufall: [
          { p: s => Math.max(0.3, Math.min(0.97, 0.55 + s.w.zustimmung / 100)),
            ergebnis: s => `Mit ${Math.round(70 + s.w.zustimmung / 5)} Prozent nehmen die Franzosen die Verfassung an. Die Fünfte Republik ist geboren; im November wird gewählt.`,
            w: { ansehen: 8, mehrheit: 20, bonus: 6 },
            aktion: (s, a) => { s.republik = 5; s.wahlplan = [s.zeit]; a.plane('praesident', 1); } },
          { ergebnis: 'Die Franzosen lehnen die Verfassung ab. De Gaulle zieht sich nach Colombey zurück; die Vierte Republik lebt weiter. (Fiktion)',
            w: { ansehen: -10 }, setze: ['de_gaulle_abgelehnt'],
            aktion: s => { s.lager = 'mitte_rechts'; s.regierungschef = 'Antoine Pinay'; s.chefPartei = 'UNAB'; s.regierung = ['MRP', 'RAD', 'UNAB']; s.w.mehrheit = 40; delete s.f.de_gaulle; s.wahlplan = [zeitPlus(s.zeit, 1)]; notiereChef(s); } },
        ],
        dient: { stabilitaet: 1.5, unabhaengigkeit: 0.4 } },
      { text: 'Nur eine parlamentarische Verfassung mit stärkerer Regierung vorlegen.',
        ergebnis: 'Die neue Verfassung stärkt die Regierung, bleibt aber parlamentarisch. Sie wird angenommen. De Gaulle regiert als Premierminister. (Fiktion)',
        w: { ansehen: 3, mehrheit: 10 }, setze: ['stabilitaet_reform'],
        aktion: s => { s.republik = 5; s.wahlplan = [s.zeit]; },
        dient: { stabilitaet: 0.8 } },
    ],
    historisch: 'Am 28. September 1958 stimmten 82,6 % der Wähler der neuen Verfassung zu. Im Dezember wurde de Gaulle zum Präsidenten gewählt; Premierminister wurde Michel Debré.',
  },
  {
    id: 'praesident',
    titel: 'Der erste Premierminister',
    datum: 'Januar 1959',
    nurGeplant: true, ordnung: 1,
    wenn: s => istDeGaulle(s) && s.republik === 5,
    absender: 'Präsident der Republik Charles de Gaulle',
    text: `De Gaulle ist von einem Wahlmännerkollegium zum Präsidenten der Fünften Republik gewählt worden; am 8. Januar zieht er in den Élysée-Palast. Nach der neuen Verfassung ernennt er den Premierminister. Du führst von nun an die Regierung des Präsidenten.`,
    optionen: [
      { text: 'Michel Debré, den Vater der Verfassung.', hist: true,
        ergebnis: 'Michel Debré wird Premierminister. Der leidenschaftliche Verfechter des französischen Algeriens dient einem Präsidenten, der andere Pläne hat.',
        aktion: s => { s.regierungschef = 'Michel Debré'; s.chefPartei = 'GAUL'; s.praesident = 'Charles de Gaulle'; notiereChef(s); },
        dient: { stabilitaet: 1, kolonien: 0.2 } },
      { text: 'Jacques Chaban-Delmas, den Bürgermeister von Bordeaux.',
        ergebnis: 'Jacques Chaban-Delmas wird Premierminister. (Fiktion)',
        w: { mehrheit: 4 },
        aktion: s => { s.regierungschef = 'Jacques Chaban-Delmas'; s.chefPartei = 'GAUL'; s.praesident = 'Charles de Gaulle'; notiereChef(s); },
        dient: { stabilitaet: 0.8, sozial: 0.3 } },
      { text: 'Antoine Pinay, den Mann des stabilen Franc.',
        ergebnis: 'Antoine Pinay wird Premierminister. Die Unabhängigen sind zufrieden, die Gaullisten weniger. (Fiktion)',
        w: { franc: 4, mehrheit: -4 },
        aktion: s => { s.regierungschef = 'Antoine Pinay'; s.chefPartei = 'UNAB'; s.praesident = 'Charles de Gaulle'; notiereChef(s); },
        dient: { stabilitaet: 0.6, modernisierung: 0.3 } },
    ],
  },
  {
    id: 'fr_colombey',
    titel: 'Ein Gast in Colombey',
    datum: 'September 1958',
    ab: 1958.2, bis: 1963.2, ordnung: 8.8,
    wenn: s => istDeGaulle(s) && bonnImWesten(s) && !s.f.colombey_angeboten,
    absender: 'Präsidialamt',
    text: s => `${kanzler(s)} ist besorgt: Der General war gegen die Montanunion, gegen die EVG, gegen jede Supranationalität. In Bonn fürchtet man, de Gaulle werde die Römischen Verträge kündigen und sich mit Moskau über die Köpfe der Deutschen hinweg verständigen.

De Gaulle erwägt eine ungewöhnliche Geste: ${kanzler(s)} nicht in Paris, sondern privat in seinem Landhaus in Colombey-les-Deux-Églises zu empfangen. Noch nie war ein ausländischer Regierungschef dort.`,
    optionen: [
      { text: 'Den Kanzler nach Colombey einladen.', hist: true, richtung: 'europa',
        ergebnis: s => `De Gaulle lädt ${kanzler(s)} nach Colombey ein.`,
        setze: ['colombey_angeboten'], aktion: (s, a) => a.sende('brd', 'colombey'),
        dient: { deutschland_einbinden: 1.3, unabhaengigkeit: 0.5 } },
      { text: 'Bonn auf Abstand halten.', richtung: 'national',
        ergebnis: 'De Gaulle empfängt den Kanzler nicht. Die deutsch-französischen Beziehungen bleiben kühl.',
        w: { brd: -6 }, setze: ['colombey_angeboten'], dient: { deutschland_klein: 0.8 } },
    ],
    historisch: 'Adenauer besuchte de Gaulle am 14. und 15. September 1958 in Colombey. Es war der Beginn einer engen Freundschaft.',
  },
  {
    id: 'fr_fig_ende',
    titel: 'Das Abkommen mit Bonn und Rom',
    datum: 'Juni 1958',
    ab: 1958.2, bis: 1959.2, ordnung: 3,
    wenn: s => istDeGaulle(s) && !!brd(s).f.fig && !s.f.fig_entschieden,
    absender: 'Ministerium der Streitkräfte',
    text: `Die Vierte Republik hat mit Bonn und Rom ein geheimes Abkommen über eine gemeinsame Rüstung geschlossen, einschließlich einer Beteiligung an der Isotopentrennung. De Gaulle will Frankreichs Bombe allein bauen; die Deutschen sollen keinen Zugang zu Atomwaffen bekommen.`,
    optionen: [
      { text: 'Das Abkommen beenden.', hist: true, richtung: 'national',
        ergebnis: 'De Gaulle beendet die atomare Zusammenarbeit mit Bonn und Rom. Frankreich baut seine Bombe allein.',
        w: { brd: -3 }, setze: ['fig_entschieden'],
        bei: { brd: { titel: 'Paris kündigt die Rüstungszusammenarbeit', loesche: ['fig'], w: { frankreich: -2 }, ergebnis: 'De Gaulle hat die geheime Rüstungszusammenarbeit mit Bonn und Rom beendet. Frankreich baut seine Bombe allein.' } },
        dient: { deutschland_klein: 1, unabhaengigkeit: 0.6 } },
      { text: 'Die Zusammenarbeit fortsetzen – deutsches Geld beschleunigt die Bombe.', richtung: 'europa',
        ergebnis: 'Paris setzt die Zusammenarbeit fort. Deutsches Geld fließt nach Pierrelatte.',
        w: { brd: 5, atom: 6, usa: -4 }, setze: ['fig_entschieden', 'fig'], dient: { atom: 0.8, deutschland_einbinden: 0.6, deutschland_klein: -1 } },
    ],
    historisch: 'De Gaulle beendete die FIG-Zusammenarbeit im Juni 1958.',
  },
  {
    id: 'fr_memorandum',
    titel: 'Ein Direktorium für die NATO',
    datum: '17. September 1958',
    ab: 1958.2, bis: 1959.2, ordnung: 9.5,
    wenn: s => istDeGaulle(s) && !s.f.memorandum && !s.f.nato_fern,
    absender: 'Präsidialamt',
    text: s => `De Gaulle will Frankreich wieder als Weltmacht behandelt sehen. Ein Memorandum an ${praesident(s)} und den britischen Premierminister Macmillan liegt bereit: Die NATO soll von einem Direktorium der drei Mächte geführt werden, das über den Einsatz von Atomwaffen weltweit gemeinsam entscheidet. Lehnen die Angelsachsen ab, behält sich Paris seine Haltung zur NATO vor.

${bonnExistiert(s) ? 'Die Bundesrepublik, Italien' : 'Italien'} und die kleineren Verbündeten wären ausgeschlossen.`,
    optionen: [
      { text: 'Das Memorandum schicken.', hist: true, richtung: 'national',
        ergebnis: s => `De Gaulle schickt das Memorandum. Washington und London antworten ausweichend; ${bonnExistiert(s) ? 'Bonn' : 'Rom'} ist verstimmt, als es davon erfährt.`,
        w: { usa: -4, grossbritannien: -3, brd: -3, rang: 3 }, setze: ['memorandum'], dient: { unabhaengigkeit: 1.2, westbindung: -0.3 } },
      { text: 'Auf das Memorandum verzichten.', richtung: 'atlantisch',
        ergebnis: 'Paris verzichtet auf das Memorandum.',
        w: { usa: 2 }, setze: ['memorandum'], dient: { westbindung: 0.8 } },
    ],
    historisch: 'Eisenhower und Macmillan lehnten das Memorandum ab. Für de Gaulle war das die Begründung, Frankreich schrittweise aus der militärischen Integration der NATO zu lösen.',
  },
  {
    id: 'fr_rueff',
    titel: 'Der Plan Rueff',
    datum: 'Dezember 1958',
    ab: 1958.2, bis: 1959.2, ordnung: 12,
    wenn: s => istDeGaulle(s) && !s.f.neuer_franc,
    absender: 'Jacques Rueff, Wirtschaftsberater',
    text: s => `Frankreichs Finanzen sind zerrüttet: Inflation, Defizite, Devisenreserven für wenige Wochen. Der Ökonom Jacques Rueff schlägt eine Rosskur vor: eine Abwertung um 17,5 Prozent, Kürzungen bei Subventionen und Renten der Veteranen, höhere Steuern auf Wein und Tabak, die Liberalisierung des Handels für den gemeinsamen Markt – und einen „Neuen Franc“, der hundert alte wert ist.

Finanzminister Pinay hält das für politischen Selbstmord.`,
    optionen: [
      { text: 'Den Plan Rueff durchsetzen.', hist: true, richtung: 'sparen',
        ergebnis: 'De Gaulle setzt den Plan Rueff gegen Pinay durch. Der Franc wird abgewertet; ab 1960 gilt der Neue Franc. Die Reserven füllen sich rasch.',
        w: { franc: 35, haushalt: 10, inflation: 2, preisdruck: -3, ansehen: -4, impuls: -0.5, europa: 2 }, setze: ['neuer_franc'], dient: { modernisierung: 1.2, stabilitaet: 0.8 } },
      { text: 'Auf die Rosskur verzichten.',
        ergebnis: 'Paris verzichtet auf eine Abwertung. Die Devisenreserven schmelzen weiter.',
        w: { franc: -8, ansehen: 2 }, dient: { sozial: 0.3 } },
    ],
    historisch: 'Der Plan Rueff-Pinay trat am 28. Dezember 1958 in Kraft. Am 1. Januar 1960 wurde der Neue Franc eingeführt. Frankreich erlebte danach ein Jahrzehnt starken Wachstums.',
  },
];
