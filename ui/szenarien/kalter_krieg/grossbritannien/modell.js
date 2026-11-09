// Modell für Großbritannien 1946–1964: Unterhaus und Wahlen, Premierminister, Fraktion,
// Wirtschaft mit Pfund und Gewerkschaften, Empire.
//
// Gespielt wird die Regierung, nicht eine Partei: Verliert die Regierungspartei eine Wahl,
// führt man die neue Regierung weiter. Gewählt wird spätestens nach fünf Jahren; früher,
// wenn der Premierminister das Unterhaus auflöst (Entscheidung „aufloesung“; die vom Spiel
// gesteuerte Regierung tut es nach Lage). Die Sitze ergeben sich aus den Stimmen nach dem
// Kubikgesetz der relativen Mehrheitswahl.

import { STANDARD, BAUSTEINE, beziehungen } from '../werte.js';
import { REGIERUNGEN, istLabour, toryChef, labourChef } from './regierungen.js';
import { jahrVon, zeitIndex, zeitPlus, zeitText, runde1 } from '../../../engine.js';

export const WERTE = {
  // Beziehungen: wie Washington, Moskau, Paris und Bonn Großbritannien sehen
  ...beziehungen('grossbritannien'),
  // Landesspezifisch
  empire: {
    name: 'Zusammenhalt des Empire', kurz: 'Empire', min: 0, max: 100, block: 'land',
    erklaerung: {
      was: 'Wie fest die Kolonien und das Commonwealth an London gebunden sind, von 0 bis 100.',
      hebt: 'Reformen, Investitionen, erfolgreiche Einsätze gegen Aufstände.',
      senkt: 'Unabhängigkeitsbewegungen, Niederlagen, Rückzüge, die Zeit.',
      wirkt: 'Ein starkes Empire stützt das Pfund und Londons Stimme in der Welt; es zu halten kostet Geld und Soldaten.',
    },
  },
  pfund: BAUSTEINE.waehrung('Pfund', 'des Pfunds'),
  gewerkschaften: {
    name: 'Verhältnis zu den Gewerkschaften', kurz: 'Gewerkschaften', min: 0, max: 100, block: 'land',
    warnung: v => v <= 20,
    erklaerung: {
      was: 'Wie gut die Regierung mit dem Gewerkschaftsbund (TUC) und den großen Gewerkschaften auskommt, von 0 bis 100.',
      hebt: 'Eine Labour-Regierung, Lohnzuwächse über der Inflation, Mitsprache, Sozialreformen.',
      senkt: 'Inflation, Lohnstopps, Sparprogramme, Gesetze gegen Streiks; sehr knappe Arbeitskräfte machen die Gewerkschaften fordernder.',
      wirkt: 'Unter 30 bremsen Streiks das Wachstum und treiben die Löhne; unter 15 droht eine Streikwelle. Gute Beziehungen machen Lohnzurückhaltung möglich.',
    },
  },
  atom: BAUSTEINE.atom,
  europa: BAUSTEINE.europa,
  zustimmung: STANDARD.zustimmung,
  ansehen: STANDARD.ansehen,
  rueckhalt: STANDARD.rueckhalt,
  wachstum: STANDARD.wachstum,
  inflation: STANDARD.inflation,
  arbeitslosigkeit: STANDARD.arbeitslosigkeit,
  haushalt: STANDARD.haushalt,
  impuls: { name: 'Konjunkturimpuls', kurz: 'Konjunktur', min: -6, max: 6, versteckt: true },
  preisdruck: { name: 'Preisdruck', kurz: 'Preisdruck', min: -6, max: 12, versteckt: true },
  bonus: { name: 'Amtsbonus', min: -10, max: 20, versteckt: true },
};

export const LANDESSPEZIFISCH = ['empire', 'pfund', 'gewerkschaften', 'atom', 'europa'];

// ------------------------------------------------------------------ Parteien und Regierung

export const PARTEIEN = {
  LAB: { name: 'Labour', kurz: 'Labour', farbe: '#c8102e' },
  CON: { name: 'Konservative', kurz: 'Konservative', farbe: '#1f4e9c' },
  LIB: { name: 'Liberale', kurz: 'Liberale', farbe: '#e8a317' },
  AND: { name: 'Andere', kurz: 'Andere', farbe: '#8a8a8a' },
};
export const parteiName = p => PARTEIEN[p]?.name || p;
export const REIHENFOLGE = ['LAB', 'LIB', 'AND', 'CON'];

export const gesamtSitze = s => Object.values(s.sitze).reduce((x, y) => x + y, 0);
/** Mehrheit der Regierung über alle anderen zusammen (negativ: Minderheit) */
export const mehrheit = s => 2 * (s.sitze[s.partei] || 0) + (s.koalition ? 2 * (s.sitze.LIB || 0) : 0) - gesamtSitze(s);
export const labour = s => s.partei === 'LAB';
export const konservativ = s => s.partei === 'CON';
export const premier = s => REGIERUNGEN[s.premierId].name;
export const premierKurz = s => REGIERUNGEN[s.premierId].kurz;
export const andere = p => (p === 'LAB' ? 'CON' : 'LAB');
/** Wer die Opposition führt */
export const oppositionsfuehrer = s => s.fuehrer?.[andere(s.partei)] || (labour(s) ? toryChef(s.zeit) : labourChef(s.zeit));
export const regierungName = s => (labour(s) ? 'Labour-Regierung' : 'konservative Regierung');

