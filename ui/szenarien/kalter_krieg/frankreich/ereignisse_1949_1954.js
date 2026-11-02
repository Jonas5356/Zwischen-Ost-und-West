// Frankreich: Vorlagen 1949 bis 1954 (Indochina, Schuman-Plan, EVG, Saar, Algerien beginnt)
import { vierte, indochinakrieg, gesamtSitze } from './modell.js';
import { pariserAussen, brd, kanzler, bonn, bonnImWesten } from './hilfen.js';
import { usaAussen } from '../brd/hilfen.js';

const chef = s => s.regierungschef;
const ergebnisChef = s => (s.lager === 'de_gaulle' ? 'De Gaulle' : `Ministerpräsident ${s.regierungschef}`);

/** Wie viele Abgeordnete sind gegen die EVG? Gaullisten, Kommunisten, die Hälfte der Sozialisten, Teile der Radikalen */
function evgChance(s, { vertrauensfrage = false } = {}) {
  const g = gesamtSitze(s) || 600;
  const gegen = (s.sitze.PCF || 0) + (s.sitze.GAUL || 0) + (s.sitze.POUJ || 0) + 0.5 * (s.sitze.SFIO || 0) + 0.45 * (s.sitze.RAD || 0) + 0.25 * (s.sitze.UNAB || 0);
  const anteilGegen = gegen / g;
  let p = 0.36 - 2.5 * (anteilGegen - 0.5);
  if (s.weltflags.evg_bruessel === 'entgegen') p += 0.1;
  if (s.weltflags.evg_druck) p += 0.04;
  p += (brd(s).w.frankreich - 50) / 300; // wie sehr Paris Bonn vertraut
  if (vertrauensfrage) p += 0.15;
  if (s.weltflags.stalin_tot) p -= 0.05; // Entspannung nach Stalins Tod: Wozu noch die europäische Armee?
  return Math.max(0.03, Math.min(0.85, p));
}

