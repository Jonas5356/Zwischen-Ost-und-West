// Regierungen Großbritanniens (vom Spiel gesteuert, ki.js) und ihre Wechsel.
//
// Ziele (b_g), auf die sich `dient` an den Optionen bezieht:
//   empire              Empire und Commonwealth zusammenhalten
//   sonderverhaeltnis   die besondere Beziehung zu Washington
//   europa              Teilnahme an der europäischen Einigung
//   gleichgewicht       Gleichgewicht auf dem Kontinent, Deutschland unter Kontrolle
//   atom                eine eigene atomare Abschreckung
//   pfund               das Pfund als Weltwährung
//   eindaemmung         der Sowjetunion entgegentreten
//   entspannung         Ausgleich mit Moskau, Gipfeltreffen
//   sozial              Sozialstaat und Vollbeschäftigung

const WERTE = {
  usa: 0.6, frankreich: 0.3, brd: 0.2, moskau: 0.15, empire: 0.8, pfund: 0.6, haushalt: 0.4, wachstum: 0.4,
  inflation: -0.4, arbeitslosigkeit: -0.4, ansehen: 0.6, rueckhalt: 0.6, atom: 0.3, europa: 0.2, impuls: 0.5,
};
const BASIS = { empire: 1.0, sonderverhaeltnis: 1.2, europa: 0.4, gleichgewicht: 0.8, atom: 0.8, pfund: 0.8, eindaemmung: 1.0, entspannung: 0.4, sozial: 0.4 };

