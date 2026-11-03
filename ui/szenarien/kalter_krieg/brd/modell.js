// Wirtschafts-, Umfrage- und Wahlmodell für die Bundesrepublik 1949–1964.
// Alle Größen sind bewusst einfach gehalten und so kalibriert, dass ein Spiel mit
// den historischen Entscheidungen ungefähr die historischen Werte ergibt.

import { STANDARD, BAUSTEINE, beziehungen } from '../werte.js';
import { jahrVon, zeitIndex, zeitText, runde1 } from '../../../engine.js';

export const WERTE = {
  // Beziehungen: wie Washington, Moskau, London und Paris die Bundesrepublik sehen
  ...beziehungen('brd'),
  // Landesspezifisch
  souveraenitaet:  { name: 'Souveränität', kurz: 'Souveränität', min: 0, max: 100, block: 'land',
    erklaerung: { was: 'Wie viel die Bundesrepublik selbst entscheiden darf, von 0 (Besatzungsstatut) bis 100 (voll souverän).',
      hebt: 'Petersberger Abkommen, Westverträge, NATO-Beitritt.', senkt: 'Gescheiterte Verträge, Misstrauen der Westmächte.',
      wirkt: 'Unter 60 zahlt die Bundesrepublik Besatzungskosten; unter 30 lähmen die Demontagen das Wachstum. Sinken Souveränität und Vertrauen der Westmächte zu tief, setzen sie das Besatzungsrecht wieder in Kraft.' } },
  einheit:         { name: 'Aussicht auf Einheit', kurz: 'Einheit', min: 0, max: 100, block: 'land',
    erklaerung: { was: 'Wie realistisch eine Wiedervereinigung ist, von 0 bis 100.', hebt: 'Verhandlungen mit Moskau, Neutralität, Entspannung.',
      senkt: 'Die Bindung an den Westen (NATO, EVG), die Zeit.', wirkt: 'Öffnet die Verhandlungen über die Einheit; strebt ohne Zutun langsam gegen 10.' } },
  europa:          { ...BAUSTEINE.europa },
  zustimmung:      { ...STANDARD.zustimmung, min: 10, max: 70 },
  ansehen:         STANDARD.ansehen,
  rueckhalt:       STANDARD.rueckhalt,
  haushalt:        STANDARD.haushalt,
  wachstum:        STANDARD.wachstum,
  inflation:       STANDARD.inflation,
  arbeitslosigkeit: STANDARD.arbeitslosigkeit,
  impuls:          { name: 'Konjunkturimpuls', kurz: 'Konjunktur', min: -6, max: 6, versteckt: true },
  flucht:          { name: 'Fluchtbewegung aus der DDR', kurz: 'Flucht aus der DDR', min: 0, max: 100, neutral: true, block: 'land',
    erklaerung: { was: 'Wie viele Menschen aus der DDR in den Westen fliehen, von 0 bis 100.', hebt: 'Härte in der DDR, Krisen in Berlin.',
      senkt: 'Die Mauer, Entspannung, eine Einigung mit Moskau.', wirkt: 'Flüchtlinge erhöhen zunächst die Arbeitslosigkeit; eine hohe Fluchtbewegung setzt Ost-Berlin und Moskau unter Druck.' } },
  kanzlerbonus:    { name: 'Kanzlerbonus', min: -10, max: 10, versteckt: true },
  klima:           { name: 'Konjunkturklima', min: -10, max: 20, versteckt: true },
  bundeswehr:      { name: 'Aufbau der Streitkräfte', min: 0, max: 5, versteckt: true },
};

// Historisches Grundwachstum (real, % p. a.) abzüglich der im Modell erklärten Teile
const BASIS = {
  1949: 8.6, 1950: 9.4, 1951: 8.2, 1952: 7.6, 1953: 7.0, 1954: 6.0, 1955: 9.8, 1956: 5.4,
  1957: 4.0, 1958: 3.0, 1959: 5.6, 1960: 6.8, 1961: 3.6, 1962: 3.2, 1963: 1.8, 1964: 5.2,
};

// Grundinflation (Verbraucherpreise, % p. a.): Deflation nach der Währungsreform, Korea-Schub 1951
const INFLATION = {
  1949: 0, 1950: -4, 1951: 7.5, 1952: 2, 1953: -1.5, 1954: 0.3, 1955: 1.6, 1956: 2.6,
  1957: 2.1, 1958: 2.2, 1959: 1.0, 1960: 1.4, 1961: 2.3, 1962: 2.8, 1963: 3.0, 1964: 2.3,
};

// Sammlungsbewegung: die Union nimmt bis Ende der 50er Jahre kleinere bürgerliche Parteien auf
function sammlung(z) {
  const i = zeitIndex(z) - zeitIndex(1949.2);
  const a = zeitIndex(1953.2) - zeitIndex(1949.2);
  const b = zeitIndex(1957.2) - zeitIndex(1949.2);
  const c = zeitIndex(1961.2) - zeitIndex(1949.2);
  if (i <= a) return 5 * i / a;
  if (i <= b) return 5 + 3 * (i - a) / (b - a);
  if (i <= c) return 8 + 4 * (i - b) / (c - b);
  return 12;
}

function spdBasis(z) {
  const j = z;
  if (j <= 1953.2) return 29;
  if (j <= 1957.2) return 29 + 5 * (zeitIndex(z) - zeitIndex(1953.2)) / 8;
  return 34;
}

function altersmalus(s) {
  if (s.kanzler !== 'Adenauer' || s.zeit < 1959) return 0;
  return (zeitIndex(s.zeit) - zeitIndex(1959.1)) * 0.35;
}

export function vereinigtSeit(s) {
  return s.f.vereinigt ? zeitIndex(s.zeit) - zeitIndex(s.f.vereinigt) : null;
}

// --------------------------------------------------------------- Parteien und Regierung

