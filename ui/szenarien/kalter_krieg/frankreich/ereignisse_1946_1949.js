// Frankreich: Vorlagen 1946 bis 1949 – Provisorische Regierung, Verfassung, Indochina,
// Bruch des Tripartisme, Marshallplan, Weststaat und Berliner Blockade
import { zeitIndex } from '../../../engine.js';
import { LAGER, startMehrheit, notiereChef, indochinakrieg } from './modell.js';
import { deutschlandBesetzt } from './hilfen.js';

const offenIndochina = s => !indochinakrieg(s) && !s.f.indochina_beendet;

/** Die Verfassung tritt in Kraft: Die nächste Wahl (im selben Halbjahr) wählt die erste Nationalversammlung */
function verfassungInKraft(s, { praesidial = false } = {}) {
  s.f.provisorisch = false;
  if (praesidial) s.f.praesidialverfassung = true;
  if (!(s.wahlplan || []).some(z => zeitIndex(z) === zeitIndex(s.zeit))) s.wahlplan = [...(s.wahlplan || []), s.zeit];
}

/** Ein Entwurf ist gescheitert: noch einmal eine Verfassunggebende Versammlung wählen */
function neueVersammlung(s) {
  if (!(s.wahlplan || []).some(z => zeitIndex(z) === zeitIndex(s.zeit))) s.wahlplan = [...(s.wahlplan || []), s.zeit];
}

/** Die Kommunisten verlassen die Regierung: Aus dem Tripartisme wird die „Dritte Kraft“ */
function ohneKommunisten(s) {
  s.f.pcf_raus = true;
  s.lager = 'dritte_kraft';
  s.regierung = [...LAGER.dritte_kraft.parteien];
  s.w.rueckhalt = Math.min(s.w.rueckhalt, startMehrheit(s, 'dritte_kraft'));
  notiereChef(s);
}

