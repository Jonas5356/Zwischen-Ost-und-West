// Hilfsfunktionen für Texte über Frankreich – auch für die Inhalte anderer Länder
// (wer in Paris regiert, ist öffentlich; was die Regierung will, nicht).
import { zeitIndex } from '../../../engine.js';

/** Zustand Frankreichs aus einer beliebigen Landsicht */
const fr = s => s.welt.laender.frankreich;

/** Name des Regierungschefs in Paris (Ministerpräsident bzw. Premierminister) */
export const pariserChef = s => fr(s)?.regierungschef || 'der französische Ministerpräsident';
/** „Ministerpräsident Guy Mollet“, „Präsident de Gaulle“ – wer für Frankreich spricht */
export function pariserSpitze(s) {
  const L = fr(s);
  if (!L) return 'die französische Regierung';
  if (L.lager === 'de_gaulle') return L.republik === 5 ? 'Präsident de Gaulle' : 'General de Gaulle';
  if (L.lager === 'militaer') return L.regierungschef;
  return `Ministerpräsident ${L.regierungschef}`;
}
/** Regiert de Gaulle in Paris? */
export const deGaulleRegiert = s => fr(s)?.lager === 'de_gaulle';
export const pariserLager = s => fr(s)?.lager;

/** Französischer Außenminister – historisch nach Zeit, bei anderen Regierungen angepasst */
export function pariserAussen(s) {
  const L = fr(s);
  const z = zeitIndex(s.zeit);
  if (L?.lager === 'mendes') return 'Pierre Mendès France';
  if (L?.lager === 'volksfront') return 'Pierre Cot';
  if (L?.lager === 'militaer') return 'General Jouhaud';
  if (L?.lager === 'de_gaulle') return 'Maurice Couve de Murville';
  if (z <= zeitIndex(1952.2)) return 'Robert Schuman';
  if (z <= zeitIndex(1954.1)) return 'Georges Bidault';
  if (z <= zeitIndex(1955.2)) return 'Antoine Pinay';
  if (z <= zeitIndex(1958.1)) return 'Christian Pineau';
  return 'Maurice Couve de Murville';
}

/** Die Bundesrepublik aus französischer Sicht */
export const brd = s => s.andere('brd');
export const kanzler = s => brd(s).kanzler || 'der Bundeskanzler';
export const bonn = s => (brd(s).f.hauptstadt_berlin ? 'Berlin' : 'Bonn');
/** Ist die Bundesrepublik auf Westkurs (nicht neutral, nicht vereinigt)? */
export const bonnImWesten = s => !brd(s).f.neutral && !brd(s).f.vereinigt;
export const deutschland = s => (brd(s).f.vereinigt ? 'Deutschland' : 'die Bundesrepublik');
export const Deutschland = s => (brd(s).f.vereinigt ? 'Deutschland' : 'Die Bundesrepublik');