/** Partei, die den Kanzler stellt: 'Union' oder 'SPD' */
export const kanzlerpartei = s => s.kanzlerpartei || 'Union';
/** Die andere große Partei */
export const andere = p => (p === 'Union' ? 'SPD' : 'Union');
export const KURZ = { Union: 'Union', SPD: 'SPD', FDP: 'FDP', Kleine: 'DP/BHE', KPD: 'KPD', Sonstige: 'Sonstige' };

/** Kanzlerkandidat einer Partei zum aktuellen Zeitpunkt */
export function kandidat(s, partei) {
  if (partei === 'SPD') return s.zeit < 1952.2 ? 'Schumacher' : s.zeit < 1960.2 ? 'Ollenhauer' : 'Brandt';
  if (s.zeit < 1959 && !s.f.praesident_adenauer) return 'Adenauer';
  return s.f.erhard_praesident ? 'Schröder' : 'Erhard';
}

/** Hält fest, wer wann regiert hat (für den Abschlussbericht) */
export function notiereKanzler(s) {
  const l = (s.kanzlerliste ||= [{ name: 'Adenauer', partei: 'Union', ab: 1949.2 }]);
  const letzter = l[l.length - 1];
  if (letzter.name !== s.kanzler || letzter.partei !== kanzlerpartei(s)) l.push({ name: s.kanzler, partei: kanzlerpartei(s), ab: s.zeit });
}

/**
 * Regierungswechsel: eine andere Partei stellt den Kanzler. Gespielt wird die
 * Bundesregierung, nicht eine Partei – das Spiel geht mit der neuen Regierung weiter.
 */
export function wechsleRegierung(s, partei, regierung, kanzler = kandidat(s, partei)) {
  const alt = kanzlerpartei(s);
  s.kanzlerpartei = partei;
  s.kanzler = kanzler;
  s.regierung = [...regierung];
  if (regierung.includes('Union') && regierung.includes('SPD')) s.f.grosse_koalition = true;
  else delete s.f.grosse_koalition;
  if (alt !== partei) {
    s.w.ansehen = 0;
    s.w.kanzlerbonus = 4;
    delete s.f.adenauer_ruecktritt_zugesagt;
  }
  s.w.rueckhalt = Math.max(s.w.rueckhalt, regierung.length > 1 ? 55 : 60);
  notiereKanzler(s);
}

/** Steigende Preise ärgern erst, wenn sie spürbar sind */
const teuerung = w => 0.4 * Math.max(0, (w.inflation ?? 2) - 3);

export function berechneUmfrage(s) {
  const w = s.w;
  const g = w.klima ?? w.wachstum;
  if (kanzlerpartei(s) === 'SPD') {
    // Die SPD in der Regierung: eigene Stammwählerschaft, Amtsbonus und die Regierungsbilanz
    let u = spdBasis(s.zeit) + (s.f.godesberg ? 3 : 0) + 4 + 0.6 * (g - 5) - 0.6 * (w.arbeitslosigkeit - 5) - teuerung(w)
      + w.ansehen + w.kanzlerbonus;
    if (s.f.vereinigt) u += 2;
    return Math.max(15, Math.min(65, runde1(u)));
  }
  let u = 30 + sammlung(s.zeit) + 0.6 * (g - 5) - 0.6 * (w.arbeitslosigkeit - 5) - teuerung(w)
    + w.ansehen + w.kanzlerbonus - altersmalus(s);
  if (s.f.vereinigt) u -= s.f.ost_cdu ? 0.5 : 2.5; // in den neuen Ländern ist die Union schwächer
  return Math.max(15, Math.min(65, runde1(u)));
}

export function startzustand() {
  return {
    w: {
      souveraenitaet: 10, einheit: 15, europa: 5,
      ansehen: 0, rueckhalt: 60, haushalt: 40, wachstum: 9.0, inflation: 0, arbeitslosigkeit: 9.5, impuls: 0,
      flucht: 30, kanzlerbonus: 0, bundeswehr: 0, zustimmung: 31, klima: 9,
    },
    f: {},
    kanzler: 'Adenauer',
    kanzlerpartei: 'Union',
    kanzlerliste: [{ name: 'Adenauer', partei: 'Union', ab: 1949.2 }],
    regierung: ['Union', 'FDP', 'Kleine'],
    sitze: { Union: 139, SPD: 131, FDP: 52, Kleine: 17, KPD: 15, Sonstige: 48 },
  };
}

export const PARTEIEN = {
  Union: { name: 'CDU/CSU', farbe: '#222' },
  SPD: { name: 'SPD', farbe: '#b3261e' },
  FDP: { name: 'FDP', farbe: '#c9a400' },
  Kleine: { name: 'DP/BHE u. a.', farbe: '#5b6f8a' },
  KPD: { name: 'KPD', farbe: '#7a1a1a' },
  Sonstige: { name: 'Sonstige', farbe: '#999' },
};

export const kleineName = s => (s.zeit < 1950.2 ? 'DP' : s.zeit < 1960 ? 'DP/BHE' : 'GDP (DP/BHE)');

