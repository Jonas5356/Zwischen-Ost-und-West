// Modell für Frankreich 1949–1964: Nationalversammlung und Regierungsstürze, Wahlen,
// Kolonialkriege (Indochina, Algerien), Armee, Wirtschaft mit Inflation und Franc.
//
// Die Vierte Republik ist instabil: Regierungen verlieren ihren Rückhalt in der
// Nationalversammlung („Mehrheit“) von selbst, durch Kolonialkriege, Inflation und durch
// Entscheidungen, die einzelne Koalitionsparteien verprellen. Je geringer der Rückhalt,
// desto wahrscheinlicher stürzt die Regierung im Halbjahr. Wer das Land stabilisiert,
// regiert lange. Gewählt wird regulär alle fünf Jahre (1951, 1956, 1961); vorzeitig nur
// nach einer Auflösung, die die Verfassung erst nach zwei Stürzen binnen 18 Monaten erlaubt.

import { jahrVon, zeitIndex, zeitPlus, zeitText, runde1 } from '../../../engine.js';

export const WERTE = {
  usa:             { name: 'Beziehung zu den USA', kurz: 'Washington', min: 0, max: 100, beziehung: 'usa' },
  brd:             { name: 'Beziehung zur Bundesrepublik', kurz: 'Bonn', min: 0, max: 100, beziehung: 'brd' },
  grossbritannien: { name: 'Beziehung zu Großbritannien', kurz: 'London', min: 0, max: 100, beziehung: 'grossbritannien' },
  moskau:          { name: 'Beziehung zu Moskau', kurz: 'Moskau', min: 0, max: 100, beziehung: 'su' },
  rang:            { name: 'Rang Frankreichs in der Welt', kurz: 'Rang', min: 0, max: 100 },
  europa:          { name: 'Europäische Integration', kurz: 'Europa', min: 0, max: 100 },
  atom:            { name: 'Atomprogramm', kurz: 'Atomprogramm', min: 0, max: 100 },
  indochina:       { name: 'Lage in Indochina (100 = Lage unter Kontrolle)', kurz: 'Indochina', min: 0, max: 100 },
  algerien:        { name: 'Lage in Algerien (100 = ruhig)', kurz: 'Algerien', min: 0, max: 100 },
  armee:           { name: 'Loyalität der Armee', kurz: 'Armee', min: 0, max: 100 },
  zustimmung:      { name: 'Zufriedenheit mit der Regierung', kurz: 'Umfrage', min: 5, max: 85, einheit: '%', keinHinweis: true },
  ansehen:         { name: 'Ansehen der Regierung', kurz: 'Ansehen', min: -30, max: 30 },
  mehrheit:        { name: 'Rückhalt in der Nationalversammlung', kurz: 'Mehrheit', min: 0, max: 100 },
  wachstum:        { name: 'Wirtschaftswachstum', kurz: 'Wachstum', min: -10, max: 20, einheit: '%', keinHinweis: true },
  inflation:       { name: 'Inflation', kurz: 'Inflation', min: -5, max: 70, einheit: '%', invertiert: true, keinHinweis: true },
  haushalt:        { name: 'Haushaltslage', kurz: 'Haushalt', min: -20, max: 100 },
  franc:           { name: 'Stabilität des Franc', kurz: 'Franc', min: 0, max: 100 },
  impuls:          { name: 'Konjunkturimpuls', kurz: 'Konjunktur', min: -6, max: 6 },
  preisdruck:      { name: 'Preisdruck', kurz: 'Preisdruck', min: -6, max: 12, invertiert: true },
  kriegsmuede:     { name: 'Kriegsmüdigkeit', min: 0, max: 30, versteckt: true },
  bonus:           { name: 'Amtsbonus', min: -10, max: 25, versteckt: true },
};

// ------------------------------------------------------------------ Parteien

export const PARTEIEN = {
  PCF:  { name: 'Kommunisten (PCF)', kurz: 'PCF', farbe: '#8a1111' },
  SFIO: { name: 'Sozialisten (SFIO)', kurz: 'SFIO', farbe: '#d6455d' },
  RAD:  { name: 'Radikale und UDSR', kurz: 'Radikale', farbe: '#e0a030' },
  MRP:  { name: 'Volksrepublikaner (MRP)', kurz: 'MRP', farbe: '#4a7cc0' },
  UNAB: { name: 'Unabhängige und Bauern', kurz: 'Unabhängige', farbe: '#7b5a35' },
  GAUL: { name: 'Gaullisten', kurz: 'Gaullisten', farbe: '#1c2f6e' },
  POUJ: { name: 'Poujadisten', kurz: 'Poujadisten', farbe: '#8c8c3a' },
};
export const parteiName = p => PARTEIEN[p]?.name || p;
export const parteiKurz = p => PARTEIEN[p]?.kurz || p;

/**
 * Haltung der Parteien zu Richtungen von Entscheidungen (`richtung` an einer Option):
 * Wer in der Regierung sitzt und verprellt wird, entzieht ihr Rückhalt.
 */
const HALTUNG = {
  PCF:  { europa: -2, atlantisch: -3, kolonial: -3, dekolonisation: 2, sozial: 2, sparen: -2, national: 1, ost: 3 },
  SFIO: { europa: 2, atlantisch: 1, kolonial: -1, dekolonisation: 1, sozial: 2, sparen: -2, national: -1, ost: -1, laizitaet: 2, kirche: -3 },
  RAD:  { europa: 0, atlantisch: 1, kolonial: 1, dekolonisation: 0, sozial: 0, sparen: 1, national: 0, ost: -1, laizitaet: 1, kirche: -1 },
  MRP:  { europa: 3, atlantisch: 2, kolonial: 1, dekolonisation: -1, sozial: 1, sparen: 0, national: -2, ost: -2, laizitaet: -2, kirche: 3 },
  UNAB: { europa: 0, atlantisch: 1, kolonial: 2, dekolonisation: -2, sozial: -2, sparen: 2, national: 1, ost: -2, kirche: 1 },
  GAUL: { europa: -3, atlantisch: -1, kolonial: 2, dekolonisation: -2, sozial: 0, sparen: 0, national: 3, ost: -2 },
  POUJ: { europa: -2, atlantisch: 0, kolonial: 3, dekolonisation: -3, sozial: -1, sparen: 1, national: 2, ost: -2 },
};

// ------------------------------------------------------------------ Regierungslager
//
// Ein „Lager“ ist eine Regierungsformel. Die vom Spiel gesteuerte Regierung Frankreichs
// richtet sich nach dem Lager (ki.js: regimeVon).