export function notiereChef(s) {
  const l = (s.chefliste ||= []);
  const letzter = l[l.length - 1];
  if (!letzter || letzter.id !== s.premierId) l.push({ id: s.premierId, name: premier(s), partei: s.partei, ab: s.zeit });
}

/** Ein neuer Premierminister derselben Partei */
export function neuerPremier(s, id) {
  if (s.premierId === id) return;
  s.premierId = id;
  s.fuehrer = { ...(s.fuehrer || {}), [s.partei]: id };
  s.w.bonus = Math.max(s.w.bonus, 4);
  s.w.ansehen = 0;
  s.f.neuer_premier = s.zeit;
  notiereChef(s);
}

/** Die Regierung wechselt zur anderen Partei (nach einer Wahl oder einem Misstrauensvotum) */
export function wechsleRegierung(s, partei, koalition = false) {
  const id = s.fuehrer?.[partei] || (partei === 'LAB' ? labourChef(s.zeit) : toryChef(s.zeit));
  s.fuehrer = { ...(s.fuehrer || {}), [s.partei]: s.premierId };
  s.partei = partei;
  s.parteiSeit = s.zeit;
  s.koalition = koalition;
  s.premierId = id;
  s.w.bonus = 6;
  s.w.ansehen = 0;
  s.w.rueckhalt = startRueckhalt(s);
  // Die Gewerkschaften sehen in Labour ihre Partei
  s.w.gewerkschaften += partei === 'LAB' ? 12 : -12;
  delete s.f.neuer_premier;
  notiereChef(s);
}

export const startRueckhalt = s => Math.max(30, Math.min(85, Math.round(55 + 0.2 * Math.min(140, mehrheit(s)))));

// ------------------------------------------------------------------ Startzustand

export function startzustand() {
  // Januar 1946: Attlees Labour-Regierung, die Sieger vom Juli 1945
  return {
    w: {
      zustimmung: 48, ansehen: 0, rueckhalt: 80, wachstum: -2, inflation: 3, arbeitslosigkeit: 2.5, haushalt: 28,
      empire: 70, pfund: 45, gewerkschaften: 72, atom: 3, europa: 0, impuls: 0, preisdruck: 0, bonus: 4,
    },
    f: {},
    partei: 'LAB',
    parteiSeit: 1945.2,
    premierId: 'attlee',
    fuehrer: { LAB: 'attlee', CON: 'churchill' },
    koalition: false,
    chefliste: [{ id: 'attlee', name: 'Clement Attlee', partei: 'LAB', ab: 1946.1 }],
    legislaturBeginn: 1945.2,
    // Unterhaus vom Juli 1945 (die Liberalen National mit den Konservativen)
    sitze: { LAB: 393, LIB: 12, AND: 22, CON: 213 },
  };
}

// ------------------------------------------------------------------ Wirtschaft

// Grundwachstum und Grundinflation (% p. a.), grob nach den historischen Werten
const BASIS = { 1946: -2, 1947: -1, 1948: 3, 1949: 3, 1950: 3.2, 1951: 2.8, 1952: 0.5, 1953: 4, 1954: 4, 1955: 3.5, 1956: 1.5,
  1957: 2, 1958: 0.5, 1959: 4, 1960: 5, 1961: 3, 1962: 1, 1963: 4, 1964: 5.5 };
const INFLATION = { 1946: 3, 1947: 7, 1948: 8, 1949: 3, 1950: 3, 1951: 9, 1952: 6, 1953: 3, 1954: 2, 1955: 4.5, 1956: 5,
  1957: 4, 1958: 3, 1959: 0.5, 1960: 1, 1961: 3.5, 1962: 4, 1963: 2, 1964: 3 };

export function berechneUmfrage(s) {
  const w = s.w;
  let u = 41 + 0.8 * (Math.min(w.wachstum, 8) - 3) - 0.6 * Math.max(0, Math.min(w.inflation, 15) - 3.5)
    - 0.9 * Math.max(0, w.arbeitslosigkeit - 2) + w.ansehen + w.bonus + 0.05 * (w.gewerkschaften - 50);
  // Rationierung bis 1954 (Fleisch zuletzt): Die Briten haben die Knappheit satt
  if (s.zeit < 1954.2 && !s.f.rationierung_ende) u -= s.zeit < 1948.1 ? 0 : 1.5;
  if (s.f.spaltung) u -= 2;
  return Math.max(20, Math.min(65, runde1(u)));
}

/** Wann die Aufstände in Malaya, Kenia und Zypern zu Ende gehen (wie in der Geschichte) */
const ENDE = s => ({ malaya: s.f.malaya_bald ? 1955.1 : 1957.2, kenia: 1960.1, zypern: 1959.1 });

