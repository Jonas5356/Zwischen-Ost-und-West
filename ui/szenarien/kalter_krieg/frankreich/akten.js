// Frankreich: Briefe und kleinere Vorlagen, die zufällig auf dem Schreibtisch landen
import { vierte, istDeGaulle, algerienkrieg } from './modell.js';
import { bonnImWesten } from './hilfen.js';

const akte = a => ({ art: 'akte', ...a });

export default [
  akte({
    id: 'fa_juin', titel: 'Der Marschall spricht', ab: 1953.2, bis: 1954.1, ordnung: 3,
    wenn: s => !!s.f.evg_unterzeichnet && !s.weltflags.evg,
    absender: 'Alphonse Juin, Marschall von Frankreich',
    text: 'Marschall Juin, Oberbefehlshaber der NATO-Landstreitkräfte in Mitteleuropa, hat öffentlich gegen die EVG gesprochen: Sie zerstöre die französische Armee und mache aus Frankreichs Soldaten Söldner eines „apatriden“ Europas. Ein Marschall, der die Politik der Regierung angreift, die er vertritt.',
    optionen: [
      { text: 'Den Marschall von seinen Ämtern im Verteidigungsrat entbinden.', hist: true, richtung: 'europa', ergebnis: 'Juin verliert seine Ämter im Verteidigungsrat. Die Gaullisten feiern ihn als Märtyrer.', w: { armee: -4, ansehen: 2 }, dient: { stabilitaet: 0.4, europa: 0.4 } },
      { text: 'Schweigen – ein Marschall darf seine Meinung haben.', richtung: 'national', ergebnis: 'Die Regierung schweigt. Die Gegner der EVG haben einen prominenten Fürsprecher.', w: { armee: 2, ansehen: -2 }, dient: { deutschland_klein: 0.3 } },
    ],
    historisch: 'Nach seiner Rede vom 27. März 1954 wurde Juin von der Regierung Laniel seiner Funktionen als Vizepräsident des Obersten Rats der Streitkräfte enthoben.',
  }),
  akte({
    id: 'fa_abbe_pierre', titel: 'Ein Aufruf im Radio', ab: 1953.2, bis: 1954.1, ordnung: 1,
    absender: 'Abbé Pierre, Gründer der Emmaus-Gemeinschaft',
    text: 'Der Winter ist der kälteste seit Jahrzehnten. In Paris ist eine Frau auf der Straße erfroren, die Räumungsbescheid in der Hand. Der Priester Abbé Pierre hat im Radio einen Aufruf gehalten: „Meine Freunde, zu Hilfe!“ Die Spenden strömen. Er bittet die Regierung um eine Milliarde Francs für Notunterkünfte.',
    optionen: [
      { text: 'Die Mittel bewilligen und ein Notprogramm für Wohnungen auflegen.', hist: true, richtung: 'sozial', ergebnis: 'Die Nationalversammlung bewilligt die Mittel. Notunterkünfte entstehen, der soziale Wohnungsbau bekommt Schwung.', w: { ansehen: 3, haushalt: -2 }, dient: { sozial: 0.8 } },
      { text: 'Auf private Hilfe verweisen.', ergebnis: 'Die Regierung lobt die Spendenbereitschaft der Franzosen. Abbé Pierre ist enttäuscht.', w: { ansehen: -3 }, dient: { sozial: -0.4 } },
    ],
    historisch: 'Der Aufruf von Abbé Pierre vom 1. Februar 1954 löste eine Welle der Hilfsbereitschaft aus („Aufstand der Güte“). Das Parlament bewilligte zehn Milliarden Francs für Notunterkünfte.',
  }),
  akte({
    id: 'fa_mauriac', titel: 'Folter in Algerien', ab: 1955.1, bis: 1957.2, ordnung: 5,
    wenn: algerienkrieg,
    absender: 'François Mauriac, Schriftsteller',
    text: 'Der Nobelpreisträger François Mauriac schreibt im „Express“ über Folter durch Polizei und Armee in Algerien: Elektroschocks, Ertränken, Verhöre, aus denen Menschen nicht zurückkehren. Er fragt, ob die Republik wisse, was in ihrem Namen geschehe, und verlangt eine Untersuchung.',
    optionen: [
      { text: 'Eine Untersuchungskommission einsetzen.', richtung: 'dekolonisation', ergebnis: 'Die Regierung setzt eine Kommission ein. Die Armee ist verstimmt; die Intellektuellen sind es weniger.', w: { rang: 2, armee: -3, ansehen: 1 }, dient: { frieden_kolonien: 0.5 } },
      { text: 'Die Berichte als Einzelfälle zurückweisen.', hist: true, ergebnis: 'Die Regierung spricht von „bedauerlichen Einzelfällen“.', w: { rang: -2, armee: 1 }, dient: { kolonien: 0.4 } },
    ],
    historisch: 'Mauriac berichtete ab Januar 1955 über Folter in Algerien. Eine Kommission zum Schutz der individuellen Rechte wurde erst 1957 eingesetzt; ihre Berichte blieben weitgehend folgenlos.',
  }),
  akte({
    id: 'fa_camus', titel: 'Ein Appell für eine Waffenruhe', ab: 1956.1, bis: 1956.1, ordnung: 1,
    wenn: algerienkrieg,
    absender: 'Albert Camus, Schriftsteller',
    text: 'Albert Camus, in Algerien geboren, will in Algier für eine „Waffenruhe für die Zivilbevölkerung“ werben: Beide Seiten sollen sich verpflichten, keine Zivilisten mehr anzugreifen. Er bittet um die Unterstützung der Regierung. Draußen vor dem Saal rufen Ultras „Camus an den Galgen“.',
    optionen: [
      { text: 'Den Appell unterstützen.', richtung: 'dekolonisation', ergebnis: 'Die Regierung unterstützt den Appell öffentlich. Die Siedler toben; die FLN schweigt.', w: { rang: 2, armee: -3, algerien: 1 }, dient: { frieden_kolonien: 0.6 } },
      { text: 'Höflich schweigen.', hist: true, ergebnis: 'Die Regierung schweigt. Camus’ Appell verhallt.', dient: { stabilitaet: 0.2 } },
    ],
    historisch: 'Camus hielt seinen Appell am 22. Januar 1956 in Algier. Er blieb folgenlos; danach schwieg Camus weitgehend zu Algerien.',
  }),
  akte({
    id: 'fa_monnet_komitee', titel: 'Das Aktionskomitee für Europa', ab: 1955.2, bis: 1956.2, ordnung: 4,
    wenn: s => bonnImWesten(s) && !s.f.rom_abgelehnt,
    absender: 'Jean Monnet',
    text: 'Jean Monnet hat die Hohe Behörde der Montanunion verlassen und ein „Aktionskomitee für die Vereinigten Staaten von Europa“ gegründet: Sozialisten, Christdemokraten, Liberale und Gewerkschafter aus allen sechs Ländern. Er bittet die Regierung, das Komitee zu empfangen und seine Vorschläge für Euratom ernst zu nehmen.',
    optionen: [
      { text: 'Das Komitee empfangen.', hist: true, richtung: 'europa', ergebnis: 'Monnets Komitee wird zur unermüdlichen Lobby für Europa. Die Atomgemeinschaft rückt näher.', w: { europa: 3, brd: 2 }, dient: { europa: 0.8 } },
      { text: 'Abwinken – Monnet ist ein Mann von gestern.', richtung: 'national', ergebnis: 'Die Regierung lässt Monnet abblitzen.', w: { europa: -1 }, dient: { unabhaengigkeit: 0.4 } },
    ],
  }),
  akte({
    id: 'fa_tillion', titel: 'Eine Ethnologin in der Kasbah', ab: 1957.1, bis: 1957.2, ordnung: 6,
    wenn: algerienkrieg,
    absender: 'Germaine Tillion, Ethnologin',
    text: 'Germaine Tillion, Widerstandskämpferin und Überlebende von Ravensbrück, kennt Algerien wie kaum jemand. Sie hat sich heimlich mit Yacef Saadi getroffen, dem Chef der FLN in Algier. Er sei bereit, Anschläge auf Zivilisten einzustellen, wenn die Hinrichtungen von FLN-Kämpfern aufhören.',
    optionen: [
      { text: 'Auf das Angebot eingehen: Hinrichtungen aussetzen.', richtung: 'dekolonisation', ergebnis: 'Die Regierung setzt die Hinrichtungen aus. Für einige Wochen gibt es in Algier keine Bomben.', w: { algerien: 3, armee: -4, rang: 2 }, dient: { frieden_kolonien: 0.8 } },
      { text: 'Nicht mit Terroristen verhandeln.', hist: true, ergebnis: 'Die Regierung lehnt ab. Die Gewalt geht weiter.', w: { armee: 1 }, dient: { kolonien: 0.5 } },
    ],
    historisch: 'Tillions Treffen mit Yacef Saadi im Juli 1957 führte zu einer kurzen Unterbrechung der Anschläge in Algier. Im September wurde Yacef Saadi verhaftet.',
  }),
  akte({
    id: 'fa_alleg', titel: 'Die Frage', ab: 1958.1, bis: 1958.1, ordnung: 3,
    wenn: algerienkrieg,
    absender: 'Éditions de Minuit',
    text: 'Henri Alleg, Chefredakteur einer kommunistischen Zeitung in Algier, beschreibt in seinem Buch „La Question“, wie er von Fallschirmjägern gefoltert wurde. Das Buch verkauft sich zehntausendfach. Die Armee verlangt die Beschlagnahme.',
    optionen: [
      { text: 'Das Buch beschlagnahmen lassen.', hist: true, ergebnis: 'Das Buch wird beschlagnahmt – und in der Schweiz weiter gedruckt. Malraux, Mauriac, Sartre und Martin du Gard protestieren.', w: { armee: 2, rang: -3 }, dient: { kolonien: 0.4 } },
      { text: 'Das Buch erscheinen lassen.', richtung: 'dekolonisation', ergebnis: 'Das Buch bleibt im Handel. Die Armee ist empört.', w: { armee: -4, rang: 2 }, dient: { frieden_kolonien: 0.4 } },
    ],
    historisch: '„La Question“ erschien im Februar 1958 und wurde im März beschlagnahmt – ein Vorgang, wie es ihn bei einem Buch in Frankreich seit langem nicht gegeben hatte. Es zirkulierte trotzdem in Zehntausenden Exemplaren.',
  }),
  akte({
    id: 'fa_malraux', titel: 'Häuser der Kultur', ab: 1959.1, bis: 1961.2, ordnung: 5,
    wenn: istDeGaulle,
    absender: 'André Malraux, Minister für kulturelle Angelegenheiten',
    text: 'Der Schriftsteller André Malraux, Frankreichs erster Kulturminister, will in jeder größeren Stadt ein „Haus der Kultur“ bauen: Theater, Kino, Ausstellungen, für alle zugänglich. Er braucht Geld – und Rückendeckung gegen die Finanzbeamten.',
    optionen: [
      { text: 'Die Häuser der Kultur finanzieren.', hist: true, richtung: 'sozial', ergebnis: 'In Le Havre, Bourges, Grenoble entstehen die ersten Häuser der Kultur.', w: { rang: 2, ansehen: 2, haushalt: -2 }, dient: { modernisierung: 0.4 } },
      { text: 'Malraux auf später vertrösten.', ergebnis: 'Malraux ist verärgert. Die Häuser der Kultur müssen warten.', w: { ansehen: -1 } },
    ],
  }),
  akte({
    id: 'fa_121', titel: 'Das Manifest der 121', ab: 1960.2, bis: 1960.2, ordnung: 9,
    wenn: algerienkrieg,
    absender: 'Justizministerium',
    text: '121 Schriftsteller, Künstler und Wissenschaftler – unter ihnen Jean-Paul Sartre, Simone de Beauvoir, Marguerite Duras und Alain Resnais – erklären in einem Manifest, die Weigerung, in Algerien zu kämpfen, sei gerechtfertigt. Der Justizminister will die Unterzeichner verfolgen, Sartre vorneweg.',
    optionen: [
      { text: 'Die Unterzeichner aus Rundfunk und Staatsdienst ausschließen, Sartre aber nicht verhaften.', hist: true, ergebnis: 'Die Unterzeichner werden aus Rundfunk und Fernsehen verbannt. Sartre bleibt unbehelligt: „Man verhaftet Voltaire nicht.“', w: { armee: 2, rang: -1 }, dient: { stabilitaet: 0.4 } },
      { text: 'Alle Unterzeichner anklagen, auch Sartre.', richtung: 'kolonial', ergebnis: 'Die Regierung lässt die Unterzeichner anklagen. Im Ausland ist von einem „Prozess gegen den Geist“ die Rede.', w: { armee: 4, rang: -5, ansehen: -3 }, dient: { kolonien: 0.5 } },
      { text: 'Nichts tun.', richtung: 'dekolonisation', ergebnis: 'Die Regierung ignoriert das Manifest. Die Armee ist empört.', w: { armee: -4 }, dient: { frieden_kolonien: 0.3 } },
    ],
    historisch: 'Das Manifest erschien im September 1960. Die Unterzeichner wurden aus dem staatlichen Rundfunk verbannt; de Gaulle soll eine Anklage gegen Sartre mit dem Satz „On n’arrête pas Voltaire“ abgelehnt haben.',
  }),
  akte({
    id: 'fa_boupacha', titel: 'Djamila Boupacha', ab: 1960.1, bis: 1961.1, ordnung: 7,
    wenn: algerienkrieg,
    absender: 'Gisèle Halimi, Rechtsanwältin',
    text: 'Die junge Algerierin Djamila Boupacha, angeklagt eines Bombenanschlags, wurde nach ihrer Verhaftung wochenlang von Soldaten gefoltert und vergewaltigt. Ihre Anwältin Gisèle Halimi und Simone de Beauvoir machen den Fall öffentlich und verlangen, dass der Prozess nach Frankreich verlegt und die Folterer angeklagt werden.',
    optionen: [
      { text: 'Den Prozess nach Frankreich verlegen und die Vorwürfe untersuchen lassen.', hist: true, richtung: 'dekolonisation', ergebnis: 'Der Prozess wird nach Caen verlegt. Die Täter werden nie verurteilt, doch der Fall erschüttert die Öffentlichkeit.', w: { rang: 2, armee: -3 }, dient: { frieden_kolonien: 0.5 } },
      { text: 'Der Militärjustiz in Algerien freien Lauf lassen.', ergebnis: 'Die Militärjustiz verhandelt in Algier. Im Ausland wächst die Empörung.', w: { rang: -3, armee: 2 }, dient: { kolonien: 0.4 } },
    ],
    historisch: 'Der Fall Boupacha wurde 1960 zum Symbol der Folter in Algerien. Boupacha wurde zum Tode verurteilt und nach den Abkommen von Évian amnestiert.',
  }),
  akte({
    id: 'fa_debre_zorn', titel: 'Der Zorn eines Senators', ab: 1957.1, bis: 1958.1, ordnung: 8,
    wenn: vierte,
    absender: 'Michel Debré, Senator',
    text: 'Der gaullistische Senator Michel Debré schreibt in seinem Blatt „Le Courrier de la colère“ Woche für Woche gegen die Regierung an: Sie verrate Algerien, das Regime sei ein „Regime der Parteien“, nur ein Mann könne Frankreich retten. Seine Artikel werden in den Kasernen gelesen.',
    optionen: [
      { text: 'Debré ignorieren.', hist: true, ergebnis: 'Die Regierung ignoriert Debré. In den Kasernen wird weiter gelesen.', w: { armee: -1 } },
      { text: 'Gegen die Zeitung vorgehen.', ergebnis: 'Die Regierung lässt einzelne Ausgaben beschlagnahmen. Debré wird zum Märtyrer der Pressefreiheit.', w: { armee: -3, ansehen: -2 } },
      { text: 'Debré ins Gespräch ziehen und Reformen der Verfassung anbieten.', ergebnis: 'Debré nimmt das Gespräch an; die Gaullisten werden etwas milder.', w: { mehrheit: 4, armee: 2 }, dient: { stabilitaet: 0.5 } },
    ],
  }),
  akte({
    id: 'fa_bauern', titel: 'Traktoren auf der Straße', ab: 1953.1, bis: 1961.2, ordnung: 7,
    absender: 'Bauernverband FNSEA',
    text: 'Die Bauern protestieren: Die Preise für Milch, Fleisch und Wein decken die Kosten nicht. Sie blockieren mit Traktoren die Nationalstraßen in der Bretagne und im Süden und verlangen garantierte Preise.',
    optionen: [
      { text: 'Garantierte Mindestpreise zusagen.', richtung: 'sozial', ergebnis: 'Die Regierung sagt Mindestpreise zu. Die Blockaden werden aufgehoben, die Kosten steigen.', w: { ansehen: 2, haushalt: -3, preisdruck: 1 }, dient: { sozial: 0.5 } },
      { text: 'Hart bleiben und auf Modernisierung setzen.', hist: true, richtung: 'sparen', ergebnis: 'Die Regierung bleibt hart und verspricht Hilfe für Flurbereinigung und Maschinen. Die Bauern sind wütend.', w: { ansehen: -2, impuls: 0.3 }, dient: { modernisierung: 0.6 } },
    ],
  }),
  akte({
    id: 'fa_citroen', titel: 'Die Göttin', ab: 1955.2, bis: 1956.1, ordnung: 9,
    absender: 'Citroën, Quai de Javel',
    text: 'Citroën hat auf dem Pariser Autosalon die DS vorgestellt – ein Auto wie aus der Zukunft, mit hydropneumatischer Federung. Am ersten Tag gingen 12.000 Bestellungen ein. Das Unternehmen bittet um staatliche Hilfe für neue Werke und um Bestellungen für den Fuhrpark der Ministerien.',
    optionen: [
      { text: 'Die DS zum Dienstwagen der Republik machen.', hist: true, ergebnis: 'Die DS wird zum Wagen der Präsidenten und Minister. Ein Symbol des modernen Frankreich.', w: { rang: 1, impuls: 0.3, haushalt: -1 }, dient: { modernisierung: 0.4 } },
      { text: 'Der Staat hält sich heraus.', ergebnis: 'Citroën baut auch ohne staatliche Hilfe.', w: {} },
    ],
  }),
];