export const REGIERUNGEN = {
  attlee: {
    name: 'Clement Attlee', kurz: 'Attlee', titel: 'Premierminister Clement Attlee', partei: 'Labour',
    lambda: 1.8, werte: WERTE, ziele: { ...BASIS, sozial: 1.4, empire: 0.8, europa: 0.3 },
    frage: 'Bindet sich London an Europa – oder an Empire und Amerika?',
    typen: {
      commonwealth: { p: 0.8, name: 'Commonwealth', kurz: 'Empire und Amerika – Europa ist Sache der anderen',
        beschreibung: 'Attlee und Bevin wollen ein westliches Bündnis, aber keine europäische Einigung, die Londons Hände bindet.',
        ziele: { europa: 0.1, empire: 1.1, sonderverhaeltnis: 1.3 },
        berichte: ['Bevin soll gesagt haben, wer die Büchse der Pandora öffne, wisse nie, welche trojanischen Pferde herausspringen.', 'Im Foreign Office gilt der Europarat als „Debattierklub“, den man nicht ernst nehmen müsse.'] },
      europaeisch: { p: 0.2, name: 'Europäisch', kurz: 'Europa – London will die Einigung anführen',
        beschreibung: 'Bevin sieht in einer Westunion die Grundlage einer dritten Kraft und will Großbritannien an ihre Spitze stellen.',
        ziele: { europa: 1.2, gleichgewicht: 1.0 },
        berichte: ['Bevin hat Vertrauten von einer „Westunion“ unter britischer Führung erzählt, die mehr sein soll als ein Militärbündnis.', 'Im Kabinett wird über eine Zollunion mit Frankreich und den Benelux-Staaten gesprochen.'] },
    },
  },
  churchill: {
    name: 'Winston Churchill', kurz: 'Churchill', titel: 'Premierminister Winston Churchill', partei: 'Konservative',
    lambda: 1.7, werte: WERTE, ziele: { ...BASIS, empire: 1.4, sonderverhaeltnis: 1.5, entspannung: 0.7 },
    frage: 'Meint Churchill seine Europareden auch für Großbritannien?',
    typen: {
      redner: { p: 0.75, name: 'Redner', kurz: 'nein – Europa soll sich einigen, London schaut zu',
        beschreibung: 'Churchill will ein vereintes Europa – mit Großbritannien als Freund, nicht als Mitglied.',
        ziele: { europa: 0.2 },
        berichte: ['Churchill soll gesagt haben: „Wir sind mit Europa, aber nicht von Europa.“', 'In Downing Street hat man die EVG als „Brei“ bezeichnet, in den man keine britischen Soldaten rühre.'] },
      europaeer: { p: 0.25, name: 'Europäer', kurz: 'ja – er will London nach Europa führen',
        beschreibung: 'Der Redner von Zürich meint es ernst: Großbritannien soll an Europas Einigung teilnehmen.',
        ziele: { europa: 1.2 },
        berichte: ['Churchill hat Macmillan beauftragt, eine britische Beteiligung an der Montanunion prüfen zu lassen.', 'Der Premierminister soll im Kabinett für eine „europäische Armee mit britischen Divisionen“ geworben haben.'] },
    },
  },
  eden: {
    name: 'Anthony Eden', kurz: 'Eden', titel: 'Premierminister Anthony Eden', partei: 'Konservative',
    lambda: 1.6, werte: WERTE, ziele: { ...BASIS, empire: 1.3, gleichgewicht: 1.1 },
    frage: 'Wie weit geht Eden gegen Nasser?',
    typen: {
      hart: { p: 0.8, name: 'Hart', kurz: 'weit – Nasser ist für ihn ein neuer Mussolini',
        beschreibung: 'Eden will Nasser nicht gewähren lassen und nimmt dafür auch einen Bruch mit Washington in Kauf.',
        ziele: { empire: 1.6, sonderverhaeltnis: 0.8 },
        berichte: ['Eden soll gesagt haben, er wolle Nasser „vernichtet“ sehen.', 'Im Kriegsministerium werden Pläne für eine Landung in Ägypten gewälzt.'] },
      vorsichtig: { p: 0.2, name: 'Vorsichtig', kurz: 'nicht weit – nichts gegen den Willen Washingtons',
        beschreibung: 'Eden droht, aber er wird nichts tun, was Washington nicht billigt.',
        ziele: { empire: 0.9, sonderverhaeltnis: 1.6 },
        berichte: ['Eden hat Eisenhower zugesichert, London werde nichts ohne Abstimmung unternehmen.', 'Das Foreign Office setzt auf eine Lösung über die Vereinten Nationen.'] },
    },
  },
  macmillan: {
    name: 'Harold Macmillan', kurz: 'Macmillan', titel: 'Premierminister Harold Macmillan', partei: 'Konservative',
    lambda: 1.8, werte: WERTE, ziele: { ...BASIS, sonderverhaeltnis: 1.5, empire: 0.6, europa: 0.7, entspannung: 1.2, eindaemmung: 0.7 },
    frage: 'Will London wirklich in die EWG?',
    typen: {
      ernst: { p: 0.6, name: 'Ernst gemeint', kurz: 'ja – die Zukunft liegt in Europa',
        beschreibung: 'Macmillan hält das Empire für vergangen und will Großbritannien in die EWG führen.',
        ziele: { europa: 1.3 },
        berichte: ['Macmillan soll im Kabinett gesagt haben, ohne Europa werde Großbritannien „ein Schweden mit Atomwaffen“.', 'Edward Heath bereitet in Brüssel Verhandlungen über einen Beitritt vor.'] },
      taktik: { p: 0.4, name: 'Taktik', kurz: 'kaum – London will die EWG von innen bremsen',
        beschreibung: 'Der Beitrittsantrag soll vor allem verhindern, dass die Sechs ohne London einen festen Block bilden.',
        ziele: { europa: 0.4, empire: 0.9 },
        berichte: ['Ein Beamter des Foreign Office soll gesagt haben, man müsse „drinnen sein, um aufzupassen“.', 'London besteht in Brüssel auf Ausnahmen für das ganze Commonwealth.'] },
    },
  },
  butler: {
    name: 'R. A. Butler', kurz: 'Butler', titel: 'Premierminister R. A. Butler (Fiktion)', partei: 'Konservative',
    lambda: 1.7, werte: WERTE, ziele: { ...BASIS, sozial: 0.8, europa: 0.6 },
    frage: 'Sucht Butler den Weg nach Europa?',
    typen: {
      zoegernd: { p: 0.6, name: 'Zögernd', kurz: 'kaum – erst das Commonwealth', beschreibung: 'Butler ist vorsichtig und will das Commonwealth nicht verprellen.', ziele: { europa: 0.4, empire: 1.1 },
        berichte: ['Butler hat den Bauernverband beruhigt: Ein Beitritt zur EWG stehe nicht an.', 'In Butlers Umgebung spricht man von „Freihandel, aber keiner Union“.'] },
      offen: { p: 0.4, name: 'Offen', kurz: 'ja – er will nach Europa', beschreibung: 'Butler hält einen Beitritt zur EWG für unausweichlich.', ziele: { europa: 1.1 },
        berichte: ['Butler hat Wirtschaftsvertreter zu Gesprächen über den Gemeinsamen Markt eingeladen.', 'Der Premierminister soll Paris Gespräche über eine Assoziierung angeboten haben.'] },
    },
  },
  home: {
    name: 'Alec Douglas-Home', kurz: 'Douglas-Home', titel: 'Premierminister Alec Douglas-Home', partei: 'Konservative',
    lambda: 1.8, werte: WERTE, ziele: { ...BASIS, sonderverhaeltnis: 1.5, atom: 1.1 },
    frage: 'Wie eng bindet sich London an Washington?',
    typen: {
      atlantiker: { p: 0.7, name: 'Atlantiker', kurz: 'sehr eng – Washington geht vor', beschreibung: 'Douglas-Home setzt ganz auf die besondere Beziehung zu den USA.', ziele: { sonderverhaeltnis: 1.8 },
        berichte: ['Douglas-Home hat in Washington zugesagt, London werde die Politik der USA in Asien stützen.', 'Das Kabinett hat sich für die multilaterale Atomflotte der NATO ausgesprochen.'] },
      eigenstaendig: { p: 0.3, name: 'Eigenständig', kurz: 'weniger – London will eigene Wege gehen', beschreibung: 'Douglas-Home will eine unabhängige britische Abschreckung und Abstand zu Washington.', ziele: { atom: 1.4, europa: 0.7 },
        berichte: ['Im Verteidigungsministerium wird an einer britischen Alternative zu Polaris gearbeitet.', 'Douglas-Home soll mit de Gaulle über atomare Zusammenarbeit gesprochen haben.'] },
    },
  },
  gaitskell: {
    name: 'Hugh Gaitskell', kurz: 'Gaitskell', titel: 'Premierminister Hugh Gaitskell (Fiktion)', partei: 'Labour',
    lambda: 1.7, werte: WERTE, ziele: { ...BASIS, sozial: 1.3, europa: 0.3, entspannung: 0.8 },
    frage: 'Lehnt Labour den Gemeinsamen Markt ab?',
    typen: {
      skeptisch: { p: 0.7, name: 'Skeptisch', kurz: 'ja – „das Ende von tausend Jahren Geschichte“', beschreibung: 'Gaitskell hält einen Beitritt für Verrat am Commonwealth.', ziele: { europa: 0.1, empire: 1.1 },
        berichte: ['Gaitskell hat vor der Partei vom „Ende von tausend Jahren Geschichte“ gesprochen.', 'Labour verlangt Garantien für die Bauern des Commonwealth, die Brüssel nie geben wird.'] },
      offen: { p: 0.3, name: 'Offen', kurz: 'nein – er würde zu guten Bedingungen beitreten', beschreibung: 'Gaitskell würde der EWG beitreten, wenn das Commonwealth geschützt bleibt.', ziele: { europa: 1.0 },
        berichte: ['Gaitskells Schattenkanzler hat in Brüssel vorgefühlt.', 'Gaitskell soll gesagt haben, gute Bedingungen seien „nicht unmöglich“.'] },
    },
  },
  wilson: {
    name: 'Harold Wilson', kurz: 'Wilson', titel: 'Premierminister Harold Wilson (Fiktion)', partei: 'Labour',
    lambda: 1.7, werte: WERTE, ziele: { ...BASIS, sozial: 1.2, sonderverhaeltnis: 1.3 },
    frage: 'Hält Wilson an der eigenen Bombe fest?',
    typen: {
      bombe: { p: 0.6, name: 'Bombe', kurz: 'ja – trotz aller Reden', beschreibung: 'Wilson hat im Wahlkampf gegen die Bombe gesprochen, behält sie aber.', ziele: { atom: 1.2 },
        berichte: ['Wilson hat die Polaris-Bestellung nicht storniert.', 'Im Verteidigungsministerium heißt es, die Bombe sei „nicht verhandelbar“.'] },
      verzicht: { p: 0.4, name: 'Verzicht', kurz: 'nein – er gibt sie in die NATO', beschreibung: 'Wilson will die britischen Atomwaffen in eine gemeinsame Streitmacht der NATO einbringen.', ziele: { atom: 0.3, sonderverhaeltnis: 1.5 },
        berichte: ['Wilson hat eine „Atlantische Atomstreitmacht“ vorgeschlagen.', 'Labour-Abgeordnete verlangen den Verzicht auf die eigene Bombe.'] },
    },
  },
};