export const LAGER = {
  tripartisme: { name: 'Tripartisme', parteien: ['PCF', 'SFIO', 'MRP'], toleranz: {},
    beschreibung: 'Die drei großen Parteien der Résistance – Kommunisten, Sozialisten und Volksrepublikaner – regieren gemeinsam.' },
  dritte_kraft: { name: 'Dritte Kraft', parteien: ['SFIO', 'MRP', 'RAD', 'UNAB'], toleranz: {},
    beschreibung: 'Sozialisten, Volksrepublikaner, Radikale und Unabhängige – die Parteien der Mitte gegen Kommunisten und Gaullisten.' },
  mitte_rechts: { name: 'Mitte-rechts', parteien: ['MRP', 'RAD', 'UNAB'], toleranz: { GAUL: 0.3 },
    beschreibung: 'Radikale, Volksrepublikaner und Unabhängige, ohne die Sozialisten; geduldet von einem Teil der Gaullisten.' },
  mendes: { name: 'Regierung Mendès France', parteien: ['RAD', 'SFIO'], toleranz: { MRP: 0.4, GAUL: 0.6, UNAB: 0.3 },
    beschreibung: 'Ein Kabinett der Erneuerung, gestützt auf Radikale und Sozialisten, geduldet von Gaullisten und Teilen der Mitte.' },
  republikanische_front: { name: 'Republikanische Front', parteien: ['SFIO', 'RAD'], toleranz: { MRP: 0.5, PCF: 0.5 },
    beschreibung: 'Sozialisten und Radikale; eine Minderheitsregierung, die von Fall zu Fall Stimmen der Mitte oder der Kommunisten braucht.' },
  volksfront: { name: 'Volksfront', parteien: ['PCF', 'SFIO', 'RAD'], toleranz: {},
    beschreibung: 'Kommunisten, Sozialisten und linke Radikale – zum ersten Mal seit 1947 mit kommunistischen Ministern.' },
  de_gaulle: { name: 'Regierung de Gaulle', parteien: ['GAUL', 'UNAB', 'MRP', 'RAD'], toleranz: {},
    beschreibung: 'General de Gaulle, gestützt auf Gaullisten, Unabhängige und Teile der Mitte.' },
  militaer: { name: 'Militärregierung', parteien: [], toleranz: {},
    beschreibung: 'Generäle, die sich an die Spitze des Staates gesetzt haben.' },
};

// Mögliche Regierungschefs je Lager: [Name, Partei, ab, bis]; der erste passende, der nicht
// gerade gestürzt wurde, bekommt den Auftrag
const CHEFS = {
  // Thorez als Regierungschef ist Fiktion (er war 1946/47 stellvertretender Ministerpräsident)
  tripartisme: [['Georges Bidault', 'MRP', 1946.1, 1946.2], ['Léon Blum', 'SFIO', 1946.2, 1946.2], ['Paul Ramadier', 'SFIO', 1947.1, 1947.2],
    ['Félix Gouin', 'SFIO', 1946.1, 1949.2], ['Georges Bidault', 'MRP', 1947.1, 1949.2], ['Maurice Thorez', 'PCF', 1946.1, 1949.2]],
  dritte_kraft: [['Paul Ramadier', 'SFIO', 1947.1, 1947.2], ['Robert Schuman', 'MRP', 1947.2, 1948.2], ['André Marie', 'RAD', 1948.2, 1948.2], ['Henri Queuille', 'RAD', 1948.2, 1951.2],
    ['Georges Bidault', 'MRP', 1949.2, 1950.1], ['René Pleven', 'RAD', 1950.2, 1952.1],
    ['Robert Schuman', 'MRP', 1947.2, 1953.1], ['Félix Gaillard', 'RAD', 1957.2, 1958.2], ['Pierre Pflimlin', 'MRP', 1955.1, 1958.2], ['Paul Ramadier', 'SFIO', 1949.2, 1958.2], ['Robert Lecourt', 'MRP', 1949.2, 1958.2]],
  mitte_rechts: [['Edgar Faure', 'RAD', 1952.1, 1952.1], ['Antoine Pinay', 'UNAB', 1952.1, 1952.2], ['René Mayer', 'RAD', 1953.1, 1953.1], ['Joseph Laniel', 'UNAB', 1953.2, 1954.1],
    ['Edgar Faure', 'RAD', 1955.1, 1958.2], ['Pierre Pflimlin', 'MRP', 1958.1, 1958.2], ['Antoine Pinay', 'UNAB', 1953.1, 1958.2], ['René Mayer', 'RAD', 1952.2, 1958.2],
    ['Georges Bidault', 'MRP', 1950.1, 1958.2], ['Henri Queuille', 'RAD', 1949.2, 1958.2], ['René Pleven', 'RAD', 1949.2, 1958.2], ['Joseph Laniel', 'UNAB', 1952.1, 1958.2]],
  mendes: [['Pierre Mendès France', 'RAD', 1952.1, 1964.1], ['Edgar Faure', 'RAD', 1952.1, 1964.1]],
  republikanische_front: [['Guy Mollet', 'SFIO', 1955.2, 1957.1], ['Maurice Bourgès-Maunoury', 'RAD', 1957.1, 1957.2], ['Guy Mollet', 'SFIO', 1951.2, 1964.1],
    ['Christian Pineau', 'SFIO', 1951.2, 1964.1], ['Gaston Defferre', 'SFIO', 1951.2, 1964.1], ['Maurice Bourgès-Maunoury', 'RAD', 1951.2, 1964.1], ['Jules Moch', 'SFIO', 1946.1, 1964.1]],
  volksfront: [['Daniel Mayer', 'SFIO', 1946.1, 1964.1], ['Pierre Cot', 'RAD', 1946.1, 1964.1], ['Édouard Depreux', 'SFIO', 1946.1, 1964.1]],
};

/** Historisches Lager zu einem Zeitpunkt (für den Randvermerk „wie in der Geschichte“) */
export function historischesLager(z) {
  const i = zeitIndex(z);
  if (i < zeitIndex(1947.2)) return 'tripartisme';
  if (i < zeitIndex(1952.1)) return 'dritte_kraft';
  if (i < zeitIndex(1954.2)) return 'mitte_rechts';
  if (i < zeitIndex(1955.1)) return 'mendes';
  if (i < zeitIndex(1956.1)) return 'mitte_rechts';
  if (i < zeitIndex(1957.2)) return 'republikanische_front';
  if (i < zeitIndex(1958.2)) return 'dritte_kraft';
  return 'de_gaulle';
}

const sitzeVon = (s, parteien) => parteien.reduce((x, p) => x + (s.sitze[p] || 0), 0);
export const gesamtSitze = s => Object.values(s.sitze).reduce((x, y) => x + y, 0);

/** Stimmen, auf die ein Lager bei der Investitur zählen kann (Kern plus Duldung) */
export function lagerStimmen(s, lager) {
  const L = LAGER[lager];
  let n = sitzeVon(s, L.parteien);
  for (const [p, anteil] of Object.entries(L.toleranz)) n += anteil * (s.sitze[p] || 0);
  return n;
}