export function rundenende(s, a) {
  const w = s.w;
  const j = jahrVon(s.zeit);
  const seit = vereinigtSeit(s);

  // --- Wachstum
  let g = BASIS[j] ?? 5;
  g += w.impuls;
  g += 0.03 * (w.europa - 30) + 0.015 * (w.usa - 55);
  if (s.f.demontage && w.souveraenitaet < 30) g -= 1.2;
  if (w.haushalt < 20) g -= (20 - w.haushalt) * 0.06;
  if (w.moskau < 30) g -= (30 - w.moskau) * 0.06;
  if (w.arbeitslosigkeit < 1.5 && !s.f.gastarbeiter) g -= 0.8;
  if (s.f.kartellgesetz) g += 0.2;
  if (s.f.vorrang_ruestung) g -= 0.3;
  if (seit !== null) g += seit < 4 ? -2.5 : seit < 12 ? 1.2 : 0.3;
  g += 0.6 * a.normal();
  w.wachstum = runde1(Math.max(-8, Math.min(16, g)));
  w.impuls *= 0.5;
  w.klima = runde1(((w.klima ?? w.wachstum) + w.wachstum) / 2);

  // --- Inflation: Grundrate, Konjunkturprogramme und Defizite treiben die Preise
  let inf = 0.4 * (w.inflation ?? 2) + 0.6 * (INFLATION[j] ?? 2) + 0.3 * Math.max(0, w.impuls);
  if (w.haushalt < 15) inf += (15 - w.haushalt) * 0.05;
  if (seit !== null && seit < 4) inf += 2;
  inf += 0.3 * a.normal();
  w.inflation = runde1(Math.max(-6, Math.min(30, inf)));

  // --- Arbeitslosigkeit (Halbjahresveränderung, Okun-artig plus Zustrom von Vertriebenen und Flüchtlingen)
  const zustrom = j <= 1952 ? 1.15 : j <= 1955 ? 0.75 : j <= 1958 ? 0.2 : 0;
  let al = w.arbeitslosigkeit - 0.22 * (w.wachstum - 3) + zustrom + 0.004 * w.flucht;
  if (seit === 1) al += 3.5; // verdeckte Arbeitslosigkeit in den neuen Ländern wird sichtbar
  w.arbeitslosigkeit = runde1(Math.max(0.6, Math.min(25, al)));

  // --- Haushalt
  let lasten = 0;
  if (w.souveraenitaet < 60 && !s.f.vereinigt) lasten += 1.2; // Besatzungskosten
  lasten += w.bundeswehr * 0.5;
  if (s.f.rentenreform) lasten += 0.8;
  if (s.f.lastenausgleich) lasten += 0.4;
  if (seit !== null && seit < 8) lasten += 2.0;
  w.haushalt = runde1(w.haushalt + 0.6 * (w.wachstum - 4) + 1.0 - lasten);

  // --- Langsame Rückkehr zu Normalwerten
  w.moskau += (50 - w.moskau) * 0.12;
  w.rueckhalt += (55 - w.rueckhalt) * 0.08;
  w.ansehen *= 0.78;
  // Vertrauen will gepflegt werden
  for (const k of ['usa', 'frankreich', 'grossbritannien']) w[k] += (50 - w[k]) * 0.08;
  w.einheit += (10 - w.einheit) * 0.04;
  w.kanzlerbonus *= 0.8;
  const fluchtBasis = s.f.mauer ? 3 : s.f.vereinigt ? 0 : s.f.neutral ? 15 : 25;
  w.flucht += (fluchtBasis - w.flucht) * 0.15;
  if (s.f.nato || s.f.evg) w.einheit = Math.max(0, w.einheit - 0.6);
  for (const k of ['moskau', 'rueckhalt', 'ansehen', 'flucht', 'einheit', 'usa', 'frankreich', 'grossbritannien']) w[k] = runde1(w[k]);

  // Schumacher (gest. August 1952) und Ollenhauer (gest. Dezember 1963) können nicht im Amt bleiben
  const abschied = { Schumacher: [1952.1, 'Bundeskanzler Kurt Schumacher tritt aus gesundheitlichen Gründen zurück.'],
    Ollenhauer: [1963.1, 'Bundeskanzler Erich Ollenhauer tritt aus gesundheitlichen Gründen zurück.'] }[s.kanzler];
  if (abschied && kanzlerpartei(s) === 'SPD' && zeitIndex(s.zeit) >= zeitIndex(abschied[0])) {
    const nf = nachfolger(s);
    (s.notizen ||= []).push(`${abschied[1]} Die SPD-Fraktion wählt ${vollerName(nf)} zum Nachfolger. (Fiktion)`);
    s.kanzler = nf;
    w.kanzlerbonus = Math.max(w.kanzlerbonus, 3);
  }
  notiereKanzler(s);

  w.zustimmung = berechneUmfrage(s);
}

// --------------------------------------------------------------- Wahlen

export function wahl(s, a) {
  const z = s.zeit;
  const j = jahrVon(z);
  const st = {};
  if (kanzlerpartei(s) === 'SPD') {
    // Die Union in der Opposition: das bürgerliche Lager bleibt groß, aber ohne Kanzlerbonus
    st.SPD = s.w.zustimmung + 1.5 * a.normal();
    st.Union = 27 + sammlung(z) + 0.5 * (38 - st.SPD) - (s.f.vereinigt ? (s.f.ost_cdu ? 0.5 : 2.5) : 0) + a.normal();
  } else {
    st.Union = s.w.zustimmung + 1.5 * a.normal();
    st.SPD = spdBasis(z) + (s.f.godesberg ? 3 : 0) + 0.5 * (43 - st.Union) + (s.f.vereinigt ? 2 : 0) + a.normal();
  }
  st.FDP = 9.5 + 0.25 * (45 - st.Union) + 0.5 * a.normal()
    + (j >= 1961 && s.kanzler === 'Adenauer' ? 3.5 : 0) + (s.f.fdp_opposition ? 1 : 0);
  st.KPD = s.f.kpd_verboten ? 0 : s.f.vereinigt ? 6 : 2.2;
  st.Sonstige = j <= 1953 ? 5 : 3;
  st.Kleine = 100 - st.Union - st.SPD - st.FDP - st.KPD - st.Sonstige;
  if (st.Kleine < 1) {
    const zuviel = 1 - st.Kleine;
    st.Kleine = 1;
    st.SPD -= zuviel / 2; st.FDP -= zuviel / 2;
  }
  for (const k of Object.keys(st)) st[k] = runde1(Math.max(0, st[k]));

  // Sperrklausel; die kleinen bürgerlichen Parteien kommen über Wahlkreisabsprachen schon ab 4 %
  const drin = Object.keys(st).filter(k => k !== 'Sonstige' && (st[k] >= 5 || (k === 'Kleine' && st[k] >= 4)));
  const summe = drin.reduce((x, k) => x + st[k], 0);
  const gesamt = s.f.vereinigt ? 620 : 500;
  const sitze = {};
  let vergeben = 0;
  for (const k of drin) { sitze[k] = Math.floor(gesamt * st[k] / summe); vergeben += sitze[k]; }
  // Restsitze nach größtem Rest
  const reste = drin.map(k => [k, gesamt * st[k] / summe - sitze[k]]).sort((x, y) => y[1] - x[1]);
  for (let i = 0; vergeben < gesamt; i++, vergeben++) sitze[reste[i % reste.length][0]]++;

  s.sitze = sitze;
  s.f.legislatur = (s.f.legislatur || 1) + 1;
  return { zeit: z, stimmen: st, sitze: { ...sitze }, gesamt, kleineName: kleineName(s), gesamtdeutsch: !!s.f.vereinigt };
}

