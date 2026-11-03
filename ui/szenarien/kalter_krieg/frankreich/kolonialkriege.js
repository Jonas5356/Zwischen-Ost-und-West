// Frankreich: die Kolonialkriege als eigener Strang.
//
// Jeder Krieg hat eine Lage (0 = verloren, 100 = unter Kontrolle) und einen verdeckten „Einsatz“
// (−4 … 6; 0 = Truppenstärke wie in der Geschichte). Der Einsatz bremst den Verfall der Lage
// jedes Halbjahr, kostet aber Haushalt und macht kriegsmüde (modell.js, rundenende). Ihn
// steuern Entscheidungen (Verstärkung, Abzug) und harte Optionen in den Vorlagen.
// Fällt die Lage sehr tief, bricht die Front zusammen; hält sie sich lange sehr hoch, ist der
// Gegner militärisch geschlagen (Fiktion) – auch dann muss Paris sagen, wie es weitergeht.
// Wie ein Krieg ausgeht, steht danach in Zeitung, Lagebild und Abschlussbericht.
import { indochinakrieg, algerienkrieg, istDeGaulle } from './modell.js';
import { zeitIndex } from '../../../engine.js';

// ------------------------------------------------------------------ Entscheidungen

function verstaerkung(krieg, wo, ab) {
  // erst beim Aufruf nachschlagen (kolonialkriege.js und modell.js importieren einander)
  const lauft = s => (krieg === 'indochina' ? indochinakrieg(s) : algerienkrieg(s));
  return {
    id: 'verstaerkung_' + krieg,
    titel: `Verstärkungen nach ${wo} schicken`,
    text: `Mehr Bataillone, Flugzeuge und Material für ${wo}: Die Lage bessert sich sofort, und jedes Halbjahr verliert die Armee weniger Boden. Dafür kostet der Krieg mehr Geld, und zu Hause wächst die Kriegsmüdigkeit.`,
    ab, bis: 1964.1,
    wenn: lauft,
    moeglich: s => (s.w['einsatz_' + krieg] ?? 0) < 6 || 'Mehr Truppen kann die Armee nicht aufbringen.',
    kosten: { haushalt: -3 },
    w: { ['einsatz_' + krieg]: 2, [krieg]: 4, armee: 2, kriegsmuede: 1 },
    abklingzeit: 1,
    richtung: 'kolonial',
    ergebnis: `Paris schickt Verstärkungen nach ${wo}.`,
  };
}

function abzug(krieg, wo, ab) {
  // erst beim Aufruf nachschlagen (kolonialkriege.js und modell.js importieren einander)
  const lauft = s => (krieg === 'indochina' ? indochinakrieg(s) : algerienkrieg(s));
  return {
    id: 'abzug_' + krieg,
    titel: `Truppen aus ${wo} zurückholen`,
    text: `Weniger Soldaten in ${wo} entlasten den Haushalt und die Familien zu Hause. Die Lage wird schwieriger, und die Offiziere fühlen sich im Stich gelassen.`,
    ab, bis: 1964.1,
    wenn: lauft,
    moeglich: s => (s.w['einsatz_' + krieg] ?? 0) > -4 || 'Mit noch weniger Truppen wäre die Stellung nicht zu halten.',
    kosten: { armee: -3 },
    w: { ['einsatz_' + krieg]: -2, [krieg]: -3, kriegsmuede: -1, haushalt: 2 },
    abklingzeit: 1,
    richtung: 'dekolonisation',
    ergebnis: `Paris holt einen Teil der Truppen aus ${wo} zurück.`,
  };
}