export function rundenende(s, a) {
  const w = s.w;
  const j = jahrVon(s.zeit);
  const notiz = t => (s.notizen ||= []).push(t);

  // --- Wachstum
  let g = (BASIS[j] ?? 3) + w.impuls + 0.02 * (w.europa - 20);
  if (w.pfund < 20) g -= (20 - w.pfund) * 0.05;
  if (w.gewerkschaften < 30) g -= (30 - w.gewerkschaften) * 0.03;
  if (w.haushalt < 10) g -= (10 - w.haushalt) * 0.04;
  g += 0.6 * a.normal();
  w.wachstum = runde1(Math.max(-6, Math.min(10, g)));
  w.impuls *= 0.5;

  // --- Inflation: Grundrate, Preisdruck, Löhne, Haushalt
  let inf = 0.4 * w.inflation + 0.6 * (INFLATION[j] ?? 3) + w.preisdruck + 0.3 * Math.max(0, w.impuls);
  if (w.haushalt < 15) inf += (15 - w.haushalt) * 0.06;
  if (w.gewerkschaften < 35) inf += (35 - w.gewerkschaften) * 0.04;
  inf += 0.4 * a.normal();
  w.inflation = runde1(Math.max(-3, Math.min(30, inf)));
  w.preisdruck *= 0.5;
  w.arbeitslosigkeit = runde1(Math.max(0.8, Math.min(12, w.arbeitslosigkeit + 0.3 * (1.8 - w.arbeitslosigkeit) - 0.1 * (w.wachstum - 3))));

  // --- Haushalt: Kolonialkriege, Rüstung und das Atomprogramm kosten
  for (const [f, z] of Object.entries(ENDE(s))) if (s.f[f] && s.zeit >= z) s.f[f + '_ende'] = true;
  let lasten = 0;
  for (const f of ['malaya', 'kenia', 'zypern']) if (s.f[f] && !s.f[f + '_ende']) lasten += 0.5;
  if (s.f.korea_truppen && s.weltflags.koreakrieg) lasten += 0.8;
  if (s.f.atomprogramm && w.atom < 100) lasten += 0.4;
  if (s.f.palaestina_bleiben && s.zeit < 1950.1) lasten += 0.8;
  if (s.f.indien_gehalten) lasten += 1.2;
  if (s.f.afrika_gehalten) lasten += 0.6;
  if (s.f.nhs) lasten += 0.3;
  if (s.f.wehrpflicht_bleibt) lasten += 0.4;
  w.haushalt = runde1(w.haushalt + 0.5 * (w.wachstum - 2.5) + 1.3 - lasten);

  // --- Pfund: verliert Vertrauen mit der Inflation, gewinnt mit Überschüssen und dem Empire
  w.pfund = runde1(w.pfund + (55 - w.pfund) * 0.1 - 0.4 * (Math.min(w.inflation, 12) - 3) + (w.empire >= 60 ? 0.5 : 0) + (w.haushalt > 40 ? 0.5 : 0));

  // --- Gewerkschaften: Labour ist ihre Partei; Inflation zehrt an den Löhnen, knappe
  // Arbeitskräfte machen sie fordernder
  let ziel = 52 + (labour(s) ? 12 : 0) - 1.2 * Math.max(0, w.inflation - 4) - (w.arbeitslosigkeit < 1.5 ? 3 : 0) + (w.wachstum > 4 ? 3 : 0);
  if (s.f.lohnstopp) ziel -= 6;
  w.gewerkschaften += 0.25 * (ziel - w.gewerkschaften);

  // --- Empire: löst sich langsam auf, wenn nichts geschieht
  if (s.zeit >= 1947.1) w.empire -= s.f.dekolonisierung ? 0.5 : 1;
  if (s.f.indien_gehalten || s.f.afrika_gehalten) w.empire -= 1;
  if (s.f.atomprogramm && w.atom < 100) w.atom += 5;

  // --- Langsame Rückkehr zu Normalwerten
  w.ansehen *= 0.75;
  w.bonus *= 0.7;
  for (const [k, z] of [['usa', 70], ['moskau', 35], ['frankreich', 58], ['brd', 50]]) w[k] += (z - w[k]) * 0.08;
  for (const k of Object.keys(WERTE)) {
    const d = WERTE[k];
    if (d.beziehung) continue;
    if (d.min !== undefined && w[k] < d.min) w[k] = d.min;
    if (d.max !== undefined && w[k] > d.max) w[k] = d.max;
  }
  w.zustimmung = berechneUmfrage(s);

  // --- Rückhalt in der Fraktion: je größer die Mehrheit und je besser die Umfragen, desto
  // fester; Spaltungen und Revolten kosten
  let zr = 48 + 0.2 * Math.min(140, mehrheit(s)) + 0.5 * (w.zustimmung - 40) - (s.f.spaltung ? 10 : 0) + (s.f.neuer_premier ? 4 : 0);
  if (mehrheit(s) < 0) zr -= 10;
  w.rueckhalt += 0.3 * (zr - w.rueckhalt);
  for (const k of ['empire', 'rueckhalt', 'ansehen', 'usa', 'moskau', 'frankreich', 'brd', 'atom', 'pfund', 'haushalt', 'gewerkschaften', 'bonus']) w[k] = runde1(w[k]);

  // --- Die Führer der Opposition wechseln nach dem Kalender
  oppositionsKalender(s, notiz);
  // Hugh Gaitskell stirbt im Januar 1963 – auch als Premierminister
  if (s.premierId === 'gaitskell' && zeitIndex(s.zeit) >= zeitIndex(1962.2)) {
    neuerPremier(s, 'wilson');
    notiz('Premierminister Hugh Gaitskell ist im Januar überraschend gestorben. Labour wählt Harold Wilson zum Nachfolger. (Fiktion)');
  }

  // --- Wann gewählt wird: spätestens nach fünf Jahren; die gesteuerte Regierung löst nach Lage auf
  if (!s.welt.spieler.includes('grossbritannien')) kiAufloesung(s, a);
}