// ---------------------------------------------------------------- Wechsel
//
// Regulär wird nach fünf Jahren gewählt. Außerordentlich nur, wenn die Lage danach ist:
// 1951 bei knapper Labour-Mehrheit, 1955, wenn ein neuer Premierminister sich bestätigen lässt.

const LABOUR = ['attlee', 'gaitskell', 'wilson'];
const istLabour = r => LABOUR.includes(r);
/** Wer gerade die Konservativen führt, wenn sie an die Regierung kommen */
const toryChef = z => (z < 1955.1 ? 'churchill' : z < 1957.1 ? 'eden' : z < 1963.2 ? 'macmillan' : 'home');
/** Wer gerade Labour führt */
const labourChef = z => (z < 1955.2 ? 'attlee' : z < 1963.1 ? 'gaitskell' : 'wilson');
const tories = s => (!istLabour(s.regime) ? s.regime : toryChef(s.zeit));
const labour = s => (istLabour(s.regime) ? s.regime : labourChef(s.zeit));
const name = r => REGIERUNGEN[r].name;
const merke = z => s => { s.f.letzte_wahl = z; };

/** Wie die Lage der Regierungspartei hilft (−1 … 1): Umfrage um 42 % herum */
const lage = s => Math.max(-1, Math.min(1, (s.w.zustimmung - 42) / 12));
/** Gewicht „frei“ eines Ausgangs: Wer regiert und gut dasteht, gewinnt eher */
const frei = (g, lab) => s => g * (1 + 0.6 * (istLabour(s.regime) === lab ? lage(s) : -lage(s)));