export default [
  // ------------------------------------------------------------------ 1946/I
  {
    id: 'fr_ho_sainteny',
    titel: 'Ein freier Staat Vietnam?',
    datum: '6. März 1946',
    ab: 1946.1, bis: 1946.1, ordnung: 3,
    absender: 'Jean Sainteny, Kommissar der Republik in Tonkin',
    ascii: 'dschungel',
    text: s => `In Hanoi hat Ho Chi Minh im September die „Demokratische Republik Vietnam“ ausgerufen. Im Süden hat General Leclerc Saigon wieder unter französische Kontrolle gebracht; im Norden stehen noch chinesische Truppen. Ohne eine Einigung mit Ho Chi Minh kann das Expeditionskorps nicht nach Tonkin.

Sainteny hat mit Ho Chi Minh ein Abkommen ausgehandelt: Frankreich erkennt Vietnam als „freien Staat“ mit eigener Regierung, eigenem Parlament und eigener Armee innerhalb der Indochinesischen Föderation und der Französischen Union an; 15.000 französische Soldaten dürfen für fünf Jahre in den Norden. Über die Vereinigung der drei Landesteile soll eine Volksabstimmung entscheiden. Hochkommissar d’Argenlieu hält das für einen Ausverkauf. Was soll ${s.regierungschef} Sainteny antworten?`,
    optionen: [
      { text: 'Unterzeichnen lassen: Vietnam ein freier Staat in der Französischen Union.', hist: true, richtung: 'dekolonisation',
        ergebnis: 'Sainteny und Ho Chi Minh unterzeichnen das Abkommen. Leclercs Truppen landen in Haiphong und ziehen kampflos in Hanoi ein.',
        w: { indochina: 4, armee: -1 }, setze: ['ho_sainteny'], dient: { frieden_kolonien: 0.6, kolonien: 0.6, stabilitaet: 0.3 } },
      { text: 'Ablehnen und den Norden mit Gewalt zurückerobern.', richtung: 'kolonial',
        ergebnis: 'Paris lässt das Abkommen platzen. Das Expeditionskorps soll Tonkin erobern; Ho Chi Minh ruft zum Widerstand auf. In Indochina beginnt ein Krieg.',
        w: { indochina: 5, armee: 3, haushalt: -4, kriegsmuede: 2, moskau: -3, usa: -2 }, setze: ['indochinakrieg'], dient: { kolonien: 0.9, frieden_kolonien: -1 } },
      { text: 'Weiter gehen: Ein vereintes, unabhängiges Vietnam, verbunden mit Frankreich nur durch Verträge.', richtung: 'dekolonisation',
        ergebnis: 'Paris erkennt die Unabhängigkeit Vietnams an. Ho Chi Minh reist als Staatsgast nach Paris; d’Argenlieu tritt aus Protest zurück, die Kolonialoffiziere sprechen von Verrat. (Fiktion)',
        w: { armee: -8, moskau: 4, usa: 2, kriegsmuede: -1 }, setze: ['indochina_beendet', 'indochina_ausgleich'], dient: { frieden_kolonien: 1.4, kolonien: -1.3 } },
    ],
    historisch: 'Das Abkommen Ho–Sainteny wurde am 6. März 1946 unterzeichnet. Am 18. März zogen französische Truppen in Hanoi ein. Die vereinbarte Volksabstimmung fand nie statt.',
  },
  {
    id: 'fr_referendum1',
    titel: 'Der erste Verfassungsentwurf',
    datum: '5. Mai 1946',
    ab: 1946.1, bis: 1946.1, ordnung: 4.9,
    wenn: s => !!s.f.provisorisch,
    absender: 'Präsident der Verfassunggebenden Versammlung Vincent Auriol',
    ascii: 'urne_fr',
    text: `Die Verfassunggebende Versammlung hat mit den Stimmen der Kommunisten und Sozialisten einen Entwurf beschlossen: eine einzige, allmächtige Kammer, ein schwacher Präsident, kein Senat. Die Volksrepublikaner sind dagegen, weil sie eine „Diktatur der Versammlung“ fürchten – und die Herrschaft der Kommunisten, der stärksten Partei. Am 5. Mai stimmt das Volk ab.

Die Regierung kann für den Entwurf werben, ihn zurückziehen und neu verhandeln lassen oder sich heraushalten. Scheitert er, muss eine neue Versammlung gewählt werden.`,
    optionen: [
      { text: 'Für den Entwurf werben.', hist: true, richtung: 'sozial',
        zufall: [
          { p: 0.35, ergebnis: 'Die Franzosen nehmen die Verfassung knapp an. Im Juni wird die erste Nationalversammlung der Vierten Republik gewählt – eine einzige Kammer ohne Senat. (Fiktion)',
            w: { ansehen: 2 }, aktion: s => { s.f.verfassung1 = 'ja'; verfassungInKraft(s); } },
          { ergebnis: 'Die Franzosen lehnen den Entwurf mit 53 Prozent ab. Im Juni muss eine neue Verfassunggebende Versammlung gewählt werden.',
            w: { ansehen: -2 }, aktion: s => { s.f.verfassung1 = 'nein'; } },
        ],
        dient: { sozial: 0.4, stabilitaet: 0.3 } },
      { text: 'Den Entwurf zurückziehen und einen Kompromiss mit den Volksrepublikanern suchen.', richtung: 'kirche',
        ergebnis: 'Die Regierung zieht den Entwurf zurück. Die Kommunisten sind empört; im Juni wird eine neue Versammlung gewählt, die einen Kompromiss finden soll.',
        w: { rueckhalt: -8, ansehen: -1 }, aktion: s => { s.f.verfassung1 = 'zurueck'; }, dient: { stabilitaet: 0.2 } },
      { text: 'Sich heraushalten – das Volk soll frei entscheiden.',
        zufall: [
          { p: 0.25, ergebnis: 'Die Franzosen nehmen die Verfassung an. Im Juni wird die erste Nationalversammlung gewählt. (Fiktion)',
            aktion: s => { s.f.verfassung1 = 'ja'; verfassungInKraft(s); } },
          { ergebnis: 'Die Franzosen lehnen den Entwurf ab. Im Juni wird eine neue Verfassunggebende Versammlung gewählt.',
            aktion: s => { s.f.verfassung1 = 'nein'; } },
        ],
        dient: { stabilitaet: 0.2 } },
    ],
    historisch: 'Am 5. Mai 1946 lehnten 53 Prozent der Wähler den ersten Verfassungsentwurf ab – das einzige Mal in der französischen Geschichte, dass ein Verfassungsreferendum scheiterte. Am 2. Juni wurde eine zweite Verfassunggebende Versammlung gewählt.',
  },
  {
    id: 'fr_blum_byrnes',
    titel: 'Léon Blum in Washington',
    datum: '28. Mai 1946',
    ab: 1946.1, bis: 1946.1, ordnung: 5,
    absender: 'Léon Blum, Sonderbotschafter',
    text: s => `Frankreich braucht Dollar: für Kohle, Getreide, Maschinen. Léon Blum und Jean Monnet verhandeln in Washington mit Außenminister Byrnes. Die Amerikaner bieten an, fast zwei Milliarden Dollar Kriegsschulden zu streichen und neue Kredite zu geben. Im Gegenzug soll Frankreich seine Märkte öffnen – auch für Hollywood: Die französischen Kinos sollen nur noch vier Wochen im Vierteljahr für französische Filme reservieren müssen.

Die Kommunisten sprechen von einem „Ausverkauf“, die Filmschaffenden gehen auf die Straße.`,
    optionen: [
      { text: 'Annehmen. Ohne amerikanisches Geld gibt es keinen Wiederaufbau.', hist: true, richtung: 'atlantisch',
        ergebnis: 'Blum und Byrnes unterzeichnen das Abkommen. Frankreich bekommt Kredite und einen Schuldenerlass; die Kinos zeigen bald vor allem amerikanische Filme.',
        w: { usa: 6, haushalt: 7, franc: 4, impuls: 0.6, moskau: -2 }, dient: { westbindung: 0.6, modernisierung: 0.6 } },
      { text: 'Annehmen, aber über die Filmquote neu verhandeln.', richtung: 'national',
        ergebnis: 'Paris verhandelt nach. Die Kredite fallen kleiner aus, die französischen Filme behalten ihren Schutz.',
        w: { usa: 2, haushalt: 4, franc: 2 }, dient: { unabhaengigkeit: 0.3, westbindung: 0.1 } },
      { text: 'Ablehnen. Frankreich lässt sich nicht kaufen.', richtung: 'ost',
        ergebnis: 'Paris lehnt die amerikanischen Bedingungen ab. Die Kommunisten jubeln, die Kassen bleiben leer.',
        w: { usa: -8, haushalt: -3, franc: -4, moskau: 4 }, dient: { unabhaengigkeit: 1, westbindung: -0.8 } },
    ],
    historisch: 'Die Blum-Byrnes-Abkommen vom 28. Mai 1946 erließen Frankreich rund zwei Milliarden Dollar Schulden und brachten neue Kredite. Die Filmklausel löste heftige Proteste aus und wurde 1948 zugunsten des französischen Films geändert.',
  },
  {
    id: 'fr_verteidigungsministerium',
    titel: 'Die Kommunisten wollen ein Schlüsselministerium',
    datum: 'Dezember 1946',
    ab: 1946.2, bis: 1947.1, ordnung: 12.5,
    wenn: s => s.regierung.includes('PCF') && !s.f.pcf_raus,
    absender: 'Maurice Thorez, Generalsekretär der PCF',
    ascii: 'plakat_fr',
    text: s => `Die Kommunisten sind die stärkste Partei. Thorez verlangt für sie eines der drei Schlüsselministerien: Inneres, Äußeres oder Verteidigung. ${s.regierungschef} weiß, was Washington und London davon halten würden – und was die Armee dazu sagt. Ohne die Kommunisten gibt es aber keine Mehrheit.`,
    optionen: [
      { text: 'Den Kommunisten das Verteidigungsministerium geben, aber Heer, Marine und Luftwaffe eigenen Ministern unterstellen.', hist: true,
        ergebnis: 'François Billoux wird Verteidigungsminister – ohne Befehlsgewalt über die Teilstreitkräfte. Thorez ist verärgert, aber die Koalition hält.',
        w: { rueckhalt: 2, armee: -2, usa: -2 }, setze: ['pcf_verteidigung'], dient: { stabilitaet: 0.6 } },
      { text: 'Ihnen das Innenministerium mit der Polizei überlassen.', richtung: 'ost',
        ergebnis: 'Ein Kommunist wird Innenminister. In Washington und bei der Armee wächst das Misstrauen; die Partei besetzt Präfekturen mit ihren Leuten.',
        w: { rueckhalt: 6, armee: -6, usa: -8, moskau: 6 }, setze: ['pcf_inneres'], dient: { stabilitaet: 0.4, westbindung: -1 } },
      { text: 'Kein Schlüsselministerium für die Kommunisten.', richtung: 'atlantisch',
        ergebnis: 'Die Regierung verweigert den Kommunisten jedes Schlüsselministerium. Thorez droht mit dem Auszug.',
        w: { rueckhalt: -8, usa: 3, armee: 2 }, dient: { westbindung: 0.5, stabilitaet: -0.5 } },
    ],
    historisch: 'Im Januar 1947 wurde der Kommunist François Billoux Verteidigungsminister. Die drei Teilstreitkräfte wurden eigenen Ministern unterstellt, damit er keinen Zugriff auf die Truppe bekam.',
  },

  // ------------------------------------------------------------------ 1946/II
  {
    id: 'fr_fontainebleau',
    titel: 'Ho Chi Minh in Fontainebleau',
    datum: 'September 1946',
    ab: 1946.2, bis: 1946.2, ordnung: 8,
    wenn: s => !!s.f.ho_sainteny && offenIndochina(s),
    absender: 'Marius Moutet, Minister für die Überseegebiete',
    ascii: 'dschungel',
    text: `Seit Juli verhandeln in Fontainebleau Vertreter Frankreichs und Vietnams. Ho Chi Minh ist selbst in Frankreich. Doch Hochkommissar d’Argenlieu hat in Saigon eigenmächtig eine „Republik Cochinchina“ ausgerufen – der reichste Teil des Landes soll bei Frankreich bleiben. Für Ho Chi Minh ist die Einheit Vietnams nicht verhandelbar.

Die Konferenz steht vor dem Scheitern. Ho Chi Minh bittet um ein Zwischenabkommen, damit er nicht mit leeren Händen nach Hause fährt.`,
    optionen: [
      { text: 'Einen „Modus vivendi“ unterzeichnen und die großen Fragen vertagen.', hist: true,
        ergebnis: 'Ho Chi Minh und Moutet unterzeichnen ein Zwischenabkommen über Wirtschaft und Kultur. Die Frage der Einheit bleibt offen; d’Argenlieu behält in Saigon freie Hand.',
        w: { indochina: -2 }, setze: ['modus_vivendi'], dient: { kolonien: 0.6, frieden_kolonien: 0.4, stabilitaet: 0.3 } },
      { text: 'Die Einheit Vietnams zusagen und d’Argenlieu abberufen.', richtung: 'dekolonisation',
        ergebnis: 'Paris sagt die Volksabstimmung über die Einheit Vietnams zu und ruft d’Argenlieu ab. Ho Chi Minh kehrt als Partner nach Hanoi zurück; die Siedler in Saigon sprechen von Verrat. (Fiktion)',
        w: { armee: -6, moskau: 3, indochina: 2 }, setze: ['indochina_beendet', 'indochina_ausgleich'], dient: { frieden_kolonien: 1.3, kolonien: -1 } },
      { text: 'Die Konferenz abbrechen. D’Argenlieu soll durchgreifen.', richtung: 'kolonial',
        ergebnis: 'Die Konferenz von Fontainebleau scheitert. Ho Chi Minh fährt mit leeren Händen nach Hause; in Tonkin bereiten sich beide Seiten auf den Krieg vor.',
        w: { armee: 2, indochina: 2, moskau: -2 }, setze: ['argenlieu'], dient: { kolonien: 0.7, frieden_kolonien: -0.8, stabilitaet: -0.3 } },
    ],
    historisch: 'Die Konferenz von Fontainebleau scheiterte im September 1946. Ho Chi Minh unterzeichnete am 14. September mit Minister Moutet einen „Modus vivendi“, der die Kernfragen offenließ.',
  },
  {
    id: 'fr_referendum2', rueckblick: true,
    titel: 'Die zweite Verfassung',
    datum: '13. Oktober 1946',
    ab: 1946.2, bis: 1946.2, ordnung: 10,
    wenn: s => !!s.f.provisorisch,
    absender: 'Präsident der Verfassunggebenden Versammlung Vincent Auriol',
    ascii: 'urne_fr',
    text: `Die neue Versammlung hat einen Kompromiss ausgearbeitet: eine starke Nationalversammlung, daneben ein schwacher „Rat der Republik“, ein Präsident mit wenig Macht. Die Regierung hängt am Vertrauen der Abgeordneten.

General de Gaulle hat in Bayeux und Épinal ein anderes Modell vorgestellt: einen Präsidenten über den Parteien, der die Regierung ernennt und die Kammer auflösen kann. Den Entwurf der Versammlung nennt er ein Rezept für Ohnmacht. Die Kommunisten und Sozialisten wollen von einer Präsidialverfassung nichts wissen; die Volksrepublikaner schwanken.

Welche Verfassung legst du dem Volk vor?`,
    optionen: [
      { text: 'Den Kompromiss der Versammlung: die Vierte Republik.', hist: true,
        zufall: [
          { p: 0.75, ergebnis: 'Die Franzosen nehmen die Verfassung mit 53 Prozent an – bei einem Drittel Enthaltungen. Die Vierte Republik ist gegründet; im November wird die erste Nationalversammlung gewählt.',
            aktion: s => verfassungInKraft(s) },
          { ergebnis: 'Auch der zweite Entwurf scheitert. Im November wird zum dritten Mal eine Verfassunggebende Versammlung gewählt. (Fiktion)',
            w: { ansehen: -3, rueckhalt: -4 }, aktion: s => neueVersammlung(s) },
        ],
        dient: { stabilitaet: 0.5 } },
      { text: 'Eine Präsidialverfassung nach den Ideen von Bayeux.', richtung: 'national',
        zufall: [
          { p: 0.5, ergebnis: 'Gegen Kommunisten und Sozialisten nehmen die Franzosen eine Verfassung mit einem starken Präsidenten an. Er ernennt die Regierung und kann die Kammer auflösen. De Gaulle begrüßt den Entwurf, hält sich aber fern. (Fiktion)',
            w: { rueckhalt: -6, ansehen: 2 }, aktion: s => verfassungInKraft(s, { praesidial: true }) },
          { ergebnis: 'Die Präsidialverfassung scheitert am Widerstand der Linken. Im November wird zum dritten Mal eine Verfassunggebende Versammlung gewählt. (Fiktion)',
            w: { rueckhalt: -10, ansehen: -3 }, aktion: s => neueVersammlung(s) },
        ],
        dient: { stabilitaet: 0.4, sozial: -0.8 } },
    ],
    historisch: 'Am 13. Oktober 1946 nahmen 53,5 Prozent der Abstimmenden die Verfassung der Vierten Republik an; fast ein Drittel der Wahlberechtigten blieb zu Hause. Am 10. November wurde die erste Nationalversammlung gewählt, die Kommunisten wurden stärkste Partei.',
  },
  {
    id: 'fr_haiphong', rueckblick: true,
    titel: 'Haiphong',
    datum: '23. November 1946',
    ab: 1946.2, bis: 1946.2, ordnung: 11,
    wenn: offenIndochina,
    absender: 'General Valluy, Oberbefehlshaber in Indochina',
    ascii: 'schiff',
    text: s => `Im Hafen von Haiphong ist ein Streit um die Zollkontrolle in Schießereien geendet; französische Soldaten sind getötet worden. ${s.f.argenlieu ? 'Hochkommissar d’Argenlieu' : 'General Valluy'} verlangt, „den Vietnamesen eine harte Lektion zu erteilen“: Die Viet Minh sollen die Stadt räumen, sonst lässt er sie von der Flotte beschießen.

Der Befehl liegt auf deinem Tisch. Ho Chi Minh hat dem Hohen Kommissar telegrafiert, er wolle den Frieden.`,
    optionen: [
      { text: 'Valluy gewähren lassen.', hist: true, richtung: 'kolonial',
        ergebnis: 'Der Kreuzer „Suffren“ beschießt Haiphong; Tausende Vietnamesen sterben. Am 19. Dezember schlagen die Viet Minh in Hanoi zurück. Der Indochinakrieg hat begonnen.',
        w: { indochina: 3, armee: 2, moskau: -4, kriegsmuede: 1 }, setze: ['indochinakrieg'], dient: { kolonien: 1, frieden_kolonien: -1 } },
      { text: 'Zurückhaltung befehlen und eine gemeinsame Untersuchungskommission vorschlagen.', richtung: 'dekolonisation',
        zufall: [
          { p: 0.45, ergebnis: 'Paris befiehlt Zurückhaltung, doch die Lage ist nicht mehr zu beruhigen: Am 19. Dezember greifen die Viet Minh in Hanoi an. Der Indochinakrieg hat begonnen.',
            w: { armee: -2, indochina: -2 }, setze: ['indochinakrieg'] },
          { ergebnis: 'Paris befiehlt Zurückhaltung. Eine gemeinsame Kommission untersucht die Zwischenfälle; in Hanoi wird weiter verhandelt. Die Offiziere des Expeditionskorps murren. (Fiktion)',
            w: { armee: -4 }, setze: ['indochina_waffenruhe'] },
        ],
        dient: { frieden_kolonien: 1, kolonien: -0.4 } },
    ],
    historisch: 'Am 23. November 1946 beschoss die französische Flotte Haiphong; die Schätzungen der Toten reichen von mehreren Hundert bis 6.000. Am 19. Dezember griffen die Viet Minh die Franzosen in Hanoi an – der Beginn des Indochinakriegs.',
  },
  {
    id: 'fr_saar_zone',
    titel: 'Die Saar',
    datum: 'Dezember 1946',
    ab: 1946.2, bis: 1947.1, ordnung: 12,
    absender: 'Gilbert Grandval, Gouverneur des Saarlands',
    text: `Die Saar gehört zur französischen Besatzungszone. Ihre Kohle braucht Frankreich für den Wiederaufbau, und ihre Gruben haben schon nach 1919 Frankreich gehört. Grandval schlägt vor, die Saar aus der Zone herauszulösen: eine Zollgrenze zum übrigen Deutschland, der Franc als Währung, die Gruben unter französischer Verwaltung, eine eigene saarländische Regierung.

Washington und London haben in Moskau signalisiert, dass sie nichts dagegen hätten. Moskau ist dagegen.`,
    optionen: [
      { text: 'Die Saar wirtschaftlich an Frankreich anschließen.', hist: true, richtung: 'national',
        ergebnis: 'Zwischen der Saar und dem übrigen Deutschland entsteht eine Zollgrenze. Das Saarland bekommt eine eigene Verfassung und den Franc; die Gruben arbeiten für Frankreich.',
        w: { haushalt: 3, impuls: 0.4, moskau: -3 }, setze: ['saar_zone'], dient: { saar: 1.4, deutschland_klein: 0.6 } },
      { text: 'Die Saar bei Deutschland lassen und nur Kohlelieferungen verlangen.', richtung: 'europa',
        ergebnis: 'Paris verzichtet auf die Abtrennung der Saar. Die Kohle wird als Reparation geliefert; die Saarländer bleiben Teil der französischen Zone.',
        w: { usa: 2, haushalt: -1 }, setze: ['saar_verzicht'], dient: { deutschland_einbinden: 0.6, saar: -1.2 } },
    ],
    historisch: 'Im Dezember 1946 errichtete Frankreich eine Zollgrenze um die Saar. 1947 bekam das Saarland eine Verfassung, die den wirtschaftlichen Anschluss an Frankreich festschrieb, und im November den Franc.',
  },

  // ------------------------------------------------------------------ 1947/I
  {
    id: 'fr_referendum3',
    titel: 'Eine Verfassung, endlich',
    datum: 'Januar 1947',
    ab: 1947.1, ordnung: 1,
    wenn: s => !!s.f.provisorisch,
    absender: 'Präsident der Verfassunggebenden Versammlung Vincent Auriol',
    ascii: 'urne_fr',
    text: `Zwei Verfassungsentwürfe sind gescheitert, das Land wird seit anderthalb Jahren provisorisch regiert. Die Parteien sind sich nur in einem einig: Ein drittes Scheitern darf es nicht geben.`,
    optionen: [
      { text: 'Die Versammlung soll den Kompromiss ohne weiteres Referendum beschließen.',
        ergebnis: 'Die Versammlung beschließt die Verfassung der Vierten Republik. Die Gaullisten sprechen von einem Staatsstreich der Parteien. (Fiktion)',
        w: { ansehen: -2 }, aktion: s => verfassungInKraft(s), dient: { stabilitaet: 0.6 } },
      { text: 'Noch einmal die Präsidialverfassung zur Abstimmung stellen.', richtung: 'national',
        zufall: [
          { p: 0.6, ergebnis: 'Im dritten Anlauf nehmen die Franzosen eine Verfassung mit starkem Präsidenten an. (Fiktion)',
            aktion: s => verfassungInKraft(s, { praesidial: true }) },
          { ergebnis: 'Auch dieser Entwurf scheitert. Die Versammlung beschließt daraufhin den Kompromiss selbst. (Fiktion)',
            w: { ansehen: -4, rueckhalt: -6 }, aktion: s => verfassungInKraft(s) },
        ],
        dient: { stabilitaet: 0.3, sozial: -0.8 } },
    ],
    historisch: 'In der Geschichte genügte der zweite Entwurf: Die Verfassung der Vierten Republik trat am 27. Oktober 1946 in Kraft.',
  },
  {
    id: 'fr_duenkirchen',
    titel: 'Ein Bündnis mit London',
    datum: '4. März 1947',
    ab: 1947.1, bis: 1947.1, ordnung: 2.5,
    absender: 'Quai d’Orsay',
    text: `Der britische Außenminister Bevin bietet einen Bündnisvertrag an: Frankreich und Großbritannien sollen sich für fünfzig Jahre gegenseitig beistehen, falls Deutschland je wieder angreift. Unterzeichnet werden soll in Dünkirchen – dort, wo 1940 die Briten über den Kanal entkommen sind.`,
    optionen: [
      { text: 'Den Vertrag von Dünkirchen schließen.', hist: true, richtung: 'atlantisch',
        ergebnis: 'In Dünkirchen unterzeichnen Bidault und Bevin einen Beistandsvertrag gegen eine erneute deutsche Aggression.',
        w: { grossbritannien: 8 }, setze: ['duenkirchen'], dient: { deutschland_klein: 0.6, westbindung: 0.4 } },
      { text: 'Ablehnen – Frankreich will sich nicht binden, solange Deutschland nicht geregelt ist.', richtung: 'national',
        ergebnis: 'Paris lässt den britischen Vorschlag liegen. Bevin ist enttäuscht.',
        w: { grossbritannien: -5 }, dient: { unabhaengigkeit: 0.6 } },
    ],
    historisch: 'Der Vertrag von Dünkirchen wurde am 4. März 1947 unterzeichnet. Er richtete sich ausdrücklich gegen Deutschland und wurde ein Jahr später in den Brüsseler Pakt erweitert.',
  },
  {
    id: 'fr_madagaskar',
    titel: 'Aufstand auf Madagaskar',
    datum: 'März 1947',
    ab: 1947.1, bis: 1947.1, ordnung: 3.5,
    absender: 'Generalgouverneur in Tananarive',
    text: `In der Nacht zum 30. März haben Aufständische auf Madagaskar Militärposten und Plantagen angegriffen. Die Kolonialverwaltung macht die Abgeordneten der Unabhängigkeitspartei MDRM verantwortlich, die in Paris im Parlament sitzen. Der Generalgouverneur verlangt Verstärkung und die Aufhebung ihrer Immunität.`,
    optionen: [
      { text: 'Truppen schicken und den Aufstand niederschlagen.', hist: true, richtung: 'kolonial',
        ergebnis: 'Kolonialtruppen schlagen den Aufstand nieder. Zehntausende Madagassen sterben, die Abgeordneten des MDRM werden verhaftet und zum Tode verurteilt.',
        w: { armee: 2, kriegsmuede: 1, haushalt: -2 }, setze: ['madagaskar_repression'], dient: { kolonien: 1 } },
      { text: 'Den Aufstand eindämmen und mit dem MDRM über Autonomie verhandeln.', richtung: 'dekolonisation',
        ergebnis: 'Paris schickt Truppen, aber auch Unterhändler. Die Siedler toben; in Tananarive wird über ein Autonomiestatut gesprochen.',
        w: { armee: -3 }, setze: ['madagaskar_autonomie'], dient: { frieden_kolonien: 1, kolonien: -0.5 } },
    ],
    historisch: 'Der Aufstand auf Madagaskar wurde bis 1948 niedergeschlagen; die Zahl der Toten wird auf 30.000 bis 90.000 geschätzt. Die MDRM-Abgeordneten wurden verurteilt und später begnadigt. Madagaskar wurde 1960 unabhängig.',
  },
  {
    id: 'fr_moskau1947',
    titel: 'Die Moskauer Konferenz',
    datum: 'April 1947',
    ab: 1947.1, bis: 1947.1, ordnung: 4,
    absender: 'Georges Bidault, Außenminister',
    ascii: 'kreml',
    text: s => `In Moskau verhandeln die vier Außenminister seit Wochen über Deutschland. Molotow will Reparationen aus der laufenden Produktion und eine Viermächtekontrolle über die Ruhr – aber er lehnt den Anschluss der Saar an Frankreich ab. Marshall und Bevin sind bereit, Frankreich die Saar ${s.f.saar_zone ? 'zu lassen' : 'zuzugestehen'}, wenn Paris sich ihrer Deutschlandpolitik anschließt: ein Wiederaufbau Westdeutschlands, mehr Kohle für alle.

Frankreich hat bisher zwischen den Großmächten laviert. In Moskau muss es sich entscheiden.`,
    optionen: [
      { text: 'Sich Washington und London anschließen.', hist: true, richtung: 'atlantisch',
        ergebnis: 'Bidault stellt sich in Moskau an die Seite Marshalls und Bevins. Die Konferenz scheitert; Frankreich hat seine Rolle als Brücke zwischen Ost und West aufgegeben.',
        w: { usa: 6, grossbritannien: 3, moskau: -8 }, dient: { westbindung: 1.4, saar: 0.5, unabhaengigkeit: -0.3 } },
      { text: 'Mit Moskau gemeinsam eine Viermächtekontrolle der Ruhr verlangen.', richtung: 'ost',
        ergebnis: 'Bidault unterstützt Molotows Forderung nach einer Viermächtekontrolle der Ruhr. Marshall reist verärgert ab.',
        w: { usa: -7, grossbritannien: -4, moskau: 7 }, setze: ['ruhr_mit_moskau'], dient: { deutschland_klein: 1.2, westbindung: -1, unabhaengigkeit: 0.8 } },
      { text: 'Vermitteln und keine Seite verprellen.',
        ergebnis: 'Bidault laviert. Die Konferenz geht ohne Ergebnis zu Ende, und keiner der Großen ist zufrieden.',
        w: { usa: -3, moskau: -1 }, dient: { unabhaengigkeit: 0.3 } },
    ],
    historisch: 'Auf der Moskauer Außenministerkonferenz (März/April 1947) stellte sich Bidault an die Seite der Westmächte, die Frankreichs Anspruch auf die Saar unterstützten. Die Konferenz scheiterte; die Viermächtepolitik in Deutschland war am Ende.',
  },
  {
    id: 'fr_kommunisten_raus', rueckblick: true,
    titel: 'Die Kommunisten stimmen gegen die Regierung',
    datum: '4. Mai 1947',
    ab: 1947.1, bis: 1947.2, ordnung: 5,
    wenn: s => s.regierung.includes('PCF') && !s.f.pcf_raus && s.chefPartei !== 'PCF',
    absender: 'Generalsekretariat der Regierung',
    ascii: 'plakat_fr',
    text: s => `Bei Renault in Billancourt streiken die Arbeiter für höhere Löhne. Die kommunistischen Minister haben in der Nationalversammlung gegen die Lohnpolitik der eigenen Regierung gestimmt – und schon vorher gegen die Kredite für Indochina. Sie wollen in der Regierung bleiben und zugleich die Opposition anführen.

Die Verfassung kennt keinen Weg, Minister zu entlassen. Aber ${s.regierungschef} könnte es per Dekret tun.`,
    optionen: [
      { text: 'Die kommunistischen Minister entlassen.', hist: true, richtung: 'atlantisch',
        ergebnis: 'Per Dekret entlässt der Regierungschef die fünf kommunistischen Minister. Die Kommunisten gehen in die Opposition; aus dem Tripartisme wird die „Dritte Kraft“.',
        w: { usa: 8, moskau: -8, armee: 2 }, aktion: s => ohneKommunisten(s), dient: { westbindung: 1.4, stabilitaet: 0.4, sozial: -0.3 } },
      { text: 'Nachgeben und die Löhne erhöhen.', richtung: 'sozial',
        ergebnis: 'Die Regierung gibt den Lohnforderungen nach. Die Koalition hält – aber die Preise steigen weiter, und Washington ist besorgt.',
        w: { usa: -5, haushalt: -4, preisdruck: 3, rueckhalt: 3 }, dient: { sozial: 0.8, stabilitaet: 0.2, westbindung: -0.8 } },
      { text: 'Zurücktreten und eine neue Regierung bilden lassen.',
        ergebnis: 'Die Regierung tritt zurück. Die Parteien müssen eine neue Mehrheit suchen.',
        w: { rueckhalt: -60 }, dient: { stabilitaet: -0.6 } },
    ],
    historisch: 'Am 5. Mai 1947 entließ Paul Ramadier die kommunistischen Minister. Die PCF kehrte bis 1981 nicht mehr in eine Regierung zurück.',
  },

  // ------------------------------------------------------------------ 1947: Marshallplan
  {
    id: 'fr_marshall',
    titel: 'Der Marshallplan',
    datum: 'Juli 1947',
    ab: 1947.1, bis: 1947.2, ordnung: 6.8,
    wenn: s => !!s.weltflags.marshall_angebot,
    absender: 'Jean Monnet, Generalkommissar für den Plan',
    ascii: 'schiff',
    text: s => `In Harvard hat Außenminister Marshall Europa Hilfe für den Wiederaufbau angeboten – unter einer Bedingung: Die Europäer sollen gemeinsam einen Plan vorlegen. In Paris beraten die Außenminister Bidault, Bevin und Molotow. ${s.weltflags.marshall_ost === 'ja' ? 'Molotow hat überraschend zugesagt, dass die Sowjetunion mitmacht. (Fiktion)' : 'Molotow hat die Konferenz verlassen: Die Sowjetunion werde sich keiner „amerikanischen Kontrolle“ unterwerfen; Polen und die Tschechoslowakei haben auf Druck Moskaus abgesagt.'}

Monnet rechnet vor, dass sein Modernisierungsplan ohne amerikanische Dollar nicht zu bezahlen ist. Die Kommunisten nennen den Marshallplan den Weg in die „Kolonisierung“ durch Amerika.`,
    optionen: [
      { text: 'Mitmachen und die Konferenz der europäischen Länder in Paris ausrichten.', hist: true, richtung: ['atlantisch', 'europa'],
        ergebnis: 'Paris lädt sechzehn Länder zur Konferenz über die Marshallhilfe ein. Dollar, Kohle und Maschinen kommen über den Atlantik.',
        w: { usa: 8, europa: 4, impuls: 1.5, haushalt: 4, franc: 4, moskau: -6 }, setze: ['marshallplan'], dient: { westbindung: 1, modernisierung: 1, europa: 0.6 } },
      { text: 'Nur mitmachen, wenn Moskau dabei ist.', nurWenn: s => s.weltflags.marshall_ost !== 'ja', richtung: 'ost',
        ergebnis: 'Paris macht seine Teilnahme davon abhängig, dass auch die Sowjetunion mitmacht. Washington verliert die Geduld; die Hilfe fließt an Frankreich vorbei.',
        w: { usa: -10, moskau: 4, impuls: -0.8 }, setze: ['kein_marshall'], dient: { unabhaengigkeit: 1.2, westbindung: -1.2, modernisierung: -0.8 } },
    ],
    historisch: 'Am 2. Juli 1947 verließ Molotow die Pariser Konferenz. Frankreich wurde einer der größten Empfänger der Marshallhilfe: bis 1952 rund 2,7 Milliarden Dollar.',
  },
  {
    id: 'fr_algerien_statut',
    titel: 'Ein Statut für Algerien',
    datum: 'September 1947',
    ab: 1947.2, bis: 1947.2, ordnung: 8.5,
    absender: 'Édouard Depreux, Innenminister',
    text: `Nach den Massakern von Sétif im Mai 1945 verlangen die algerischen Nationalisten Gleichberechtigung, die Siedler verlangen Ruhe. Das Innenministerium legt ein Statut vor: Eine Algerische Versammlung soll entstehen, mit zwei Wahlkollegien von je 60 Abgeordneten – eines für die knapp eine Million Europäer und die wenigen „assimilierten“ Muslime, eines für die acht Millionen übrigen Muslime.`,
    optionen: [
      { text: 'Das Statut mit zwei Wahlkollegien beschließen.', hist: true, richtung: 'kolonial',
        ergebnis: 'Das Statut tritt in Kraft. Die Siedler behalten die Hälfte der Sitze; die Nationalisten sprechen von einem Betrug.',
        w: { algerien: 2 }, dient: { kolonien: 0.8 } },
      { text: 'Ein gemeinsames Wahlrecht für alle Algerier.', richtung: 'dekolonisation',
        ergebnis: 'Paris führt ein gemeinsames Wahlrecht für Europäer und Muslime ein. Die Siedler drohen mit Aufruhr; die Nationalisten schöpfen Hoffnung. (Fiktion)',
        w: { algerien: 6, armee: -3, ansehen: -1 }, setze: ['algerien_reformen'], dient: { frieden_kolonien: 1, kolonien: -0.4 } },
    ],
    historisch: 'Das Algerienstatut wurde am 20. September 1947 beschlossen. Die Wahlen zur Algerischen Versammlung 1948 wurden massiv gefälscht; die versprochenen Reformen blieben aus.',
  },
  {
    id: 'fr_indochina1947',
    titel: 'Frieden oder Krieg in Indochina',
    datum: 'Herbst 1947',
    ab: 1947.2, bis: 1947.2, ordnung: 9,
    wenn: offenIndochina,
    absender: 'Émile Bollaert, Hochkommissar in Indochina',
    ascii: 'dschungel',
    text: `Seit einem Jahr herrscht in Indochina ein brüchiger Waffenstillstand. Ho Chi Minh bietet an, Vietnam als unabhängigen Staat in der Französischen Union zu führen. Die Militärs halten das für eine Falle und schlagen vor, stattdessen den früheren Kaiser Bao Dai als Gegenspieler aufzubauen. (Fiktion: In der Geschichte war der Krieg seit Dezember 1946 im Gange.)`,
    optionen: [
      { text: 'Die Unabhängigkeit Vietnams in der Französischen Union anerkennen.', richtung: 'dekolonisation',
        ergebnis: 'Paris und Hanoi einigen sich: Vietnam wird ein unabhängiger Staat, verbunden mit Frankreich durch die Französische Union. Die Armee ist verbittert. (Fiktion)',
        w: { armee: -6, moskau: 3 }, setze: ['indochina_beendet', 'indochina_ausgleich'], dient: { frieden_kolonien: 1.3, kolonien: -1 } },
      { text: 'Auf Bao Dai setzen – und notfalls kämpfen.', richtung: 'kolonial',
        ergebnis: 'Paris bricht die Gespräche mit Ho Chi Minh ab und verhandelt mit Bao Dai. Die Viet Minh greifen zu den Waffen; der Indochinakrieg beginnt. (Fiktion)',
        w: { armee: 2, kriegsmuede: 1 }, setze: ['indochinakrieg'], dient: { kolonien: 1.1, frieden_kolonien: -0.8 } },
    ],
  },
  {
    id: 'fr_streiks1947',
    titel: 'Der Aufstandsstreik',
    datum: 'November 1947',
    ab: 1947.2, bis: 1947.2, ordnung: 11,
    wenn: s => !!s.weltflags.kominform || !!s.f.pcf_raus,
    absender: 'Jules Moch, Innenminister',
    ascii: 'aufstand',
    text: s => `Drei Millionen Franzosen streiken: Bergarbeiter, Eisenbahner, Metallarbeiter. ${s.weltflags.kominform ? 'Seit Moskau die Kominform gegründet und die französischen Kommunisten für ihre Zahmheit gerügt hat, schlägt die Partei einen anderen Ton an.' : 'Die Kommunisten haben die Opposition auf die Straße getragen.'} In Marseille ist das Rathaus gestürmt worden, bei Arras hat Sabotage einen Schnellzug entgleisen lassen.

Innenminister Moch will die Reservisten einberufen und mit der neuen Bereitschaftspolizei CRS gegen Streikposten vorgehen.${s.f.pcf_raus ? '' : ' Die kommunistischen Minister haben angekündigt, dass sie das nicht mittragen.'}`,
    optionen: [
      { text: 'Moch freie Hand lassen.', hist: true, richtung: 'atlantisch',
        ergebnis: s => `Polizei und Armee räumen Bahnhöfe und Gruben. Nach drei Wochen bricht der Streik zusammen; die Gewerkschaft CGT spaltet sich, die nichtkommunistische Force ouvrière entsteht.${s.f.pcf_raus ? '' : ' Die Kommunisten verlassen die Regierung.'}`,
        w: { usa: 5, moskau: -6, ansehen: -1, preisdruck: -1 }, aktion: s => { if (!s.f.pcf_raus) ohneKommunisten(s); },
        dient: { westbindung: 0.8, stabilitaet: 0.4, sozial: -0.5 } },
      { text: 'Verhandeln und die Löhne kräftig anheben.', richtung: 'sozial',
        ergebnis: 'Die Regierung gibt nach. Die Streikenden kehren an die Arbeit zurück; die Inflation bekommt neue Nahrung.',
        w: { preisdruck: 4, haushalt: -5, franc: -4, usa: -3, rueckhalt: -4 }, dient: { sozial: 1, stabilitaet: -0.3 } },
    ],
    historisch: 'Die Streiks vom November und Dezember 1947 brachen nach dem harten Durchgreifen Jules Mochs zusammen. Im Dezember spaltete sich die CGT; die Force ouvrière wurde mit amerikanischer Unterstützung gegründet.',
  },

  // ------------------------------------------------------------------ 1948/I
  {
    id: 'fr_bruesseler_pakt',
    titel: 'Der Brüsseler Pakt',
    datum: '17. März 1948',
    ab: 1948.1, bis: 1948.1, ordnung: 3,
    absender: 'Quai d’Orsay',
    text: s => `${s.weltflags.prag_putsch ? 'In Prag haben die Kommunisten die Macht übernommen; Außenminister Masaryk ist tot aus einem Fenster gestürzt. ' : ''}Bevin schlägt vor, den Vertrag von Dünkirchen zu einem Bündnis der Westeuropäer auszubauen: Großbritannien, Frankreich, Belgien, die Niederlande und Luxemburg sollen einander beistehen – nicht mehr nur gegen Deutschland, sondern gegen jeden Angriff. Washington würde ein solches Bündnis unterstützen.`,
    optionen: [
      { text: 'Den Brüsseler Pakt unterzeichnen.', hist: true, richtung: ['atlantisch', 'europa'],
        ergebnis: 'In Brüssel unterzeichnen fünf westeuropäische Staaten einen Beistandspakt für fünfzig Jahre. In Washington beginnen Gespräche über ein atlantisches Bündnis.',
        w: { grossbritannien: 6, usa: 4, europa: 3, moskau: -5 }, setze: ['bruesseler_pakt'], dient: { westbindung: 1, europa: 0.6 } },
      { text: 'Nur einen Pakt gegen Deutschland – kein Bündnis gegen Moskau.', richtung: 'ost',
        ergebnis: 'Paris will sich nicht gegen die Sowjetunion festlegen. Die Benelux-Staaten und London schließen ihren Pakt ohne Frankreich. (Fiktion)',
        w: { grossbritannien: -6, usa: -6, moskau: 4 }, dient: { unabhaengigkeit: 1, deutschland_klein: 0.6, westbindung: -1 } },
    ],
    historisch: 'Der Brüsseler Pakt wurde am 17. März 1948 unterzeichnet, drei Wochen nach dem kommunistischen Umsturz in Prag. Er war der Vorläufer der NATO und wurde 1954 zur Westeuropäischen Union.',
  },
  {
    id: 'fr_algerien_wahlen1948',
    titel: 'Wahlen in Algerien',
    datum: 'April 1948',
    ab: 1948.1, bis: 1948.1, ordnung: 4,
    absender: 'Marcel-Edmond Naegelen, Generalgouverneur in Algier',
    text: s => `Im April wird die Algerische Versammlung gewählt. Die Partei des Nationalisten Messali Hadj und die Partei von Ferhat Abbas könnten im zweiten Wahlkollegium gewinnen. Naegelen will das verhindern: Kandidaten verhaften, Wahllokale von der Verwaltung kontrollieren, Urnen „vorbereiten“. ${s.f.algerien_reformen ? 'Mit dem gemeinsamen Wahlrecht stünde viel auf dem Spiel.' : ''}`,
    optionen: [
      { text: 'Naegelen gewähren lassen.', hist: true, richtung: 'kolonial',
        ergebnis: 'Die Verwaltung „macht“ die Wahl: Die Kandidaten der Behörden gewinnen. Für viele junge Nationalisten ist damit bewiesen, dass der legale Weg versperrt ist.',
        w: { algerien: 2 }, setze: ['algerien_wahlbetrug'], dient: { kolonien: 0.8 } },
      { text: 'Freie Wahlen anordnen.', richtung: 'dekolonisation',
        ergebnis: 'Die Wahl ist frei. Die Nationalisten gewinnen die Mehrheit im zweiten Kollegium; die Siedler sind empört, die Armee besorgt. (Fiktion)',
        w: { algerien: 5, armee: -2 }, setze: ['algerien_reformen'], dient: { frieden_kolonien: 1, kolonien: -0.3 } },
    ],
    historisch: 'Die Wahlen zur Algerischen Versammlung im April 1948 wurden von der Verwaltung unter Naegelen massiv gefälscht. Die „Wahlen à la Naegelen“ wurden sprichwörtlich.',
  },
  {
    id: 'fr_london1948', rueckblick: true,
    titel: 'Die Londoner Empfehlungen',
    datum: 'Juni 1948',
    ab: 1948.1, bis: 1948.2, ordnung: 6,
    wenn: s => ['ja', 'nur_mit_paris'].includes(s.weltflags.weststaat_usa) && !s.weltflags.weststaat_paris,
    absender: 'Georges Bidault, Außenminister',
    ascii: 'trikolore',
    text: s => `Auf der Londoner Sechsmächtekonferenz haben die Westmächte und die Benelux-Länder beschlossen, aus den westlichen Besatzungszonen einen deutschen Staat zu machen. Eine verfassunggebende Versammlung soll gewählt werden; die Ruhr kommt unter eine internationale Behörde, an der Frankreich beteiligt ist. Die französische Zone soll mit der Bizone verschmelzen.

${s.weltflags.weststaat_usa === 'ja' ? 'Washington hat klargemacht, dass der Weststaat auch ohne die französische Zone entsteht.' : 'Washington will den Weststaat nur mit Frankreich gründen – Paris hat es in der Hand.'} Die Nationalversammlung muss zustimmen. Kommunisten und Gaullisten sind dagegen: Ein neuer deutscher Staat, drei Jahre nach dem Krieg!`,
    optionen: s => [
      { text: 'Zustimmen.', hist: true, richtung: 'atlantisch',
        ergebnis: 'Die Nationalversammlung billigt die Londoner Empfehlungen mit knapper Mehrheit. Die französische Zone wird Teil des künftigen Weststaats.',
        w: { usa: 6, grossbritannien: 3, moskau: -6 }, aktion: (s2, a) => a.weltflag('weststaat_paris', 'ja'),
        dient: { westbindung: 1, deutschland_einbinden: 0.8, deutschland_klein: -0.4 } },
      { text: 'Zustimmen, aber die Ruhrkontrolle und die Saar festschreiben lassen.', richtung: 'national',
        ergebnis: 'Paris stimmt zu, verlangt aber dauerhafte Kontrollen über die Ruhr und die Anerkennung der Saarregelung. Washington und London geben nach.',
        w: { usa: 2, moskau: -4, haushalt: 1 }, setze: ['ruhrkontrolle'], aktion: (s2, a) => a.weltflag('weststaat_paris', 'ja'),
        dient: { deutschland_klein: 0.8, saar: 0.6, westbindung: 0.5 } },
      { text: s.weltflags.weststaat_usa === 'ja' ? 'Ablehnen. Die französische Zone bleibt draußen.' : 'Ablehnen. Es gibt keinen deutschen Staat.',
        richtung: 'national',
        gegenGruendung: s.weltflags.weststaat_usa === 'ja' ? undefined : 'brd',
        ergebnis: s.weltflags.weststaat_usa === 'ja'
          ? 'Die Nationalversammlung lehnt die Londoner Empfehlungen ab. Briten und Amerikaner wollen den Weststaat nun ohne die französische Zone gründen. (Fiktion)'
          : 'Die Nationalversammlung lehnt die Londoner Empfehlungen ab. Washington legt die Pläne für einen westdeutschen Staat auf Eis; Deutschland bleibt unter Besatzung. (Fiktion)',
        w: { usa: -12, grossbritannien: -6, moskau: 6 }, aktion: (s2, a) => a.weltflag('weststaat_paris', 'nein'),
        dient: { deutschland_klein: 1.6, westbindung: -1.2, unabhaengigkeit: 0.6 } },
    ],
    historisch: 'Die Londoner Empfehlungen vom 7. Juni 1948 wurden von der Nationalversammlung am 16. Juni nur knapp gebilligt. Im Juli bekamen die westdeutschen Ministerpräsidenten den Auftrag, eine Verfassung auszuarbeiten.',
  },

  // ------------------------------------------------------------------ 1948/II
  {
    id: 'fr_berlin1948',
    titel: 'Die Blockade Berlins',
    datum: 'Juli 1948',
    ab: 1948.2, bis: 1948.2, ordnung: 7,
    wenn: s => !!s.weltflags.blockade && !s.weltflags.berlin_aufgegeben,
    absender: 'General Ganeval, Kommandant des französischen Sektors von Berlin',
    ascii: 'berlin',
    text: s => `Seit dem 24. Juni sind alle Land- und Wasserwege nach West-Berlin gesperrt. ${s.weltflags.berlin_massnahme === 'konvoi' ? 'Die Amerikaner haben versucht, mit einem Konvoi durchzubrechen.' : 'Amerikaner und Briten versorgen die Stadt aus der Luft.'} Zwei Millionen Menschen brauchen jeden Tag Tausende Tonnen Lebensmittel und Kohle.

Frankreich hat kaum Transportflugzeuge – sie fliegen in Indochina. Ganeval schlägt vor, im französischen Sektor in Tegel einen neuen Flughafen zu bauen. Andere im Quai d’Orsay meinen, Frankreich solle zwischen Moskau und Washington vermitteln.`,
    optionen: [
      { text: 'Den Flughafen in Tegel bauen und die Luftbrücke unterstützen.', hist: true, richtung: 'atlantisch',
        ergebnis: 'In neunzig Tagen bauen Berliner und französische Pioniere in Tegel die längste Landebahn Europas. Frankreich steht an der Seite der Westmächte.',
        w: { usa: 5, grossbritannien: 3, moskau: -5, haushalt: -1 }, dient: { westbindung: 1 } },
      { text: 'Eine Vermittlung zwischen Moskau und den Westmächten anbieten.', richtung: 'ost',
        ergebnis: 'Paris bietet an, zwischen Moskau und Washington zu vermitteln. Moskau lobt die „Vernunft“ Frankreichs, Washington ist verärgert.',
        w: { usa: -5, moskau: 5 }, dient: { unabhaengigkeit: 1, deutschland_klein: 0.4, westbindung: -0.6 } },
    ],
    historisch: 'Der Flughafen Tegel wurde im Herbst 1948 im französischen Sektor in drei Monaten gebaut. Frankreich beteiligte sich an der Luftbrücke nur mit wenigen Flugzeugen.',
  },
  {
    id: 'fr_bergarbeiter1948',
    titel: 'Der Streik der Bergarbeiter',
    datum: 'Oktober 1948',
    ab: 1948.2, bis: 1948.2, ordnung: 10,
    wenn: s => !!s.f.pcf_raus,
    absender: 'Jules Moch, Innenminister',
    ascii: 'aufstand',
    text: `In den Kohlerevieren des Nordens und Lothringens streiken die Bergarbeiter gegen neue Dekrete zur Arbeitszeit. Die CGT hat auch die Sicherheitsmannschaften aus den Gruben abgezogen; sie drohen abzusaufen. Moch will Truppen in die Reviere schicken.`,
    optionen: [
      { text: 'Die Armee in die Gruben schicken.', hist: true, richtung: 'sparen',
        ergebnis: 'Soldaten besetzen die Zechen. Es gibt Tote; nach acht Wochen ist der Streik gebrochen. Die Bergarbeiter vergessen es nicht.',
        w: { usa: 3, ansehen: -2, armee: -1, impuls: -0.3 }, dient: { stabilitaet: 0.8, westbindung: 0.3, sozial: -0.3 } },
      { text: 'Die Dekrete zurücknehmen und verhandeln.', richtung: 'sozial',
        ergebnis: 'Die Regierung nimmt die Dekrete zurück. Die Gruben laufen wieder; die Kohle wird teurer.',
        w: { preisdruck: 3, haushalt: -4, ansehen: 1 }, dient: { sozial: 0.6 } },
    ],
    historisch: 'Der Bergarbeiterstreik von Oktober und November 1948 wurde mit 60.000 Soldaten und Polizisten niedergeschlagen. Sechs Bergleute kamen ums Leben, Tausende wurden entlassen.',
  },

  // ------------------------------------------------------------------ 1949/I
  {
    id: 'fr_washingtoner_abkommen',
    titel: 'Die Trizone',
    datum: 'April 1949',
    ab: 1949.1, bis: 1949.1, ordnung: 3.5,
    wenn: s => s.weltflags.weststaat_paris === 'ja',
    absender: 'André François-Poncet, künftiger Hoher Kommissar',
    text: `In Bonn berät der Parlamentarische Rat über ein „Grundgesetz“. In Washington wollen die Außenminister das Besatzungsstatut festlegen: Was darf der neue Staat selbst entscheiden, was behalten sich die Hohen Kommissare vor? Die französische Zone soll mit der Bizone verschmelzen. Paris kann noch Bedingungen stellen – Demontagen, Ruhrbehörde, Kontrolle der Industrie.`,
    optionen: [
      { text: 'Der Verschmelzung zustimmen, die Kontrollen behalten.', hist: true, richtung: 'atlantisch',
        ergebnis: 'In Washington unterzeichnen die drei Außenminister das Besatzungsstatut. Aus Bizone und französischer Zone wird die Trizone.',
        w: { usa: 4, grossbritannien: 2 }, dient: { westbindung: 0.6, deutschland_einbinden: 0.6 } },
      { text: 'Auf harten Demontagen und Produktionsgrenzen bestehen.', richtung: 'national',
        ergebnis: 'Paris setzt durch, dass weitere Fabriken demontiert werden. Der neue Staat beginnt mit Groll gegen Frankreich.',
        w: { usa: -3, haushalt: 2 }, setze: ['demontagen_hart'], dient: { deutschland_klein: 1.2, deutschland_einbinden: -0.6 } },
    ],
    historisch: 'Mit den Washingtoner Abkommen vom 8. April 1949 verschmolz die französische Zone mit der Bizone; das Besatzungsstatut trat im September 1949 mit der Gründung der Bundesrepublik in Kraft.',
  },
  {
    id: 'fr_nato',
    titel: 'Das Atlantische Bündnis',
    datum: '4. April 1949',
    ab: 1949.1, bis: 1949.1, ordnung: 4,
    wenn: s => !!s.weltflags.nato_angebot,
    absender: 'Robert Schuman, Außenminister',
    ascii: 'trikolore',
    text: s => `In Washington soll der Nordatlantikvertrag unterzeichnet werden: zwölf Staaten, ein Angriff auf einen gilt als Angriff auf alle. ${s.weltflags.nato_angebot === 'lose' ? 'Washington will sich allerdings nur zu Konsultationen verpflichten, nicht zu automatischem Beistand.' : 'Die Vereinigten Staaten binden sich zum ersten Mal in ihrer Geschichte in Friedenszeiten an ein Bündnis.'}

Paris verlangt, dass auch die algerischen Departements unter den Schutz des Vertrags fallen und Frankreich mit Washington und London im obersten Militärausschuss sitzt. Die Kommunisten rufen zum Kampf gegen den „Kriegspakt“ auf.`,
    optionen: [
      { text: 'Unterzeichnen – mit Algerien und einem Sitz in der Führung.', hist: true, richtung: 'atlantisch',
        ergebnis: 'Schuman unterzeichnet in Washington den Nordatlantikvertrag. Algerien steht unter dem Schutz des Bündnisses; Frankreich sitzt mit den USA und Großbritannien in der „Standing Group“.',
        w: { usa: 8, grossbritannien: 4, moskau: -8 }, setze: ['nato_mitglied'], dient: { westbindung: 1.4, kolonien: 0.3 } },
      { text: 'Beitreten, aber keine fremden Truppen und Stützpunkte in Frankreich zulassen.', richtung: 'national',
        ergebnis: 'Frankreich tritt dem Bündnis bei, lehnt aber amerikanische Stützpunkte auf seinem Boden ab. Washington ist irritiert. (Fiktion)',
        w: { usa: -2, moskau: -4 }, setze: ['nato_mitglied', 'nato_lose'], dient: { unabhaengigkeit: 1, westbindung: 0.6 } },
      { text: 'Neutral bleiben – Frankreich als Brücke zwischen den Blöcken.', richtung: 'ost',
        ergebnis: 'Frankreich unterzeichnet den Nordatlantikvertrag nicht. Washington und London sind fassungslos; Moskau lobt die „Unabhängigkeit“ von Paris. (Fiktion)',
        w: { usa: -16, grossbritannien: -8, moskau: 10 }, setze: ['nato_fern'], dient: { unabhaengigkeit: 1.6, westbindung: -1.6 } },
    ],
    historisch: 'Der Nordatlantikvertrag wurde am 4. April 1949 in Washington unterzeichnet. Auf französisches Drängen galt er nach Artikel 6 auch für die algerischen Departements.',
  },

  // ------------------------------------------------------------------ ohne Bundesrepublik
  {
    id: 'fr_deutschland_besetzt',
    titel: 'Deutschland bleibt besetzt',
    datum: 'Anfang 1950',
    ab: 1950.1, bis: 1950.2, ordnung: 2,
    wenn: deutschlandBesetzt,
    absender: 'Oberbefehlshaber der französischen Besatzungstruppen in Baden-Baden',
    text: `Einen westdeutschen Staat gibt es nicht. Die vier Mächte regieren Deutschland weiter als Besatzer, die Militärregierungen streiten über Kohle, Kredite und Flüchtlinge. Die Besatzung kostet Geld und Soldaten, die in Indochina fehlen; in den Zonen wächst die Unzufriedenheit. (Fiktion)`,
    optionen: [
      { text: 'Die französische Zone weiter selbst verwalten und Reparationen verlangen.', richtung: 'national',
        ergebnis: 'Frankreich behält seine Zone und lässt sich weiter in Kohle und Holz bezahlen. Die Deutschen in Baden und der Pfalz murren.',
        w: { haushalt: 2, usa: -2 }, dient: { deutschland_klein: 1 } },
      { text: 'Die Kosten mit Washington und London teilen und die Zonen gemeinsam verwalten.', richtung: 'atlantisch',
        ergebnis: 'Paris einigt sich mit den Westmächten auf eine gemeinsame Verwaltung der Westzonen – ohne deutschen Staat.',
        w: { usa: 4, haushalt: 1 }, dient: { westbindung: 0.8 } },
    ],
  },
];