/** Wer in der Opposition führt, nach dem historischen Kalender (wenn die Partei nicht regiert) */
function oppositionsKalender(s, notiz) {
  const p = andere(s.partei);
  const jetzt = s.fuehrer?.[p];
  const z = zeitPlus(s.zeit, 1);
  const kal = p === 'LAB' ? labourChef(z) : toryChef(z);
  // nur vorwärts im Kalender: Wer einmal abgelöst ist, kommt nicht zurück
  const reihe = p === 'LAB' ? ['attlee', 'gaitskell', 'wilson'] : ['churchill', 'eden', 'macmillan', 'home'];
  if (reihe.indexOf(kal) > reihe.indexOf(jetzt)) {
    s.fuehrer = { ...s.fuehrer, [p]: kal };
    notiz(`${p === 'LAB' ? 'Labour' : 'Die Konservativen'} in der Opposition ${p === 'LAB' ? 'hat' : 'haben'} einen neuen Führer: ${REGIERUNGEN[kal].name}.`);
  }
}

// ------------------------------------------------------------------ Wahlen

/** Halbjahre seit der letzten Wahl */
export const legislaturAlter = s => zeitIndex(s.zeit) - zeitIndex(s.legislaturBeginn);
/** Nächste Wahl spätestens (fünf Jahre nach der letzten) */
export const spaetestens = s => zeitPlus(s.legislaturBeginn, 10);
export const wahlAngesetzt = s => (s.wahlplan || []).some(z => zeitIndex(z) === zeitIndex(s.zeit));

/** Die Regierung löst das Unterhaus auf: Wahl am Ende dieses Halbjahrs */
export function aufloesen(s) {
  if (wahlAngesetzt(s)) return;
  s.wahlplan = [...(s.wahlplan || []).filter(z => zeitIndex(z) < zeitIndex(s.zeit)), s.zeit];
}

// Wahltermine wie in der Geschichte – die gesteuerte Regierung hält sich daran, wenn die Lage passt
const HIST_WAHLEN = [1950.1, 1951.2, 1955.1, 1959.2];

/**
 * Die vom Spiel gesteuerte Regierung löst nach Lage auf: nach vier Jahren bei guten Umfragen,
 * bei knapper Mehrheit nach anderthalb, als neuer Premier nach drei Jahren.
 */
function kiAufloesung(s, a) {
  if (wahlAngesetzt(s)) return;
  const alter = legislaturAlter(s);
  if (alter >= 10) { aufloesen(s); return; }
  if (alter < 3) return;
  const vorne = (s.w.zustimmung - interpoliere(BEZUG, s.zeit)) / 10;
  let p = 0.005, grund = false;
  if (alter >= 9) { p = 0.5 + 0.3 * vorne; grund = true; }
  else if (alter >= 8) { p = 0.08 + 0.3 * vorne; grund = true; }
  // Mit knapper Mehrheit holt man sich bald ein neues Mandat – oder gar nicht
  else if (mehrheit(s) < 80 && alter <= 4) { p = 0.15 + 0.3 * vorne; grund = true; }
  // Ein neuer Premierminister lässt sich gleich bestätigen, wenn die Legislatur schon alt ist
  else if (s.f.neuer_premier && zeitIndex(s.zeit) - zeitIndex(s.f.neuer_premier) <= 1 && alter >= 6) { p = 0.4 + 0.3 * vorne; grund = true; }
  // Im historischen Modus wählt man, wenn es einen Grund gibt, zu den Terminen der Geschichte –
  // und sonst seltener
  const g = s.welt.geschichtstreue;
  if (grund && HIST_WAHLEN.some(z => zeitIndex(z) === zeitIndex(s.zeit))) p = Math.max(p, 0) + 0.8 * g;
  else if (alter < 9) p *= 1 - 0.7 * g;
  // Im letzten Halbjahr nur, wenn die fünf Jahre um sind
  if (zeitIndex(s.zeit) >= zeitIndex(1964.1)) p = 0;
  if (a.zufall() < Math.max(0, Math.min(0.97, p))) aufloesen(s);
}