const sitzeVon = (s, parteien) => parteien.reduce((x, p) => x + (s.sitze[p] || 0), 0);
const gesamtSitze = s => Object.values(s.sitze).reduce((x, y) => x + y, 0);
export const hatMehrheit = (s, parteien) => sitzeVon(s, parteien) * 2 > gesamtSitze(s);

/** Ist die SPD zu einer Großen Koalition unter einem Unionskanzler bereit? */
function spdBereit(s) {
  return !!(s.f.godesberg || s.f.spd_dialog || s.f.vereinigt || s.f.grosse_koalition || s.f.stalin_angenommen);
}
/** Hat sich die FDP der SPD geöffnet? */
const fdpSpdOffen = s => !!(s.f.godesberg || s.f.spd_dialog || s.f.vereinigt || s.f.fdp_opposition || kanzlerpartei(s) === 'SPD');
/**
 * Ist die FDP zu einer Koalition mit `partei` bereit? Hängt vom Klima (bei der
 * Kanzlerpartei) und vom Kräfteverhältnis ab.
 */
export function fdpBereit(s, partei = kanzlerpartei(s)) {
  const eigene = partei === kanzlerpartei(s);
  if (eigene && s.f['fdp_lehnt_ab_' + s.zeit]) return false;
  if (partei === 'SPD' && !fdpSpdOffen(s)) return false;
  const e = s.wahlen[s.wahlen.length - 1];
  const abstand = e ? e.stimmen[partei] - e.stimmen[andere(partei)] : (partei === 'Union' ? 10 : -10);
  return (eigene ? s.w.rueckhalt : 50) + 2 * abstand >= 50;
}
/** Die kleinen bürgerlichen Parteien koalieren nur mit der Union */
const kleineBereit = (s, partei = 'Union') => partei === 'Union' && !s.f.grenze_anerkannt;

/**
 * Wer regiert, wenn die Kanzlerpartei keine Mehrheit zustande bringt? Reihenfolge:
 * die andere große Partei allein, mit der FDP (und bei der Union mit den Kleinen),
 * eine Große Koalition unter der stärkeren Partei, sonst eine Minderheitsregierung
 * der stärksten Fraktion (Art. 63 Abs. 4 GG).
 */
export function bildeRegierung(s, { zwang = false } = {}) {
  const K = kanzlerpartei(s), O = andere(K);
  const kleineDa = (s.sitze.Kleine || 0) > 0 && kleineBereit(s, O);
  const fdpDa = (s.sitze.FDP || 0) > 0 && (zwang || fdpBereit(s, O));
  const kandidaten = [[O]];
  if (fdpDa) kandidaten.push([O, 'FDP'], ...(kleineDa ? [[O, 'FDP', 'Kleine']] : []));
  if (kleineDa) kandidaten.push([O, 'Kleine']);
  for (const r of kandidaten) if (hatMehrheit(s, r)) return { partei: O, regierung: r };
  if (hatMehrheit(s, ['Union', 'SPD'])) {
    const vorn = (s.sitze.SPD || 0) > (s.sitze.Union || 0) ? 'SPD' : 'Union';
    return { partei: vorn, regierung: [vorn, andere(vorn)] };
  }
  const staerkste = (s.sitze.SPD || 0) > (s.sitze.Union || 0) ? 'SPD' : 'Union';
  return { partei: staerkste, regierung: [staerkste], minderheit: true };
}

const listeText = l => (l.length > 1 ? l.slice(0, -1).join(', ') + ' und ' + l[l.length - 1] : l[0]);
const parteienText = (s, r) => listeText(r.map(p => (p === 'Kleine' ? kleineName(s) : PARTEIEN[p].name)));
const SPD_KANZLER = { Schumacher: 'Kurt Schumacher', Ollenhauer: 'Erich Ollenhauer', Brandt: 'Willy Brandt', Erler: 'Fritz Erler', Schmid: 'Carlo Schmid' };
const UNION_KANZLER = { Adenauer: 'Konrad Adenauer', Erhard: 'Ludwig Erhard', 'Schröder': 'Gerhard Schröder', 'von Brentano': 'Heinrich von Brentano', Gerstenmaier: 'Eugen Gerstenmaier' };
export const vollerName = n => SPD_KANZLER[n] || UNION_KANZLER[n] || n;