export const entscheidungen = [
  verstaerkung('indochina', 'Indochina', 1946.2),
  abzug('indochina', 'Indochina', 1946.2),
  {
    id: 'verhandlung_indochina',
    titel: 'Geheime Gespräche mit Ho Chi Minh aufnehmen',
    text: 'Über Mittelsmänner ließe sich Kontakt zu Ho Chi Minh aufnehmen. Ein Frieden wäre nur um den Preis der Unabhängigkeit Vietnams zu haben; die Armee und Washington wären empört.',
    ab: 1947.1, bis: 1964.1,
    wenn: s => indochinakrieg(s) && !s.f.indochina_verhandlung,
    kosten: { armee: -5 },
    setze: ['indochina_verhandlung'],
    richtung: 'dekolonisation',
    ergebnis: 'Paris nimmt über Mittelsmänner Kontakt zu Ho Chi Minh auf.',
    still: true,
  },
  verstaerkung('algerien', 'Algerien', 1954.2),
  abzug('algerien', 'Algerien', 1954.2),
  {
    id: 'verhandlung_algerien',
    titel: 'Geheime Gespräche mit der FLN aufnehmen',
    text: 'In Kairo, Belgrad oder Rom ließe sich Kontakt zur FLN aufnehmen. Am Ende stünde wohl die Unabhängigkeit Algeriens – die Armee und die Siedler würden das nicht hinnehmen.',
    wenn: s => algerienkrieg(s) && !s.f.algerien_verhandlung,
    kosten: { armee: -8 },
    setze: ['algerien_verhandlung'],
    aktion: s => { s.f.verhandlung_seit = s.zeit; },
    richtung: 'dekolonisation',
    ergebnis: 'Paris nimmt geheime Kontakte zur FLN auf.',
    still: true,
  },
];

// ------------------------------------------------------------------ Vorlagen

const seit = (s, flag) => (s.f[flag] ? zeitIndex(s.zeit) - zeitIndex(s.f[flag]) : 99);