/** Welche Regierungsformeln kommen jetzt in Frage? */
export function moeglicheLager(s) {
  const g = gesamtSitze(s);
  const z = s.zeit;
  const out = [];
  const reicht = l => lagerStimmen(s, l) > g / 2;
  // Solange die Kommunisten in der Regierung sind, regieren die drei großen Parteien gemeinsam;
  // die „Dritte Kraft“ entsteht erst ohne sie
  if (!s.f.pcf_raus && reicht('tripartisme')) out.push('tripartisme');
  // Die Dritte Kraft zerbricht am Schulstreit: Danach gehen die Sozialisten in die Opposition
  if ((s.f.pcf_raus || z >= 1948.1) && !s.f.schulstreit_bruch && reicht('dritte_kraft')) out.push('dritte_kraft');
  if (z >= 1951.2 && reicht('mitte_rechts')) out.push('mitte_rechts');
  // Mendès France hat erst nach einer Niederlage in Indochina oder einer schweren Krise eine Chance
  if ((s.f.dien_bien_phu || s.f.indochina_krise || s.w.indochina < 25 || z >= 1955.1) && !s.f.mendes_gestuerzt && z >= 1953.2 && reicht('mendes')) out.push('mendes');
  if ((z >= 1955.2 || s.f.schulstreit_bruch) && reicht('republikanische_front')) out.push('republikanische_front');
  if (s.f.linksbuendnis && reicht('volksfront')) out.push('volksfront');
  // Wenn gar nichts reicht: eine Mitte-rechts-Minderheitsregierung oder die Dritte Kraft
  if (!out.length) out.push(z >= 1952.1 ? 'mitte_rechts' : s.f.pcf_raus || z >= 1948.1 ? 'dritte_kraft' : 'tripartisme');
  return out;
}

/** Kandidat für die Regierungsbildung eines Lagers */
export function kandidatFuer(s, lager) {
  const liste = CHEFS[lager] || [];
  const kuerzlich = new Set((s.chefliste || []).filter(c => zeitIndex(s.zeit) - zeitIndex(c.ab) <= 2).map(c => c.name));
  const passt = liste.filter(([, , ab, bis]) => s.zeit >= ab && s.zeit <= bis + 0.05);
  const c = passt.find(([n]) => n !== s.regierungschef && !kuerzlich.has(n))
    || passt.find(([n]) => n !== s.regierungschef) || liste.find(([n]) => n !== s.regierungschef) || liste[0];
  return { name: c[0], partei: c[1] };
}

/** Eine neue Regierung tritt an */
export function bildeRegierung(s, lager, chef = kandidatFuer(s, lager)) {
  const L = LAGER[lager];
  s.lager = lager;
  s.regierungschef = chef.name;
  s.chefPartei = chef.partei;
  s.regierung = [...L.parteien].filter(p => p !== 'GAUL' || s.republik === 5 || lager === 'de_gaulle');
  // Rückhalt zu Beginn: wie viele Stimmen das Lager hat, plus Schonfrist
  s.w.mehrheit = startMehrheit(s, lager);
  s.w.ansehen = 0;
  s.w.bonus = s.republik === 5 ? s.w.bonus : 3;
  notiereChef(s);
}

/** Rückhalt einer neuen Regierung: je mehr Stimmen das Lager hat, desto mehr; dazu eine Schonfrist */
export function startMehrheit(s, lager) {
  const anteil = lagerStimmen(s, lager) / (gesamtSitze(s) || 1);
  return Math.max(25, Math.min(85, Math.round(42 + 80 * (anteil - 0.5) + (s.republik === 5 ? 25 : 0))));
}

export function notiereChef(s) {
  const l = (s.chefliste ||= []);
  const letzter = l[l.length - 1];
  if (!letzter || letzter.name !== s.regierungschef || letzter.lager !== s.lager) l.push({ name: s.regierungschef, partei: s.chefPartei, lager: s.lager, ab: s.zeit });
}

/** Titel des Regierungschefs: Ministerpräsident (Président du Conseil) bzw. Premierminister */
export const chefTitel = s => (s.republik === 5 ? 'Premierminister' : s.f.provisorisch ? 'Regierungschef' : s.lager === 'militaer' ? 'Chef der Militärregierung' : 'Ministerpräsident');
export const istDeGaulle = s => s.lager === 'de_gaulle';
export const vierte = s => s.republik === 4 && s.lager !== 'militaer';
export const fuenfte = s => s.republik === 5;

// ------------------------------------------------------------------ Startzustand

export function startzustand() {
  // Januar 1946: De Gaulle ist als Chef der Provisorischen Regierung zurückgetreten.
  return {
    w: {
      rang: 34, europa: 0, atom: 3, indochina: 52, algerien: 72, armee: 68,
      zustimmung: 40, ansehen: 0, mehrheit: 55, wachstum: 10, inflation: 40, haushalt: 25, franc: 30,
      impuls: 0, preisdruck: 3, kriegsmuede: 1, bonus: 0,
    },
    f: { apparentements: false, provisorisch: true, 'gebildet_1946.1': true },
    republik: 4,
    lager: 'tripartisme',
    regierungschef: 'Félix Gouin',
    chefPartei: 'SFIO',
    praesident: 'Vincent Auriol',
    chefliste: [{ name: 'Félix Gouin', partei: 'SFIO', lager: 'tripartisme', ab: 1946.1 }],
    regierung: ['PCF', 'SFIO', 'MRP'],
    stuerze: [],
    legislaturBeginn: 1945.2,
    // Erste Verfassunggebende Versammlung (Oktober 1945), vereinfacht
    sitze: { PCF: 159, SFIO: 146, MRP: 150, RAD: 57, UNAB: 64 },
  };
}

/** Wer ernennt die Regierung? Bis zur Verfassung der Präsident der Verfassunggebenden Versammlung */
export const praesidentText = s => (s.f.provisorisch ? `Präsident der Verfassunggebenden Versammlung ${s.praesident}` : `Präsident der Republik ${s.praesident}`);

// ------------------------------------------------------------------ Wirtschaft

// Grundwachstum (real, % p. a.) und Grundinflation, ohne die im Modell erklärten Teile
const BASIS = { 1946: 11, 1947: 7, 1948: 8, 1949: 7.0, 1950: 7.0, 1951: 6.0, 1952: 3.0, 1953: 3.2, 1954: 5.0, 1955: 5.6, 1956: 5.4, 1957: 6.0, 1958: 3.0, 1959: 3.5, 1960: 7.0, 1961: 5.5, 1962: 6.6, 1963: 5.3, 1964: 6.5 };
const INFLATION = { 1946: 40, 1947: 42, 1948: 40, 1949: 9, 1950: 7, 1951: 9, 1952: 6, 1953: 1, 1954: 1, 1955: 1.5, 1956: 2.5, 1957: 3.5, 1958: 7, 1959: 4, 1960: 3.5, 1961: 3.3, 1962: 4.5, 1963: 4.5, 1964: 3.5 };

export const algerienkrieg = s => !!s.f.algerienkrieg && !s.f.algerien_frieden;
/** Krieg in Indochina: seit Dezember 1946 (Haiphong), bis zu einem Frieden */
export const indochinakrieg = s => !!s.f.indochinakrieg && !s.f.indochina_beendet;

export function berechneUmfrage(s) {
  const w = s.w;
  // Hohe Inflation ärgert, aber an Nachkriegsraten gewöhnt man sich: der Abzug ist begrenzt
  let u = 30 + 0.8 * (Math.min(w.wachstum, 10) - 4) - 0.7 * Math.min(w.inflation - 4, 16) + w.ansehen + w.bonus - w.kriegsmuede;
  if (s.lager === 'de_gaulle') u += 18;
  if (s.lager === 'militaer') u -= 10;
  return Math.max(5, Math.min(85, runde1(u)));
}