/** Option, mit der eine vom Spiel gebildete Regierung übernommen wird */
function uebernahme(s, neu, anlass) {
  const K = kanzlerpartei(s);
  const kanzler = neu.partei === K ? s.kanzler : kandidat(s, neu.partei);
  const wer = `${vollerName(kanzler)} (${PARTEIEN[neu.partei].name})`;
  const text = neu.minderheit
    ? `${anlass} Keine Koalition hat eine Mehrheit. ${neu.partei === K ? `${s.kanzler} bleibt` : `${wer} wird`} im dritten Wahlgang mit relativer Mehrheit Kanzler einer Minderheitsregierung.`
    : `${anlass} ${wer} wird mit den Stimmen von ${parteienText(s, neu.regierung)} zum Bundeskanzler gewählt.`;
  return {
    text: neu.partei === K ? 'Die Minderheitsregierung führen.' : `Die Regierung ${kanzler} übernehmen.`,
    ergebnis: neu.minderheit
      ? `${neu.partei === K ? s.kanzler : vollerName(kanzler)} regiert ohne eigene Mehrheit und muss sich für jedes Gesetz Stimmen suchen.`
      : `${vollerName(kanzler)} ist Bundeskanzler. Die neue Regierung aus ${parteienText(s, neu.regierung)} tritt ihr Amt an.`,
    beschreibung: text,
    w: neu.minderheit ? { ansehen: -4 } : {},
    aktion: st => {
      const fdpRaus = st.regierung.includes('FDP') && !neu.regierung.includes('FDP');
      wechsleRegierung(st, neu.partei, neu.regierung, kanzler);
      if (neu.minderheit) st.w.rueckhalt = 40;
      if (fdpRaus) st.f.fdp_opposition = true;
    },
  };
}

const NACHFOLGER = ['Adenauer', 'Erhard', 'Schröder', 'von Brentano', 'Gerstenmaier'];
// Schumacher starb im August 1952, Ollenhauer im Dezember 1963; Brandt erst ab 1957 als Regierender Bürgermeister bundesweit bekannt
const NACHFOLGER_SPD = [['Schumacher', 0, 1952.2], ['Ollenhauer', 0, 1963.2], ['Brandt', 1957.2, 9999], ['Erler', 0, 9999], ['Schmid', 0, 9999]];
export function nachfolger(s) {
  if (kanzlerpartei(s) === 'SPD') {
    const liste = NACHFOLGER_SPD.filter(([n, ab, bis]) => n === s.kanzler || (s.zeit >= ab && s.zeit < bis)).map(x => x[0]);
    const i = liste.indexOf(s.kanzler);
    return liste[Math.min(liste.length - 1, i + 1)] || 'Erler';
  }
  const liste = NACHFOLGER.filter(n => !(n === 'Erhard' && s.f.erhard_praesident));
  const i = liste.indexOf(s.kanzler);
  return liste[Math.min(liste.length - 1, i + 1)] || 'Erhard';
}

function sitzText(s) {
  const n = PARTEIEN;
  const teile = Object.entries(s.sitze).filter(([, v]) => v > 0)
    .map(([k, v]) => `${k === 'Kleine' ? kleineName(s) : n[k].name} ${v}`);
  return `Sitzverteilung: ${teile.join(' · ')} (Mehrheit ab ${Math.floor(gesamtSitze(s) / 2) + 1}).`;
}

// --------------------------------------------------------------- dynamische Ereignisse