/** Eine Unterhauswahl mit den Ausgängen „Konservative“ und „Labour“ (Gewichte historisch / frei) */
function wahl(id, zeit, titel, wenn, { tory = [0.5, 0.5], lab = [0.5, 0.5], knapp = null } = {}) {
  const fiktion = h => (h ? '' : ' (Fiktion)');
  const ausgaenge = [
    { regime: tories, hist: tory[0], frei: frei(tory[1], false), aktion: merke(zeit),
      meldung: s => (istLabour(s.regimeVorher)
        ? `Die Konservativen gewinnen die Unterhauswahl; ${name(s.regime)} wird Premierminister.${fiktion(tory[0])}`
        : `Die Konservativen behalten die Mehrheit; ${name(s.regime)} bleibt Premierminister.${fiktion(tory[0])}`) },
    { regime: labour, hist: lab[0], frei: frei(lab[1], true), aktion: merke(zeit),
      meldung: s => (istLabour(s.regimeVorher)
        ? `Labour behält die Mehrheit; ${name(s.regime)} bleibt Premierminister.${fiktion(lab[0])}`
        : `Labour gewinnt die Unterhauswahl; ${name(s.regime)} wird Premierminister.${fiktion(lab[0])}`) },
  ];
  if (knapp) ausgaenge.push({ regime: labour, hist: knapp[0], frei: frei(knapp[1], true), aktion: s => { merke(zeit)(s); s.f.knapp = true; },
    meldung: s => `Labour gewinnt die Unterhauswahl, aber nur mit fünf Sitzen Mehrheit. ${name(s.regime)} bleibt Premierminister.${fiktion(knapp[0])}` });
  return { id, zeit, titel, wenn, ausgaenge };
}