export default [
  // ------------------------------------------------------------------ 1949/II
  {
    id: 'fr_elysee_abkommen',
    titel: 'Ein Kaiser für Vietnam',
    datum: 'Herbst 1949',
    ab: 1949.2, ordnung: 10,
    absender: 'Ministerium für die assoziierten Staaten',
    ascii: 'dschungel',
    text: `Seit 1946 führt Frankreich in Indochina Krieg gegen die Viet Minh Ho Chi Minhs. Im März hat Präsident Auriol mit dem früheren Kaiser Bao Dai die Élysée-Abkommen geschlossen: Ein „Staat Vietnam“ unter Bao Dai soll innerhalb der Französischen Union unabhängig werden – Armee, Diplomatie und Finanzen bleiben aber weitgehend in französischer Hand. Die Nationalversammlung muss die Abkommen noch ratifizieren.

In Washington sieht man den Krieg inzwischen als Teil des Kampfes gegen den Kommunismus, seit Mao in China gesiegt hat. Die Kommunisten in Paris nennen ihn den „schmutzigen Krieg“.`,
    optionen: [
      { text: 'Die Abkommen ratifizieren: Bao Dai als Gegenspieler Ho Chi Minhs aufbauen.', hist: true, richtung: 'kolonial',
        ergebnis: 'Die Nationalversammlung ratifiziert die Élysée-Abkommen. Washington und London erkennen den Staat Vietnam an; Moskau und Peking erkennen Ho Chi Minh an.',
        w: { indochina: 3, usa: 4, moskau: -3 }, dient: { kolonien: 0.8, westbindung: 0.5 } },
      { text: 'Vietnam echte Unabhängigkeit anbieten und mit Ho Chi Minh verhandeln.', richtung: 'dekolonisation',
        ergebnis: 'Paris sondiert über Mittelsmänner bei Ho Chi Minh. Washington ist alarmiert, das Expeditionskorps fühlt sich verraten.',
        w: { indochina: -4, usa: -6, armee: -8, kriegsmuede: -2, moskau: 3 },
        setze: ['indochina_verhandlung'], dient: { frieden_kolonien: 1.2, kolonien: -0.8 } },
      { text: 'Mehr Truppen schicken und den Krieg militärisch entscheiden.', richtung: 'kolonial',
        ergebnis: 'Paris verstärkt das Expeditionskorps. Die Kosten steigen, die Lage im Delta bessert sich vorerst.',
        w: { indochina: 7, haushalt: -4, kriegsmuede: 2, armee: 3 }, dient: { kolonien: 1.2, frieden_kolonien: -0.5 } },
    ],
    historisch: 'Die Nationalversammlung ratifizierte die Élysée-Abkommen im Januar 1950. Die USA erkannten den Staat Vietnam im Februar 1950 an und übernahmen bis 1954 einen wachsenden Teil der Kriegskosten.',
  },

  // ------------------------------------------------------------------ 1950/I
  {
    id: 'fr_saarkonventionen',
    titel: 'Die Saarkonventionen',
    datum: '3. März 1950',
    ab: 1950.1, ordnung: 3,
    wenn: bonnImWesten,
    absender: 'Gilbert Grandval, Hoher Kommissar an der Saar',
    text: s => `Das Saarland ist seit 1947 wirtschaftlich an Frankreich angeschlossen: französischer Franc, französischer Zoll, die Kohlegruben unter französischer Verwaltung. Ministerpräsident Johannes Hoffmann regiert mit Billigung von Paris. Nun sollen Konventionen die Autonomie der Saar festschreiben; die Gruben würden für fünfzig Jahre an Frankreich verpachtet.

In ${bonn(s)} spricht ${kanzler(s)} von einer „Abtrennung deutschen Gebiets“. Die Saar soll außerdem zugleich mit der Bundesrepublik in den Europarat aufgenommen werden – als eigenes Mitglied.`,
    optionen: [
      { text: 'Die Konventionen unterzeichnen: Autonomie der Saar, Wirtschaftsunion mit Frankreich.', hist: true, richtung: 'national',
        ergebnis: 'Paris und Saarbrücken unterzeichnen die Konventionen. In Bonn ist die Empörung groß.',
        w: { brd: -5, rang: 1 }, setze: ['saar_konventionen'], dient: { saar: 1.3, deutschland_klein: 0.3, deutschland_einbinden: -0.2 } },
      { text: 'Die Saarfrage offenhalten, bis ein Friedensvertrag geschlossen ist.',
        ergebnis: 'Paris vertagt die Konventionen. Bonn registriert die Geste, die Saarregierung ist enttäuscht.',
        w: { brd: 3, mehrheit: -4 }, dient: { deutschland_einbinden: 0.3, saar: -0.5 } },
      { text: 'Die Saar ganz an Frankreich angliedern.', richtung: 'national',
        ergebnis: 'Paris verlangt den Anschluss der Saar. London und Washington sind entsetzt; in Bonn ist von „Annexion“ die Rede.',
        w: { brd: -14, usa: -8, grossbritannien: -6, rang: 1 }, setze: ['saar_konventionen', 'saar_anschluss'], dient: { saar: 1.6, deutschland_klein: 0.6, europa: -0.6 } },
    ],
    historisch: 'Die Saarkonventionen wurden am 3. März 1950 unterzeichnet. Sie belasteten das deutsch-französische Verhältnis schwer, bis die Saarländer 1955 das Saarstatut ablehnten.',
  },
  {
    id: 'fr_schuman',
    titel: 'Der Plan Monnets',
    datum: 'April/Mai 1950',
    ab: 1950.1, ordnung: 4.8,
    wenn: bonnImWesten,
    absender: 'Jean Monnet, Generalkommissar des Plans',
    text: s => `Jean Monnet legt ${pariserAussen(s)} ein Papier von wenigen Seiten vor. Statt die deutsche Schwerindustrie mit der Ruhrbehörde zu überwachen – was auf Dauer nicht gelingen wird –, sollen Frankreich und Deutschland ihre gesamte Kohle- und Stahlproduktion einer gemeinsamen Hohen Behörde unterstellen, offen für alle europäischen Länder. Krieg zwischen beiden Ländern würde „nicht nur undenkbar, sondern materiell unmöglich“.

Washington drängt, Deutschland wieder stärker werden zu lassen; im September tagen die Außenminister in London. Wer die deutsche Frage jetzt nicht selbst löst, dem wird sie aus der Hand genommen. Die Stahlindustrie in Lothringen ist alarmiert, die Gaullisten sprechen von einem „Konglomerat“, das Frankreichs Souveränität auflöst.`,
    optionen: [
      { text: 'Den Plan als Angebot an Bonn verkünden – vorher vertraulich den Kanzler fragen.', hist: true, richtung: 'europa',
        ergebnis: s => `${pariserAussen(s)} verkündet den Plan am 9. Mai im Uhrensaal des Quai d’Orsay. ${kanzler(s)} ist vorab vertraulich unterrichtet worden.`,
        w: { europa: 4, usa: 5, rang: 3, brd: 6 }, setze: ['schuman_plan'],
        aktion: (s, a) => a.sende('brd', 'schuman'),
        dient: { europa: 1.2, deutschland_einbinden: 1.5, deutschland_klein: -0.4 } },
      { text: 'Bei der Ruhrbehörde bleiben: Kontrolle statt Gemeinschaft.', richtung: 'national',
        ergebnis: 'Paris hält an der Kontrolle der Ruhr fest. In Washington wächst die Ungeduld mit der französischen Deutschlandpolitik.',
        w: { usa: -6, brd: -4 }, dient: { deutschland_klein: 1.2, europa: -0.6 } },
      { text: 'Nur eine lockere Zusammenarbeit der Stahlindustrien anbieten.',
        ergebnis: 'Paris schlägt Gespräche über Produktionsquoten vor. Bonn hört höflich zu, Washington ist enttäuscht.',
        w: { usa: -2, europa: 1 }, dient: { deutschland_einbinden: 0.4, deutschland_klein: 0.4 } },
    ],
    historisch: 'Robert Schuman stellte den von Jean Monnet entworfenen Plan am 9. Mai 1950 vor, nachdem Adenauer ihn am Morgen vertraulich gebilligt hatte. Daraus entstand die Europäische Gemeinschaft für Kohle und Stahl.',
  },

  // ------------------------------------------------------------------ 1950/II
  {
    id: 'fr_pleven',
    titel: 'Deutsche Soldaten?',
    datum: 'Oktober 1950',
    ab: 1950.2, bis: 1951.1, ordnung: 10.3,
    wenn: s => !!s.weltflags.usa_will_wehrbeitrag && bonnImWesten(s),
    absender: 'Jules Moch, Verteidigungsminister',
    text: s => `${usaAussen(s) || 'Der amerikanische Außenminister'} hat auf der Konferenz in New York verlangt, was in Frankreich niemand hören will: deutsche Divisionen für die Verteidigung Europas. Fünf Jahre nach Kriegsende. Washington stellt ein Ultimatum: Ohne deutschen Beitrag keine weiteren amerikanischen Truppen in Europa.

Monnet hat einen Ausweg vorgeschlagen: eine europäische Armee mit einem europäischen Verteidigungsminister, in der die Deutschen nur in kleinen Einheiten dienen – ohne Generalstab, ohne eigenes Ministerium. Die Kommunisten und viele Sozialisten lehnen jede deutsche Uniform ab.`,
    optionen: [
      { text: 'Eine europäische Armee vorschlagen: deutsche Soldaten nur unter europäischem Kommando.', hist: true, richtung: ['europa', 'atlantisch'],
        ergebnis: s => `${ergebnisChef(s)} legt der Nationalversammlung den Plan einer europäischen Armee vor. Washington ist skeptisch, stimmt aber Verhandlungen zu.`,
        w: { usa: 6, europa: 3 }, setze: ['evg_plan'],
        aktion: (s, a) => a.sende('brd', 'pleven'),
        dient: { deutschland_einbinden: 1, deutschland_klein: 0.6, europa: 0.8, westbindung: 0.6 } },
      { text: 'Jede deutsche Wiederbewaffnung ablehnen.', richtung: 'national',
        ergebnis: 'Paris lehnt deutsche Soldaten in jeder Form ab. Washington droht, seine Europapolitik zu überprüfen.',
        w: { usa: -12, grossbritannien: -4, moskau: 4, brd: -4 },
        aktion: (s, a) => a.weltflag('pleven_abgelehnt'),
        bei: { brd: { w: { frankreich: -5 }, ergebnis: 'Paris lehnt deutsche Soldaten in jeder Form ab. Eine europäische Armee wird es nicht geben; die Frage des Wehrbeitrags bleibt offen.' } },
        dient: { deutschland_klein: 1.6, westbindung: -1 } },
    ],
    historisch: 'Ministerpräsident René Pleven legte den Plan am 24. Oktober 1950 vor. Er führte zum Vertrag über die Europäische Verteidigungsgemeinschaft (EVG), den die französische Nationalversammlung 1954 scheitern ließ.',
  },
  {
    id: 'fr_cao_bang',
    titel: 'Die Katastrophe an der Kolonialstraße 4',
    datum: 'Oktober 1950',
    ab: 1950.2, ordnung: 10,
    wenn: indochinakrieg,
    absender: 'Oberkommando in Indochina',
    ascii: 'dschungel',
    text: `An der chinesischen Grenze ist das Expeditionskorps vernichtend geschlagen worden. Beim Rückzug aus Cao Bang auf der Kolonialstraße 4 sind zwei Kolonnen in Hinterhalte der Viet Minh geraten; fast 5.000 Mann sind tot, verwundet oder gefangen. Seit Mao in China gesiegt hat, bekommen die Viet Minh Waffen und Ausbildungslager jenseits der Grenze.

In Hanoi bereiten französische Familien die Flucht vor. Die Generäle verlangen Verstärkung.`,
    optionen: [
      { text: 'General de Lattre de Tassigny schicken – mit voller militärischer und ziviler Gewalt.', hist: true, richtung: 'kolonial',
        ergebnis: 'Jean de Lattre de Tassigny übernimmt in Hanoi. Der „König Jean“ stellt die Moral der Truppe wieder her und lässt eine Verteidigungslinie um das Delta bauen.',
        w: { indochina: 10, haushalt: -3, armee: 6 }, setze: ['de_lattre'], dient: { kolonien: 1.2 } },
      { text: 'Washington um mehr Waffen und Geld bitten.', richtung: 'atlantisch',
        ergebnis: 'Die Vereinigten Staaten liefern Flugzeuge, Fahrzeuge und Geld – und wollen künftig mitreden.',
        w: { indochina: 6, usa: 3, rang: -3 }, setze: ['indochina_amerikahilfe'], dient: { kolonien: 0.8, westbindung: 0.5, unabhaengigkeit: -0.6 } },
      { text: 'Den Norden räumen und über einen Waffenstillstand sprechen.', richtung: 'dekolonisation',
        ergebnis: 'Paris lässt erkennen, dass es zu Gesprächen bereit ist. Das Expeditionskorps fühlt sich im Stich gelassen.',
        w: { indochina: -8, kriegsmuede: -3, armee: -10, usa: -6, rang: -4 }, setze: ['indochina_verhandlung'], dient: { frieden_kolonien: 1.2, kolonien: -1 } },
    ],
    historisch: 'Nach der Niederlage an der RC 4 schickte die Regierung Pleven im Dezember 1950 General de Lattre nach Indochina. Er stabilisierte die Lage, starb aber Anfang 1952 an Krebs.',
  },

  {
    id: 'fr_indochina_frieden',
    titel: 'Gespräche mit Ho Chi Minh',
    datum: 'Geheimsache',
    ab: 1950.1, bis: 1954.1, ordnung: 6,
    wenn: s => indochinakrieg(s) && !!s.f.indochina_verhandlung,
    absender: 'Sonderbeauftragter für Indochina',
    ascii: 'dschungel',
    text: s => `Über Mittelsmänner in Rangun und Paris hat die Regierung Kontakt zu Ho Chi Minh. Seine Unterhändler bieten einen Waffenstillstand an – gegen die Unabhängigkeit Vietnams und den Abzug des Expeditionskorps. Frankreich könnte Stützpunkte und wirtschaftliche Rechte behalten. Washington wäre empört: Für die Amerikaner ist Indochina ein Bollwerk gegen den Kommunismus in Asien.${s.w.indochina < 35 ? ' Militärisch steht es schlecht um das Expeditionskorps.' : ''}`,
    optionen: [
      { text: 'Waffenstillstand schließen und Vietnam in die Unabhängigkeit entlassen.', richtung: 'dekolonisation',
        ergebnis: 'Paris und die Viet Minh schließen einen Waffenstillstand; Vietnam wird unabhängig. Das Expeditionskorps kehrt heim, Washington spricht von Verrat. (Fiktion)',
        w: { usa: -12, rang: -6, armee: -10, kriegsmuede: -5, haushalt: 4, ansehen: 4, moskau: 5 },
        setze: ['indochina_beendet'], dient: { frieden_kolonien: 1.6, kolonien: -1.2, westbindung: -0.5 } },
      { text: 'Die Gespräche abbrechen.', richtung: 'kolonial',
        ergebnis: 'Paris bricht die Gespräche ab. Der Krieg geht weiter.',
        loesche: ['indochina_verhandlung'], dient: { kolonien: 1, westbindung: 0.3 } },
    ],
    historisch: 'Gespräche mit Ho Chi Minh hatte es 1946 in Fontainebleau gegeben; sie scheiterten, der Krieg begann. Bis 1954 lehnten die Regierungen der Vierten Republik Verhandlungen ab.',
  },

  // ------------------------------------------------------------------ 1951/I
  {
    id: 'fr_montanunion',
    titel: 'Die Hohe Behörde',
    datum: 'April 1951',
    ab: 1951.1, ordnung: 4,
    wenn: s => ['ja', 'bedingungen'].includes(s.weltflags.schuman_antwort),
    absender: 'Jean Monnet, Leiter der französischen Delegation',
    text: s => `Die Verhandlungen über die Montanunion sind abgeschlossen. Frankreich, die Bundesrepublik, Italien und die Benelux-Länder legen ihre Kohle und ihren Stahl zusammen. Umstritten ist bis zuletzt, wie viel Macht die Hohe Behörde bekommen soll. Monnet will eine echte europäische Regierung für Kohle und Stahl; die Benelux-Länder verlangen einen Ministerrat, der sie kontrolliert.${s.weltflags.schuman_antwort === 'bedingungen' ? '\n\nBonn hat in den Verhandlungen hart um jede Bedingung gerungen.' : ''}`,
    optionen: [
      { text: 'Eine starke, unabhängige Hohe Behörde durchsetzen.', hist: true, richtung: 'europa',
        ergebnis: 'Der Vertrag über die Europäische Gemeinschaft für Kohle und Stahl wird in Paris unterzeichnet. Monnet soll Präsident der Hohen Behörde werden.',
        w: { europa: 8, brd: 5, usa: 3 }, setze: ['montanunion'], dient: { europa: 1.2, deutschland_einbinden: 1 } },
      { text: 'Die Regierungen über einen Ministerrat die Kontrolle behalten lassen.',
        ergebnis: 'Der Vertrag wird unterzeichnet; die Hohe Behörde steht unter der Aufsicht der Regierungen.',
        w: { europa: 5, brd: 3 }, setze: ['montanunion'], dient: { europa: 0.6, deutschland_einbinden: 0.8, unabhaengigkeit: 0.4 } },
    ],
    historisch: 'Der EGKS-Vertrag wurde am 18. April 1951 in Paris unterzeichnet. Neben der Hohen Behörde unter Jean Monnet entstand auf Drängen der Benelux-Staaten ein Besonderer Ministerrat.',
  },
  {
    id: 'fr_apparentements',
    titel: 'Ein neues Wahlrecht',
    datum: 'Mai 1951',
    ab: 1951.1, ordnung: 5,
    wenn: vierte,
    absender: 'Henri Queuille, Innenminister',
    inland: true,
    text: `Im Juni wird gewählt. Nach dem geltenden Verhältniswahlrecht könnten Kommunisten und Gaullisten zusammen eine Mehrheit der Sitze gewinnen – gegen die Republik, wie die Parteien der Mitte fürchten. Der Innenminister schlägt die „Apparentements“ vor: Listen können sich vor der Wahl verbinden; erreicht eine Verbindung in einem Département die absolute Mehrheit, erhält sie alle Sitze.

Kommunisten und Gaullisten, die mit niemandem Listen verbinden, nennen das Gesetz einen „Wahlbetrug“.`,
    optionen: [
      { text: 'Das Gesetz über die Listenverbindungen verabschieden.', hist: true,
        ergebnis: 'Das Gesetz über die Apparentements wird verabschiedet. Kommunisten und Gaullisten sprechen von „Wahlbetrug“.',
        w: { mehrheit: 6, ansehen: -2 }, setze: ['apparentements'], dient: { stabilitaet: 1.2 } },
      { text: 'Beim reinen Verhältniswahlrecht bleiben.',
        ergebnis: 'Das Wahlrecht bleibt, wie es ist. Die Parteien der Mitte gehen mit gemischten Gefühlen in die Wahl.',
        w: { ansehen: 1 }, dient: { stabilitaet: -0.3 } },
    ],
    historisch: 'Das Gesetz vom 9. Mai 1951 sicherte den Parteien der Dritten Kraft bei der Wahl im Juni eine Mehrheit: Die Kommunisten erhielten mit 26 % der Stimmen nur 16 % der Sitze.',
  },

  // ------------------------------------------------------------------ 1951/II
  {
    id: 'fr_montanunion_ratifizierung',
    titel: 'Die Montanunion vor der Nationalversammlung',
    datum: 'Dezember 1951',
    ab: 1951.2, bis: 1952.1, ordnung: 11,
    wenn: s => !!s.f.montanunion && !s.f.montanunion_ratifiziert,
    absender: 'Auswärtiger Ausschuss der Nationalversammlung',
    text: `Die Nationalversammlung berät über den Vertrag zur Montanunion. Volksrepublikaner und Sozialisten sind dafür; Kommunisten und Gaullisten dagegen, ebenso die Stahlindustriellen Lothringens, die die deutsche Konkurrenz fürchten. Die Mehrheit ist knapp.`,
    optionen: [
      { text: 'Den Vertrag mit aller Kraft durch die Nationalversammlung bringen.', hist: true, richtung: 'europa',
        ergebnis: 'Die Nationalversammlung ratifiziert die Montanunion mit 377 zu 233 Stimmen.',
        w: { europa: 6, brd: 4 }, setze: ['montanunion_ratifiziert'], dient: { europa: 1.2, deutschland_einbinden: 1 } },
      { text: 'Die Abstimmung platzen lassen – die Stahlindustrie hat recht.', richtung: 'national',
        ergebnis: 'Die Nationalversammlung lehnt die Montanunion ab. In Bonn und Washington herrscht Fassungslosigkeit.',
        w: { europa: -10, usa: -8, brd: -10 }, loesche: ['montanunion'],
        bei: { brd: { w: { europa: -8, frankreich: -6 }, loesche: ['montanunion'], ergebnis: 'Die französische Nationalversammlung hat die Montanunion abgelehnt. Die Gemeinschaft für Kohle und Stahl kommt nicht zustande.' } },
        dient: { deutschland_klein: 1, europa: -1.2 } },
    ],
    historisch: 'Die Nationalversammlung ratifizierte den Vertrag am 13. Dezember 1951. Die Montanunion trat im Juli 1952 in Kraft.',
  },
  {
    id: 'fr_schulstreit',
    titel: 'Staatsgeld für katholische Schulen?',
    datum: 'September 1951',
    ab: 1951.2, ordnung: 9,
    wenn: s => vierte(s) && s.regierung.includes('MRP'),
    absender: 'Fraktion des MRP',
    inland: true,
    text: s => `Die neue Nationalversammlung hat eine Mehrheit für Zuschüsse an die katholischen Privatschulen: die Gesetze Marie und Barangé, die Stipendien und eine Beihilfe pro Schüler auch für konfessionelle Schulen vorsehen. Für den MRP und die Rechte eine Frage der Gerechtigkeit. Für die Sozialisten ein Angriff auf die Laizität der Republik – sie drohen, die Regierung zu verlassen.${s.regierung.includes('SFIO') ? '\n\nOhne die Sozialisten hätte die Dritte Kraft keine Mehrheit mehr.' : ''}`,
    optionen: [
      { text: 'Die Schulgesetze verabschieden.', hist: true, richtung: 'kirche',
        ergebnis: s => `Die Gesetze Marie und Barangé werden verabschiedet. ${s.regierung.includes('SFIO') ? 'Die Sozialisten gehen in die Opposition – die Dritte Kraft ist zerbrochen.' : 'Die Laizisten protestieren.'}`,
        aktion: st => { if (st.regierung.includes('SFIO')) { st.f.schulstreit_bruch = true; st.regierung = st.regierung.filter(p => p !== 'SFIO'); } },
        dient: { stabilitaet: -0.3, sozial: -0.3 } },
      { text: 'Die Laizität verteidigen: keine Zuschüsse für Privatschulen.', richtung: 'laizitaet',
        ergebnis: 'Die Regierung lässt die Schulgesetze fallen. Der MRP ist empört, die Bischöfe protestieren.',
        dient: { stabilitaet: 0.3 } },
    ],
    historisch: 'Die Gesetze Marie und Barangé wurden im September 1951 verabschiedet. Der Schulstreit trieb die SFIO aus der Regierung und beendete die „Dritte Kraft“; bis 1956 regierte die rechte Mitte.',
  },

  // ------------------------------------------------------------------ 1952/I
  {
    id: 'fr_evg_unterschrift',
    titel: 'Den EVG-Vertrag unterzeichnen?',
    datum: '27. Mai 1952',
    ausloeser: 'westvertraege', ausloeserVon: 'brd',
    ordnung: 5.3,
    absender: 'Delegation bei den EVG-Verhandlungen',
    text: s => `${kanzler(s)} hat in ${bonn(s)} den Deutschlandvertrag unterzeichnet. Nun soll in Paris der Vertrag über die Europäische Verteidigungsgemeinschaft folgen: sechs Länder, eine Armee, ein gemeinsamer Haushalt. Die Bundesrepublik stellt zwölf Divisionen.

Unterschreibt Frankreich, beginnt der Kampf um die Ratifizierung. Unterschreibt es nicht, steht Paris allein gegen Washington, London und Bonn.`,
    optionen: [
      { text: 'Unterzeichnen.', hist: true, richtung: ['europa', 'atlantisch'],
        ergebnis: 'Die Außenminister der sechs Länder unterzeichnen in Paris den EVG-Vertrag.',
        w: { usa: 6, europa: 4, brd: 4 }, setze: ['evg_unterzeichnet'], dient: { deutschland_einbinden: 1, westbindung: 0.8, europa: 0.8 } },
      { text: 'Die Unterschrift verweigern – deutsche Soldaten sind zu früh.', richtung: 'national',
        ergebnis: 'Paris unterzeichnet den EVG-Vertrag nicht. Die europäische Armee ist tot, bevor sie geboren ist.',
        w: { usa: -14, brd: -12, europa: -5, grossbritannien: -4 },
        bei: { brd: { w: { frankreich: -8, europa: -4 }, setze: ['evg_gescheitert'], ergebnis: 'Paris hat den EVG-Vertrag nicht unterzeichnet. Die europäische Armee wird es nicht geben; der Deutschlandvertrag hängt in der Luft.' } },
        dient: { deutschland_klein: 1.5, westbindung: -0.8 } },
    ],
    historisch: 'Der EVG-Vertrag wurde am 27. Mai 1952 in Paris unterzeichnet, einen Tag nach dem Deutschlandvertrag in Bonn.',
  },
  {
    id: 'fr_tunesien',
    titel: 'Unruhe in Tunesien',
    datum: 'Januar 1952',
    ab: 1952.1, ordnung: 1,
    absender: 'Generalresident in Tunis',
    text: `Die tunesische Unabhängigkeitspartei Néo-Destour verlangt die innere Autonomie. Der neue Generalresident Jean de Hauteclocque hält davon nichts. Es gibt Streiks und Anschläge. Er will Habib Bourguiba und die Führung der Partei verhaften lassen.`,
    optionen: [
      { text: 'Bourguiba verhaften und den Protektoratsstatus verteidigen.', hist: true, richtung: 'kolonial',
        ergebnis: 'Bourguiba wird verhaftet und auf eine Insel verbannt. In Tunesien beginnt ein Kleinkrieg.',
        w: { rang: -2, usa: -2, armee: 2 }, setze: ['tunesien_repression'], dient: { kolonien: 1 } },
      { text: 'Mit dem Néo-Destour über innere Autonomie verhandeln.', richtung: 'dekolonisation',
        ergebnis: 'Paris lässt Gespräche über eine schrittweise Autonomie beginnen. Die Siedler toben.',
        w: { rang: 1, armee: -3, usa: 2 }, setze: ['tunesien_autonomie'], dient: { frieden_kolonien: 1, kolonien: -0.5 } },
    ],
    historisch: 'Bourguiba wurde im Januar 1952 verhaftet. Erst Mendès France gewährte Tunesien 1954 die innere Autonomie; 1956 wurde das Land unabhängig.',
  },

  // ------------------------------------------------------------------ 1953/I
  {
    id: 'fr_zusatzprotokolle',
    titel: 'Gaullistische Stimmen für die Regierung',
    datum: 'Januar 1953',
    ab: 1953.1, ordnung: 1,
    wenn: s => vierte(s) && !!s.f.evg_unterzeichnet && !s.weltflags.evg,
    absender: 'Fraktion der Gaullisten',
    text: s => `Um im Amt zu bleiben, braucht die Regierung ${chef(s)} Stimmen von den Gaullisten. Deren Preis: Die EVG darf so, wie sie unterzeichnet wurde, nicht ratifiziert werden. Frankreich soll Zusatzprotokolle verlangen – eigene Kommandogewalt über seine Truppen in Übersee, Bindung der Briten, eine Lösung der Saarfrage vorab.

In Bonn und Washington würde man das als Hinhaltetaktik verstehen.`,
    optionen: [
      { text: 'Zusatzprotokolle verlangen und die Gaullisten an Bord holen.', hist: true, richtung: 'national',
        ergebnis: 'Paris verlangt Zusatzprotokolle zur EVG. Die Regierung hat ihre Mehrheit; die Ratifizierung rückt in die Ferne.',
        w: { mehrheit: 10, usa: -4, brd: -4 }, setze: ['evg_protokolle'], dient: { stabilitaet: 0.8, deutschland_klein: 0.6, europa: -0.4 } },
      { text: 'Den Vertrag ohne Änderungen zur Ratifizierung vorlegen.', richtung: ['europa', 'atlantisch'],
        ergebnis: 'Die Regierung legt den EVG-Vertrag unverändert vor. Die Gaullisten kündigen ihr den Kampf an.',
        w: { mehrheit: -10, usa: 5, brd: 4, europa: 2 }, dient: { europa: 1, deutschland_einbinden: 1, stabilitaet: -0.6 } },
    ],
    historisch: 'Die Regierung René Mayer sicherte sich im Januar 1953 die Unterstützung der Gaullisten mit dem Versprechen von Zusatzprotokollen zur EVG.',
  },

  // ------------------------------------------------------------------ 1953/II
  {
    id: 'fr_streik1953',
    titel: 'Der Generalstreik im August',
    datum: 'August 1953',
    ab: 1953.2, ordnung: 8,
    wenn: vierte,
    absender: 'Ministerium für Arbeit',
    inland: true,
    text: `Die Regierung hat per Dekret das Rentenalter im öffentlichen Dienst heraufgesetzt, um zu sparen. Die Antwort ist der größte Streik seit 1936: Post, Eisenbahn, Elektrizitätswerke, Metro stehen still – mitten in den Sommerferien. Vier Millionen Menschen sind im Ausstand.`,
    optionen: [
      { text: 'Hart bleiben und die Dekrete durchsetzen.', richtung: 'sparen',
        ergebnis: 'Die Regierung bleibt hart. Nach drei Wochen bröckelt der Streik; die Verbitterung bleibt.',
        w: { haushalt: 4, ansehen: -5, preisdruck: -1 }, dient: { stabilitaet: 0.3, sozial: -0.8 } },
      { text: 'Die Dekrete zurücknehmen und verhandeln.', hist: true, richtung: 'sozial',
        ergebnis: 'Die Regierung nimmt die Rentendekrete zurück. Der Streik endet; die Sparpläne sind dahin.',
        w: { haushalt: -3, ansehen: 2 }, dient: { sozial: 0.8, stabilitaet: 0.3 } },
    ],
    historisch: 'Die Streiks vom August 1953 legten Frankreich drei Wochen lang lahm. Die Regierung Laniel nahm die umstrittenen Dekrete schließlich zurück.',
  },
  {
    id: 'fr_marokko_sultan',
    titel: 'Der Sultan von Marokko',
    datum: 'August 1953',
    ab: 1953.2, ordnung: 8.5,
    absender: 'Generalresident in Rabat',
    text: `Sultan Mohammed ben Youssef unterstützt offen die marokkanische Unabhängigkeitsbewegung. Der Generalresident und der mächtige Pascha von Marrakesch, El Glaoui, wollen ihn absetzen und durch einen gefügigen Verwandten ersetzen. Die Armee steht bereit.`,
    optionen: [
      { text: 'Den Sultan absetzen und nach Madagaskar verbannen.', hist: true, richtung: 'kolonial',
        ergebnis: 'Mohammed ben Youssef wird abgesetzt und ins Exil gebracht. Marokko wird unruhig; aus dem verbannten Sultan wird ein Nationalheld.',
        w: { rang: -3, armee: 2, usa: -2 }, setze: ['marokko_sultan_exil'], dient: { kolonien: 1 } },
      { text: 'Den Sultan im Amt lassen und über Reformen verhandeln.', richtung: 'dekolonisation',
        ergebnis: 'Paris pfeift den Generalresidenten zurück. Die Siedler und El Glaoui sind empört.',
        w: { rang: 1, armee: -3 }, dient: { frieden_kolonien: 0.8, kolonien: -0.5 } },
    ],
    historisch: 'Der Sultan wurde am 20. August 1953 abgesetzt und nach Korsika, später nach Madagaskar verbannt. 1955 musste Frankreich ihn zurückholen; 1956 wurde Marokko unabhängig.',
  },

  // ------------------------------------------------------------------ 1954/I
  {
    id: 'fr_dien_bien_phu',
    titel: 'Điện Biên Phủ',
    datum: 'März bis Mai 1954',
    ab: 1954.1, ordnung: 3,
    wenn: indochinakrieg,
    absender: 'General Navarre, Oberbefehlshaber in Indochina',
    ascii: 'dschungel',
    text: s => `Im Talkessel von Điện Biên Phủ, weit im Nordwesten, hat General Navarre eine Festung errichten lassen, um die Viet Minh zur offenen Schlacht zu zwingen. Doch General Giáp hat Artillerie auf die umliegenden Hügel geschafft – zerlegt, auf Fahrrädern und von Trägern über Dschungelpfade. Seit dem 13. März liegen die Stellungen unter Beschuss, die Landebahn ist zerstört, die 13.000 Mann werden nur noch aus der Luft versorgt.

In Genf soll im April eine Konferenz über Korea und Indochina beginnen. Generalstabschef Ély ist nach Washington geflogen: Admiral Radford erwägt Luftangriffe, um die Festung zu entsetzen – sogar von Atombomben ist die Rede.${s.w.indochina < 25 ? '\n\nDie Lage in Indochina ist ohnehin verzweifelt.' : ''}`,
    optionen: [
      { text: 'Washington offiziell um Luftangriffe bitten.', richtung: 'atlantisch',
        ergebnis: 'Paris bittet die Vereinigten Staaten offiziell um Luftangriffe auf die Stellungen der Viet Minh.',
        rueckfrage: { land: 'usa', id: 'usa_vautour' },
        antworten: {
          ja: { zufall: [
            { p: 0.45, ergebnis: 'Amerikanische Bomber greifen die Artilleriestellungen an. Die Festung hält; in Genf verhandelt Paris aus einer Position der Stärke.',
              w: { indochina: 12, usa: 4, rang: 2, armee: 4 } },
            { ergebnis: 'Die Bomber kommen, aber zu spät. Am 7. Mai fällt Điện Biên Phủ.',
              w: { indochina: -18, armee: -8, rang: -6 }, setze: ['dien_bien_phu'] } ] },
          nein: { ergebnis: 'Washington lehnt ab, London ebenso. Am 7. Mai fällt Điện Biên Phủ; 11.000 Mann gehen in Gefangenschaft.',
            w: { indochina: -20, armee: -8, rang: -8, usa: -3 }, setze: ['dien_bien_phu'] },
        },
        dient: { kolonien: 1, westbindung: 0.4, unabhaengigkeit: -0.6 } },
      { text: 'Die Festung halten, so lange es geht, und auf die Genfer Konferenz setzen.', hist: true,
        ergebnis: 'Paris setzt auf Genf. Am 7. Mai, einen Tag vor Beginn der Indochina-Beratungen, fällt Điện Biên Phủ; 11.000 Mann gehen in Gefangenschaft.',
        w: { indochina: -20, armee: -8, rang: -8 }, setze: ['dien_bien_phu'], dient: { frieden_kolonien: 0.6 } },
      { text: 'Wehrpflichtige nach Indochina schicken.', richtung: 'kolonial',
        ergebnis: 'Zum ersten Mal sollen Wehrpflichtige nach Indochina. Das Land ist in Aufruhr, die Mehrheit zerbröckelt.',
        w: { indochina: 6, mehrheit: -18, kriegsmuede: 6, ansehen: -6, haushalt: -4 },
        zufall: [
          { p: 0.4, ergebnis: 'Die Verstärkungen kommen rechtzeitig. Die Festung hält.', w: { indochina: 6, armee: 4 } },
          { ergebnis: 'Die Verstärkungen kommen zu spät. Am 7. Mai fällt Điện Biên Phủ.', w: { indochina: -16, armee: -6, rang: -6 }, setze: ['dien_bien_phu'] },
        ],
        dient: { kolonien: 1.5, frieden_kolonien: -0.8 } },
    ],
    historisch: 'Điện Biên Phủ fiel am 7. Mai 1954. Eisenhower lehnte die „Operation Vautour“ ab, weil London nicht mitmachen wollte und der Kongress Bedingungen stellte. Die Niederlage brachte die Regierung Laniel zu Fall.',
  },

  // ------------------------------------------------------------------ 1954/II
  {
    id: 'fr_genf',
    titel: 'Die Genfer Konferenz',
    datum: 'Juli 1954',
    ab: 1954.2, bis: 1956.2, ordnung: 3,
    wenn: s => indochinakrieg(s) && (s.f.dien_bien_phu || s.w.indochina < 30 || s.f.indochina_verhandlung || s.zeit >= 1955.1),
    absender: 'Französische Delegation in Genf',
    ascii: 'dschungel',
    text: s => `In Genf verhandeln Frankreich, Großbritannien, die Sowjetunion, China, die Vereinigten Staaten und die Parteien des Indochina-Kriegs. Molotow und Tschou En-lai drängen Ho Chi Minh zu einem Kompromiss: Vietnam soll entlang einer Demarkationslinie geteilt werden, in zwei Jahren sollen gesamtvietnamesische Wahlen stattfinden. Laos und Kambodscha werden unabhängig.${s.lager === 'mendes' ? '\n\nDu hast der Nationalversammlung versprochen, binnen dreißig Tagen einen Waffenstillstand zu schließen – oder zurückzutreten.' : ''}`,
    optionen: [
      { text: 'Den Waffenstillstand unterzeichnen: Teilung am 17. Breitengrad.', hist: true, richtung: 'dekolonisation',
        ergebnis: 'In Genf wird der Waffenstillstand unterzeichnet. Nach acht Jahren endet der Indochina-Krieg; Vietnam wird am 17. Breitengrad geteilt.',
        w: { kriegsmuede: -6, rang: -3, ansehen: 8, armee: -6, haushalt: 4, moskau: 4 },
        setze: ['indochina_beendet'], dient: { frieden_kolonien: 1.6, kolonien: -0.6 } },
      { text: 'Weiterkämpfen und auf amerikanische Hilfe hoffen.', richtung: 'kolonial',
        ergebnis: 'Paris lässt die Konferenz ohne Ergebnis enden. Der Krieg geht weiter.',
        w: { ansehen: -6, kriegsmuede: 3, mehrheit: -10 }, dient: { kolonien: 1.3, frieden_kolonien: -1 } },
    ],
    historisch: 'Mendès France, der am 18. Juni 1954 Ministerpräsident geworden war, schloss in der Nacht zum 21. Juli den Waffenstillstand von Genf. Die vereinbarten Wahlen in Vietnam fanden nie statt.',
  },
  {
    id: 'fr_karthago',
    titel: 'Autonomie für Tunesien',
    datum: '31. Juli 1954',
    ab: 1954.2, bis: 1955.2, ordnung: 7,
    wenn: s => !s.f.maghreb_unabhaengig,
    absender: 'Ministerium für marokkanische und tunesische Angelegenheiten',
    text: `In Tunesien kämpfen bewaffnete Gruppen, die „Fellaghas“, gegen die französische Herrschaft. Frankreich kann nicht in Indochina und in Nordafrika zugleich Krieg führen. Eine Möglichkeit: nach Tunis fliegen und dem Bey vor Ort die innere Autonomie Tunesiens anbieten.`,
    optionen: [
      { text: 'Nach Karthago fliegen und Tunesien die innere Autonomie zusagen.', hist: true, richtung: 'dekolonisation',
        ergebnis: 'In Karthago sagt der Regierungschef Tunesien die innere Autonomie zu. Die Kämpfe flauen ab.',
        w: { rang: 2, armee: -3, ansehen: 3, usa: 2 }, setze: ['tunesien_autonomie'], dient: { frieden_kolonien: 1, kolonien: -0.4 } },
      { text: 'Die Fellaghas militärisch niederkämpfen.', richtung: 'kolonial',
        ergebnis: 'Paris schickt Truppen nach Tunesien. Der Kleinkrieg geht weiter.',
        w: { haushalt: -2, rang: -2, armee: 2 }, dient: { kolonien: 1 } },
    ],
    historisch: 'Mendès France flog am 31. Juli 1954 überraschend nach Tunesien und verkündete in Karthago die innere Autonomie. 1956 wurde Tunesien unabhängig.',
  },
  {
    id: 'fr_evg_bruessel',
    titel: 'Die EVG: Zusatzprotokolle?',
    datum: 'August 1954',
    ab: 1954.2, bis: 1955.1, ordnung: 7.5,
    wenn: s => !!s.f.evg_unterzeichnet && !s.weltflags.evg && !s.weltflags.evg_bruessel,
    absender: 'Quai d’Orsay',
    text: s => `Zwei Jahre nach der Unterzeichnung hat Frankreich den EVG-Vertrag noch immer nicht ratifiziert. Die anderen fünf Länder haben es getan oder stehen kurz davor. Die Nationalversammlung ist tief gespalten: Gaullisten und Kommunisten lehnen den Vertrag ab, die Sozialisten sind halbiert, die Radikalen auch. Washington droht mit einer „schmerzlichen Überprüfung“ seiner Europapolitik.

Auf einer Konferenz in Brüssel könntest du von den Partnern Zusatzprotokolle verlangen: Vetorecht für acht Jahre, Sonderrechte für französische Truppen. ${kanzler(s)} wird das als Diskriminierung empfinden.`,
    optionen: [
      { text: 'In Brüssel Zusatzprotokolle verlangen.', hist: true, richtung: 'national',
        ergebnis: 'Paris verlangt in Brüssel weitreichende Zusatzprotokolle zur EVG.',
        w: { usa: -2, mehrheit: 4 }, setze: ['evg_protokolle'],
        aktion: (s, a) => a.sende('brd', 'evg_protokolle'),
        dient: { deutschland_klein: 0.6, stabilitaet: 0.5 } },
      { text: 'Den Vertrag ohne Änderungen zur Abstimmung stellen.', richtung: 'europa',
        ergebnis: 'Paris verzichtet auf neue Forderungen. Die Nationalversammlung soll über den Vertrag abstimmen, wie er ist.',
        w: { usa: 3, brd: 3, mehrheit: -12 },
        aktion: (s, a) => a.weltflag('evg_bruessel', 'ohne'),
        dient: { europa: 0.8, deutschland_einbinden: 0.8 } },
    ],
    historisch: 'Auf der Brüsseler Konferenz vom 19. bis 22. August 1954 lehnten die fünf Partner die Forderungen von Mendès France ab. Eine Woche später scheiterte die EVG in Paris.',
  },
  {
    id: 'fr_evg_abstimmung',
    titel: 'Die EVG vor der Nationalversammlung',
    datum: '30. August 1954',
    ab: 1954.2, bis: 1955.1, ordnung: 8.2,
    wenn: s => !!s.f.evg_unterzeichnet && !s.weltflags.evg && !!s.weltflags.evg_bruessel,
    absender: 'Präsident der Nationalversammlung',
    ascii: 'flagge',
    text: s => `${s.weltflags.evg_bruessel === 'entgegen' ? `${kanzler(s)} ist in Brüssel weit entgegengekommen.` : s.weltflags.evg_bruessel === 'hart' ? `${kanzler(s)} hat in Brüssel jede weitere Änderung abgelehnt.` : 'Der Vertrag liegt unverändert vor.'} Nun muss die Nationalversammlung entscheiden. Nach Zählung der Fraktionen ist eine Mehrheit gegen den Vertrag wahrscheinlich – aber nicht sicher.

Du kannst die Abstimmung mit der Vertrauensfrage verbinden: Wer gegen die EVG stimmt, stürzt dann die Regierung. Oder du lässt die Abgeordneten frei entscheiden. Oder du ziehst den Vertrag zurück.`,
    optionen: [
      { text: 'Die Vertrauensfrage stellen.', richtung: 'europa',
        zufall: [
          { p: s => evgChance(s, { vertrauensfrage: true }),
            ergebnis: 'Mit knapper Mehrheit ratifiziert die Nationalversammlung die EVG. Europa bekommt eine gemeinsame Armee.',
            w: { europa: 12, usa: 8, brd: 8, rang: 2 },
            aktion: (s, a) => a.weltflag('evg', 'ratifiziert'),
            bei: { brd: { titel: 'Paris ratifiziert die EVG', w: { europa: 14, frankreich: 8, souveraenitaet: 8, usa: 6, moskau: -8 }, setze: ['evg', 'saar_zugestaendnis'], ergebnis: 'Die französische Nationalversammlung hat die EVG ratifiziert. Die Europäische Verteidigungsgemeinschaft kann entstehen.' } } },
          { ergebnis: 'Die Nationalversammlung lehnt die EVG ab und stürzt die Regierung.',
            w: { europa: -6, usa: -8, mehrheit: -60 },
            aktion: (s, a) => a.weltflag('evg', 'gescheitert'),
            bei: { brd: { titel: 'Die EVG ist gescheitert', w: { europa: -6, ansehen: -3, frankreich: -4 }, setze: ['evg_gescheitert'], ergebnis: 'Die französische Nationalversammlung hat die EVG abgelehnt. Das Herzstück der Bonner Westpolitik liegt in Trümmern.' } } },
        ],
        dient: { europa: 1, deutschland_einbinden: 1, stabilitaet: -0.6 } },
      { text: 'Die Abgeordneten ohne Vertrauensfrage abstimmen lassen.', hist: true,
        zufall: [
          { p: s => evgChance(s),
            ergebnis: 'Überraschend stimmt die Nationalversammlung zu. Die Europäische Verteidigungsgemeinschaft kann entstehen.',
            w: { europa: 12, usa: 8, brd: 8 },
            aktion: (s, a) => a.weltflag('evg', 'ratifiziert'),
            bei: { brd: { titel: 'Paris ratifiziert die EVG', w: { europa: 12, frankreich: 6, souveraenitaet: 10, usa: 6, moskau: -8 }, setze: ['evg'], ergebnis: 'Überraschend hat die französische Nationalversammlung die EVG ratifiziert.' } } },
          { ergebnis: 'Die Nationalversammlung lehnt es mit 319 zu 264 Stimmen ab, über den Vertrag überhaupt zu beraten. Gaullisten und Kommunisten singen die Marseillaise.',
            w: { europa: -6, usa: -6, brd: -6 },
            aktion: (s, a) => a.weltflag('evg', 'gescheitert'),
            bei: { brd: { titel: 'Die EVG ist gescheitert', w: { europa: -6, ansehen: -3, frankreich: -4 }, setze: ['evg_gescheitert'], ergebnis: 'Die französische Nationalversammlung hat die EVG mit einem Verfahrensantrag abgelehnt, ohne Aussprache. Das Herzstück der Bonner Westpolitik liegt in Trümmern.' } } },
        ],
        dient: { stabilitaet: 0.8, deutschland_klein: 0.4 } },
      { text: 'Den Vertrag zurückziehen.', richtung: 'national',
        ergebnis: 'Die Regierung zieht den EVG-Vertrag zurück. In Washington und Bonn ist man fassungslos.',
        w: { europa: -8, usa: -10, brd: -8 },
        aktion: (s, a) => a.weltflag('evg', 'gescheitert'),
        bei: { brd: { titel: 'Paris zieht die EVG zurück', w: { europa: -6, ansehen: -3, frankreich: -6 }, setze: ['evg_gescheitert'], ergebnis: 'Die französische Regierung hat den EVG-Vertrag zurückgezogen. Die europäische Armee ist gescheitert.' } },
        dient: { deutschland_klein: 1.3, europa: -1 } },
    ],
    historisch: 'Am 30. August 1954 nahm die Nationalversammlung mit 319 zu 264 Stimmen einen Antrag an, die Beratung über den EVG-Vertrag abzusetzen. Mendès France hatte keine Vertrauensfrage gestellt.',
  },
  {
    id: 'fr_nato_deutschland',
    titel: 'Die Bundesrepublik in die NATO?',
    datum: 'September 1954',
    ab: 1954.2, bis: 1955.2, ordnung: 8.7,
    wenn: s => bonnImWesten(s) && !brd(s).f.evg && !brd(s).f.nato && (s.weltflags.evg === 'gescheitert' || (s.zeit >= 1954.2 && (!!s.weltflags.pleven_abgelehnt || !!brd(s).f.evg_gescheitert || !!brd(s).f.westvertraege_abgelehnt))),
    absender: 'Anthony Eden, britischer Außenminister',
    text: s => `Nach dem Scheitern der europäischen Armee hat Eden in einer Rundreise durch die Hauptstädte eine Ersatzlösung gefunden: Die Bundesrepublik wird souverän und tritt direkt der NATO bei. Der Brüsseler Pakt wird zur Westeuropäischen Union erweitert, die die deutsche Rüstung kontrolliert. Großbritannien verpflichtet sich, Truppen auf dem Kontinent zu halten – eine alte französische Forderung.

Als Preis kannst du verlangen, dass ${kanzler(s)} auf atomare, biologische und chemische Waffen verzichtet. Sagt Frankreich nein, steht es gegen alle Verbündeten.`,
    optionen: [
      { text: 'Zustimmen – mit dem Verzicht der Deutschen auf ABC-Waffen und britischen Truppen auf dem Kontinent.', hist: true, richtung: 'atlantisch',
        ergebnis: 'Auf der Londoner Konferenz stimmt Paris dem NATO-Beitritt der Bundesrepublik zu. Bonn verzichtet auf ABC-Waffen, London sagt vier Divisionen auf dem Kontinent zu.',
        w: { usa: 8, grossbritannien: 8, brd: 6 }, dient: { westbindung: 1.2, deutschland_einbinden: 0.8, deutschland_klein: 0.4 } },
      { text: 'Den NATO-Beitritt verhindern.', richtung: 'national',
        ergebnis: 'Paris legt sein Veto ein. Die Westmächte stehen vor einem Scherbenhaufen; Washington erwägt eine „periphere Verteidigung“ ohne Frankreich.',
        w: { usa: -16, grossbritannien: -12, brd: -12, moskau: 6 },
        aktion: (s, a) => a.weltflag('nato_veto'),
        bei: { brd: { titel: 'Paris blockiert', w: { frankreich: -10, usa: -2 }, setze: ['westintegration_gescheitert'], ergebnis: 'Frankreich hat sein Veto gegen den NATO-Beitritt der Bundesrepublik eingelegt. Die Westintegration ist gescheitert; das Besatzungsstatut bleibt in Kraft.' } },
        dient: { deutschland_klein: 1.8, westbindung: -1.2 } },
    ],
    historisch: 'Auf der Londoner Neunmächtekonferenz (28. September bis 3. Oktober 1954) stimmte Mendès France dem NATO-Beitritt der Bundesrepublik zu, nachdem Adenauer den ABC-Waffen-Verzicht erklärt und Eden britische Truppen auf dem Kontinent zugesagt hatte.',
  },
  {
    id: 'fr_saarstatut',
    titel: 'Die Zukunft der Saar',
    datum: 'Oktober 1954',
    ab: 1954.2, bis: 1955.1, ordnung: 9.5,
    wenn: s => bonnImWesten(s) && !brd(s).f.saar_entschieden && !brd(s).f.saarstatut && (!!brd(s).f.pariser_vertraege || !!brd(s).f.evg),
    absender: 'Quai d’Orsay',
    text: s => `Bevor Frankreich ${brd(s).f.evg ? 'die letzten EVG-Abkommen' : 'die Pariser Verträge'} ratifiziert, muss die Saarfrage gelöst sein; sonst gibt es in der Nationalversammlung keine Mehrheit. Die Saar ist wirtschaftlich mit Frankreich verbunden, politisch autonom.

Ein Vorschlag liegt bereit: ein „europäisches Statut“. Die Saar erhielte einen Kommissar der Westeuropäischen Union, bliebe wirtschaftlich an Frankreich gebunden, und die Saarländer stimmten darüber ab. ${kanzler(s)} würde wohl zustimmen – in der Hoffnung, dass die Saarländer ablehnen.`,
    optionen: [
      { text: 'Bonn das europäische Saarstatut vorschlagen.', hist: true, richtung: 'europa',
        ergebnis: 'Paris schlägt Bonn ein europäisches Statut für die Saar vor.',
        w: { usa: 3 },
        aktion: (s, a) => a.sende('brd', 'saarstatut'),
        dient: { saar: 0.8, deutschland_einbinden: 0.6, europa: 0.4 } },
      { text: 'Die Saar an Deutschland zurückgeben – gegen Gegenleistungen bei Kohle und Mosel.',
        ergebnis: 'Paris bietet Bonn die Rückgabe der Saar an, gegen Kohlelieferungen und die Kanalisierung der Mosel. Die Gaullisten sprechen von Verrat.',
        w: { brd: 14, mehrheit: -8, rang: -2 },
        bei: { brd: { titel: 'Paris gibt die Saar zurück', w: { frankreich: 10, ansehen: 5, haushalt: -2 }, setze: ['saar_zurueck', 'saar_entschieden', 'saar_nein'], ergebnis: 'Paris bietet die Rückgliederung der Saar an – gegen Kohlelieferungen und die Kanalisierung der Mosel. Die Saarfrage ist gelöst.' } },
        dient: { saar: -1.5, deutschland_einbinden: 1.2 } },
      { text: 'Auf der Bindung der Saar an Frankreich bestehen.', richtung: 'national',
        ergebnis: 'Paris lehnt jede Änderung an der Saar ab und macht die Ratifizierung davon abhängig.',
        w: { brd: -10, usa: -8, grossbritannien: -5, rang: -2 }, setze: ['saar_forderung'],
        bei: { brd: { titel: 'Paris besteht auf der Saar', w: { frankreich: -8 }, setze: ['saar_abgelehnt'], ergebnis: 'Paris besteht darauf, dass die Saar an Frankreich gebunden bleibt, und macht die Ratifizierung der Verträge davon abhängig.' } },
        dient: { saar: 1.6, deutschland_klein: 0.5 } },
    ],
    historisch: 'Das Saarstatut wurde am 23. Oktober 1954 zusammen mit den Pariser Verträgen unterzeichnet. Am 23. Oktober 1955 lehnten es die Saarländer mit 67,7 % ab.',
  },
  {
    id: 'fr_pariser_ratifizierung',
    titel: 'Die Pariser Verträge vor der Nationalversammlung',
    datum: 'Dezember 1954',
    ab: 1954.2, bis: 1955.2, ordnung: 11,
    wenn: s => !!brd(s).f.pariser_vertraege && !s.weltflags.pariser_ratifiziert && !s.weltflags.nato_veto && !s.weltflags.ratifizierung_haengt && !brd(s).f.westintegration_gescheitert,
    absender: 'Präsident der Nationalversammlung',
    text: s => `Die Pariser Verträge liegen der Nationalversammlung vor: Souveränität und NATO-Beitritt der Bundesrepublik, Westeuropäische Union, ${brd(s).f.saarstatut ? 'das Saarstatut' : 'aber keine Lösung für die Saar'}. Wenige Monate nach dem Nein zur EVG sollen die Abgeordneten nun deutsche Soldaten in der NATO billigen. In einer ersten Abstimmung ist der Vertrag bereits durchgefallen.`,
    optionen: [
      { text: 'Die Vertrauensfrage stellen und die Verträge durchbringen.', hist: true, richtung: 'atlantisch',
        ergebnis: 'Mit der Vertrauensfrage bringt die Regierung die Pariser Verträge durch – 287 zu 260 Stimmen. Im März folgt der Rat der Republik.',
        w: { usa: 6, brd: 6, mehrheit: -10 },
        aktion: (s, a) => a.weltflag('pariser_ratifiziert'),
        dient: { westbindung: 1, deutschland_einbinden: 0.8 } },
      { text: 'Die Ratifizierung von einer Lösung der Saarfrage abhängig machen.', richtung: 'national',
        wenn: s => !brd(s).f.saarstatut && !brd(s).f.saar_zurueck,
        ergebnis: 'Paris verschiebt die Ratifizierung, bis die Saarfrage gelöst ist.',
        w: { usa: -4, brd: -6 },
        aktion: (s, a) => { a.weltflag('ratifizierung_haengt'); a.sende('brd', 'saar_forderung'); },
        dient: { saar: 1.2, stabilitaet: 0.4 } },
      { text: 'Die Verträge scheitern lassen.', richtung: 'national',
        ergebnis: 'Die Nationalversammlung lehnt die Pariser Verträge ab. Die Westmächte sind entsetzt.',
        w: { usa: -16, grossbritannien: -12, brd: -14, moskau: 6 },
        aktion: (s, a) => a.weltflag('nato_veto'),
        bei: { brd: { titel: 'Paris lehnt die Verträge ab', w: { frankreich: -10 }, setze: ['westintegration_gescheitert'], ergebnis: 'Die französische Nationalversammlung hat die Pariser Verträge abgelehnt. Die Westintegration ist gescheitert.' } },
        dient: { deutschland_klein: 1.6, westbindung: -1.2 } },
    ],
    historisch: 'Die Nationalversammlung ratifizierte die Pariser Verträge am 30. Dezember 1954 im zweiten Anlauf, nachdem Mendès France die Vertrauensfrage gestellt hatte. Der Rat der Republik stimmte im März 1955 zu.',
  },
  {
    id: 'fr_toussaint',
    titel: 'Allerheiligen in Algerien',
    datum: '1. November 1954',
    ab: 1954.2, ordnung: 11,
    wenn: s => !s.f.algerienkrieg,
    absender: 'Generalgouverneur in Algier',
    ascii: 'alarm',
    text: s => `In der Nacht zu Allerheiligen hat eine bisher unbekannte „Nationale Befreiungsfront“ (FLN) in ganz Algerien rund dreißig Anschläge verübt: auf Kasernen, Polizeiposten, Bauernhöfe. Es gibt mehrere Tote. Ein Lehrerehepaar aus Frankreich wurde aus einem Bus gezerrt und erschossen.

Algerien ist keine Kolonie, sondern besteht aus drei französischen Départements – mit einer Million Europäern und neun Millionen Muslimen, die politisch kaum Rechte haben.${s.w.algerien < 55 ? ' Die Lage ist seit Jahren angespannt.' : ''} Innenminister François Mitterrand sagt: „Algerien ist Frankreich.“`,
    optionen: [
      { text: 'Mit aller Härte antworten: Verstärkung schicken, die FLN zerschlagen.', hist: true, richtung: 'kolonial',
        ergebnis: 'Paris schickt Truppen nach Algerien. „Die einzige Verhandlung ist der Krieg“, erklärt die Regierung.',
        w: { algerien: -10, armee: 4, haushalt: -2 }, setze: ['algerienkrieg', 'algerien_truppen'], dient: { kolonien: 1.3, frieden_kolonien: -0.6 } },
      { text: 'Härte und Reformen zugleich: gleiche Rechte für die Muslime versprechen.',
        ergebnis: 'Paris schickt Truppen und kündigt Reformen an. Die Siedler wehren sich gegen jede Gleichstellung.',
        w: { algerien: -8, armee: 1, haushalt: -2, rang: 1 }, setze: ['algerienkrieg', 'algerien_reformen'], dient: { kolonien: 0.8, frieden_kolonien: 0.4 } },
      { text: 'Mit den algerischen Nationalisten über Autonomie sprechen.', richtung: 'dekolonisation',
        zufall: [
          { p: 0.3, ergebnis: 'Messali Hadj und gemäßigte Nationalisten nehmen das Angebot an. Die FLN bleibt eine kleine Gruppe im Untergrund; Algerien bekommt ein eigenes Parlament.',
            w: { algerien: 8, armee: -10, rang: 3 }, setze: ['algerien_reformen', 'algerien_autonomie'] },
          { ergebnis: 'Die FLN lehnt ab und weitet den Aufstand aus. In Algier protestieren die Siedler gegen die „Abtrünnigen in Paris“.',
            w: { algerien: -12, armee: -8 }, setze: ['algerienkrieg', 'algerien_verhandlung'] },
        ],
        dient: { frieden_kolonien: 1.4, kolonien: -1 } },
    ],
    historisch: 'Mit der „Toussaint rouge“ begann der Algerienkrieg. Die Regierung Mendès France antwortete mit Härte; Innenminister Mitterrand erklärte: „L’Algérie, c’est la France.“ Der Krieg dauerte bis 1962.',
  },
];