export const dynamisch = {
  regierungsbildung(s) {
    const e = s.wahlen[s.wahlen.length - 1];
    const j = jahrVon(e.zeit);
    const k = kleineName(s);
    const opts = [];
    const neuBonus = { aktion: (st) => { st.w.rueckhalt = Math.max(st.w.rueckhalt, 50); } };
    const K = kanzlerpartei(s);
    const fdpOk = fdpBereit(s);
    const kleineDa = (s.sitze.Kleine || 0) > 0 && kleineBereit(s, K);
    const unionVorn = (s.sitze.Union || 0) >= (s.sitze.SPD || 0);

    if (K === 'Union') {
      if (hatMehrheit(s, ['Union'])) {
        opts.push({ text: 'Allein regieren – die Union hat die absolute Mehrheit.', hist: false,
          ergebnis: 'Die Union stellt alle Minister. Die Fraktionsdisziplin ersetzt den Koalitionsausschuss.',
          aktion: st => { st.regierung = ['Union']; st.w.rueckhalt = 75; delete st.f.grosse_koalition; } });
        if (kleineDa) opts.push({ text: `Trotz eigener Mehrheit mit der ${k} koalieren.`, hist: j === 1957,
          ergebnis: 'Die kleinen Partner sind dankbar; die Regierung steht auf breiterer Grundlage.',
          w: { ansehen: 1 },
          aktion: st => { st.regierung = ['Union', 'Kleine']; st.w.rueckhalt = 68; delete st.f.grosse_koalition; } });
      }
      if (fdpOk && !hatMehrheit(s, ['Union']) && hatMehrheit(s, ['Union', 'FDP', ...(kleineDa ? ['Kleine'] : [])])) {
        const mitAdenauer = s.kanzler === 'Adenauer' && j >= 1961;
        const partner = ['Union', 'FDP', ...(kleineDa ? ['Kleine'] : [])];
        if (mitAdenauer) {
          opts.push({ text: 'Koalition mit der FDP – und zusagen, dass Adenauer vor Ende der Wahlperiode abtritt.', hist: true,
            ergebnis: 'Die FDP hatte „mit der CDU, aber ohne Adenauer“ geworben. Nach wochenlangen Verhandlungen trägt sie den Kanzler mit – auf Zeit.',
            w: { ansehen: -3 }, setze: ['adenauer_ruecktritt_zugesagt'],
            aktion: st => { st.regierung = partner; st.w.rueckhalt = 45; delete st.f.grosse_koalition; } });
          opts.push({ text: 'Koalition mit der FDP ohne jede Zusage durchsetzen.',
            zufall: [
              { p: 0.35, ergebnis: 'Die FDP fällt um. Die Zeitungen sprechen von der „Umfallerpartei“ – der Kanzler regiert ohne Befristung weiter.',
                aktion: st => { st.regierung = partner; st.w.rueckhalt = 30; } },
              { ergebnis: 'Die FDP bricht die Verhandlungen ab. Eine andere Mehrheit muss her.',
                aktion: (st, a) => { st.f['fdp_lehnt_ab_' + st.zeit] = true; st.einschub = ['dyn:regierungsbildung']; delete st.erledigt['dyn:regierungsbildung']; } },
            ] });
        } else {
          opts.push({ text: kleineDa ? `Koalition mit FDP und ${k}.` : 'Koalition mit der FDP.', hist: j === 1953 || j === 1961,
            ergebnis: 'Die bürgerliche Koalition wird fortgesetzt.',
            aktion: st => { st.regierung = partner; st.w.rueckhalt = Math.max(st.w.rueckhalt, 55); delete st.f.grosse_koalition; } });
        }
      }
      if (!hatMehrheit(s, ['Union']) && kleineDa && hatMehrheit(s, ['Union', 'Kleine'])) {
        opts.push({ text: `Bürgerliche Koalition mit der ${k}, ohne die FDP.`,
          ergebnis: 'Eine knappe, aber berechenbare Mehrheit.',
          aktion: st => { st.regierung = ['Union', 'Kleine']; st.w.rueckhalt = 55; delete st.f.grosse_koalition; } });
      }
      if (!hatMehrheit(s, ['Union']) && unionVorn && spdBereit(s) && hatMehrheit(s, ['Union', 'SPD'])) {
        opts.push({ text: 'Große Koalition mit der SPD.',
          ergebnis: 'Union und SPD regieren gemeinsam. In der Deutschland- und Ostpolitik muss die Union der SPD entgegenkommen.',
          w: { ansehen: -2, usa: -3, einheit: 3 }, setze: ['grosse_koalition'],
          aktion: st => { st.regierung = ['Union', 'SPD']; st.w.rueckhalt = 60; } });
      }
    } else {
      // Die SPD stellt den Kanzler
      const spdVorn = (s.sitze.SPD || 0) > (s.sitze.Union || 0);
      if (hatMehrheit(s, ['SPD'])) {
        opts.push({ text: 'Allein regieren – die SPD hat die absolute Mehrheit.',
          ergebnis: 'Die SPD stellt alle Minister. Die Fraktionsdisziplin ersetzt den Koalitionsausschuss.',
          aktion: st => { wechsleRegierung(st, 'SPD', ['SPD'], st.kanzler); st.w.rueckhalt = 75; } });
      }
      if (fdpOk && !hatMehrheit(s, ['SPD']) && hatMehrheit(s, ['SPD', 'FDP'])) {
        opts.push({ text: s.regierung.includes('FDP') ? 'Die Koalition mit der FDP fortsetzen.' : 'Eine Koalition mit der FDP bilden.',
          ergebnis: 'SPD und FDP regieren gemeinsam. In der Wirtschaftspolitik setzt die FDP der SPD enge Grenzen.',
          aktion: st => { wechsleRegierung(st, 'SPD', ['SPD', 'FDP'], st.kanzler); st.w.rueckhalt = Math.max(st.w.rueckhalt, 55); } });
      }
      if (!hatMehrheit(s, ['SPD']) && spdVorn && hatMehrheit(s, ['SPD', 'Union'])) {
        opts.push({ text: 'Große Koalition mit der Union.',
          ergebnis: 'SPD und Union regieren gemeinsam. In der Außen- und Wirtschaftspolitik muss die SPD der Union weit entgegenkommen.',
          w: { ansehen: -2, usa: 2, einheit: -2 },
          aktion: st => { wechsleRegierung(st, 'SPD', ['SPD', 'Union'], st.kanzler); st.w.rueckhalt = 60; } });
      }
    }

    const st = e.stimmen;
    const stand = `Die Union kommt auf ${st.Union.toFixed(1).replace('.', ',')}\u00a0%, die SPD auf ${st.SPD.toFixed(1).replace('.', ',')}\u00a0%, die FDP auf ${st.FDP.toFixed(1).replace('.', ',')}\u00a0%.`;
    if (!opts.length) {
      // Die Kanzlerpartei kann nicht regieren: das Spiel bildet die neue Regierung
      const o = uebernahme(s, bildeRegierung(s), `Für eine Regierung unter Führung der ${K === 'Union' ? 'Union' : 'SPD'} gibt es keine Mehrheit.`);
      return {
        titel: `Regierungsbildung ${j}`,
        datum: `Herbst ${j}`,
        art: 'haupt',
        absender: 'Präsident des Deutschen Bundestages',
        text: `Der neue Bundestag ist gewählt. ${stand}\n\n${sitzText(s)}\n\n${o.beschreibung}\n\nDu führst von nun an diese Regierung.`,
        optionen: [o],
      };
    }
    return {
      titel: `Regierungsbildung ${j}`,
      datum: `Herbst ${j}`,
      art: 'haupt',
      absender: K === 'Union' ? 'Bundesgeschäftsstelle der CDU' : 'Parteivorstand der SPD',
      text: `${!fdpOk && (s.sitze.FDP || 0) > 0 ? `Die FDP hat angekündigt, nicht mit der ${K === 'Union' ? 'Union' : 'SPD'} zu regieren. ` : ''}Der neue Bundestag ist gewählt. ${stand}\n\n${sitzText(s)}\n\nWie soll die neue Regierung aussehen?`,
      optionen: opts,
    };
  },

  koalitionskrise(s) {
    const K = kanzlerpartei(s), O = andere(K);
    const partner = s.regierung.filter(p => p !== K);
    const haupt = partner.includes(O) ? O : partner.includes('FDP') ? 'FDP' : partner[0];
    const name = haupt === 'Kleine' ? kleineName(s) : PARTEIEN[haupt]?.name || haupt;
    const rest = s.regierung.filter(p => p !== haupt);
    const opts = [];
    const zugestaendnisFlag = 'zugestaendnis_' + (s.f.legislatur || 1);
    if (!s.f[zugestaendnisFlag]) {
      opts.push({ text: `Der ${name} weitreichende Zugeständnisse machen, um die Koalition zu retten.`,
        ergebnis: 'Der Koalitionsausschuss tagt bis in die Nacht. Die Regierung bleibt im Amt – um den Preis der Autorität des Kanzlers.',
        w: { ansehen: -5, rueckhalt: 40 }, setze: [zugestaendnisFlag] });
    }
    if (rest.length && hatMehrheit(s, rest)) {
      opts.push({ text: `Ohne die ${name} weiterregieren.`,
        ergebnis: `Die ${name} verlässt die Regierung. Die verbleibende Koalition hat noch eine Mehrheit.`,
        w: { ansehen: -1 },
        aktion: st => { st.regierung = rest; st.w.rueckhalt = 45; if (haupt === 'FDP') st.f.fdp_opposition = true; if (haupt === O) delete st.f.grosse_koalition; } });
    }
    if (K === 'Union' && haupt !== 'SPD' && spdBereit(s) && hatMehrheit(s, ['Union', 'SPD'])) {
      opts.push({ text: 'Der SPD eine Große Koalition anbieten.',
        ergebnis: 'Die Sozialdemokraten treten in die Regierung ein. Für viele in der Union ist das eine bittere Pille.',
        w: { ansehen: -3, usa: -3, einheit: 3 }, setze: ['grosse_koalition'],
        aktion: st => { st.regierung = ['Union', 'SPD']; st.w.rueckhalt = 55; if (haupt === 'FDP') st.f.fdp_opposition = true; } });
    }
    if (K === 'SPD' && haupt !== 'Union' && hatMehrheit(s, ['SPD', 'Union'])) {
      opts.push({ text: 'Der Union eine Große Koalition anbieten.',
        ergebnis: 'Die Union tritt in die Regierung ein – unter einem sozialdemokratischen Kanzler. Für viele in der SPD ist das eine bittere Pille.',
        w: { ansehen: -3, usa: 2, einheit: -2 },
        aktion: st => { const fdpRaus = haupt === 'FDP'; wechsleRegierung(st, 'SPD', ['SPD', 'Union'], st.kanzler); st.w.rueckhalt = 55; if (fdpRaus) st.f.fdp_opposition = true; } });
    }
    if (!opts.length) {
      // Konstruktives Misstrauensvotum: die Opposition wählt mit den abtrünnigen Partnern einen neuen Kanzler
      const neu = bildeRegierung(s, { zwang: true });
      const o = uebernahme(s, neu, 'Der Bundestag stimmt über ein konstruktives Misstrauensvotum ab.');
      opts.push({ ...o, text: 'Das konstruktive Misstrauensvotum abwarten.' });
    }
    return {
      titel: 'Koalitionskrise',
      datum: zeitText(s.zeit),
      art: 'haupt',
      absender: `Fraktionsvorsitz der ${PARTEIEN[K].name}`,
      text: `Das Klima in der Koalition ist vergiftet. Die ${name} droht offen mit dem Auszug aus der Regierung und verhandelt bereits mit der Opposition.\n\n${sitzText(s)}`,
      optionen: opts,
      nachher: st => { delete st.f.koalitionskrise_offen; },
    };
  },

  kriegsgefahr(s) {
    return {
      titel: 'Am Rande des Krieges',
      datum: zeitText(s.zeit),
      art: 'haupt',
      ascii: 'alarm',
      absender: 'Führungsstab / Auswärtiges Amt',
      text: s.f.vereinigt
        ? 'Sowjetische Panzerverbände sind in Polen und der Tschechoslowakei an der deutschen Grenze aufmarschiert. Moskau wirft der Bundesregierung vor, die Neutralität gebrochen zu haben, und droht, die Garantien des Friedensvertrags „selbst durchzusetzen“. Washington und Paris fragen, wie weit Deutschland zu gehen bereit ist.'
        : 'Sowjetische Panzerverbände sind in der DDR in Bereitschaft versetzt worden, die Zugangswege nach Berlin sind gesperrt. Moskau macht die Bundesregierung persönlich für die Lage verantwortlich. Die Westmächte fragen, wie weit Bonn zu gehen bereit ist.',
      optionen: [
        { text: 'Einlenken: öffentliche Zugeständnisse an Moskau.',
          ergebnis: 'Die Krise flaut ab. In Washington und in der eigenen Partei wird dem Kanzler Schwäche vorgeworfen.',
          w: { moskau: 35, usa: -8, ansehen: -6, souveraenitaet: -4 }, dient: { frieden: 1 } },
        { text: 'Die Supermächte zur Vermittlung drängen und selbst schweigen.',
          ergebnis: 'Hinter verschlossenen Türen verhandeln Washington und Moskau – über Bonns Kopf hinweg.',
          w: { moskau: 22, ansehen: -3, einheit: -3, usa: -2 } },
        { text: 'Standhalten.', dient: { frieden: -2.5 },
          zufall: [
            { p: s2 => 0.25, ergebnis: s2 => (s2.f.vereinigt ? 'Ein Zwischenfall an der Oder gerät außer Kontrolle.' : 'Ein Zwischenfall an der Zonengrenze gerät außer Kontrolle.'),
              aktion: (st, a) => a.ende('krieg') },
            { ergebnis: 'Moskau zieht die Panzer zurück. Der Kanzler hat gepokert – und gewonnen.',
              w: { moskau: 20, ansehen: 5, usa: 3 } },
          ] },
      ],
      nachher: st => { delete st.f.kriegsgefahr_offen; },
    };
  },

  haushaltsnotstand(s) {
    const n = (s.f.notstaende || 0);
    return {
      titel: 'Haushaltsnotstand',
      datum: zeitText(s.zeit),
      art: 'haupt',
      absender: 'Bundesministerium der Finanzen',
      text: `Die Kassen des Bundes sind leer. Der Finanzminister kann die nächsten Gehaltszahlungen nur noch mit kurzfristigen Krediten sichern, die Bank deutscher Länder verweigert weitere Kassenkredite.${n >= 1 ? '\n\nEs ist nicht die erste Krise dieser Art. Ein weiterer Notstand wäre der Staatsbankrott.' : ''}`,
      optionen: [
        { text: 'Steuern erhöhen.', ergebnis: 'Die Einnahmen steigen, die Stimmung sinkt.', w: { haushalt: 18, ansehen: -6, impuls: -1.5 } },
        { text: 'Ausgaben kürzen, auch bei den Koalitionspartnern.', ergebnis: 'Jedes Ressort muss bluten. Die Partner murren.', w: { haushalt: 18, rueckhalt: -12, ansehen: -3, impuls: -1 } },
        { text: 'Die Notenbank zur Finanzierung drängen.', ergebnis: 'Die Preise ziehen an. Die Erinnerung an 1923 ist in jedem Haushalt lebendig.', w: { haushalt: 14, ansehen: -9, usa: -3 } },
      ],
      nachher: st => { st.f.notstaende = (st.f.notstaende || 0) + 1; delete st.f.haushalt_offen; },
    };
  },

  fraktionsrevolte(s) {
    const nf = nachfolger(s);
    return {
      titel: 'Aufstand in der Fraktion',
      datum: zeitText(s.zeit),
      art: 'haupt',
      absender: `Fraktion der ${PARTEIEN[kanzlerpartei(s)].name}`,
      text: `Das Ansehen des Kanzlers ist auf einem Tiefpunkt. In der Fraktion sammeln sich Unterschriften für einen Wechsel; als Nachfolger wird ${nf} gehandelt.`,
      optionen: [
        { text: `Den Weg für ${nf} freimachen.`, ergebnis: `${nf} wird zum Bundeskanzler gewählt. Die ${kanzlerpartei(s)} regiert weiter.`,
          aktion: st => { st.kanzler = nf; st.w.ansehen = 0; st.w.kanzlerbonus = 5; } },
        { text: 'Die Revolte niederschlagen.',
          zufall: [
            { p: 0.5, ergebnis: 'Ein paar Einzelgespräche, ein paar Posten – der Aufstand bricht zusammen.', w: { ansehen: 8, rueckhalt: -5 } },
            { ergebnis: `Die Fraktion setzt sich durch. ${nf} wird Kanzler, der Abgang ist unschön.`,
              aktion: st => { st.kanzler = nf; st.w.ansehen = -3; st.w.kanzlerbonus = 3; } },
          ] },
      ],
      nachher: st => { delete st.f.revolte_offen; },
    };
  },
};

