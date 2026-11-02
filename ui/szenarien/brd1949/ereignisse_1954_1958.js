// Hauptereignisse 1954 bis 1958
import { west, geteilt, vereinigt, imBuendnis, adenauer, regiertMit, land, Land, wahlIn, hauptstadt } from './hilfen.js';
import { hatMehrheit } from './modell.js';

export default [
  // ------------------------------------------------------------------ 1954/I
  {
    id: 'berliner_konferenz',
    titel: 'Die Berliner Außenministerkonferenz',
    datum: 'Januar/Februar 1954',
    ab: 1954.1, ordnung: 1,
    wenn: west,
    absender: 'Beobachterdelegation in Berlin',
    text: s => `Zum ersten Mal seit fünf Jahren sitzen die Außenminister der vier Mächte wieder zusammen, im Gebäude des Alliierten Kontrollrats in Berlin. Der britische Außenminister Eden legt einen Plan vor: zuerst freie gesamtdeutsche Wahlen, dann eine Nationalversammlung, dann ein Friedensvertrag. Molotow verlangt dagegen eine provisorische Regierung aus Vertretern beider deutscher Staaten und ein neutrales Deutschland.${s.f.westvertraege ? ' Die Westverträge sind unterzeichnet, aber in Paris noch nicht ratifiziert.' : ''}

Die Delegationen sind festgefahren. Ein Signal aus Bonn könnte die Gewichte verschieben.`,
    optionen: [
      { text: 'Den Eden-Plan ohne Abstriche unterstützen.', hist: true, richtung: 'west',
        ergebnis: 'Die Konferenz endet nach vier Wochen ohne Ergebnis. Die Teilung wirkt endgültiger als zuvor.',
        w: { usa: 3, grossbritannien: 3, einheit: -3, sowjet: 2 } },
      { text: 'Einen Kompromiss signalisieren: Neutralität eines vereinten Deutschlands, wenn freie Wahlen garantiert sind.', richtung: 'ost',
        ergebnis: 'Dulles ist außer sich, Bidault kühl, Eden nachdenklich. Molotow lässt eine Pause einlegen.',
        w: { usa: -12, frankreich: -3, grossbritannien: -4, einheit: 8, koalition: -6 },
        zufall: [
          { p: s => 0.12 + (s.w.einheit - 15) / 150 + (55 - s.w.sowjet) / 200 + (s.f.stalin_geprueft || s.f.stalin_angenommen ? 0.1 : 0),
            ergebnis: 'Molotow nimmt das Signal auf: Moskau sei bereit, über ein Wahlgesetz zu sprechen. Die Westverträge liegen auf Eis.',
            w: { sowjet: -10, einheit: 10 }, setze: ['neutral', 'berlin_durchbruch'], plane: [{ id: 'n_abkommen', in: 1 }] },
          { ergebnis: 'Molotow beharrt auf einer paritätischen Regierung ohne freie Wahlen. Die Konferenz scheitert, und du stehst im Westen mit beschädigtem Ruf da.',
            w: { sowjet: 2 }, setze: ['chance_vertan'] },
        ] },
      { text: 'Schweigen – die Großmächte sollen sich festfahren.',
        ergebnis: 'Die Konferenz scheitert ohne dein Zutun.',
        w: { einheit: -2 } },
    ],
    historisch: 'Die Konferenz (25. Januar bis 18. Februar 1954) scheiterte. Molotow lehnte den Eden-Plan ab und verlangte die Neutralisierung Deutschlands. Danach galt die Teilung für absehbare Zeit als festgeschrieben.',
  },

  // ------------------------------------------------------------------ 1954/II
  {
    id: 'evg_frankreich',
    titel: 'Die EVG vor der französischen Nationalversammlung',
    datum: '30. August 1954',
    ab: 1954.2, bis: 1955.1, ordnung: 8,
    wenn: s => west(s) && !!s.f.westvertraege && !s.f.evg && !s.f.evg_gescheitert,
    absender: 'Botschaft Paris',
    text: `Zwei Jahre nach der Unterzeichnung hat Frankreich den EVG-Vertrag noch immer nicht ratifiziert. Gaullisten und Kommunisten lehnen ihn ab, die Sozialisten sind gespalten. Ministerpräsident Pierre Mendès France will ihn ohne Vertrauensfrage zur Abstimmung stellen und verlangt vorher Zusatzprotokolle, die die Bundesrepublik schlechter stellen würden.

Auf der Konferenz in Brüssel liegt es an dir, ob du ihm entgegenkommst.`,
    optionen: [
      { text: 'Hart bleiben – keine weiteren Diskriminierungen.', hist: true,
        zufall: [
          { p: s => 0.08 + Math.max(0, s.w.frankreich - 55) / 200,
            ergebnis: 'Überraschend stimmt die Nationalversammlung zu. Die Europäische Verteidigungsgemeinschaft kann entstehen.',
            w: { europa: 12, frankreich: 4, souveraenitaet: 10, usa: 6, sowjet: 8 }, setze: ['evg'] },
          { ergebnis: 'Die Nationalversammlung lehnt mit einem Verfahrensantrag ab, ohne Aussprache. Die Abgeordneten singen die Marseillaise. Das Herzstück deiner Politik liegt in Trümmern.',
            w: { europa: -6, ansehen: -3, frankreich: -4 }, setze: ['evg_gescheitert'] },
        ] },
      { text: 'Mendès France entgegenkommen: Zusatzprotokolle und Bewegung in der Saarfrage.', richtung: 'west',
        w: { ansehen: -2, koalition: -4 },
        zufall: [
          { p: s => 0.25 + Math.max(0, s.w.frankreich - 45) / 150,
            ergebnis: 'Mit knapper Mehrheit ratifiziert Paris die EVG. Europa hat eine gemeinsame Armee.',
            w: { europa: 14, frankreich: 8, souveraenitaet: 8, usa: 6, sowjet: 8 }, setze: ['evg', 'saar_zugestaendnis'] },
          { ergebnis: 'Die Zugeständnisse reichen nicht. Die Nationalversammlung lehnt die EVG ab.',
            w: { europa: -4, frankreich: 2 }, setze: ['evg_gescheitert', 'saar_zugestaendnis'] },
        ] },
    ],
    historisch: 'Am 30. August 1954 lehnte die französische Nationalversammlung es ab, über den EVG-Vertrag zu beraten. Adenauer sprach von einem „schwarzen Tag für Europa“. Innerhalb weniger Wochen fanden die Westmächte mit dem NATO-Beitritt der Bundesrepublik eine Ersatzlösung.',
  },
  {
    id: 'londoner_konferenz',
    titel: 'Die Londoner Neunmächtekonferenz',
    datum: 'September/Oktober 1954',
    ab: 1954.2, bis: 1955.2, ordnung: 9,
    wenn: s => west(s) && !s.f.evg && (s.f.evg_gescheitert || s.f.westvertraege_abgelehnt),
    absender: 'Anthony Eden, britischer Außenminister',
    text: s => `${s.f.westvertraege_abgelehnt ? 'Nachdem Bonn die Westverträge 1952 nicht unterzeichnet hat, unternehmen die Westmächte einen letzten Anlauf.' : 'Nach dem Scheitern der EVG hat Eden in einer Rundreise durch die Hauptstädte eine Ersatzlösung zusammengezimmert.'} Die Bundesrepublik soll souverän werden und direkt der NATO beitreten; die Brüsseler Pakt-Staaten werden zur Westeuropäischen Union erweitert, die die deutsche Rüstung kontrolliert.

Frankreichs Preis: Die Bundesrepublik soll freiwillig auf die Herstellung atomarer, biologischer und chemischer Waffen verzichten.`,
    optionen: [
      { text: 'Den ABC-Waffen-Verzicht erklären und dem Paket zustimmen.', hist: true, richtung: 'west',
        ergebnis: 'Dulles steht auf und sagt, er gehe davon aus, dass dieser Verzicht – wie alle völkerrechtlichen Erklärungen – nur „rebus sic stantibus“ gelte. Du antwortest: „Genau so haben Sie mich verstanden.“ Die Pariser Verträge werden im Oktober unterzeichnet.',
        w: { usa: 8, grossbritannien: 8, frankreich: 4, souveraenitaet: 6, sowjet: 6, einheit: -6, europa: 2 },
        setze: ['pariser_vertraege', 'abc_verzicht'] },
      { text: 'Beitreten, aber keinen einseitigen Verzicht erklären.',
        ergebnis: 'Mendès France droht, die Konferenz platzen zu lassen. Erst nach Tagen findet sich eine weichere Formel.',
        w: { usa: 2, grossbritannien: 2, frankreich: -8, souveraenitaet: 6, sowjet: 10, einheit: -6 },
        setze: ['pariser_vertraege'] },
      { text: 'Ablehnen: kein NATO-Beitritt, solange die Einheit nicht verhandelt ist.', richtung: 'ost',
        ergebnis: 'Ein Paukenschlag. Die Westmächte behalten ihre Besatzungsrechte. In Moskau wird das Signal aufmerksam registriert.',
        w: { usa: -15, grossbritannien: -12, frankreich: -5, einheit: 6, sowjet: -8, ansehen: -2 }, setze: ['westintegration_gescheitert'] },
    ],
    historisch: 'Auf der Londoner Konferenz (28. September bis 3. Oktober 1954) erklärte Adenauer den Verzicht auf die Herstellung von ABC-Waffen. Die Pariser Verträge wurden am 23. Oktober 1954 unterzeichnet. Die Szene mit Dulles hat Adenauer selbst in seinen Erinnerungen geschildert.',
  },
  {
    id: 'saarstatut',
    titel: 'Das Saarstatut',
    datum: '23. Oktober 1954',
    ab: 1954.2, bis: 1955.2, ordnung: 10,
    wenn: s => west(s) && (s.f.pariser_vertraege || s.f.evg),
    absender: 'Pierre Mendès France, Ministerpräsident der Französischen Republik',
    text: s => `Paris macht die Ratifizierung ${s.f.evg ? 'der letzten EVG-Durchführungsabkommen' : 'der Pariser Verträge'} von einer Lösung der Saarfrage abhängig. Mendès France schlägt ein „europäisches Statut“ vor: Die Saar erhält einen Kommissar der Westeuropäischen Union, bleibt wirtschaftlich mit Frankreich verbunden, und die Saarländer sollen in einer Volksabstimmung zustimmen.

FDP, BHE und die SPD werfen dir vor, deutsches Land preiszugeben. Du hoffst, dass die Saarländer bei der Abstimmung selbst entscheiden werden.`,
    optionen: [
      { text: 'Dem Statut zustimmen und auf die Abstimmung vertrauen.', hist: true, richtung: 'west',
        ergebnis: 'Die Koalitionspartner murren laut. Paris ist zufrieden.',
        w: { frankreich: 8, europa: 3, ansehen: -2, koalition: -8 }, setze: ['saarstatut'] },
      { text: 'Ablehnen – die Saar ist deutsch.',
        ergebnis: 'In Paris wird die Ratifizierung der Verträge zur Zitterpartie.',
        w: { frankreich: -14, ansehen: 3, koalition: 4 }, setze: ['saar_abgelehnt'] },
    ],
    historisch: 'Das Saarstatut wurde zusammen mit den Pariser Verträgen unterzeichnet. Adenauer setzte darauf, dass die Saarländer es ablehnen würden – was am 23. Oktober 1955 auch geschah.',
  },

  // ------------------------------------------------------------------ 1955/I
  {
    id: 'paulskirche',
    titel: 'Das Deutsche Manifest',
    datum: '29. Januar 1955',
    ab: 1955.1, bis: 1956.1, ordnung: 1,
    wenn: s => west(s) && (s.f.pariser_vertraege || s.f.evg),
    absender: 'Kundgebung in der Frankfurter Paulskirche',
    text: `In der Paulskirche haben Erich Ollenhauer, Gustav Heinemann, Gewerkschafter und Theologen wie Helmut Gollwitzer ein „Deutsches Manifest“ verabschiedet: Die Aufstellung deutscher Streitkräfte in einem Militärbündnis werde die Spaltung Deutschlands auf unabsehbare Zeit vertiefen. Vor jeder Ratifizierung müssten Viermächteverhandlungen stattfinden.

Hunderttausende unterschreiben. Die Ratifizierungsdebatte im Bundestag steht in vier Wochen an.`,
    optionen: [
      { text: 'Hart bleiben und die Verträge rasch ratifizieren lassen.', hist: true, richtung: 'west',
        ergebnis: 'Nach dreitägiger Debatte stimmt der Bundestag zu. Die Paulskirchenbewegung verebbt.',
        w: { usa: 3, einheit: -3, ansehen: -1 } },
      { text: 'Vor der Ratifizierung ein neues Viermächte-Gespräch verlangen.',
        ergebnis: 'Die Westmächte sagen eine Gipfelkonferenz für den Sommer zu, die Ratifizierung bleibt aber unverändert auf dem Fahrplan.',
        w: { usa: -4, einheit: 3, ansehen: 3, sowjet: -2 } },
    ],
    historisch: 'Der Bundestag ratifizierte die Pariser Verträge am 27. Februar 1955. Die Paulskirchenbewegung blieb ohne politische Wirkung, prägte aber die spätere Friedensbewegung.',
  },
  {
    id: 'souveraenitaet',
    titel: s => (s.f.evg ? 'Die Verträge treten in Kraft' : 'Souveränität und NATO-Beitritt'),
    datum: '5. Mai 1955',
    ab: 1955.1, bis: 1956.2, ordnung: 5,
    wenn: s => west(s) && (s.f.pariser_vertraege || s.f.evg) && !s.f.souveraen && !s.f.ratifizierung_haengt,
    absender: 'Auswärtiges Amt',
    ascii: 'flagge',
    text: s => {
      const saar = s.f.saar_abgelehnt && !s.f.saarstatut;
      return `${s.f.evg ? 'Der Deutschlandvertrag und der Vertrag über die Europäische Verteidigungsgemeinschaft' : 'Die Pariser Verträge'} sollen am 5. Mai in Kraft treten. Das Besatzungsstatut endet, die Hohen Kommissare werden Botschafter. ${s.f.evg ? 'Die Bundesrepublik stellt Kontingente für die europäische Armee.' : 'Vier Tage später würde die Bundesrepublik Mitglied der NATO.'}${saar ? '\n\nDoch die französische Nationalversammlung zögert. Ohne Einigung über die Saar fehlen im Rat der Republik die Stimmen.' : ''}

Wie soll der Tag begangen werden?`;
    },
    optionen: s => [
      { text: 'Schlicht: Flaggenhissung am Palais Schaumburg, eine kurze Erklärung.', hist: true,
        ergebnis: 'Kein Jubel, keine Feier – mit Rücksicht auf die Deutschen in der DDR, für die dieser Tag nichts ändert.',
        w: { ansehen: 2 } },
      { text: 'Ein großer Staatsakt: Die Bundesrepublik ist wieder wer.',
        ergebnis: 'Die Feier wird im Ausland aufmerksam, teils misstrauisch beobachtet.',
        w: { ansehen: 3, frankreich: -2, sowjet: 2 } },
    ].map(o => ({
      ...o,
      aktion: (st, a) => {
        const saarOffen = st.f.saar_abgelehnt && !st.f.saarstatut;
        if (saarOffen && a.zufall() > st.w.frankreich / 100) {
          st.f.ratifizierung_haengt = true;
          a.plane('saar_nachverhandlung', 1);
          return;
        }
        st.f.souveraen = true;
        st.w.souveraenitaet = Math.max(st.w.souveraenitaet + 25, 70);
        if (!st.f.evg) st.f.nato = true;
        st.w.sowjet = Math.min(100, st.w.sowjet + 6);
        st.w.einheit = Math.max(0, st.w.einheit - 8);
        st.w.usa = Math.min(100, st.w.usa + 4);
      },
      ergebnis: st => (st.f.ratifizierung_haengt && !st.f.souveraen
        ? 'Der Tag verstreicht ohne Souveränität: Frankreich hat nicht ratifiziert. Paris verlangt eine Lösung der Saarfrage.'
        : `${o.ergebnis} ${st.f.evg ? '' : 'Am 9. Mai wird die Bundesrepublik in die NATO aufgenommen. Fünf Tage später gründen die Ostblockstaaten den Warschauer Pakt; die DDR ist dabei.'}`),
    })),
    historisch: 'Die Pariser Verträge traten am 5. Mai 1955 in Kraft, am 9. Mai trat die Bundesrepublik der NATO bei. Am 14. Mai wurde der Warschauer Pakt gegründet. Adenauer verzichtete auf eine Feier.',
  },
  {
    id: 'saar_nachverhandlung',
    titel: 'Paris verlangt die Saar',
    datum: 'Herbst 1955',
    nurGeplant: true, ordnung: 2,
    absender: 'Botschaft Paris',
    text: 'Die französische Regierung lässt keinen Zweifel: Ohne ein Saarstatut wird der Rat der Republik die Verträge nicht ratifizieren. Washington und London drängen Bonn zum Einlenken.',
    optionen: [
      { text: 'Einlenken und dem Saarstatut doch zustimmen.', richtung: 'west',
        ergebnis: 'Paris ratifiziert. Mit einem halben Jahr Verspätung wird die Bundesrepublik souverän und Mitglied der NATO.',
        w: { frankreich: 8, ansehen: -4, koalition: -6, souveraenitaet: 25, usa: 4, sowjet: 6, einheit: -8 },
        setze: ['saarstatut', 'souveraen', 'nato'], loesche: ['saar_abgelehnt', 'ratifizierung_haengt'] },
      { text: 'Hart bleiben.',
        ergebnis: 'Die Westintegration ist gescheitert. Die Bundesrepublik bleibt ein Staat unter Besatzungsvorbehalt.',
        w: { usa: -12, frankreich: -10, grossbritannien: -8, ansehen: 2 }, setze: ['westintegration_gescheitert'] },
    ],
  },
  {
    id: 'staatsvertrag',
    titel: 'Österreich wird frei',
    datum: '15. Mai 1955',
    ab: 1955.1, ordnung: 5.5,
    wenn: geteilt,
    absender: 'Gesandtschaft in Wien',
    text: s => `Im Belvedere in Wien haben die vier Mächte den Staatsvertrag mit Österreich unterzeichnet. Die Besatzungstruppen ziehen ab, Österreich erklärt sich zur immerwährenden Neutralität.

In der Bundesrepublik fragen sich viele: Warum nicht auch für uns? Die SPD fordert, das österreichische Modell zu prüfen. ${s.f.nato ? 'Doch die Bundesrepublik ist seit wenigen Tagen Mitglied der NATO.' : ''}`,
    optionen: [
      { text: 'Erklären, dass Österreich kein Modell für Deutschland ist.', hist: true, richtung: 'west',
        ergebnis: 'Du verweist auf die Größe und Lage Deutschlands. Neutralität würde das Land zum Spielball machen.',
        w: { usa: 2, einheit: -2 } },
      { text: 'Die Westmächte bitten, über eine „österreichische Lösung“ zu sprechen.', richtung: 'ost',
        ergebnis: 'In Washington herrscht Alarmstimmung. Moskau lädt zu Gesprächen.',
        w: { usa: -8, frankreich: -2, einheit: 6, sowjet: -6, ansehen: 2 }, setze: ['oesterreich_modell'] },
    ],
    historisch: 'Adenauer lehnte die Übertragung des österreichischen Modells strikt ab. Der Staatsvertrag galt ihm eher als Warnung, dass Moskau auch Deutschland neutralisieren wolle.',
  },

  // ------------------------------------------------------------------ 1955/II
  {
    id: 'genf',
    titel: 'Der Geist von Genf',
    datum: 'Juli 1955',
    ab: 1955.2, ordnung: 7,
    wenn: geteilt,
    absender: 'Beobachterdelegation in Genf',
    text: `Eisenhower, Eden, Faure und Bulganin mit Chruschtschow treffen sich in Genf – der erste Gipfel der Großmächte seit Potsdam. Die Stimmung ist freundlich, man spricht vom „Geist von Genf“. Über Deutschland gibt es keine Einigung: Moskau spricht jetzt von „zwei deutschen Staaten“.

Bonn ist nur Beobachter. Was soll die Delegation den westlichen Regierungschefs mit auf den Weg geben?`,
    optionen: [
      { text: 'Auf der Formel „Einheit durch freie Wahlen“ bestehen.', hist: true, richtung: 'west',
        ergebnis: 'Die Westmächte halten an der Formel fest. Die Konferenz endet in freundlicher Ratlosigkeit.',
        w: { usa: 2, einheit: -1 } },
      { text: 'Ein europäisches Sicherheitssystem als Gegenleistung für die Einheit anregen.', richtung: 'ost',
        ergebnis: 'Ein interessanter Gedanke, sagt Eden. Mehr geschieht nicht.',
        w: { einheit: 3, usa: -3, sowjet: -3, grossbritannien: 2 } },
    ],
    historisch: 'Der Genfer Gipfel (18.–23. Juli 1955) brachte keine Annäherung in der deutschen Frage. Auf der Rückreise erklärte Chruschtschow in Ost-Berlin die Zwei-Staaten-Theorie.',
  },
  {
    id: 'moskau',
    titel: 'Die Reise nach Moskau',
    datum: 'September 1955',
    ab: 1955.2, ordnung: 9,
    wenn: geteilt,
    absender: 'Einladung der Sowjetregierung',
    ascii: 'kreml',
    text: `Ministerpräsident Bulganin lädt dich nach Moskau ein, um über die Aufnahme diplomatischer Beziehungen zu sprechen. Noch immer sind rund 10.000 deutsche Kriegsgefangene und Zivilinternierte in sowjetischen Lagern, verurteilt als „Kriegsverbrecher“. Ihre Familien warten seit zehn Jahren.

Moskau will Beziehungen, ohne über die Gefangenen zu reden. Diplomatische Beziehungen würden bedeuten, dass in Moskau zwei deutsche Botschafter sitzen – einer aus Bonn, einer aus Ost-Berlin.`,
    optionen: [
      { text: 'Reisen und hart verhandeln: Beziehungen nur gegen die Freilassung der Gefangenen.', hist: true,
        ergebnis: 'Nach zermürbenden Tagen – mit Wodka, Wutausbrüchen und einem demonstrativ bestellten Flugzeug für die Abreise – gibt Bulganin beim Abschiedsempfang sein Wort. Als die ersten Heimkehrer im Lager Friedland ankommen, wird dein Name zur Legende.',
        w: { ansehen: 6, sowjet: -6, usa: -2, einheit: 1 }, setze: ['moskau_beziehungen', 'heimkehrer'] },
      { text: 'Beziehungen nur, wenn Moskau über die Einheit verhandelt.',
        ergebnis: 'Die Sowjets lehnen jede Verknüpfung ab. Du reist mit leeren Händen zurück, die Gefangenen bleiben in den Lagern.',
        w: { ansehen: -4, sowjet: 3, usa: 2 } },
      { text: 'Die Einladung ablehnen.', richtung: 'west',
        ergebnis: 'Washington ist erleichtert. In tausenden Familien wächst die Bitterkeit.',
        w: { ansehen: -5, usa: 2, sowjet: 4 } },
    ],
    historisch: 'Adenauer reiste vom 8. bis 14. September 1955 nach Moskau. Gegen die Aufnahme diplomatischer Beziehungen wurden die letzten rund 10.000 Kriegsgefangenen freigelassen. Die „Heimkehr der Zehntausend“ machte Adenauer populärer als jedes andere Ereignis seiner Amtszeit.',
  },
  {
    id: 'saarabstimmung',
    titel: 'Die Saar stimmt ab',
    datum: '23. Oktober 1955',
    ab: 1955.2, bis: 1956.1, ordnung: 10,
    wenn: s => !!s.f.saarstatut && !s.f.saar_entschieden,
    absender: 'Beobachter in Saarbrücken',
    ascii: 'urne',
    text: `Der Abstimmungskampf an der Saar ist erbittert. Ministerpräsident Johannes Hoffmann wirbt für das Statut, der „Heimatbund“ aus CDU Saar, DPS und der Deutschen Sozialdemokratischen Partei für ein Nein – und damit für die Rückkehr nach Deutschland. Offiziell unterstützt Bonn das Statut, das du selbst unterzeichnet hast.

Deine Parteifreunde an der Saar bitten um diskrete Hilfe.`,
    optionen: [
      { text: 'Offiziell für das Statut werben, inoffiziell nichts tun.', hist: true,
        zufall: [
          { p: 0.75, ergebnis: '67,7 Prozent der Saarländer stimmen mit Nein. Hoffmann tritt zurück. Paris erklärt sich zu Verhandlungen über die Rückgliederung bereit.',
            w: { ansehen: 3, frankreich: -2 }, setze: ['saar_nein', 'saar_entschieden'] },
          { ergebnis: 'Knapp siegt das Ja. Die Saar wird ein europäisches Territorium unter der WEU.',
            w: { europa: 5, frankreich: 6, ansehen: -4 }, setze: ['saar_europaeisch', 'saar_entschieden'] },
        ] },
      { text: 'Dem Heimatbund heimlich Geld aus dem Kanzleramt zukommen lassen.',
        zufall: [
          { p: 0.3, ergebnis: 'Die Zahlungen fliegen auf. In Paris ist von Wortbruch die Rede. Das Nein ist trotzdem deutlich.',
            w: { frankreich: -10, ansehen: -2 }, setze: ['saar_nein', 'saar_entschieden'] },
          { ergebnis: 'Das Nein siegt deutlich, niemand erfährt von deinem Geld.',
            w: { ansehen: 3 }, setze: ['saar_nein', 'saar_entschieden'] },
        ] },
      { text: 'Ehrlich und aktiv für das Statut werben – ein Europa der Verträge.',
        zufall: [
          { p: 0.5, ergebnis: 'Das Ja siegt. Die Saar wird europäisch, du bist an der Saar und bei den Vertriebenen verhasst.',
            w: { europa: 6, frankreich: 10, ansehen: -6 }, setze: ['saar_europaeisch', 'saar_entschieden'] },
          { ergebnis: 'Trotz deines Einsatzes stimmen 60 Prozent mit Nein.',
            w: { frankreich: 4, ansehen: -2 }, setze: ['saar_nein', 'saar_entschieden'] },
        ] },
    ],
    historisch: 'Am 23. Oktober 1955 lehnten 67,7 Prozent der Saarländer das Statut ab. Frankreich akzeptierte das Ergebnis; am 1. Januar 1957 trat das Saarland der Bundesrepublik bei.',
  },
  {
    id: 'hallstein',
    titel: 'Die Hallstein-Doktrin',
    datum: 'Dezember 1955',
    ab: 1955.2, bis: 1956.1, ordnung: 12,
    wenn: s => geteilt(s) && !!s.f.moskau_beziehungen,
    absender: 'Walter Hallstein und Wilhelm Grewe, Auswärtiges Amt',
    text: `Seit es in Moskau zwei deutsche Botschaften gibt, fürchtet das Auswärtige Amt eine Kettenreaktion: Andere Staaten könnten die DDR anerkennen und damit die Teilung völkerrechtlich besiegeln.

Die Planungsgruppe schlägt eine Doktrin vor: Die Bundesrepublik vertritt allein das deutsche Volk. Wer die DDR anerkennt, begeht einen „unfreundlichen Akt“, auf den Bonn mit dem Abbruch der Beziehungen reagieren kann. Die Sowjetunion als Siegermacht bleibt die Ausnahme.`,
    optionen: [
      { text: 'Die Doktrin zur Grundlage der Außenpolitik machen.', hist: true, richtung: 'west',
        ergebnis: 'Die DDR bleibt international isoliert – solange die Bundesrepublik bereit ist, den Preis zu zahlen.',
        w: { einheit: 2, sowjet: 3 }, setze: ['hallstein'] },
      { text: 'Flexibel bleiben: Jeder Einzelfall wird abgewogen.', richtung: 'ost',
        ergebnis: 'Einige blockfreie Staaten nehmen Beziehungen zur DDR auf. Bonn behält Spielraum, die DDR gewinnt an Gewicht.',
        w: { einheit: -4, sowjet: -3, usa: -1 }, setze: ['keine_hallstein'] },
    ],
    historisch: 'Die Doktrin wurde im Dezember 1955 formuliert und erstmals 1957 gegen Jugoslawien angewandt. Erst die Ostpolitik der Großen Koalition und der sozialliberalen Koalition gab sie Ende der 1960er Jahre auf.',
  },

  // ------------------------------------------------------------------ 1956/I
  {
    id: 'fdp_bruch',
    titel: 'Der Aufstand der Jungtürken',
    datum: 'Februar 1956',
    ab: 1956.1, ordnung: 2,
    wenn: regiertMit('FDP'),
    absender: 'Thomas Dehler, Vorsitzender der FDP',
    text: `Die FDP unter Thomas Dehler wird zum unbequemen Partner. Dehler attackiert deine Deutschlandpolitik im Bundestag, als stünde er in der Opposition. In der Union wird daher ein neues Wahlrecht erwogen, ein „Grabensystem“, das die kleinen Parteien bei der nächsten Wahl dezimieren würde.

Die jungen Landespolitiker der FDP in Nordrhein-Westfalen – Döring, Weyer, Scheel – drohen, in Düsseldorf mit der SPD eine neue Landesregierung zu bilden, falls das Grabenwahlrecht kommt.`,
    optionen: [
      { text: 'Das neue Wahlrecht vorantreiben.', hist: true,
        ergebnis: 'Die Jungtürken stürzen Ministerpräsident Arnold. Die FDP verlässt die Bundesregierung; ihre 16 Minister und Abgeordneten, die zu dir halten, gründen die Freie Volkspartei.',
        w: { ansehen: -2 },
        aktion: s => {
          const fvp = Math.round((s.sitze.FDP || 0) / 3);
          s.sitze.FDP = (s.sitze.FDP || 0) - fvp;
          s.sitze.Kleine = (s.sitze.Kleine || 0) + fvp;
          s.regierung = s.regierung.filter(p => p !== 'FDP');
          if (!s.regierung.includes('Kleine')) s.regierung.push('Kleine');
          s.f.fdp_opposition = true;
          s.w.koalition = 45;
          if (!hatMehrheit(s, s.regierung)) s.w.koalition = 0;
        } },
      { text: 'Das Wahlrecht begraben und mit Dehler ein offenes Gespräch führen.',
        ergebnis: 'Der Konflikt wird vertagt, nicht gelöst.',
        w: { koalition: 6, ansehen: -1 } },
    ],
    historisch: 'Am 20. Februar 1956 stürzte die FDP in Düsseldorf Karl Arnold. Am 23. Februar verließ die FDP-Bundestagsfraktion die Koalition; die FDP-Minister und 16 Abgeordnete gründeten die FVP, die mit der Union weiterregierte.',
  },

  // ------------------------------------------------------------------ 1956/II
  {
    id: 'wehrpflicht',
    titel: 'Allgemeine Wehrpflicht?',
    datum: 'Juli 1956',
    ab: 1956.2, ordnung: 7,
    wenn: s => imBuendnis(s) && geteilt(s),
    absender: 'Theodor Blank, Bundesminister für Verteidigung',
    text: `Die ersten Freiwilligen der Bundeswehr haben im November 1955 ihre Ernennungsurkunden erhalten. Die NATO erwartet 500.000 Soldaten in zwölf Divisionen – mit Freiwilligen allein ist das nicht zu schaffen. Das Verteidigungsministerium legt ein Wehrpflichtgesetz vor.

Die SPD will eine kleinere Freiwilligenarmee. Die NATO-Planer halten 18 Monate Dienstzeit für das Minimum, Finanzminister Schäffer jeden Monat für zu teuer.`,
    optionen: [
      { text: 'Wehrpflicht mit 12 Monaten Dienstzeit.', hist: true, richtung: 'west',
        ergebnis: 'Das Gesetz passiert den Bundestag nach einer Marathondebatte. Die NATO findet die Dienstzeit zu kurz.',
        w: { usa: 3, sowjet: 3, haushalt: -2, ansehen: -1, bundeswehr: 1 }, setze: ['wehrpflicht'] },
      { text: 'Wehrpflicht mit 18 Monaten, wie die NATO es will.', richtung: 'west',
        ergebnis: 'Die Verbündeten sind beeindruckt, die Wähler nicht.',
        w: { usa: 6, grossbritannien: 2, sowjet: 5, haushalt: -4, ansehen: -4, bundeswehr: 1 }, setze: ['wehrpflicht'] },
      { text: 'Eine kleinere Berufsarmee.',
        ergebnis: 'Die SPD stimmt zu, die NATO schüttelt den Kopf.',
        w: { usa: -6, haushalt: -1, ansehen: 2, koalition: 2 } },
    ],
    historisch: 'Das Wehrpflichtgesetz wurde am 7. Juli 1956 verabschiedet und sah 12 Monate Grundwehrdienst vor. Die ersten Wehrpflichtigen wurden am 1. April 1957 einberufen.',
  },
  {
    id: 'kpd_verbot',
    titel: 'Das Urteil über die KPD',
    datum: '17. August 1956',
    ab: 1956.2, ordnung: 8,
    wenn: s => !!s.f.kpd_antrag && !s.f.kpd_verboten,
    absender: 'Bundesverfassungsgericht, Karlsruhe',
    text: `Fünf Jahre nach deinem Verbotsantrag will das Bundesverfassungsgericht über die KPD entscheiden. Die Richter selbst sind unglücklich; über inoffizielle Kanäle lässt Karlsruhe fragen, ob die Regierung den Antrag nicht zurückziehen möchte. Die Partei hat bei der letzten Wahl nur 2,2 Prozent erhalten.

Mit Moskau bestehen inzwischen diplomatische Beziehungen. Ein Verbot wäre ein Signal – nach innen wie nach außen.`,
    optionen: [
      { text: 'Am Antrag festhalten.', hist: true,
        ergebnis: s => `Die KPD wird verboten, ihr Vermögen eingezogen. Funktionäre gehen in den Untergrund ${s.f.vereinigt ? 'oder nach Moskau' : 'oder in die DDR'}.`,
        w: { sowjet: 4, ansehen: 1 }, setze: ['kpd_verboten'] },
      { text: 'Den Antrag zurückziehen.',
        ergebnis: 'Die Richter sind erleichtert. Die Vertriebenenverbände und die CSU sprechen von Schwäche.',
        w: { sowjet: -2, ansehen: -1, koalition: -2 } },
    ],
    historisch: 'Das Bundesverfassungsgericht verbot die KPD am 17. August 1956. 1968 wurde die DKP als Nachfolgepartei neu gegründet.',
  },
  {
    id: 'suez',
    titel: 'Die Suezkrise',
    datum: 'November 1956',
    ab: 1956.2, ordnung: 10.5,
    absender: 'Botschaft Paris',
    text: s => `Großbritannien und Frankreich haben zusammen mit Israel Ägypten angegriffen, um den von Nasser verstaatlichten Suezkanal zurückzugewinnen. Eisenhower ist empört und zwingt London und Paris mit finanziellem Druck zum Rückzug; Moskau droht mit Raketen. Für Paris und London ist es eine Demütigung.

Für den 6. November ist ${s.kanzler} zu einem lange geplanten Besuch bei Ministerpräsident Guy Mollet in Paris angekündigt. Das Auswärtige Amt rät zur Absage – man dürfe sich nicht an die Seite der Verlierer stellen.`,
    optionen: [
      { text: 'Trotzdem nach Paris fahren – gerade jetzt.', hist: true, richtung: 'west',
        ergebnis: 'Während des Besuchs akzeptiert Paris die Waffenruhe. Mollet wird dir die Geste nicht vergessen. „Europa wird eure Rache sein“, sagst du ihm.',
        w: { frankreich: 12, europa: 4, usa: -4 }, setze: ['paris_suez'] },
      { text: 'Die Reise absagen und sich hinter Washington stellen.',
        ergebnis: 'Eisenhower ist zufrieden, Mollet verbittert.',
        w: { usa: 5, frankreich: -7, grossbritannien: -2 } },
      { text: 'Neutral bleiben.',
        ergebnis: 'Niemand dankt es dir, aber niemand ist verärgert.',
        w: {} },
    ],
    historisch: 'Adenauer fuhr am 6. November 1956 trotz allem nach Paris. Das Treffen mit Mollet gilt als ein Schlüsselmoment für den Abschluss der Römischen Verträge.',
  },
  {
    id: 'ungarn',
    titel: 'Aufstand in Ungarn',
    datum: 'Oktober/November 1956',
    ab: 1956.2, ordnung: 10,
    wenn: geteilt,
    absender: 'Gesandtschaft in Wien',
    ascii: 'aufstand',
    text: `In Budapest hat sich das Volk gegen die kommunistische Herrschaft erhoben. Ministerpräsident Imre Nagy kündigt den Austritt aus dem Warschauer Pakt an. Am 4. November rollen sowjetische Panzer in die Stadt. Radio Free Europe hat den Aufständischen über Tage Hoffnung auf westliche Hilfe gemacht – die nicht kommt.

Zehntausende Flüchtlinge strömen nach Österreich.`,
    optionen: [
      { text: 'Flüchtlinge aufnehmen, Hilfe schicken, zur Besonnenheit mahnen.', hist: true,
        ergebnis: 'Die Bundesrepublik nimmt Tausende Ungarn auf. Die Lehre aus Budapest ist bitter: Der Westen wird nicht eingreifen.',
        w: { ansehen: 2, haushalt: -1, sowjet: 2, einheit: -2 } },
      { text: 'Die NATO öffentlich zum Handeln drängen.', richtung: 'west',
        ergebnis: 'Washington weist den Vorstoß zurück. Moskau zeigt mit dem Finger auf Bonn.',
        w: { sowjet: 12, usa: -4, ansehen: 1 } },
    ],
    historisch: 'Der Aufstand wurde bis Mitte November niedergeschlagen; rund 2.500 Ungarn starben, etwa 200.000 flohen. Die Bundesrepublik nahm rund 15.000 Flüchtlinge auf.',
  },
  {
    id: 'saarvertrag',
    titel: 'Der Saarvertrag',
    datum: '27. Oktober 1956',
    ab: 1956.2, bis: 1957.1, ordnung: 10,
    wenn: s => !!s.f.saar_nein && !s.f.saar_zurueck,
    absender: 'Heinrich von Brentano, Bundesminister des Auswärtigen',
    text: `Nach dem Nein der Saarländer verhandeln Bonn und Paris über die Rückgliederung. Frankreich verlangt Gegenleistungen: die Kanalisierung der Mosel für die lothringische Stahlindustrie, Kohlelieferungen aus dem Warndt und eine Übergangszeit, in der die Saar wirtschaftlich zu Frankreich gehört.`,
    optionen: [
      { text: 'Großzügig sein: Die Saar ist wichtiger als die Mosel.', hist: true,
        ergebnis: 'In Luxemburg wird der Vertrag unterzeichnet. Am 1. Januar 1957 wird das Saarland zehntes Bundesland – die „kleine Wiedervereinigung“.',
        w: { frankreich: 8, ansehen: 4, haushalt: -3 }, setze: ['saar_zurueck'] },
      { text: 'Hart verhandeln.',
        ergebnis: 'Der Vertrag kommt zustande, aber Paris ist verstimmt und die Rückgliederung verzögert sich.',
        w: { frankreich: -3, ansehen: 3, haushalt: -1 }, setze: ['saar_zurueck'] },
    ],
    historisch: 'Der Saarvertrag wurde am 27. Oktober 1956 unterzeichnet. Das Saarland trat am 1. Januar 1957 politisch, am 6. Juli 1959 auch wirtschaftlich der Bundesrepublik bei.',
  },

  // ------------------------------------------------------------------ 1957/I
  {
    id: 'rentenreform',
    titel: 'Die große Rentenreform',
    datum: 'Januar 1957',
    ab: 1957.1, ordnung: 1,
    absender: 'Wilfrid Schreiber und das Arbeitsministerium',
    text: `Die Renten sind ein Skandal: Ein Arbeiter, der ein Leben lang eingezahlt hat, bekommt im Alter oft nur ein Drittel seines letzten Lohns, viele Rentner leben in Armut, während ringsum das Wirtschaftswunder blüht. Der Ökonom Wilfrid Schreiber hat ein Konzept entwickelt: Die Renten sollen nicht mehr aus angespartem Kapital, sondern aus den laufenden Beiträgen finanziert werden und jedes Jahr mit den Löhnen steigen – ein „Vertrag zwischen den Generationen“.

Finanzminister Schäffer und Wirtschaftsminister Erhard halten die dynamische Rente für unbezahlbar und gefährlich. Im September wird gewählt.`,
    optionen: [
      { text: 'Die dynamische Rente durchsetzen.', hist: true,
        ergebnis: 'Über Nacht steigen die Renten um 60 Prozent und mehr. Für Millionen alte Menschen ist es die größte Wohltat, die je ein Staat getan hat.',
        w: { ansehen: 6, haushalt: -6, koalition: 2, impuls: 0.8 }, setze: ['rentenreform'] },
      { text: 'Eine einmalige kräftige Erhöhung ohne Dynamisierung.',
        ergebnis: 'Die Rentner freuen sich, die Fachleute warnen, dass das Problem bald zurückkehrt.',
        w: { ansehen: 3, haushalt: -3 } },
      { text: 'Keine Reform vor der Wahl.',
        ergebnis: 'Schäffer ist zufrieden. Die SPD macht die Rente zu ihrem Wahlkampfthema.',
        w: { ansehen: -3, haushalt: 1 } },
    ],
    historisch: 'Der Bundestag beschloss die Rentenreform am 21. Januar 1957 mit großer Mehrheit, auch mit Stimmen der SPD. Das Umlageverfahren mit lohndynamischer Rente ist bis heute Grundlage der gesetzlichen Rentenversicherung.',
  },
  {
    id: 'roemische_vertraege',
    titel: 'Die Römischen Verträge',
    datum: '25. März 1957',
    ab: 1957.1, ordnung: 3,
    wenn: s => geteilt(s) && !s.f.neutral,
    absender: 'Walter Hallstein, Auswärtiges Amt',
    text: s => `Auf der Konferenz von Messina 1955 wurde ein neuer Anlauf beschlossen. Jetzt liegen zwei Verträge vor: eine Europäische Wirtschaftsgemeinschaft mit gemeinsamem Markt und gemeinsamem Außenzoll und eine Atomgemeinschaft.${s.f.paris_suez ? ' Seit deinem Besuch in Paris während der Suezkrise ist Mollet zu Zugeständnissen bereit.' : ''}

Wirtschaftsminister Erhard ist dagegen: Er will keine Zollmauer um sechs Länder, sondern eine große Freihandelszone mit Großbritannien. Frankreich verlangt, dass seine Überseegebiete und seine Landwirtschaft einbezogen werden.`,
    optionen: [
      { text: 'Unterzeichnen – gegen Erhards Bedenken.', hist: true, richtung: 'west',
        ergebnis: 'Im Kapitol in Rom setzen sechs Regierungen ihre Unterschrift unter die Verträge. Hallstein wird erster Präsident der Kommission.',
        w: { europa: 15, frankreich: 8, usa: 3, grossbritannien: -4, impuls: 0.5 }, setze: ['ewg'] },
      { text: 'Erhard folgen: lieber eine große Freihandelszone mit London.',
        ergebnis: 'Die Verhandlungen über die Freihandelszone ziehen sich hin. Die Sechsergemeinschaft entsteht ohne die Bundesrepublik nicht.',
        w: { europa: 3, grossbritannien: 8, frankreich: -12 }, setze: ['freihandel'] },
    ],
    historisch: 'Die Römischen Verträge wurden am 25. März 1957 unterzeichnet und traten am 1. Januar 1958 in Kraft. Adenauer setzte sich gegen Erhard durch, der den Gemeinsamen Markt als „volkswirtschaftlichen Unsinn“ bezeichnet hatte.',
  },
  {
    id: 'goettinger',
    titel: 'Die Göttinger Erklärung',
    datum: '12. April 1957',
    ab: 1957.1, ordnung: 4,
    wenn: imBuendnis,
    absender: 'Achtzehn Atomwissenschaftler',
    text: s => `${s.kanzler === 'Adenauer' ? 'Du hast' : 'Der Kanzler hat'} taktische Atomwaffen in einer Pressekonferenz „nichts weiter als die Weiterentwicklung der Artillerie“ genannt. Achtzehn der bekanntesten deutschen Physiker – darunter Otto Hahn, Werner Heisenberg und Carl Friedrich von Weizsäcker – antworten mit einer öffentlichen Erklärung: Taktische Atomwaffen hätten die Zerstörungskraft der Hiroshima-Bombe. Keiner von ihnen werde sich an Herstellung, Erprobung oder Einsatz beteiligen.

Die Erklärung beherrscht die Titelseiten. Im September ist Wahl.`,
    optionen: [
      { text: 'Die Wissenschaftler ins Kanzleramt bitten und um Verständnis werben, ohne den Kurs zu ändern.', hist: true,
        ergebnis: 'Das Gespräch ist höflich und folgenlos. Die Öffentlichkeit beruhigt sich vorerst.',
        w: { ansehen: -1, usa: 1 } },
      { text: 'Eine atomare Bewaffnung der Bundeswehr ausschließen.', richtung: 'ost',
        ergebnis: 'Die Wissenschaftler sind erleichtert, die NATO irritiert. Moskau lobt die „Vernunft“.',
        w: { ansehen: 3, usa: -6, sowjet: -5, einheit: 2 }, setze: ['atomverzicht_bundeswehr'] },
      { text: 'Die Wissenschaftler öffentlich zurechtweisen.',
        ergebnis: 'Ein Sturm der Entrüstung. Otto Hahn, Nobelpreisträger, gegen den Kanzler – das kann nicht gut gehen.',
        w: { ansehen: -5, usa: 2 } },
    ],
    historisch: 'Die „Göttinger Achtzehn“ veröffentlichten ihre Erklärung am 12. April 1957. Adenauer empfing einige von ihnen; an der Haltung der Regierung änderte sich nichts.',
  },

  // ------------------------------------------------------------------ 1957/II
  {
    id: 'wahlkampf1957',
    titel: 'Wahlkampf 1957',
    datum: 'August 1957',
    ab: 1957.2, ordnung: 8,
    wenn: s => wahlIn(s, 1957.2),
    absender: 'Bundesgeschäftsstelle der CDU',
    ascii: 'plakat',
    text: s => `Am 15. September ${s.f.vereinigt ? 'wählen die Deutschen in Ost und West' : 'wird der dritte Bundestag gewählt'}. Die Union liegt bei ${String(s.w.zustimmung).replace('.', ',')} Prozent, die Wirtschaft wächst mit ${String(s.w.wachstum).replace('.', ',')} Prozent, die Arbeitslosigkeit ist auf ${String(s.w.arbeitslosigkeit).replace('.', ',')} Prozent gesunken.${s.f.rentenreform ? ' Die Rentenreform wirkt in jedem Briefkasten.' : ''}

Die Werbeagentur schlägt einen Slogan vor, der ganz auf die Person des Kanzlers setzt.`,
    optionen: [
      { text: '„Keine Experimente!“ – Stabilität und der Kanzler.', hist: true,
        ergebnis: 'Das Plakat zeigt nur ein Porträt und zwei Worte. Es trifft die Stimmung eines Landes, das genug Experimente erlebt hat.',
        w: s => ({ ansehen: s.w.wachstum >= 4 && s.w.arbeitslosigkeit < 5 ? 4 : 2 }) },
      { text: '„Wohlstand für alle“ – Erhard in den Mittelpunkt.',
        ergebnis: 'Erhard zieht die Massen an. Mancher fragt, wer hier eigentlich Kanzler ist.',
        w: s => ({ ansehen: Math.max(1, Math.round(s.w.wachstum - 2)), kanzlerbonus: -1 }) },
      { text: s => (s.f.vereinigt ? 'Die Sicherheitspolitik: „Ein freies Deutschland braucht Schutz – die SPD würde es wehrlos machen.“' : 'Die Sicherheitspolitik: „Gegen den Atomtod der SPD – für die Sicherheit im Bündnis.“'),
        ergebnis: 'Ein polarisierender Wahlkampf, der die eigene Anhängerschaft mobilisiert.',
        w: s => ({ ansehen: s.w.sowjet >= 55 ? 5 : 2, sowjet: 2 }) },
    ],
    historisch: 'Mit „Keine Experimente!“ errang die Union am 15. September 1957 mit 50,2 Prozent die absolute Mehrheit der Stimmen – das einzige Mal in der Geschichte der Bundesrepublik.',
  },
  {
    id: 'jugoslawien',
    titel: 'Belgrad erkennt die DDR an',
    datum: 'Oktober 1957',
    ab: 1957.2, ordnung: 10,
    wenn: s => !!s.f.hallstein && geteilt(s),
    absender: 'Botschaft Belgrad',
    text: `Marschall Tito hat diplomatische Beziehungen zur DDR aufgenommen. Es ist der erste Testfall der Hallstein-Doktrin. Jugoslawien ist blockfrei, ein wichtiger Handelspartner und ein Gegenspieler Moskaus. Bricht Bonn die Beziehungen ab, verliert es Einfluss auf dem Balkan. Tut es das nicht, ist die Doktrin wertlos.`,
    optionen: [
      { text: 'Die Beziehungen abbrechen.', hist: true,
        ergebnis: 'Die Botschaft in Belgrad wird geschlossen. Die Welt hat verstanden, dass Bonn es ernst meint.',
        w: { einheit: 1, sowjet: 2, impuls: -0.2 } },
      { text: 'Protestieren, aber die Beziehungen halten.',
        ergebnis: 'Ägypten, Indonesien und andere beobachten genau. Die Doktrin hat einen Riss.',
        w: { einheit: -4, sowjet: -2 }, loesche: ['hallstein'], setze: ['keine_hallstein'] },
    ],
    historisch: 'Bonn brach am 19. Oktober 1957 die Beziehungen zu Jugoslawien ab; 1963 folgte Kuba. Erst 1968 wurden die Beziehungen zu Belgrad wieder aufgenommen.',
  },
  {
    id: 'sputnik',
    titel: 'Sputnik',
    datum: '4. Oktober 1957',
    ab: 1957.2, ordnung: 10.2,
    absender: 'Bundesministerium für Atomfragen',
    ascii: 'sputnik',
    text: s => `Ein Funksignal aus dem All: Die Sowjetunion hat den ersten künstlichen Satelliten in eine Erdumlaufbahn gebracht. Was eine Kugel mit vier Antennen in den Orbit tragen kann, kann auch einen Atomsprengkopf nach Amerika tragen. Im Westen geht der „Sputnik-Schock“ um.

In ${hauptstadt(s)} fragen Forschungspolitiker und Industrie, ob ${land(s)} nicht zu lange auf ${s.f.vereinigt ? 'die eigene Neutralität vertraut' : 'Hilfe aus Washington gesetzt'} hat.`,
    optionen: [
      { text: 'Ein Programm zur Förderung der Wissenschaften auflegen.',
        ergebnis: 'Universitäten und Forschungsinstitute erhalten deutlich mehr Geld. Ein Wissenschaftsrat soll den Ausbau planen.',
        w: { haushalt: -3, impuls: 0.5, ansehen: 1 }, setze: ['wissenschaftsoffensive'] },
      { text: 'Auf amerikanische Rückversicherung drängen – auch atomar.', richtung: 'west', nurWenn: s => !s.f.vereinigt,
        ergebnis: 'Die Amerikaner versprechen mehr Mitsprache in der nuklearen Planung der NATO.',
        w: { usa: 2, sowjet: 3 }, setze: ['nukleare_teilhabe_wunsch'] },
      { text: s => `Gelassen bleiben – ${s.f.vereinigt ? 'Deutschland' : 'die Bundesrepublik'} baut keine Raketen.`,
        ergebnis: 'Die Aufregung legt sich.', w: {} },
    ],
    historisch: 'Der Sputnik-Schock verstärkte in der Bundesrepublik die Debatte über Bildung und Forschung. 1957 wurde der Wissenschaftsrat gegründet.',
  },

  // ------------------------------------------------------------------ 1958/I
  {
    id: 'rapacki',
    titel: 'Der Rapacki-Plan',
    datum: 'Februar 1958',
    ab: 1958.1, ordnung: 2,
    wenn: geteilt,
    absender: 'Note der polnischen Regierung',
    text: `Der polnische Außenminister Adam Rapacki schlägt eine atomwaffenfreie Zone in Mitteleuropa vor: Polen, die Tschechoslowakei und beide deutsche Staaten sollen keine Atomwaffen herstellen, lagern oder stationieren.

Die SPD und viele Kirchenleute sehen darin eine Chance. Das Auswärtige Amt warnt: Die Zone würde die Bundesrepublik vom Bündnis abkoppeln und die DDR aufwerten.`,
    optionen: [
      { text: 'Ablehnen.', hist: true, richtung: 'west',
        ergebnis: 'Bonn und Washington lehnen den Plan ab. Rapacki legt im November eine abgeschwächte Fassung vor – ohne Erfolg.',
        w: { usa: 3, einheit: -2, sowjet: 2 } },
      { text: 'Zu Verhandlungen bereit sein.', richtung: 'ost',
        ergebnis: 'In Warschau und Moskau wird das Signal begrüßt, in Washington mit Sorge registriert.',
        w: { einheit: 5, usa: -8, sowjet: -6, ansehen: 1 }, setze: ['rapacki_offen'] },
    ],
    historisch: 'Der Rapacki-Plan wurde im Oktober 1957 vorgestellt und im Februar 1958 an die Regierungen übermittelt. Die Bundesregierung und die NATO lehnten ihn ab.',
  },
  {
    id: 'atomdebatte',
    titel: 'Atomwaffen für die Bundeswehr?',
    datum: 'März 1958',
    ab: 1958.1, ordnung: 3,
    wenn: s => imBuendnis(s) && !s.f.atomverzicht_bundeswehr,
    absender: 'Franz Josef Strauß, Bundesminister der Verteidigung',
    text: `Die NATO stellt ihre Strategie auf atomare Abschreckung um. Verteidigungsminister Strauß will die Bundeswehr mit Trägersystemen ausrüsten, die atomare Sprengköpfe verschießen können – die Sprengköpfe selbst blieben unter amerikanischer Kontrolle.

Die SPD, die Gewerkschaften und die Kirchen rufen zur Kampagne „Kampf dem Atomtod“ auf. SPD-geführte Länder planen Volksbefragungen. Im Bundestag steht eine viertägige Redeschlacht bevor.`,
    optionen: [
      { text: 'Ausrüstung mit atomwaffenfähigen Trägern beschließen – Sprengköpfe in amerikanischer Hand.', hist: true, richtung: 'west',
        ergebnis: 'Der Bundestag folgt dir. Die Volksbefragungen werden vom Verfassungsgericht untersagt, die Kampagne verebbt.',
        w: { usa: 6, sowjet: 8, einheit: -5, ansehen: -2, bundeswehr: 1 }, setze: ['atombewaffnung'] },
      { text: 'Verzichten – die Bundeswehr bleibt konventionell.', richtung: 'ost',
        ergebnis: 'Die NATO ist enttäuscht, die Kampagne „Kampf dem Atomtod“ hat ihr Ziel erreicht.',
        w: { usa: -8, sowjet: -6, ansehen: 2, einheit: 2 }, setze: ['atomverzicht_bundeswehr'] },
      { text: 'Eigene Verfügungsgewalt über die Sprengköpfe verlangen.',
        ergebnis: 'Washington ist alarmiert, Moskau spricht von „Revanchismus mit der Bombe“.',
        w: { usa: -10, sowjet: 18, frankreich: -3, einheit: -8, souveraenitaet: 2 }, setze: ['atombewaffnung', 'nationale_atomoption'] },
    ],
    historisch: 'Am 25. März 1958 beschloss der Bundestag die Ausrüstung der Bundeswehr mit modernsten Waffen, einschließlich atomwaffenfähiger Träger. Die Sprengköpfe blieben in amerikanischem Gewahrsam („nukleare Teilhabe“).',
  },
  {
    id: 'fig',
    titel: 'Geheimgespräche mit Paris und Rom',
    datum: 'April 1958',
    ab: 1958.1, ordnung: 4,
    wenn: s => imBuendnis(s) && !s.f.atomverzicht_bundeswehr,
    absender: 'Franz Josef Strauß, streng geheim',
    text: `Seit Ende 1957 verhandeln die Verteidigungsminister Frankreichs, Italiens und der Bundesrepublik im Geheimen über eine Zusammenarbeit in der Rüstung – auch bei Kernwaffen. Frankreich steht kurz vor seinem ersten Atomtest. Strauß will das Protokoll unterzeichnen: Die Bundesrepublik würde sich an der Finanzierung einer Isotopentrennanlage beteiligen.

Würde das bekannt, wäre der ABC-Verzicht von 1954 in den Augen der Welt Makulatur.`,
    optionen: [
      { text: 'Strauß gewähren lassen.',
        zufall: [
          { p: 0.35, ergebnis: 'Details sickern in die amerikanische Presse. Washington stellt peinliche Fragen.',
            w: { usa: -8, frankreich: 4, sowjet: 8 }, setze: ['fig'] },
          { ergebnis: 'Das Protokoll wird unterzeichnet. Die Welt erfährt nichts.',
            w: { frankreich: 6, sowjet: 2 }, setze: ['fig'] },
        ] },
      { text: 'Die Gespräche stoppen.',
        ergebnis: 'Strauß ist verärgert, aber du schläfst ruhiger.',
        w: { usa: 1, frankreich: -2 } },
    ],
    historisch: 'Das sogenannte FIG-Abkommen (Frankreich–Italien–Deutschland) wurde im April 1958 unterzeichnet. Nach seiner Rückkehr an die Macht beendete de Gaulle im Juni 1958 die nukleare Zusammenarbeit; Frankreich baute die Bombe allein.',
  },

  // ------------------------------------------------------------------ 1958/II
  {
    id: 'colombey',
    titel: 'Besuch in Colombey-les-Deux-Églises',
    datum: '14. September 1958',
    ab: 1958.2, ordnung: 9,
    absender: 'Charles de Gaulle, Président du Conseil',
    text: s => `Im Mai hat die Algerienkrise die Vierte Republik zum Einsturz gebracht. General de Gaulle ist an die Macht zurückgekehrt. In Bonn ist man besorgt: Der General war gegen die EVG, gegen Europa und gegen alles, was Frankreich Souveränität kostet.

Nun lädt er ${s.kanzler === 'Adenauer' ? 'dich' : 'den Kanzler'} in sein Landhaus in Colombey ein – kein Staatsbesuch, ein privates Treffen. Kein ausländischer Regierungschef war je dort.${s.f.fig ? '\n\nDe Gaulle wird die geheime Nuklearkooperation beenden wollen.' : ''}`,
    optionen: [
      { text: 'Hinfahren und eine persönliche Freundschaft suchen.', hist: true,
        ergebnis: 'Zwei alte Männer sprechen bis in die Nacht über Geschichte, Europa und die Russen. Am Ende sind sie Freunde.',
        w: { frankreich: 12, europa: 3, usa: -2 }, setze: ['colombey'], loesche: ['fig'] },
      { text: 'Hinfahren, aber kühl bleiben – Washington hat Vorrang.',
        ergebnis: 'Ein höfliches Treffen. De Gaulle merkt sich die Distanz.',
        w: { frankreich: 3, usa: 2 }, loesche: ['fig'] },
      { text: 'Absagen.',
        ergebnis: 'Ein Affront, den de Gaulle nicht vergessen wird.',
        w: { frankreich: -10 } },
    ],
    historisch: 'Das Treffen in Colombey am 14. September 1958 begründete die enge Freundschaft zwischen Adenauer und de Gaulle; Adenauer war der einzige ausländische Staatsmann, den de Gaulle in seinem Privathaus empfing.',
  },
  {
    id: 'berlin_ultimatum',
    titel: 'Das Berlin-Ultimatum',
    datum: '27. November 1958',
    ab: 1958.2, ordnung: 11,
    wenn: geteilt,
    absender: 'Note der Sowjetregierung',
    ascii: 'berlin',
    text: `Nikita Chruschtschow verlangt in einer Note an die drei Westmächte, West-Berlin binnen sechs Monaten in eine „entmilitarisierte Freie Stadt“ umzuwandeln. Andernfalls werde die Sowjetunion ihre Rechte in Berlin an die DDR übertragen – die dann über die Zugangswege nach West-Berlin bestimmen würde.

Über West-Berlin verlassen jeden Monat Zehntausende die DDR. Für Moskau und Ost-Berlin ist die offene Grenze eine blutende Wunde.`,
    optionen: [
      { text: 'Gemeinsam mit den Westmächten jede Änderung des Status ablehnen.', hist: true, richtung: 'west',
        ergebnis: 'Die Westmächte bleiben fest. Das Ultimatum verstreicht, eine Außenministerkonferenz in Genf wird vereinbart.',
        w: { usa: 4, sowjet: 8, flucht: 8 }, setze: ['berlinkrise'] },
      { text: 'Über ganz Deutschland verhandeln wollen – nicht nur über Berlin.',
        ergebnis: 'Die Westmächte nehmen den Gedanken auf. Moskau ist zu einer Außenministerkonferenz bereit.',
        w: { einheit: 3, sowjet: 3, usa: -2, flucht: 8 }, setze: ['berlinkrise'] },
      { text: 'Über den Status einer Freien Stadt verhandeln.', richtung: 'ost',
        ergebnis: 'Die West-Berliner sind fassungslos. Willy Brandt, Regierender Bürgermeister, spricht von Verrat.',
        w: { usa: -10, sowjet: -8, ansehen: -6, flucht: 12 }, setze: ['berlinkrise', 'freistadt_verhandlung'] },
    ],
    historisch: 'Das Ultimatum vom 27. November 1958 eröffnete die zweite Berlinkrise. Die Westmächte lehnten ab, ließen das Ultimatum aber durch Verhandlungen auslaufen. Die Krise endete erst mit dem Mauerbau 1961.',
  },
];