export const WECHSEL = [
  wahl('wahl1950', 1950.1, 'Unterhauswahl 1950', s => !s.f.letzte_wahl, { tory: [0, 0.4], lab: [0, 0.25], knapp: [1, 0.35] }),
  wahl('wahl1951', 1951.2, 'Vorgezogene Unterhauswahl 1951', s => !!s.f.knapp && istLabour(s.regime), { tory: [1, 0.55], lab: [0, 0.45] }),
  { id: 'churchill_ruecktritt', zeit: 1955.1, von: ['churchill'], titel: 'Churchills Rücktritt',
    ausgaenge: [
      { regime: 'eden', hist: 1, frei: 0.7, meldung: 'Winston Churchill tritt mit 80 Jahren zurück. Sein Nachfolger wird Außenminister Anthony Eden.' },
      { regime: 'churchill', hist: 0, frei: 0.3, meldung: 'Churchill denkt nicht an den Rücktritt. (Fiktion)' },
    ] },
  // Ein neuer Premierminister lässt sich bestätigen – nur, wenn die letzte Wahl 1951 war
  wahl('wahl1955e', 1955.1, 'Vorgezogene Unterhauswahl 1955', s => s.regime === 'eden' && s.f.letzte_wahl === 1951.2, { tory: [1, 0.6], lab: [0, 0.4] }),
  // Regulär fünf Jahre nach der letzten Wahl
  wahl('wahl1955', 1955.1, 'Unterhauswahl 1955', s => s.f.letzte_wahl === 1950.1),
  { id: 'attlee_ruecktritt', zeit: 1955.2, von: ['attlee'], titel: 'Attlees Rücktritt',
    ausgaenge: [{ regime: 'gaitskell', hist: 1, frei: 1, meldung: 'Clement Attlee tritt mit 72 Jahren zurück; Hugh Gaitskell übernimmt Partei und Regierung. (Fiktion)' }] },
  wahl('wahl1956', 1956.2, 'Unterhauswahl 1956', s => s.f.letzte_wahl === 1951.2),
  // Nach Suez: Eden geht, wenn London in Ägypten gescheitert ist
  { id: 'eden_suez', zeit: 1957.1, von: ['eden'], titel: 'Edens Rücktritt', wenn: s => s.weltflags.suez_london === 'ja' && !!s.weltflags.suez_druck,
    ausgaenge: [
      { regime: 'macmillan', hist: 1, frei: 0.55, meldung: 'Gesundheitlich angeschlagen und durch Suez gedemütigt, tritt Anthony Eden zurück. Nachfolger wird Schatzkanzler Harold Macmillan.' },
      { regime: 'butler', hist: 0, frei: 0.45, meldung: 'Nach Edens Rücktritt wählt die Fraktion nicht Macmillan, sondern R. A. Butler zum Premierminister. (Fiktion)' },
    ] },
  { id: 'eden_gesundheit', zeit: 1957.1, von: ['eden'], titel: 'Edens Gesundheit', wenn: s => !(s.weltflags.suez_london === 'ja' && s.weltflags.suez_druck),
    ausgaenge: [
      { regime: 'macmillan', hist: 1, frei: 0.4, meldung: 'Anthony Eden tritt aus gesundheitlichen Gründen zurück. Nachfolger wird Harold Macmillan.' },
      { regime: 'eden', hist: 0, frei: 0.6, meldung: 'Eden erholt sich und bleibt im Amt. (Fiktion)' },
    ] },
  wahl('wahl1959', 1959.2, 'Unterhauswahl 1959', s => s.f.letzte_wahl === 1955.1, { tory: [1, 0.55], lab: [0, 0.45] }),
  wahl('wahl1961', 1961.1, 'Unterhauswahl 1961', s => s.f.letzte_wahl === 1956.2),
  { id: 'gaitskell_tod', zeit: 1963.1, von: ['gaitskell'], titel: 'Gaitskells Tod',
    ausgaenge: [{ regime: 'wilson', hist: 1, frei: 1, meldung: 'Premierminister Hugh Gaitskell ist im Januar überraschend gestorben. Labour wählt Harold Wilson zum Nachfolger. (Fiktion)' }] },
  { id: 'profumo', zeit: 1963.2, von: ['macmillan'], titel: 'Nach der Profumo-Affäre',
    ausgaenge: [
      { regime: 'home', hist: 1, frei: 0.5, meldung: 'Harold Macmillan tritt nach der Profumo-Affäre und einer Krankheit zurück. Nachfolger wird Außenminister Lord Home, der als Sir Alec Douglas-Home ins Unterhaus wechselt.' },
      { regime: 'butler', hist: 0, frei: 0.5, meldung: 'Nach Macmillans Rücktritt wird R. A. Butler Premierminister. (Fiktion)' },
    ] },
];

export { istLabour };