// Nach jeder Entscheidung: Krisen einschieben
export function pruefeKrise(s) {
  s.einschub = s.einschub || [];
  const neu = (flag, id) => {
    if (s.f[flag]) return;
    s.f[flag] = true;
    delete s.erledigt[id];
    s.einschub.push(id);
  };
  if (s.w.rueckhalt <= 0 && s.regierung.length > 1) neu('koalitionskrise_offen', 'dyn:koalitionskrise');
  if (s.w.moskau <= 0) neu('kriegsgefahr_offen', 'dyn:kriegsgefahr');
  if (s.w.ansehen <= -25) neu('revolte_offen', 'dyn:fraktionsrevolte');
}

export function nachOption(s, o) {
  if (kanzlerpartei(s) === 'SPD') {
    // Die eigene Basis misstraut der Westbindung; ein Unionspartner verlangt sie
    if (o.richtung === 'west') s.w.ansehen -= 2;
    if (o.richtung === 'ost') s.w.ansehen += 1;
    if (s.regierung.includes('Union')) {
      if (o.richtung === 'ost') s.w.rueckhalt -= 6;
      if (o.richtung === 'west') s.w.rueckhalt += 3;
    }
    return;
  }
  if (s.regierung.includes('SPD')) {
    if (o.richtung === 'west') s.w.rueckhalt -= 6;
    if (o.richtung === 'ost') s.w.rueckhalt += 3;
  }
}

