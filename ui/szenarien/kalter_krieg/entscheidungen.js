// Entscheidungen, die es in jedem Land gibt – mit denselben Namen und Wirkungen, damit man
// sie nur einmal lernen muss. Landesspezifische Entscheidungen stehen im jeweiligen Landesmodul.
//
// Eine Entscheidung: { id, titel, text (Vorlage, „du“), ab, bis, wenn(s) (sichtbar), moeglich(s)
// (true oder Grund), kosten: { wert: Δ }, abklingzeit (Halbjahre), einmalig, w, setze, aktion,
// ergebnis (dritte Person), zufall, an: { land, id } mit antworten: { ja: {…}, nein: {…} },
// richtung, dient, ki (auch gesteuerte Länder dürfen sie treffen), historisch: [Zeitpunkte] }.

const ORTE = {
  usa: ['usa', 'Washington'],
  moskau: ['su', 'Moskau'],
  grossbritannien: ['grossbritannien', 'London'],
  frankreich: ['frankreich', 'Paris'],
  brd: ['brd', 'Bonn'],
};
// Wer sich einer Supermacht nähert, verstimmt die andere ein wenig
const GEGENSPIELER = { usa: 'moskau', moskau: 'usa' };

/**
 * „Annäherung an …“ für jede Beziehung des Landes. `richtung` ordnet jeder Annäherung die Richtung
 * zu, nach der das Landesmodell die eigenen Parteien reagieren lässt (z. B. { moskau: 'ost' }).
 */
export function annaeherungen(eigenes, richtung = {}) {
  return Object.entries(ORTE).filter(([, [land]]) => land !== eigenes).map(([k, [land, ort]]) => ({
    id: 'annaeherung_' + k,
    titel: `Annäherung an ${ort}`,
    text: `Besuche, freundliche Worte und kleine Zugeständnisse sollen das Verhältnis zu ${ort} verbessern. Nicht jeder im eigenen Land sieht das gern${GEGENSPIELER[k] ? `, und in ${ORTE[GEGENSPIELER[k]][1]} wird man es bemerken` : ''}.`,
    wenn: s => s.welt.laender[land]?.aktiv !== false,
    kosten: { ansehen: -1 },
    w: { [k]: 6, ...(GEGENSPIELER[k] ? { [GEGENSPIELER[k]]: -2 } : {}) },
    abklingzeit: 4,
    richtung: richtung[k],
    ergebnis: `Die Regierung bemüht sich sichtbar um ein besseres Verhältnis zu ${ort}.`,
  }));
}

/** Konjunkturprogramm: mehr Wachstum auf Kosten des Haushalts */
export const konjunkturprogramm = ({ w = {}, ...rest } = {}) => ({
  id: 'konjunkturprogramm',
  titel: 'Ein Konjunkturprogramm auflegen',
  text: 'Öffentliche Aufträge, Kredite für Wohnungsbau und Mittelstand: Das kurbelt die Wirtschaft an, kostet aber Geld und treibt die Preise.',
  kosten: { haushalt: -6 },
  w: { impuls: 1.5, ansehen: 1, ...w },
  abklingzeit: 4,
  ergebnis: 'Die Regierung legt ein Konjunkturprogramm auf.',
  ...rest,
});