export function rundenende(s, a) {
  const w = s.w;
  const j = jahrVon(s.zeit);

  // --- Wachstum
  let g = BASIS[j] ?? 5;
  g += w.impuls;
  g += 0.03 * (w.europa - 20) + 0.01 * (w.usa - 55);
  if (indochinakrieg(s)) g -= 0.6;
  if (algerienkrieg(s)) g -= 0.9;
  if (w.franc < 20) g -= (20 - w.franc) * 0.06;
  if (w.haushalt < 15) g -= (15 - w.haushalt) * 0.05;
  if (w.inflation > 12) g -= 0.6;
  if (s.f.plan_modernisierung) g += 0.3;
  if (s.lager === 'militaer') g -= 2;
  g += 0.7 * a.normal();
  w.wachstum = runde1(Math.max(-8, Math.min(14, g)));
  w.impuls *= 0.5;

  // --- Inflation: Grundrate, Preisdruck aus Defiziten und Krieg, Korea-Boom
  let inf = 0.4 * w.inflation + 0.6 * (INFLATION[j] ?? 4) + w.preisdruck;
  if (w.haushalt < 25) inf += (25 - w.haushalt) * 0.12;
  if (algerienkrieg(s)) inf += 0.8;
  if (s.weltflags.koreakrieg && j <= 1951) inf += 3;
  inf += 0.6 * a.normal();
  w.inflation = runde1(Math.max(-3, Math.min(65, inf)));
  w.preisdruck *= 0.5;

  // --- Haushalt
  let lasten = 0;
  if (indochinakrieg(s)) lasten += 1.6;
  if (algerienkrieg(s)) lasten += 2.2 + (s.f.wehrpflicht_verlaengert ? 0.6 : 0);
  if (s.f.atomprogramm) lasten += 0.4;
  if (s.f.sozialprogramm) lasten += 0.4;
  // Wiederaufbau und Versorgung bis zum Marshallplan
  if (j < 1949) lasten += s.f.marshallplan ? 1.8 : 3;
  w.haushalt = runde1(w.haushalt + 0.5 * (w.wachstum - 4) + 1.6 - lasten);

  // --- Franc: verliert Vertrauen mit der Inflation
  w.franc = runde1(w.franc + (55 - w.franc) * 0.1 - 0.5 * (Math.min(w.inflation, 12) - 5) + (w.haushalt > 40 ? 1 : 0));

  // --- Kolonialkriege
  if (indochinakrieg(s)) {
    let d = -2.5 + (s.f.de_lattre ? 1.5 : 0) + (s.f.indochina_amerikahilfe ? 1 : 0) + (s.weltflags.koreakrieg_ende ? -1.5 : 0) + 2 * a.normal();
    w.indochina += d;
    w.kriegsmuede += 0.8;
  }
  if (algerienkrieg(s)) {
    let d = -2 + (s.f.algerien_truppen ? 2 : 0) + (s.f.challe_plan ? 1.5 : 0) + (s.f.algerien_verhandlung ? 1 : 0) + 2 * a.normal();
    w.algerien += d;
    w.kriegsmuede += 1;
    w.rang -= 0.4;
    // Verhandlungen mit der FLN kosten die Loyalität der Armee, harte Linie stärkt sie
    if (s.f.algerien_verhandlung) w.armee -= 3;
    else w.armee += 0.5;
  } else if (!s.f.algerienkrieg && s.zeit >= 1952.1) {
    // Vor dem Krieg: Die Lage verschlechtert sich langsam, wenn nichts geschieht
    w.algerien -= s.f.algerien_reformen ? 0.5 : 1.5;
  }
  if (s.f.algerien_frieden || s.f.indochina_beendet) w.kriegsmuede *= 0.85;
  w.kriegsmuede = runde1(Math.max(0, w.kriegsmuede - 0.3));

  // --- Atomprogramm
  if (s.f.atomprogramm && w.atom < 100) w.atom += 6 + (s.f.fig ? 3 : 0) + (s.lager === 'de_gaulle' ? 3 : 0);

  // --- Langsame Rückkehr zu Normalwerten
  w.armee += (60 - w.armee) * 0.06;
  w.rang += (40 - w.rang) * 0.05;
  w.ansehen *= 0.75;
  w.bonus *= s.lager === 'de_gaulle' ? 0.95 : 0.7;
  for (const [k, ziel] of [['usa', 55], ['grossbritannien', 55], ['moskau', 35], ['brd', s.zeit >= 1955 ? 55 : 45]]) w[k] += (ziel - w[k]) * 0.08;

  // --- Rückhalt in der Nationalversammlung. In der Vierten Republik strebt er einem Niveau zu,
  // das von der Lage abhängt: Grundsätzlich niedrig (zersplitterte Parteien), höher mit einer
  // breiten Mehrheit, einer Reform der Verfassung, zufriedenen Bürgern und ohne Kolonialkrieg.
  // Entscheidungen verschieben ihn kurzfristig; je geringer er ist, desto eher stürzt die Regierung.
  if (vierte(s)) {
    const anteil = lagerStimmen(s, s.lager) / (gesamtSitze(s) || 1);
    let ziel = 19 + 80 * (anteil - 0.5) + 0.6 * (w.zustimmung - 25);
    if (s.f.stabilitaet_reform) ziel += 7;
    if (s.f.stabilitaet_reform2) ziel += 10;
    // Präsidialverfassung von 1946 (Fiktion): ein starker Präsident stützt die Regierung
    if (s.f.praesidialverfassung) ziel += 8;
    if (!indochinakrieg(s) && !algerienkrieg(s)) ziel += 10;
    if (w.inflation > 8) ziel -= 4;
    if (indochinakrieg(s) && w.indochina < 30) ziel -= 5;
    if (algerienkrieg(s) && w.algerien < 40) ziel -= 5;
    w.mehrheit += 0.5 * (ziel - w.mehrheit);
  } else if (fuenfte(s)) {
    w.mehrheit += (70 - w.mehrheit) * 0.2;
  }

  for (const k of ['usa', 'grossbritannien', 'moskau', 'brd', 'rang', 'armee', 'ansehen', 'mehrheit', 'indochina', 'algerien', 'atom']) w[k] = runde1(w[k]);
  for (const k of Object.keys(WERTE)) {
    const d = WERTE[k];
    if (d.beziehung) continue;
    if (d.min !== undefined && w[k] < d.min) w[k] = d.min;
    if (d.max !== undefined && w[k] > d.max) w[k] = d.max;
  }
  w.zustimmung = berechneUmfrage(s);

  // --- Regierungssturz in der Vierten Republik: je schwächer der Rückhalt, desto wahrscheinlicher
  if (vierte(s) && !istWahlHalbjahr(s) && !s.f['gebildet_' + s.zeit]) {
    const p = Math.max(0, Math.min(0.9, (50 - w.mehrheit) / 30));
    if (a.zufall() < p) sturz(s, 'misstrauen');
  }

  // Das RPF: De Gaulle sammelt seine Anhänger gegen das „Regime der Parteien“
  if (zeitIndex(s.zeit) === zeitIndex(1947.1) && !s.f.rpf && !s.f.de_gaulle) {
    s.f.rpf = true;
    (s.notizen ||= []).push('In Straßburg ruft General de Gaulle das „Rassemblement du peuple français“ ins Leben – gegen das „Regime der Parteien“.');
  }
  // Der Präsident der Republik
  if (s.republik === 4 && zeitIndex(s.zeit) >= zeitIndex(1953.2) && s.praesident === 'Vincent Auriol') {
    s.praesident = 'René Coty';
    (s.notizen ||= []).push('Nach dreizehn Wahlgängen in Versailles ist René Coty zum Präsidenten der Republik gewählt worden. Er folgt im Januar auf Vincent Auriol.');
  }
  // Fünfte Republik: Debré geht 1962, Pompidou wird Premierminister
  if (fuenfte(s) && s.regierungschef === 'Michel Debré' && zeitIndex(s.zeit) >= zeitIndex(1961.2) && s.f.algerien_frieden) {
    s.regierungschef = 'Georges Pompidou';
    s.chefPartei = 'GAUL';
    notiereChef(s);
    (s.notizen ||= []).push('Michel Debré tritt nach dem Ende des Algerienkriegs zurück. Präsident de Gaulle ernennt Georges Pompidou, bisher Direktor der Bank Rothschild, zum Premierminister.');
  }
}