export const ereignisse = [
  // Lagebericht, solange der Krieg länger dauert als in der Geschichte
  {
    id: 'fr_indochina_lage',
    titel: 'Lagebericht aus Saigon',
    datum: 'Halbjahresbericht',
    ab: 1955.1, bis: 1964.1, ordnung: 4, wiederholbar: true,
    wenn: s => indochinakrieg(s) && seit(s, 'indochina_lage_zuletzt') >= 2 && s.w.indochina > 10,
    absender: 'Oberkommando in Indochina',
    ascii: 'dschungel',
    text: s => `Der Krieg in Indochina dauert an. ${s.w.indochina >= 60 ? 'Das Expeditionskorps hält das Delta und die Städte; die Viet Minh weichen ins Bergland aus.' : s.w.indochina >= 35 ? 'Die Front steht, aber die Viet Minh beherrschen das Land, sobald es dunkel wird.' : 'Die Viet Minh haben Hanoi fast eingeschlossen; im Süden stehen Saigon und das Mekong-Delta unter Druck.'} ${s.f.indochina_amerikahilfe ? 'Washington zahlt einen großen Teil der Kosten.' : 'Frankreich trägt die Kosten allein.'}

Der Oberbefehlshaber fragt, wie es weitergehen soll.`,
    optionen: [
      { text: 'Verstärkungen schicken.', richtung: 'kolonial',
        ergebnis: 'Paris schickt Verstärkungen nach Indochina.',
        w: { einsatz_indochina: 2, indochina: 4, haushalt: -3, kriegsmuede: 1, armee: 2 }, aktion: s => { s.f.indochina_lage_zuletzt = s.zeit; },
        dient: { kolonien: 1, frieden_kolonien: -0.4 } },
      { text: 'Die Stellungen halten wie bisher.', hist: true,
        ergebnis: 'Der Krieg in Indochina geht weiter wie bisher.',
        aktion: s => { s.f.indochina_lage_zuletzt = s.zeit; }, dient: { kolonien: 0.5, stabilitaet: 0.2 } },
      { text: 'Gespräche mit Ho Chi Minh suchen.', richtung: 'dekolonisation', nurWenn: s => !s.f.indochina_verhandlung,
        ergebnis: 'Paris sucht über Mittelsmänner das Gespräch mit Ho Chi Minh.',
        w: { armee: -5 }, setze: ['indochina_verhandlung'], aktion: s => { s.f.indochina_lage_zuletzt = s.zeit; },
        dient: { frieden_kolonien: 1.2, kolonien: -0.6 } },
      { text: 'Den Rückzug aus Indochina anordnen.', richtung: 'dekolonisation',
        ergebnis: 'Frankreich zieht sich aus Indochina zurück. Ein bitteres Ende nach langen Kriegsjahren.',
        w: { armee: -10, kriegsmuede: -6, haushalt: 5, usa: -4 }, setze: ['indochina_beendet', 'indochina_rueckzug'],
        dient: { frieden_kolonien: 1.4, kolonien: -1 } },
    ],
  },
  {
    id: 'fr_indochina_zusammenbruch',
    titel: 'Die Front bricht zusammen',
    datum: 'Funkspruch aus Hanoi',
    ab: 1947.1, bis: 1964.1, ordnung: 5, wiederholbar: true,
    wenn: s => indochinakrieg(s) && s.w.indochina <= 10,
    absender: 'Oberkommando in Indochina',
    ascii: 'alarm',
    text: s => `Die Viet Minh haben die Verteidigungslinien im Delta durchbrochen. Hanoi ist eingeschlossen, ganze Garnisonen haben sich ergeben, das Expeditionskorps zieht sich nach Süden zurück. ${s.f.indochina_letzte_stellung ? 'Schon einmal hat Paris alles auf eine Karte gesetzt.' : 'Der Oberbefehlshaber meldet: Mit allem, was Frankreich noch aufbringen kann, ließe sich Cochinchina vielleicht halten.'}`,
    optionen: [
      { text: 'Um einen Waffenstillstand bitten – zu den Bedingungen Ho Chi Minhs.', hist: true, richtung: 'dekolonisation',
        ergebnis: 'Frankreich bittet um einen Waffenstillstand. Ganz Vietnam fällt an die Viet Minh; das Expeditionskorps wird über Saigon evakuiert. Eine Niederlage, wie sie Frankreich seit 1940 nicht erlebt hat. (Fiktion)',
        w: { armee: -15, ansehen: -8, usa: -6, kriegsmuede: -6, rueckhalt: -10 }, setze: ['indochina_beendet', 'indochina_niederlage'],
        dient: { frieden_kolonien: 1, kolonien: -1.2 } },
      { text: 'Alles auf eine Karte setzen: Wehrpflichtige, Luftwaffe, die letzten Reserven.', richtung: 'kolonial',
        nurWenn: s => !s.f.indochina_letzte_stellung,
        ergebnis: 'Paris wirft alles nach Indochina, was es hat. Die Front im Süden hält – vorerst. (Fiktion)',
        w: { indochina: 16, einsatz_indochina: 2, haushalt: -8, kriegsmuede: 5, ansehen: -5, armee: 4 }, setze: ['indochina_letzte_stellung'],
        dient: { kolonien: 1.3, frieden_kolonien: -1 } },
    ],
  },
  {
    id: 'fr_indochina_erfolg',
    titel: 'Die Viet Minh weichen zurück',
    datum: 'Lagebericht Saigon',
    ab: 1948.1, bis: 1964.1, ordnung: 5, wiederholbar: true,
    wenn: s => indochinakrieg(s) && (s.f.indochina_hoch || 0) >= 2,
    absender: 'Oberkommando in Indochina',
    ascii: 'dschungel',
    text: `Seit einem Jahr gewinnt das Expeditionskorps Schlacht um Schlacht. Die Viet Minh haben das Delta geräumt und sich in die Berge an der chinesischen Grenze zurückgezogen; ihre regulären Divisionen sind zerschlagen. Ganz besiegt sind sie nicht – aus China kommen Waffen, in den Dörfern haben sie ihre Leute. (Fiktion)

Paris kann den Erfolg nutzen: Vietnam unter Bao Dai die volle Unabhängigkeit geben und die Truppen heimholen, solange Frankreich stark ist – oder weiterkämpfen, bis die Viet Minh ganz geschlagen sind.`,
    optionen: [
      { text: 'Vietnam die volle Unabhängigkeit geben – als Verbündeter Frankreichs.', richtung: 'dekolonisation',
        ergebnis: 'Frankreich entlässt den Staat Vietnam unter Bao Dai in die volle Unabhängigkeit; ein Bündnisvertrag sichert Stützpunkte und Handel. Das Expeditionskorps kehrt als Sieger heim. (Fiktion)',
        w: { armee: 6, ansehen: 6, usa: 5, kriegsmuede: -6, haushalt: 4 }, setze: ['indochina_beendet', 'indochina_gehalten'],
        dient: { frieden_kolonien: 1.2, kolonien: 0.4, westbindung: 0.4 } },
      { text: 'Weiterkämpfen, bis die Viet Minh ganz geschlagen sind.', hist: true, richtung: 'kolonial',
        ergebnis: 'Paris lässt die Armee weiterkämpfen. Die Viet Minh sollen auch in den Bergen geschlagen werden.',
        w: { indochina: 4, kriegsmuede: 1 }, aktion: s => { s.f.indochina_hoch = -4; },
        dient: { kolonien: 1.2, frieden_kolonien: -0.6 } },
    ],
  },

  // Algerien
  {
    id: 'fr_algerien_lage',
    titel: 'Lagebericht aus Algier',
    datum: 'Halbjahresbericht',
    ab: 1960.1, bis: 1964.1, ordnung: 4, wiederholbar: true,
    wenn: s => algerienkrieg(s) && !s.f.algerien_verhandlung && seit(s, 'algerien_lage_zuletzt') >= 2 && s.w.algerien > 10,
    absender: s => (istDeGaulle(s) ? 'Delegierter der Regierung in Algier' : 'Ministerium für Algerien'),
    ascii: 'alarm',
    text: s => `Der Krieg in Algerien dauert an. ${s.w.algerien >= 70 ? 'Militärisch ist die FLN im Land fast geschlagen; ihre Armee steht hinter den Sperranlagen in Tunesien und Marokko.' : s.w.algerien >= 40 ? 'Die Armee hält die Städte; auf dem Land kämpfen die Fellaghas weiter.' : 'Die FLN gewinnt an Boden; in den Städten explodieren Bomben.'} Eine halbe Million Soldaten stehen in Algerien, darunter Hunderttausende Wehrpflichtige.

Wie soll es weitergehen?`,
    optionen: [
      { text: 'Verstärkungen schicken.', richtung: 'kolonial',
        ergebnis: 'Paris schickt weitere Truppen nach Algerien.',
        w: { einsatz_algerien: 2, algerien: 4, haushalt: -3, kriegsmuede: 1, armee: 2 }, aktion: s => { s.f.algerien_lage_zuletzt = s.zeit; },
        dient: { kolonien: 1, frieden_kolonien: -0.4 } },
      { text: 'Weiterkämpfen wie bisher.', hist: true,
        ergebnis: 'Der Krieg in Algerien geht weiter.',
        aktion: s => { s.f.algerien_lage_zuletzt = s.zeit; }, dient: { kolonien: 0.5, stabilitaet: 0.2 } },
      { text: 'Geheime Gespräche mit der FLN aufnehmen.', richtung: 'dekolonisation',
        ergebnis: 'Paris nimmt Kontakt zur FLN auf.',
        w: { armee: -8 }, setze: ['algerien_verhandlung'], aktion: s => { s.f.algerien_lage_zuletzt = s.zeit; s.f.verhandlung_seit = s.zeit; },
        dient: { frieden_kolonien: 1.2, kolonien: -0.6 } },
    ],
  },
  {
    id: 'fr_algerien_zusammenbruch',
    titel: 'Die FLN beherrscht das Land',
    datum: 'Lagebericht Algier',
    ab: 1955.1, bis: 1964.1, ordnung: 5, wiederholbar: true,
    wenn: s => algerienkrieg(s) && s.w.algerien <= 10 && !s.f.algerien_verhandlung,
    absender: 'Oberkommandierender in Algerien',
    ascii: 'alarm',
    text: s => `Ganze Landstriche gehorchen nur noch der FLN; in Algier und Oran regiert der Terror. Die Siedler bewaffnen sich, Offiziere sprechen offen davon, die Sache selbst in die Hand zu nehmen. ${s.f.algerien_letzte_stellung ? 'Die letzten Reserven sind schon im Land.' : 'Mit einer allgemeinen Mobilmachung ließe sich das Blatt vielleicht wenden.'}`,
    optionen: [
      { text: 'Verhandlungen mit der FLN aufnehmen.', hist: true, richtung: 'dekolonisation',
        ergebnis: 'Paris lässt der FLN Verhandlungen anbieten. In der Armee gärt es.',
        w: { armee: -10, usa: 3 }, setze: ['algerien_verhandlung'], aktion: s => { s.f.verhandlung_seit = s.zeit; },
        dient: { frieden_kolonien: 1.3, kolonien: -0.8 } },
      { text: 'Mobilmachung: alles nach Algerien.', richtung: 'kolonial',
        nurWenn: s => !s.f.algerien_letzte_stellung,
        ergebnis: 'Paris ruft Reservisten ein und schickt sie nach Algerien. Die Front hält – vorerst. (Fiktion)',
        w: { algerien: 16, einsatz_algerien: 2, haushalt: -8, kriegsmuede: 5, ansehen: -5, armee: 4 }, setze: ['algerien_letzte_stellung'],
        dient: { kolonien: 1.3, frieden_kolonien: -1 } },
    ],
  },
  {
    id: 'fr_algerien_erfolg',
    titel: 'Die FLN ist militärisch geschlagen',
    datum: 'Lagebericht Algier',
    ab: 1959.2, bis: 1964.1, ordnung: 5, wiederholbar: true,
    wenn: s => algerienkrieg(s) && (s.f.algerien_hoch || 0) >= 3 && !s.f.algerien_verhandlung,
    absender: 'Oberkommandierender in Algerien',
    ascii: 'trikolore',
    text: `Seit anderthalb Jahren hat die FLN im Land keine größere Einheit mehr; ihre Führer sitzen in Tunis und Kairo, die Sperranlagen an den Grenzen halten. Die Armee meldet: Militärisch ist der Krieg gewonnen. (Fiktion)

Politisch ist er es nicht. Neun Millionen Muslime haben keine gleichen Rechte, die Welt verlangt Selbstbestimmung, und Frankreich zahlt jedes Jahr Milliarden.`,
    optionen: [
      { text: 'Die Integration: gleiche Rechte für alle, ein Wahlrecht, Algerien bleibt französisch.', richtung: 'kolonial',
        ergebnis: 'Paris verkündet die Integration: Algerien bleibt französisch, alle Algerier bekommen dieselben Rechte wie die Franzosen im Mutterland. Der Krieg ist vorbei; der Preis sind Milliarden für den Aufbau und eine Welt, die Paris misstraut. (Fiktion)',
        w: { armee: 8, haushalt: -6, kriegsmuede: -6, usa: -4, ansehen: 4 }, setze: ['algerien_frieden', 'algerien_integration'],
        dient: { kolonien: 1, frieden_kolonien: 0.4 } },
      { text: 'Aus einer Position der Stärke die Selbstbestimmung anbieten.', hist: true, richtung: 'dekolonisation',
        ergebnis: 'Paris bietet den Algeriern an, selbst über ihre Zukunft zu entscheiden – und lässt Gespräche mit der FLN vorbereiten.',
        w: { armee: -6, usa: 5, ansehen: 3 }, setze: ['selbstbestimmung', 'algerien_verhandlung'], aktion: s => { s.f.verhandlung_seit = s.zeit; },
        dient: { frieden_kolonien: 1.4, kolonien: -0.4 } },
      { text: 'Weiterkämpfen, bis die FLN auch im Ausland aufgibt.', richtung: 'kolonial',
        ergebnis: 'Die Armee kämpft weiter.',
        w: { kriegsmuede: 1 }, aktion: s => { s.f.algerien_hoch = -4; }, dient: { kolonien: 1, frieden_kolonien: -0.6 } },
    ],
  },
];