/** Anteil der Regierungspartei an den Stimmen beider großer Parteien, wenn die Regierung durchschnittlich dasteht */
const AMT = [[1946.1, 0.52], [1950.1, 0.52], [1951.2, 0.502], [1955.1, 0.517], [1959.2, 0.535], [1964.1, 0.505]];
// Umfrage der Regierung, wenn man spielt wie in der Geschichte (Bezugspunkt für den Wahlausgang)
const BEZUG = [[1946.1, 39], [1950.1, 37], [1951.2, 35], [1955.1, 44.5], [1959.2, 41.8], [1964.1, 43]];
// Stimmenanteil der Liberalen
const LIBERALE = [[1946.1, 9], [1950.1, 9.1], [1951.2, 2.5], [1955.1, 2.7], [1959.2, 5.9], [1962.1, 10], [1964.1, 11]];
const interpoliere = (tab, z) => {
  const i = zeitIndex(z);
  if (i <= zeitIndex(tab[0][0])) return tab[0][1];
  for (let k = 1; k < tab.length; k++) {
    const [z1, v1] = tab[k - 1], [z2, v2] = tab[k];
    if (i <= zeitIndex(z2)) return v1 + (v2 - v1) * (i - zeitIndex(z1)) / (zeitIndex(z2) - zeitIndex(z1));
  }
  return tab[tab.length - 1][1];
};

/**
 * Sitze nach dem Kubikgesetz: S_K / S_L = e^β · (V_K / V_L)³. β fängt ein, dass Labour vor
 * der Neueinteilung der Wahlkreise von 1955 viele Stimmen in sicheren Hochburgen „verschwendete“.
 */
export function sitzeAus(st, zeit) {
  const gesamt = 625;
  const lib = Math.round(4 + 0.5 * st.LIB);
  const and = 3;
  const zwei = gesamt - lib - and;
  const beta = zeitIndex(zeit) < zeitIndex(1955.1) ? 0.13 : 0;
  const r = Math.exp(beta) * (st.CON / st.LAB) ** 3;
  const con = Math.round(zwei * r / (1 + r));
  return { LAB: zwei - con, LIB: lib, AND: and, CON: con };
}

export function wahl(s, a) {
  const z = s.zeit;
  const lib = Math.max(1.5, interpoliere(LIBERALE, z) + (s.f.liberale_erfolg ? 3 : 0) + 0.8 * a.normal());
  const and = 1.5;
  // Die Regierungspartei: wie zur Zeit üblich, besser oder schlechter je nach Umfrage
  let x = interpoliere(AMT, z) + 0.0025 * (s.w.zustimmung - interpoliere(BEZUG, z)) + 0.006 * a.normal();
  if (s.f.spaltung) x -= 0.01;
  // „Zeit für einen Wechsel“: Wer lange regiert, verliert langsam
  const jahre = (zeitIndex(z) - zeitIndex(s.parteiSeit ?? 1945.2)) / 2;
  x -= 0.0025 * Math.max(0, jahre - 6);
  x = Math.max(0.35, Math.min(0.65, x));
  const zwei = 100 - lib - and;
  const reg = s.partei, opp = andere(s.partei);
  const st = { [reg]: runde1(zwei * x), [opp]: runde1(zwei * (1 - x)), LIB: runde1(lib), AND: and };
  const sitze = sitzeAus(st, z);
  s.sitze = sitze;
  s.legislaturBeginn = z;
  delete s.f.neuer_premier;
  const frueher = (s.wahlplan || []).filter(t => zeitIndex(t) < zeitIndex(z));
  s.wahlplan = [...frueher, z, zeitPlus(z, 10)];
  // Die Engine reiht die Regierungsbildung nur für das gespielte Land sicher ein; für die
  // gesteuerte Regierung über den Einschub am Rundenende
  if (!s.welt.spieler.includes('grossbritannien')) {
    delete s.erledigt['dyn:regierungsbildung'];
    (s.einschub ||= []).push('dyn:regierungsbildung');
  }
  return { zeit: z, stimmen: st, sitze: { ...sitze }, gesamt: 625, regierung: reg };
}

// ------------------------------------------------------------------ dynamische Ereignisse

const sitzText = s => `${REIHENFOLGE.filter(p => s.sitze[p]).sort((x, y) => s.sitze[y] - s.sitze[x]).map(p => `${parteiName(p)} ${s.sitze[p]}`).join(' · ')} (Mehrheit ab ${Math.floor(gesamtSitze(s) / 2) + 1}).`;
const pct = x => `${x.toFixed(1).replace('.', ',')} %`;
const namen = id => REGIERUNGEN[id].name;

/** Ziele der gesteuerten Regierung bei der Bildung einer Regierung */
const DIENT_PARTEI = { LAB: { sozial: 0.5 }, CON: { empire: 0.3, pfund: 0.2 } };