const istWahlHalbjahr = s => (s.wahlplan || []).some(z => zeitIndex(z) === zeitIndex(s.zeit));

/** Die Regierung ist gestürzt: Regierungskrise am Rundenende bzw. nach der Entscheidung */
export function sturz(s, anlass) {
  if (s.f.krise_offen) return;
  s.f.krise_offen = true;
  s.krisenAnlass = anlass;
  (s.stuerze ||= []).push(s.zeit);
  if (s.lager === 'mendes') s.f.mendes_gestuerzt = true;
  // Die Armee verachtet das „Regime der Parteien“: Jeder Sturz kostet Vertrauen
  if (algerienkrieg(s)) s.w.armee -= 3;
  delete s.erledigt['dyn:regierungskrise'];
  (s.einschub ||= []).push('dyn:regierungskrise');
}

/**
 * Auflösung der Nationalversammlung (Art. 51 der Verfassung von 1946): erst nach 18 Monaten
 * Legislatur und wenn binnen 18 Monaten zwei Regierungen gestürzt wurden.
 */
export function aufloesungMoeglich(s) {
  if (!vierte(s) || s.f.provisorisch) return false;
  const jetzt = zeitIndex(s.zeit);
  if (jetzt - zeitIndex(s.legislaturBeginn) < 3) return false;
  const kuerzlich = (s.stuerze || []).filter(z => jetzt - zeitIndex(z) <= 3);
  // keine Auflösung, wenn ohnehin im nächsten Halbjahr gewählt wird
  if ((s.wahlplan || []).some(z => zeitIndex(z) - jetzt <= 1 && zeitIndex(z) >= jetzt)) return false;
  // Mit der Präsidialverfassung (Fiktion) genügt ein Sturz
  return kuerzlich.length >= (s.f.praesidialverfassung ? 1 : 2);
}

/** Wahl vorziehen (Auflösung): im nächsten Halbjahr, danach wieder im Fünfjahrestakt */
export function zieheWahlVor(s, n = 1) {
  const neu = zeitPlus(s.zeit, n);
  s.wahlplan = [neu, zeitPlus(neu, 10)];
}

// ------------------------------------------------------------------ Wahlen

// Stimmenanteile ohne Regierungsbilanz (Vierte Republik), grob nach 1946, 1951 und 1956
function grundanteile(s, j) {
  if (j < 1951) {
    // 1946: drei große Parteien; ab 1947 wächst das RPF de Gaulles
    const t = Math.max(0, Math.min(1, (j - 1946) / 5));
    const gaul = s.f.rpf ? 16 + 6 * t : 2;
    return { PCF: 27, SFIO: 20 - 5 * t, RAD: 11, MRP: 27 - 14 * t - (s.f.rpf ? 6 : 0), UNAB: 13, GAUL: gaul, POUJ: 0 };
  }
  const t = Math.max(0, Math.min(1, (j - 1951) / 5));
  const lin = (a, b) => a + (b - a) * t;
  const st = {
    PCF: lin(26, 25.5), SFIO: lin(15, 15), RAD: lin(11, 14), MRP: lin(13, 11), UNAB: lin(13, 15), GAUL: lin(22, 5), POUJ: 0,
  };
  if (s.f.poujade) { st.POUJ = 11; st.UNAB -= 3; st.GAUL -= 1; st.RAD -= 2; }
  else st.GAUL += t * 6;
  return st;
}

export function wahl(s, a) {
  const j = jahrVon(s.zeit);
  const st = s.republik === 5
    ? { PCF: 20, SFIO: 14, RAD: 8, MRP: 10, UNAB: 18, GAUL: 26, POUJ: 1 }
    : grundanteile(s, j);
  // Regierungsbilanz: Die Parteien der Regierung gewinnen oder verlieren
  const bilanz = 0.25 * (s.w.zustimmung - 35);
  const reg = s.regierung.filter(p => st[p] !== undefined);
  for (const p of reg) st[p] += bilanz / Math.max(1, reg.length);
  if (s.republik === 5) st.GAUL += 0.35 * (s.w.zustimmung - 45) + (j >= 1962 ? 6 : 0);
  // Instabilität treibt Wähler zu den Gaullisten, Inflation und Steuern zu Poujade
  if (s.republik === 4) st.GAUL += Math.max(0, (35 - s.w.mehrheit) / 10);
  if (s.f.algerien_frieden) { st.UNAB -= 2; st.GAUL += 1; }
  for (const k of Object.keys(st)) st[k] = Math.max(0, st[k] + (k === 'POUJ' && !st[k] ? 0 : 1.2 * a.normal()));
  const summe = Object.values(st).reduce((x, y) => x + y, 0);
  for (const k of Object.keys(st)) st[k] = runde1(100 * st[k] / summe);

  // Sitze: Vierte Republik Verhältniswahl (1951 mit „Apparentements“, die Kommunisten und
  // Gaullisten benachteiligen), Fünfte Republik Mehrheitswahl in Wahlkreisen
  const gesamt = s.republik === 5 ? 480 : 600;
  const gewicht = {};
  for (const [p, v] of Object.entries(st)) {
    if (s.republik === 5) gewicht[p] = v ** 1.5 * (p === 'PCF' ? (j >= 1962 ? 0.45 : 0.22) : p === 'GAUL' ? 1.25 : 1);
    else gewicht[p] = v * (s.f.apparentements && j <= 1953 ? (p === 'PCF' ? 0.65 : p === 'GAUL' ? 0.85 : 1.15) : 1);
  }
  const gsum = Object.values(gewicht).reduce((x, y) => x + y, 0);
  const sitze = {};
  let vergeben = 0;
  for (const p of Object.keys(st)) { sitze[p] = Math.floor(gesamt * gewicht[p] / gsum); vergeben += sitze[p]; }
  const reste = Object.keys(st).map(p => [p, gesamt * gewicht[p] / gsum - sitze[p]]).sort((x, y) => y[1] - x[1]);
  for (let i = 0; vergeben < gesamt; i++, vergeben++) sitze[reste[i % reste.length][0]]++;
  for (const p of Object.keys(sitze)) if (!sitze[p]) delete sitze[p];

  s.sitze = sitze;
  s.legislaturBeginn = s.zeit;
  s.f.legislatur = (s.f.legislatur || 1) + 1;
  // Nach der Wahl: nächste reguläre Wahl in fünf Jahren. Eine Verfassunggebende Versammlung
  // wählt nur bis zur Verfassung; die Wahl von 1951 lag historisch im Juni (1951/I).
  const verfassunggebend = !!s.f.provisorisch;
  const frueher = (s.wahlplan || []).filter(z => zeitIndex(z) < zeitIndex(s.zeit));
  if (s.f.provisorisch) s.wahlplan = [...frueher, s.zeit, ...(s.wahlplan || []).filter(z => zeitIndex(z) > zeitIndex(s.zeit))];
  else s.wahlplan = [...frueher, s.zeit, zeitIndex(s.zeit) === zeitIndex(1946.2) ? 1951.1 : zeitPlus(s.zeit, 10)];
  return { zeit: s.zeit, stimmen: st, sitze: { ...sitze }, gesamt, republik: s.republik, verfassunggebend };
}