/** Notizen am Halbjahresende: wie der Krieg steht, und wie er ausgegangen ist */
export const ENDEN = {
  indochina: {
    ausgleich: ['unabhängig', 'Vietnam ist unabhängig und bleibt durch Verträge mit Frankreich verbunden. Ein Krieg in Indochina ist Frankreich erspart geblieben. (Fiktion)'],
    gehalten: ['verbündet', 'Indochina: Der Staat Vietnam unter Bao Dai ist unabhängig und mit Frankreich verbündet; die Viet Minh halten sich nur noch in den Bergen. (Fiktion)'],
    genf: ['geteilt', 'Indochina: Laos und Kambodscha sind unabhängig, Vietnam ist am 17. Breitengrad geteilt – im Norden die Demokratische Republik Ho Chi Minhs, im Süden der Staat Vietnam. In zwei Jahren soll gewählt werden.'],
    frieden: ['unabhängig', 'Indochina: Vietnam ist nach dem Waffenstillstand mit Ho Chi Minh unabhängig; das Expeditionskorps ist heimgekehrt. (Fiktion)'],
    rueckzug: ['aufgegeben', 'Indochina: Frankreich hat sich zurückgezogen; Vietnam fällt an die Viet Minh. (Fiktion)'],
    niederlage: ['verloren', 'Indochina: Frankreich hat den Krieg verloren. Ganz Vietnam gehört den Viet Minh. (Fiktion)'],
  },
  algerien: {
    unabhaengig: ['unabhängig', 'Algerien ist unabhängig. Fast eine Million Europäer verlassen das Land.'],
    integration: ['integriert', 'Algerien ist französisch geblieben – mit gleichen Rechten für alle. (Fiktion)'],
    autonomie: ['Autonomie', 'Algerien hat ein eigenes Parlament und bleibt mit Frankreich verbunden. (Fiktion)'],
  },
};

