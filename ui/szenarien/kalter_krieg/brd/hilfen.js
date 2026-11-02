// Kleine Hilfsfunktionen für Bedingungen in den Ereignissen

/** Westkurs: weder auf dem Weg zur neutralen Einheit noch schon vereinigt */
export const west = s => !s.f.neutral && !s.f.vereinigt;
export const geteilt = s => !s.f.vereinigt;
export const vereinigt = s => !!s.f.vereinigt;
export const imBuendnis = s => !!(s.f.nato || s.f.evg);
export const adenauer = s => s.kanzler === 'Adenauer';
export const regiertMit = p => s => s.regierung.includes(p);
export const land = s => (s.f.vereinigt ? 'Deutschland' : 'die Bundesrepublik');
export const Land = s => (s.f.vereinigt ? 'Deutschland' : 'Die Bundesrepublik');
export const kanzler = s => s.kanzler;
import { zeitIndex } from '../../../engine.js';
/** Steht zum Zeitpunkt z eine Bundestagswahl an? */
export const wahlIn = (s, z) => (s.wahlplan || []).some(x => zeitIndex(x) === zeitIndex(z));
export const hauptstadt = s => (s.f.hauptstadt_berlin ? 'Berlin' : 'Bonn');

// Regierungsparteien: gespielt wird die Bundesregierung, den Kanzler kann auch die SPD stellen
/** Stellt die Union den Kanzler? (Unionsminister wie Schäffer, Erhard, Strauß nur dann namentlich) */
export const unionRegiert = s => (s.kanzlerpartei || 'Union') === 'Union';
export const spdRegiert = s => s.kanzlerpartei === 'SPD';
/** Die eigene Partei des Kanzlers: „die Union“ / „die SPD“ */
export const partei = s => (spdRegiert(s) ? 'die SPD' : 'die Union');
export const Partei = s => (spdRegiert(s) ? 'Die SPD' : 'Die Union');
/** Die große Oppositionspartei (bzw. der große Partner in einer Großen Koalition) */
export const gegner = s => (spdRegiert(s) ? 'die Union' : 'die SPD');
export const Gegner = s => (spdRegiert(s) ? 'Die Union' : 'Die SPD');

// Wahlkampf einer SPD-geführten Regierung (für alle Wahljahre)
export const SPD_WAHLKAMPF = [
  { text: 'Sozialer Aufbau: Wohnungen, Renten, Lastenausgleich – „Sicherheit für alle“.',
    ergebnis: 'Die Kundgebungen sind voll, wo die Not am größten ist: in den Flüchtlingssiedlungen und Arbeitervierteln.',
    w: s => ({ ansehen: Math.max(1, Math.round(4 - (s.w.arbeitslosigkeit - 4) / 2)) }) },
  { text: 'Die Bilanz der Regierung: Wachstum und Vollbeschäftigung unter sozialdemokratischer Führung.',
    ergebnis: 'Die Regierung wirbt mit Zahlen. Wo die Wirtschaft läuft, verfängt es.',
    w: s => ({ ansehen: Math.max(0, Math.round(s.w.wachstum - 3)) }) },
  { text: s => (s.f.vereinigt ? 'Frieden zwischen den Blöcken – die SPD als Partei der Verständigung.' : 'Einheit vor Bündnis – die SPD als Partei der Wiedervereinigung.'), richtung: 'ost',
    ergebnis: s => (s.f.vereinigt ? 'Ein Wahlkampf für die Neutralität. Die Union warnt vor Abhängigkeit von Moskau, die Westmächte hören genau hin.' : 'Ein Wahlkampf gegen die Blockbildung. Die Union warnt vor Neutralismus, die Westmächte hören genau hin.'),
    w: s => ({ ansehen: Math.round(s.w.einheit / 10) + 1, usa: -2 }) },
];

// Wer regiert in Washington und Moskau? (Die Regierungen sind öffentlich, ihre Ziele nicht.)
import { REGIERUNGEN as USA } from '../usa.js';
import { REGIERUNGEN as SU, aussenminister } from '../su.js';
export const usaRegime = s => s.welt.laender.usa?.regime;
export const suRegime = s => s.welt.laender.su?.regime;
/** „Eisenhower“, „Kennedy“ … */
export const praesident = s => USA[usaRegime(s)]?.kurz || 'der Präsident';
export const praesidentVoll = s => USA[usaRegime(s)]?.name || 'der Präsident';
/** Amerikanischer Außenminister, falls bekannt (Acheson, Dulles, Rusk) */
export const usaAussen = s => USA[usaRegime(s)]?.aussen || null;
/** „Stalin“, „Chruschtschow“ … */
export const suChef = s => SU[suRegime(s)]?.kurz || 'Moskau';
export const suAussen = s => aussenminister(s.zeit, suRegime(s));