// ------------------------------------------------------------------ Lager und Ziele der gesteuerten Regierung

/** Ziele, denen die Wahl eines Lagers dient (für die vom Spiel gesteuerte Regierung) */
const LAGER_DIENT = {
  tripartisme: { sozial: 0.5, unabhaengigkeit: 0.3 },
  dritte_kraft: { europa: 0.4, westbindung: 0.4, deutschland_einbinden: 0.3 },
  mitte_rechts: { kolonien: 0.5, saar: 0.3, deutschland_klein: 0.2 },
  mendes: { frieden_kolonien: 0.6, modernisierung: 0.4 },
  republikanische_front: { sozial: 0.5, europa: 0.3 },
  volksfront: { sozial: 0.6, frieden_kolonien: 0.5, westbindung: -0.8 },
};

function sitzText(s) {
  const teile = Object.entries(s.sitze).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${parteiKurz(k)} ${v}`);
  return `Sitzverteilung: ${teile.join(' · ')} (Mehrheit ab ${Math.floor(gesamtSitze(s) / 2) + 1}).`;
}
const pct = x => `${x.toFixed(1).replace('.', ',')} %`;

/** Text, Ergebnis und Wirkung für einen bestimmten Kandidaten */
function kandidatOption(s, lager, k) {
  const L = LAGER[lager];
  const stimmen = Math.round(lagerStimmen(s, lager));
  return {
    text: `${k.name} (${parteiKurz(k.partei)}) beauftragen: ${L.name}.`,
    hist: false,
    ergebnis: `${k.name} wird Ministerpräsident: ${L.name}. Die Nationalversammlung spricht ihm mit ${stimmen} von ${gesamtSitze(s)} Stimmen das Vertrauen aus.`,
    aktion: st => { bildeRegierung(st, lager, k); st.f['gebildet_' + st.zeit] = true; },
  };
}

/** Option: ein Lager mit einem Kandidaten beauftragen */
function lagerOption(s, lager) {
  const k = kandidatFuer(s, lager);
  const L = LAGER[lager];
  const stimmen = Math.round(lagerStimmen(s, lager));
  const g = gesamtSitze(s);
  return {
    text: `${k.name} (${parteiKurz(k.partei)}) beauftragen: ${L.name}.`,
    hist: historischesLager(s.zeit) === lager,
    richtung: lager === 'volksfront' ? 'ost' : undefined,
    dient: LAGER_DIENT[lager],
    w: { mehrheit: startMehrheit(s, lager) - s.w.mehrheit },
    ergebnis: `${k.name} wird Ministerpräsident: ${L.name}. Die Nationalversammlung spricht ihm mit ${stimmen} von ${g} Stimmen das Vertrauen aus.`,
    aktion: st => {
      bildeRegierung(st, lager, k);
      st.f['gebildet_' + st.zeit] = true;
      if (lager === 'volksfront') st.f.volksfront = true;
    },
  };
}

// ------------------------------------------------------------------ dynamische Ereignisse

export const dynamisch = {
  regierungskrise(s) {
    const anlass = s.krisenAnlass || 'misstrauen';
    const nachWahl = anlass === 'wahl';
    const lager = moeglicheLager(s);
    const opts = lager.map(l => lagerOption(s, l));
    // Gibt es nur eine Formel, kommen zwei Kandidaten in Frage
    if (lager.length === 1) {
      const zweiter = kandidatFuer({ ...s, zeit: s.zeit, regierungschef: s.regierungschef, chefliste: [...(s.chefliste || []), { name: kandidatFuer(s, lager[0]).name, ab: s.zeit }] }, lager[0]);
      if (zweiter.name !== kandidatFuer(s, lager[0]).name) opts.push({ ...lagerOption(s, lager[0]), ...kandidatOption(s, lager[0], zweiter) });
    }
    // Statt zurückzutreten, die Nationalversammlung auflösen (wie Edgar Faure im Dezember 1955)
    if (!nachWahl && aufloesungMoeglich(s)) {
      opts.push({
        text: 'Nicht zurücktreten, sondern die Nationalversammlung auflösen und neu wählen lassen.',
        hist: zeitIndex(s.zeit) === zeitIndex(1955.2),
        w: { mehrheit: 35 - s.w.mehrheit, ansehen: -2 },
        dient: { stabilitaet: 0.5 },
        ergebnis: `${s.regierungschef} löst die Nationalversammlung auf – zum ersten Mal seit 1877. Bis zur Wahl im nächsten Halbjahr bleibt die Regierung geschäftsführend im Amt.`,
        aktion: st => { zieheWahlVor(st, 1); st.f['gebildet_' + st.zeit] = true; },
      });
    }
    const einleitung = nachWahl
      ? (s.f.provisorisch ? 'Die neue Verfassunggebende Versammlung ist gewählt. Die Provisorische Regierung tritt zurück; die Versammlung wählt einen neuen Regierungschef.' : 'Die neue Nationalversammlung ist gewählt. Wie in der Vierten Republik üblich, tritt die Regierung zurück; der Präsident der Republik muss einen neuen Ministerpräsidenten zur Investitur vorschlagen.')
      : `Die Regierung ${s.regierungschef} ist gestürzt. ${anlass === 'vertrauen' ? 'Sie hat die Vertrauensfrage verloren.' : 'Ihre Mehrheit ist zerfallen; in einer Vertrauensabstimmung hat sie keine Mehrheit mehr gefunden.'} ${praesidentText(s)} hat die Fraktionsvorsitzenden zu sich gebeten.`;
    return {
      titel: nachWahl ? `Regierungsbildung ${jahrVon(s.zeit)}` : 'Regierungskrise',
      datum: zeitText(s.zeit),
      art: 'haupt',
      inland: false,
      absender: praesidentText(s),
      text: `${einleitung}\n\n${sitzText(s)}\n\nWen soll der Präsident mit der Regierungsbildung beauftragen? Du führst die neue Regierung weiter.`,
      optionen: opts,
      nachher: st => { delete st.f.krise_offen; delete st.krisenAnlass; },
    };
  },

  regierungsbildung(s) {
    // Nach jeder Wahl: in der Fünften Republik bleibt der Premierminister, wenn die Mehrheit hält
    if (s.republik === 5) {
      const e = s.wahlen[s.wahlen.length - 1];
      const mehr = (e.sitze.GAUL || 0) + (e.sitze.UNAB || 0) * 0.5 + (e.sitze.MRP || 0) * 0.5;
      const reicht = mehr > e.gesamt / 2;
      return {
        titel: `Die neue Nationalversammlung ${jahrVon(s.zeit)}`,
        datum: zeitText(s.zeit),
        art: 'haupt',
        absender: 'Präsident der Republik Charles de Gaulle',
        text: `Die Wahl ist entschieden: Die Gaullisten erhalten ${e.sitze.GAUL || 0} von ${e.gesamt} Sitzen. ${reicht ? 'Die Regierung kann sich auf eine Mehrheit stützen.' : 'Ohne die Unabhängigen und die Volksrepublikaner hat die Regierung keine Mehrheit.'}\n\nMit welcher Mehrheit soll regiert werden?`,
        optionen: [
          { text: 'Mit den Gaullisten und den Unabhängigen regieren.', hist: true,
            ergebnis: `${s.regierungschef} bleibt Premierminister. Die Regierung stützt sich auf Gaullisten und Unabhängige.`,
            aktion: st => { st.regierung = ['GAUL', 'UNAB']; st.w.mehrheit = reicht ? 75 : 55; } },
          { text: 'Die Mitte einbinden: Volksrepublikaner und Radikale in die Regierung holen.',
            ergebnis: 'Eine breite Regierung der nationalen Einheit. Europa-Freunde und Gaullisten sitzen am selben Kabinettstisch.',
            w: { europa: 2 }, richtung: 'europa',
            aktion: st => { st.regierung = ['GAUL', 'UNAB', 'MRP', 'RAD']; st.w.mehrheit = 72; } },
        ],
      };
    }
    s.krisenAnlass = 'wahl';
    const krise = dynamisch.regierungskrise(s);
    const e = s.wahlen[s.wahlen.length - 1];
    const st = e.stimmen;
    const stand = Object.entries(st).filter(([, v]) => v >= 3).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${parteiKurz(k)} ${pct(v)}`).join(', ');
    return { ...krise, text: `Ergebnis: ${stand}.\n\n${krise.text}` };
  },

  misstrauensvotum(s) {
    // Fünfte Republik: Die Nationalversammlung spricht der Regierung das Misstrauen aus
    return {
      titel: 'Misstrauensantrag',
      datum: zeitText(s.zeit),
      art: 'haupt',
      absender: 'Präsident der Nationalversammlung',
      text: `Die Opposition hat einen Misstrauensantrag gegen die Regierung ${s.regierungschef} eingebracht – und er hat eine Mehrheit. Nach der neuen Verfassung muss der Premierminister zurücktreten. Der Präsident kann aber die Nationalversammlung auflösen.`,
      optionen: [
        { text: 'Die Nationalversammlung auflösen und das Volk entscheiden lassen.', hist: true,
          ergebnis: 'Präsident de Gaulle löst die Nationalversammlung auf. Neuwahlen finden im nächsten Halbjahr statt; bis dahin bleibt die Regierung im Amt.',
          w: { ansehen: 2, mehrheit: 40 },
          aktion: st => { zieheWahlVor(st, 0); } },
        { text: 'Einen neuen Premierminister aus der Mitte ernennen.',
          ergebnis: 'Ein Kompromisskandidat der Mitte wird Premierminister. Die Gaullisten murren.',
          w: { ansehen: -3, mehrheit: 50 }, richtung: 'europa',
          aktion: st => { st.regierungschef = 'Antoine Pinay'; st.chefPartei = 'UNAB'; notiereChef(st); } },
      ],
      nachher: st => { delete st.f.krise_offen; },
    };
  },

  franckrise(s) {
    return {
      titel: 'Der Franc unter Druck',
      datum: zeitText(s.zeit),
      art: 'haupt',
      absender: 'Banque de France',
      text: `Die Devisenreserven schmelzen. Spekulanten wetten auf eine Abwertung, Kapital flieht in die Schweiz, die Zahlungsbilanz ist tief im Minus. Der Gouverneur der Banque de France warnt: In wenigen Wochen kann Frankreich seine Importe nicht mehr bezahlen.`,
      optionen: [
        { text: 'Den Franc abwerten.', richtung: 'national',
          ergebnis: 'Der Franc wird abgewertet. Die Exporte ziehen an, die Preise aber auch – und das Ansehen leidet.',
          w: { franc: 45, inflation: 3, rang: -3, ansehen: -4, impuls: 0.8 } },
        { text: 'Ein hartes Sparprogramm auflegen.', richtung: 'sparen',
          ergebnis: 'Steuern rauf, Ausgaben runter. Die Märkte beruhigen sich, die Straße nicht.',
          w: { franc: 30, haushalt: 10, ansehen: -6, impuls: -1.5, preisdruck: -2 } },
        { text: 'In Washington um einen Notkredit bitten.', richtung: 'atlantisch',
          ergebnis: 'Washington hilft – und lässt Paris spüren, wer der Gläubiger ist.',
          w: { franc: 30, usa: -3, rang: -4 } },
      ],
      nachher: st => { st.f.franckrisen = (st.f.franckrisen || 0) + 1; delete st.f.franc_offen; },
    };
  },

  haushaltsnotstand(s) {
    const n = s.f.notstaende || 0;
    return {
      titel: 'Die Kassen sind leer',
      datum: zeitText(s.zeit),
      art: 'haupt',
      absender: 'Ministerium für Finanzen und Wirtschaft',
      text: `Der Staatshaushalt ist erschöpft. Das Schatzamt kann die Gehälter der Beamten und den Sold der Armee nur noch mit Vorschüssen der Banque de France bezahlen.${n >= 1 ? '\n\nEs ist nicht die erste Krise dieser Art. Ein weiterer Notstand wäre der Staatsbankrott.' : ''}`,
      optionen: [
        { text: 'Steuern erhöhen.', richtung: 'sparen', ergebnis: 'Die Einnahmen steigen, die Unzufriedenheit auch.', w: { haushalt: 18, ansehen: -6, impuls: -1.5 } },
        { text: 'Die Militärausgaben kürzen.', richtung: 'dekolonisation', ergebnis: 'Die Generäle protestieren, die Kassen erholen sich.', w: { haushalt: 16, armee: -8, rang: -2 } },
        { text: 'Die Notenbank zur Finanzierung zwingen.', ergebnis: 'Die Druckerpressen laufen. Die Inflation zieht an.', w: { haushalt: 14, preisdruck: 4, franc: -10 } },
      ],
      nachher: st => { st.f.notstaende = (st.f.notstaende || 0) + 1; delete st.f.haushalt_offen; },
    };
  },

  meuterei(s) {
    // Die Armee verweigert der Regierung den Gehorsam (Loyalität der Armee am Boden)
    const dg = s.lager === 'de_gaulle';
    return {
      titel: 'Die Armee meutert',
      datum: zeitText(s.zeit),
      art: 'haupt',
      ascii: 'alarm',
      absender: 'Ministerium der Streitkräfte',
      text: `In Algier haben Offiziere einen „Wohlfahrtsausschuss“ gebildet und erklären, sie würden der Regierung ${s.regierungschef} nicht länger gehorchen. Fallschirmjäger stehen bereit; Gerüchte über eine Landung in Paris machen die Runde. Polizei und Gendarmerie sind unsicher, auf welcher Seite sie stehen.`,
      optionen: [
        { text: 'Den Forderungen der Generäle nachgeben.', richtung: 'kolonial',
          ergebnis: 'Die Regierung gibt nach. Die Armee hat gezeigt, dass sie die Politik bestimmen kann.',
          w: { armee: 30, ansehen: -10, rang: -4 }, loesche: ['algerien_verhandlung'], setze: ['algerien_truppen'] },
        { text: 'Die Republik verteidigen: Loyale Truppen und Bürger mobilisieren.', richtung: 'dekolonisation',
          zufall: [
            { p: st => Math.max(0.05, Math.min(0.6, (30 - st.w.armee) / 40 + (dg ? -0.15 : 0.1))),
              ergebnis: 'Die Fallschirmjäger landen. In Paris wird gekämpft.',
              aktion: (st, a) => a.ende('buergerkrieg') },
            { ergebnis: 'Die Wehrpflichtigen verweigern den meuternden Offizieren den Gehorsam. Die Meuterei bricht zusammen; die Rädelsführer werden verhaftet.',
              w: { armee: 25, ansehen: 8 } },
          ] },
        ...(!dg && !s.f.de_gaulle_abgelehnt && s.republik === 4 ? [{ text: 'General de Gaulle bitten, die Macht zu übernehmen.', hist: true,
          ergebnis: 'De Gaulle erklärt sich bereit, „die Befugnisse der Republik zu übernehmen“. Die Armee gehorcht ihm.',
          w: { armee: 35 }, aktion: (st, a) => machtUebergabeDeGaulle(st, a) }] : []),
      ],
      nachher: st => { delete st.f.meuterei_offen; },
    };
  },
};

