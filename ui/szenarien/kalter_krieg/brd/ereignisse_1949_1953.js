// Hauptereignisse Herbst 1949 bis Ende 1953
import { west, geteilt, adenauer, regiertMit, wahlIn, unionRegiert, spdRegiert, SPD_WAHLKAMPF } from './hilfen.js';

export default [
  // ------------------------------------------------------------------ 1949/II
  {
    id: 'regierung1949',
    titel: 'Die erste Bundesregierung',
    datum: '15. September 1949',
    ab: 1949.2, ordnung: 9,
    absender: 'Bundestag, Bonn',
    ascii: 'bundeshaus',
    text: `Der erste Deutsche Bundestag hat dich mit 202 von 402 Stimmen zum Bundeskanzler gewählt – mit genau einer Stimme Mehrheit, und das war deine eigene. Die Union ist mit 31 Prozent knapp stärkste Kraft vor der SPD Kurt Schumachers.

Auf der Rhöndorfer Konferenz im August hast du die Weichen gestellt, doch in der Partei gibt es Stimmen, vor allem aus den Sozialausschüssen und von Ministerpräsidenten wie Karl Arnold, die eine Große Koalition für richtig halten. Die SPD würde einer Westintegration ohne Einheitsvorbehalt aber nicht folgen.

Mit wem willst du regieren?`,
    optionen: [
      { text: 'Kleine Koalition aus Union, FDP und Deutscher Partei.', hist: true,
        ergebnis: 'Eine bürgerliche Koalition mit klarer Linie: Soziale Marktwirtschaft und Westbindung. Die SPD wird zur scharfen Opposition.',
        w: { koalition: 5, usa: 3 } },
      { text: 'Große Koalition mit der SPD.',
        ergebnis: 'Schumacher tritt nicht ins Kabinett ein, die SPD aber schon. Jede Entscheidung über Westbindung muss künftig mit ihr ausgehandelt werden.',
        w: { koalition: 10, einheit: 4, usa: -4, moskau: 3, ansehen: 2 },
        setze: ['grosse_koalition'],
        aktion: s => { s.regierung = ['Union', 'SPD']; } },
    ],
    historisch: 'Adenauer setzte sich in Rhöndorf (21. August 1949) gegen die Befürworter einer Großen Koalition durch und bildete eine Koalition aus CDU/CSU, FDP und DP. Bei der Kanzlerwahl am 15. September erhielt er 202 Stimmen – die absolute Mehrheit, einschließlich seiner eigenen.',
  },
  {
    id: 'petersberg',
    titel: 'Das Petersberger Abkommen',
    datum: '22. November 1949',
    ab: 1949.2, ordnung: 11,
    absender: 'Alliierte Hohe Kommission, Petersberg',
    text: `Die drei Hohen Kommissare McCloy, Robertson und François-Poncet bieten ein Geschäft an: Die Demontage deutscher Industrieanlagen wird weitgehend eingestellt, die Bundesrepublik darf Konsulate eröffnen und internationalen Organisationen beitreten. Im Gegenzug soll Bonn der Internationalen Ruhrbehörde beitreten, die die Kohle- und Stahlproduktion des Ruhrgebiets kontrolliert.

Für die SPD ist das Unterwerfung. Schumacher wird dir im Bundestag zurufen, du seist der „Bundeskanzler der Alliierten“. Für die Arbeiter in den Stahlwerken bedeutet das Ende der Demontage aber sichere Arbeitsplätze.`,
    optionen: [
      { text: 'Unterzeichnen – das Ende der Demontage ist jeden Preis wert.', hist: true, richtung: 'west',
        ergebnis: 'Die Demontagen hören auf. Im Bundestag kommt es zu einer der härtesten Debatten der jungen Republik; Schumacher wird für 20 Sitzungstage ausgeschlossen.',
        w: { souveraenitaet: 5, usa: 5, grossbritannien: 5, frankreich: 3, impuls: 1, ansehen: -1, koalition: -2 } },
      { text: 'Erst den Bundestag abstimmen lassen.',
        ergebnis: 'Das Parlament stimmt nach langer Debatte knapp zu. Die Alliierten haben ein paar Wochen weiter demontiert, die Opposition fühlt sich ernst genommen.',
        w: { souveraenitaet: 4, usa: 2, grossbritannien: 2, frankreich: 1, ansehen: 1 } },
      { text: 'Ablehnen – keine Kontrolle über die Ruhr.', richtung: 'ost',
        ergebnis: 'Die Hohen Kommissare sind verstimmt. In Duisburg und Salzgitter rücken die Demontagekolonnen wieder an.',
        w: { usa: -8, grossbritannien: -8, frankreich: -6, ansehen: 2, impuls: -1.5 }, setze: ['demontage'] },
    ],
    historisch: 'Adenauer unterzeichnete das Abkommen am 22. November 1949 ohne vorherige Zustimmung des Bundestages. In der Nachtsitzung vom 24./25. November rief Schumacher ihm „Bundeskanzler der Alliierten!“ zu und wurde dafür für 20 Sitzungstage ausgeschlossen.',
  },

  // ------------------------------------------------------------------ 1950/I
  {
    id: 'europarat',
    titel: 'Saarkonventionen und Europarat',
    datum: 'März 1950',
    ab: 1950.1, ordnung: 3,
    wenn: west,
    absender: 'Auswärtiges Referat im Kanzleramt',
    text: s => `Frankreich hat mit der Regierung des Saarlandes Konventionen geschlossen, die die wirtschaftliche Anbindung der Saar an Frankreich auf Dauer festschreiben. Gleichzeitig werden die Bundesrepublik und das Saarland eingeladen, als assoziierte Mitglieder dem neuen Europarat in Straßburg beizutreten.

Treten Bonn und Saarbrücken gleichzeitig bei, sieht das wie eine Anerkennung der Saar als eigener Staat aus. Bleibt Bonn draußen, verpasst es den ersten Platz an einem europäischen Tisch seit dem Krieg. ${spdRegiert(s) ? 'In der eigenen Partei und in Teilen der FDP gibt es Widerstand gegen den Beitritt.' : 'Die SPD und Teile der FDP lehnen den Beitritt ab.'}`,
    optionen: [
      { text: 'Beitreten – Europa ist wichtiger als Prinzipienstreit um die Saar.', hist: true, richtung: 'west',
        ergebnis: 'Der Bundestag stimmt dem Beitritt zu. In Straßburg sitzen erstmals wieder deutsche Abgeordnete neben ihren früheren Kriegsgegnern.',
        w: { europa: 6, frankreich: 4, grossbritannien: 3, ansehen: -1 }, setze: ['europarat'] },
      { text: 'Beitreten, aber mit einer scharfen Rechtsverwahrung zur Saar.',
        ergebnis: 'Paris nimmt die Verwahrung kühl zur Kenntnis. Zu Hause gilt Bonn als standfest.',
        w: { europa: 5, frankreich: 1, ansehen: 1 }, setze: ['europarat'] },
      { text: 'Fernbleiben, solange die Saar wie ein Staat behandelt wird.',
        ergebnis: 'Der Europarat tagt ohne Deutsche. In Paris sehen sich die Skeptiker bestätigt.',
        w: { europa: -3, frankreich: -6, ansehen: 2 } },
    ],
    historisch: 'Die Saarkonventionen wurden am 3. März 1950 unterzeichnet. Trotz heftiger Kritik setzte Adenauer den Beitritt zum Europarat durch; der Bundestag stimmte im Juni 1950 zu, und die Bundesrepublik wurde im Juli assoziiertes, 1951 Vollmitglied.',
  },
  {
    id: 'schuman',
    titel: 'Der Schuman-Plan',
    datum: '9. Mai 1950',
    ab: 1950.1, ordnung: 5,
    wenn: west,
    absender: 'Robert Schuman, Außenminister der Französischen Republik',
    text: s => `Ein Bote überbringt dir einen persönlichen Brief des französischen Außenministers, noch bevor das französische Kabinett davon erfährt. Schuman schlägt vor, die gesamte deutsche und französische Kohle- und Stahlproduktion einer gemeinsamen Hohen Behörde zu unterstellen, offen für weitere Länder. Krieg zwischen beiden Ländern solle dadurch „nicht nur undenkbar, sondern materiell unmöglich“ werden.

Für die deutsche Schwerindustrie heißt das Abgabe von Souveränität – aber zum ersten Mal auf Augenhöhe, nicht als Besiegte. Die Ruhrbehörde würde überflüssig. ${spdRegiert(s) ? 'In der eigenen Partei warnen viele' : 'Die SPD warnt'} vor einem „kleineuropäischen, klerikalen, kapitalistischen“ Block, der die Teilung vertieft.`,
    optionen: [
      { text: 'Sofort und vorbehaltlos zustimmen.', hist: true, richtung: 'west',
        ergebnis: 'Bonn antwortet noch am selben Tag. Jean Monnet beginnt mit den Verhandlungen; Italien und die Benelux-Staaten schließen sich an.',
        w: { europa: 12, frankreich: 12, usa: 5, souveraenitaet: 3, moskau: -2, einheit: -2 }, setze: ['schuman'] },
      { text: 'Grundsätzlich zustimmen, aber hart über die Bedingungen verhandeln.',
        ergebnis: 'Die Verhandlungen ziehen sich. Die Industrie ist zufriedener, Paris etwas weniger.',
        w: { europa: 8, frankreich: 5, usa: 2, souveraenitaet: 2, impuls: 0.3 }, setze: ['schuman'] },
      { text: 'Ablehnen – keine europäische Integration vor der Einheit.', richtung: 'ost',
        ergebnis: 'Schuman ist enttäuscht, Monnet sucht andere Wege. Die Ruhrbehörde bleibt.',
        w: { europa: -5, frankreich: -12, usa: -6, einheit: 3, ansehen: 1 } },
    ],
    historisch: 'Adenauer stimmte dem Plan noch am 9. Mai 1950 zu, nachdem Schuman ihn vorab vertraulich informiert hatte. Daraus entstand die Europäische Gemeinschaft für Kohle und Stahl (Montanunion).',
  },

  // ------------------------------------------------------------------ 1950/II
  {
    id: 'korea',
    titel: 'Krieg in Korea – das Sicherheitsmemorandum',
    datum: 'August 1950',
    ab: 1950.2, ordnung: 8,
    wenn: west,
    absender: 'Gerhard Graf von Schwerin, Berater für Sicherheitsfragen',
    ascii: 'korea',
    text: s => `Am 25. Juni haben nordkoreanische Truppen die Grenze zum Süden überschritten. In der Bundesrepublik geht die Angst um: Was in Korea geschieht, könnte morgen an der Elbe geschehen. Die kasernierte Volkspolizei der DDR umfasst bereits rund 50.000 Mann, die Bundesrepublik hat keine eigenen Streitkräfte.

Die Amerikaner fragen inzwischen offen nach einem deutschen Verteidigungsbeitrag. Du könntest ihn in einem Memorandum an die Hohen Kommissare anbieten – gegen mehr Gleichberechtigung. Das Kabinett weiß noch nichts davon. ${unionRegiert(s) ? 'Innenminister Heinemann und große Teile der evangelischen Kirche lehnen' : 'Die eigene Partei und große Teile der evangelischen Kirche lehnen'} jede Wiederbewaffnung ab; unter jungen Leuten macht das Wort „Ohne mich“ die Runde.`,
    optionen: [
      { text: 'Einen deutschen Wehrbeitrag anbieten, ohne das Kabinett zu fragen.', hist: true, richtung: 'west',
        ergebnis: 'Das Memorandum des Kanzlers vom 29. August liegt in Washington auf dem Tisch. Die Westmächte beginnen, über deutsche Soldaten zu reden – und über das Ende des Besatzungsstatuts.',
        w: { usa: 10, grossbritannien: 3, frankreich: -4, souveraenitaet: 4, moskau: -6, einheit: -5, ansehen: -2, koalition: -3 },
        setze: ['wehrbeitrag'] },
      { text: 'Nur eine Bundespolizei zum Schutz der Grenzen fordern.',
        ergebnis: 'Die Hohen Kommissare reagieren zurückhaltend. Eine Polizei ist besser als nichts, eine Armee ist sie nicht.',
        w: { usa: 3, moskau: -2, ansehen: 1 }, setze: ['bundespolizei'] },
      { text: 'Keine deutsche Beteiligung – die Sicherheit ist Sache der Besatzungsmächte.', richtung: 'ost',
        ergebnis: s => `${spdRegiert(s) ? 'Die eigene Partei' : 'Die SPD'} und die Kirchen loben die Zurückhaltung des Kanzlers. In Washington wird man ungeduldig.`,
        w: { usa: -8, einheit: 3, moskau: 3, ansehen: 2 } },
    ],
    historisch: 'Adenauer übergab am 29. August 1950 zwei Memoranden an die Hohen Kommissare, in denen er einen Wehrbeitrag anbot und eine Revision des Besatzungsstatuts forderte. Das Kabinett war nicht eingeweiht. Der Korea-Krieg löste zugleich den „Korea-Boom“ der deutschen Exportwirtschaft aus.',
  },
  {
    id: 'heinemann',
    titel: 'Der Innenminister tritt zurück',
    datum: 'Oktober 1950',
    ab: 1950.2, ordnung: 10,
    wenn: s => !!s.f.wehrbeitrag && unionRegiert(s),
    absender: 'Gustav Heinemann, Bundesminister des Innern',
    text: `Gustav Heinemann, Präses der Synode der Evangelischen Kirche und dein Innenminister, hat aus der Zeitung von deinem Sicherheitsmemorandum erfahren. Er hält eine Wiederbewaffnung für falsch, solange sie die Teilung Deutschlands vertieft, und er empört sich über deinen Alleingang. Sein Rücktrittsgesuch liegt auf deinem Tisch.

Heinemann ist einer der wenigen prominenten Protestanten in der Union. Lässt du ihn gehen, verliert die Partei an Rückhalt im evangelischen Norden. Hältst du ihn, musst du künftig das Kabinett einbinden.`,
    optionen: [
      { text: 'Das Gesuch annehmen.', hist: true,
        ergebnis: 'Heinemann scheidet aus. Er wird später eine eigene Partei gegen die Wiederbewaffnung gründen. Die Regierungslinie ist klar, der Preis ist sichtbar.',
        w: { ansehen: -2, usa: 2 }, setze: ['heinemann_weg'] },
      { text: 'Heinemann halten und künftig das Kabinett vorab einbinden.',
        ergebnis: 'Heinemann bleibt. Die Verhandlungen über einen Wehrbeitrag werden langsamer und vorsichtiger.',
        w: { ansehen: 2, koalition: 3, usa: -3, souveraenitaet: -1 } },
    ],
    historisch: 'Heinemann reichte am 31. August 1950 seinen Rücktritt ein und schied am 9. Oktober aus dem Amt. 1952 gründete er die Gesamtdeutsche Volkspartei, später ging er zur SPD und wurde 1969 Bundespräsident.',
  },
  {
    id: 'pleven',
    titel: 'Der Pleven-Plan',
    datum: '24. Oktober 1950',
    ab: 1950.2, ordnung: 10.5,
    wenn: s => west(s) && (s.f.wehrbeitrag || s.f.bundespolizei),
    absender: 'Botschaft in Paris (Generalkonsulat)',
    text: `Frankreich will deutsche Soldaten nur unter einer Bedingung: in einer europäischen Armee, unter europäischem Kommando, in möglichst kleinen Einheiten. Ministerpräsident René Pleven hat einen entsprechenden Plan vorgelegt. Einen deutschen Generalstab oder ein deutsches Verteidigungsministerium soll es nicht geben.

Das ist weniger als Gleichberechtigung – aber es wäre ein Weg, den Wehrbeitrag mit der europäischen Einigung zu verbinden.`,
    optionen: [
      { text: 'Den Plan unterstützen und auf Gleichberechtigung im Detail hinarbeiten.', hist: true, richtung: 'west',
        ergebnis: 'In Paris beginnen die Verhandlungen über eine Europäische Verteidigungsgemeinschaft. Die deutsche Delegation verhandelt zäh über jede Diskriminierung.',
        w: { frankreich: 6, europa: 5, usa: 2 }, setze: ['evg_verhandlung'] },
      { text: 'Volle Gleichberechtigung zur Vorbedingung machen.',
        ergebnis: 'Paris ist pikiert, Washington aber versteht das Bonner Anliegen.',
        w: { frankreich: -5, souveraenitaet: 2, usa: 1, ansehen: 1 }, setze: ['evg_verhandlung'] },
    ],
    historisch: 'Der Pleven-Plan führte zu den Verhandlungen über die Europäische Verteidigungsgemeinschaft (EVG). Die Bundesrepublik nahm ab Februar 1951 an den Pariser Gesprächen teil und erreichte schrittweise mehr Gleichberechtigung.',
  },

  // ------------------------------------------------------------------ 1951/I
  {
    id: 'mitbestimmung',
    titel: 'Streikdrohung an Rhein und Ruhr',
    datum: 'Januar 1951',
    ab: 1951.1, ordnung: 1,
    absender: 'Hans Böckler, Vorsitzender des DGB',
    text: `Die IG Metall und die IG Bergbau haben ihre Mitglieder abstimmen lassen: Über 90 Prozent sind bereit zu streiken, falls die paritätische Mitbestimmung in der Montanindustrie, die die Briten nach dem Krieg eingeführt haben, gesetzlich abgeschafft oder verwässert wird.

Der 75-jährige Hans Böckler bittet dich um ein persönliches Gespräch. Die FDP und die Arbeitgeber halten die Mitbestimmung für einen Angriff auf das Eigentum und befürchten einen Präzedenzfall für alle Branchen.`,
    optionen: [
      { text: 'Mit Böckler einen Kompromiss schließen: Mitbestimmung für Kohle und Stahl.', hist: true,
        ergebnis: 'Der Streik ist abgewendet. Die Gewerkschaften akzeptieren im Gegenzug stillschweigend den Westkurs der Regierung. Die FDP ist verärgert.',
        w: { ansehen: 3, koalition: -5, impuls: 0.3 }, setze: ['mitbestimmung'] },
      { text: 'Hart bleiben – der Staat lässt sich nicht erpressen.',
        zufall: [
          { p: 0.6, ergebnis: 'Die Hütten stehen wochenlang still. Die Produktion bricht ein, und am Ende muss der Bund doch nachgeben.',
            w: { impuls: -2.5, ansehen: -4, koalition: 2 }, setze: ['mitbestimmung'] },
          { ergebnis: 'Die Gewerkschaften schrecken vor einem politischen Streik zurück. Die Arbeitgeber jubeln, die Arbeiter vergessen es nicht.',
            w: { impuls: -0.5, ansehen: -2, koalition: 6 } },
        ] },
    ],
    historisch: 'Am 25. Januar 1951 einigten sich Adenauer und Böckler auf die paritätische Mitbestimmung in der Montanindustrie. Böckler starb drei Wochen später. Das Montan-Mitbestimmungsgesetz wurde im April 1951 mit Stimmen von SPD und Union verabschiedet.',
  },
  {
    id: 'zahlungsbilanz',
    titel: 'Die Zahlungsbilanzkrise',
    datum: 'Februar 1951',
    ab: 1951.1, ordnung: 2,
    absender: s => (unionRegiert(s) ? 'Ludwig Erhard, Bundesminister für Wirtschaft' : 'Bundesministerium für Wirtschaft'),
    text: s => `Der Korea-Boom hat eine Kehrseite: Die Industrie importiert Rohstoffe in Massen, die Preise steigen, und die Bundesrepublik hat ihre Kreditlinie bei der Europäischen Zahlungsunion überzogen. Die Devisenreserven sind praktisch erschöpft. Die amerikanische Marshallplan-Verwaltung verlangt, die Liberalisierung der Einfuhren auszusetzen, und manche fordern die Rückkehr zur Bewirtschaftung von Rohstoffen.

${unionRegiert(s) ? 'Erhard hält das für den Anfang vom Ende der Marktwirtschaft. Die Industrie verlangt Planung, die SPD erst recht.' : 'Die Gewerkschaften und viele in der eigenen Partei halten das für richtig, Union und FDP sprechen vom Rückfall in die Planwirtschaft.'}`,
    optionen: [
      { text: 'Die Einfuhrliberalisierung vorübergehend aussetzen und einen Kredit der Zahlungsunion annehmen.', hist: true,
        ergebnis: 'Die Bank deutscher Länder bremst den Kredit. Nach wenigen Monaten dreht die Handelsbilanz ins Plus – für Jahrzehnte.',
        w: { usa: 2, europa: 2, impuls: -0.5, haushalt: 2 } },
      { text: 'Rohstoffe wieder staatlich bewirtschaften.',
        ergebnis: s => (unionRegiert(s) ? 'Ämter verteilen Kontingente. Erhard droht mit Rücktritt, die Wirtschaft verliert Schwung.' : 'Ämter verteilen Kontingente. Die FDP protestiert, die Wirtschaft verliert Schwung.'),
        w: { impuls: -1.5, koalition: -6, ansehen: 1 } },
      { text: 'An der Liberalisierung festhalten und abwarten.',
        zufall: [
          { p: 0.5, ergebnis: s => (unionRegiert(s) ? 'Es geht gut: Die Exporte ziehen rechtzeitig an. Erhard ist ein Held.' : 'Es geht gut: Die Exporte ziehen rechtzeitig an. Die Regierung hat Nerven bewiesen.'), w: { impuls: 1, ansehen: 2 } },
          { ergebnis: 'Die Zahlungsunion sperrt weitere Kredite. Die Einfuhren müssen abrupt gestoppt werden.', w: { impuls: -2, usa: -3, europa: -2, ansehen: -2 } },
        ] },
    ],
    historisch: 'Die Bundesrepublik setzte im Februar 1951 die Einfuhrliberalisierung aus und erhielt einen Sonderkredit der EZU. Ab Mitte 1951 erzielte sie dauerhafte Exportüberschüsse; die Bewirtschaftung wurde nicht wieder eingeführt.',
  },
  {
    id: 'montanunion',
    titel: 'Unterzeichnung der Montanunion',
    datum: '18. April 1951',
    ab: 1951.1, ordnung: 4,
    wenn: s => west(s) && !!s.f.schuman,
    absender: 'Delegation Walter Hallstein, Paris',
    text: s => `Der Vertrag über die Europäische Gemeinschaft für Kohle und Stahl ist ausgehandelt. Sechs Staaten – Frankreich, die Bundesrepublik, Italien und die Benelux-Länder – unterstellen ihre Montanindustrie einer Hohen Behörde. Die Ruhrbehörde wird aufgelöst, die Produktionsbeschränkungen für deutschen Stahl fallen.

Es ist der erste Vertrag, den die Bundesrepublik als gleichberechtigter Partner unterzeichnet. ${spdRegiert(s) ? 'Ein Teil der eigenen Fraktion wird im Bundestag dagegen stimmen.' : 'Die SPD wird im Bundestag dagegen stimmen.'}`,
    optionen: [
      { text: 'Den Vertrag in Paris selbst unterzeichnen.', hist: true, richtung: 'west',
        ergebnis: 'Der Kanzler reist zum ersten Mal als Regierungschef nach Paris. Die Montanunion tritt 1952 in Kraft.',
        w: { europa: 10, frankreich: 6, souveraenitaet: 5, usa: 3, impuls: 0.5, moskau: -2 }, setze: ['montanunion'] },
      { text: 'Nachverhandeln: Die Entflechtung der Ruhrkonzerne darf nicht Teil des Pakets sein.',
        zufall: [
          { p: 0.5, ergebnis: 'Paris gibt in einigen Punkten nach. Der Vertrag wird ein paar Monate später unterzeichnet.',
            w: { europa: 8, frankreich: 2, souveraenitaet: 4, impuls: 0.8 }, setze: ['montanunion'] },
          { ergebnis: 'Die Verhandlungen geraten in eine Sackgasse. Monnet ist frustriert, der Vertrag verzögert sich um ein Jahr.',
            w: { europa: 3, frankreich: -6, usa: -2 }, plane: [{ id: 'montanunion_spaet', in: 2 }] },
        ] },
    ],
    historisch: 'Adenauer unterzeichnete den EGKS-Vertrag am 18. April 1951 in Paris; es war seine erste Auslandsreise als Kanzler. Die Alliierten hatten die Entflechtung der Ruhrkonzerne zur Bedingung gemacht.',
  },
  {
    id: 'montanunion_spaet',
    titel: 'Montanunion – zweiter Anlauf',
    datum: 'Frühjahr 1952',
    nurGeplant: true, ordnung: 3,
    wenn: west,
    absender: 'Delegation Walter Hallstein, Paris',
    text: `Ein Jahr später als geplant liegt der Vertrag über die Montanunion wieder unterschriftsreif auf dem Tisch. Paris hat seine Forderungen kaum abgeschwächt.`,
    optionen: [
      { text: 'Jetzt unterzeichnen.', richtung: 'west',
        ergebnis: 'Die Montanunion entsteht, mit einem Jahr Verspätung.',
        w: { europa: 8, frankreich: 4, souveraenitaet: 4, moskau: -2 }, setze: ['montanunion'] },
      { text: 'Das Projekt beerdigen.',
        ergebnis: 'Die Ruhrbehörde bleibt. Frankreich sucht andere Partner, Europa wartet.',
        w: { europa: -6, frankreich: -8, usa: -3 } },
    ],
  },

  // ------------------------------------------------------------------ 1951/II
  {
    id: 'wiedergutmachung',
    titel: 'Ein Wort an Israel',
    datum: 'September 1951',
    ab: 1951.2, ordnung: 9,
    absender: 'Herbert Blankenhorn, Kanzleramt',
    text: `Über diskrete Kanäle hat die israelische Regierung wissen lassen: Gespräche über Wiedergutmachung seien möglich, aber nur, wenn die Bundesregierung vorher öffentlich und ohne Ausflüchte die Verantwortung für die Verbrechen an den Juden anerkennt und ihre Bereitschaft zu Leistungen erklärt.

In der eigenen Fraktion gibt es Widerstand. Viele meinen, die Bundesrepublik habe genug eigene Not mit Millionen Vertriebenen. Umfragen zeigen, dass eine Mehrheit der Westdeutschen Zahlungen an Israel ablehnt.`,
    optionen: [
      { text: 'Im Bundestag eine feierliche Regierungserklärung abgeben.', hist: true,
        ergebnis: 'Der Bundestag erhebt sich zu einer Schweigeminute. In Jerusalem ist der Weg zu Verhandlungen frei – unter heftigem Protest auch in Israel.',
        w: { usa: 5, grossbritannien: 3, frankreich: 2, ansehen: -1 }, setze: ['wiedergutmachung_erklaert'] },
      { text: 'Die Frage auf die Zeit nach einem Friedensvertrag verschieben.',
        ergebnis: 'Die Amerikaner nehmen es mit Befremden zur Kenntnis. Die Gelegenheit ist vertan.',
        w: { usa: -5, grossbritannien: -3, ansehen: 1 } },
    ],
    historisch: 'Am 27. September 1951 erklärte Adenauer im Bundestag, „im Namen des deutschen Volkes“ seien „unsagbare Verbrechen begangen worden, die zur moralischen und materiellen Wiedergutmachung verpflichten“. Damit begannen die Verhandlungen mit Israel und der Jewish Claims Conference.',
  },

  // ------------------------------------------------------------------ 1952/I
  {
    id: 'stalin_note',
    titel: 'Die Stalin-Note',
    datum: '10. März 1952',
    ab: 1952.1, ordnung: 3,
    wenn: west,
    absender: 'Note der Sowjetregierung an die Westmächte',
    ascii: 'note',
    text: s => `Moskau hat den drei Westmächten den Entwurf eines Friedensvertrages mit Deutschland übermittelt. Der Inhalt ist sensationell: Ein wiedervereinigtes Deutschland, alle Besatzungstruppen raus binnen eines Jahres, eigene nationale Streitkräfte, freie Betätigung demokratischer Parteien. Bedingungen: Deutschland darf keinem Bündnis beitreten, das sich gegen einen der Siegerstaaten richtet, und die Grenzen von Potsdam – die Oder-Neiße-Linie – werden anerkannt.

Von freien, international überwachten Wahlen ist keine Rede. Die Note kommt genau in dem Moment, in dem der Deutschlandvertrag und der EVG-Vertrag unterschriftsreif sind.

Ist es ein ernstes Angebot oder ein Störmanöver gegen die Westintegration? ${spdRegiert(s) ? 'In der Bevölkerung, in deiner Partei und in Teilen der FDP gibt es Stimmen, die verlangen, das Angebot wenigstens auszuloten. Die Union warnt vor der Falle.' : 'In der Bevölkerung, bei der SPD, in Teilen der FDP und sogar in deinem Kabinett gibt es Stimmen, die verlangen, das Angebot wenigstens auszuloten.'}`,
    optionen: [
      { text: 'Als Störmanöver behandeln. Die Westverträge haben Vorrang.', hist: true, richtung: 'west',
        ergebnis: 'Die Westmächte antworten mit der Forderung nach freien Wahlen unter UN-Aufsicht. Ein Notenwechsel folgt, ohne Annäherung. Die Westverträge können unterzeichnet werden.',
        w: { usa: 8, frankreich: 3, grossbritannien: 4, einheit: -8, moskau: -4, ansehen: -1 }, setze: ['stalin_abgelehnt'] },
      { text: 'Ernsthaft prüfen: von den Westmächten eine Viermächtekonferenz über freie Wahlen verlangen.', richtung: 'ost',
        ergebnis: 'Die Westverträge werden vorerst nicht unterzeichnet. Washington ist irritiert, London vorsichtig interessiert. Auf Bonner Druck hin wird eine Viermächtekonferenz vorbereitet.',
        w: { usa: -7, grossbritannien: -2, frankreich: -2, einheit: 12, moskau: 8, ansehen: 3 },
        setze: ['stalin_geprueft'], plane: [{ id: 'n_viermaechte', in: 1 }] },
      { text: 'Auf das Angebot eingehen: Neutralität für die Einheit.', richtung: 'ost',
        ergebnis: s => `Ein Beben in der westlichen Welt. In Washington spricht man vom „Verrat von Bonn“, ${spdRegiert(s) ? 'die Union spricht von einem zweiten Rapallo' : 'die CSU droht mit dem Bruch'}. Doch die Viermächtekonferenz kommt.`,
        w: { usa: -18, grossbritannien: -10, frankreich: -6, einheit: 20, moskau: 14, koalition: -12, ansehen: 2 },
        setze: ['stalin_angenommen'], plane: [{ id: 'n_viermaechte', in: 1 }] },
    ],
    historisch: 'Adenauer hielt die Note für ein Störmanöver und drängte die Westmächte zu einer ablehnenden Antwort. Diese forderten am 25. März 1952 freie Wahlen unter UN-Aufsicht; nach drei weiteren Noten verlief der Austausch im Sande. Ob 1952 eine echte Chance zur Einheit bestand, ist bis heute umstritten („Legende von der verpassten Gelegenheit“). Die sowjetischen Akten deuten eher auf ein Störmanöver hin.',
  },
  {
    id: 'deutschlandvertrag',
    titel: 'Deutschlandvertrag und EVG-Vertrag',
    datum: s => (s.zeit < 1952.2 ? '26./27. Mai 1952' : 'Frühjahr 1953'),
    ab: 1952.1, bis: 1953.2, ordnung: 5,
    wenn: s => west(s) && (s.f.stalin_abgelehnt || s.f.chance_vertan),
    absender: 'Walter Hallstein, Staatssekretär des Auswärtigen Amtes',
    text: s => `Die Verträge sind unterschriftsreif. Der Deutschlandvertrag soll das Besatzungsstatut ablösen und der Bundesrepublik weitgehend die Souveränität zurückgeben; die Alliierten behalten Rechte für Berlin und Deutschland als Ganzes. Der Vertrag über die Europäische Verteidigungsgemeinschaft sieht deutsche Kontingente in einer europäischen Armee vor.

Umstritten ist die „Bindungsklausel“: Ein wiedervereinigtes Deutschland wäre an diese Verträge gebunden. ${spdRegiert(s) ? 'Für viele in deiner Partei ist das das Ende der Wiedervereinigung; auch die FDP verlangt Nachbesserungen.' : 'Für die SPD ist das das Ende der Wiedervereinigung; auch Heinrich von Brentano, Fraktionschef der Union, verlangt Nachbesserungen.'}${s.f.chance_vertan ? '\n\nNach dem Scheitern der Viermächtekonferenz drängen die Westmächte nun auf die Unterschrift.' : ''}`,
    optionen: [
      { text: 'Unterzeichnen, wie ausgehandelt.', hist: true, richtung: 'west',
        ergebnis: 'In Bonn und Paris werden die Verträge unterzeichnet. Die Ratifizierung im Bundestag wird zur Zerreißprobe, aber sie gelingt. Nun hängt alles an Paris.',
        w: { souveraenitaet: 8, usa: 7, grossbritannien: 4, frankreich: 3, moskau: -6, einheit: -6, europa: 5 },
        setze: ['westvertraege'] },
      { text: 'Die Bindungsklausel streichen lassen, dann unterzeichnen.',
        zufall: [
          { p: s => 0.4 + (s.w.usa - 50) / 200, ergebnis: 'Acheson und Eden lenken ein: Die Klausel wird abgeschwächt. Ein Erfolg, der in der Fraktion viel Ruhe bringt.',
            w: { souveraenitaet: 8, usa: 4, frankreich: 1, moskau: -6, einheit: -2, europa: 4, koalition: 4 }, setze: ['westvertraege'] },
          { ergebnis: 'Die Westmächte bleiben hart. Nach wochenlanger Verzögerung unterschreibt Bonn doch, mit Ansehensverlust.',
            w: { souveraenitaet: 6, usa: 2, moskau: -7, einheit: -5, europa: 4, ansehen: -2 }, setze: ['westvertraege'] },
        ] },
      { text: 'Die Verträge nicht unterzeichnen.', richtung: 'ost',
        ergebnis: 'Ein Affront gegenüber allen drei Westmächten. Das Besatzungsstatut bleibt in Kraft.',
        w: { usa: -15, grossbritannien: -10, frankreich: -8, einheit: 4, moskau: 4, ansehen: -2 }, setze: ['westvertraege_abgelehnt'] },
    ],
    historisch: 'Der Deutschlandvertrag wurde am 26. Mai 1952 in Bonn, der EVG-Vertrag am 27. Mai in Paris unterzeichnet. Die Bindungsklausel wurde auf deutschen Druck noch abgeschwächt. Der Bundestag ratifizierte beide Verträge im März 1953.',
  },

  // ------------------------------------------------------------------ 1952/II
  {
    id: 'luxemburg',
    titel: 'Das Luxemburger Abkommen',
    datum: '10. September 1952',
    ab: 1952.2, ordnung: 9,
    absender: 'Franz Böhm, Leiter der Delegation in Wassenaar',
    text: s => `Nach monatelangen Verhandlungen in Wassenaar liegt ein Abkommen vor: Die Bundesrepublik soll Israel über zwölf Jahre Waren und Leistungen im Wert von drei Milliarden DM liefern und der Jewish Claims Conference 450 Millionen DM zahlen.${s.f.wiedergutmachung_erklaert ? '' : ' Die Verhandlungen sind ohne eine vorherige feierliche Erklärung zustande gekommen und standen mehrfach vor dem Abbruch.'}

${unionRegiert(s) ? 'Finanzminister Schäffer hält die Summe für untragbar, die Arabische Liga droht mit einem Boykott deutscher Waren. In der Union ist eine Mehrheit ablehnend oder gleichgültig. Die SPD unter Ollenhauer steht geschlossen hinter dem Abkommen.' : 'Der Finanzminister hält die Summe für kaum tragbar, die Arabische Liga droht mit einem Boykott deutscher Waren. Deine Partei steht geschlossen hinter dem Abkommen, in der Union ist eine Mehrheit ablehnend oder gleichgültig.'}`,
    optionen: [
      { text: s => (unionRegiert(s) ? 'Unterzeichnen und die Ratifizierung notfalls mit den Stimmen der SPD durchsetzen.' : 'Unterzeichnen und die Ratifizierung auch gegen Widerstand im Bundestag durchsetzen.'), hist: true,
        ergebnis: s => (unionRegiert(s) ? 'Der Kanzler unterschreibt in Luxemburg zusammen mit Moshe Sharett. Bei der Abstimmung im Bundestag enthält sich fast die Hälfte der Union; die SPD-Stimmen sichern die Mehrheit. Der Boykott der Arabischen Liga bleibt aus.' : 'Der Kanzler unterschreibt in Luxemburg zusammen mit Moshe Sharett. Bei der Abstimmung im Bundestag stimmt die Regierungsmehrheit geschlossen zu, die Union ist gespalten. Der Boykott der Arabischen Liga bleibt aus.'),
        w: { usa: 6, grossbritannien: 3, frankreich: 2, haushalt: -6, ansehen: -1, koalition: -3 }, setze: ['luxemburger_abkommen'] },
      { text: 'Die Summe deutlich kürzen.',
        ergebnis: 'Die israelische Delegation reist ab und kehrt erst nach amerikanischer Vermittlung zurück. Das Abkommen kommt kleiner und mit bitterem Nachgeschmack zustande.',
        w: { usa: -2, haushalt: -3, ansehen: 1 }, setze: ['luxemburger_abkommen'] },
      { text: 'Das Abkommen nicht unterzeichnen.',
        ergebnis: 'Ein schwerer Rückschlag für das Ansehen der Bundesrepublik in der westlichen Welt.',
        w: { usa: -12, grossbritannien: -6, frankreich: -4, ansehen: 1 } },
    ],
    historisch: 'Das Abkommen wurde am 10. September 1952 unterzeichnet. Bei der Ratifizierung am 18. März 1953 stimmten 239 Abgeordnete dafür, 35 dagegen, 86 enthielten sich; fast die Hälfte der Unionsfraktion stimmte nicht zu, die SPD dagegen geschlossen mit Ja.',
  },

  // ------------------------------------------------------------------ 1953/I
  {
    id: 'schuldenabkommen',
    titel: 'Das Londoner Schuldenabkommen',
    datum: '27. Februar 1953',
    ab: 1953.1, ordnung: 2,
    absender: 'Hermann Josef Abs, Leiter der Delegation in London',
    text: `Seit über einem Jahr verhandelt Hermann Josef Abs in London über die deutschen Auslandsschulden aus der Vorkriegszeit und der Nachkriegshilfe. Das Ergebnis: Die Gläubiger verzichten auf rund die Hälfte. Der Rest soll über Jahrzehnte aus Exportüberschüssen bezahlt werden, Reparationsfragen werden bis zu einem Friedensvertrag zurückgestellt.

Die Bundesrepublik würde damit wieder kreditwürdig. Einzelne Gläubiger, vor allem in der Schweiz und den Niederlanden, sind unzufrieden; manche in Bonn meinen, man könnte noch mehr herausholen.`,
    optionen: [
      { text: 'Annehmen.', hist: true,
        ergebnis: 'Die Bundesrepublik kehrt auf die internationalen Finanzmärkte zurück. Die Schuldenlast ist tragbar.',
        w: { haushalt: 6, usa: 4, grossbritannien: 4, souveraenitaet: 3, impuls: 1 } },
      { text: 'Weiter verhandeln und auf einen größeren Nachlass setzen.',
        zufall: [
          { p: 0.35, ergebnis: 'Abs holt tatsächlich noch etwas heraus. Die Gläubiger sind verstimmt, aber sie unterschreiben.',
            w: { haushalt: 9, usa: 1, grossbritannien: -2, souveraenitaet: 3, impuls: 1 } },
          { ergebnis: 'Die Verhandlungen platzen beinahe. Nach Monaten kommt ein Abkommen zu schlechteren Bedingungen.',
            w: { haushalt: 3, usa: -3, grossbritannien: -4, souveraenitaet: 2 } },
        ] },
    ],
    historisch: 'Das Abkommen wurde am 27. Februar 1953 unterzeichnet. Die Schulden wurden von rund 30 auf etwa 14 Milliarden DM reduziert, Reparationen bis zu einem Friedensvertrag ausgesetzt. Die letzte Rate wurde 2010 bezahlt.',
  },
  {
    id: 'stalins_tod',
    titel: 'Stalin ist tot',
    datum: 'März bis Mai 1953',
    ab: 1953.1, ordnung: 3,
    wenn: west,
    absender: 'Auswärtiges Amt, Länderreferat Sowjetunion',
    text: `Am 5. März ist Josef Stalin gestorben. In Moskau regiert eine kollektive Führung aus Malenkow, Berija und Molotow; aus dem Kreml kommen ungewohnt versöhnliche Töne.

Der britische Premierminister Winston Churchill schlägt im Unterhaus eine Gipfelkonferenz der Großmächte vor, ohne feste Tagesordnung. Für dich ist das eine Gefahr: Die Großmächte könnten sich über Deutschland verständigen, bevor die Westverträge in Kraft sind – im schlimmsten Fall auf eine Neutralisierung.`,
    optionen: [
      { text: 'In London und Washington gegen Churchills Vorstoß intervenieren.', hist: true, richtung: 'west',
        ergebnis: 'Eisenhower und Dulles teilen die Bonner Bedenken. Churchill ist verärgert, der Gipfel kommt nicht zustande.',
        w: { usa: 4, grossbritannien: -5, einheit: -3, moskau: -2 } },
      { text: 'Churchill unterstützen: Ein Gespräch der Großmächte kann nur nützen.', richtung: 'ost',
        ergebnis: 'Churchill ist entzückt, Dulles besorgt. Die Westverträge geraten in Frankreich weiter ins Stocken.',
        w: { grossbritannien: 6, usa: -5, frankreich: -1, einheit: 5, moskau: 5 } },
      { text: 'Abwarten und schweigen.',
        ergebnis: 'Die Initiative verläuft im Sande. Niemand hat die Haltung Bonns bemerkt.',
        w: {} },
    ],
    historisch: 'Churchill schlug am 11. Mai 1953 eine Gipfelkonferenz vor. Adenauer hielt das für gefährlich und arbeitete in Washington dagegen; auch Eisenhower und Dulles waren skeptisch.',
  },
  {
    id: 'amerikareise',
    titel: 'Die erste Reise nach Amerika',
    datum: 'April 1953',
    ab: 1953.1, ordnung: 4,
    wenn: west,
    absender: 'Protokoll des Auswärtigen Amtes',
    ascii: 'schiff',
    text: `Präsident Eisenhower hat dich nach Washington eingeladen – der erste offizielle Besuch eines deutschen Regierungschefs in den Vereinigten Staaten. Die Reise wird Wochenschau und Zeitungen über Wochen beschäftigen.

Was soll im Mittelpunkt stehen? Das Protokoll schlägt eine Kranzniederlegung auf dem Nationalfriedhof Arlington vor. Die Vertriebenenverbände und Teile der Koalition drängen dich, auch die Freilassung deutscher Kriegsverurteilter aus alliierten Gefängnissen anzusprechen.`,
    optionen: [
      { text: 'Versöhnung und Partnerschaft betonen – Arlington, Wirtschaft, Sicherheit.', hist: true,
        ergebnis: 'Die Bilder aus Arlington gehen um die Welt. Die Bundesrepublik ist in Amerika angekommen. Zu Hause steigt das Ansehen des Kanzlers.',
        w: { usa: 6, ansehen: 3 } },
      { text: 'Die Freilassung der Kriegsverurteilten in den Vordergrund stellen.',
        ergebnis: 'Die Vertriebenenverbände sind zufrieden. Die amerikanische Presse reagiert kühl.',
        w: { usa: -4, ansehen: 2, koalition: 3 } },
    ],
    historisch: 'Adenauer reiste im April 1953 in die USA. Die Kranzniederlegung in Arlington und der triumphale Empfang trugen erheblich zum Wahlsieg im September bei.',
  },
  {
    id: 'juni17',
    titel: 'Aufstand in der DDR',
    datum: '17. Juni 1953',
    ab: 1953.1, ordnung: 6,
    wenn: west,
    absender: 'Bundesministerium für gesamtdeutsche Fragen',
    ascii: 'aufstand',
    text: `In Ost-Berlin haben Bauarbeiter der Stalinallee gegen erhöhte Arbeitsnormen die Arbeit niedergelegt. Binnen eines Tages hat sich der Streik zu einem Aufstand in über 500 Orten der DDR ausgeweitet. Die Menschen fordern freie Wahlen und den Rücktritt der Regierung. Am Nachmittag rollen sowjetische Panzer, es gibt Tote.

Die Westmächte machen klar, dass sie nicht eingreifen werden. Der RIAS sendet Berichte in die DDR. Was sagt Bonn?`,
    optionen: [
      { text: 'Solidarität bekunden, zur Besonnenheit mahnen, den 17. Juni zum Gedenktag machen.', hist: true,
        ergebnis: 'Der Kanzler spricht auf der Trauerfeier in West-Berlin. Der 17. Juni wird „Tag der deutschen Einheit“. Die Fluchtbewegung schwillt an.',
        w: { ansehen: 3, moskau: -3, einheit: -2, flucht: 10 }, setze: ['tag_der_einheit'] },
      { text: 'Die Westmächte öffentlich zum Eingreifen auffordern.', richtung: 'west',
        ergebnis: 'Washington weist das Ansinnen kühl zurück. Moskau spricht von „westdeutschen Revanchisten“, die den Aufstand angestachelt hätten.',
        w: { moskau: -15, usa: -5, ansehen: 1, flucht: 12 } },
      { text: 'Schweigen und Moskau ein Gesprächsangebot machen.', richtung: 'ost',
        ergebnis: 'Viele im Westen verstehen die Bonner Zurückhaltung nicht. Moskau reagiert nicht.',
        w: { moskau: 3, ansehen: -5, einheit: 1, flucht: 6 } },
    ],
    historisch: 'Der Aufstand wurde von sowjetischen Truppen niedergeschlagen; mindestens 55 Menschen starben. Adenauer sprach am 23. Juni auf der Trauerfeier in West-Berlin. Der 17. Juni wurde per Gesetz zum gesetzlichen Feiertag „Tag der deutschen Einheit“.',
  },

  // ------------------------------------------------------------------ 1953/II
  {
    id: 'wahlkampf1953',
    titel: 'Wahlkampf 1953',
    datum: 'August 1953',
    ab: 1953.2, ordnung: 8,
    wenn: s => !s.f.neutral && wahlIn(s, 1953.2),
    absender: s => (spdRegiert(s) ? 'Parteivorstand der SPD' : 'Bundesgeschäftsstelle der CDU'),
    ascii: 'plakat',
    text: s => `Am 6. September wird der zweite Bundestag gewählt. Die ${spdRegiert(s) ? 'SPD' : 'Union'} liegt in den Umfragen bei ${String(s.w.zustimmung).replace('.', ',')} Prozent. Die Wirtschaft wächst mit ${String(s.w.wachstum).replace('.', ',')} Prozent, die Arbeitslosigkeit liegt bei ${String(s.w.arbeitslosigkeit).replace('.', ',')} Prozent.

Womit soll die ${spdRegiert(s) ? 'SPD' : 'Union'} in den Wahlkampf ziehen?`,
    optionen: s => (spdRegiert(s) ? SPD_WAHLKAMPF : [
      { text: '„Alle Wege des Marxismus führen nach Moskau“ – Sicherheit und Westbindung.', hist: true,
        ergebnis: 'Die Plakate sind drastisch, aber nach dem 17. Juni wirken sie.',
        w: s => ({ ansehen: s.w.moskau <= 45 ? 4 : 2, moskau: -2 }) },
      { text: 'Das Wirtschaftswunder: Erhard und die Soziale Marktwirtschaft.',
        ergebnis: 'Erhard tourt mit Zigarre durch die Marktplätze.',
        w: s => ({ ansehen: Math.max(0, Math.round(s.w.wachstum - 3)) }) },
      { text: 'Einheit in Freiheit – die Union als Partei der Wiedervereinigung.',
        ergebnis: 'Ein Wahlkampf, der vor allem Vertriebene und Protestanten anspricht.',
        w: s => ({ ansehen: Math.round(s.w.einheit / 10) + 1 }) },
    ]),
    historisch: 'Die Union gewann die Wahl am 6. September 1953 mit 45,2 Prozent deutlich. Das Plakat „Alle Wege des Marxismus führen nach Moskau“ wurde zu einem der bekanntesten Motive der Adenauer-Zeit.',
  },
];
