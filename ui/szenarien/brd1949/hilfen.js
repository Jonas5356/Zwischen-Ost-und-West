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
import { zeitIndex } from '../../engine.js';
/** Steht zum Zeitpunkt z eine Bundestagswahl an? */
export const wahlIn = (s, z) => (s.wahlplan || []).some(x => zeitIndex(x) === zeitIndex(z));
export const hauptstadt = s => (s.f.hauptstadt_berlin ? 'Berlin' : 'Bonn');