/** Mai 1958: de Gaulle übernimmt, die Vierte Republik endet */
export function machtUebergabeDeGaulle(s, a) {
  s.republik = 4; // bis zur neuen Verfassung
  s.lager = 'de_gaulle';
  s.regierungschef = 'Charles de Gaulle';
  s.chefPartei = 'GAUL';
  s.regierung = ['GAUL', 'UNAB', 'MRP', 'RAD', 'SFIO'];
  s.w.mehrheit = 80;
  s.w.ansehen = 6;
  s.w.bonus = 12;
  s.w.armee = Math.max(s.w.armee, 70);
  s.f.de_gaulle = true;
  s.f['gebildet_' + s.zeit] = true;
  notiereChef(s);
  a.plane('verfassung', 1);
  // Bis zur neuen Verfassung keine Wahl nach altem Recht
  s.wahlplan = (s.wahlplan || []).filter(z => zeitIndex(z) <= zeitIndex(s.zeit));
}

// ------------------------------------------------------------------ nach Entscheidungen

/** Richtung(en) einer Option als Liste */
const richtungen = o => (Array.isArray(o.richtung) ? o.richtung : o.richtung ? [o.richtung] : []);

export function nachOption(s, o) {
  // Wer verprellt wird, entzieht der Regierung Rückhalt; in der Fünften Republik weniger
  const r = richtungen(o);
  if (!r.length) return;
  // Verärgerung wiegt schwerer als Zustimmung: Wer verprellt wird, entzieht Stimmen; wer
  // bekommt, was er will, bedankt sich nur ein wenig
  const haltung = (p, t) => { const h = HALTUNG[p]?.[t] || 0; return h < 0 ? h : 0.3 * h; };
  let d = 0;
  for (const p of s.regierung) for (const t of r) d += haltung(p, t);
  // die Dulder zählen halb
  for (const [p, anteil] of Object.entries(LAGER[s.lager]?.toleranz || {})) for (const t of r) d += 0.5 * anteil * haltung(p, t);
  s.w.mehrheit += (s.republik === 5 ? 0.4 : 1.2) * Math.max(-6, Math.min(2, d));
}

