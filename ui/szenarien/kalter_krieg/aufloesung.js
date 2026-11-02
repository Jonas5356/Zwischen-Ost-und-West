// Für den Abschlussbericht: Was die vom Spiel gesteuerten Regierungen wirklich wollten –
// und was das gespielte Land zuletzt vermutet hat.
import { REGIERUNGEN as USA } from './usa.js';
import { REGIERUNGEN as SU } from './su.js';
import { REGIERUNGEN as FR } from './frankreich/regierungen.js';
import { REGIERUNGEN as BRD } from './brd/regierungen.js';

const LAENDER = [['usa', USA, 'Washington'], ['su', SU, 'Moskau'], ['frankreich', FR, 'Paris'], ['brd', BRD, 'Bonn']];

/** `wer`: wie das gespielte Land in den Sätzen heißt („Bonn“, „Paris“) */
export function aufloesung(s, wer) {
  const teile = [];
  const orte = [];
  for (const [land, R, ort] of LAENDER) {
    if (land === s.land) continue;
    const L = s.welt.laender[land];
    const E = s.einschaetzung?.[land];
    if (!L?.regierungen?.length) continue;
    const schaetzungen = [...(E?.frueher || []), ...(E ? [{ regime: E.regime, p: E.p }] : [])];
    let dabei = false;
    L.regierungen.forEach((r, i) => {
      if (!r.typ) return;
      const T = R[r.regime].typen[r.typ];
      const p = schaetzungen[i]?.regime === r.regime ? schaetzungen[i].p?.[r.typ] : undefined;
      const geschaetzt = p === undefined ? '' : ` ${wer} hielt das zuletzt für ${p >= 0.85 ? 'sehr wahrscheinlich' : p >= 0.65 ? 'wahrscheinlich' : p >= 0.35 ? 'möglich' : 'unwahrscheinlich'} (${Math.round(100 * p)} %).`;
      teile.push(`${ort}, ${R[r.regime].titel.replace(/ \(Fiktion\)/, '')} (ab ${String(r.ab).replace('.1', '/I').replace('.2', '/II')}): ${T.name}. ${T.beschreibung}${geschaetzt}`);
      dabei = true;
    });
    if (dabei) orte.push(ort);
  }
  if (!teile.length) return '';
  const liste = orte.length > 1 ? orte.slice(0, -1).join(', ') + ' und ' + orte[orte.length - 1] : orte[0];
  return `Was ${liste} wirklich wollten:\n` + teile.join('\n');
}
