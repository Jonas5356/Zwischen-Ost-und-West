// Regierungen Großbritanniens für die vom Spiel gesteuerte Politik (ki.js). Welche Regierung
// im Amt ist, bestimmt das Modell (regimeVon: der Premierminister).
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
  inflation: -0.4, arbeitslosigkeit: -0.4, ansehen: 0.6, rueckhalt: 0.6, atom: 0.3, europa: 0.2, impuls: 0.5, gewerkschaften: 0.3, zustimmung: 0.3,
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

// ---------------------------------------------------------------- Parteiführer
//
// Wer regiert, ergibt sich aus dem Modell (modell.js: Wahlen, Nachfolge in der Partei).
// Die Führer der Opposition wechseln nach diesem Kalender, wenn nichts anderes geschieht.

export const LABOUR = ['attlee', 'gaitskell', 'wilson'];
export const istLabour = r => LABOUR.includes(r);
/** Wer die Konservativen führt, wenn sie in der Opposition sind */
export const toryChef = z => (z < 1955.1 ? 'churchill' : z < 1957.1 ? 'eden' : z < 1963.2 ? 'macmillan' : 'home');
/** Wer Labour führt, wenn Labour in der Opposition ist */
export const labourChef = z => (z < 1955.2 ? 'attlee' : z < 1963.1 ? 'gaitskell' : 'wilson');