export const dynamisch = {
  regierungsbildung(s) {
    const e = s.wahlen[s.wahlen.length - 1];
    const st = e.stimmen;
    const stand = Object.entries(st).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${parteiName(k)} ${pct(v)}`).join(', ');
    const g = gesamtSitze(s);
    const halb = Math.floor(g / 2) + 1;
    const reg = s.partei, opp = andere(reg);
    const opts = [];
    let lage;
    if (s.sitze[reg] >= halb) {
      const m = 2 * s.sitze[reg] - g;
      lage = `${parteiName(reg)} behält die Mehrheit${m < 20 ? ' – aber nur mit ' + m + ' Sitzen' : `, mit ${m} Sitzen über allen anderen`}.`;
      opts.push({ text: 'Mit dem bisherigen Kabinett weiterregieren.', hist: true, dient: DIENT_PARTEI[reg],
        ergebnis: `${premier(s)} bleibt Premierminister; das Kabinett bleibt im Amt.`,
        aktion: st2 => { st2.koalition = false; st2.w.rueckhalt = startRueckhalt(st2); } });
      opts.push({ text: 'Das Kabinett umbilden und jüngere Minister nach vorn holen.', dient: DIENT_PARTEI[reg],
        w: { ansehen: 2 },
        ergebnis: `${premier(s)} bleibt Premierminister und bildet das Kabinett um. Ein paar altgediente Minister müssen gehen.`,
        aktion: st2 => { st2.koalition = false; st2.w.rueckhalt = startRueckhalt(st2) - 6; } });
    } else if (s.sitze[opp] >= halb) {
      const neu = namen(s.fuehrer?.[opp] || (opp === 'LAB' ? labourChef(s.zeit) : toryChef(s.zeit)));
      lage = `${parteiName(opp)} hat die Wahl gewonnen, mit ${2 * s.sitze[opp] - g} Sitzen Mehrheit. ${premier(s)} fährt ${s.zeit < 1952.1 ? 'zum König' : 'zur Königin'}, um seinen Rücktritt einzureichen.`;
      opts.push({ text: `Die Regierung an ${neu} übergeben.`, hist: true, dient: DIENT_PARTEI[opp],
        ergebnis: `${neu} wird Premierminister einer ${opp === 'LAB' ? 'Labour-Regierung' : 'konservativen Regierung'}.`,
        aktion: st2 => wechsleRegierung(st2, opp) });
    } else {
      // Kein Unterhaus ohne Mehrheit seit 1929: Minderheit oder Bündnis mit den Liberalen
      const groesste = s.sitze.CON >= s.sitze.LAB ? 'CON' : 'LAB';
      lage = `Keine Partei hat eine Mehrheit – zum ersten Mal seit 1929. Die Liberalen mit ${s.sitze.LIB} Abgeordneten entscheiden, wer regiert.`;
      for (const p of [reg, opp]) {
        const chef = p === reg ? premier(s) : namen(s.fuehrer?.[p] || (p === 'LAB' ? labourChef(s.zeit) : toryChef(s.zeit)));
        const reicht = s.sitze[p] + s.sitze.LIB >= halb;
        if (reicht) opts.push({ text: `Ein Bündnis aus ${parteiName(p)} und Liberalen unter ${chef}.`, hist: p === groesste, dient: DIENT_PARTEI[p],
          ergebnis: `${chef} bildet mit Unterstützung der Liberalen eine Regierung.`,
          aktion: st2 => { if (p === st2.partei) { st2.koalition = true; st2.w.rueckhalt = startRueckhalt(st2) - 5; } else wechsleRegierung(st2, p, true); } });
        opts.push({ text: `Eine Minderheitsregierung von ${parteiName(p)} unter ${chef}.`, hist: !reicht && p === groesste, dient: DIENT_PARTEI[p],
          ergebnis: `${chef} führt eine Minderheitsregierung. Jede Abstimmung im Unterhaus wird zur Zitterpartie.`,
          aktion: st2 => { if (p === st2.partei) { st2.koalition = false; st2.w.rueckhalt = startRueckhalt(st2); } else wechsleRegierung(st2, p); } });
      }
    }
    return {
      titel: `Nach der Unterhauswahl ${jahrVon(s.zeit)}`,
      ascii: 'urne_gb',
      datum: zeitText(s.zeit),
      art: 'haupt',
      absender: 'Büro des Premierministers',
      text: `Ergebnis: ${stand}.\n\n${sitzText(s)}\n\n${lage}\n\nDu führst die Regierung weiter, die aus dieser Wahl hervorgeht.`,
      optionen: opts,
    };
  },

  fraktionsrevolte(s) {
    return {
      titel: 'Aufruhr in der Fraktion',
      datum: zeitText(s.zeit),
      art: 'haupt',
      absender: 'Chief Whip',
      text: `Die Hinterbänkler der ${labour(s) ? 'Labour-Fraktion' : 'Konservativen'} sind in offener Rebellion. ${s.f.spaltung ? 'Die Spaltung der Partei ist nicht mehr zu verbergen. ' : ''}In der letzten Abstimmung hat die Regierung ${mehrheit(s) < 30 ? 'nur knapp überlebt' : 'Dutzende Abweichler gezählt'}; im Raucherzimmer wird offen über die Nachfolge des Premierministers gesprochen.`,
      optionen: [
        { text: 'Die Rebellen mit Zugeständnissen beruhigen.', hist: true,
          ergebnis: 'Die Regierung kommt den Abweichlern entgegen. Die Fraktion beruhigt sich – vorerst.',
          w: { rueckhalt: 18, haushalt: -3, ansehen: -1 }, dient: { sozial: 0.2 } },
        { text: 'Hart bleiben und den Rebellen mit dem Ausschluss drohen.',
          zufall: [
            { p: 0.6, ergebnis: 'Die Drohung wirkt: Die meisten Rebellen kehren zurück.', w: { rueckhalt: 12, ansehen: 1 } },
            { ergebnis: 'Die Drohung verpufft. Ein halbes Dutzend Abgeordnete verlässt die Fraktion.', w: { rueckhalt: -5, ansehen: -3 } },
          ] },
        { text: 'Das Unterhaus auflösen und das Volk entscheiden lassen.',
          ergebnis: 'Der Premierminister löst das Unterhaus auf. Gewählt wird noch in diesem Halbjahr.',
          w: { rueckhalt: 15 }, aktion: st2 => aufloesen(st2) },
      ],
      nachher: st2 => { delete st2.f.revolte_offen; },
    };
  },

  misstrauensvotum(s) {
    const nachfolger = labour(s) ? (s.premierId === 'attlee' ? 'gaitskell' : null) : ({ churchill: 'eden', eden: 'macmillan', macmillan: 'butler', butler: 'home' }[s.premierId] || null);
    return {
      titel: 'Misstrauensantrag',
      datum: zeitText(s.zeit),
      art: 'haupt',
      absender: 'Sprecher des Unterhauses',
      text: `Die Opposition hat einen Misstrauensantrag gegen die Regierung ${premier(s)} gestellt – und genug Abgeordnete der Regierungspartei haben sich enthalten oder dagegen gestimmt. Die Regierung hat das Vertrauen des Unterhauses verloren. Nach dem Brauch muss der Premierminister zurücktreten oder Neuwahlen ansetzen.`,
      optionen: [
        { text: 'Das Unterhaus auflösen.', hist: true,
          ergebnis: 'Der Premierminister löst das Unterhaus auf. Gewählt wird noch in diesem Halbjahr.',
          w: { rueckhalt: 30, ansehen: -2 }, aktion: st2 => aufloesen(st2) },
        ...(nachfolger ? [{ text: `Zurücktreten – ${namen(nachfolger)} soll die Regierung übernehmen.`,
          ergebnis: `${premier(s)} tritt zurück. ${namen(nachfolger)} wird Premierminister und gewinnt das Vertrauen des Unterhauses.`,
          aktion: st2 => { neuerPremier(st2, nachfolger); st2.w.rueckhalt = 50; } }] : []),
      ],
      nachher: st2 => { delete st2.f.misstrauen_offen; },
    };
  },

  pfundkrise(s) {
    return {
      titel: 'Run auf das Pfund',
      datum: zeitText(s.zeit),
      art: 'haupt',
      absender: 'Gouverneur der Bank of England',
      text: 'Die Reserven der Bank of England schmelzen. Ausländische Zentralbanken und das Commonwealth tauschen ihre Pfund in Dollar; die Spekulation wettet auf eine Abwertung. Der Gouverneur sagt, ohne einen Kurswechsel könne er den Kurs nur noch Tage halten.',
      optionen: [
        { text: 'Das Pfund abwerten.', richtung: 'sozial',
          ergebnis: 'Das Pfund wird abgewertet. Die Ausfuhren ziehen an, die Preise auch – und das Ansehen der Regierung leidet.',
          w: { pfund: 40, inflation: 2, ansehen: -5, impuls: 0.8, empire: -2 } },
        { text: 'Bremsen: Zinsen hoch, Kredite knapp, Ausgaben runter.', hist: true, richtung: 'sparen',
          ergebnis: 'Die Regierung tritt auf die Bremse. Der Kurs hält; die Konjunktur bricht ein.',
          w: { pfund: 28, haushalt: 6, impuls: -2, gewerkschaften: -6, ansehen: -3 } },
        { text: 'In Washington um einen Beistandskredit bitten.', richtung: 'atlantisch',
          ergebnis: 'Washington und der Währungsfonds helfen – gegen das Versprechen, den Haushalt in Ordnung zu bringen.',
          w: { pfund: 25, usa: -3, ansehen: -2 } },
      ],
      nachher: st2 => { st2.f.pfundkrisen = (st2.f.pfundkrisen || 0) + 1; delete st2.f.pfund_offen; },
    };
  },

  haushaltsnotstand(s) {
    return {
      titel: 'Das Schatzamt schlägt Alarm',
      datum: zeitText(s.zeit),
      art: 'haupt',
      absender: 'Schatzamt',
      text: `Der Haushalt ist erschöpft. Das Schatzamt kann die laufenden Ausgaben nur noch mit kurzfristigen Schatzwechseln bezahlen, die Zinsen steigen.${(s.f.notstaende || 0) >= 1 ? ' Es ist nicht die erste Krise dieser Art; die Märkte werden nervös.' : ''}`,
      optionen: [
        { text: 'Die Steuern erhöhen.', richtung: 'sparen', ergebnis: 'Ein Nachtragshaushalt erhöht die Steuern. Die Einnahmen steigen, die Unzufriedenheit auch.', w: { haushalt: 16, ansehen: -5, impuls: -1.2 } },
        { text: 'Die Rüstung und die Truppen in Übersee kürzen.', richtung: 'dekolonisation', ergebnis: 'Die Regierung kürzt die Verteidigungsausgaben und zieht Truppen aus Übersee ab.', w: { haushalt: 14, empire: -4, usa: -3 } },
        { text: 'Zuzahlungen im Gesundheitsdienst und Kürzungen im Wohnungsbau.', richtung: 'sparen', ergebnis: 'Die Regierung kürzt bei den Sozialleistungen. Die Gewerkschaften sind empört.', w: { haushalt: 14, gewerkschaften: -10, ansehen: -2 } },
      ],
      nachher: st2 => { st2.f.notstaende = (st2.f.notstaende || 0) + 1; delete st2.f.haushalt_offen; },
    };
  },

  streikwelle(s) {
    return {
      titel: 'Streikwelle',
      datum: zeitText(s.zeit),
      art: 'haupt',
      absender: 'Arbeitsministerium',
      text: `Docker, Bergleute und Eisenbahner legen die Arbeit nieder; in den Häfen faulen die Ladungen, Kraftwerke melden knappe Kohle. Die Gewerkschaftsführer verlangen Lohnerhöhungen, die weit über dem liegen, was die Wirtschaft hergibt.`,
      optionen: [
        { text: 'Nachgeben und die Löhne kräftig erhöhen.', richtung: 'sozial', ergebnis: 'Die Regierung vermittelt hohe Lohnabschlüsse. Die Streiks enden, die Preise steigen.', w: { gewerkschaften: 25, preisdruck: 3, pfund: -5 } },
        { text: 'Hart bleiben und notfalls Soldaten in den Häfen einsetzen.', richtung: 'sparen',
          zufall: [
            { p: 0.5, ergebnis: 'Die Streikfront bröckelt nach Wochen. Die Regierung hat sich durchgesetzt, das Klima ist vergiftet.', w: { gewerkschaften: 10, ansehen: 2, impuls: -1 } },
            { ergebnis: 'Der Streik weitet sich aus. Nach Wochen muss die Regierung doch nachgeben.', w: { gewerkschaften: 15, ansehen: -5, impuls: -1.5, preisdruck: 2 } },
          ] },
        { text: 'Einen Schlichter einsetzen und eine Lohnkommission versprechen.', hist: true, ergebnis: 'Ein Untersuchungsgericht schlichtet; die Gewerkschaften bekommen einen Teil ihrer Forderungen.', w: { gewerkschaften: 18, preisdruck: 1.5, haushalt: -2 } },
      ],
      nachher: st2 => { delete st2.f.streik_offen; },
    };
  },
};

// ------------------------------------------------------------------ nach Entscheidungen

/**
 * Haltung der Fraktionen zu Richtungen von Entscheidungen (`richtung` an einer Option):
 * Wird die eigene Fraktion verprellt, sinkt der Rückhalt.
 */
const HALTUNG = {
  LAB: { sozial: 2, sparen: -2, empire: -1, dekolonisation: 1, europa: -1, atlantisch: -0.5, ost: 1, atom: -1, gewerkschaft: 2 },
  CON: { sozial: -0.5, sparen: 1, empire: 2, dekolonisation: -2, europa: -0.5, atlantisch: 1, ost: -2, atom: 1, gewerkschaft: -1 },
};
const richtungen = o => (Array.isArray(o.richtung) ? o.richtung : o.richtung ? [o.richtung] : []);

export function nachOption(s, o) {
  const r = richtungen(o);
  if (!r.length) return;
  let d = 0;
  for (const t of r) { const h = HALTUNG[s.partei]?.[t] || 0; d += h < 0 ? h : 0.3 * h; }
  s.w.rueckhalt += 1.5 * Math.max(-6, Math.min(2, d));
}

export function pruefeKrise(s) {
  s.einschub = s.einschub || [];
  const neu = (flag, id) => {
    if (s.f[flag]) return;
    s.f[flag] = true;
    delete s.erledigt[id];
    s.einschub.push(id);
  };
  if (s.w.rueckhalt <= 0) neu('misstrauen_offen', 'dyn:misstrauensvotum');
  else if (s.w.rueckhalt <= 18 && !wahlAngesetzt(s)) neu('revolte_offen', 'dyn:fraktionsrevolte');
  if (s.w.pfund <= 8) neu('pfund_offen', 'dyn:pfundkrise');
  if (s.w.gewerkschaften <= 12) neu('streik_offen', 'dyn:streikwelle');
}

export function pruefeEnde(s) {
  if (s.ende) return;
  if (s.w.haushalt <= 0 && !s.f.haushalt_offen) {
    s.f.haushalt_offen = true;
    delete s.erledigt['dyn:haushaltsnotstand'];
    (s.einschub ||= []).push('dyn:haushaltsnotstand');
  }
  pruefeKrise(s);
}

/** Berichte über die gesteuerten Länder: Treffsicherheit q und Quelle */
export function aufklaerung(s, land) {
  if (land === 'usa') return { q: 0.75 + (s.w.usa >= 75 ? 0.05 : 0), quelle: 'Botschaft Washington' };
  if (land === 'su') return { q: 0.66, quelle: 'Secret Intelligence Service' };
  if (land === 'frankreich') return { q: 0.7, quelle: 'Botschaft Paris' };
  if (land === 'brd') return { q: 0.72, quelle: s.zeit < 1955.2 ? 'Hoher Kommissar in Bonn' : 'Botschaft Bonn' };
  return { q: 0.7, quelle: 'Foreign Office' };
}

export function aktenProRunde(s, nHaupt) {
  if (nHaupt >= 4) return 0;
  if (nHaupt >= 2) return 1;
  return 2;
}

/** Für die vom Spiel gesteuerte Regierung: der Premierminister (ki.js) */
export const regimeVon = s => s.premierId;