export function pruefeEnde(s, a) {
  if (s.ende) return;
  const w = s.w;
  if (!s.f.vereinigt && w.souveraenitaet < 50 && (w.usa + w.frankreich + w.grossbritannien) / 3 < 12) {
    a.ende('besatzungsrecht');
    return;
  }
  if (w.haushalt <= 0) {
    if ((s.f.notstaende || 0) >= 2) { a.ende('staatsbankrott'); return; }
    s.einschub = s.einschub || [];
    if (!s.f.haushalt_offen) {
      s.f.haushalt_offen = true;
      delete s.erledigt['dyn:haushaltsnotstand'];
      s.einschub.push('dyn:haushaltsnotstand');
    }
  }
  pruefeKrise(s);
}

/**
 * Berichte über gesteuerte Länder (ki.js): Treffsicherheit q (Wahrscheinlichkeit, dass ein
 * Bericht die wahre Absicht nennt) und Quelle. Ein Nachrichtendienst und eine Botschaft in
 * Moskau machen die Berichte über die Sowjetunion verlässlicher.
 */
export function aufklaerung(s, land) {
  if (land === 'su') {
    const q = 0.6 + (s.f.bnd ? 0.1 : s.f.bnd_eigen ? 0.06 : 0) + (s.f.moskau_beziehungen ? 0.1 : 0);
    const quelle = s.f.moskau_beziehungen ? 'Botschaft Moskau' : s.f.bnd || s.f.bnd_eigen ? 'Bundesnachrichtendienst' : 'Organisation Gehlen';
    return { q, quelle };
  }
  if (land === 'usa') return { q: 0.65 + (s.w.usa >= 65 ? 0.1 : 0), quelle: s.zeit < 1955.2 ? 'Verbindungsstelle Washington' : 'Botschaft Washington' };
  if (land === 'frankreich') return { q: 0.66 + (s.w.frankreich >= 65 ? 0.08 : 0), quelle: s.zeit < 1955.2 ? 'Generalkonsulat Paris' : 'Botschaft Paris' };
  if (land === 'grossbritannien') return { q: 0.68 + (s.w.grossbritannien >= 65 ? 0.08 : 0), quelle: s.zeit < 1955.2 ? 'Generalkonsulat London' : 'Botschaft London' };
  return { q: 0.6, quelle: 'Auswärtiges Amt' };
}

export function aktenProRunde(s, nHaupt) {
  if (nHaupt >= 3) return 0;
  if (nHaupt === 2) return 1;
  return 2;
}
