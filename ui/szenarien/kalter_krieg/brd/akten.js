// Akten: kleinere Briefe und Vorlagen, die zufällig auf dem Schreibtisch landen
import { west, geteilt, vereinigt, imBuendnis, adenauer, regiertMit, hauptstadt, unionRegiert } from './hilfen.js';

const akte = a => ({ art: 'akte', ...a });

export default [
  akte({
    id: 'a_hymne', titel: 'Eine Hymne für die Republik', ab: 1950.1, bis: 1952.1, ordnung: 4,
    absender: 'Theodor Heuss, Bundespräsident',
    text: 'Der Bundespräsident hat Rudolf Alexander Schröder um eine neue „Hymne an Deutschland“ gebeten und möchte auf das Deutschlandlied verzichten, das zu sehr mit der jüngsten Vergangenheit verbunden sei. Bei Sportveranstaltungen singt das Publikum dennoch Hoffmann von Fallerslebens Lied, oft sogar die erste Strophe.',
    optionen: [
      { text: 'Das Deutschlandlied mit der dritten Strophe vorschlagen.', hist: true, ergebnis: 'Heuss gibt in einem Briefwechsel nach. „Einigkeit und Recht und Freiheit“ wird zur Hymne.', w: { ansehen: 1 } },
      { text: 'Dem Bundespräsidenten folgen.', ergebnis: 'Die neue Hymne wird nie richtig populär.', w: { ansehen: -1, frankreich: 1 } },
    ],
    historisch: 'Im Briefwechsel zwischen Adenauer und Heuss vom April/Mai 1952 wurde das Deutschlandlied als Hymne anerkannt; bei staatlichen Anlässen sollte die dritte Strophe gesungen werden.',
  }),
  akte({
    id: 'a_charta', titel: 'Die Charta der Heimatvertriebenen', ab: 1950.2, bis: 1950.2, ordnung: 8,
    absender: 'Zentralverband der vertriebenen Deutschen',
    text: 'Die Vertriebenenverbände haben in Stuttgart eine Charta verkündet. Sie verzichten auf „Rache und Vergeltung“, fordern aber das „Recht auf Heimat“ und eine gerechte Verteilung der Kriegslasten. Sie bitten die Bundesregierung um öffentliche Unterstützung.',
    optionen: [
      { text: 'Die Charta ausdrücklich würdigen.', hist: true, ergebnis: 'Die Vertriebenen fühlen sich ernst genommen. In Warschau und Prag wird das „Recht auf Heimat“ mit Sorge gelesen.', w: { ansehen: 2, moskau: -2, koalition: 2 } },
      { text: 'Zurückhaltend reagieren.', ergebnis: 'Die Verbände sind enttäuscht.', w: { ansehen: -1, koalition: -2 } },
    ],
  }),
  akte({
    id: 'a_landsberg', titel: 'Gnade für Landsberg?', ab: 1950.2, bis: 1951.1, ordnung: 12,
    wenn: west,
    absender: 'Hermann Ehlers, Präsident des Bundestages, und die Kirchen',
    text: 'Im amerikanischen Kriegsverbrechergefängnis Landsberg warten verurteilte Täter der Einsatzgruppen und KZ-Ärzte auf ihre Hinrichtung. Kirchen, Abgeordnete aller Parteien außer der KPD und Veteranenverbände bitten dich, beim Hohen Kommissar McCloy für Gnade zu intervenieren. Die Amerikaner brauchen deutsche Soldaten – und die Veteranen machen die Freilassung zur Bedingung.',
    optionen: [
      { text: 'Bei McCloy intervenieren.', hist: true, ergebnis: 'McCloy wandelt die meisten Urteile in Haftstrafen um, sieben werden vollstreckt. In der amerikanischen Presse ist die Empörung groß.', w: { ansehen: 2, usa: -3, koalition: 2 } },
      { text: 'Sich heraushalten – das ist Sache der Alliierten.', ergebnis: 'Die Veteranenverbände sind verärgert. Washington respektiert die Zurückhaltung.', w: { ansehen: -2, usa: 2 } },
    ],
    historisch: 'McCloy bestätigte im Januar 1951 fünf der Todesurteile (dazu kamen zwei vom Militärgouverneur Handy); die übrigen wurden umgewandelt. Die Frage der Kriegsverurteilten belastete die Verhandlungen über den Wehrbeitrag.',
  }),
  akte({
    id: 'a_aa', titel: 'Ein eigenes Auswärtiges Amt', ab: 1951.1, bis: 1951.1, ordnung: 3,
    wenn: s => west(s) && unionRegiert(s),
    absender: 'Herbert Blankenhorn',
    text: 'Mit der kleinen Revision des Besatzungsstatuts darf die Bundesrepublik ein Auswärtiges Amt einrichten. Wer soll Außenminister werden? Viele denken an Heinrich von Brentano. Du könntest das Amt auch selbst übernehmen.',
    optionen: [
      { text: 'Das Amt selbst übernehmen.', hist: true, ergebnis: 'Kanzler und Außenminister in einer Person. Die Außenpolitik bleibt Chefsache.', w: { ansehen: 1, koalition: -2 } },
      { text: 'Brentano ernennen.', ergebnis: 'Ein loyaler Minister, aber ein weiterer Mitspieler.', w: { koalition: 3 } },
    ],
    historisch: 'Adenauer war von März 1951 bis Juni 1955 zugleich Außenminister. Danach übernahm Heinrich von Brentano.',
  }),
  akte({
    id: 'a_kpd', titel: 'Ein Verbotsantrag gegen die KPD?', ab: 1951.2, bis: 1951.2, ordnung: 11,
    absender: s => (unionRegiert(s) ? 'Robert Lehr, Bundesminister des Innern' : 'Bundesminister des Innern'),
    text: 'Das Innenministerium will beim neuen Bundesverfassungsgericht das Verbot der rechtsextremen Sozialistischen Reichspartei und der KPD beantragen. Die SRP gewinnt in Niedersachsen Wähler unter früheren Nationalsozialisten, die KPD ist der verlängerte Arm der SED.',
    optionen: [
      { text: 'Beide Verbote beantragen.', hist: true, ergebnis: 'Die Anträge gehen nach Karlsruhe. Die SRP wird 1952 verboten, über die KPD wird noch lange verhandelt.', w: { moskau: -2, usa: 1 }, setze: ['kpd_antrag'] },
      { text: 'Nur die SRP verbieten lassen.', ergebnis: 'Ein Zeichen gegen die Rechten. Die KPD bleibt eine legale Splitterpartei.', w: { usa: 1 } },
    ],
    historisch: 'Die Anträge wurden im November 1951 gestellt. Die SRP wurde am 23. Oktober 1952 verboten, die KPD erst am 17. August 1956.',
  }),
  akte({
    id: 'a_pfleiderer', titel: 'Der Pfleiderer-Plan', ab: 1952.1, bis: 1952.2, ordnung: 6,
    wenn: s => geteilt(s) && regiertMit('FDP')(s),
    absender: 'Karl Georg Pfleiderer, MdB (FDP)',
    text: 'Der FDP-Abgeordnete Pfleiderer hat einen Plan veröffentlicht: Die Besatzungstruppen sollen sich an die Ränder Deutschlands zurückziehen, die Mitte würde eine militärisch verdünnte Zone, in der ein wiedervereinigtes Deutschland entstehen könnte. Er bittet dich um ein Gespräch.',
    optionen: [
      { text: 'Den Plan öffentlich zurückweisen.', hist: true, ergebnis: 'Pfleiderer wird in seiner Partei isoliert. Die FDP-Spitze ist dennoch verstimmt.', w: { koalition: -2, usa: 1 } },
      { text: 'Ihn zum Gespräch einladen.', ergebnis: 'Ein langes Gespräch. Der Koalitionspartner fühlt sich gewürdigt.', w: { koalition: 3, einheit: 1, usa: -1 } },
    ],
  }),
  akte({
    id: 'a_krupp', titel: 'Der Fall Krupp', ab: 1952.2, bis: 1953.1, ordnung: 3,
    absender: 'Alfried Krupp von Bohlen und Halbach, Essen',
    text: 'Alfried Krupp von Bohlen und Halbach ist 1951 aus der Haft in Landsberg entlassen worden. Die Alliierten verlangen, dass er seine Kohle- und Stahlbetriebe verkauft, bevor er das Unternehmen zurückbekommt. Die Industrie bittet um Unterstützung gegen die „Entflechtung“.',
    optionen: [
      { text: 'Einen Kompromiss vermitteln: Verkauf auf dem Papier, mit langen Fristen.', hist: true, ergebnis: 'Im Mehlemer Abkommen verpflichtet sich Krupp zum Verkauf. Er wird nie vollzogen.', w: { impuls: 0.3, usa: -1 } },
      { text: 'Die Entflechtung unterstützen.', ergebnis: 'Die Alliierten sind zufrieden, die Ruhrindustrie nicht.', w: { usa: 2, frankreich: 2, koalition: -2 } },
    ],
  }),
  akte({
    id: 'a_berlinhilfe', titel: 'Hilfe für Berlin', ab: 1950.1, bis: 1953.1, ordnung: 5,
    wenn: geteilt,
    absender: 'Ernst Reuter, Regierender Bürgermeister von Berlin',
    text: 'West-Berlin hat noch immer über 25 Prozent Arbeitslose. Die Stadt lebt von Bundeshilfen und Aufträgen. Reuter bittet um ein Sonderprogramm: Bundesbehörden nach Berlin, Steuervorteile für Investitionen.',
    optionen: [
      { text: 'Ein Berlin-Programm auflegen.', hist: true, ergebnis: 'Die Berlinhilfe wird zum festen Posten im Haushalt.', w: { haushalt: -2, einheit: 2, ansehen: 1 } },
      { text: 'Vertrösten.', ergebnis: 'Reuter ist bitter enttäuscht – und sagt es öffentlich.', w: { ansehen: -2 } },
    ],
  }),
  akte({
    id: 'a_familienministerium', titel: 'Ein Ministerium für die Familie', ab: 1953.2, bis: 1953.2, ordnung: 11,
    wenn: unionRegiert,
    absender: 'Josef Kardinal Frings, Erzbischof von Köln',
    text: 'Die katholischen Bischöfe bitten, im neuen Kabinett ein Familienministerium einzurichten. Franz-Josef Wuermeling, ein streitbarer Katholik, steht bereit. Die FDP spottet über ein „Ministerium für Kinderreichtum“.',
    optionen: [
      { text: 'Das Ministerium schaffen.', hist: true, ergebnis: 'Wuermeling wird Familienminister und kämpft für das Kindergeld.', w: { ansehen: 1, koalition: -1 }, setze: ['familienministerium'] },
      { text: 'Ablehnen.', ergebnis: 'Die Bischöfe sind verstimmt.', w: { ansehen: -1, koalition: 1 } },
    ],
  }),
  akte({
    id: 'a_otto_john', titel: 'Der Verfassungsschutzpräsident ist verschwunden', ab: 1954.2, bis: 1954.2, ordnung: 7,
    wenn: geteilt,
    absender: 'Bundesministerium des Innern',
    text: 'Otto John, Präsident des Bundesamtes für Verfassungsschutz, ist nach einer Gedenkfeier zum 20. Juli in Ost-Berlin aufgetaucht. Im DDR-Rundfunk warnt er vor der Remilitarisierung und den alten Nazis in Bonn. Ob er entführt wurde oder übergelaufen ist, weiß niemand.',
    optionen: [
      { text: 'Den Innenminister öffentlich in Schutz nehmen.', ergebnis: s => `${unionRegiert(s) ? 'Schröder' : 'Der Innenminister'} bleibt im Amt. Die Opposition spottet über die Sicherheitsbehörden.`, w: { ansehen: -2 } },
      { text: 'Eine Untersuchung der Geheimdienste anordnen.', ergebnis: 'Die Untersuchung bringt Ungereimtheiten ans Licht, aber keine Klarheit.', w: { ansehen: 1, usa: 1 } },
    ],
    historisch: 'Otto John wechselte am 20. Juli 1954 nach Ost-Berlin und kehrte im Dezember 1955 zurück. Er wurde wegen Landesverrats verurteilt; ob er entführt worden war, ist bis heute ungeklärt.',
  }),
  akte({
    id: 'a_baudissin', titel: 'Der Staatsbürger in Uniform', ab: 1955.1, bis: 1956.1, ordnung: 6,
    wenn: imBuendnis,
    absender: s => (unionRegiert(s) ? 'Wolf Graf von Baudissin, Amt Blank' : 'Wolf Graf von Baudissin, Bundesministerium für Verteidigung'),
    text: 'Für die neuen Streitkräfte hat Graf Baudissin das Konzept der „Inneren Führung“ entwickelt: Der Soldat bleibt Staatsbürger mit Grundrechten, Befehle finden ihre Grenze an der Menschenwürde. Ehemalige Wehrmachtsoffiziere halten das für „weiche Welle“.',
    optionen: [
      { text: 'Baudissin den Rücken stärken.', hist: true, ergebnis: 'Die Innere Führung wird Leitbild der Bundeswehr. Im Ausland wird das aufmerksam registriert.', w: { usa: 2, frankreich: 2, ansehen: 1 } },
      { text: 'Den Traditionalisten freie Hand lassen.', ergebnis: 'Die neue Armee ähnelt der alten mehr, als vielen lieb ist.', w: { frankreich: -4, ansehen: -1, koalition: 1 } },
    ],
  }),
  akte({
    id: 'a_juliusturm', titel: 'Der Juliusturm', ab: 1956.1, bis: 1957.1, ordnung: 3,
    wenn: s => s.w.haushalt >= 35,
    absender: s => (unionRegiert(s) ? 'Fritz Schäffer, Bundesminister der Finanzen' : 'Bundesminister der Finanzen'),
    text: s => `Weil die Aufrüstung langsamer vorankommt als geplant, hat ${unionRegiert(s) ? 'Finanzminister Schäffer' : 'der Finanzminister'} Milliarden angespart. Die Presse nennt den Schatz nach dem Spandauer Turm, in dem das Kaiserreich seinen Kriegsschatz lagerte, den „Juliusturm“. Vor der Wahl wollen viele in der Fraktion das Geld ausgeben.`,
    optionen: [
      { text: 'Den Juliusturm öffnen: Steuersenkungen und Wohltaten.', hist: true, ergebnis: 'Die Kassen leeren sich, die Wähler freuen sich.', w: { haushalt: -10, ansehen: 4, impuls: 1 } },
      { text: s => (unionRegiert(s) ? 'Schäffer schützen – das Geld ist für die Bundeswehr.' : 'Den Finanzminister schützen – das Geld ist für die Bundeswehr.'), ergebnis: 'Der Finanzminister bleibt eisern. Die Fraktion murrt.', w: { koalition: -3, haushalt: 1 } },
    ],
  }),
  akte({
    id: 'a_samstag', titel: '„Samstags gehört Vati mir“', ab: 1956.1, bis: 1956.2, ordnung: 5,
    absender: 'Deutscher Gewerkschaftsbund',
    text: 'Der DGB fordert die Fünftagewoche mit 40 Stunden. Das Plakat mit einem Kind und dem Slogan „Samstags gehört Vati mir“ hängt überall. Die Arbeitgeber warnen vor dem Ende des Wirtschaftswunders.',
    optionen: [
      { text: 'Die Forderung öffentlich unterstützen.', ergebnis: 'Ein Coup bei den Arbeitnehmern, die Arbeitgeber schäumen.', w: { ansehen: 2, impuls: -0.3, koalition: -2 } },
      { text: 'Auf die Tarifautonomie verweisen.', hist: true, ergebnis: 'Die Tarifparteien sollen es unter sich ausmachen. Die Metallindustrie beginnt schrittweise mit der Verkürzung.', w: {} },
    ],
  }),
  akte({
    id: 'a_gastarbeiter', titel: 'Arbeiter aus Italien', ab: 1955.2, bis: 1956.2, ordnung: 11,
    absender: s => (unionRegiert(s) ? 'Anton Storch, Bundesminister für Arbeit' : 'Bundesminister für Arbeit'),
    text: 'In der Landwirtschaft und auf dem Bau fehlen Arbeitskräfte. Italien, wo die Arbeitslosigkeit hoch ist, schlägt ein Abkommen über die Anwerbung italienischer Arbeiter vor. Die Gewerkschaften fürchten Lohndrückerei.',
    optionen: [
      { text: 'Das Anwerbeabkommen schließen.', hist: true, ergebnis: 'Die ersten italienischen Arbeiter treffen in Stuttgart und München ein.', w: { impuls: 0.3, ansehen: -1 }, setze: ['gastarbeiter'] },
      { text: 'Vorerst ablehnen.', ergebnis: 'Die Unternehmen klagen über leergefegte Arbeitsmärkte.', w: { ansehen: 1 } },
    ],
    historisch: 'Das Anwerbeabkommen mit Italien wurde am 20. Dezember 1955 geschlossen. Es folgten Spanien und Griechenland (1960), die Türkei (1961), Marokko (1963), Portugal (1964).',
  }),
  akte({
    id: 'a_atomforschung', titel: s => `Reaktoren für ${s.f.vereinigt ? 'Deutschland' : 'die Bundesrepublik'}`, ab: 1955.2, bis: 1956.2, ordnung: 9,
    absender: 'Werner Heisenberg, Max-Planck-Institut für Physik',
    text: 'Seit der Souveränität darf in Deutschland wieder Kernforschung betrieben werden. Heisenberg will einen Forschungsreaktor in München, die Industrie ein Kernforschungszentrum in Karlsruhe. Der neue Atomminister möchte beides.',
    optionen: [
      { text: 'Ein großes Kernforschungsprogramm.', ergebnis: 'Karlsruhe und Jülich werden zu Zentren der Atomforschung.', w: { haushalt: -3, impuls: 0.4 }, setze: ['atomforschung'] },
      { text: 'Bescheidene Mittel, zivile Forschung.', ergebnis: 'Die Wissenschaftler hätten sich mehr gewünscht.', w: { haushalt: -1 } },
    ],
  }),
  akte({
    id: 'a_halbstarke', titel: 'Die Halbstarken', ab: 1956.2, bis: 1958.2, ordnung: 6,
    absender: s => (unionRegiert(s) ? 'Gerhard Schröder, Bundesminister des Innern' : 'Bundesminister des Innern'),
    text: 'Nach Konzerten und Rock-’n’-Roll-Filmen kommt es in mehreren Städten zu Krawallen Jugendlicher in Lederjacken. Bill Haley hat in Berlin gespielt, im Sportpalast flogen Stühle. Konservative Abgeordnete verlangen ein Jugendschutzgesetz mit harten Strafen.',
    optionen: [
      { text: 'Hart durchgreifen.', ergebnis: 'Ältere Wähler nicken, die Jugend lacht.', w: { ansehen: 1 } },
      { text: 'Gelassen bleiben.', ergebnis: '„Jugend war immer schon schwierig“, sagt der Kanzler. Die Aufregung legt sich.', w: { ansehen: 0 } },
    ],
  }),
  akte({
    id: 'a_ehlers', titel: 'Der Bundestag in Berlin', ab: 1955.2, bis: 1958.2, ordnung: 9,
    wenn: s => geteilt(s) && !s.f.freistadt_vereinbart,
    absender: 'Eugen Gerstenmaier, Präsident des Bundestages',
    text: 'Gerstenmaier möchte, dass der Bundestag eine Sitzungswoche in West-Berlin abhält, um die Zugehörigkeit der Stadt zum Bund zu demonstrieren. Moskau hat für diesen Fall „Konsequenzen“ angekündigt.',
    optionen: [
      { text: 'Zustimmen.', hist: true, ergebnis: 'Der Bundestag tagt in West-Berlin. Moskau und Ost-Berlin protestieren scharf gegen die „Provokation“.', w: { moskau: -5, einheit: 1, ansehen: 1 } },
      { text: 'Abraten.', ergebnis: 'Die Berliner fühlen sich im Stich gelassen.', w: { moskau: 2, ansehen: -2 } },
    ],
  }),
  akte({
    id: 'a_globke', titel: 'Der Staatssekretär', ab: 1956.1, bis: 1963.1, ordnung: 7,
    wenn: s => adenauer(s) && geteilt(s),
    absender: 'Ausschuss für Deutsche Einheit (Ost-Berlin)',
    text: 'Die DDR führt eine Kampagne gegen Hans Globke, deinen Staatssekretär und engsten Mitarbeiter. Globke hat 1936 einen Kommentar zu den Nürnberger Rassegesetzen mitverfasst. In der westdeutschen Presse wächst die Kritik. Globke ist ein brillanter Verwaltungsmann und hält das Kanzleramt zusammen.',
    optionen: [
      { text: 'An Globke festhalten.', hist: true, ergebnis: 'Globke bleibt. Die Kampagne geht weiter, international wächst das Unbehagen.', w: { ansehen: -2, usa: -1 } },
      { text: 'Globke in den Ruhestand schicken.', ergebnis: 'Ein Signal, das im Ausland gewürdigt wird. Das Kanzleramt verliert seinen Motor.', w: { usa: 2, ansehen: 1, koalition: -2 } },
    ],
    historisch: 'Adenauer hielt bis zu seinem Rücktritt 1963 an Globke fest. Die DDR verurteilte Globke im Juli 1963 in einem Schauprozess in Abwesenheit zu lebenslanger Haft.',
  }),
  akte({
    id: 'a_oberlaender', titel: 'Der Vertriebenenminister', ab: 1960.1, bis: 1960.1, ordnung: 4,
    wenn: s => geteilt(s) && unionRegiert(s),
    absender: 'Theodor Oberländer, Bundesminister für Vertriebene',
    text: 'Gegen deinen Vertriebenenminister erhebt die DDR schwere Vorwürfe: Er sei 1941 als Offizier des Bataillons „Nachtigall“ an Massakern in Lemberg beteiligt gewesen. Oberländer bestreitet das. Auch in der Koalition wird sein Rücktritt verlangt.',
    optionen: [
      { text: 'Ihn zum Rücktritt bewegen.', hist: true, ergebnis: 'Oberländer tritt im Mai zurück. Die Vertriebenen sehen sich als Opfer einer Kampagne.', w: { usa: 1, koalition: -1 } },
      { text: 'An ihm festhalten.', ergebnis: 'Die Kritik im In- und Ausland nimmt zu.', w: { ansehen: -3, usa: -2 } },
    ],
  }),
  akte({
    id: 'a_volksaktie', titel: 'Volksaktien', ab: 1959.1, bis: 1961.1, ordnung: 6,
    wenn: unionRegiert,
    absender: 'Ludwig Erhard',
    text: 'Erhard will Bundesunternehmen teilprivatisieren und die Aktien bevorzugt an Kleinsparer verkaufen: zuerst die Preussag, dann das Volkswagenwerk. Eigentum für alle, sagt Erhard. Die SPD spricht vom Ausverkauf des Volksvermögens.',
    optionen: [
      { text: 'Die Volksaktie einführen.', hist: true, ergebnis: 'Hunderttausende Kleinsparer werden Aktionäre. Der Bund nimmt Geld ein.', w: { haushalt: 5, ansehen: 2 } },
      { text: 'Die Unternehmen in Bundesbesitz behalten.', ergebnis: 'Erhard ist gekränkt.', w: { koalition: -2 } },
    ],
  }),
  akte({
    id: 'a_interzonenhandel', titel: 'Der Interzonenhandel', ab: 1960.2, bis: 1960.2, ordnung: 9,
    wenn: s => geteilt(s) && !s.f.freistadt_vereinbart,
    absender: 'Treuhandstelle für den Interzonenhandel',
    text: 'Die DDR verlangt von Westdeutschen für Besuche in Ost-Berlin neuerdings eine Aufenthaltsgenehmigung. Als Gegenmaßnahme schlägt das Wirtschaftsministerium vor, das Abkommen über den Interzonenhandel zu kündigen. Die DDR ist auf Stahl und Maschinen aus dem Westen angewiesen.',
    optionen: [
      { text: 'Das Abkommen kündigen.', hist: true, ergebnis: 'Ost-Berlin lenkt teilweise ein; das Abkommen wird zum Jahresende neu in Kraft gesetzt.', w: { moskau: -4, ansehen: 1 } },
      { text: 'Den Handel unberührt lassen.', ergebnis: 'Die DDR testet weiter, wie weit sie gehen kann.', w: { ansehen: -1 } },
    ],
  }),
  akte({
    id: 'a_schwarzhaupt', titel: 'Eine Frau im Kabinett', ab: 1961.2, bis: 1961.2, ordnung: 11,
    wenn: unionRegiert,
    absender: 'Helene Weber und die Frauen der Unionsfraktion',
    text: 'Seit 1949 hat noch nie eine Frau einem Bundeskabinett angehört. Die Frauen der Fraktion haben dich in einer Sitzung zur Rede gestellt und kündigen an, nicht mehr zu weichen. Sie schlagen Elisabeth Schwarzhaupt als Gesundheitsministerin vor.',
    optionen: [
      { text: 'Schwarzhaupt ernennen.', hist: true, ergebnis: 'Die erste Bundesministerin. Ein neues Ministerium für Gesundheitswesen wird geschaffen.', w: { ansehen: 2 } },
      { text: 'Vertrösten.', ergebnis: 'Die Frauen in der Fraktion vergessen es nicht.', w: { ansehen: -2, koalition: -1 } },
    ],
    historisch: 'Elisabeth Schwarzhaupt wurde im November 1961 erste Bundesministerin, zuständig für das neu geschaffene Gesundheitsministerium.',
  }),
  akte({
    id: 'a_tuerkei', titel: 'Ein Abkommen mit der Türkei', ab: 1961.2, bis: 1961.2, ordnung: 10,
    absender: 'Auswärtiges Amt',
    text: s => `Die Türkei, NATO-Partner mit hoher Arbeitslosigkeit, bittet um ein Anwerbeabkommen wie mit Italien, Spanien und Griechenland. ${s.f.mauer ? 'Nach dem Mauerbau kommen keine Arbeitskräfte mehr aus der DDR.' : s.f.vereinigt ? 'Auch in den neuen Ländern sind die Fachkräfte inzwischen knapp.' : 'Die Industrie sucht händeringend Arbeitskräfte.'}`,
    optionen: [
      { text: 'Das Abkommen schließen.', hist: true, ergebnis: 'Die ersten Züge aus Istanbul kommen in München an.', w: { impuls: 0.4, usa: 1 }, setze: ['gastarbeiter'] },
      { text: 'Ablehnen.', ergebnis: 'Ankara ist gekränkt, die Industrie verärgert.', w: { impuls: -0.2, usa: -1 } },
    ],
    historisch: 'Das Anwerbeabkommen mit der Türkei wurde am 30. Oktober 1961 unterzeichnet.',
  }),
  akte({
    id: 'a_bundesliga', titel: 'Eine Liga für ganz Deutschland', ab: 1962.1, bis: 1962.2, ordnung: 7,
    absender: 'Deutscher Fußball-Bund',
    text: 'Der DFB will eine bundesweite Profiliga einführen – die Bundesliga. Die Vereine streiten darüber, wer aufgenommen wird. Der DFB bittet um ein Grußwort und um steuerliche Erleichterungen für die Vereine.',
    optionen: [
      { text: 'Ein Grußwort schicken.', ergebnis: 'Ein Kanzler, der sich für Fußball interessiert – die Zeitungen schmunzeln.', w: { ansehen: 1 } },
      { text: 'Fußball ist keine Sache der Regierung.', ergebnis: 'Niemand nimmt es übel.', w: {} },
    ],
  }),
  akte({
    id: 'a_auschwitz', titel: 'Der Prozess in Frankfurt', ab: 1963.2, bis: 1964.1, ordnung: 12,
    absender: 'Fritz Bauer, Generalstaatsanwalt in Hessen',
    text: 'In Frankfurt beginnt der Prozess gegen 22 Angehörige der Lagermannschaft von Auschwitz. Generalstaatsanwalt Bauer bittet die Bundesregierung, den Prozess öffentlich zu unterstützen und die Akten in Bundesbesitz zugänglich zu machen. Viele Deutsche wollen von der Vergangenheit nichts mehr hören.',
    optionen: [
      { text: 'Die Akten öffnen und den Prozess unterstützen.', ergebnis: 'Der Prozess wird zu einem Wendepunkt der Auseinandersetzung mit der NS-Vergangenheit.', w: { usa: 2, ansehen: -1 } },
      { text: 'Auf die Unabhängigkeit der Justiz verweisen und schweigen.', hist: true, ergebnis: 'Der Prozess läuft ohne Zutun aus Bonn.', w: {} },
    ],
  }),
  akte({
    id: 'a_zuse', titel: 'Rechenmaschinen', ab: 1950.1, bis: 1956.2, ordnung: 6,
    absender: 'Konrad Zuse, Zuse KG, Neukirchen',
    text: 'Der Erfinder Konrad Zuse baut in einer kleinen Firma programmgesteuerte Rechenmaschinen. Er bittet um Förderung: Die Amerikaner stecken Millionen in solche Maschinen, in Deutschland interessiert sich kaum jemand dafür.',
    optionen: [
      { text: 'Ein Förderprogramm für Rechenanlagen.', ergebnis: 'Ein kleiner Betrag mit langfristiger Wirkung.', w: { haushalt: -1, impuls: 0.3 }, setze: ['zuse'] },
      { text: 'Ablehnen.', ergebnis: 'Zuse sucht sich private Geldgeber.', w: {} },
    ],
  }),
  akte({
    id: 'a_heimkehrer', titel: 'Briefe aus Workuta', ab: 1950.1, bis: 1955.1, ordnung: 2,
    wenn: s => geteilt(s) && !s.f.heimkehrer,
    absender: 'Verband der Heimkehrer',
    text: 'Über das Rote Kreuz kommen Postkarten aus sowjetischen Lagern: Workuta, Karaganda, Swerdlowsk. Zehntausende Deutsche sind noch in Gefangenschaft. Der Heimkehrerverband bittet, die Frage vor die Vereinten Nationen zu bringen.',
    optionen: [
      { text: 'Die Frage international zur Sprache bringen.', ergebnis: 'Die Vereinten Nationen setzen eine Kommission ein. Moskau ist verärgert.', w: { ansehen: 2, moskau: -3 } },
      { text: 'Auf stille Diplomatie setzen.', ergebnis: 'Die Verbände sind enttäuscht.', w: { ansehen: -1 } },
    ],
  }),
  akte({
    id: 'a_sed_wahl', titel: 'Wahlhilfe für die SED?', ab: 1953.1, bis: 1955.2, ordnung: 6,
    wenn: s => !!s.f.neutral && !s.f.vereinigt,
    absender: s => (unionRegiert(s) ? 'Jakob Kaiser, Bundesminister für gesamtdeutsche Fragen' : 'Bundesminister für gesamtdeutsche Fragen'),
    text: s => `${unionRegiert(s) ? 'Kaiser' : 'Der Minister'} warnt: Die SED bereitet mit sowjetischem Geld einen großen Wahlkampf vor. Er schlägt vor, über diskrete Kanäle die demokratischen Parteien im Osten zu unterstützen – mit Geld aus dem Kanzleramt.`,
    optionen: [
      { text: 'Diskret unterstützen.', ergebnis: 'Das Geld fließt. Die Gefahr, dass es auffliegt, fließt mit.', w: { ansehen: 2, moskau: -4 } },
      { text: 'Ablehnen – faire Wahlen sind faire Wahlen.', ergebnis: s => (unionRegiert(s) ? 'Kaiser respektiert es.' : 'Der Minister respektiert es.'), w: {} },
    ],
  }),
  akte({
    id: 'a_ost_fluechtlinge', titel: 'Zuwanderung aus dem Osten', ab: 1954.1, bis: 1958.2, ordnung: 5,
    wenn: vereinigt,
    absender: 'Bundesministerium für Arbeit',
    text: 'Seit der Vereinigung ziehen Hunderttausende aus Sachsen und Thüringen in das Ruhrgebiet und nach Süddeutschland, wo die Löhne höher sind. Ganze Dörfer im Osten entleeren sich. Der Arbeitsminister schlägt ein Strukturprogramm vor.',
    optionen: [
      { text: 'Ein Strukturprogramm Ost.', ergebnis: 'Fabriken werden in Leipzig, Chemnitz und Magdeburg angesiedelt.', w: { haushalt: -5, ansehen: 3, impuls: 0.6 } },
      { text: 'Den Markt entscheiden lassen.', ergebnis: 'Der Westen wächst, der Osten blutet aus.', w: { ansehen: -3, impuls: 0.2 } },
    ],
  }),
];