export function pruefeKrise(s) {
  s.einschub = s.einschub || [];
  const neu = (flag, id) => {
    if (s.f[flag]) return;
    s.f[flag] = true;
    delete s.erledigt[id];
    s.einschub.push(id);
  };
  if (vierte(s) && s.w.mehrheit <= 0) sturz(s, 'vertrauen');
  if (fuenfte(s) && s.w.mehrheit <= 0) neu('krise_offen', 'dyn:misstrauensvotum');
  if (s.w.armee <= 12 && s.lager !== 'militaer') neu('meuterei_offen', 'dyn:meuterei');
  if (s.w.franc <= 5) neu('franc_offen', 'dyn:franckrise');
}

export function pruefeEnde(s, a) {
  if (s.ende) return;
  if (s.w.haushalt <= 0) {
    if ((s.f.notstaende || 0) >= 2) { a.ende('staatsbankrott'); return; }
    if (!s.f.haushalt_offen) {
      s.f.haushalt_offen = true;
      delete s.erledigt['dyn:haushaltsnotstand'];
      (s.einschub ||= []).push('dyn:haushaltsnotstand');
    }
  }
  pruefeKrise(s);
}

/**
 * Berichte über die gesteuerten Länder (ki.js): Treffsicherheit q und Quelle.
 * Der Auslandsgeheimdienst SDECE ist in Bonn gut vernetzt, in Moskau kaum.
 */
export function aufklaerung(s, land) {
  if (land === 'brd') return { q: 0.72, quelle: 'Botschaft Bonn' };
  if (land === 'su') return { q: 0.6 + (s.f.sdece_reform ? 0.08 : 0), quelle: 'SDECE' };
  if (land === 'usa') return { q: 0.65 + (s.w.usa >= 65 ? 0.1 : 0), quelle: 'Botschaft Washington' };
  return { q: 0.6, quelle: 'Quai d’Orsay' };
}

export function aktenProRunde(s, nHaupt) {
  if (nHaupt >= 4) return 0;
  if (nHaupt >= 2) return 1;
  return 2;
}

/** Für die vom Spiel gesteuerte Regierung: Lager = Regierung (ki.js) */
export const regimeVon = s => s.lager;
