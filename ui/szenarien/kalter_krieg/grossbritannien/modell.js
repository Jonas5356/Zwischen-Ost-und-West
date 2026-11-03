// Großbritannien: ein schlankes Modell für das vom Spiel gesteuerte Land.
// Die Werte folgen dem gemeinsamen Katalog (werte.js), damit Großbritannien später spielbar
// werden kann. Gewählt wird über Regierungswechsel (regierungen.js), noch nicht über ein Wahlmodell.

import { STANDARD, BAUSTEINE, beziehungen } from '../werte.js';
import { jahrVon, runde1 } from '../../../engine.js';

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
};

export const LANDESSPEZIFISCH = ['empire', 'pfund', 'atom', 'europa'];

export function startzustand() {
  // Januar 1946: Attlees Labour-Regierung, die Sieger von 1945
  return {
    w: {
      zustimmung: 47, ansehen: 0, rueckhalt: 75, wachstum: -2, inflation: 3, arbeitslosigkeit: 2.5, haushalt: 28,
      empire: 70, pfund: 45, atom: 3, europa: 0, impuls: 0,
    },
    f: {},
  };
}

// Grundwachstum und Grundinflation (% p. a.), grob nach den historischen Werten
const BASIS = { 1946: -2, 1947: -1, 1948: 3, 1949: 3, 1950: 3.2, 1951: 2.8, 1952: 0.5, 1953: 4, 1954: 4, 1955: 3.5, 1956: 1.5,
  1957: 2, 1958: 0.5, 1959: 4, 1960: 5, 1961: 3, 1962: 1, 1963: 4, 1964: 5.5 };
const INFLATION = { 1946: 3, 1947: 7, 1948: 8, 1949: 3, 1950: 3, 1951: 9, 1952: 6, 1953: 3, 1954: 2, 1955: 4.5, 1956: 5,
  1957: 4, 1958: 3, 1959: 0.5, 1960: 1, 1961: 3.5, 1962: 4, 1963: 2, 1964: 3 };

export function rundenende(s, a) {
  const w = s.w;
  const j = jahrVon(s.zeit);
  let g = (BASIS[j] ?? 3) + w.impuls + 0.02 * (w.europa - 20) + (w.pfund < 20 ? -(20 - w.pfund) * 0.05 : 0) + 0.6 * a.normal();
  w.wachstum = runde1(Math.max(-6, Math.min(10, g)));
  w.impuls *= 0.5;
  let inf = 0.4 * w.inflation + 0.6 * (INFLATION[j] ?? 3) + 0.3 * Math.max(0, w.impuls) + 0.4 * a.normal();
  if (w.haushalt < 15) inf += (15 - w.haushalt) * 0.06;
  w.inflation = runde1(Math.max(-3, Math.min(30, inf)));
  w.arbeitslosigkeit = runde1(Math.max(0.8, Math.min(12, w.arbeitslosigkeit + 0.3 * (1.8 - w.arbeitslosigkeit) - 0.1 * (w.wachstum - 3))));

  // Haushalt: Kolonialkriege, Rüstung und das Atomprogramm kosten
  // Wann die Aufstände in Malaya, Kenia und Zypern zu Ende gehen (wie in der Geschichte)
  const ENDE = { malaya: s.f.malaya_bald ? 1955.1 : 1957.2, kenia: 1960.1, zypern: 1959.1 };
  for (const [f, z] of Object.entries(ENDE)) if (s.f[f] && s.zeit >= z) s.f[f + '_ende'] = true;
  let lasten = 0;
  for (const f of ['malaya', 'kenia', 'zypern']) if (s.f[f] && !s.f[f + '_ende']) lasten += 0.5;
  if (s.f.korea_truppen && s.weltflags.koreakrieg) lasten += 0.8;
  if (s.f.atomprogramm && w.atom < 100) lasten += 0.4;
  if (s.f.palaestina_bleiben && s.zeit < 1950.1) lasten += 0.8;
  if (s.f.indien_gehalten) lasten += 1.2;
  if (s.f.afrika_gehalten) lasten += 0.6;
  w.haushalt = runde1(w.haushalt + 0.5 * (w.wachstum - 2.5) + 1.2 - lasten);

  w.pfund = runde1(w.pfund + (55 - w.pfund) * 0.1 - 0.4 * (Math.min(w.inflation, 12) - 3) + (w.empire >= 60 ? 0.5 : 0));
  // Das Empire löst sich langsam auf, wenn nichts geschieht
  if (s.zeit >= 1947.1) w.empire -= s.f.dekolonisierung ? 0.5 : 1;
  if (s.f.indien_gehalten || s.f.afrika_gehalten) w.empire -= 1;
  if (s.f.atomprogramm && w.atom < 100) w.atom += 5;

  w.zustimmung = runde1(Math.max(25, Math.min(60, 42 + 0.8 * (w.wachstum - 3) - 0.6 * Math.max(0, w.inflation - 3) - 0.8 * Math.max(0, w.arbeitslosigkeit - 2) + w.ansehen)));
  w.rueckhalt += (65 - w.rueckhalt) * 0.15;
  w.ansehen *= 0.75;
  // Wie die anderen London sehen, strebt langsam zu einem Normalniveau zurück
  for (const [k, ziel] of [['usa', 70], ['moskau', 35], ['frankreich', 58], ['brd', 50]]) w[k] += (ziel - w[k]) * 0.08;
  for (const k of ['empire', 'rueckhalt', 'ansehen', 'usa', 'moskau', 'frankreich', 'brd', 'atom', 'pfund', 'haushalt']) w[k] = runde1(w[k]);
}

/** Berichte über die anderen Länder brauchen gesteuerte Länder nicht; für Schritt B vorbereitet */
export function aufklaerung(s, land) {
  if (land === 'usa') return { q: 0.75, quelle: 'Botschaft Washington' };
  if (land === 'su') return { q: 0.65, quelle: 'Secret Intelligence Service' };
  return { q: 0.7, quelle: 'Foreign Office' };
}
